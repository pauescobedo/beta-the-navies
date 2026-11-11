const encoder = new TextEncoder();
const attempts = new Map();

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
    if (!allowed.includes(origin)) return json({ error:'origin_not_allowed' }, 403, origin, allowed);
    if (request.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(origin) });
    if (!env.TOTP_SECRET || !env.SESSION_SECRET) return json({ error:'service_not_configured' }, 503, origin, allowed);

    const url = new URL(request.url);
    if (url.pathname === '/content' && request.method === 'GET') {
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      const content = await readContent(env.DB);
      return json({ content }, 200, origin, allowed);
    }

    if (url.pathname === '/content' && request.method === 'PUT') {
      const session = await verifySession(bearer(request), env.SESSION_SECRET);
      if (!session) return json({ error:'invalid_session' }, 401, origin, allowed);
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      const body = await request.json().catch(() => ({}));
      const content = validateContent(body.content);
      if (!content) return json({ error:'invalid_content' }, 400, origin, allowed);
      await writeContent(env.DB, content);
      return json({ content }, 200, origin, allowed);
    }

    if (url.pathname === '/member-login' && request.method === 'POST') {
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      if (!allowAttempt(`member:${ip}`)) return json({ error:'too_many_attempts' }, 429, origin, allowed);
      const body = await request.json().catch(() => ({}));
      const username = normaliseUsername(body.username);
      await ensureUsersTable(env.DB);
      const user = await env.DB.prepare('SELECT username, display_name, password_hash, salt, access FROM navy_users WHERE username = ?').bind(username).first();
      if (!user || !(await verifyPassword(String(body.password || ''), user.salt, user.password_hash))) return json({ error:'invalid_credentials' }, 401, origin, allowed);
      attempts.delete(`member:${ip}`);
      return issueMemberSession(env.SESSION_SECRET, { username:user.username, name:user.display_name, access:JSON.parse(user.access || '[]') }, origin);
    }

    if (url.pathname === '/musync' && ['GET','PUT'].includes(request.method)) {
      const session = await verifyMemberSession(bearer(request), env.SESSION_SECRET);
      if (!session) return json({ error:'invalid_member_session' }, 401, origin, allowed);
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      await ensureMusyncTable(env.DB);
      if (request.method === 'GET') {
        const row = await env.DB.prepare('SELECT data FROM musync_user_state WHERE username = ?').bind(session.username).first();
        const state = row ? validateMusyncState(JSON.parse(row.data || '{}')) : null;
        return json({ state:state || emptyMusyncState(), exists:Boolean(row) }, 200, origin, allowed);
      }
      const body = await request.json().catch(() => ({}));
      const state = validateMusyncState(body.state);
      if (!state) return json({ error:'invalid_musync_state' }, 400, origin, allowed);
      await env.DB.prepare('INSERT INTO musync_user_state (username, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(username) DO UPDATE SET data=excluded.data, updated_at=excluded.updated_at').bind(session.username, JSON.stringify(state), new Date().toISOString()).run();
      return json({ state }, 200, origin, allowed);
    }

    if (url.pathname === '/users' && request.method === 'GET') {
      const session = await verifySession(bearer(request), env.SESSION_SECRET);
      if (!session) return json({ error:'invalid_session' }, 401, origin, allowed);
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      await ensureUsersTable(env.DB);
      const result = await env.DB.prepare('SELECT username, display_name, access, sort_order FROM navy_users ORDER BY sort_order, username').all();
      return json({ users:(result.results || []).map((user) => ({ username:user.username, name:user.display_name, access:JSON.parse(user.access || '[]'), sortOrder:user.sort_order })) }, 200, origin, allowed);
    }

    if (url.pathname === '/users' && request.method === 'PUT') {
      const session = await verifySession(bearer(request), env.SESSION_SECRET);
      if (!session) return json({ error:'invalid_session' }, 401, origin, allowed);
      if (!env.DB) return json({ error:'database_not_configured' }, 503, origin, allowed);
      const body = await request.json().catch(() => ({}));
      const users = validateUsers(body.users);
      if (!users) return json({ error:'invalid_users' }, 400, origin, allowed);
      await ensureUsersTable(env.DB);
      const existing = await env.DB.prepare('SELECT username, password_hash, salt FROM navy_users').all();
      const previous = new Map((existing.results || []).map((user) => [user.username, user]));
      const statements = [];
      for (const [index, user] of users.entries()) {
        const stored = previous.get(user.username);
        if (!stored && !user.password) return json({ error:'password_required' }, 400, origin, allowed);
        const salt = user.password ? crypto.randomUUID() : stored.salt;
        const passwordHash = user.password ? await hashPassword(user.password, salt) : stored.password_hash;
        statements.push(env.DB.prepare('INSERT INTO navy_users (username, display_name, password_hash, salt, access, sort_order) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(username) DO UPDATE SET display_name=excluded.display_name, password_hash=excluded.password_hash, salt=excluded.salt, access=excluded.access, sort_order=excluded.sort_order').bind(user.username, user.name, passwordHash, salt, JSON.stringify(user.access), index));
      }
      const retained = users.map((user) => user.username);
      if (retained.length) statements.push(env.DB.prepare(`DELETE FROM navy_users WHERE username NOT IN (${retained.map(() => '?').join(',')})`).bind(...retained));
      else statements.push(env.DB.prepare('DELETE FROM navy_users'));
      await env.DB.batch(statements);
      return json({ users:users.map(({ username, name, access }, sortOrder) => ({ username, name, access, sortOrder })) }, 200, origin, allowed);
    }

    if (request.method !== 'POST') return json({ error:'method_not_allowed' }, 405, origin, allowed);
    if (url.pathname === '/verify') {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      if (!allowAttempt(ip)) return json({ error:'too_many_attempts' }, 429, origin, allowed);
      const body = await request.json().catch(() => ({}));
      const valid = await verifyTotp(String(body.code || ''), env.TOTP_SECRET);
      if (!valid) return json({ error:'invalid' }, 401, origin, allowed);
      attempts.delete(ip);
      return issueSession(env.SESSION_SECRET, origin, allowed, 603);
    }

    if (url.pathname === '/extend') {
      const token = bearer(request);
      const session = await verifySession(token, env.SESSION_SECRET);
      if (!session) return json({ error:'invalid_session' }, 401, origin, allowed);
      const remaining = session.exp - Math.floor(Date.now() / 1000);
      if (remaining > 120) return json({ error:'extension_not_available' }, 409, origin, allowed);
      return issueSession(env.SESSION_SECRET, origin, allowed);
    }

    return json({ error:'not_found' }, 404, origin, allowed);
  }
};

