const loginPanel = document.querySelector('#login');
const dashboard = document.querySelector('#member-dashboard');
const spaceEntry = document.querySelector('.space-entry');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const memberName = document.querySelector('#member-name');
const dashboardBar = document.querySelector('.dashboard-bar');
const portalApiUrl = String(window.NAVIES_ADMIN_API_URL || '').replace(/\/$/, '');
const portalAdminSessionKey = 'navies-admin-session';
const portalLanguage = (document.documentElement.lang || 'es').slice(0, 2);
const editorCopies = {
  es:{ edit:'Editar página', tools:'Herramientas de administración', title:'Editar página', intro:'Gestiona el contenido publicado en Inicio y Espacio Navy.', back:'Volver a Espacio Navy', home:'Inicio', space:'Espacio Navy', mainTexts:'Textos principales', mainTextsCopy:'Contenido en castellano, el idioma principal de la web.', concerts:'Conciertos', concertsCopy:'El primero será el concierto destacado de Inicio.', addConcert:'Añadir concierto', members:'Tarjetas de músicos', membersCopy:'Título, instrumento, descripción breve y texto ampliado.', dates:'Fechas internas', datesCopy:'Ensayos, ensayos generales, extras, conciertos y grabaciones.', addDate:'Añadir fecha', setlist:'Repertorio', setlistCopy:'El orden guardado será el que verá toda la banda.', addSong:'Añadir canción', links:'Enlaces útiles', linksCopy:'Accesos compartidos de la banda.', addLink:'Añadir enlace', save:'Guardar cambios', remove:'Eliminar', up:'Subir', down:'Bajar', type:'Tipo', altName:'Nombre alternativo', altPlaceholder:'Opcional, salvo en Otro', date:'Fecha', time:'Hora', place:'Lugar', song:'Canción', name:'Nombre', web:'Dirección web', instrument:'Instrumento', cardTitle:'Título', short:'Descripción breve', long:'Descripción ampliada', presentation:'Presentación principal', sound:'Descripción del sonido', band:'Presentación de la banda', day:'Día (opcional)', month:'Mes', year:'Año', rehearsal:'Ensayo', extra:'Ensayo Extra', general:'Ensayo General', concert:'Concierto', recording:'Grabación', other:'Otro', saving:'Guardando…', saved:'Cambios guardados.', loadError:'No se ha podido cargar el contenido.', expired:'La sesión de administración ha caducado.', expiredAgain:'La sesión ha caducado. Vuelve a introducir el código.', saveError:'No se han podido guardar los cambios.', confirmDelete:'¿Seguro que quieres eliminar este elemento?', newConcert:'Nuevo concierto' },
  ca:{ edit:'Editar pàgina', tools:'Eines d’administració', title:'Editar pàgina', intro:'Gestiona el contingut publicat a Inici i Espai Navy.', back:'Tornar a Espai Navy', home:'Inici', space:'Espai Navy', mainTexts:'Textos principals', mainTextsCopy:'Contingut en castellà, l’idioma principal del web.', concerts:'Concerts', concertsCopy:'El primer serà el concert destacat d’Inici.', addConcert:'Afegir concert', members:'Targetes de músics', membersCopy:'Títol, instrument, descripció breu i text ampliat.', dates:'Dates internes', datesCopy:'Assajos, assajos generals, extres, concerts i gravacions.', addDate:'Afegir data', setlist:'Repertori', setlistCopy:'L’ordre desat serà el que veurà tota la banda.', addSong:'Afegir cançó', links:'Enllaços útils', linksCopy:'Accessos compartits de la banda.', addLink:'Afegir enllaç', save:'Desar canvis', remove:'Eliminar', up:'Pujar', down:'Baixar', type:'Tipus', altName:'Nom alternatiu', altPlaceholder:'Opcional, excepte a Altres', date:'Data', time:'Hora', place:'Lloc', song:'Cançó', name:'Nom', web:'Adreça web', instrument:'Instrument', cardTitle:'Títol', short:'Descripció breu', long:'Descripció ampliada', presentation:'Presentació principal', sound:'Descripció del so', band:'Presentació de la banda', day:'Dia (opcional)', month:'Mes', year:'Any', rehearsal:'Assaig', extra:'Assaig extra', general:'Assaig general', concert:'Concert', recording:'Gravació', other:'Altres', saving:'Desant…', saved:'Canvis desats.', loadError:'No s’ha pogut carregar el contingut.', expired:'La sessió d’administració ha caducat.', expiredAgain:'La sessió ha caducat. Torna a introduir el codi.', saveError:'No s’han pogut desar els canvis.', confirmDelete:'Segur que vols eliminar aquest element?', newConcert:'Concert nou' },
  en:{ edit:'Edit page', tools:'Administration tools', title:'Edit page', intro:'Manage the content published on Home and Navy Space.', back:'Back to Navy Space', home:'Home', space:'Navy Space', mainTexts:'Main text', mainTextsCopy:'Content in Spanish, the website’s primary language.', concerts:'Shows', concertsCopy:'The first one will be the featured show on Home.', addConcert:'Add show', members:'Musician cards', membersCopy:'Title, instrument, short description and expanded text.', dates:'Internal dates', datesCopy:'Rehearsals, dress rehearsals, extras, shows and recordings.', addDate:'Add date', setlist:'Setlist', setlistCopy:'The saved order is what the whole band will see.', addSong:'Add song', links:'Useful links', linksCopy:'Shared band resources.', addLink:'Add link', save:'Save changes', remove:'Delete', up:'Move up', down:'Move down', type:'Type', altName:'Alternative name', altPlaceholder:'Optional, except for Other', date:'Date', time:'Time', place:'Location', song:'Song', name:'Name', web:'Web address', instrument:'Instrument', cardTitle:'Title', short:'Short description', long:'Expanded description', presentation:'Main introduction', sound:'Sound description', band:'Band introduction', day:'Day (optional)', month:'Month', year:'Year', rehearsal:'Rehearsal', extra:'Extra rehearsal', general:'Dress rehearsal', concert:'Show', recording:'Recording', other:'Other', saving:'Saving…', saved:'Changes saved.', loadError:'The content could not be loaded.', expired:'The administration session has expired.', expiredAgain:'The session has expired. Enter the code again.', saveError:'The changes could not be saved.', confirmDelete:'Are you sure you want to delete this item?', newConcert:'New show' },
  fr:{ edit:'Modifier la page', tools:'Outils d’administration', title:'Modifier la page', intro:'Gérez le contenu publié sur l’Accueil et l’Espace Navy.', back:'Retour à l’Espace Navy', home:'Accueil', space:'Espace Navy', mainTexts:'Textes principaux', mainTextsCopy:'Contenu en espagnol, la langue principale du site.', concerts:'Concerts', concertsCopy:'Le premier sera le concert mis en avant sur l’Accueil.', addConcert:'Ajouter un concert', members:'Cartes des musiciens', membersCopy:'Titre, instrument, description courte et texte détaillé.', dates:'Dates internes', datesCopy:'Répétitions, générales, extras, concerts et enregistrements.', addDate:'Ajouter une date', setlist:'Répertoire', setlistCopy:'L’ordre enregistré sera visible par tout le groupe.', addSong:'Ajouter une chanson', links:'Liens utiles', linksCopy:'Ressources partagées du groupe.', addLink:'Ajouter un lien', save:'Enregistrer', remove:'Supprimer', up:'Monter', down:'Descendre', type:'Type', altName:'Nom alternatif', altPlaceholder:'Facultatif, sauf pour Autre', date:'Date', time:'Heure', place:'Lieu', song:'Chanson', name:'Nom', web:'Adresse web', instrument:'Instrument', cardTitle:'Titre', short:'Description courte', long:'Description détaillée', presentation:'Présentation principale', sound:'Description du son', band:'Présentation du groupe', day:'Jour (facultatif)', month:'Mois', year:'Année', rehearsal:'Répétition', extra:'Répétition supplémentaire', general:'Répétition générale', concert:'Concert', recording:'Enregistrement', other:'Autre', saving:'Enregistrement…', saved:'Modifications enregistrées.', loadError:'Impossible de charger le contenu.', expired:'La session d’administration a expiré.', expiredAgain:'La session a expiré. Saisissez de nouveau le code.', saveError:'Impossible d’enregistrer les modifications.', confirmDelete:'Voulez-vous vraiment supprimer cet élément ?', newConcert:'Nouveau concert' },
  it:{ edit:'Modifica pagina', tools:'Strumenti di amministrazione', title:'Modifica pagina', intro:'Gestisci i contenuti pubblicati su Home e Spazio Navy.', back:'Torna a Spazio Navy', home:'Home', space:'Spazio Navy', mainTexts:'Testi principali', mainTextsCopy:'Contenuto in spagnolo, la lingua principale del sito.', concerts:'Concerti', concertsCopy:'Il primo sarà il concerto in evidenza nella Home.', addConcert:'Aggiungi concerto', members:'Schede dei musicisti', membersCopy:'Titolo, strumento, descrizione breve e testo esteso.', dates:'Date interne', datesCopy:'Prove, prove generali, extra, concerti e registrazioni.', addDate:'Aggiungi data', setlist:'Repertorio', setlistCopy:'L’ordine salvato sarà visibile a tutta la band.', addSong:'Aggiungi brano', links:'Link utili', linksCopy:'Risorse condivise della band.', addLink:'Aggiungi link', save:'Salva modifiche', remove:'Elimina', up:'Sposta su', down:'Sposta giù', type:'Tipo', altName:'Nome alternativo', altPlaceholder:'Facoltativo, tranne per Altro', date:'Data', time:'Ora', place:'Luogo', song:'Brano', name:'Nome', web:'Indirizzo web', instrument:'Strumento', cardTitle:'Titolo', short:'Descrizione breve', long:'Descrizione estesa', presentation:'Presentazione principale', sound:'Descrizione del suono', band:'Presentazione della band', day:'Giorno (facoltativo)', month:'Mese', year:'Anno', rehearsal:'Prova', extra:'Prova extra', general:'Prova generale', concert:'Concerto', recording:'Registrazione', other:'Altro', saving:'Salvataggio…', saved:'Modifiche salvate.', loadError:'Impossibile caricare il contenuto.', expired:'La sessione di amministrazione è scaduta.', expiredAgain:'La sessione è scaduta. Inserisci di nuovo il codice.', saveError:'Impossibile salvare le modifiche.', confirmDelete:'Vuoi davvero eliminare questo elemento?', newConcert:'Nuovo concerto' }
};
const editorText = editorCopies[portalLanguage] || editorCopies.es;
Object.assign(editorText, ({
  es:{ live:'Navies Live', liveTitle:'Título de Navies Live', liveDescription:'Descripción de Navies Live', socialNetworks:'Redes sociales', socialNetworksCopy:'Enlaces públicos mostrados en la página de Inicio.', addSocial:'Añadir red', dialogTitle:'Título interior', socialLabel:'Texto del enlace', socialUrl:'Enlace personal', siteEditing:'Edición del sitio', general:'Ajustes generales', generalCopy:'Preferencias comunes para toda la web.', defaultSeason:'Tema predeterminado', initialPlayback:'Primera canción del reproductor', randomPlayback:'Aleatoria', customPlayback:'Canción personalizada', initialSong:'Canción inicial', countdownSetting:'Landing y cuenta atrás', enabled:'Activada', disabled:'Desactivada', initialVolume:'Volumen inicial', lowVolume:'Bajo', mediumVolume:'Medio', highVolume:'Alto', fallbackLanguage:'Idioma de respaldo', faviconMode:'Icono de la pestaña', dynamicFavicon:'Dinámico · color estacional', staticFavicon:'Estático · punto verde', saveBeforeExit:'Hay cambios sin guardar. ¿Quieres guardarlos antes de salir?', singer:'Cantante' },
  ca:{ live:'Navies Live', liveTitle:'Títol de Navies Live', liveDescription:'Descripció de Navies Live', socialNetworks:'Xarxes socials', socialNetworksCopy:'Enllaços públics mostrats a la pàgina d’Inici.', addSocial:'Afegir xarxa', dialogTitle:'Títol interior', socialLabel:'Text de l’enllaç', socialUrl:'Enllaç personal', siteEditing:'Edició del lloc', general:'Configuració general', generalCopy:'Preferències comunes per a tot el web.', defaultSeason:'Tema predeterminat', initialPlayback:'Primera cançó del reproductor', randomPlayback:'Aleatòria', customPlayback:'Cançó personalitzada', initialSong:'Cançó inicial', countdownSetting:'Landing i compte enrere', enabled:'Activat', disabled:'Desactivat', initialVolume:'Volum inicial', lowVolume:'Baix', mediumVolume:'Mitjà', highVolume:'Alt', fallbackLanguage:'Idioma de reserva', faviconMode:'Icona de la pestanya', dynamicFavicon:'Dinàmica · color estacional', staticFavicon:'Estàtica · punt verd', saveBeforeExit:'Hi ha canvis sense desar. Vols desar-los abans de sortir?', singer:'Cantant' },
  en:{ live:'Navies Live', liveTitle:'Navies Live title', liveDescription:'Navies Live description', socialNetworks:'Social media', socialNetworksCopy:'Public links shown on the Home page.', addSocial:'Add social link', dialogTitle:'Inner title', socialLabel:'Link text', socialUrl:'Personal link', siteEditing:'Site editing', general:'General settings', generalCopy:'Shared preferences for the whole website.', defaultSeason:'Default theme', initialPlayback:'First player track', randomPlayback:'Random', customPlayback:'Custom track', initialSong:'First track', countdownSetting:'Landing and countdown', enabled:'Enabled', disabled:'Disabled', initialVolume:'Initial volume', lowVolume:'Low', mediumVolume:'Medium', highVolume:'High', fallbackLanguage:'Fallback language', faviconMode:'Browser tab icon', dynamicFavicon:'Dynamic · seasonal colour', staticFavicon:'Static · green dot', saveBeforeExit:'There are unsaved changes. Save them before leaving?', singer:'Singer' },
  fr:{ live:'Navies Live', liveTitle:'Titre de Navies Live', liveDescription:'Description de Navies Live', socialNetworks:'Réseaux sociaux', socialNetworksCopy:'Liens publics affichés sur la page d’accueil.', addSocial:'Ajouter un réseau', dialogTitle:'Titre intérieur', socialLabel:'Texte du lien', socialUrl:'Lien personnel', siteEditing:'Édition du site', general:'Réglages généraux', generalCopy:'Préférences communes à tout le site.', defaultSeason:'Thème par défaut', initialPlayback:'Premier morceau du lecteur', randomPlayback:'Aléatoire', customPlayback:'Morceau personnalisé', initialSong:'Morceau initial', countdownSetting:'Accueil et compte à rebours', enabled:'Activé', disabled:'Désactivé', initialVolume:'Volume initial', lowVolume:'Faible', mediumVolume:'Moyen', highVolume:'Élevé', fallbackLanguage:'Langue de secours', faviconMode:'Icône de l’onglet', dynamicFavicon:'Dynamique · couleur saisonnière', staticFavicon:'Statique · point vert', saveBeforeExit:'Des modifications ne sont pas enregistrées. Les enregistrer avant de quitter ?', singer:'Chanteuse' },
  it:{ live:'Navies Live', liveTitle:'Titolo di Navies Live', liveDescription:'Descrizione di Navies Live', socialNetworks:'Social media', socialNetworksCopy:'Link pubblici mostrati nella pagina Home.', addSocial:'Aggiungi social', dialogTitle:'Titolo interno', socialLabel:'Testo del link', socialUrl:'Link personale', siteEditing:'Modifica sito', general:'Impostazioni generali', generalCopy:'Preferenze comuni per tutto il sito.', defaultSeason:'Tema predefinito', initialPlayback:'Primo brano del lettore', randomPlayback:'Casuale', customPlayback:'Brano personalizzato', initialSong:'Brano iniziale', countdownSetting:'Landing e conto alla rovescia', enabled:'Attivato', disabled:'Disattivato', initialVolume:'Volume iniziale', lowVolume:'Basso', mediumVolume:'Medio', highVolume:'Alto', fallbackLanguage:'Lingua di riserva', faviconMode:'Icona della scheda', dynamicFavicon:'Dinamica · colore stagionale', staticFavicon:'Statica · punto verde', saveBeforeExit:'Ci sono modifiche non salvate. Vuoi salvarle prima di uscire?', singer:'Cantante' }
}[portalLanguage] || {}));
Object.assign(editorText, ({
  es:{ users:'Usuarios', usersCopy:'Gestiona credenciales y acceso a cada formación.', addUser:'Añadir usuario', username:'Usuario', displayName:'Nombre visible', newPassword:'Nueva contraseña', accessNavies:'The Navies', accessCorBand:'Cor-Band', accessStrings:'Conjunto de Cuerdas' },
  ca:{ users:'Usuaris', usersCopy:'Gestiona credencials i accés a cada formació.', addUser:'Afegir usuari', username:'Usuari', displayName:'Nom visible', newPassword:'Contrasenya nova', accessNavies:'The Navies', accessCorBand:'Cor-Band', accessStrings:'Conjunt de Cordes' },
  en:{ users:'Users', usersCopy:'Manage credentials and access to each ensemble.', addUser:'Add user', username:'Username', displayName:'Display name', newPassword:'New password', accessNavies:'The Navies', accessCorBand:'Cor-Band', accessStrings:'String Ensemble' },
  fr:{ users:'Utilisateurs', usersCopy:'Gérez les identifiants et les accès à chaque formation.', addUser:'Ajouter', username:'Utilisateur', displayName:'Nom affiché', newPassword:'Nouveau mot de passe', accessNavies:'The Navies', accessCorBand:'Cor-Band', accessStrings:'Ensemble à cordes' },
  it:{ users:'Utenti', usersCopy:'Gestisci credenziali e accesso a ogni formazione.', addUser:'Aggiungi utente', username:'Utente', displayName:'Nome visibile', newPassword:'Nuova password', accessNavies:'The Navies', accessCorBand:'Cor-Band', accessStrings:"Ensemble d’archi" }
}[portalLanguage] || {}));
Object.assign(editorText, ({
  es:{ unsavedTitle:'¿Quieres guardar los cambios?', unsavedCopy:'Tienes cambios sin guardar. Elige qué quieres hacer antes de salir de la edición.', saveAndExit:'Guardar y salir', exitWithoutSaving:'Salir sin guardar', returnToEditing:'Volver a la edición' },
  ca:{ unsavedTitle:'Vols desar els canvis?', unsavedCopy:'Tens canvis sense desar. Tria què vols fer abans de sortir de l’edició.', saveAndExit:'Desar i sortir', exitWithoutSaving:'Sortir sense desar', returnToEditing:'Tornar a l’edició' },
  en:{ unsavedTitle:'Save your changes?', unsavedCopy:'You have unsaved changes. Choose what to do before leaving the editor.', saveAndExit:'Save and leave', exitWithoutSaving:'Leave without saving', returnToEditing:'Return to editing' },
  fr:{ unsavedTitle:'Enregistrer les modifications ?', unsavedCopy:'Des modifications ne sont pas enregistrées. Choisissez quoi faire avant de quitter l’édition.', saveAndExit:'Enregistrer et quitter', exitWithoutSaving:'Quitter sans enregistrer', returnToEditing:'Revenir à l’édition' },
  it:{ unsavedTitle:'Salvare le modifiche?', unsavedCopy:'Ci sono modifiche non salvate. Scegli cosa fare prima di uscire dalla modifica.', saveAndExit:'Salva ed esci', exitWithoutSaving:'Esci senza salvare', returnToEditing:'Torna alla modifica' }
}[portalLanguage] || {}));

