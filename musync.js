(() => {
  const language = document.documentElement.lang?.slice(0,2) || 'es';
  const copy = ({
    es:{ library:'Biblioteca', albums:'Álbumes', album:'The Navies', spaceBack:'Volver a Espacio Navy', search:'Buscar canciones', favorites:'Favoritos', recent:'Recientes', playlists:'Playlists', queue:'Cola', newList:'Nueva playlist', empty:'Todavía no hay canciones aquí.', play:'Reproducir', pause:'Pausar', previous:'Anterior', next:'Siguiente', volume:'Volumen', expand:'Ampliar reproductor', back:'Volver a la biblioteca', lyrics:'Letra y acordes', chords:'Mostrar acordes', resync:'Volver a sincronizar', noLyrics:'Estamos trabajando en la letra sincronizada de esta canción. ¡Pronto estará disponible!', addFavorite:'Añadir a favoritos', removeFavorite:'Quitar de favoritos', playNext:'Reproducir a continuación', addQueue:'Añadir al final de la cola', removeQueue:'Quitar de la cola', addList:'Añadir a una playlist', rename:'Renombrar', remove:'Eliminar', save:'Guardar', cancel:'Cancelar', listName:'Nombre de la playlist', shuffle:'Aleatorio', repeat:'Repetición', clearQueue:'Vaciar cola' },
    ca:{ library:'Biblioteca', albums:'Àlbums', album:'The Navies', spaceBack:'Tornar a Espai Navy', search:'Cercar cançons', favorites:'Preferides', recent:'Recents', playlists:'Llistes', queue:'Cua', newList:'Llista nova', empty:'Encara no hi ha cançons aquí.', play:'Reproduir', pause:'Pausa', previous:'Anterior', next:'Següent', volume:'Volum', expand:'Ampliar reproductor', back:'Tornar a la biblioteca', lyrics:'Lletra i acords', chords:'Mostrar acords', resync:'Tornar a sincronitzar', noLyrics:'Estem treballant en la lletra sincronitzada d’aquesta cançó. Aviat estarà disponible!', addFavorite:'Afegir a preferides', removeFavorite:'Treure de preferides', playNext:'Reproduir a continuació', addQueue:'Afegir al final de la cua', addList:'Afegir a una llista', rename:'Canviar el nom', remove:'Eliminar', save:'Desar', cancel:'Cancel·lar', listName:'Nom de la llista', shuffle:'Aleatori', repeat:'Repetició', clearQueue:'Buidar la cua' },
    en:{ library:'Library', albums:'Albums', album:'The Navies', spaceBack:'Back to Navy Space', search:'Search songs', favorites:'Favorites', recent:'Recently played', playlists:'Playlists', queue:'Queue', newList:'New playlist', empty:'There are no songs here yet.', play:'Play', pause:'Pause', previous:'Previous', next:'Next', volume:'Volume', expand:'Expand player', back:'Back to library', lyrics:'Lyrics and chords', chords:'Show chords', resync:'Resync', noLyrics:'We are working on the synced lyrics for this song. They will be available soon!', addFavorite:'Add to favorites', removeFavorite:'Remove from favorites', playNext:'Play next', addQueue:'Add to end of queue', addList:'Add to playlist', rename:'Rename', remove:'Delete', save:'Save', cancel:'Cancel', listName:'Playlist name', shuffle:'Shuffle', repeat:'Repeat', clearQueue:'Clear queue' },
    fr:{ library:'Bibliothèque', albums:'Albums', album:'The Navies', spaceBack:'Retour à l’Espace Navy', search:'Rechercher des chansons', favorites:'Favoris', recent:'Écoutés récemment', playlists:'Playlists', queue:'File', newList:'Nouvelle playlist', empty:'Il n’y a pas encore de chansons ici.', play:'Lecture', pause:'Pause', previous:'Précédent', next:'Suivant', volume:'Volume', expand:'Agrandir le lecteur', back:'Retour à la bibliothèque', lyrics:'Paroles et accords', chords:'Afficher les accords', resync:'Resynchroniser', noLyrics:'Nous travaillons sur les paroles synchronisées de cette chanson. Elles seront bientôt disponibles !', addFavorite:'Ajouter aux favoris', removeFavorite:'Retirer des favoris', playNext:'Lire ensuite', addQueue:'Ajouter à la fin de la file', addList:'Ajouter à une playlist', rename:'Renommer', remove:'Supprimer', save:'Enregistrer', cancel:'Annuler', listName:'Nom de la playlist', shuffle:'Aléatoire', repeat:'Répétition', clearQueue:'Vider la file' },
    it:{ library:'Libreria', albums:'Album', album:'The Navies', spaceBack:'Torna a Spazio Navy', search:'Cerca brani', favorites:'Preferiti', recent:'Ascoltati di recente', playlists:'Playlist', queue:'Coda', newList:'Nuova playlist', empty:'Non ci sono ancora brani qui.', play:'Riproduci', pause:'Pausa', previous:'Precedente', next:'Successivo', volume:'Volume', expand:'Espandi player', back:'Torna alla libreria', lyrics:'Testo e accordi', chords:'Mostra accordi', resync:'Risincronizza', noLyrics:'Stiamo lavorando al testo sincronizzato di questo brano. Sarà presto disponibile!', addFavorite:'Aggiungi ai preferiti', removeFavorite:'Rimuovi dai preferiti', playNext:'Riproduci dopo', addQueue:'Aggiungi alla fine della coda', addList:'Aggiungi a una playlist', rename:'Rinomina', remove:'Elimina', save:'Salva', cancel:'Annulla', listName:'Nome della playlist', shuffle:'Casuale', repeat:'Ripeti', clearQueue:'Svuota coda' }
  })[language] || null;
  Object.assign(copy, ({
    es:{ songs:'Canciones', sort:'Ordenar por', sortTitle:'Título', sortArtist:'Artista', sortAlbum:'Álbum', currentAlbum:'Álbum actual', comingSoon:'Próximamente', addCurrentQueue:'Añadir a la cola', openQueue:'Abrir cola', nothingPlaying:'Nada en reproducción', memberAccess:'Cuenta Navy', loginCopy:'Inicia sesión con tu Cuenta Navy para abrir Musync.', username:'Usuario', password:'Contraseña', enter:'Entrar', loginError:'Usuario o contraseña incorrectos.', backAlbums:'Volver', deleteQuestion:'¿Quieres eliminar esta playlist?', deleteConfirm:'Eliminar playlist' },
    ca:{ songs:'Cançons', sort:'Ordenar per', sortTitle:'Títol', sortArtist:'Artista', sortAlbum:'Àlbum', currentAlbum:'Àlbum actual', comingSoon:'Pròximament', addCurrentQueue:'Afegir a la cua', openQueue:'Obrir cua', nothingPlaying:'Res en reproducció', memberAccess:'Compte Navy', loginCopy:'Inicia sessió amb el teu Compte Navy per obrir Musync.', username:'Usuari', password:'Contrasenya', enter:'Entrar', loginError:'Usuari o contrasenya incorrectes.', backAlbums:'Tornar', deleteQuestion:'Vols eliminar aquesta llista?', deleteConfirm:'Eliminar la llista' },
    en:{ songs:'Songs', sort:'Sort by', sortTitle:'Title', sortArtist:'Artist', sortAlbum:'Album', currentAlbum:'Current album', comingSoon:'Coming soon', addCurrentQueue:'Add to queue', openQueue:'Open queue', nothingPlaying:'Nothing playing', memberAccess:'Navy Account', loginCopy:'Sign in with your Navy Account to open Musync.', username:'Username', password:'Password', enter:'Sign in', loginError:'Incorrect username or password.', backAlbums:'Back', deleteQuestion:'Do you want to delete this playlist?', deleteConfirm:'Delete playlist' },
    fr:{ songs:'Titres', sort:'Trier par', sortTitle:'Titre', sortArtist:'Artiste', sortAlbum:'Album', currentAlbum:'Album actuel', comingSoon:'Bientôt', addCurrentQueue:'Ajouter à la file', openQueue:'Ouvrir la file', nothingPlaying:'Aucune lecture', memberAccess:'Compte Navy', loginCopy:'Connectez-vous avec votre Compte Navy pour ouvrir Musync.', username:'Utilisateur', password:'Mot de passe', enter:'Connexion', loginError:'Utilisateur ou mot de passe incorrect.', backAlbums:'Retour', deleteQuestion:'Voulez-vous supprimer cette playlist ?', deleteConfirm:'Supprimer la playlist' },
    it:{ songs:'Brani', sort:'Ordina per', sortTitle:'Titolo', sortArtist:'Artista', sortAlbum:'Album', currentAlbum:'Album attuale', comingSoon:'Prossimamente', addCurrentQueue:'Aggiungi alla coda', openQueue:'Apri coda', nothingPlaying:'Nessun brano in riproduzione', memberAccess:'Account Navy', loginCopy:'Accedi con il tuo Account Navy per aprire Musync.', username:'Utente', password:'Password', enter:'Accedi', loginError:'Utente o password errati.', backAlbums:'Indietro', deleteQuestion:'Vuoi eliminare questa playlist?', deleteConfirm:'Elimina playlist' }
  })[language] || {});
  const rootPath = window.__naviesForcedLanguage ? '../' : '';
  const tracks = [
    { file:'the-navies/shake-it-off', artist:'Taylor Swift', title:'Shake It Off', album:'the-navies', duration:219.246, lyrics:'lyrics/the-navies/shake-it-off.lrc', hasChords:true },
    { file:'the-navies/baby-one-more-time', artist:'Britney Spears', title:'…Baby One More Time', album:'the-navies', duration:211.096, lyrics:'lyrics/the-navies/baby-one-more-time.lrc' },
    { file:'the-navies/sweet-caroline', artist:'Neil Diamond', title:'Sweet Caroline', album:'the-navies', duration:203.64, lyrics:'lyrics/the-navies/sweet-caroline.lrc' },
    { file:'the-navies/dont-look-back-in-anger', artist:'Oasis', title:'Don’t Look Back in Anger', album:'the-navies', duration:289.62, lyrics:'lyrics/the-navies/dont-look-back-in-anger.lrc' },
    { file:'the-navies/the-final-countdown', artist:'Europe', title:'The Final Countdown', album:'the-navies', duration:311.304, lyrics:'lyrics/the-navies/the-final-countdown.lrc' },
    { file:'the-navies/have-you-ever-seen-the-rain', artist:'Creedence Clearwater Revival', title:'Have You Ever Seen the Rain?', album:'the-navies', duration:157.824, lyrics:'lyrics/the-navies/have-you-ever-seen-the-rain.lrc' },
    { file:'the-navies/the-final-countdown-reprise', artist:'Europe', title:'The Final Countdown (Reprise)', album:'the-navies', duration:94.368, lyrics:'lyrics/the-navies/the-final-countdown-reprise.lrc' },
    { file:'cor-band/billie-jean', artist:'Michael Jackson', title:'Billie Jean', album:'cor-band', duration:294.269, lyrics:'lyrics/cor-band/billie-jean.lrc' },
    { file:'cor-band/stayin-alive', artist:'Bee Gees', title:'Stayin’ Alive', album:'cor-band', duration:284.709, lyrics:'lyrics/cor-band/stayin-alive.lrc' },
    { file:'cor-band/mystical-magical', artist:'Benson Boone', title:'Mystical Magical', album:'cor-band', duration:165.773, lyrics:'lyrics/cor-band/mystical-magical.lrc' },
    { file:'cor-band/texas-hold-em', artist:'Beyoncé', title:'Texas Hold ’Em', album:'cor-band', duration:233.535, lyrics:'lyrics/cor-band/texas-hold-em.lrc' },
    { file:'cor-band/training-season', artist:'Dua Lipa', title:'Training Season', album:'cor-band', duration:209.528, lyrics:'lyrics/cor-band/training-season.lrc' },
    { file:'cor-band/livin-on-a-prayer', artist:'Bon Jovi', title:'Livin’ On A Prayer', album:'cor-band', duration:288.549, lyrics:'lyrics/cor-band/livin-on-a-prayer.lrc' }
  ];
  const albums = [
    { id:'the-navies', title:'The Navies', artist:'The Navies', cover:'assets/images/musync-cover.png' },
    { id:'cor-band', title:'Cor-Band', artist:'Cor-Band', cover:'assets/images/cor-band-cover.png' }
  ];
  const albumFor = track => albums.find(album=>album.id===track?.album) || albums[0];
  const coverFor = track => albumFor(track).cover || 'assets/images/musync-cover.png';
  const svg = {
    play:'<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z"/></svg>',
    pause:'<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    prev:'<svg viewBox="0 0 24 24"><path d="m11 6-7 6 7 6V6Zm9 0-7 6 7 6V6Z"/></svg>',
    next:'<svg viewBox="0 0 24 24"><path d="m4 6 7 6-7 6V6Zm9 0 7 6-7 6V6Z"/></svg>',
    volume:'<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Zm12.2 1.1a3 3 0 0 1 0 3.8m2.6-6.4a6.5 6.5 0 0 1 0 9"/></svg>',
    expand:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>',
    albums:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg>',
    songs:'<svg viewBox="0 0 24 24"><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
    heart:'<svg viewBox="0 0 24 24"><path d="M20.8 5.8a5.3 5.3 0 0 0-7.5 0L12 7.1l-1.3-1.3a5.3 5.3 0 1 0-7.5 7.5L12 22l8.8-8.7a5.3 5.3 0 0 0 0-7.5Z"/></svg>',
    recent:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1"/></svg>',
    queue:'<svg viewBox="0 0 24 24"><path d="M4 6h12M4 11h12M4 16h8"/><path d="m17 15 4 3-4 3Z"/></svg>'
  };
  const page = document.createElement('section');
  page.className = 'page-view subpage musync-v2';
  page.id = 'page-musync';
  page.dataset.pageView = 'musync';
  page.hidden = true;
  page.innerHTML = `
    <div class="musync-login-gate" hidden><form data-ms-login><span>MUSYNC</span><h1>${copy.memberAccess}</h1><p>${copy.loginCopy}</p><label><span>${copy.username}</span><input name="username" autocomplete="username" autocapitalize="none" required></label><label><span>${copy.password}</span><input name="password" type="password" autocomplete="current-password" required></label><p class="musync-login-error" data-ms-login-error aria-live="polite"></p><button type="submit">${copy.enter}</button></form></div>
    <div class="musync-app" data-ms-app>
      <aside class="musync-player-panel">
        <div class="musync-cover"><img src="${rootPath}assets/images/musync-cover.png?v=20261112-282" alt="The Navies"></div>
        <div class="musync-current-copy"><h1><span data-ms-title>The Navies</span></h1><p data-ms-artist>Musync</p></div>
        <div class="musync-timeline"><input data-ms-progress type="range" min="0" max="1000" value="0" aria-label="Progreso"><div><span data-ms-current>0:00</span><span data-ms-duration>0:00</span></div></div>
        <div class="musync-controls">
          <button data-ms-shuffle type="button" aria-label="${copy.shuffle}">⇄</button>
          <button data-ms-prev type="button" aria-label="${copy.previous}">${svg.prev}</button>
          <button class="musync-play" data-ms-toggle type="button" aria-label="${copy.play}">${svg.play}</button>
          <button data-ms-next type="button" aria-label="${copy.next}">${svg.next}</button>
          <button data-ms-repeat type="button" aria-label="${copy.repeat}">↻</button>
        </div>
        <div class="musync-player-actions">
          <button data-ms-current-favorite type="button" aria-label="${copy.addFavorite}">♡</button>
          <button data-ms-current-list type="button" aria-label="${copy.addList}">＋</button>
          <span class="musync-action-divider" aria-hidden="true"></span>
          <button class="musync-expand" type="button" aria-label="${copy.expand}">${svg.expand}</button>
        </div>
        <label class="musync-volume">${svg.volume}<input data-ms-volume type="range" min="0" max="1" step="0.01" value="1"><span class="sr-only">${copy.volume}</span></label>
        <audio data-ms-audio preload="metadata" playsinline></audio>
      </aside>
      <main class="musync-library-panel">
        <header class="musync-library-head">
          <div><p>MUSYNC</p><h2>${copy.library}</h2></div>
        </header>
        <nav class="musync-tabs" aria-label="${copy.library}">
          <button data-ms-view="album" aria-pressed="true">${svg.albums}<span>${copy.albums}</span></button>
          <button data-ms-view="songs" aria-pressed="false">${svg.songs}<span>${copy.songs}</span></button>
          <button data-ms-view="recent" aria-pressed="false">${svg.recent}<span>${copy.recent}</span></button>
          <button data-ms-view="favorites" aria-pressed="false">${svg.heart}<span>${copy.favorites}</span></button>
          <button data-ms-view="playlists" aria-pressed="false">${svg.list}<span>${copy.playlists}</span></button>
          <button data-ms-view="queue" aria-pressed="false">${svg.queue}<span>${copy.queue}</span><i data-ms-queue-count>0</i></button>
        </nav>
        <section class="musync-content">
          <div class="musync-section-head"><h3 data-ms-heading>${copy.albums}</h3><div class="musync-section-actions"><button data-ms-create type="button" hidden>＋ ${copy.newList}</button></div></div>
          <label class="musync-search musync-song-search" hidden>${svg.search}<input data-ms-search type="search" placeholder="${copy.search}" autocomplete="off"></label>
          <div data-ms-albums class="musync-albums"></div>
          <div data-ms-playlists class="musync-playlists" hidden></div>
          <div data-ms-track-head class="musync-track-head" hidden><span>#</span><span></span><button data-ms-sort-key="title">${copy.sortTitle}</button><button data-ms-sort-key="artist">${copy.sortArtist}</button><button data-ms-sort-key="album">${copy.sortAlbum}</button><span></span></div>
          <div data-ms-tracks class="musync-tracks"></div>
        </section>
      </main>
    </div>
    <div class="musync-menu" data-ms-menu hidden></div>
    <dialog class="musync-list-dialog"><form method="dialog"><h2 data-ms-dialog-title>${copy.newList}</h2><input data-ms-list-name maxlength="36" placeholder="${copy.listName}" autocomplete="off"><div><button value="cancel">${copy.cancel}</button><button data-ms-list-save value="default">${copy.save}</button></div></form></dialog>
    <dialog class="musync-confirm-dialog"><form method="dialog"><h2>${copy.deleteConfirm}</h2><p>${copy.deleteQuestion}</p><div><button value="cancel">${copy.cancel}</button><button data-ms-delete-confirm value="default">${copy.remove}</button></div></form></dialog>
    <section class="musync-expanded" hidden>
      <button class="musync-expanded-back" type="button" aria-label="${copy.back}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3m12 6v-6h6"/></svg></button>
      <div class="musync-expanded-grid">
        <div class="musync-expanded-player">
          <img src="${rootPath}assets/images/musync-cover.png?v=20261112-282" alt="The Navies"><div class="musync-full-title-row"><h2><span data-ms-full-title>The Navies</span></h2><div><button data-ms-full-favorite type="button" aria-label="${copy.addFavorite}">♡</button><button data-ms-full-list type="button" aria-label="${copy.addList}">＋</button></div></div><p data-ms-full-artist>Musync</p>
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
  const albumsHost = $('[data-ms-albums]');
  const playlistsHost = $('[data-ms-playlists]');
  const expanded = $('.musync-expanded');
  const lyricsHost = $('[data-ms-lyrics]');
  const listDialog = $('.musync-list-dialog');
  const confirmDialog = $('.musync-confirm-dialog');
  const memberKey = () => window.naviesCurrentMember?.() || 'member';
  const apiUrl = String(window.NAVIES_ADMIN_API_URL || '').replace(/\/$/, '');
  const memberAuth = () => { try { return JSON.parse(localStorage.getItem('navies-member-auth')) || null; } catch (_) { return null; } };
  const blankState = () => ({ favorites:[], recent:[], queue:[], playlists:{}, volume:1, shuffle:false, repeat:'off', showChords:true, sort:'title', sortDirection:'asc', currentTrack:-1, currentTime:0 });
  function loadState() { try { return { ...blankState(), ...(JSON.parse(localStorage.getItem(`the-navies-musync-${memberKey()}`)) || {}) }; } catch (_) { return blankState(); } }
  function loadUi() { try { return JSON.parse(localStorage.getItem(`the-navies-musync-ui-${memberKey()}`)) || {}; } catch (_) { return {}; } }
  let state = loadState();
  let uiState = loadUi();
  let current = -1;
  let view = ['album','album-detail','songs','recent','favorites','playlists','queue'].includes(uiState.view) ? uiState.view : 'album';
  let selectedAlbum = albums.some(album=>album.id===uiState.selectedAlbum) ? uiState.selectedAlbum : 'the-navies';
  let selectedPlaylist = uiState.selectedPlaylist || '';
  let editingPlaylist = '';
  let pendingPlaylistTrack = -1;
  let pendingDeletePlaylist = '';
  let shufflePool = [];
  let queueReturnIndex = -1;
  let lyricLines = [];
  let lyricsDetached = false;
  let lyricsAutoScrolling = false;
  let lyricsAutoScrollTimer;
  let seekLyricsFrame;
  let renderedView = '';
  let renderedPlaylist = '';
  const source = (track) => `${rootPath}audios/${track.file}.mp3?v=20261112-282`;
  const saveUi = () => localStorage.setItem(`the-navies-musync-ui-${memberKey()}`, JSON.stringify({ view, selectedAlbum, selectedPlaylist }));
  function restoreUi() {
    uiState=loadUi();
    view=['album','album-detail','songs','recent','favorites','playlists','queue'].includes(uiState.view)?uiState.view:'album';
    selectedAlbum=albums.some(album=>album.id===uiState.selectedAlbum)?uiState.selectedAlbum:'the-navies';
    selectedPlaylist=uiState.selectedPlaylist||'';
  }
  function restoreSavedTrack() {
    const index=Number(state.currentTrack);
    if(current>=0||!Number.isInteger(index)||!tracks[index])return;
    current=index;
    audio.src=source(tracks[index]);
    const resumeAt=Math.max(0,Number(state.currentTime)||0);
    audio.addEventListener('loadedmetadata',()=>{if(resumeAt<audio.duration)audio.currentTime=resumeAt;syncPlayer();},{once:true});
    loadLyrics();
  }
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let remoteSaveTimer;
  const save = () => {
    localStorage.setItem(`the-navies-musync-${memberKey()}`, JSON.stringify(state));
    const auth = memberAuth();
    if (!apiUrl || !auth?.token) return;
    clearTimeout(remoteSaveTimer);
    remoteSaveTimer = setTimeout(() => fetch(`${apiUrl}/musync`, { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${auth.token}` }, body:JSON.stringify({ state }) }).catch(()=>{}), 450);
  };
  function persistPlaybackPosition(immediateRemote=false) {
    if(current<0)return;
    state.currentTrack=current;
    state.currentTime=Math.max(0,audio.currentTime||0);
    localStorage.setItem(`the-navies-musync-${memberKey()}`,JSON.stringify(state));
    if(!immediateRemote)return;
    const auth=memberAuth();
    if(!apiUrl||!auth?.token)return;
    fetch(`${apiUrl}/musync`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${auth.token}`},body:JSON.stringify({state}),keepalive:true}).catch(()=>{});
  }
  async function loadRemoteState() {
    const auth = memberAuth();
    if (!apiUrl || !auth?.token) return;
    try {
      const response = await fetch(`${apiUrl}/musync`, { headers:{ Authorization:`Bearer ${auth.token}` }, cache:'no-store' });
      if (!response.ok) return;
      const result = await response.json();
      if (!result.state) return;
      if (!result.exists) { save(); return; }
      state = { ...blankState(), ...result.state, playlists:{ ...(result.state.playlists || {}) } };
      localStorage.setItem(`the-navies-musync-${memberKey()}`, JSON.stringify(state));
      volume.value=String(state.volume); audio.volume=Number(state.volume); $('[data-ms-full-volume]').value=volume.value; restoreSavedTrack(); render();
    } catch (_) {}
  }
  const time = (seconds) => Number.isFinite(seconds) ? `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}` : '0:00';
  const paintRange = (input, ratio) => input.style.setProperty('--range-progress', `${Math.max(0,Math.min(1,ratio))*100}%`);

  function indexesForView() {
    if (view === 'favorites') return state.favorites;
    if (view === 'recent') return state.recent.slice(0,10);
    if (view === 'queue') return state.queue;
    if (view === 'playlists') return selectedPlaylist === '__favorites__' ? state.favorites : (selectedPlaylist ? (state.playlists[selectedPlaylist] || []) : []);
    if (view === 'album') return [];
    if (view === 'album-detail') return tracks.map((_,index)=>index).filter(index=>tracks[index].album===selectedAlbum);
    return tracks.map((_,index) => index);
  }
  function trackRow(index, position) {
    const track = tracks[index];
    const albumDetail = view === 'album-detail';
    const songsTable = view === 'songs';
    const queueControls = view === 'queue' ? `<div class="musync-queue-actions"><button data-ms-move="up" data-position="${position}" aria-label="Subir">↑</button><button data-ms-move="down" data-position="${position}" aria-label="Bajar">↓</button></div>` : '';
    if (songsTable) return `<article class="musync-track is-song-table${index === current ? ' is-active' : ''}" data-ms-track="${index}">
      <button class="musync-track-play" data-ms-play="${index}" type="button"><span>${String(position+1).padStart(2,'0')}</span>${svg.play}</button>
      <img class="musync-track-art" src="${rootPath}${coverFor(track)}?v=20261112-282" alt="">
      <button class="musync-table-cell musync-table-title" data-ms-play="${index}" type="button">${escape(track.title)}</button>
      <button class="musync-table-cell" data-ms-play="${index}" type="button">${escape(track.artist)}</button>
      <button class="musync-table-cell" data-ms-play="${index}" type="button">${escape(albumFor(track).title)}</button>
      <button class="musync-track-more" data-ms-track-menu="${index}" type="button" aria-label="Más opciones"><i></i><i></i><i></i></button>
    </article>`;
    return `<article class="musync-track${index === current ? ' is-active' : ''}${albumDetail?' is-album-track':''}${songsTable?' is-song-table':''}" data-ms-track="${index}">
      <button class="musync-track-play" data-ms-play="${index}" type="button"><span>${String(position+1).padStart(2,'0')}</span>${svg.play}</button>
      ${albumDetail?'':`<img class="musync-track-art" src="${rootPath}${coverFor(track)}?v=20261112-282" alt="">`}
      <button class="musync-track-copy" data-ms-play="${index}" type="button"><strong>${escape(track.title)}</strong>${songsTable?`<small class="musync-table-artist">${escape(track.artist)}</small><small class="musync-table-album">${escape(albumFor(track).title)}</small>`:`<small>${escape(track.artist)}</small>`}</button>
      ${queueControls}<button class="musync-track-more" data-ms-track-menu="${index}" type="button" aria-label="Más opciones"><i></i><i></i><i></i></button>
    </article>`;
  }
  function render() {
    if(view==='playlists'&&selectedPlaylist&&selectedPlaylist!=='__favorites__'&&!state.playlists[selectedPlaylist])selectedPlaylist='';
    saveUi();
    page.querySelectorAll('[data-ms-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.msView === view || (view==='album-detail'&&button.dataset.msView==='album'))));
    const selectedAlbumData = albums.find(album=>album.id===selectedAlbum) || albums[0];
    const headings = { album:copy.albums, 'album-detail':selectedAlbumData.title, songs:copy.songs, favorites:copy.favorites, recent:copy.recent, playlists:copy.playlists, queue:copy.queue };
    $('[data-ms-heading]').textContent = headings[view];
    $('.musync-section-head').hidden = view === 'album-detail';
    $('[data-ms-create]').hidden = view !== 'playlists';
    $('.musync-song-search').hidden = view !== 'songs';
    page.querySelectorAll('[data-ms-sort-key]').forEach(button => {
      const active = button.dataset.msSortKey === (state.sort || 'title');
      button.classList.toggle('is-active', active);
      button.dataset.direction = active ? (state.sortDirection || 'asc') : '';
    });
    $('[data-ms-queue-count]').textContent = state.queue.length;
    $('.musync-content').classList.toggle('is-playlists', view === 'playlists');
    albumsHost.hidden = !['album','album-detail'].includes(view);
    albumsHost.innerHTML = view === 'album' ? albums.map(album=>{const count=tracks.filter(track=>track.album===album.id).length;const isCurrent=current>=0&&tracks[current].album===album.id;return album.comingSoon?`<article class="musync-album-card is-coming"><span class="musync-album-placeholder"><b>CC</b></span><span><small>${copy.comingSoon}</small><strong>${escape(album.title)}</strong><em>${copy.comingSoon}</em></span></article>`:`<button class="musync-album-card" data-ms-open-album="${album.id}" type="button"><img src="${rootPath}${album.cover}?v=20261112-282" alt="${escape(album.title)}"><span><small data-ms-album-playing="${album.id}" ${isCurrent?'':'hidden'}>${copy.currentAlbum}</small><strong>${escape(album.title)}</strong><em>${count} ${copy.songs.toLocaleLowerCase()}</em></span></button>`;}).join('') : view === 'album-detail' ? `<section class="musync-album-detail"><button class="musync-album-back" data-ms-back-albums type="button" aria-label="${copy.backAlbums}">← <span>${copy.backAlbums}</span></button><img src="${rootPath}${selectedAlbumData.cover}?v=20261112-282" alt="${escape(selectedAlbumData.title)}"><div><small>${copy.album}</small><h4>${escape(selectedAlbumData.title)}</h4><p>${escape(selectedAlbumData.artist)} · ${tracks.filter(track=>track.album===selectedAlbum).length} ${copy.songs.toLocaleLowerCase()}</p></div></section>` : '';
    playlistsHost.hidden = view !== 'playlists';
    if (view === 'playlists') {
      const names = Object.keys(state.playlists);
      playlistsHost.innerHTML = `<div><button data-ms-list="__favorites__" class="${selectedPlaylist==='__favorites__'?'is-active':''}"><span>♥</span><strong>${copy.favorites}</strong><small>${state.favorites.length}</small></button><span class="musync-list-spacer"></span></div>${names.map(name => `<div><button data-ms-list="${encodeURIComponent(name)}" class="${selectedPlaylist===name?'is-active':''}"><span>♫</span><strong>${escape(name)}</strong><small>${state.playlists[name].length}</small></button><button data-ms-list-menu="${encodeURIComponent(name)}" class="musync-track-more" aria-label="Más opciones"><i></i><i></i><i></i></button></div>`).join('')}`;
    }
    const query = view === 'songs' ? $('[data-ms-search]').value.trim().toLowerCase() : '';
    let indexes = indexesForView();
    if (view === 'songs') {
      const sort = state.sort || 'title';
      const direction = state.sortDirection === 'desc' ? -1 : 1;
      indexes = [...indexes].sort((a,b) => direction * (sort === 'artist' ? tracks[a].artist.localeCompare(tracks[b].artist,language) : sort === 'album' ? albumFor(tracks[a]).title.localeCompare(albumFor(tracks[b]).title,language) || tracks[a].title.localeCompare(tracks[b].title,language) : tracks[a].title.localeCompare(tracks[b].title,language)));
    }
    if (query) indexes = indexes.filter(index => `${tracks[index].title} ${tracks[index].artist}`.toLowerCase().includes(query));
    $('[data-ms-track-head]').hidden = view !== 'songs';
    page.querySelectorAll('[data-ms-sort-key]').forEach(button=>{
      const active=button.dataset.msSortKey===(state.sort||'title');
      button.classList.toggle('is-active',active);
      button.dataset.direction=active?(state.sortDirection||'asc'):'';
    });
    tracksHost.hidden = view === 'album';
    tracksHost.innerHTML = view==='playlists'&&!selectedPlaylist ? '' : indexes.length ? indexes.map((index,position) => trackRow(index,position)).join('') : `<p class="musync-empty">${copy.empty}</p>`;
    const content = $('.musync-content');
    if (renderedView !== view) {
      content.classList.remove('is-view-entering'); void content.offsetWidth; content.classList.add('is-view-entering');
      renderedView = view;
    } else if (view === 'playlists' && renderedPlaylist !== selectedPlaylist) {
      tracksHost.classList.remove('is-list-entering'); void tracksHost.offsetWidth; tracksHost.classList.add('is-list-entering');
    }
    renderedPlaylist = selectedPlaylist;
    syncPlayer();
  }
  function syncPlayer() {
    const track = tracks[current];
    $('[data-ms-title]').textContent = track?.title || copy.nothingPlaying;
    $('[data-ms-artist]').textContent = track?.artist || 'Musync';
    $('[data-ms-full-title]').textContent = track?.title || copy.nothingPlaying;
    $('[data-ms-full-artist]').textContent = track?.artist || 'Musync';
    page.querySelectorAll('.musync-cover,.musync-expanded-player').forEach(element => element.classList.toggle('is-empty', !track));
    $('.musync-expand').disabled = !track;
    $('[data-ms-duration]').textContent = track ? time(Number.isFinite(audio.duration) ? audio.duration : track.duration) : '0:00';
    $('[data-ms-full-duration]').textContent = track ? time(Number.isFinite(audio.duration) ? audio.duration : track.duration) : '0:00';
    const playing = current >= 0 && !audio.paused;
    page.querySelectorAll('[data-ms-album-playing]').forEach(label=>{label.hidden=current<0||label.dataset.msAlbumPlaying!==track?.album;});
    const cover = track ? `${rootPath}${coverFor(track)}?v=20261112-282` : `${rootPath}assets/images/musync-cover.png?v=20261112-282`;
    const sideCover = $('.musync-cover img'); if(sideCover)sideCover.src=cover;
    const fullCover = $('.musync-expanded-player > img'); if(fullCover)fullCover.src=cover;
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
    $('[data-ms-current-favorite]').textContent = current >= 0 && state.favorites.includes(current) ? '♥' : '♡';
    $('[data-ms-current-favorite]').classList.toggle('is-active', current >= 0 && state.favorites.includes(current));
    $('[data-ms-current-favorite]').disabled = current < 0;
    $('[data-ms-current-list]').disabled = current < 0;
    $('[data-ms-full-favorite]').textContent = current >= 0 && state.favorites.includes(current) ? '♥' : '♡';
    $('[data-ms-full-favorite]').classList.toggle('is-active', current >= 0 && state.favorites.includes(current));
    $('[data-ms-full-favorite]').disabled = current < 0;
    $('[data-ms-full-list]').disabled = current < 0;
    requestAnimationFrame(() => {
      [$('[data-ms-title]'), $('[data-ms-full-title]')].forEach(title => {
        const available = title.parentElement.clientWidth;
        const overflow = Math.max(0, title.scrollWidth - available);
        title.style.setProperty('--marquee-distance', `${-overflow}px`);
        title.classList.toggle('is-overflowing', overflow > 2);
      });
    });
    page.querySelectorAll('[data-ms-track]').forEach(row => row.classList.toggle('is-active', Number(row.dataset.msTrack) === current));
    page.querySelectorAll('[data-ms-track]').forEach(row=>{if(Number(row.dataset.msTrack)!==current)return;const button=row.querySelector('.musync-track-play');if(button)button.innerHTML=audio.paused?svg.play:svg.pause;});
  }
  function addRecent(index) { state.recent = [index,...state.recent.filter(item => item !== index)].slice(0,10); save(); }
  async function play(index, restart = true) {
    if (!tracks[index]) return;
    if (current !== index) { current = index; state.currentTrack=index; state.currentTime=0; audio.src = source(tracks[index]); restart = true; await loadLyrics(); }
    if (restart) {
      audio.currentTime = 0;
      state.currentTime=0;
      resetLyricsToPlayback();
    }
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
  function previous() { if (audio.currentTime > 5 || current <= 0) { audio.currentTime = 0; resetLyricsToPlayback(); return; } play(current-1); }
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
    $('.musync-chord-toggle').hidden = !track?.hasChords;
    lyricLines = [];
    lyricsDetached = false;
    lyricsHost.classList.remove('is-manual');
    $('[data-ms-resync]').hidden = true;
    if (!track?.lyrics) { lyricsHost.innerHTML = `<p class="musync-no-lyrics">${copy.noLyrics}</p>`; return; }
    try {
      const text = await fetch(`${rootPath}${track.lyrics}?v=20261112-282`, {cache:'force-cache'}).then(response => response.text());
      lyricLines = text.split(/\r?\n/).map(line => {
        const match = line.match(/^\[(?:(\d+):)?(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/);
        return match ? { time:Number(match[1]||0)*3600+Number(match[2])*60+Number(match[3]), text:match[4] } : null;
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
    if (!target && force) {
      lyricsAutoScrolling = true;
      clearTimeout(lyricsAutoScrollTimer);
      lyricsHost.scrollTo({ top:0, behavior:'smooth' });
      lyricsAutoScrollTimer = setTimeout(()=>{ lyricsAutoScrolling=false; },900);
      return;
    }
    if (target && (force || (!lyricsDetached && expanded.dataset.lyricActive !== String(active)))) {
      expanded.dataset.lyricActive = String(active);
      const targetTop = lyricsHost.scrollTop + target.getBoundingClientRect().top - lyricsHost.getBoundingClientRect().top - 88;
      lyricsAutoScrolling = true;
      clearTimeout(lyricsAutoScrollTimer);
      lyricsHost.scrollTo({ top:Math.max(0,targetTop), behavior:'smooth' });
      lyricsAutoScrollTimer = setTimeout(()=>{ lyricsAutoScrolling=false; },900);
    }
  }
  function resetLyricsToPlayback() {
    lyricsDetached = false;
    lyricsHost.classList.remove('is-manual');
    $('[data-ms-resync]').hidden = true;
    expanded.dataset.lyricActive = '';
    requestAnimationFrame(() => requestAnimationFrame(() => syncLyrics(true)));
  }
  function openMenu(button,index) {
    const favorite = state.favorites.includes(index);
    menu.innerHTML = `<button data-ms-action="favorite" data-index="${index}">${svg.heart}<span>${favorite?copy.removeFavorite:copy.addFavorite}</span></button>${view==='queue'?`<button data-ms-action="remove-queue" data-index="${index}"><b class="musync-menu-symbol">×</b><span>${copy.removeQueue||copy.remove}</span></button>`:`<button data-ms-action="next" data-index="${index}">${svg.next}<span>${copy.playNext}</span></button><button data-ms-action="queue" data-index="${index}">${svg.queue}<span>${copy.addQueue}</span></button>`}${Object.keys(state.playlists).length?`<em>${copy.addList}</em>${Object.keys(state.playlists).map(name=>`<button data-ms-action="playlist" data-index="${index}" data-list="${encodeURIComponent(name)}">${svg.list}<span>${state.playlists[name].includes(index)?'− ':''}${escape(name)}</span></button>`).join('')}`:''}`;
    positionMenu(button);
  }
  function openListDialog(name='') {
    editingPlaylist = name;
    $('[data-ms-dialog-title]').textContent = name ? copy.rename : copy.newList;
    $('[data-ms-list-name]').value = name;
    listDialog.showModal();
    requestAnimationFrame(()=>{ $('[data-ms-list-name]').focus(); $('[data-ms-list-name]').select(); });
  }
  function openCurrentPlaylistMenu(button) {
    if (current < 0) return;
    const names = Object.keys(state.playlists);
    menu.innerHTML = `${names.length ? `<em>${copy.addList}</em>${names.map(name => `<button data-ms-action="playlist" data-index="${current}" data-list="${encodeURIComponent(name)}">${svg.list}<span>${state.playlists[name].includes(current)?'− ':''}${escape(name)}</span></button>`).join('')}` : ''}<button data-ms-action="create-for-current"><b class="musync-menu-symbol">＋</b><span>${copy.newList}</span></button>`;
    positionMenu(button);
  }
  function positionMenu(button) {
    const rect=button.getBoundingClientRect();
    menu.hidden=false;
    const width=menu.offsetWidth||230;
    menu.style.left=`${Math.max(12,Math.min(rect.right-width,innerWidth-width-12))}px`;
    menu.style.top=`${Math.max(12,Math.min(rect.bottom+8,innerHeight-menu.offsetHeight-12))}px`;
  }

  page.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-ms-view]');
    if (viewButton) { view=viewButton.dataset.msView; if(view!=='playlists') selectedPlaylist=''; render(); return; }
    const albumButton = event.target.closest('[data-ms-open-album]');
    if (albumButton) { selectedAlbum=albumButton.dataset.msOpenAlbum; view='album-detail'; render(); return; }
    if (event.target.closest('[data-ms-back-albums]')) { view='album'; render(); return; }
    const playButton = event.target.closest('[data-ms-play]');
    if (playButton) { const index=Number(playButton.dataset.msPlay); if(index===current){audio.paused?audio.play().catch(()=>{}):audio.pause();}else play(index); return; }
    const trackMenu = event.target.closest('[data-ms-track-menu]');
    if (trackMenu) return openMenu(trackMenu,Number(trackMenu.dataset.msTrackMenu));
    const listButton = event.target.closest('[data-ms-list]');
    if (listButton) {
      selectedPlaylist=listButton.dataset.msList === '__favorites__' ? '__favorites__' : decodeURIComponent(listButton.dataset.msList);
      render(); return;
    }
    const listMenu = event.target.closest('[data-ms-list-menu]');
    if (listMenu) {
      const name=decodeURIComponent(listMenu.dataset.msListMenu);
      menu.innerHTML=`<button data-ms-action="rename-list" data-list="${encodeURIComponent(name)}"><b class="musync-menu-symbol">✎</b><span>${copy.rename}</span></button><button data-ms-action="delete-list" data-list="${encodeURIComponent(name)}"><b class="musync-menu-symbol">×</b><span>${copy.remove}</span></button>`;
      positionMenu(listMenu); return;
    }
    const move = event.target.closest('[data-ms-move]');
    if (move) {
      const from=Number(move.dataset.position), to=move.dataset.msMove==='up'?from-1:from+1;
      if(to>=0&&to<state.queue.length) [state.queue[from],state.queue[to]]=[state.queue[to],state.queue[from]];
      save(); render(); return;
    }
    if (event.target.closest('[data-ms-create]')) return openListDialog();
    const currentListButton = event.target.closest('[data-ms-current-list]');
    if (currentListButton) { openCurrentPlaylistMenu(currentListButton); return; }
    const fullListButton = event.target.closest('[data-ms-full-list]');
    if (fullListButton) { openCurrentPlaylistMenu(fullListButton); return; }
    if (event.target.closest('.musync-expand')) {
      lyricsDetached=false;
      lyricsHost.classList.remove('is-manual');
      $('[data-ms-resync]').hidden=true;
      expanded.hidden=false;
      document.body.classList.add('musync-expanded-open');
      loadLyrics().then(()=>resetLyricsToPlayback());
      requestAnimationFrame(syncPlayer);
      return;
    }
    if (event.target.closest('.musync-expanded-back')) { expanded.classList.add('is-closing'); setTimeout(()=>{expanded.hidden=true;expanded.classList.remove('is-closing');document.body.classList.remove('musync-expanded-open');},260); return; }
    const lyric = event.target.closest('[data-ms-lyric]');
    if (lyric) {
      const targetTime=lyricLines[Number(lyric.dataset.msLyric)]?.time;
      if(!Number.isFinite(targetTime))return;
      lyricsDetached=false;
      lyricsHost.classList.remove('is-manual');
      $('[data-ms-resync]').hidden=true;
      expanded.dataset.lyricActive='';
      audio.addEventListener('seeked',()=>{syncLyrics(true);persistPlaybackPosition();},{once:true});
      audio.currentTime=Math.max(0,Math.min(targetTime,Number.isFinite(audio.duration)?audio.duration:targetTime));
      if(audio.paused)audio.play().catch(()=>{});
      return;
    }
    if (!event.target.closest('[data-ms-menu]')) menu.hidden=true;
  });
  menu.addEventListener('click', event => {
    const button=event.target.closest('[data-ms-action]'); if(!button)return;
    const action=button.dataset.msAction;
    if(action==='rename-list'){menu.hidden=true;return openListDialog(decodeURIComponent(button.dataset.list));}
    if(action==='create-for-current'){pendingPlaylistTrack=current;menu.hidden=true;return openListDialog();}
    if(action==='delete-list'){
      pendingDeletePlaylist=decodeURIComponent(button.dataset.list);
      menu.hidden=true;
      confirmDialog.showModal();
      return;
    }
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
    if(pendingPlaylistTrack>=0&&!state.playlists[name].includes(pendingPlaylistTrack))state.playlists[name].push(pendingPlaylistTrack);
    pendingPlaylistTrack=-1;
    selectedPlaylist=name;editingPlaylist='';save();render();
  });
  $('[data-ms-list-name]').addEventListener('keydown',event=>{
    if(event.key!=='Enter'||event.isComposing)return;
    event.preventDefault();
    $('[data-ms-list-save]').click();
  });
  $('[data-ms-delete-confirm]').addEventListener('click',()=>{
    const name=pendingDeletePlaylist;
    pendingDeletePlaylist='';
    if(!name)return;
    delete state.playlists[name];
    if(selectedPlaylist===name)selectedPlaylist='';
    save();render();
  });
  confirmDialog.addEventListener('close',()=>{pendingDeletePlaylist='';});
  $('[data-ms-search]').addEventListener('input',render);
  page.querySelectorAll('[data-ms-sort-key]').forEach(button=>button.addEventListener('click',()=>{
    const key=button.dataset.msSortKey;
    if(state.sort===key) state.sortDirection=state.sortDirection==='desc'?'asc':'desc';
    else { state.sort=key; state.sortDirection='asc'; }
    save();render();
  }));
  $('[data-ms-current-favorite]').addEventListener('click',()=>{if(current<0)return;state.favorites=state.favorites.includes(current)?state.favorites.filter(i=>i!==current):[...state.favorites,current];save();render();});
  $('[data-ms-full-favorite]').addEventListener('click',()=>{if(current<0)return;state.favorites=state.favorites.includes(current)?state.favorites.filter(i=>i!==current):[...state.favorites,current];save();render();});
  function togglePlaybackForView(){
    if(!audio.paused){audio.pause();return;}
    if(view==='album'||view==='queue'||(view==='playlists'&&!selectedPlaylist))return;
    const visible=[...tracksHost.querySelectorAll('[data-ms-track]')].map(row=>Number(row.dataset.msTrack));
    if(!visible.length)return;
    if(current>=0&&visible.includes(current))audio.play().catch(()=>{});
    else play(visible[0]);
  }
  $('[data-ms-toggle]').addEventListener('click',togglePlaybackForView);
  window.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!expanded.hidden&&!listDialog.open&&!confirmDialog.open){event.preventDefault();$('.musync-expanded-back').click();return;}
    if(event.code!=='Space'||event.repeat||page.hidden||$('[data-ms-app]').hidden)return;
    if(event.target instanceof Element&&event.target.closest('input,textarea,select,button,[contenteditable="true"]'))return;
    if(listDialog.open||confirmDialog.open)return;
    event.preventDefault();
    if(current>=0){audio.paused?audio.play().catch(()=>{}):audio.pause();return;}
    togglePlaybackForView();
  },{capture:true});
  $('[data-ms-prev]').addEventListener('click',previous);
  $('[data-ms-next]').addEventListener('click',next);
  $('[data-ms-shuffle]').addEventListener('click',()=>{state.shuffle=!state.shuffle;shufflePool=[];save();syncPlayer();});
  $('[data-ms-repeat]').addEventListener('click',()=>{state.repeat=state.repeat==='off'?'list':state.repeat==='list'?'one':'off';save();syncPlayer();});
  volume.value=String(Number.isFinite(Number(state.volume))?state.volume:1);paintRange(volume,Number(volume.value));
  $('[data-ms-full-volume]').value=volume.value;paintRange($('[data-ms-full-volume]'),Number(volume.value));
  function setVolume(value){audio.volume=Number(value);state.volume=audio.volume;volume.value=String(value);$('[data-ms-full-volume]').value=String(value);paintRange(volume,audio.volume);paintRange($('[data-ms-full-volume]'),audio.volume);save();}
  volume.addEventListener('input',()=>setVolume(volume.value));
  $('[data-ms-full-volume]').addEventListener('input',()=>setVolume($('[data-ms-full-volume]').value));
  progress.addEventListener('input',()=>seekFrom(progress));
  $('[data-ms-chords]').checked=state.showChords;
  $('[data-ms-chords]').addEventListener('change',event=>{
    state.showChords=event.target.checked;
    lyricsAutoScrolling=true;
    clearTimeout(lyricsAutoScrollTimer);
    lyricsHost.classList.toggle('hide-chords',!state.showChords);
    save();
    resetLyricsToPlayback();
    lyricsAutoScrollTimer=setTimeout(()=>{lyricsAutoScrolling=false;},650);
  });
  const detachLyrics=()=>{if(expanded.hidden||!lyricLines.length)return;lyricsDetached=true;lyricsHost.classList.add('is-manual');$('[data-ms-resync]').hidden=false;};
  lyricsHost.addEventListener('wheel',detachLyrics,{passive:true});
  lyricsHost.addEventListener('scroll',()=>{if(!lyricsAutoScrolling)detachLyrics();},{passive:true});
  $('[data-ms-resync]').addEventListener('click',()=>{lyricsDetached=false;lyricsHost.classList.remove('is-manual');$('[data-ms-resync]').hidden=true;syncLyrics(true);});
  function seekFrom(input){
    if(current<0)return;
    const duration=Number.isFinite(audio.duration)?audio.duration:tracks[current].duration;
    if(!Number.isFinite(duration)||duration<=0)return;
    lyricsDetached=false;
    lyricsAutoScrolling=true;
    lyricsHost.classList.remove('is-manual');
    $('[data-ms-resync]').hidden=true;
    expanded.dataset.lyricActive='';
    audio.currentTime=Number(input.value)/1000*duration;
    cancelAnimationFrame(seekLyricsFrame);
    seekLyricsFrame=requestAnimationFrame(()=>syncLyrics(true));
    persistPlaybackPosition();
  }
  $('[data-ms-full-progress]').addEventListener('input',()=>seekFrom($('[data-ms-full-progress]')));
  let lastPositionSave=0;
  audio.addEventListener('timeupdate',()=>{const duration=Number.isFinite(audio.duration)?audio.duration:tracks[current]?.duration||0;const value=duration?String(Math.round(audio.currentTime/duration*1000)):'0';const ratio=duration?audio.currentTime/duration:0;$('[data-ms-current]').textContent=time(audio.currentTime);$('[data-ms-full-current]').textContent=time(audio.currentTime);progress.value=value;$('[data-ms-full-progress]').value=value;paintRange(progress,ratio);paintRange($('[data-ms-full-progress]'),ratio);syncLyrics();if(current>=0&&Date.now()-lastPositionSave>3000){persistPlaybackPosition();lastPositionSave=Date.now();}});
  audio.addEventListener('loadedmetadata',syncPlayer);audio.addEventListener('play',syncPlayer);audio.addEventListener('pause',()=>{if(current>=0){state.currentTrack=current;state.currentTime=audio.currentTime;save();}syncPlayer();});audio.addEventListener('ended',next);
  $('[data-ms-full-toggle]').addEventListener('click',togglePlaybackForView);
  $('[data-ms-full-prev]').addEventListener('click',previous);$('[data-ms-full-next]').addEventListener('click',next);
  $('[data-ms-full-shuffle]').addEventListener('click',()=>{state.shuffle=!state.shuffle;shufflePool=[];save();syncPlayer();});
  $('[data-ms-full-repeat]').addEventListener('click',()=>{state.repeat=state.repeat==='off'?'list':state.repeat==='list'?'one':'off';save();syncPlayer();});
  const launch=document.querySelector('.musyc-launch');
  launch?.addEventListener('click',()=>window.naviesOpenRoute?.('musync'));
  function syncAccess(){
    state=loadState();restoreUi();volume.value=String(Number.isFinite(Number(state.volume))?state.volume:1);audio.volume=Number(volume.value);$('[data-ms-full-volume]').value=volume.value;paintRange(volume,audio.volume);paintRange($('[data-ms-full-volume]'),audio.volume);
    const loggedIn=Boolean(window.naviesCurrentMember?.());
    if(!loggedIn){if(!audio.paused)audio.pause();audio.currentTime=0;current=-1;}
    if(loggedIn)restoreSavedTrack();
    launch.hidden=!loggedIn;$('[data-ms-app]').hidden=!loggedIn;$('.musync-login-gate').hidden=loggedIn;render();
    if (loggedIn) loadRemoteState();
    if(location.hash==='#musync') requestAnimationFrame(()=>window.naviesOpenRoute?.('musync',false));
  }
  $('.musync-login-gate form').addEventListener('submit',async event=>{
    event.preventDefault();
    const form=event.currentTarget,error=form.querySelector('[data-ms-login-error]'),button=form.querySelector('button');
    error.textContent='';button.disabled=true;
    try{
      const response=await fetch(`${apiUrl}/member-login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:form.username.value,password:form.password.value})});
      const result=await response.json();if(!response.ok)throw new Error();
      localStorage.setItem('navies-member-auth',JSON.stringify(result));localStorage.setItem('navies-member-session',result.member.username);form.reset();window.dispatchEvent(new CustomEvent('navies-auth-change',{detail:{member:result.member.username}}));
    }catch(_){error.textContent=copy.loginError;}finally{button.disabled=false;}
  });
  window.addEventListener('navies-auth-change',syncAccess);
  window.addEventListener('navies-route-change',event=>{
    if(event.detail?.route==='musync') { window.naviesPauseSiteMusicForNavyAudio?.(); render(); }
    else if(!audio.paused){audio.pause();window.naviesResumeSiteMusicAfterNavyAudio?.();}
  });
  const persistAndPause=()=>{persistPlaybackPosition(true);audio.pause();};
  window.addEventListener('pagehide',persistAndPause);
  window.addEventListener('beforeunload',persistAndPause);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persistPlaybackPosition(true);});
  render();syncAccess();
})();