function cors(origin) {
  return {
    'Access-Control-Allow-Origin':origin,
    'Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type,Authorization',
    'Vary':'Origin'
  };
}

const initialUsers = [
  ['pauescobedo','Pau','080926',['the-navies','cor-band','strings']],
  ['marionaescobedo','Mariona','633220',['the-navies','cor-band']],
  ['paufermosel','Fermito','210598',['the-navies','cor-band']],
  ['carlesgonzalez','Carles','140909',['the-navies','cor-band','strings']],
  ['ainasalmeron','Aina','250513',['the-navies','cor-band']],
  ['candelagonzalez','Candela','navies2026',['the-navies']],
  ['emmatuabu','Emma','navies2026',['the-navies']],
  ['elsacuenca','Elsa','281111',['cor-band']],
  ['juliabel','Julia','150613',['strings']],
  ['corband','Cor-Band','cor2026',['the-navies']],
  ['conjuntcordes','Conjunt de Cordes','cordes2026',['strings']]
];

async function ensureUsersTable(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS navy_users (username TEXT PRIMARY KEY, display_name TEXT NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, access TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 999)').run();
  const columns = await db.prepare('PRAGMA table_info(navy_users)').all();
  if (!(columns.results || []).some((column) => column.name === 'sort_order')) {
    await db.prepare('ALTER TABLE navy_users ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 999').run();
  }
  const count = await db.prepare('SELECT COUNT(*) AS total FROM navy_users').first();
  if (Number(count?.total || 0) > 0) {
    const statements = [
      db.prepare('UPDATE navy_users SET display_name = ? WHERE username = ?').bind('Emma', 'emmatuabu'),
      db.prepare('UPDATE navy_users SET display_name = ? WHERE username = ?').bind('Conjunt de Cordes', 'conjuntcordes')
    ];
    const orderState = await db.prepare('SELECT MIN(sort_order) AS first_order, MAX(sort_order) AS last_order FROM navy_users').first();
    if (Number(orderState?.first_order) === 999 && Number(orderState?.last_order) === 999) {
      const preferredOrder = ['pauescobedo','marionaescobedo','paufermosel','carlesgonzalez','ainasalmeron','candelagonzalez','emmatuabu','elsacuenca','juliabel','corband','conjuntcordes'];
      preferredOrder.forEach((username, index) => statements.push(db.prepare('UPDATE navy_users SET sort_order = ? WHERE username = ?').bind(index, username)));
    }
    await db.batch(statements);
    return;
  }
  const statements = [];
  const preferredOrder = ['pauescobedo','marionaescobedo','paufermosel','carlesgonzalez','ainasalmeron','candelagonzalez','emmatuabu','elsacuenca','juliabel','corband','conjuntcordes'];
  for (const [username, name, password, access] of initialUsers) {
    const salt = crypto.randomUUID();
    statements.push(db.prepare('INSERT INTO navy_users (username, display_name, password_hash, salt, access, sort_order) VALUES (?, ?, ?, ?, ?, ?)').bind(username, name, await hashPassword(password, salt), salt, JSON.stringify(access), preferredOrder.indexOf(username)));
  }
  await db.batch(statements);
}

