/* ============================================================
   CONFEDERAÇÃO BRASILEIRA DO PUTÉRIO — script.js
   ------------------------------------------------------------
   Índice:
     1. Configuración de jugadores (EDITA AQUÍ nombres/rutas/textos)
     2. Referencias al DOM
     3. Render de la alineación + líneas de química (FUT Draft style)
     4. Ficha del jugador (modal estilo Panini)
     5. Audio (principal, por jugador, efectos, mute)
     6. Pantalla de entrada (Intro Gate)
     7. Partículas y confeti
     8. Marcador retro + contador de invitados
     9. Indicador "descubre a los jugadores"
    10. Easter egg
    11. Inicialización
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIGURACIÓN DE JUGADORES
   ------------------------------------------------------------
   - pos.top / pos.left: posición en PORCENTAJE (0-100) dentro
     del campo. No cambies el esquema salvo que quieras mover
     a alguien de sitio.
   - photo: ruta a la foto real del jugador (se muestra en la
     ficha). Si no existe el archivo, se ve una silueta.
   - song: ruta a la canción individual del jugador. Añade tus
     archivos .mp3 dentro de audio/jugadores/ con estos nombres,
     o cambia la ruta aquí.
   - info: campos que se muestran en la ficha (lado derecho).
     Sustituye los textos de ejemplo por los definitivos.
   ============================================================ */
const PLAYERS = [
  {
    id: 'saiko',
    name: 'Saiko',
    number: 13,
    posShort: 'DC',
    posFull: 'Delantero Centro',
    pos: { top: 9, left: 50 },
    photo: 'media/jugadores/Izan.jpeg',
    song: 'media/audio/Saiko.mp3',
    info: [
      ['Apodo', '✏️ Añade aquí su apodo'],
      ['Frase de guerra', '✏️ Escribe su frase icónica'],
      ['Especialidad en la fiesta', '✏️ Rematador nato... ¿de la pista de baile?'],
      ['Anécdota memorable', '✏️ Cuenta aquí una anécdota']
    ]
  },
  {
    id: 'xiyo',
    name: 'Xiyo',
    number: 9,
    posShort: 'EI',
    posFull: 'Ala Izquierda',
    pos: { top: 36, left: 15 },
    photo: 'media/jugadores/Gomez.png',
    song: 'media/audio/Xiyo.mp3',
    info: [
      ['Apodo', '✏️ Añade aquí su apodo'],
      ['Frase de guerra', '✏️ Escribe su frase icónica'],
      ['Especialidad en la fiesta', '✏️ Velocidad punta camino del after'],
      ['Anécdota memorable', '✏️ Cuenta aquí una anécdota']
    ]
  },
  {
    /* Antiguo hueco de Xiyo (banda derecha). Pendiente de asignar a un
       jugador definitivo: cambia id/name/number/photo/song/info cuando
       lo decidáis; de momento queda como "fichaje" temporal. */
    id: 'fernandezz',
    name: 'Fernandezz',
    number: 7,
    posShort: 'ED',
    posFull: 'Ala Derecha',
    pos: { top: 36, left: 85 },
    photo: 'media/jugadores/Carlos.jpeg',
    song: 'media/audio/Fernandezz.mp3',
    info: [
      ['Apodo', '✏️ Añade aquí su apodo'],
      ['Frase de guerra', '✏️ Escribe su frase icónica'],
      ['Especialidad en la fiesta', '✏️ Puesto libre... ¡se aceptan candidaturas!'],
      ['Anécdota memorable', '✏️ Cuenta aquí una anécdota']
    ]
  },
  {
    id: 'orei',
    name: 'O Rei',
    number: 10,
    posShort: 'MCO',
    posFull: 'Mediocentro Ofensivo',
    pos: { top: 63, left: 50 },
    photo: 'media/jugadores/Sergio.jpeg',
    song: 'media/audio/ORei.mp3',
    info: [
      ['Apodo', '✏️ Añade aquí su apodo'],
      ['Frase de guerra', '✏️ Escribe su frase icónica'],
      ['Especialidad en la fiesta', '✏️ El cerebro de la Confederação'],
      ['Anécdota memorable', '✏️ Cuenta aquí una anécdota']
    ]
  },
  {
    id: 'polete',
    name: 'Polete',
    number: 11,
    posShort: 'POR',
    posFull: 'Portero Delantero',
    pos: { top: 88, left: 50 },
    photo: 'media/jugadores/Jaime.jpeg',
    song: 'media/audio/Jaime.mp3',
    info: [
      ['Apodo', '✏️ Añade aquí su apodo'],
      ['Frase de guerra', '✏️ Escribe su frase icónica'],
      ['Especialidad en la fiesta', '✏️ Bajo palos y al pie del cañón'],
      ['Anécdota memorable', '✏️ Cuenta aquí una anécdota']
    ]
  }
];