localStorage.removeItem('navies-demo-chat');
localStorage.removeItem('navies-demo-member');

const portalAssetPrefix = window.__naviesForcedLanguage ? '../' : '';
const scoreRoot = `${portalAssetPrefix}scores`;
const audioRoot = `${portalAssetPrefix}audios`;
const scoreLibrary = {
  'shake-it-off': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'baby-one-more-time': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'sweet-caroline': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'dont-look-back-in-anger': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['bass', 'bajo.pdf']
  ],
  'the-final-countdown': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'have-you-ever-seen-the-rain': [
    ['lyrics', 'letra.pdf'], ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'the-final-countdown-reprise': [
    ['chords', 'acordes.pdf'], ['keyboard', 'teclado.pdf'], ['bass', 'bajo.pdf']
  ],
  'cor-band/billie-jean':[['lyrics','lletra.pdf']],
  'cor-band/stayin-alive':[['lyrics','lletra.pdf']],
  'cor-band/mystical-magical':[['lyrics','lletra.pdf'],['chords','acords.pdf']],
  'cor-band/texas-hold-em':[['lyrics','lletra.pdf'],['chords','acords.pdf']],
  'cor-band/training-season':[['lyrics','lletra.pdf'],['chords','acords.pdf']],
  'cor-band/livin-on-a-prayer':[['lyrics','lletra.pdf'],['keyboard','teclat.pdf']],
  'conjunt-de-cordes/balfourd-road':[['standard','estandard.pdf']],
  'conjunt-de-cordes/calliope-house':[['violin','violi.pdf'],['viola','viola.pdf'],['chords','acords.pdf']]
};

