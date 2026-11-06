const loginPanel = document.querySelector('#login');
const dashboard = document.querySelector('#member-dashboard');
const spaceEntry = document.querySelector('.space-entry');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const memberName = document.querySelector('#member-name');
const dashboardBar = document.querySelector('.dashboard-bar');
const portalApiUrl = String(window.NAVIES_ADMIN_API_URL || '').replace(/\/$/, '');
const portalAdminSessionKey = 'navies-admin-session';

localStorage.removeItem('navies-demo-chat');
localStorage.removeItem('navies-demo-member');

const portalAssetPrefix = window.__naviesForcedLanguage ? '../' : '';
const scoreRoot = `${portalAssetPrefix}scores`;
const audioRoot = `${portalAssetPrefix}audios`;
const scoreLibrary = {
  'shake-it-off': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'baby-one-more-time': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'sweet-caroline': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'dont-look-back-in-anger': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'the-final-countdown': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'have-you-ever-seen-the-rain': [
    ['Letra', 'letra.pdf'], ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ],
  'the-final-countdown-reprise': [
    ['Acordes', 'acordes.pdf'], ['Teclado', 'teclado.pdf'], ['Bajo', 'bajo.pdf']
  ]
};

let navyContent = null;

function contentSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(portalAdminSessionKey));
    return session?.token && session.expiresAt > Date.now() ? session : null;
  } catch (_) { return null; }
}

function slugify(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || `item-${Date.now()}`;
}

function localToday() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'Europe/Madrid', year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function renderSetlist(songs) {
  const setlist = document.querySelector('.setlist');
  if (!setlist) return;
  setlist.replaceChildren();
  songs.forEach((song, index) => {
    const row = document.createElement('div');
    row.className = 'song-row';
    const number = document.createElement('span');
    number.className = 'song-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('strong');
    title.textContent = song.title;
    const materials = document.createElement('div');
    materials.className = 'material-tags';
    materials.dataset.scoreSong = song.id;
    row.append(number, title, materials);
    setlist.append(row);
  });
  decorateScoreSongs();
}