/* Líneas de química: qué jugadores están conectados entre sí */
const CONNECTIONS = [
  ['xiyo', 'saiko'],
  ['saiko', 'fernandezz'],
  ['xiyo', 'orei'],
  ['fernandezz', 'orei'],
  ['orei', 'polete']
];

/* Rutas de efectos de sonido (opcionales, se ignoran si no existen) */
const SFX = {
  silbato: 'audio/efectos/silbato.mp3',
  abrir:   'audio/efectos/abrir.mp3',
  cerrar:  'audio/efectos/cerrar.mp3'
};


/* ============================================================
   2. REFERENCIAS AL DOM
   ============================================================ */
const introGate   = document.getElementById('intro-gate');
const btnEnter     = document.getElementById('btn-enter');

const formationEl  = document.getElementById('formation');
const chemSvg       = document.getElementById('chem-svg');
const discoverHint  = document.getElementById('discover-hint');

const cardOverlay   = document.getElementById('card-overlay');
const playerCard     = document.getElementById('player-card');
const cardClose       = document.getElementById('card-close');
const cardName         = document.getElementById('card-name');
const cardNumber       = document.getElementById('card-number');
const cardNumberWm      = document.getElementById('card-number-wm');
const cardPosition       = document.getElementById('card-position');
const cardPositionFull    = document.getElementById('card-position-full');
const cardPhoto             = document.getElementById('card-photo');
const cardSilhouette         = document.getElementById('card-silhouette');
const cardInfo                = document.getElementById('card-info');

const mainAudio      = document.getElementById('main-audio');
const muteBtn          = document.getElementById('mute-btn');

const matchClockEl    = document.getElementById('match-clock');
const statGuestsEl      = document.getElementById('stat-guests');

const eggToast         = document.getElementById('egg-toast');
const crestHeader        = document.getElementById('crest-header');
const crestFooter          = document.querySelector('.crest--footer');

const particlesLayer  = document.getElementById('fx-particles');
const confettiLayer      = document.getElementById('fx-confetti');

let hasOpenedFirstCard = false;
let currentPlayerAudio = null;
let isMuted = false;


/* ============================================================
   3. RENDER DE LA ALINEACIÓN + LÍNEAS DE QUÍMICA
   ============================================================ */
function renderFormation() {
  PLAYERS.forEach(player => {
    const node = document.createElement('button');
    node.type = 'button';
    node.className = 'player-node';
    node.style.top = player.pos.top + '%';
    node.style.left = player.pos.left + '%';
    // pequeño desfase de animación para que no floten todos a la vez
    node.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
    node.setAttribute('aria-label', `Ver ficha de ${player.name}, ${player.posFull}`);
    node.dataset.playerId = player.id;

    node.innerHTML = `
      <span class="player-node__circle">
        <span class="player-node__number">${player.number}</span>
      </span>
      <span class="player-node__name">${player.name}</span>
    `;

    node.addEventListener('click', () => openPlayerCard(player.id));

    // En móvil no existe :hover, así que simulamos el brillo con el toque
    node.addEventListener('touchstart', () => {
      node.classList.add('is-touched');
    }, { passive: true });
    node.addEventListener('touchend', () => {
      setTimeout(() => node.classList.remove('is-touched'), 400);
    }, { passive: true });

    formationEl.appendChild(node);
  });

  drawChemistryLines();
}

/* Dibuja las líneas de química usando un viewBox 0-100 que coincide
   exactamente con los porcentajes top/left de cada jugador. Así las
   líneas siempre conectan bien, en cualquier tamaño de pantalla,
   sin necesidad de recalcular nada al redimensionar. */