function normaliseUsername(value) { return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40); }
function validateUsers(value) {
  if (!Array.isArray(value) || value.length > 100) return null;
  const allowedAccess = new Set(['the-navies','cor-band','strings']);
  const seen = new Set();
  const users = [];
  for (const raw of value) {
    const username = normaliseUsername(raw.username);
    const name = String(raw.name || '').trim().slice(0, 80);
    const password = String(raw.password || '').slice(0, 100);
    const access = [...new Set(Array.isArray(raw.access) ? raw.access.filter((item) => allowedAccess.has(item)) : [])];
    if (!username || !name || seen.has(username) || (password && password.length < 4)) return null;
    seen.add(username);
    users.push({ username, name, password, access });
  }
  return users;
}

async function hashPassword(password, salt) {
  return base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(`${salt}:${password}`))));
}
async function verifyPassword(password, salt, expected) { return safeEqual(await hashPassword(password, salt), expected); }

async function issueMemberSession(secret, user, origin) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { scope:'navies-member', ...user, iat:now, exp:now + 2592000 };
  const encoded = base64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(encoded, secret);
  return json({ token:`${encoded}.${signature}`, member:{ username:user.username, name:user.name, access:user.access }, expiresAt:payload.exp * 1000 }, 200, origin);
}

const defaultContent = {
  home:{
    settings:{ defaultSeason:'autumn', initialPlayback:'random', initialSongId:'', countdownEnabled:true, initialVolume:'medium', fallbackLanguage:'es', faviconMode:'dynamic' },
    live:{ title:'Estamos afinando la pantalla.', description:'Próximamente publicaremos aquí los primeros vídeos de The Navies.' },
    texts:{
      heroIntro:'Somos siete músicos jóvenes unidos por las ganas de tocar en directo y llevar clásicos del rock y del pop a cada escenario con energía y personalidad.',
      soundBody:'Una mezcla de clásicos del rock, grandes canciones pop y esos himnos que todo el mundo reconoce desde el primer acorde. Siete músicos, voces compartidas y un directo pensado para conectar, cantar y disfrutar juntos.',
      bandBody:'Somos siete jóvenes apasionados por la música, unidos por las ganas de tocar, aprender y disfrutar juntos sobre el escenario. Cada voz y cada instrumento forman parte de The Navies con el mismo peso.'
    },
    concerts:[
      { id:'sagrera-2026', name:'Fiestas de La Sagrera', day:'21', month:'11', year:'2026', time:'14:00', location:'Plaza Masadas', status:'next' },
      { id:'christmas-2026', name:'Concierto de Navidad', day:'', month:'12', year:'2026', time:'', location:'', status:'soon' },
      { id:'spring-2027', name:'Fiestas de la Primavera', day:'', month:'04', year:'2027', time:'', location:'Plaza Masadas', status:'soon' },
      { id:'end-course-2027', name:'Concierto de Final de Curso', day:'', month:'06', year:'2027', time:'', location:'', status:'soon' }
    ],
    members:[
      { id:'vocals', instrument:'Voces', title:'Aina, Candela y Mariona Escobedo', dialogTitle:'Aina, Candela y Mariona Escobedo', summary:'Tres voces para melodías, armonías y coros.', bio:'Aina, Candela González y Mariona Escobedo comparten melodías, armonías y coros para dar fuerza y emoción a cada canción.', socialLabel:'Instagram Aina', socialUrl:'', socialLabel2:'Instagram Candela', socialUrl2:'', socialLabel3:'Instagram Mariona', socialUrl3:'' },
      { id:'bass', instrument:'Bajo', title:'Emma', dialogTitle:'Emma', summary:'La base grave que une ritmo y armonía.', bio:'Emma Tubau sostiene la base grave y conecta el ritmo con la armonía.', socialLabel:'', socialUrl:'', socialLabel2:'', socialUrl2:'', socialLabel3:'', socialUrl3:'' },
      { id:'guitar', instrument:'Guitarra', title:'Carles', dialogTitle:'Carles', summary:'Riffs, acordes y el carácter rock del grupo.', bio:'Carles aporta riffs, acordes y el carácter rock del repertorio.', socialLabel:'', socialUrl:'', socialLabel2:'', socialUrl2:'', socialLabel3:'', socialUrl3:'' },
      { id:'keys', instrument:'Teclados', title:'Pau Fermosel', dialogTitle:'Pau Fermosel', summary:'Pianos, sintetizadores y capas que amplían el sonido.', bio:'Pau Fermosel aporta pianos, sintetizadores y arreglos que amplían el sonido.', socialLabel:'', socialUrl:'', socialLabel2:'', socialUrl2:'', socialLabel3:'', socialUrl3:'' },
      { id:'drums', instrument:'Batería', title:'Pau Escobedo', dialogTitle:'Pau Escobedo', summary:'El pulso que mueve la energía y mantiene unida a la banda.', bio:'Pau Escobedo marca el pulso, mueve la energía y mantiene unida a la banda desde la batería.', socialLabel:'Instagram Pau', socialUrl:'https://instagram.com/_pauescobedo', socialLabel2:'', socialUrl2:'', socialLabel3:'', socialUrl3:'' }
    ],
    socials:[
      { id:'instagram', label:'Instagram', url:'https://instagram.com/thenaviesgroup' },
      { id:'youtube', label:'YouTube', url:'https://youtube.com/@TheNavies' }
    ]
  },
  events:[
    { id:'rehearsal-2026-10-16', type:'rehearsal', name:'Ensayo', date:'2026-10-16', time:'17:30', location:'' },
    { id:'rehearsal-2026-10-23', type:'rehearsal', name:'Ensayo', date:'2026-10-23', time:'17:30', location:'' },
    { id:'rehearsal-2026-11-06', type:'rehearsal', name:'Ensayo', date:'2026-11-06', time:'17:30', location:'' },
    { id:'extra-2026-11-07', type:'extra', name:'Ensayo Extra', date:'2026-11-07', time:'18:00', location:'' },
    { id:'rehearsal-2026-11-13', type:'rehearsal', name:'Ensayo', date:'2026-11-13', time:'17:30–19:30', location:'BCN Fusió Sant Andreu' },
    { id:'extra-2026-11-14', type:'extra', name:'Ensayo Extra', date:'2026-11-14', time:'18:00–20:00', location:'BCN Fusió La Sagrera' },
    { id:'general-2026-11-20', type:'general', name:'Ensayo General', date:'2026-11-20', time:'17:30–19:30', location:'BCN Fusió Sant Andreu' },
    { id:'concert-2026-11-21', type:'concert', name:'Fiestas de La Sagrera 2026', date:'2026-11-21', time:'14:00', location:'Plaza Masadas' }
  ],
  ensembles:{
    'cor-band':{ events:[
      { id:'cor-band-2026-11-13', type:'rehearsal', name:'Ensayo', date:'2026-11-13', time:'19:30–21:30', location:'BCN Fusió Sant Andreu' },
      { id:'cor-band-2026-11-20', type:'general', name:'Ensayo General', date:'2026-11-20', time:'19:30–21:30', location:'BCN Fusió Sant Andreu' },
      { id:'cor-band-concert-2026-11-21', type:'concert', name:'Fiestas de La Sagrera 2026', date:'2026-11-21', time:'13:30', location:'Plaza Masadas' }
    ], links:[]},
    strings:{ events:[
      { id:'strings-2026-11-18', type:'rehearsal', name:'Ensayo', date:'2026-11-18', time:'20:00–20:30', location:'BCN Fusió La Sagrera' },
      { id:'strings-concert-2026-11-21', type:'concert', name:'Fiestas de La Sagrera 2026', date:'2026-11-21', time:'13:20', location:'Plaza Masadas' }
    ], links:[]}
  },
  songs:[
    { id:'shake-it-off', title:'Shake It Off' },
    { id:'baby-one-more-time', title:'...Baby One More Time' },
    { id:'sweet-caroline', title:'Sweet Caroline' },
    { id:'dont-look-back-in-anger', title:"Don't Look Back In Anger" },
    { id:'the-final-countdown', title:'The Final Countdown' },
    { id:'have-you-ever-seen-the-rain', title:'Have You Ever Seen The Rain?' },
    { id:'the-final-countdown-reprise', title:'The Final Countdown (Reprise)' }
  ],
  links:[
    { id:'spotify', label:'Spotify', url:'https://open.spotify.com/playlist/0F8ZtaIzrmK33IEhRjW0fM?si=4d1c34d31f3f42ac' },
    { id:'apple-music', label:'Apple Music', url:'https://music.apple.com/es/playlist/the-navies/pl.u-2aoqXWqcGvmXxRl' }
  ]
};