const auxiliarySongIds = new Set(Object.keys(scoreLibrary).filter((id) => id.includes('/')));
const ensembleCopies = {
  es:{ strings:'Conjunto de Cuerdas' }, ca:{ strings:'Conjunt de Cordes' }, en:{ strings:'String Ensemble' }, fr:{ strings:'Ensemble à cordes' }, it:{ strings:"Ensemble d’archi" }
};
const ensembleCopy = ensembleCopies[portalLanguage] || ensembleCopies.es;
const ensembleContent = {
  'cor-band':{
    numbered:false,
    songs:[
      { id:'cor-band/billie-jean', title:'Billie Jean' }, { id:'cor-band/stayin-alive', title:"Stayin’ Alive" },
      { id:'cor-band/mystical-magical', title:'Mystical Magical' }, { id:'cor-band/texas-hold-em', title:"Texas Hold’Em" },
      { id:'cor-band/training-season', title:'Training Season' }, { id:'cor-band/livin-on-a-prayer', title:"Livin’ On A Prayer" }
    ],
    events:[
      { id:'cor-band-2026-11-13', type:'rehearsal', name:'Ensayo', date:'2026-11-13', time:'19:30–21:30', location:'BCN Fusió Sant Andreu' },
      { id:'cor-band-2026-11-20', type:'general', name:'Ensayo General', date:'2026-11-20', time:'19:30–21:30', location:'BCN Fusió Sant Andreu' },
      { id:'cor-band-concert-2026-11-21', type:'concert', name:'Fiestas de La Sagrera 2026', date:'2026-11-21', time:'13:30', location:'Plaza Masadas' }
    ]
  },
  strings:{
    numbered:true,
    songs:[
      { id:'conjunt-de-cordes/balfourd-road', title:'Balfourd Road' },
      { id:'conjunt-de-cordes/calliope-house', title:'Calliope House' }
    ],
    events:[
      { id:'strings-2026-11-18', type:'rehearsal', name:'Ensayo', date:'2026-11-18', time:'20:00–20:30', location:'BCN Fusió La Sagrera' },
      { id:'strings-concert-2026-11-21', type:'concert', name:'Fiestas de La Sagrera 2026', date:'2026-11-21', time:'13:20', location:'Plaza Masadas' }
    ]
  }
};
let selectedEnsemble = 'the-navies';