function drawChemistryLines() {
  chemSvg.setAttribute('viewBox', '0 0 100 100');
  chemSvg.setAttribute('preserveAspectRatio', 'none');
  chemSvg.innerHTML = '';

  CONNECTIONS.forEach(([fromId, toId]) => {
    const from = PLAYERS.find(p => p.id === fromId);
    const to = PLAYERS.find(p => p.id === toId);
    if (!from || !to) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.pos.left);
    line.setAttribute('y1', from.pos.top);
    line.setAttribute('x2', to.pos.left);
    line.setAttribute('y2', to.pos.top);
    line.setAttribute('class', 'chem-line');
    // desfase para que no todas las líneas "fluyan" al mismo tiempo
    line.style.animationDelay = (Math.random() * 1.2).toFixed(2) + 's';
    chemSvg.appendChild(line);
  });
}


/* ============================================================
   4. FICHA DEL JUGADOR (MODAL ESTILO PANINI)
   ============================================================ */
function openPlayerCard(playerId) {
  const player = PLAYERS.find(p => p.id === playerId);
  if (!player) return;

  cardName.textContent = player.name;
  cardNumber.textContent = player.number;
  cardNumberWm.textContent = player.number;
  cardPosition.textContent = player.posShort;
  cardPositionFull.textContent = player.posFull;

  // Foto: mientras no exista el archivo real, se muestra la silueta placeholder.
  // En cuanto añadas la imagen en la ruta indicada (player.photo), se mostrará sola.
  cardPhoto.style.backgroundImage = 'none';
  cardSilhouette.style.display = '';
  cardNumberWm.style.display = '';
  const testImg = new Image();
  testImg.onload = () => {
    cardPhoto.style.backgroundImage = `url('${player.photo}')`;
    cardPhoto.style.backgroundSize = 'cover';
    cardPhoto.style.backgroundPosition = 'center';
    cardSilhouette.style.display = 'none';
    // El dorsal (cardNumberWm) se queda siempre visible, ver CSS
  };
  testImg.src = player.photo;

  // Rellenar la información del lado derecho
  cardInfo.innerHTML = player.info.map(([label, value]) => `
    <dt>${label}</dt>
    <dd>${value}</dd>
  `).join('');

  cardOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  playSfx(SFX.abrir);

  // Cambiar de la canción principal a la del jugador (se reanuda donde quedó)
  playPlayerSong(player);

  // La primera vez que se abre una ficha, atenuamos el indicador de ayuda
  if (!hasOpenedFirstCard) {
    hasOpenedFirstCard = true;
    discoverHint.classList.add('is-faded');
  }
}

function closePlayerCard() {
  cardOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
  playSfx(SFX.cerrar);
  stopPlayerSong();
  mainAudio.play().catch(() => {});
}

cardClose.addEventListener('click', closePlayerCard);
cardOverlay.addEventListener('click', (e) => {
  if (e.target === cardOverlay) closePlayerCard();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cardOverlay.classList.contains('is-open')) {
    closePlayerCard();
  }
});


/* ============================================================
   5. AUDIO (principal, por jugador, efectos, mute)
   ============================================================ */
function attemptAutoplay() {
  // Intentamos reproducir en segundo plano. Si el navegador lo bloquea
  // (lo más habitual sin interacción previa del usuario), no pasa nada:
  // el botón "Entrar en la fiesta" del Intro Gate sigue siendo la vía
  // principal para arrancar el sonido, y además mantiene la puesta en
  // escena de la pantalla de bienvenida.
  mainAudio.volume = 0.75;
  const playPromise = mainAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => { /* autoplay bloqueado: se usará el botón */ });
  }
}

/* Guarda un único objeto Audio por jugador (creado la primera vez que
   se necesita) para que pausar/reanudar conserve su progreso exacto,
   igual que hace el audio principal. */
const playerAudioElements = {};

function getPlayerAudio(player) {
  if (!playerAudioElements[player.id]) {
    const audio = new Audio(player.song);
    audio.loop = true;
    audio.volume = 0.8;
    playerAudioElements[player.id] = audio;
  }
  return playerAudioElements[player.id];
}

function playPlayerSong(player) {
  mainAudio.pause();
  // Si sonaba la canción de otro jugador, la pausamos (sin destruirla)
  // para que conserve el segundo exacto en el que se quedó.
  if (currentPlayerAudio) {
    currentPlayerAudio.pause();
  }
  const audio = getPlayerAudio(player);
  audio.muted = isMuted;
  audio.play().catch(() => {
    // Si el archivo todavía no existe, se ignora en silencio
  });
  currentPlayerAudio = audio;
}

function stopPlayerSong() {
  if (currentPlayerAudio) {
    // pause() conserva currentTime automáticamente: la próxima vez que
    // se abra este jugador, su canción continuará donde se quedó.
    currentPlayerAudio.pause();
  }
  currentPlayerAudio = null;
}

