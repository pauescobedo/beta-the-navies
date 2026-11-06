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

function renderNavyContent(content) {
  navyContent = structuredClone(content);
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
editContentButton.textContent = 'Editar contenido';
editContentButton.hidden = true;
dashboardBar?.append(editContentButton);

const contentEditor = document.createElement('dialog');
contentEditor.className = 'content-editor';
contentEditor.innerHTML = `
  <div class="content-editor-shell">
    <header class="content-editor-header">
      <div><p class="eyebrow"><span></span> THE NAVIES</p><h2>Editar contenido</h2><p>Gestiona fechas, repertorio y enlaces de Espacio Navy.</p></div>
      <button class="content-editor-close" type="button" aria-label="Cerrar">×</button>
    </header>
    <form class="content-editor-form">
      <section class="editor-section">
        <div class="editor-section-head"><div><span>01</span><h3>Fechas</h3><p>Ensayos, ensayos generales, extras y conciertos.</p></div><button type="button" data-editor-add="event">Añadir fecha</button></div>
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
      <footer class="content-editor-actions"><p class="content-editor-status" aria-live="polite"></p><button class="editor-cancel" type="button">Cancelar</button><button class="editor-save" type="submit">Guardar cambios</button></footer>
    </form>
  </div>`;
document.body.append(contentEditor);

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

function populateEditor() {
  if (!navyContent) return;
  const eventList = contentEditor.querySelector('[data-editor-list="events"]');
  const songList = contentEditor.querySelector('[data-editor-list="songs"]');
  const linkList = contentEditor.querySelector('[data-editor-list="links"]');
  eventList.replaceChildren(...navyContent.events.map(eventEditorRow));
  songList.replaceChildren(...navyContent.songs.map(songEditorRow));
  linkList.replaceChildren(...navyContent.links.map(linkEditorRow));
  editorStatus.textContent = '';
}

function editorContent() {
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
  return { events, songs, links };
}

function syncEditorAccess() {
  const isPau = localStorage.getItem('navies-member-session') === 'pauescobedo';
  editContentButton.hidden = !(isPau && contentSession());
  if (!isPau || !contentSession()) {
    if (contentEditor.open) contentEditor.close();
  }
}

editContentButton.addEventListener('click', async () => {
  if (!contentSession()) return syncEditorAccess();
  if (!navyContent) await loadNavyContent();
  if (!navyContent) {
    editorStatus.textContent = 'No se ha podido cargar el contenido.';
    return;
  }
  populateEditor();
  contentEditor.showModal();
  requestAnimationFrame(() => contentEditor.classList.add('is-visible'));
});

function closeContentEditor() {
  contentEditor.classList.remove('is-visible');
  window.setTimeout(() => { if (contentEditor.open) contentEditor.close(); }, 260);
}

contentEditor.querySelector('.content-editor-close').addEventListener('click', closeContentEditor);
contentEditor.querySelector('.editor-cancel').addEventListener('click', closeContentEditor);
contentEditor.addEventListener('click', (event) => { if (event.target === contentEditor) closeContentEditor(); });

contentEditor.addEventListener('click', (event) => {
  const add = event.target.closest('[data-editor-add]');
  if (add) {
    const kind = add.dataset.editorAdd;
    const list = contentEditor.querySelector(`[data-editor-list="${kind}s"]`);
    list.append(kind === 'event' ? eventEditorRow({ type:'rehearsal', name:'Ensayo', date:localToday(), time:'17:30', location:'' }) : kind === 'song' ? songEditorRow() : linkEditorRow());
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
    window.setTimeout(closeContentEditor, 650);
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

function applyPortalState(isLoggedIn) {
  loginPanel.hidden = isLoggedIn;
  dashboard.hidden = !isLoggedIn;
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