let navyContent = null;
let editorUsers = [];

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

const eventTypeKeys = ['rehearsal','extra','general','concert','recording','other'];
function eventTypeLabel(type, language = portalLanguage) {
  const source = editorCopies[language] || editorCopies.es;
  return source[type] || source.other;
}
function isCanonicalEventName(name) {
  return eventTypeKeys.some((type) => Object.values(editorCopies).some((copy) => copy[type] === name));
}

function renderSetlist(songs, numbered = true) {
  const setlist = document.querySelector('.setlist');
  if (!setlist) return;
  setlist.replaceChildren();
  setlist.classList.toggle('setlist-unnumbered', !numbered);
  songs.forEach((song, index) => {
    const row = document.createElement('div');
    row.className = 'song-row';
    const number = document.createElement('span');
    number.className = 'song-number';
    number.textContent = numbered ? String(index + 1).padStart(2, '0') : '';
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
    name.textContent = event.name && !isCanonicalEventName(event.name) ? event.name : eventTypeLabel(event.type, locale.slice(0, 2));
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
  if (home.settings?.defaultSeason) window.naviesSetSeason?.(home.settings.defaultSeason, false);
  window.naviesConfigureSiteMusic?.(home.settings);
  window.naviesApplyGeneralSettings?.(home.settings);
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
    window.naviesEditableMemberTitles = Object.fromEntries(home.members.map((member) => [member.id, member.dialogTitle]));
    window.naviesEditableMemberSocials = Object.fromEntries(home.members.map((member) => [member.id, [
      { label:member.socialLabel, url:member.socialUrl },
      { label:member.socialLabel2, url:member.socialUrl2 },
      { label:member.socialLabel3, url:member.socialUrl3 }
    ].filter((social) => social.url)]));
    const liveTitle = document.querySelector('.tv-coming-soon h1');
    const liveDescription = document.querySelector('.tv-coming-soon > p');
    if (liveTitle) liveTitle.textContent = home.live.title;
    if (liveDescription) liveDescription.textContent = home.live.description;
  }
  const socials = document.querySelector('.socials');
  if (socials && Array.isArray(home.socials)) {
    socials.replaceChildren(...home.socials.map((social) => {
      const link = document.createElement('a');
      link.href = social.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = `${social.label} ↗`;
      return link;
    }));
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
  const featuredConcert = navyContent.home?.concerts?.find((concert) => concert.id === 'sagrera-2026');
  if (featuredConcert) featuredConcert.time = '14:00';
  const calendarConcert = navyContent.events?.find((event) => event.id === 'concert-2026-11-21');
  if (calendarConcert) calendarConcert.time = '14:00';
  const normalRehearsal = navyContent.events?.find((event) => event.id === 'rehearsal-2026-11-13');
  if (normalRehearsal) Object.assign(normalRehearsal, { time:'17:30–19:30', location:'BCN Fusió Sant Andreu' });
  const extraRehearsal = navyContent.events?.find((event) => event.id === 'extra-2026-11-14');
  if (extraRehearsal) Object.assign(extraRehearsal, { time:'18:00–20:00', location:'BCN Fusió La Sagrera' });
  const generalRehearsal = navyContent.events?.find((event) => event.id === 'general-2026-11-20');
  if (generalRehearsal) Object.assign(generalRehearsal, { time:'17:30–19:30', location:'BCN Fusió Sant Andreu' });
  renderHomeContent(navyContent.home);
  renderSelectedEnsemble();
  renderLinks(navyContent.links);
}

function theNaviesUpcomingEvents() {
  return navyContent?.events || [];
}

function renderSelectedEnsemble() {
  if (!navyContent) return;
  const content = selectedEnsemble === 'the-navies' ? { songs:navyContent.songs, events:theNaviesUpcomingEvents(), numbered:true } : ensembleContent[selectedEnsemble];
  renderSetlist(content.songs, content.numbered);
  renderEvents(content.events);
  document.querySelectorAll('[data-ensemble]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.ensemble === selectedEnsemble)));
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
  const materialCopies = {
    es:{ lyrics:'Letra', chords:'Acordes', keyboard:'Teclado', bass:'Bajo', standard:'Estándar', violin:'Violín', viola:'Viola' },
    ca:{ lyrics:'Lletra', chords:'Acords', keyboard:'Teclat', bass:'Baix', standard:'Estàndard', violin:'Violí', viola:'Viola' },
    en:{ lyrics:'Lyrics', chords:'Chords', keyboard:'Keys', bass:'Bass', standard:'Standard', violin:'Violin', viola:'Viola' },
    fr:{ lyrics:'Paroles', chords:'Accords', keyboard:'Clavier', bass:'Basse', standard:'Standard', violin:'Violon', viola:'Alto' },
    it:{ lyrics:'Testo', chords:'Accordi', keyboard:'Tastiere', bass:'Basso', standard:'Standard', violin:'Violino', viola:'Viola' }
  };
  const labels = materialCopies[portalLanguage] || materialCopies.es;
  document.querySelectorAll('[data-score-song]').forEach((container) => {
    container.replaceChildren();
    const song = container.dataset.scoreSong;
    const songTitle = container.closest('.song-row').querySelector('strong').textContent;
    (scoreLibrary[song] || []).forEach(([labelKey, filename]) => {
      const label = labels[labelKey] || labelKey;
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
    if (auxiliarySongIds.has(song)) return;
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

const ensembleSwitcher = document.createElement('div');
ensembleSwitcher.className = 'ensemble-switcher';
ensembleSwitcher.setAttribute('aria-label', ({ es:'Seleccionar formación', ca:'Seleccionar formació', en:'Select ensemble', fr:'Sélectionner la formation', it:'Seleziona formazione' })[portalLanguage] || 'Seleccionar formación');
ensembleSwitcher.innerHTML = `<button type="button" data-ensemble="the-navies" aria-pressed="true">The Navies</button><button type="button" data-ensemble="cor-band" aria-pressed="false">Cor-Band</button><button type="button" data-ensemble="strings" aria-pressed="false">${ensembleCopy.strings}</button>`;
dashboardBar?.insertAdjacentElement('afterend', ensembleSwitcher);
ensembleSwitcher.addEventListener('click', (event) => {
  const button = event.target.closest('[data-ensemble]');
  if (!button || button.dataset.ensemble === selectedEnsemble) return;
  selectedEnsemble = button.dataset.ensemble;
  const grid = dashboard.querySelector('.dashboard-grid');
  grid.classList.add('ensemble-changing');
  window.setTimeout(() => {
    renderSelectedEnsemble();
    grid.classList.remove('ensemble-changing');
    grid.classList.add('ensemble-entering');
    window.setTimeout(() => grid.classList.remove('ensemble-entering'), 420);
  }, 160);
});

function syncEnsembleAccess() {
  const access = window.naviesMemberAccess?.() || [];
  const buttons = [...ensembleSwitcher.querySelectorAll('[data-ensemble]')];
  buttons.forEach((button) => { button.hidden = !access.includes(button.dataset.ensemble); });
  const available = buttons.filter((button) => !button.hidden);
  ensembleSwitcher.hidden = available.length <= 1;
  const grid = dashboard.querySelector('.dashboard-grid');
  if (grid) grid.hidden = available.length === 0;
  if (available.length && !access.includes(selectedEnsemble)) {
    selectedEnsemble = available[0].dataset.ensemble;
    renderSelectedEnsemble();
  }
}

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

const editContentButton = document.createElement('a');
editContentButton.className = 'content-editor-trigger';
editContentButton.href = '#edicion-del-sitio';
editContentButton.textContent = editorText.siteEditing;
editContentButton.hidden = true;
document.querySelector('#main-nav [data-route="espacio-navy"]')?.after(editContentButton);

const contentEditor = document.createElement('section');
contentEditor.className = 'content-editor';
contentEditor.hidden = true;
contentEditor.innerHTML = `
  <div class="content-editor-shell">
    <header class="content-editor-header">
      <div><p class="eyebrow"><span></span> THE NAVIES</p><h2>${editorText.title}</h2><p>${editorText.intro}</p></div>
      <div class="content-editor-controls">
        <nav class="content-editor-tabs"><button type="button" data-editor-tab="home" aria-pressed="true">${editorText.home}</button><button type="button" data-editor-tab="space" aria-pressed="false">${editorText.space}</button><button type="button" data-editor-tab="general" aria-pressed="false">${editorText.general}</button><button type="button" data-editor-tab="users" aria-pressed="false">${editorText.users}</button></nav>
      </div>
    </header>
    <form class="content-editor-form" id="content-editor-form">
      <div class="editor-page" data-editor-page="home">
      <section class="editor-section">
        <div class="editor-section-head"><div><span>01</span><h3>${editorText.mainTexts}</h3><p>${editorText.mainTextsCopy}</p></div></div>
        <div class="editor-text-grid" data-editor-home-texts></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>02</span><h3>${editorText.concerts}</h3><p>${editorText.concertsCopy}</p></div><button type="button" data-editor-add="concert">${editorText.addConcert}</button></div>
        <div class="editor-list" data-editor-list="concerts"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>03</span><h3>${editorText.members}</h3><p>${editorText.membersCopy}</p></div></div>
        <div class="editor-list" data-editor-list="members"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>04</span><h3>${editorText.socialNetworks}</h3><p>${editorText.socialNetworksCopy}</p></div><button type="button" data-editor-add="social">${editorText.addSocial}</button></div>
        <div class="editor-list" data-editor-list="socials"></div>
      </section>
      </div>
      <div class="editor-page" data-editor-page="space" hidden>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>01</span><h3>${editorText.dates}</h3><p>${editorText.datesCopy}</p></div><button type="button" data-editor-add="event">${editorText.addDate}</button></div>
        <div class="editor-list" data-editor-list="events"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>02</span><h3>${editorText.setlist}</h3><p>${editorText.setlistCopy}</p></div><button type="button" data-editor-add="song">${editorText.addSong}</button></div>
        <div class="editor-list" data-editor-list="songs"></div>
      </section>
      <section class="editor-section">
        <div class="editor-section-head"><div><span>03</span><h3>${editorText.links}</h3><p>${editorText.linksCopy}</p></div><button type="button" data-editor-add="link">${editorText.addLink}</button></div>
        <div class="editor-list" data-editor-list="links"></div>
      </section>
      </div>
      <div class="editor-page" data-editor-page="general" hidden>
        <section class="editor-section"><div class="editor-section-head"><div><span>01</span><h3>${editorText.general}</h3><p>${editorText.generalCopy}</p></div></div><div class="editor-settings" data-editor-settings></div></section>
      </div>
      <div class="editor-page" data-editor-page="users" hidden>
        <section class="editor-section"><div class="editor-section-head"><div><span>01</span><h3>${editorText.users}</h3><p>${editorText.usersCopy}</p></div><button type="button" data-editor-add="user">${editorText.addUser}</button></div><div class="editor-list" data-editor-list="users"></div></section>
      </div>
      <div class="content-editor-bottom-actions"><div class="content-editor-actions"><button class="editor-save" type="submit">${editorText.save}</button><p class="content-editor-status" aria-live="polite"></p></div></div>
    </form>
  </div>
  <dialog class="editor-exit-dialog" aria-labelledby="editor-exit-title">
    <div class="editor-exit-panel">
      <p class="eyebrow"><span></span> THE NAVIES</p>
      <h2 id="editor-exit-title">${editorText.unsavedTitle}</h2>
      <p>${editorText.unsavedCopy}</p>
      <div class="editor-exit-actions">
        <button type="button" class="editor-exit-save" data-editor-exit="save">${editorText.saveAndExit}</button>
        <button type="button" class="editor-exit-discard" data-editor-exit="discard">${editorText.exitWithoutSaving}</button>
        <button type="button" class="editor-exit-cancel" data-editor-exit="cancel">${editorText.returnToEditing}</button>
      </div>
    </div>
  </dialog>`;
document.querySelector('.space-shell').append(contentEditor);

const editorForm = contentEditor.querySelector('.content-editor-form');
const editorStatus = contentEditor.querySelector('.content-editor-status');
const editorExitDialog = contentEditor.querySelector('.editor-exit-dialog');
let editorStatusTimer;
let editorDirty = false;
function setEditorStatus(message, temporary = false) {
  window.clearTimeout(editorStatusTimer);
  editorStatus.textContent = message;
  editorStatus.classList.toggle('is-visible', Boolean(message));
  if (temporary) editorStatusTimer = window.setTimeout(() => {
    editorStatus.classList.remove('is-visible');
    window.setTimeout(() => { editorStatus.textContent = ''; }, 220);
  }, 3200);
}

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
    [['up', '↑', editorText.up], ['down', '↓', editorText.down]].forEach(([action, symbol, label]) => {
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
  remove.textContent = editorText.remove;
  actions.append(remove);
  return actions;
}

function eventEditorRow(event = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-event-row';
  row.dataset.id = event.id || `event-${Date.now()}`;
  const typeLabel = document.createElement('label');
  typeLabel.innerHTML = `<span>${editorText.type}</span>`;
  const select = document.createElement('select');
  select.name = 'type';
  eventTypeKeys.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = eventTypeLabel(value);
    option.selected = event.type === value;
    select.append(option);
  });
  typeLabel.append(select);
  const alternate = field(editorText.altName, 'name', isCanonicalEventName(event.name) ? '' : event.name, 'text', { maxlength:'160', placeholder:editorText.altPlaceholder });
  const alternateInput = alternate.querySelector('input');
  const syncAlternative = () => { alternateInput.required = select.value === 'other'; };
  select.addEventListener('change', syncAlternative);
  syncAlternative();
  row.append(typeLabel, alternate, field(editorText.date, 'date', event.date, 'date', { required:'' }), field(editorText.time, 'time', event.time, 'text', { maxlength:'20', placeholder:'17:30–19:30' }), field(editorText.place, 'location', event.location, 'text', { maxlength:'160' }), rowActions('event'));
  return row;
}

function songEditorRow(song = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-song-row';
  row.dataset.id = song.id || '';
  row.append(field(editorText.song, 'title', song.title, 'text', { maxlength:'160', required:'' }), rowActions('song'));
  return row;
}

function linkEditorRow(link = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-link-row';
  row.dataset.id = link.id || '';
  row.append(field(editorText.name, 'label', link.label, 'text', { maxlength:'160', required:'' }), field(editorText.web, 'url', link.url, 'url', { maxlength:'500', required:'', placeholder:'https://…' }), rowActions('link'));
  return row;
}

function socialEditorRow(social = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-social-row';
  row.dataset.id = social.id || '';
  row.append(field(editorText.name, 'label', social.label, 'text', { maxlength:'160', required:'' }), field(editorText.web, 'url', social.url, 'url', { maxlength:'500', required:'', placeholder:'https://…' }), rowActions('social'));
  return row;
}

function userEditorRow(user = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-user-row';
  row.append(field(editorText.username, 'username', user.username, 'text', { maxlength:'40', required:'', autocapitalize:'none' }), field(editorText.displayName, 'name', user.name, 'text', { maxlength:'80', required:'' }), field(editorText.newPassword, 'password', '', 'password', { maxlength:'100', placeholder:user.username ? '••••••••' : '' }));
  const permissions = document.createElement('div');
  permissions.className = 'editor-user-access';
  [['the-navies',editorText.accessNavies],['cor-band',editorText.accessCorBand],['strings',editorText.accessStrings]].forEach(([value, label]) => {
    const option = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox'; input.name = 'access'; input.value = value; input.checked = user.access?.includes(value);
    const text = document.createElement('span'); text.textContent = label;
    option.append(input, text); permissions.append(option);
  });
  row.append(permissions, rowActions('user'));
  return row;
}

async function loadEditorUsers() {
  const session = contentSession();
  if (!session) return false;
  try {
    const response = await fetch(`${portalApiUrl}/users`, { headers:{ Authorization:`Bearer ${session.token}` } });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'users_failed');
    editorUsers = result.users || [];
    return true;
  } catch (_) { setEditorStatus(editorText.loadError); return false; }
}

function usersFromEditor() {
  return [...contentEditor.querySelectorAll('.editor-user-row')].map((row) => ({
    username:row.querySelector('[name="username"]').value.trim().toLowerCase(),
    name:row.querySelector('[name="name"]').value.trim(),
    password:row.querySelector('[name="password"]').value,
    access:[...row.querySelectorAll('[name="access"]:checked')].map((input) => input.value)
  }));
}

function concertEditorRow(concert = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-concert-row';
  row.dataset.id = concert.id || '';
  const monthLabelElement = document.createElement('label');
  monthLabelElement.innerHTML = `<span>${editorText.month}</span>`;
  const month = document.createElement('select');
  month.name = 'month';
  for (let index = 1; index <= 12; index += 1) {
    const value = String(index).padStart(2, '0');
    const option = document.createElement('option');
    option.value = value;
    option.textContent = monthLabel(value, portalLanguage);
    option.selected = concert.month === value;
    month.append(option);
  }
  monthLabelElement.append(month);
  row.append(field(editorText.name, 'name', concert.name, 'text', { maxlength:'160', required:'' }), field(editorText.day, 'day', concert.day, 'number', { min:'1', max:'31', inputmode:'numeric' }), monthLabelElement, field(editorText.year, 'year', concert.year || String(new Date().getFullYear()), 'number', { min:'2026', max:'2100', required:'' }), field(editorText.time, 'time', concert.time, 'time'), field(editorText.place, 'location', concert.location, 'text', { maxlength:'160' }), rowActions('concert'));
  return row;
}

function memberEditorRow(member = {}) {
  const row = document.createElement('div');
  row.className = 'editor-row editor-member-row';
  row.dataset.id = member.id || '';
  row.append(field(editorText.instrument, 'instrument', member.instrument, 'text', { maxlength:'160', required:'' }), field(editorText.cardTitle, 'title', member.title, 'text', { maxlength:'160', required:'' }), field(editorText.dialogTitle, 'dialogTitle', member.dialogTitle, 'text', { maxlength:'160', required:'' }), textAreaField(editorText.short, 'summary', member.summary, 300), textAreaField(editorText.long, 'bio', member.bio, 800), field(member.id === 'vocals' ? `${editorText.singer} 1 · ${editorText.socialLabel}` : editorText.socialLabel, 'socialLabel', member.socialLabel, 'text', { maxlength:'160' }), field(member.id === 'vocals' ? `${editorText.singer} 1 · ${editorText.socialUrl}` : editorText.socialUrl, 'socialUrl', member.socialUrl, 'url', { maxlength:'500', placeholder:'https://…' }));
  if (member.id === 'vocals') row.append(field(`${editorText.singer} 2 · ${editorText.socialLabel}`, 'socialLabel2', member.socialLabel2, 'text', { maxlength:'160' }), field(`${editorText.singer} 2 · ${editorText.socialUrl}`, 'socialUrl2', member.socialUrl2, 'url', { maxlength:'500', placeholder:'https://…' }), field(`${editorText.singer} 3 · ${editorText.socialLabel}`, 'socialLabel3', member.socialLabel3, 'text', { maxlength:'160' }), field(`${editorText.singer} 3 · ${editorText.socialUrl}`, 'socialUrl3', member.socialUrl3, 'url', { maxlength:'500', placeholder:'https://…' }));
  return row;
}

function populateEditor() {
  if (!navyContent) return;
  const homeTexts = contentEditor.querySelector('[data-editor-home-texts]');
  const settings = contentEditor.querySelector('[data-editor-settings]');
  const concertList = contentEditor.querySelector('[data-editor-list="concerts"]');
  const memberList = contentEditor.querySelector('[data-editor-list="members"]');
  const socialList = contentEditor.querySelector('[data-editor-list="socials"]');
  const eventList = contentEditor.querySelector('[data-editor-list="events"]');
  const songList = contentEditor.querySelector('[data-editor-list="songs"]');
  const linkList = contentEditor.querySelector('[data-editor-list="links"]');
  const userList = contentEditor.querySelector('[data-editor-list="users"]');
  homeTexts.replaceChildren(textAreaField(editorText.presentation, 'heroIntro', navyContent.home.texts.heroIntro), textAreaField(editorText.sound, 'soundBody', navyContent.home.texts.soundBody), textAreaField(editorText.band, 'bandBody', navyContent.home.texts.bandBody));
  const seasonField = document.createElement('label');
  seasonField.innerHTML = `<span>${editorText.defaultSeason}</span>`;
  const seasonSelect = document.createElement('select');
  seasonSelect.name = 'defaultSeason';
  const seasonNames = ({ es:{ spring:'🌸 Primavera', summer:'☀️ Verano', autumn:'🍁 Otoño', winter:'❄️ Invierno' }, ca:{ spring:'🌸 Primavera', summer:'☀️ Estiu', autumn:'🍁 Tardor', winter:'❄️ Hivern' }, en:{ spring:'🌸 Spring', summer:'☀️ Summer', autumn:'🍁 Autumn', winter:'❄️ Winter' }, fr:{ spring:'🌸 Printemps', summer:'☀️ Été', autumn:'🍁 Automne', winter:'❄️ Hiver' }, it:{ spring:'🌸 Primavera', summer:'☀️ Estate', autumn:'🍁 Autunno', winter:'❄️ Inverno' } })[portalLanguage];
  Object.entries(seasonNames).forEach(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; option.selected = navyContent.home.settings?.defaultSeason === value; seasonSelect.append(option); });
  seasonField.append(seasonSelect);
  const playbackField = document.createElement('div');
  playbackField.className = 'editor-setting-card editor-playback-setting';
  playbackField.innerHTML = `<span>${editorText.initialPlayback}</span>`;
  const playbackControl = document.createElement('div');
  playbackControl.className = 'editor-segmented';
  const currentPlayback = navyContent.home.settings?.initialPlayback || 'random';
  [['random',editorText.randomPlayback],['custom',editorText.customPlayback]].forEach(([value, label]) => {
    const optionLabel = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'initialPlayback';
    input.value = value;
    input.checked = currentPlayback === value;
    const text = document.createElement('span');
    text.textContent = label;
    optionLabel.append(input, text);
    playbackControl.append(optionLabel);
  });
  playbackField.append(playbackControl);
  const initialSongField = document.createElement('div');
  initialSongField.className = 'editor-nested-setting';
  initialSongField.innerHTML = `<span>${editorText.initialSong}</span>`;
  const initialSongSelect = document.createElement('select');
  initialSongSelect.name = 'initialSongId';
  const playableSongs = [
    ['shake-it-off','Taylor Swift — Shake It Off'],
    ['baby-one-more-time','Britney Spears — …Baby One More Time'],
    ['sweet-caroline','Neil Diamond — Sweet Caroline'],
    ['dont-look-back-in-anger',"Oasis — Don't Look Back in Anger"],
    ['the-final-countdown','Europe — The Final Countdown'],
    ['have-you-ever-seen-the-rain','Creedence Clearwater Revival — Have You Ever Seen the Rain?']
  ];
  playableSongs.forEach(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; option.selected = navyContent.home.settings?.initialSongId === value; initialSongSelect.append(option); });
  initialSongField.append(initialSongSelect);
  playbackField.append(initialSongField);
  const syncInitialSong = () => { initialSongField.hidden = !playbackControl.querySelector('[value="custom"]').checked; initialSongSelect.disabled = initialSongField.hidden; };
  playbackControl.addEventListener('change', syncInitialSong);
  syncInitialSong();
  const makeSettingsSelect = (name, title, options, current) => {
    const wrapper = document.createElement('label');
    wrapper.innerHTML = `<span>${title}</span>`;
    const select = document.createElement('select');
    select.name = name;
    options.forEach(([value, label]) => { const option = document.createElement('option'); option.value = value; option.textContent = label; option.selected = String(current) === value; select.append(option); });
    wrapper.append(select);
    return wrapper;
  };
  const countdownField = document.createElement('label');
  countdownField.className = 'editor-toggle-setting';
  const countdownTitle = document.createElement('span');
  countdownTitle.textContent = editorText.countdownSetting;
  const countdownSwitch = document.createElement('span');
  countdownSwitch.className = 'editor-switch';
  const countdownInput = document.createElement('input');
  countdownInput.type = 'checkbox';
  countdownInput.name = 'countdownEnabled';
  countdownInput.checked = navyContent.home.settings?.countdownEnabled ?? true;
  const countdownTrack = document.createElement('i');
  countdownTrack.setAttribute('aria-hidden', 'true');
  const countdownState = document.createElement('b');
  const syncCountdownState = () => { countdownState.textContent = countdownInput.checked ? editorText.enabled : editorText.disabled; };
  countdownInput.addEventListener('change', syncCountdownState);
  syncCountdownState();
  countdownSwitch.append(countdownInput, countdownTrack, countdownState);
  countdownField.append(countdownTitle, countdownSwitch);
  const volumeField = document.createElement('div');
  volumeField.className = 'editor-setting-card editor-volume-setting';
  volumeField.innerHTML = `<span>${editorText.initialVolume}</span>`;
  const volumeSlider = document.createElement('input');
  volumeSlider.type = 'range';
  volumeSlider.name = 'initialVolume';
  volumeSlider.min = '0';
  volumeSlider.max = '2';
  volumeSlider.step = '1';
  volumeSlider.value = String({ low:0, medium:1, high:2 }[navyContent.home.settings?.initialVolume] ?? 1);
  volumeSlider.setAttribute('aria-label', editorText.initialVolume);
  const syncVolumeSlider = () => volumeSlider.style.setProperty('--volume-track', `${Number(volumeSlider.value) * 50}%`);
  volumeSlider.addEventListener('input', syncVolumeSlider);
  syncVolumeSlider();
  const volumeLabels = document.createElement('div');
  volumeLabels.className = 'editor-volume-labels';
  volumeLabels.innerHTML = `<span>${editorText.lowVolume}</span><span>${editorText.mediumVolume}</span><span>${editorText.highVolume}</span>`;
  volumeField.append(volumeSlider, volumeLabels);
  const languageNames = { ca:'Català', es:'Castellano', en:'English', fr:'Français', it:'Italiano' };
  const fallbackField = makeSettingsSelect('fallbackLanguage', editorText.fallbackLanguage, ['ca','es','en','fr','it'].map((code) => [code,languageNames[code]]), navyContent.home.settings?.fallbackLanguage || 'es');
  const faviconField = makeSettingsSelect('faviconMode', editorText.faviconMode, [['dynamic',editorText.dynamicFavicon],['static',editorText.staticFavicon]], navyContent.home.settings?.faviconMode || 'dynamic');
  settings.replaceChildren(seasonField, playbackField, countdownField, volumeField, fallbackField, faviconField);
  concertList.replaceChildren(...navyContent.home.concerts.map(concertEditorRow));
  memberList.replaceChildren(...navyContent.home.members.map(memberEditorRow));
  socialList.replaceChildren(...navyContent.home.socials.map(socialEditorRow));
  eventList.replaceChildren(...navyContent.events.map(eventEditorRow));
  songList.replaceChildren(...navyContent.songs.map(songEditorRow));
  linkList.replaceChildren(...navyContent.links.map(linkEditorRow));
  userList.replaceChildren(...editorUsers.map(userEditorRow));
  editorDirty = false;
  setEditorStatus('');
}

function editorContent() {
  const homeTexts = contentEditor.querySelector('[data-editor-home-texts]');
  const defaultSeason = contentEditor.querySelector('[name="defaultSeason"]').value;
  const initialPlayback = contentEditor.querySelector('[name="initialPlayback"]:checked').value;
  const initialSongId = initialPlayback === 'custom' ? contentEditor.querySelector('[name="initialSongId"]').value : '';
  const countdownEnabled = contentEditor.querySelector('[name="countdownEnabled"]').checked;
  const initialVolume = ['low','medium','high'][Number(contentEditor.querySelector('[name="initialVolume"]').value)] || 'medium';
  const fallbackLanguage = contentEditor.querySelector('[name="fallbackLanguage"]').value;
  const faviconMode = contentEditor.querySelector('[name="faviconMode"]').value;
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
    dialogTitle:row.querySelector('[name="dialogTitle"]').value.trim(),
    summary:row.querySelector('[name="summary"]').value.trim(),
    bio:row.querySelector('[name="bio"]').value.trim(),
    socialLabel:row.querySelector('[name="socialLabel"]').value.trim(),
    socialUrl:row.querySelector('[name="socialUrl"]').value.trim(),
    socialLabel2:row.querySelector('[name="socialLabel2"]')?.value.trim() || '',
    socialUrl2:row.querySelector('[name="socialUrl2"]')?.value.trim() || '',
    socialLabel3:row.querySelector('[name="socialLabel3"]')?.value.trim() || '',
    socialUrl3:row.querySelector('[name="socialUrl3"]')?.value.trim() || ''
  }));
  const usedSocialIds = new Set();
  const socials = [...contentEditor.querySelectorAll('.editor-social-row')].map((row, index) => {
    const label = row.querySelector('[name="label"]').value.trim();
    let id = row.dataset.id || slugify(label);
    while (usedSocialIds.has(id)) id = `${slugify(label)}-${index + 1}`;
    usedSocialIds.add(id);
    return { id, label, url:row.querySelector('[name="url"]').value.trim() };
  });
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
  return { home:{ settings:{ defaultSeason, initialPlayback, initialSongId, countdownEnabled, initialVolume, fallbackLanguage, faviconMode }, live:navyContent.home.live, texts:{ heroIntro:homeTexts.querySelector('[name="heroIntro"]').value.trim(), soundBody:homeTexts.querySelector('[name="soundBody"]').value.trim(), bandBody:homeTexts.querySelector('[name="bandBody"]').value.trim() }, concerts, members, socials }, events, songs, links };
}

function syncEditorAccess() {
  const isPau = localStorage.getItem('navies-member-session') === 'pauescobedo';
  const canEdit = Boolean(isPau && contentSession());
  editContentButton.hidden = !canEdit;
  if (!isPau || !contentSession()) closeContentEditor(true);
}

function selectEditorPage(route) {
  const page = route === 'home' ? 'home' : route === 'espacio-navy' ? 'space' : 'general';
  contentEditor.querySelectorAll('[data-editor-tab]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.editorTab === page)));
  contentEditor.querySelectorAll('[data-editor-page]').forEach((item) => { item.hidden = item.dataset.editorPage !== page; });
}

editContentButton.addEventListener('click', async (event) => {
  event.preventDefault();
  if (!contentSession()) return syncEditorAccess();
  const menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle?.getAttribute('aria-expanded') === 'true') menuToggle.click();
  editorOriginRoute = document.documentElement.dataset.route || 'home';
  if (!navyContent) await loadNavyContent();
  if (!navyContent) {
    setEditorStatus(editorText.loadError);
    return;
  }
  await loadEditorUsers();
  populateEditor();
  selectEditorPage(editorOriginRoute);
  dashboard.hidden = true;
  if (editorOriginRoute !== 'espacio-navy') document.querySelector(`#main-nav [data-route="espacio-navy"]`)?.click();
  window.setTimeout(() => {
    contentEditorOpen = true;
    dashboard.hidden = true;
    contentEditor.hidden = false;
    window.scrollTo({ top:0, behavior:'smooth' });
    requestAnimationFrame(() => contentEditor.classList.add('is-visible'));
    document.querySelectorAll('#main-nav a').forEach((link) => link.classList.toggle('active', link === editContentButton));
    document.title = `${editorText.siteEditing} — The Navies`;
  }, editorOriginRoute === 'espacio-navy' ? 0 : 240);
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

contentEditor.querySelectorAll('[data-editor-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    contentEditor.querySelectorAll('[data-editor-tab]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    contentEditor.querySelectorAll('[data-editor-page]').forEach((page) => { page.hidden = page.dataset.editorPage !== button.dataset.editorTab; });
  });
});