function playSfx(src) {
  const fx = new Audio(src);
  fx.volume = 0.6;
  fx.muted = isMuted;
  fx.play().catch(() => {
    // Efecto opcional: si no existe el archivo, simplemente no suena
  });
}

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  mainAudio.muted = isMuted;
  if (currentPlayerAudio) currentPlayerAudio.muted = isMuted;
  muteBtn.textContent = isMuted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', isMuted ? 'Activar música' : 'Silenciar música');
});


/* ============================================================
   6. PANTALLA DE ENTRADA (INTRO GATE)
   ============================================================ */
function hideIntroGate() {
  introGate.classList.add('is-hidden');
}

btnEnter.addEventListener('click', () => {
  mainAudio.volume = 0.75;
  mainAudio.play().catch(() => {});
  playSfx(SFX.silbato);
  hideIntroGate();
  burstConfetti(60);
});


/* ============================================================
   7. PARTÍCULAS Y CONFETI
   ============================================================ */
const PARTICLE_COLORS = ['#FFFFFF', '#FFDE00', '#009C3B'];
const CONFETTI_COLORS = ['#FFDE00', '#009C3B', '#1650FF', '#FFFFFF'];

function spawnAmbientParticles() {
  const particle = document.createElement('span');
  const size = 2 + Math.random() * 3;
  const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  particle.className = 'fx-particle';
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.bottom = '-10px';
  particle.style.background = `radial-gradient(circle, ${color} 0%, ${color}00 70%)`;
  particle.style.animationDuration = (8 + Math.random() * 10) + 's';
  particlesLayer.appendChild(particle);
  setTimeout(() => particle.remove(), 20000);
}

function burstConfetti(count = 40) {
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'fx-confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 4200);
  }
}

/* Confeti ocasional de ambiente, discreto, cada cierto tiempo */
function scheduleOccasionalConfetti() {
  setInterval(() => burstConfetti(14), 6500);
}


/* ============================================================
   8. MARCADOR RETRO + CONTADOR DE INVITADOS
   ============================================================ */
function startMatchClock() {
  let minutes = 45;
  setInterval(() => {
    minutes += 1;
    matchClockEl.textContent = minutes + ":00" + (minutes > 90 ? ' +' : '');
  }, 5000);
}

function animateGuestsCounter() {
  let current = 0;
  const target = 999;
  const step = () => {
    current += Math.ceil((target - current) / 10) || 1;
    if (current >= target) current = target;
    statGuestsEl.textContent = String(current).padStart(3, '0');
    if (current < target) requestAnimationFrame(step);
  };
  step();

  // de vez en cuando, un invitado más confirma asistencia
  setInterval(() => {
    const el = statGuestsEl;
    const val = parseInt(el.textContent, 10) + 1;
    el.textContent = String(val).padStart(3, '0');
  }, 1000);
}


/* ============================================================
   9. EASTER EGG
   ------------------------------------------------------------
   Pulsa el escudo (cabecera o pie de página) 7 veces seguidas
   en menos de 3 segundos para desbloquearlo.
   ============================================================ */
function attachEasterEgg(el) {
  if (!el) return;
  let clicks = 0;
  let timer = null;

  el.addEventListener('click', () => {
    clicks += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 3000);

    if (clicks >= 7) {
      clicks = 0;
      triggerEasterEgg();
    }
  });
}

function triggerEasterEgg() {
  eggToast.classList.add('is-visible');
  burstConfetti(90);
  playSfx(SFX.silbato);
  setTimeout(() => eggToast.classList.remove('is-visible'), 3600);
}


/* ============================================================
   10. INDICADOR "DESCUBRE A LOS JUGADORES"
   ------------------------------------------------------------
   Se atenúa automáticamente en cuanto el usuario abre su
   primera ficha (ver openPlayerCard).
   ============================================================ */


/* ============================================================
   11. INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderFormation();
  attemptAutoplay();
  startMatchClock();
  animateGuestsCounter();
  scheduleOccasionalConfetti();
  attachEasterEgg(crestHeader);
  attachEasterEgg(crestFooter);

  // Lluvia de partículas de ambiente continua
  setInterval(spawnAmbientParticles, 600);

  // Volver a trazar las líneas si cambia la orientación del móvil
  window.addEventListener('orientationchange', drawChemistryLines);
});