function renderEvents(events) {
  const list = document.querySelector('.event-list');
  if (!list) return;
  list.replaceChildren();
  const today = localToday();
  const locale = document.documentElement.lang || 'es';
  events.filter((event) => event.date >= today).sort((a, b) => `${a.date}T${a.time || '23:59'}`.localeCompare(`${b.date}T${b.time || '23:59'}`)).forEach((event) => {
    const item = document.createElement('div');
    item.className = `event-item${event.type === 'general' ? ' highlight' : ''}${event.type === 'concert' ? ' concert' : ''}${event.date === today ? ' is-today' : ''}`;
    const date = new Date(`${event.date}T12:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const month = new Intl.DateTimeFormat(locale, { month:'short' }).format(date).replace('.', '').toUpperCase();
    const time = document.createElement('time');
    time.dateTime = event.date;
    if (event.date === today) {
      const todayLabel = document.createElement('strong');
      todayLabel.textContent = ({ ca:'Avui', en:'Today', fr:"Aujourd’hui", it:'Oggi' })[locale.slice(0, 2)] || 'Hoy';
      const compactDate = document.createElement('small');
      compactDate.textContent = `${day} ${month}`;
      time.append(todayLabel, compactDate);
    } else {
      const dayNode = document.createElement('strong');
      dayNode.textContent = day;
      const monthNode = document.createElement('span');
      monthNode.textContent = month;
      time.append(dayNode, monthNode);
    }
    const details = document.createElement('div');
    const name = document.createElement('b');
    name.textContent = event.name;
    details.append(name);
    const meta = [event.time ? `${event.time}h` : '', event.location].filter(Boolean).join(' · ');
    if (meta) {
      const small = document.createElement('small');
      small.textContent = meta;
      details.append(small);
    }
    item.append(time, details);
    list.append(item);
  });
}

function renderLinks(links) {
  const list = document.querySelector('.useful-links-list');
  if (!list) return;
  list.replaceChildren();
  links.forEach((link) => {
    const anchor = document.createElement('a');
    anchor.href = link.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    const label = document.createElement('b');
    label.textContent = link.label;
    const arrow = document.createElement('i');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    anchor.append(label, arrow);
    list.append(anchor);
  });
}

const builtInConcertNames = {
  'sagrera-2026':{ es:'Fiestas de La Sagrera', ca:'Festes de La Sagrera', en:'La Sagrera Neighbourhood Festival', fr:'Fête de quartier de La Sagrera', it:'Festa di quartiere de La Sagrera' },
  'christmas-2026':{ es:'Concierto de Navidad', ca:'Concert de Nadal', en:'Christmas Concert', fr:'Concert de Noël', it:'Concerto di Natale' },
  'spring-2027':{ es:'Fiestas de la Primavera', ca:'Festes de la Primavera', en:'Spring Festival', fr:'Fête du Printemps', it:'Festa di Primavera' },
  'end-course-2027':{ es:'Concierto de Final de Curso', ca:'Concert de Final de Curs', en:'End-of-year Concert', fr:'Concert de fin d’année', it:'Concerto di fine anno' }
};

function concertName(concert) {
  const language = (document.documentElement.lang || 'es').slice(0, 2);
  const defaults = builtInConcertNames[concert.id];
  return defaults && concert.name === defaults.es ? (defaults[language] || defaults.es) : concert.name;
}

function renderHomeContent(home) {
  if (!home) return;
  const language = (document.documentElement.lang || 'es').slice(0, 2);
  if (language === 'es') {
    const textTargets = { heroIntro:'.hero-intro', soundBody:'#sonido .sound-copy [data-i18n="soundBody"]', bandBody:'#banda .about-copy [data-i18n="bandBody"]' };
    Object.entries(textTargets).forEach(([key, selector]) => {
      const target = document.querySelector(selector);
      if (target && home.texts[key]) target.textContent = home.texts[key];
    });
    home.members.forEach((member) => {
      const card = document.querySelector(`[data-member="${member.id}"]`);
      if (!card) return;
      const instrument = card.querySelector('.instrument-word');
      const title = card.querySelector('h3');
      const summary = card.querySelector('p');
      if (instrument) instrument.textContent = member.instrument;
      if (title) title.textContent = member.title;
      if (summary) summary.textContent = member.summary;
    });
    window.naviesEditableMemberBios = Object.fromEntries(home.members.map((member) => [member.id, member.bio]));
  }
  const concerts = home.concerts || [];
  const featured = concerts[0];
  const featuredShow = document.querySelector('.featured-show');
  if (featured && featuredShow) {
    featuredShow.querySelector('.date-block strong').textContent = featured.day || '—';
    featuredShow.querySelector('.date-block span').innerHTML = `${monthLabel(featured.month, language)}<br>${featured.year}`;
    featuredShow.querySelector('.show-info h3').textContent = concertName(featured);
    const meta = [featured.time ? `${featured.time}h` : '', featured.location].filter(Boolean).join(' · ');
    featuredShow.querySelector('.show-info p').textContent = meta;
  }
  const list = document.querySelector('.show-list');
  if (list) {
    list.replaceChildren();
    concerts.slice(1).forEach((concert) => {
      const article = document.createElement('article');
      const time = document.createElement('time');
      const day = document.createElement('strong');
      day.textContent = concert.day || '—';
      const dateMeta = document.createElement('span');
      dateMeta.className = 'date-meta';
      const month = document.createElement('b');
      month.textContent = monthLabel(concert.month, language);
      const year = document.createElement('small');
      year.textContent = concert.year;
      dateMeta.append(month, year);
      time.append(day, dateMeta);
      const details = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = concertName(concert);
      details.append(title);
      const meta = [concert.time ? `${concert.time}h` : '', concert.location].filter(Boolean).join(' · ');
      if (meta) { const paragraph = document.createElement('p'); paragraph.textContent = meta; details.append(paragraph); }
      const status = document.createElement('span');
      status.textContent = ({ ca:'Pròximament', en:'Coming soon', fr:'Prochainement', it:'Prossimamente' })[language] || 'Próximamente';
      article.append(time, details, status);
      list.append(article);
    });
  }
}

function monthLabel(month, language = 'es') {
  const date = new Date(`2026-${month}-01T12:00:00`);
  return new Intl.DateTimeFormat(language, { month:'short' }).format(date).replace('.', '').toUpperCase();
}

function renderNavyContent(content) {
  navyContent = structuredClone(content);
  renderHomeContent(content.home);
  renderSetlist(content.songs);
  renderEvents(content.events);
  renderLinks(content.links);
}

async function loadNavyContent() {
  if (!portalApiUrl) return;
  try {
    const response = await fetch(`${portalApiUrl}/content`, { headers:{ Accept:'application/json' } });
    if (!response.ok) return;
    const result = await response.json();
    if (result.content) renderNavyContent(result.content);
  } catch (_) {
    /* El contenido incluido en el HTML permanece como respaldo. */
  }
}

function decorateScoreSongs() {
  document.querySelectorAll('[data-score-song]').forEach((container) => {
    container.replaceChildren();
    const song = container.dataset.scoreSong;
    const songTitle = container.closest('.song-row').querySelector('strong').textContent;
    (scoreLibrary[song] || []).forEach(([label, filename]) => {
      const source = `${scoreRoot}/${song}/${filename}`;
      const item = document.createElement('span');
      item.className = 'score-file';
      const link = document.createElement('a');
      link.className = 'score-open';
      link.href = source;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', `Abrir ${songTitle} · ${label}`);
      link.textContent = label;
      item.append(link);
      container.append(item);
    });
    const audioSource = `${audioRoot}/${song}.mp3`;
    const divider = document.createElement('span');
    divider.className = 'audio-divider';
    divider.setAttribute('aria-hidden', 'true');
    container.append(divider);
    const audioButton = document.createElement('button');
    audioButton.className = 'audio-open';
    audioButton.type = 'button';
    audioButton.dataset.audioSrc = audioSource;
    audioButton.dataset.audioTitle = songTitle;
    audioButton.setAttribute('aria-label', `Escuchar ${songTitle}`);
    audioButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7.4v9.2L17 12 9 7.4Z"></path></svg>';
    container.append(audioButton);
  });
}
decorateScoreSongs();

const audioDialog = document.querySelector('#audio-dialog');
const audioPlayer = document.querySelector('#audio-player');
const audioDialogTitle = document.querySelector('#audio-dialog-title');
const audioDialogDownload = document.querySelector('#audio-dialog-download');
let navyAudioYieldingToSiteMusic = false;
audioPlayer.addEventListener('play', () => window.naviesPauseSiteMusicForNavyAudio?.());
audioPlayer.addEventListener('pause', () => {
  if (!navyAudioYieldingToSiteMusic) window.naviesResumeSiteMusicAfterNavyAudio?.();
});
audioPlayer.addEventListener('ended', () => window.naviesResumeSiteMusicAfterNavyAudio?.());
window.naviesStopNavyAudioForSiteMusic = () => {
  if (audioPlayer.paused) return false;
  navyAudioYieldingToSiteMusic = true;
  audioPlayer.pause();
  window.setTimeout(() => { navyAudioYieldingToSiteMusic = false; }, 0);
  return true;
};
document.addEventListener('click', (event) => {
  const button = event.target.closest('.audio-open');
  if (!button) return;
  audioDialogTitle.textContent = button.dataset.audioTitle;
  audioPlayer.src = button.dataset.audioSrc;
  audioDialogDownload.href = button.dataset.audioSrc;
  audioDialogDownload.setAttribute('download', '');
  audioDialog.showModal();
});
function closeAudioDialog() {
  navyAudioYieldingToSiteMusic = false;
  audioPlayer.pause();
  window.naviesResumeSiteMusicAfterNavyAudio?.();
  audioPlayer.removeAttribute('src');
  audioPlayer.load();
  audioDialog.close();
}
document.querySelector('.audio-dialog-close').addEventListener('click', closeAudioDialog);
audioDialog.addEventListener('click', (event) => { if (event.target === audioDialog) closeAudioDialog(); });

const editContentButton = document.createElement('button');
editContentButton.className = 'content-editor-trigger';
editContentButton.type = 'button';
editContentButton.innerHTML = '<span aria-hidden="true">✦</span> Editar página';
editContentButton.hidden = true;
const adminToolbar = document.createElement('div');
adminToolbar.className = 'content-admin-toolbar';
adminToolbar.append(editContentButton);
dashboardBar?.after(adminToolbar);

const contentEditor = document.createElement('section');
contentEditor.className = 'content-editor';
contentEditor.hidden = true;
contentEditor.innerHTML = `
  <div class="content-editor-shell">
    <header class="content-editor-header">
      <div><p class="eyebrow"><span></span> THE NAVIES</p><h2>Editar página</h2><p>Gestiona el contenido publicado en Inicio y Espacio Navy.</p></div>
      <button class="content-editor-back" type="button" aria-label="Volver a Espacio Navy">←</button>
    </header>
    <form class="content-editor-form">
      <nav class="content-editor-tabs" aria-label="Secciones editables"><button type="button" data-editor-tab="home" aria-pressed="true">Inicio</button><button type="button" data-editor-tab="space" aria-pressed="false">Espacio Navy</button></nav>
      <div class="editor-page" data-editor-page="home">
      <section class="editor-section">
        <div class="editor-section-head"><div><span>01</span><h3>Textos principales</h3><p>Contenido en castellano, el idioma principal de la web.</p></div></div>
        <div class="editor-text-grid" data-editor-home-texts></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>02</span><h3>Conciertos</h3><p>El primero será el concierto destacado de Inicio.</p></div><button type="button" data-editor-add="concert">Añadir concierto</button></div>
        <div class="editor-list" data-editor-list="concerts"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>03</span><h3>Tarjetas de músicos</h3><p>Título, instrumento, descripción breve y texto ampliado.</p></div></div>
        <div class="editor-list" data-editor-list="members"></div>
      </section>
      </div>
      <div class="editor-page" data-editor-page="space" hidden>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>01</span><h3>Fechas internas</h3><p>Ensayos, ensayos generales, extras y conciertos.</p></div><button type="button" data-editor-add="event">Añadir fecha</button></div>
        <div class="editor-list" data-editor-list="events"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>02</span><h3>Repertorio</h3><p>El orden guardado será el que verá toda la banda.</p></div><button type="button" data-editor-add="song">Añadir canción</button></div>
        <div class="editor-list" data-editor-list="songs"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>03</span><h3>Enlaces útiles</h3><p>Accesos compartidos de la banda.</p></div><button type="button" data-editor-add="link">Añadir enlace</button></div>
        <div class="editor-list" data-editor-list="links"></div>
      </section>
      </div>
      <footer class="content-editor-actions"><p class="content-editor-status" aria-live="polite"></p><button class="editor-save" type="submit">Guardar cambios</button></footer>
    </form>
  </div>`;
document.querySelector('.space-shell').append(contentEditor);

const editorForm = contentEditor.querySelector('.content-editor-form');
const editorStatus = contentEditor.querySelector('.content-editor-status');

function field(label, name, value = '', type = 'text', attributes = {}) {
  const wrapper = document.createElement('label');
  const caption = document.createElement('span');
  caption.textContent = label;
  const input = document.createElement('input');
  input.name = name;
  input.type = type;
  input.value = value;
  Object.entries(attributes).forEach(([key, setting]) => input.setAttribute(key, setting));
  wrapper.append(caption, input);
  return wrapper;
}

function textAreaField(label, name, value = '', maxlength = 800) {
  const wrapper = document.createElement('label');
  const caption = document.createElement('span');
  caption.textContent = label;
  const input = document.createElement('textarea');
  input.name = name;
  input.value = value;
  input.maxLength = maxlength;
  input.rows = 3;
  input.required = true;
  wrapper.append(caption, input);
  return wrapper;
}

function rowActions(kind) {
  const actions = document.createElement('div');
  actions.className = 'editor-row-actions';
  if (kind !== 'event') {
    [['up', '↑', 'Subir'], ['down', '↓', 'Bajar']].forEach(([action, symbol, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.editorAction = action;
      button.textContent = symbol;
      button.setAttribute('aria-label', label);
      actions.append(button);
    });
  }
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.dataset.editorAction = 'remove';
  remove.className = 'editor-remove';
  remove.textContent = 'Eliminar';
  actions.append(remove);
  return actions;
}

function eventEditorRow(event = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-event-row';
  row.dataset.id = event.id || `event-${Date.now()}`;
  const typeLabel = document.createElement('label');
  typeLabel.innerHTML = '<span>Tipo</span>';
  const select = document.createElement('select');
  select.name = 'type';
  [['rehearsal','Ensayo'], ['extra','Ensayo extra'], ['general','Ensayo general'], ['concert','Concierto']].forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.selected = event.type === value;
    select.append(option);
  });
  typeLabel.append(select);
  row.append(typeLabel, field('Nombre', 'name', event.name, 'text', { maxlength:'160', required:'' }), field('Fecha', 'date', event.date, 'date', { required:'' }), field('Hora', 'time', event.time, 'time'), field('Lugar', 'location', event.location, 'text', { maxlength:'160' }), rowActions('event'));
  return row;
}

function songEditorRow(song = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-song-row';
  row.dataset.id = song.id || '';
  row.append(field('Canción', 'title', song.title, 'text', { maxlength:'160', required:'' }), rowActions('song'));
  return row;
}

function linkEditorRow(link = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-link-row';
  row.dataset.id = link.id || '';
  row.append(field('Nombre', 'label', link.label, 'text', { maxlength:'160', required:'' }), field('Dirección web', 'url', link.url, 'url', { maxlength:'500', required:'', placeholder:'https://…' }), rowActions('link'));
  return row;
}

function concertEditorRow(concert = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-concert-row';
  row.dataset.id = concert.id || '';
  const monthLabelElement = document.createElement('label');
  monthLabelElement.innerHTML = '<span>Mes</span>';
  const month = document.createElement('select');
  month.name = 'month';
  for (let index = 1; index <= 12; index += 1) {
    const value = String(index).padStart(2, '0');
    const option = document.createElement('option');
    option.value = value;
    option.textContent = monthLabel(value, 'es');
    option.selected = concert.month === value;
    month.append(option);
  }
  monthLabelElement.append(month);
  row.append(field('Nombre', 'name', concert.name, 'text', { maxlength:'160', required:'' }), field('Día (opcional)', 'day', concert.day, 'number', { min:'1', max:'31', inputmode:'numeric' }), monthLabelElement, field('Año', 'year', concert.year || String(new Date().getFullYear()), 'number', { min:'2026', max:'2100', required:'' }), field('Hora', 'time', concert.time, 'time'), field('Lugar', 'location', concert.location, 'text', { maxlength:'160' }), rowActions('concert'));
  return row;
}

function memberEditorRow(member = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-member-row';
  row.dataset.id = member.id || '';
  row.append(field('Instrumento', 'instrument', member.instrument, 'text', { maxlength:'160', required:'' }), field('Título', 'title', member.title, 'text', { maxlength:'160', required:'' }), textAreaField('Descripción breve', 'summary', member.summary, 300), textAreaField('Descripción ampliada', 'bio', member.bio, 800));
  return row;
}

function populateEditor() {
  if (!navyContent) return;
  const homeTexts = contentEditor.querySelector('[data-editor-home-texts]');
  const concertList = contentEditor.querySelector('[data-editor-list="concerts"]');
  const memberList = contentEditor.querySelector('[data-editor-list="members"]');
  const eventList = contentEditor.querySelector('[data-editor-list="events"]');
  const songList = contentEditor.querySelector('[data-editor-list="songs"]');
  const linkList = contentEditor.querySelector('[data-editor-list="links"]');
  homeTexts.replaceChildren(textAreaField('Presentación principal', 'heroIntro', navyContent.home.texts.heroIntro), textAreaField('Descripción del sonido', 'soundBody', navyContent.home.texts.soundBody), textAreaField('Presentación de la banda', 'bandBody', navyContent.home.texts.bandBody));
  concertList.replaceChildren(...navyContent.home.concerts.map(concertEditorRow));
  memberList.replaceChildren(...navyContent.home.members.map(memberEditorRow));
  eventList.replaceChildren(...navyContent.events.map(eventEditorRow));
  songList.replaceChildren(...navyContent.songs.map(songEditorRow));
  linkList.replaceChildren(...navyContent.links.map(linkEditorRow));
  editorStatus.textContent = '';
}

function editorContent() {
  const homeTexts = contentEditor.querySelector('[data-editor-home-texts]');
  const concerts = [...contentEditor.querySelectorAll('.editor-concert-row')].map((row, index) => ({
    id:row.dataset.id || `${slugify(row.querySelector('[name="name"]').value)}-${Date.now()}-${index}`,
    name:row.querySelector('[name="name"]').value.trim(),
    day:row.querySelector('[name="day"]').value ? String(Number(row.querySelector('[name="day"]').value)) : '',
    month:row.querySelector('[name="month"]').value,
    year:row.querySelector('[name="year"]').value,
    time:row.querySelector('[name="time"]').value,
    location:row.querySelector('[name="location"]').value.trim(),
    status:index === 0 ? 'next' : 'soon'
  }));
  const members = [...contentEditor.querySelectorAll('.editor-member-row')].map((row) => ({
    id:row.dataset.id,
    instrument:row.querySelector('[name="instrument"]').value.trim(),
    title:row.querySelector('[name="title"]').value.trim(),
    summary:row.querySelector('[name="summary"]').value.trim(),
    bio:row.querySelector('[name="bio"]').value.trim()
  }));
  const events = [...contentEditor.querySelectorAll('.editor-event-row')].map((row) => ({
    id:row.dataset.id || `event-${Date.now()}`,
    type:row.querySelector('[name="type"]').value,
    name:row.querySelector('[name="name"]').value.trim(),
    date:row.querySelector('[name="date"]').value,
    time:row.querySelector('[name="time"]').value,
    location:row.querySelector('[name="location"]').value.trim()
  }));
  const usedSongIds = new Set();
  const songs = [...contentEditor.querySelectorAll('.editor-song-row')].map((row, index) => {
    const title = row.querySelector('[name="title"]').value.trim();
    let id = row.dataset.id || slugify(title);
    while (usedSongIds.has(id)) id = `${slugify(title)}-${index + 1}`;
    usedSongIds.add(id);
    return { id, title };
  });
  const usedLinkIds = new Set();
  const links = [...contentEditor.querySelectorAll('.editor-link-row')].map((row, index) => {
    const label = row.querySelector('[name="label"]').value.trim();
    let id = row.dataset.id || slugify(label);
    while (usedLinkIds.has(id)) id = `${slugify(label)}-${index + 1}`;
    usedLinkIds.add(id);
    return { id, label, url:row.querySelector('[name="url"]').value.trim() };
  });
  return { home:{ texts:{ heroIntro:homeTexts.querySelector('[name="heroIntro"]').value.trim(), soundBody:homeTexts.querySelector('[name="soundBody"]').value.trim(), bandBody:homeTexts.querySelector('[name="bandBody"]').value.trim() }, concerts, members }, events, songs, links };
}

function syncEditorAccess() {
  const isPau = localStorage.getItem('navies-member-session') === 'pauescobedo';
  const canEdit = Boolean(isPau && contentSession());
  editContentButton.hidden = !canEdit;
  adminToolbar.hidden = !canEdit;
  if (!isPau || !contentSession()) closeContentEditor(true);
}

editContentButton.addEventListener('click', async () => {
  if (!contentSession()) return syncEditorAccess();
  if (!navyContent) await loadNavyContent();
  if (!navyContent) {
    editorStatus.textContent = 'No se ha podido cargar el contenido.';
    return;
  }
  populateEditor();
  contentEditorOpen = true;
  dashboard.hidden = true;
  contentEditor.hidden = false;
  window.scrollTo({ top:0, behavior:'smooth' });
  requestAnimationFrame(() => contentEditor.classList.add('is-visible'));
});

function closeContentEditor(immediate = false) {
  if (!contentEditorOpen && contentEditor.hidden) return;
  contentEditorOpen = false;
  contentEditor.classList.remove('is-visible');
  const finish = () => {
    contentEditor.hidden = true;
    if (localStorage.getItem('navies-member-session')) dashboard.hidden = false;
    window.scrollTo({ top:0, behavior:immediate ? 'instant' : 'smooth' });
  };
  if (immediate) finish();
  else window.setTimeout(finish, 260);
}

contentEditor.querySelector('.content-editor-back').addEventListener('click', () => closeContentEditor());

contentEditor.querySelectorAll('[data-editor-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    contentEditor.querySelectorAll('[data-editor-tab]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    contentEditor.querySelectorAll('[data-editor-page]').forEach((page) => { page.hidden = page.dataset.editorPage !== button.dataset.editorTab; });
  });
});

contentEditor.addEventListener('click', (event) => {
  const add = event.target.closest('[data-editor-add]');
  if (add) {
    const kind = add.dataset.editorAdd;
    const list = contentEditor.querySelector(`[data-editor-list="${kind}s"]`);
    const row = kind === 'event' ? eventEditorRow({ type:'rehearsal', name:'Ensayo', date:localToday(), time:'17:30', location:'' }) : kind === 'song' ? songEditorRow() : kind === 'concert' ? concertEditorRow({ name:'Nuevo concierto', day:'', month:'12', year:String(new Date().getFullYear()), time:'', location:'' }) : linkEditorRow();
    list.append(row);
    list.lastElementChild.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }
  const action = event.target.closest('[data-editor-action]');
  if (!action) return;
  const row = action.closest('.editor-row');
  if (action.dataset.editorAction === 'remove') {
    if (window.confirm('¿Seguro que quieres eliminar este elemento?')) row.remove();
  } else if (action.dataset.editorAction === 'up' && row.previousElementSibling) {
    row.parentNode.insertBefore(row, row.previousElementSibling);
  } else if (action.dataset.editorAction === 'down' && row.nextElementSibling) {
    row.parentNode.insertBefore(row.nextElementSibling, row);
  }
});

editorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const session = contentSession();
  if (!session) {
    editorStatus.textContent = 'La sesión de administración ha caducado.';
    syncEditorAccess();
    return;
  }
  const save = contentEditor.querySelector('.editor-save');
  save.disabled = true;
  editorStatus.textContent = 'Guardando…';
  try {
    const response = await fetch(`${portalApiUrl}/content`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.token}` },
      body:JSON.stringify({ content:editorContent() })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'save_failed');
    renderNavyContent(result.content);
    editorStatus.textContent = 'Cambios guardados.';
  } catch (error) {
    editorStatus.textContent = error.message === 'invalid_session' ? 'La sesión ha caducado. Vuelve a introducir el código.' : 'No se han podido guardar los cambios.';
  } finally {
    save.disabled = false;
  }
});

