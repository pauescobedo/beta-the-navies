(() => {
  const language = document.documentElement.lang?.slice(0,2) || 'es';
  const copy = ({
    es:{ library:'Biblioteca', albums:'Álbumes', album:'The Navies', spaceBack:'Volver a Espacio Navy', search:'Buscar canciones', favorites:'Favoritos', recent:'Recientes', playlists:'Playlists', queue:'Cola', newList:'Nueva playlist', empty:'Todavía no hay canciones aquí.', play:'Reproducir', pause:'Pausar', previous:'Anterior', next:'Siguiente', volume:'Volumen', expand:'Ampliar reproductor', back:'Volver a la biblioteca', lyrics:'Letra y acordes', chords:'Mostrar acordes', resync:'Volver a sincronizar', noLyrics:'Estamos trabajando en la letra sincronizada de esta canción. ¡Pronto estará disponible!', addFavorite:'Añadir a favoritos', removeFavorite:'Quitar de favoritos', playNext:'Reproducir a continuación', addQueue:'Añadir al final de la cola', removeQueue:'Quitar de la cola', addList:'Añadir a una playlist', rename:'Renombrar', remove:'Eliminar', save:'Guardar', cancel:'Cancelar', listName:'Nombre de la playlist', shuffle:'Aleatorio', repeat:'Repetición', clearQueue:'Vaciar cola' },
    ca:{ library:'Biblioteca', albums:'Àlbums', album:'The Navies', spaceBack:'Tornar a Espai Navy', search:'Cercar cançons', favorites:'Preferides', recent:'Recents', playlists:'Llistes', queue:'Cua', newList:'Llista nova', empty:'Encara no hi ha cançons aquí.', play:'Reproduir', pause:'Pausa', previous:'Anterior', next:'Següent', volume:'Volum', expand:'Ampliar reproductor', back:'Tornar a la biblioteca', lyrics:'Lletra i acords', chords:'Mostrar acords', resync:'Tornar a sincronitzar', noLyrics:'Estem treballant en la lletra sincronitzada d’aquesta cançó. Aviat estarà disponible!', addFavorite:'Afegir a preferides', removeFavorite:'Treure de preferides', playNext:'Reproduir a continuació', addQueue:'Afegir al final de la cua', addList:'Afegir a una llista', rename:'Canviar el nom', remove:'Eliminar', save:'Desar', cancel:'Cancel·lar', listName:'Nom de la llista', shuffle:'Aleatori', repeat:'Repetició', clearQueue:'Buidar la cua' },
    en:{ library:'Library', albums:'Albums', album:'The Navies', spaceBack:'Back to Navy Space', search:'Search songs', favorites:'Favorites', recent:'Recently played', playlists:'Playlists', queue:'Queue', newList:'New playlist', empty:'There are no songs here yet.', play:'Play', pause:'Pause', previous:'Previous', next:'Next', volume:'Volume', expand:'Expand player', back:'Back to library', lyrics:'Lyrics and chords', chords:'Show chords', resync:'Resync', noLyrics:'We are working on the synced lyrics for this song. They will be available soon!', addFavorite:'Add to favorites', removeFavorite:'Remove from favorites', playNext:'Play next', addQueue:'Add to end of queue', addList:'Add to playlist', rename:'Rename', remove:'Delete', save:'Save', cancel:'Cancel', listName:'Playlist name', shuffle:'Shuffle', repeat:'Repeat', clearQueue:'Clear queue' },
    fr:{ library:'Bibliothèque', albums:'Albums', album:'The Navies', spaceBack:'Retour à l’Espace Navy', search:'Rechercher des chansons', favorites:'Favoris', recent:'Écoutés récemment', playlists:'Playlists', queue:'File', newList:'Nouvelle playlist', empty:'Il n’y a pas encore de chansons ici.', play:'Lecture', pause:'Pause', previous:'Précédent', next:'Suivant', volume:'Volume', expand:'Agrandir le lecteur', back:'Retour à la bibliothèque', lyrics:'Paroles et accords', chords:'Afficher les accords', resync:'Resynchroniser', noLyrics:'Nous travaillons sur les paroles synchronisées de cette chanson. Elles seront bientôt disponibles !', addFavorite:'Ajouter aux favoris', removeFavorite:'Retirer des favoris', playNext:'Lire ensuite', addQueue:'Ajouter à la fin de la file', addList:'Ajouter à une playlist', rename:'Renommer', remove:'Supprimer', save:'Enregistrer', cancel:'Annuler', listName:'Nom de la playlist', shuffle:'Aléatoire', repeat:'Répétition', clearQueue:'Vider la file' },
    it:{ library:'Libreria', albums:'Album', album:'The Navies', spaceBack:'Torna a Spazio Navy', search:'Cerca brani', favorites:'Preferiti', recent:'Ascoltati di recente', playlists:'Playlist', queue:'Coda', newList:'Nuova playlist', empty:'Non ci sono ancora brani qui.', play:'Riproduci', pause:'Pausa', previous:'Precedente', next:'Successivo', volume:'Volume', expand:'Espandi player', back:'Torna alla libreria', lyrics:'Testo e accordi', chords:'Mostra accordi', resync:'Risincronizza', noLyrics:'Stiamo lavorando al testo sincronizzato di questo brano. Sarà presto disponibile!', addFavorite:'Aggiungi ai preferiti', removeFavorite:'Rimuovi dai preferiti', playNext:'Riproduci dopo', addQueue:'Aggiungi alla fine della coda', addList:'Aggiungi a una playlist', rename:'Rinomina', remove:'Elimina', save:'Salva', cancel:'Annulla', listName:'Nome della playlist', shuffle:'Casuale', repeat:'Ripeti', clearQueue:'Svuota coda' }
  })[language] || null;
  const rootPath = window.__naviesForcedLanguage ? '../' : '';
  const tracks = [
    { file:'shake-it-off', artist:'Taylor Swift', title:'Shake It Off', duration:219.246, lyrics:'lyrics/shake-it-off.lrc' },
    { file:'baby-one-more-time', artist:'Britney Spears', title:'…Baby One More Time', duration:211.096 },
    { file:'sweet-caroline', artist:'Neil Diamond', title:'Sweet Caroline', duration:203.64 },
    { file:'dont-look-back-in-anger', artist:'Oasis', title:'Don’t Look Back in Anger', duration:289.62 },
    { file:'the-final-countdown', artist:'Europe', title:'The Final Countdown', duration:311.304 },
    { file:'have-you-ever-seen-the-rain', artist:'Creedence Clearwater Revival', title:'Have You Ever Seen the Rain?', duration:157.824 },
    { file:'the-final-countdown-reprise', artist:'Europe', title:'The Final Countdown (Reprise)', duration:94.368 }
  ];
  const svg = {
    play:'<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    prev:'<svg viewBox="0 0 24 24"><path d="m11 6-7 6 7 6V6Zm9 0-7 6 7 6V6Z"/></svg>',
    next:'<svg viewBox="0 0 24 24"><path d="m4 6 7 6-7 6V6Zm9 0 7 6-7 6V6Z"/></svg>',
    volume:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.2 1.1a3 3 0 0 1 0 3.8m2.6-6.4a6.5 6.5 0 0 1 0 9"/></svg>',
    expand:'<svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5m13 5h5v-5"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>'
  };
  const page = document.createElement('section');
  page.className = 'page-view subpage musync-v2';
  page.id = 'page-musync';
  page.dataset.pageView = 'musync';
  page.hidden = true;
  page.innerHTML = `
    <div class="musync-app">
      <aside class="musync-player-panel">
        <button class="musync-expand" type="button" aria-label="${copy.expand}">${svg.expand}</button>
        <div class="musync-cover"><img src="${rootPath}assets/images/musync-cover.png?v=20261111-253" alt="The Navies"></div>
        <div class="musync-current-copy"><h1 data-ms-title>The Navies</h1><p data-ms-artist>Musync</p></div>
        <div class="musync-timeline"><input data-ms-progress type="range" min="0" max="1000" value="0" aria-label="Progreso"><div><span data-ms-current>0:00</span><span data-ms-duration>0:00</span></div></div>
        <div class="musync-controls">
          <button data-ms-shuffle type="button" aria-label="${copy.shuffle}">⇄</button>
          <button data-ms-prev type="button" aria-label="${copy.previous}">${svg.prev}</button>
          <button class="musync-play" data-ms-toggle type="button" aria-label="${copy.play}">${svg.play}</button>
          <button data-ms-next type="button" aria-label="${copy.next}">${svg.next}</button>
          <button data-ms-repeat type="button" aria-label="${copy.repeat}">↻</button>
        </div>
        <label class="musync-volume">${svg.volume}<input data-ms-volume type="range" min="0" max="1" step="0.01" value="1"><span class="sr-only">${copy.volume}</span></label>
        <audio data-ms-audio preload="metadata" playsinline></audio>
      </aside>
      <main class="musync-library-panel">
        <header class="musync-library-head">
          <div><p>MUSYNC</p><h2>${copy.library}</h2></div>
          <label class="musync-search">${svg.search}<input data-ms-search type="search" placeholder="${copy.search}" autocomplete="off"></label>
        </header>
        <nav class="musync-tabs" aria-label="${copy.library}">
          <button data-ms-view="album" aria-pressed="true">${copy.albums}</button>
          <button data-ms-view="favorites" aria-pressed="false">${copy.favorites}</button>
          <button data-ms-view="recent" aria-pressed="false">${copy.recent}</button>
          <button data-ms-view="playlists" aria-pressed="false">${copy.playlists}</button>
          <button data-ms-view="queue" aria-pressed="false">${copy.queue}<span data-ms-queue-count>0</span></button>
        </nav>
        <section class="musync-content">
          <div class="musync-section-head"><h3 data-ms-heading>${copy.album}</h3><button data-ms-create type="button" hidden>＋ ${copy.newList}</button></div>
          <div data-ms-playlists class="musync-playlists" hidden></div>
          <div data-ms-tracks class="musync-tracks"></div>
        </section>
      </main>
    </div>
    <div class="musync-menu" data-ms-menu hidden></div>
    <dialog class="musync-list-dialog"><form method="dialog"><h2 data-ms-dialog-title>${copy.newList}</h2><input data-ms-list-name maxlength="36" placeholder="${copy.listName}" autocomplete="off"><div><button value="cancel">${copy.cancel}</button><button data-ms-list-save value="default">${copy.save}</button></div></form></dialog>
    <section class="musync-expanded" hidden>
      <button class="musync-expanded-back" type="button" aria-label="${copy.back}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3m12 6v-6h6"/></svg></button>
      <div class="musync-expanded-grid">
        <div class="musync-expanded-player">
          <img src="${rootPath}assets/images/musync-cover.png?v=20261111-253" alt="The Navies"><h2><span data-ms-full-title>The Navies</span></h2><p data-ms-full-artist>Musync</p>
          <div class="musync-full-timeline"><input data-ms-full-progress type="range" min="0" max="1000" value="0" aria-label="Progreso"><div><span data-ms-full-current>0:00</span><span data-ms-full-duration>0:00</span></div></div>
          <div class="musync-full-controls">
            <button data-ms-full-shuffle type="button" aria-label="${copy.shuffle}">⇄</button>
            <button data-ms-full-prev type="button" aria-label="${copy.previous}">${svg.prev}</button>
            <button class="musync-full-play" data-ms-full-toggle type="button" aria-label="${copy.play}">${svg.play}</button>
            <button data-ms-full-next type="button" aria-label="${copy.next}">${svg.next}</button>
            <button data-ms-full-repeat type="button" aria-label="${copy.repeat}">↻</button>
          </div>
          <label class="musync-full-volume">${svg.volume}<input data-ms-full-volume type="range" min="0" max="1" step="0.01" value="1"><span class="sr-only">${copy.volume}</span></label>
        </div>
        <div class="musync-lyrics-panel"><header><div class="musync-lyrics-tools"><label class="musync-chord-toggle"><span>${copy.chords}</span><input data-ms-chords type="checkbox" checked><i aria-hidden="true"></i></label><button data-ms-resync type="button" hidden>↻ <span>${copy.resync}</span></button></div></header><div class="musync-lyrics" data-ms-lyrics><p class="musync-no-lyrics">${copy.noLyrics}</p></div></div>
      </div>
    </section>`;
  document.querySelector('#page-espacio-navy')?.after(page);
  window.naviesRegisterPageView?.(page);
  const footerBack = document.createElement('button');
  footerBack.type = 'button';
  footerBack.className = 'musyc-footer-back';
  footerBack.innerHTML = `<span>←</span>${copy.spaceBack || copy.back}`;
  document.querySelector('footer .season-control')?.prepend(footerBack);
  footerBack.addEventListener('click', () => window.naviesOpenRoute?.('espacio-navy'));

  const $ = (selector) => page.querySelector(selector);
  const audio = $('[data-ms-audio]');
  const progress = $('[data-ms-progress]');
  const volume = $('[data-ms-volume]');
  const menu = $('[data-ms-menu]');
  const tracksHost = $('[data-ms-tracks]');
  const playlistsHost = $('[data-ms-playlists]');
  const expanded = $('.musync-expanded');
  const lyricsHost = $('[data-ms-lyrics]');
  const listDialog = $('.musync-list-dialog');
  const memberKey = () => window.naviesCurrentMember?.() || 'member';
  const blankState = () => ({ favorites:[], recent:[], queue:[], playlists:{}, volume:1, shuffle:false, repeat:'off', showChords:true });
  function loadState() { try { return { ...blankState(), ...(JSON.parse(localStorage.getItem(`the-navies-musync-${memberKey()}`)) || {}) }; } catch (_) { return blankState(); } }
  let state = loadState();
  let current = -1;
  let view = 'album';
  let selectedPlaylist = '';
  let editingPlaylist = '';
  let shufflePool = [];
  let queueReturnIndex = -1;
  let lyricLines = [];
  let lyricsDetached = false;
  let lyricsAutoScrolling = false;
  let lyricsAutoScrollTimer;
  const source = (track) => `${rootPath}audios/${track.file}.mp3?v=20261111-232`;
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const save = () => localStorage.setItem(`the-navies-musync-${memberKey()}`, JSON.stringify(state));
  const time = (seconds) => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00';
  const paintRange = (input, ratio) => input.style.setProperty('--range-progress', `${Math.max(0,Math.min(1,ratio))*100}%`);

  function indexesForView() {
    if (view === 'favorites') return state.favorites;
    if (view === 'recent') return state.recent;
    if (view === 'queue') return state.queue;
    if (view === 'playlists') return selectedPlaylist === '__favorites__' ? state.favorites : (selectedPlaylist ? (state.playlists[selectedPlaylist] || []) : []);
    return tracks.map((_,index) => index);
  }
  function trackRow(index, position) {
    const track = tracks[index];
    const queueControls = view === 'queue' ? `<div class="musync-queue-actions"><button data-ms-move="up" data-position="${position}" aria-label="Subir">↑</button><button data-ms-move="down" data-position="${position}" aria-label="Bajar">↓</button></div>` : '';
    return `<article class="musync-track${index === current ? ' is-active' : ''}" data-ms-track="${index}">
      <button class="musync-track-play" data-ms-play="${index}" type="button"><span>${String(position+1).padStart(2,'0')}</span>${svg.play}</button>
      <button class="musync-track-copy" data-ms-play="${index}" type="button"><strong>${escape(track.title)}</strong><small>${escape(track.artist)}</small></button>
      ${queueControls}<button class="musync-track-more" data-ms-track-menu="${index}" type="button" aria-label="Más opciones"><i></i><i></i><i></i></button>
    </article>`;
  }
  function render() {
    page.querySelectorAll('[data-ms-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.msView === view)));
    const headings = { album:copy.album, favorites:copy.favorites, recent:copy.recent, playlists:copy.playlists, queue:copy.queue };
    $('[data-ms-heading]').textContent = headings[view];
    $('.musync-section-head').hidden = ['favorites','recent','queue'].includes(view);
    $('[data-ms-create]').hidden = view !== 'playlists';
    $('[data-ms-queue-count]').textContent = state.queue.length;
    $('.musync-content').classList.toggle('is-playlists', view === 'playlists');
    playlistsHost.hidden = view !== 'playlists';
    if (view === 'playlists') {
      const names = Object.keys(state.playlists);
      if (!selectedPlaylist) selectedPlaylist = '__favorites__';
      playlistsHost.innerHTML = `<div><button data-ms-list="__favorites__" class="${selectedPlaylist==='__favorites__'?'is-active':''}"><span>♥</span><strong>${copy.favorites}</strong><small>${state.favorites.length}</small></button><span class="musync-list-spacer"></span></div>${names.map(name => `<div><button data-ms-list="${encodeURIComponent(name)}" class="${selectedPlaylist===name?'is-active':''}"><span>♫</span><strong>${escape(name)}</strong><small>${state.playlists[name].length}</small></button><button data-ms-list-menu="${encodeURIComponent(name)}" class="musync-track-more" aria-label="Más opciones"><i></i><i></i><i></i></button></div>`).join('')}`;
    }
    const query = $('[data-ms-search]').value.trim().toLowerCase();
    let indexes = indexesForView();
    if (query) indexes = indexes.filter(index => `${tracks[index].title} ${tracks[index].artist}`.toLowerCase().includes(query));
    tracksHost.innerHTML = indexes.length ? indexes.map((index,position) => trackRow(index,position)).join('') : `<p class="musync-empty">${copy.empty}</p>`;
    syncPlayer();
  }
  function syncPlayer() {
    const track = tracks[current];
    $('[data-ms-title]').textContent = track?.title || 'The Navies';
    $('[data-ms-artist]').textContent = track?.artist || 'Musync';
    $('[data-ms-full-title]').textContent = track?.title || 'The Navies';
    $('[data-ms-full-artist]').textContent = track?.artist || 'Musync';
    $('[data-ms-duration]').textContent = track ? time(Number.isFinite(audio.duration) ? audio.duration : track.duration) : '0:00';
    $('[data-ms-full-duration]').textContent = track ? time(Number.isFinite(audio.duration) ? audio.duration : track.duration) : '0:00';
    const playing = current >= 0 && !audio.paused;
    $('[data-ms-toggle]').innerHTML = playing ? svg.pause : svg.play;
    $('[data-ms-toggle]').setAttribute('aria-label', playing ? copy.pause : copy.play);
    $('[data-ms-full-toggle]').innerHTML = playing ? svg.pause : svg.play;
    $('[data-ms-full-toggle]').setAttribute('aria-label', playing ? copy.pause : copy.play);
    $('[data-ms-shuffle]').classList.toggle('is-active', state.shuffle);
    $('[data-ms-repeat]').classList.toggle('is-active', state.repeat !== 'off');
    $('[data-ms-repeat]').textContent = state.repeat === 'one' ? '↻¹' : '↻';
    $('[data-ms-full-shuffle]').classList.toggle('is-active', state.shuffle);
    $('[data-ms-full-repeat]').classList.toggle('is-active', state.repeat !== 'off');
    $('[data-ms-full-repeat]').textContent = state.repeat === 'one' ? '↻¹' : '↻';
    requestAnimationFrame(() => {
      const fullTitle = $('[data-ms-full-title]');
      fullTitle.classList.toggle('is-overflowing', fullTitle.scrollWidth > fullTitle.parentElement.clientWidth + 2);
    });
    page.querySelectorAll('[data-ms-track]').forEach(row => row.classList.toggle('is-active', Number(row.dataset.msTrack) === current));
  }
  function addRecent(index) { state.recent = [index,...state.recent.filter(item => item !== index)].slice(0,20); save(); }
  async function play(index, restart = true) {
    if (!tracks[index]) return;
    if (current !== index) { current = index; audio.src = source(tracks[index]); restart = true; await loadLyrics(); }
    if (restart) audio.currentTime = 0;
    addRecent(index);
    try { await audio.play(); window.naviesPauseSiteMusicForNavyAudio?.(); } catch (_) {}
    render();
  }
  function shuffledNext() {
    if (!shufflePool.length) shufflePool = tracks.map((_,i)=>i).filter(i=>i!==current).sort(()=>Math.random()-.5);
    return shufflePool.shift();
  }
  function nextIndex() {
    if (state.repeat === 'one' && current >= 0) return current;
    if (state.queue.length) {
      if (queueReturnIndex < 0) queueReturnIndex = current >= 0 ? (current + 1) % tracks.length : 0;
      const value = state.queue.shift(); save(); return value;
    }
    if (queueReturnIndex >= 0) { const value = queueReturnIndex; queueReturnIndex = -1; return value; }
    if (state.shuffle) return shuffledNext();
    if (current < tracks.length-1) return current+1;
    return state.repeat === 'list' ? 0 : -1;
  }
  function next() { const index = nextIndex(); if (index >= 0) play(index); else { audio.pause(); syncPlayer(); } }
  function previous() { if (audio.currentTime > 5 || current <= 0) { audio.currentTime = 0; return; } play(current-1); }
  function rememberQueueReturn() {
    if (!state.queue.length && queueReturnIndex < 0) queueReturnIndex = current >= 0 ? (current + 1) % tracks.length : 0;
  }

  const chordPattern = /^[A-G](?:#|b)?(?:m|maj|min|dim|aug|sus|add)?\d?(?:\/[A-G](?:#|b)?)?$/;
  function lyricMarkup(text) {
    const parts = text.split(/(\([^)]*\))/g).filter(Boolean);
    let pendingChord = '';
    let html = '';
    parts.forEach(part => {
      if (part.startsWith('(') && part.endsWith(')')) {
        const inside = part.slice(1,-1);
        if (chordPattern.test(inside)) { pendingChord = inside; return; }
      }
      if (pendingChord) {
        const match = part.match(/^(\s*)(\S+)([\s\S]*)$/);
        if (match) {
          html += `${escape(match[1])}<span class="musync-chord-word"><span class="musync-chord">${escape(pendingChord)}</span><span>${escape(match[2])}</span></span>${escape(match[3])}`;
          pendingChord = '';
          return;
        }
      }
      html += `<span class="musync-lyric-text">${escape(part)}</span>`;
    });
    return pendingChord ? `${html}<span class="musync-chord-word"><span class="musync-chord">${escape(pendingChord)}</span></span>` : html;
  }
  async function loadLyrics() {
    const track = tracks[current];
    lyricLines = [];
    lyricsDetached = false;
    lyricsHost.classList.remove('is-manual');
    $('[data-ms-resync]').hidden = true;
    if (!track?.lyrics) { lyricsHost.innerHTML = `<p class="musync-no-lyrics">${copy.noLyrics}</p>`; return; }
    try {
      const text = await fetch(`${rootPath}${track.lyrics}?v=20261111-253`, {cache:'force-cache'}).then(response => response.text());
      lyricLines = text.split(/\r?\n/).map(line => {
        const match = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
        return match ? { time:Number(match[1])*60+Number(match[2]), text:match[3] } : null;
      }).filter(Boolean);
      lyricsHost.innerHTML = lyricLines.map((line,index) => `<button type="button" data-ms-lyric="${index}">${lyricMarkup(line.text)}</button>`).join('');
      lyricsHost.classList.toggle('hide-chords', !$('[data-ms-chords]').checked);
    } catch (_) { lyricsHost.innerHTML = `<p class="musync-no-lyrics">${copy.noLyrics}</p>`; }
  }
  function syncLyrics(force = false) {
    if (!lyricLines.length) return;
    let active = -1;
    for (let i=0;i<lyricLines.length;i++) if (audio.currentTime >= lyricLines[i].time) active=i; else break;
    page.querySelectorAll('[data-ms-lyric]').forEach((line,index) => line.classList.toggle('is-active', index===active));
    const target = page.querySelector(`[data-ms-lyric="${active}"]`);
    if (target && (force || (!lyricsDetached && expanded.dataset.lyricActive !== String(active)))) {
      expanded.dataset.lyricActive = String(active);
      const targetTop = lyricsHost.scrollTop + target.getBoundingClientRect().top - lyricsHost.getBoundingClientRect().top - 88;
      lyricsAutoScrolling = true;
      clearTimeout(lyricsAutoScrollTimer);
      lyricsHost.scrollTo({ top:Math.max(0,targetTop), behavior:'smooth' });
      lyricsAutoScrollTimer = setTimeout(()=>{ lyricsAutoScrolling=false; },520);
    }
  }
  function openMenu(button,index) {
    const favorite = state.favorites.includes(index);
    menu.innerHTML = `<button data-ms-action="favorite" data-index="${index}">${favorite?copy.removeFavorite:copy.addFavorite}</button>${view==='queue'?`<button data-ms-action="remove-queue" data-index="${index}">${copy.removeQueue||copy.remove}</button>`:`<button data-ms-action="next" data-index="${index}">${copy.playNext}</button><button data-ms-action="queue" data-index="${index}">${copy.addQueue}</button>`}${Object.keys(state.playlists).length?`<span>${copy.addList}</span>${Object.keys(state.playlists).map(name=>`<button data-ms-action="playlist" data-index="${index}" data-list="${encodeURIComponent(name)}">${state.playlists[name].includes(index)?'−':'＋'} ${escape(name)}</button>`).join('')}`:''}`;
    const rect = button.getBoundingClientRect();
    menu.hidden = false;
    menu.style.left = `${Math.min(rect.left,innerWidth-240)}px`;
    menu.style.top = `${Math.min(rect.bottom+8,innerHeight-menu.offsetHeight-16)}px`;
  }
  function openListDialog(name='') {
    editingPlaylist = name;
    $('[data-ms-dialog-title]').textContent = name ? copy.rename : copy.newList;
    $('[data-ms-list-name]').value = name;
    listDialog.showModal();
    requestAnimationFrame(()=>{ $('[data-ms-list-name]').focus(); $('[data-ms-list-name]').select(); });
  }

  page.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-ms-view]');
    if (viewButton) { view=viewButton.dataset.msView; if(view!=='playlists') selectedPlaylist=''; render(); return; }
    const playButton = event.target.closest('[data-ms-play]');
    if (playButton) return play(Number(playButton.dataset.msPlay));
    const trackMenu = event.target.closest('[data-ms-track-menu]');
    if (trackMenu) return openMenu(trackMenu,Number(trackMenu.dataset.msTrackMenu));
    const listButton = event.target.closest('[data-ms-list]');
    if (listButton) {
      selectedPlaylist=listButton.dataset.msList === '__favorites__' ? '__favorites__' : decodeURIComponent(listButton.dataset.msList);
      render(); return;
    }
    const listMenu = event.target.closest('[data-ms-list-menu]');
    if (listMenu) {
      const name=decodeURIComponent(listMenu.dataset.msListMenu), rect=listMenu.getBoundingClientRect();
      menu.innerHTML=`<button data-ms-action="rename-list" data-list="${encodeURIComponent(name)}">${copy.rename}</button><button data-ms-action="delete-list" data-list="${encodeURIComponent(name)}">${copy.remove}</button>`;
      menu.hidden=false; menu.style.left=`${Math.min(rect.left,innerWidth-240)}px`; menu.style.top=`${Math.min(rect.bottom+8,innerHeight-menu.offsetHeight-16)}px`; return;
    }
    const move = event.target.closest('[data-ms-move]');
    if (move) {
      const from=Number(move.dataset.position), to=move.dataset.msMove==='up'?from-1:from+1;
      if(to>=0&&to<state.queue.length) [state.queue[from],state.queue[to]]=[state.queue[to],state.queue[from]];
      save(); render(); return;
    }
    if (event.target.closest('[data-ms-create]')) return openListDialog();
    if (event.target.closest('.musync-expand')) { lyricsDetached=false;lyricsHost.classList.remove('is-manual');$('[data-ms-resync]').hidden=true;expanded.hidden=false; document.body.classList.add('musync-expanded-open'); loadLyrics(); return; }
    if (event.target.closest('.musync-expanded-back')) { expanded.classList.add('is-closing'); setTimeout(()=>{expanded.hidden=true;expanded.classList.remove('is-closing');document.body.classList.remove('musync-expanded-open');},260); return; }
    const lyric = event.target.closest('[data-ms-lyric]');
    if (lyric) { lyricsDetached=false;lyricsHost.classList.remove('is-manual');$('[data-ms-resync]').hidden=true;audio.currentTime=lyricLines[Number(lyric.dataset.msLyric)]?.time||0; if(audio.paused) audio.play().catch(()=>{});syncLyrics(true);return; }
    if (!event.target.closest('[data-ms-menu]')) menu.hidden=true;
  });
  menu.addEventListener('click', event => {
    const button=event.target.closest('[data-ms-action]'); if(!button)return;
    const action=button.dataset.msAction;
    if(action==='rename-list'){menu.hidden=true;return openListDialog(decodeURIComponent(button.dataset.list));}
    if(action==='delete-list'){const name=decodeURIComponent(button.dataset.list);delete state.playlists[name];if(selectedPlaylist===name)selectedPlaylist='';}
    const index=Number(button.dataset.index);
    if(action==='favorite')state.favorites=state.favorites.includes(index)?state.favorites.filter(i=>i!==index):[...state.favorites,index];
    if(action==='next'){rememberQueueReturn();state.queue=[index,...state.queue];}
    if(action==='queue'){rememberQueueReturn();state.queue.push(index);}
    if(action==='remove-queue'){const position=state.queue.indexOf(index);if(position>=0)state.queue.splice(position,1);}
    if(action==='playlist'){const name=decodeURIComponent(button.dataset.list);state.playlists[name]=state.playlists[name].includes(index)?state.playlists[name].filter(i=>i!==index):[...state.playlists[name],index];}
    save();menu.hidden=true;render();
  });
  $('[data-ms-list-save]').addEventListener('click',event=>{
    const name=$('[data-ms-list-name]').value.trim();if(!name){event.preventDefault();return;}
    if(editingPlaylist&&editingPlaylist!==name){state.playlists[name]=state.playlists[editingPlaylist]||[];delete state.playlists[editingPlaylist];}
    else if(!state.playlists[name])state.playlists[name]=[];
    selectedPlaylist=name;editingPlaylist='';save();render();
  });
  $('[data-ms-search]').addEventListener('input',render);
  $('[data-ms-toggle]').addEventListener('click',()=>{if(current<0)play(0);else if(audio.paused)audio.play().catch(()=>{});else audio.pause();});
  $('[data-ms-prev]').addEventListener('click',previous);
  $('[data-ms-next]').addEventListener('click',next);
  $('[data-ms-shuffle]').addEventListener('click',()=>{state.shuffle=!state.shuffle;shufflePool=[];save();syncPlayer();});
  $('[data-ms-repeat]').addEventListener('click',()=>{state.repeat=state.repeat==='off'?'list':state.repeat==='list'?'one':'off';save();syncPlayer();});
  volume.value=String(Number.isFinite(Number(state.volume))?state.volume:1);paintRange(volume,Number(volume.value));
  $('[data-ms-full-volume]').value=volume.value;paintRange($('[data-ms-full-volume]'),Number(volume.value));
  function setVolume(value){audio.volume=Number(value);state.volume=audio.volume;volume.value=String(value);$('[data-ms-full-volume]').value=String(value);paintRange(volume,audio.volume);paintRange($('[data-ms-full-volume]'),audio.volume);save();}
  volume.addEventListener('input',()=>setVolume(volume.value));
  $('[data-ms-full-volume]').addEventListener('input',()=>setVolume($('[data-ms-full-volume]').value));
  progress.addEventListener('input',()=>{if(current<0)return;const duration=Number.isFinite(audio.duration)?audio.duration:tracks[current].duration;audio.currentTime=Number(progress.value)/1000*duration;});
  $('[data-ms-chords]').checked=state.showChords;
  $('[data-ms-chords]').addEventListener('change',event=>{state.showChords=event.target.checked;lyricsHost.classList.toggle('hide-chords',!state.showChords);save();});
  const detachLyrics=()=>{if(expanded.hidden||!lyricLines.length)return;lyricsDetached=true;lyricsHost.classList.add('is-manual');$('[data-ms-resync]').hidden=false;};
  lyricsHost.addEventListener('wheel',detachLyrics,{passive:true});
  lyricsHost.addEventListener('scroll',()=>{if(!lyricsAutoScrolling)detachLyrics();},{passive:true});
  $('[data-ms-resync]').addEventListener('click',()=>{lyricsDetached=false;lyricsHost.classList.remove('is-manual');$('[data-ms-resync]').hidden=true;syncLyrics(true);});
  function seekFrom(input){if(current<0)return;const duration=Number.isFinite(audio.duration)?audio.duration:tracks[current].duration;audio.currentTime=Number(input.value)/1000*duration;}
  $('[data-ms-full-progress]').addEventListener('input',()=>seekFrom($('[data-ms-full-progress]')));
  audio.addEventListener('timeupdate',()=>{const duration=Number.isFinite(audio.duration)?audio.duration:tracks[current]?.duration||0;const value=duration?String(Math.round(audio.currentTime/duration*1000)):'0';const ratio=duration?audio.currentTime/duration:0;$('[data-ms-current]').textContent=time(audio.currentTime);$('[data-ms-full-current]').textContent=time(audio.currentTime);progress.value=value;$('[data-ms-full-progress]').value=value;paintRange(progress,ratio);paintRange($('[data-ms-full-progress]'),ratio);syncLyrics();});
  audio.addEventListener('loadedmetadata',syncPlayer);audio.addEventListener('play',syncPlayer);audio.addEventListener('pause',syncPlayer);audio.addEventListener('ended',next);
  $('[data-ms-full-toggle]').addEventListener('click',()=>{if(current<0)play(0);else if(audio.paused)audio.play().catch(()=>{});else audio.pause();});
  $('[data-ms-full-prev]').addEventListener('click',previous);$('[data-ms-full-next]').addEventListener('click',next);
  $('[data-ms-full-shuffle]').addEventListener('click',()=>{state.shuffle=!state.shuffle;shufflePool=[];save();syncPlayer();});
  $('[data-ms-full-repeat]').addEventListener('click',()=>{state.repeat=state.repeat==='off'?'list':state.repeat==='list'?'one':'off';save();syncPlayer();});
  const launch=document.querySelector('.musyc-launch');
  launch?.addEventListener('click',()=>window.naviesOpenRoute?.('musync'));
  function syncAccess(){
    state=loadState();volume.value=String(Number.isFinite(Number(state.volume))?state.volume:1);setVolume(volume.value);
    const loggedIn=Boolean(window.naviesCurrentMember?.());launch.hidden=!loggedIn;render();
    if(location.hash==='#musync') requestAnimationFrame(()=>window.naviesOpenRoute?.(loggedIn?'musync':'espacio-navy',false));
  }
  window.addEventListener('navies-auth-change',syncAccess);
  window.addEventListener('navies-route-change',event=>{
    if(event.detail?.route==='musync') render();
    else if(!audio.paused){audio.pause();window.naviesResumeSiteMusicAfterNavyAudio?.();}
  });
  render();syncAccess();
})();