window.addEventListener('navies-route-change', (event) => {
  editContentButton.classList.remove('active');
  if (!contentEditorOpen) return;
  contentEditorOpen = false;
  contentEditor.classList.remove('is-visible');
  contentEditor.hidden = true;
  dashboard.hidden = event.detail?.route !== 'espacio-navy';
});

contentEditor.addEventListener('click', (event) => {
  const add = event.target.closest('[data-editor-add]');
  if (add) {
    const kind = add.dataset.editorAdd;
    const list = contentEditor.querySelector(`[data-editor-list="${kind}s"]`);
    const row = kind === 'event' ? eventEditorRow({ type:'rehearsal', name:'', date:localToday(), time:'17:30', location:'' }) : kind === 'song' ? songEditorRow() : kind === 'concert' ? concertEditorRow({ name:editorText.newConcert, day:'', month:'12', year:String(new Date().getFullYear()), time:'', location:'' }) : kind === 'social' ? socialEditorRow() : kind === 'user' ? userEditorRow({ access:[] }) : linkEditorRow();
    list.append(row);
    editorDirty = true;
    list.lastElementChild.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }
  const action = event.target.closest('[data-editor-action]');
  if (!action) return;
  const row = action.closest('.editor-row');
  if (action.dataset.editorAction === 'remove') {
    if (window.confirm(editorText.confirmDelete)) { row.remove(); editorDirty = true; }
  } else if (action.dataset.editorAction === 'up' && row.previousElementSibling) {
    row.parentNode.insertBefore(row, row.previousElementSibling);
    editorDirty = true;
  } else if (action.dataset.editorAction === 'down' && row.nextElementSibling) {
    row.parentNode.insertBefore(row.nextElementSibling, row);
    editorDirty = true;
  }
});