async function ensureContentTable(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)').run();
}

async function readContent(db) {
  await ensureContentTable(db);
  const row = await db.prepare('SELECT data FROM site_content WHERE id = ?').bind('navy-space').first();
  if (!row) {
    await writeContent(db, defaultContent);
    return defaultContent;
  }
  try { return validateContent(JSON.parse(row.data)) || defaultContent; }
  catch (_) { return defaultContent; }
}

async function writeContent(db, content) {
  await ensureContentTable(db);
  await db.prepare('INSERT INTO site_content (id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at')
    .bind('navy-space', JSON.stringify(content), new Date().toISOString()).run();
}

function validateContent(value) {
  if (!value || !Array.isArray(value.events) || !Array.isArray(value.songs) || !Array.isArray(value.links)) return null;
  if (value.events.length > 100 || value.songs.length > 100 || value.links.length > 30) return null;
  const text = (entry, key, max = 160) => typeof entry?.[key] === 'string' && entry[key].length <= max;
  const eventListValid = (events) => Array.isArray(events) && events.length <= 100 && events.every((entry) => text(entry, 'id', 80) && ['rehearsal','extra','general','concert','recording','other'].includes(entry.type) && text(entry, 'name') && (entry.type !== 'other' || entry.name.trim().length > 0) && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && text(entry, 'time', 20) && (!entry.time || /^\d{2}:\d{2}(–\d{2}:\d{2})?$/.test(entry.time)) && text(entry, 'location'));
  const validEvents = eventListValid(value.events);
  const suppliedEnsembles = value.ensembles || defaultContent.ensembles;
  const linksValid = (links) => Array.isArray(links) && links.length <= 30 && links.every((entry) => text(entry, 'id', 80) && text(entry, 'label') && text(entry, 'url', 500) && /^https:\/\//.test(entry.url));
  const validEnsembles = eventListValid(suppliedEnsembles?.['cor-band']?.events) && eventListValid(suppliedEnsembles?.strings?.events) && linksValid(suppliedEnsembles?.['cor-band']?.links || []) && linksValid(suppliedEnsembles?.strings?.links || []);
  const validSongs = value.songs.every((entry) => text(entry, 'id', 80) && /^[a-z0-9-]+$/.test(entry.id) && text(entry, 'title'));
  const validLinks = value.links.every((entry) => text(entry, 'id', 80) && text(entry, 'label') && text(entry, 'url', 500) && /^https:\/\//.test(entry.url));
  if (!validEvents || !validEnsembles || !validSongs || !validLinks) return null;
  const rawHome = value.home || {};
  const suppliedHome = {
    settings:{ ...defaultContent.home.settings, ...(rawHome.settings || {}) },
    live:{ ...defaultContent.home.live, ...(rawHome.live || {}) },
    texts:{ ...defaultContent.home.texts, ...(rawHome.texts || {}) },
    concerts:Array.isArray(rawHome.concerts) ? rawHome.concerts : defaultContent.home.concerts,
    members:(Array.isArray(rawHome.members) ? rawHome.members : defaultContent.home.members).map((member) => {
      const merged = { ...(defaultContent.home.members.find((item) => item.id === member.id) || {}), ...member };
      const oldTitles = { vocals:['Tres cantantes','Aina, Candela y Mariona','Aina, Candela González y Mariona Escobedo'], bass:['Una bajista','Emma','Emma Tubau'], guitar:['Un guitarrista'] };
      const newTitles = { vocals:'Aina, Candela y Mariona Escobedo', bass:'Emma', guitar:'Carles' };
      const oldDialogTitles = { vocals:['Aina, Candela y Mariona','Aina, Candela González y Mariona Escobedo'], bass:['Emma','Emma Tubau'] };
      const oldBios = { vocals:['Aina, Candela y Mariona comparten melodías, armonías y coros para dar fuerza y emoción a cada canción.'], bass:['La bajista sostiene la base grave y conecta el ritmo con la armonía.','Emma sostiene la base grave y conecta el ritmo con la armonía.'], guitar:['El guitarrista aporta riffs, acordes y el carácter rock del repertorio.'] };
      const newBios = { vocals:'Aina, Candela González y Mariona Escobedo comparten melodías, armonías y coros para dar fuerza y emoción a cada canción.', bass:'Emma Tubau sostiene la base grave y conecta el ritmo con la armonía.', guitar:'Carles aporta riffs, acordes y el carácter rock del repertorio.' };
      if (oldTitles[merged.id]?.includes(merged.title)) merged.title = newTitles[merged.id];
      if (oldDialogTitles[merged.id]?.includes(merged.dialogTitle)) merged.dialogTitle = newTitles[merged.id];
      if (oldBios[merged.id]?.includes(merged.bio)) merged.bio = newBios[merged.id];
      return merged;
    }),
    socials:Array.isArray(rawHome.socials) ? rawHome.socials : defaultContent.home.socials
  };
  const validSettings = ['spring','summer','autumn','winter'].includes(suppliedHome.settings.defaultSeason)
    && ['random','custom'].includes(suppliedHome.settings.initialPlayback)
    && typeof suppliedHome.settings.initialSongId === 'string'
    && suppliedHome.settings.initialSongId.length <= 80
    && (suppliedHome.settings.initialPlayback !== 'custom' || defaultContent.songs.some((song) => song.id === suppliedHome.settings.initialSongId))
    && typeof suppliedHome.settings.countdownEnabled === 'boolean'
    && ['low','medium','high'].includes(suppliedHome.settings.initialVolume)
    && ['ca','es','en','fr','it'].includes(suppliedHome.settings.fallbackLanguage)
    && ['dynamic','static'].includes(suppliedHome.settings.faviconMode);
  const validLive = ['title','description'].every((key) => text(suppliedHome.live, key, 800));
  const validTexts = suppliedHome.texts && ['heroIntro','soundBody','bandBody'].every((key) => text(suppliedHome.texts, key, 800));
  const validConcerts = Array.isArray(suppliedHome.concerts) && suppliedHome.concerts.length <= 30 && suppliedHome.concerts.every((entry) => text(entry, 'id', 80) && text(entry, 'name') && text(entry, 'day', 2) && (!entry.day || /^(0?[1-9]|[12]\d|3[01])$/.test(entry.day)) && /^(0[1-9]|1[0-2])$/.test(entry.month) && /^\d{4}$/.test(entry.year) && text(entry, 'time', 5) && (!entry.time || /^\d{2}:\d{2}$/.test(entry.time)) && text(entry, 'location') && ['next','soon'].includes(entry.status));
  const validMembers = Array.isArray(suppliedHome.members) && suppliedHome.members.length <= 20 && suppliedHome.members.every((entry) => text(entry, 'id', 80) && text(entry, 'instrument') && text(entry, 'title') && text(entry, 'dialogTitle') && text(entry, 'summary', 300) && text(entry, 'bio', 800) && ['socialLabel','socialLabel2','socialLabel3'].every((key) => text(entry, key)) && ['socialUrl','socialUrl2','socialUrl3'].every((key) => text(entry, key, 500) && (!entry[key] || /^https:\/\//.test(entry[key]))));
  const validSocials = Array.isArray(suppliedHome.socials) && suppliedHome.socials.length <= 20 && suppliedHome.socials.every((entry) => text(entry, 'id', 80) && text(entry, 'label') && text(entry, 'url', 500) && /^https:\/\//.test(entry.url));
  if (!validSettings || !validLive || !validTexts || !validConcerts || !validMembers || !validSocials) return null;
  return {
    home:{
      settings:{ defaultSeason:suppliedHome.settings.defaultSeason, initialPlayback:suppliedHome.settings.initialPlayback, initialSongId:suppliedHome.settings.initialSongId, countdownEnabled:suppliedHome.settings.countdownEnabled, initialVolume:suppliedHome.settings.initialVolume, fallbackLanguage:suppliedHome.settings.fallbackLanguage, faviconMode:suppliedHome.settings.faviconMode },
      live:{ title:suppliedHome.live.title, description:suppliedHome.live.description },
      texts:{ heroIntro:suppliedHome.texts.heroIntro, soundBody:suppliedHome.texts.soundBody, bandBody:suppliedHome.texts.bandBody },
      concerts:suppliedHome.concerts.map(({ id, name, day, month, year, time, location, status }) => ({ id, name, day, month, year, time, location, status })),
      members:suppliedHome.members.map(({ id, instrument, title, dialogTitle, summary, bio, socialLabel, socialUrl, socialLabel2, socialUrl2, socialLabel3, socialUrl3 }) => ({ id, instrument, title, dialogTitle, summary, bio, socialLabel, socialUrl, socialLabel2, socialUrl2, socialLabel3, socialUrl3 })),
      socials:suppliedHome.socials.map(({ id, label, url }) => ({ id, label, url }))
    },
    events:value.events.map(({ id, type, name, date, time, location }) => ({ id, type, name, date, time, location })),
    ensembles:{
      'cor-band':{ events:suppliedEnsembles['cor-band'].events.map(({ id, type, name, date, time, location }) => ({ id, type, name, date, time, location })), links:(suppliedEnsembles['cor-band'].links || []).filter((link) => link.id !== 'cor-band-drive').map(({ id, label, url }) => ({ id, label, url })) },
      strings:{ events:suppliedEnsembles.strings.events.map(({ id, type, name, date, time, location }) => ({ id, type, name, date, time, location })), links:(suppliedEnsembles.strings.links || []).map(({ id, label, url }) => ({ id, label, url })) }
    },
    songs:value.songs.map(({ id, title }) => ({ id, title })),
    links:value.links.filter((link) => link.id !== 'drive').map(({ id, label, url }) => ({ id, label, url }))
  };
}

function json(value, status, origin) {
  return new Response(JSON.stringify(value), { status, headers:{ ...cors(origin), 'Content-Type':'application/json', 'Cache-Control':'no-store' } });
}

function allowAttempt(key) {
  const now = Date.now();
  const state = attempts.get(key);
  if (!state || now - state.startedAt > 300000) {
    attempts.set(key, { startedAt:now, count:1 });
    return true;
  }
  state.count += 1;
  return state.count <= 8;
}

function bearer(request) {
  const value = request.headers.get('Authorization') || '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

async function issueSession(secret, origin, allowed, ttlSeconds = 600) {
  const now = Math.floor(Date.now() / 1000);
  const payload = { scope:'navies-admin', iat:now, exp:now + ttlSeconds };
  const encoded = base64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(encoded, secret);
  return json({ token:`${encoded}.${signature}`, expiresAt:payload.exp * 1000 }, 200, origin);
}

async function verifySession(token, secret) {
  try {
    const [payload, signature] = String(token).split('.');
    if (!payload || !signature || !(await safeEqual(signature, await sign(payload, secret)))) return null;
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (parsed.scope !== 'navies-admin' || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch (_) { return null; }
}

async function verifyMemberSession(token, secret) {
  try {
    const [payload, signature] = String(token).split('.');
    if (!payload || !signature || !(await safeEqual(signature, await sign(payload, secret)))) return null;
    const parsed = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (parsed.scope !== 'navies-member' || !parsed.username || parsed.exp <= Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch (_) { return null; }
}

async function ensureMusyncTable(db) {
  await db.prepare('CREATE TABLE IF NOT EXISTS musync_user_state (username TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)').run();
}

function emptyMusyncState() { return { favorites:[], recent:[], queue:[], playlists:{}, volume:1, shuffle:false, repeat:'off', showChords:true, sort:'title' }; }
function validateMusyncState(value) {
  if (!value || typeof value !== 'object') return null;
  const indexes = (items, max=100) => Array.isArray(items) && items.length <= max && items.every((item) => Number.isInteger(item) && item >= 0 && item < 100);
  if (!indexes(value.favorites) || !indexes(value.recent) || !indexes(value.queue, 500)) return null;
  if (!value.playlists || typeof value.playlists !== 'object' || Array.isArray(value.playlists) || Object.keys(value.playlists).length > 100) return null;
  const playlists = {};
  for (const [name, items] of Object.entries(value.playlists)) {
    const cleanName = String(name).trim().slice(0, 36);
    if (!cleanName || cleanName !== name || !indexes(items, 500)) return null;
    playlists[cleanName] = [...new Set(items)];
  }
  const volume = Number(value.volume);
  const sort = ['title','artist','album'].includes(value.sort) ? value.sort : 'title';
  if (!Number.isFinite(volume) || volume < 0 || volume > 1 || typeof value.shuffle !== 'boolean' || !['off','list','one'].includes(value.repeat) || typeof value.showChords !== 'boolean') return null;
  return { favorites:[...new Set(value.favorites)], recent:[...new Set(value.recent)].slice(0,20), queue:value.queue, playlists, volume, shuffle:value.shuffle, repeat:value.repeat, showChords:value.showChords, sort };
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  return base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
}

async function verifyTotp(code, secret) {
  if (!/^\d{6}$/.test(code)) return false;
  const step = Math.floor(Date.now() / 30000);
  for (const offset of [-1, 0, 1]) {
    if (await totp(secret, step + offset) === code) return true;
  }
  return false;
}

async function totp(secret, counter) {
  const key = await crypto.subtle.importKey('raw', base32Decode(secret), { name:'HMAC', hash:'SHA-1' }, false, ['sign']);
  const message = new Uint8Array(8);
  let value = BigInt(counter);
  for (let index = 7; index >= 0; index -= 1) { message[index] = Number(value & 255n); value >>= 8n; }
  const hash = new Uint8Array(await crypto.subtle.sign('HMAC', key, message));
  const offset = hash[hash.length - 1] & 15;
  const binary = ((hash[offset] & 127) << 24) | (hash[offset + 1] << 16) | (hash[offset + 2] << 8) | hash[offset + 3];
  return String(binary % 1000000).padStart(6, '0');
}

function base32Decode(value) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = String(value).toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = '';
  for (const character of clean) bits += alphabet.indexOf(character).toString(2).padStart(5, '0');
  const bytes = [];
  for (let index = 0; index + 8 <= bits.length; index += 8) bytes.push(parseInt(bits.slice(index, index + 8), 2));
  return new Uint8Array(bytes);
}

function base64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function safeEqual(left, right) {
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}