window.addEventListener('navies-admin-change', syncEditorAccess);
window.addEventListener('navies-auth-change', syncEditorAccess);
window.setInterval(syncEditorAccess, 1000);
loadNavyContent();

let portalReady = false;
let portalTransitionTimer;
let contentEditorOpen = false;

function applyPortalState(isLoggedIn) {
  loginPanel.hidden = isLoggedIn;
  dashboard.hidden = !isLoggedIn || contentEditorOpen;
  if (!isLoggedIn) contentEditor.hidden = true;
  document.querySelector('.space-shell').classList.toggle('is-authenticated', isLoggedIn);
}

function syncPortal() {
  const member = localStorage.getItem('navies-member-session');
  const isLoggedIn = ['pauescobedo', 'marionaescobedo', 'paufermosel', 'candelagonzalez', 'carlesgonzalez', 'ainasalmeron', 'emmatuabu'].includes(member);
  if (isLoggedIn) memberName.textContent = window.naviesMemberName(member);

  if (!portalReady) {
    applyPortalState(isLoggedIn);
    portalReady = true;
    return;
  }

  clearTimeout(portalTransitionTimer);
  const outgoing = isLoggedIn ? spaceEntry : dashboard;
  const incoming = isLoggedIn ? dashboard : spaceEntry;
  if (outgoing.hidden) {
    applyPortalState(isLoggedIn);
    return;
  }

  outgoing.classList.add('portal-leaving');
  portalTransitionTimer = setTimeout(() => {
    outgoing.classList.remove('portal-leaving');
    applyPortalState(isLoggedIn);
    incoming.classList.remove('portal-entering');
    void incoming.offsetWidth;
    incoming.classList.add('portal-entering');
    incoming.addEventListener('animationend', () => incoming.classList.remove('portal-entering'), { once:true });
  }, 210);
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  if (window.naviesLogin(data.get('username'), data.get('password'))) {
    loginError.textContent = '';
    event.currentTarget.reset();
    if (window.matchMedia('(max-width: 900px)').matches) {
      requestAnimationFrame(() => window.scrollTo({ top:0, left:0, behavior:'instant' }));
    }
  } else {
    loginError.textContent = 'Usuario o contraseña incorrectos.';
  }
});

window.addEventListener('navies-auth-change', syncPortal);
syncPortal();