editorForm.addEventListener('input', () => { editorDirty = true; });
editorForm.addEventListener('change', () => { editorDirty = true; });

async function saveEditorChanges() {
  const session = contentSession();
  if (!session) {
    setEditorStatus(editorText.expired);
    syncEditorAccess();
    return false;
  }
  const save = contentEditor.querySelector('.editor-save');
  save.disabled = true;
  setEditorStatus(editorText.saving);
  try {
    const response = await fetch(`${portalApiUrl}/content`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.token}` },
      body:JSON.stringify({ content:editorContent() })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'save_failed');
    const usersResponse = await fetch(`${portalApiUrl}/users`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${session.token}` },
      body:JSON.stringify({ users:usersFromEditor() })
    });
    const usersResult = await usersResponse.json().catch(() => ({}));
    if (!usersResponse.ok) throw new Error(usersResult.error || 'users_failed');
    editorUsers = usersResult.users || [];
    renderNavyContent(result.content);
    editorDirty = false;
    setEditorStatus(editorText.saved, true);
    return true;
  } catch (error) {
    setEditorStatus(error.message === 'invalid_session' ? editorText.expiredAgain : editorText.saveError);
    return false;
  } finally {
    save.disabled = false;
  }
}

editorForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  await saveEditorChanges();
});

let editorExitResolver = null;
function resolveEditorExit(result) {
  if (editorExitDialog.open) editorExitDialog.close();
  const resolve = editorExitResolver;
  editorExitResolver = null;
  resolve?.(result);
}

editorExitDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  resolveEditorExit(false);
});
editorExitDialog.addEventListener('click', (event) => {
  if (event.target === editorExitDialog) resolveEditorExit(false);
});
editorExitDialog.querySelectorAll('[data-editor-exit]').forEach((button) => button.addEventListener('click', async () => {
  const action = button.dataset.editorExit;
  if (action === 'cancel') return resolveEditorExit(false);
  if (action === 'discard') {
    editorDirty = false;
    return resolveEditorExit(true);
  }
  const buttons = [...editorExitDialog.querySelectorAll('button')];
  buttons.forEach((item) => { item.disabled = true; });
  const saved = await saveEditorChanges();
  buttons.forEach((item) => { item.disabled = false; });
  resolveEditorExit(saved);
}));

window.naviesRequestEditorExit = () => {
  if (!contentEditorOpen || !editorDirty) return Promise.resolve(true);
  if (editorExitResolver) return Promise.resolve(false);
  editorExitDialog.showModal();
  return new Promise((resolve) => { editorExitResolver = resolve; });
};

window.addEventListener('navies-admin-change', syncEditorAccess);
window.addEventListener('navies-auth-change', syncEditorAccess);
window.setInterval(syncEditorAccess, 1000);
loadNavyContent();

let portalReady = false;
let portalTransitionTimer;
let contentEditorOpen = false;
let editorOriginRoute = 'espacio-navy';

function applyPortalState(isLoggedIn) {
  loginPanel.hidden = isLoggedIn;
  dashboard.hidden = !isLoggedIn || contentEditorOpen;
  if (!isLoggedIn) contentEditor.hidden = true;
  document.querySelector('.space-shell').classList.toggle('is-authenticated', isLoggedIn);
}

function syncPortal() {
  const member = window.naviesCurrentMember?.();
  const isLoggedIn = Boolean(member);
  if (isLoggedIn) memberName.textContent = window.naviesMemberName(member);
  syncEnsembleAccess();

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

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  if (await window.naviesLogin(data.get('username'), data.get('password'))) {
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
