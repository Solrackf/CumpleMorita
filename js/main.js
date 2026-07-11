/* ═══════════════════════════════════════════════════════════
   FELIZ CUMPLEAÑOS, MILY ❤️
   Lógica principal
   ───────────────────────────────────────────────────────────
   Módulos:
   1. Carga         — espera recursos y ejecuta la secuencia inicial
   2. Música        — fade-in cinematográfico (0% → 38%)
   3. Revelado      — animaciones al hacer scroll (IntersectionObserver)
   4. Partículas    — corazones, destellos, estrellas y pétalos (60 FPS)
   5. Parallax      — profundidad sutil con el mouse
   6. Confeti       — únicamente en la pantalla final
   7. Navegación    — botón Comenzar
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ───────────────────────────────────────────
   CONFIGURACIÓN — Modifica aquí fácilmente
   ─────────────────────────────────────────── */
const CONFIG = {
  music: {
    targetVolume: 0.38,   // volumen final (35–40%, nunca fuerte)
    fadeSeconds: 5,       // duración del fade-in (4–6 s)
    delayAfterWelcome: 1000, // ms de espera tras la animación de bienvenida
  },
  particles: {
    count: 26,            // cantidad total (bajo = elegante y rápido)
    types: ['heart', 'sparkle', 'star', 'petal'],
  },
  confetti: {
    count: 140,           // piezas de confeti al final
  },
};

/* Referencias del DOM */
const loader      = document.getElementById('loader');
const hero        = document.getElementById('hero');
const story       = document.getElementById('story');
const startBtn    = document.getElementById('start-btn');
const finalSec    = document.getElementById('final');
const music       = document.getElementById('music');
const musicBtn    = document.getElementById('music-btn');

/* ═══════════════════════════════════════════
   1. CARGA — todo debe estar listo antes de empezar
   ═══════════════════════════════════════════ */
window.addEventListener('load', () => {
  // Espera también a que las fuentes terminen de cargar
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  fontsReady.then(() => {
    // Pequeña pausa para que la carga nunca se sienta brusca
    setTimeout(() => {
      loader.classList.add('hidden');       // 1. desaparece el loader
      hero.classList.add('entered');        // 2. animación de bienvenida

      // 3. Esperar ~1 s tras la bienvenida → 4. música con fade-in
      setTimeout(() => tryAutoplayMusic(), 2200 + CONFIG.music.delayAfterWelcome);
    }, 600);
  });
});

/* ═══════════════════════════════════════════
   2. MÚSICA — fade-in suave y cinematográfico
   ═══════════════════════════════════════════ */
let fadeRAF = null;
let musicStarted = false;

/** Sube el volumen progresivamente de 0 al objetivo. */
function fadeInMusic() {
  music.volume = 0;
  const start = performance.now();
  const durMs = CONFIG.music.fadeSeconds * 1000;

  cancelAnimationFrame(fadeRAF);
  const step = (now) => {
    const t = Math.min((now - start) / durMs, 1);
    // Curva suave (easeInOutSine) para que "aparezca" detrás de las palabras
    music.volume = CONFIG.music.targetVolume * (0.5 - 0.5 * Math.cos(Math.PI * t));
    if (t < 1) fadeRAF = requestAnimationFrame(step);
  };
  fadeRAF = requestAnimationFrame(step);
}

/** Inicia la reproducción con fade-in. */
function startMusic() {
  if (musicStarted) return;
  music.volume = 0;
  music.play().then(() => {
    musicStarted = true;
    musicBtn.classList.add('playing');
    fadeInMusic();
  }).catch(() => {
    /* El navegador bloqueó el autoplay: se iniciará con la
       primera interacción (botón Comenzar o botón de música). */
  });
}

/** Los navegadores exigen un gesto del usuario para reproducir audio. */
function tryAutoplayMusic() {
  startMusic();
}

/* Botón flotante: reproducir / pausar */
musicBtn.addEventListener('click', () => {
  if (music.paused) {
    startMusic();
    if (musicStarted) {           // si ya había sonado antes, reanuda con fade
      music.play();
      musicBtn.classList.add('playing');
      fadeInMusic();
    }
  } else {
    music.pause();
    musicBtn.classList.remove('playing');
  }
});

/* ═══════════════════════════════════════════
   3. REVELADO — textos que aparecen poco a poco
   ═══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');

    // Si el contenedor tiene una firma SVG, se dibuja tras revelarse
    const svg = entry.target.querySelector('.signature-draw');
    if (svg) startSignature(svg, entry.target);

    revealObserver.unobserve(entry.target); // solo se anima una vez
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

/** Prepara el SVG de la firma: calcula viewBox y longitud del trazo. */
function prepareSignature(svg) {
  const text = svg.querySelector('.signature-text');
  if (!text || svg.dataset.prepared) return;

  const width = text.getComputedTextLength();
  if (!width) return;

  const padding = 40;            // aire a los lados
  const w = Math.ceil(width + padding * 2);
  const length = Math.ceil(width * 3.2); // aproximación del trazo de la firma

  svg.setAttribute('viewBox', `0 0 ${w} 60`);
  text.setAttribute('x', w / 2);
  text.style.strokeDasharray = `${length}`;
  text.style.strokeDashoffset = `${length}`;
  svg.dataset.prepared = 'true';
}

/** Dispara la animación de dibujo de la firma. */
function drawSignature(svg) {
  const text = svg.querySelector('.signature-text');
  if (!text) return;
  svg.classList.add('drawn');
  text.style.strokeDashoffset = '0';
}

/** Inicia la firma cuando su contenedor ya es visible. */
function startSignature(svg, parent) {
  prepareSignature(svg);

  const onEnd = (e) => {
    if (e.propertyName !== 'opacity' || !parent.classList.contains('in')) return;
    parent.removeEventListener('transitionend', onEnd);
    drawSignature(svg);
  };

  // Espera a que termine el fade-in del padre para dibujar la firma
  if (parent.classList.contains('reveal-slow') || parent.classList.contains('reveal')) {
    parent.addEventListener('transitionend', onEnd);
  } else {
    drawSignature(svg);
  }
}

/** Prepara los elementos con revelado escalonado dentro de cada sección. */
function initReveals() {
  document.querySelectorAll('.story .reveal, .reveal-slow').forEach((el) => {
    // Escalonado: cada elemento de una misma sección entra con un pequeño retraso
    const siblings = [...el.parentElement.querySelectorAll('.reveal, .reveal-slow')];
    const idx = siblings.indexOf(el);
    el.style.setProperty('--stagger', `${Math.min(idx * 0.12, 1.2)}s`);
    revealObserver.observe(el);
  });
}

/* ═══════════════════════════════════════════
   4. PARTÍCULAS — ambiente flotante a 60 FPS
   ═══════════════════════════════════════════ */
const pCanvas = document.getElementById('particles');
const pCtx = pCanvas.getContext('2d');
let particles = [];

/* Paleta de partículas (tonos pastel + dorado sutil) */
const P_COLORS = ['#f4c6ce', '#e6d9f5', '#f3e3c9', '#f9dfe4', '#d9c8f0'];

function resizeCanvas(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
}

/** Crea una partícula con tipo, tamaño y deriva aleatorios. */
function makeParticle(initial = false) {
  const type = CONFIG.particles.types[Math.floor(Math.random() * CONFIG.particles.types.length)];
  return {
    type,
    x: Math.random() * innerWidth,
    y: initial ? Math.random() * innerHeight : innerHeight + 30,
    size: type === 'sparkle' ? 1.5 + Math.random() * 2 : 7 + Math.random() * 9,
    speed: 0.15 + Math.random() * 0.4,          // muy lento = elegante
    drift: (Math.random() - 0.5) * 0.3,          // deriva horizontal
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.01,
    alpha: 0.25 + Math.random() * 0.35,          // siempre sutil
    color: P_COLORS[Math.floor(Math.random() * P_COLORS.length)],
    twinkle: Math.random() * Math.PI * 2,        // fase de parpadeo
  };
}

/** Dibuja un corazón vectorial pequeño. */
function drawHeart(ctx, size) {
  ctx.beginPath();
  const s = size / 2;
  ctx.moveTo(0, s * 0.6);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.3);
  ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.6);
  ctx.fill();
}

/** Dibuja un pétalo (elipse suave). */
function drawPetal(ctx, size) {
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.5, size * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** Dibuja una estrella de 4 puntas (destello). */
function drawStar(ctx, size) {
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, -s);
  ctx.quadraticCurveTo(0, 0, s, 0);
  ctx.quadraticCurveTo(0, 0, 0, s);
  ctx.quadraticCurveTo(0, 0, -s, 0);
  ctx.quadraticCurveTo(0, 0, 0, -s);
  ctx.fill();
}

function animateParticles() {
  pCtx.clearRect(0, 0, innerWidth, innerHeight);

  for (const p of particles) {
    p.y -= p.speed;                 // flotan hacia arriba, lentamente
    p.x += p.drift + Math.sin(p.twinkle + p.y * 0.01) * 0.2;
    p.angle += p.spin;
    p.twinkle += 0.02;

    // Al salir por arriba, renace desde abajo
    if (p.y < -40) Object.assign(p, makeParticle());

    const flicker = p.type === 'sparkle' || p.type === 'star'
      ? 0.5 + 0.5 * Math.sin(p.twinkle * 2)   // los destellos parpadean
      : 1;

    pCtx.save();
    pCtx.translate(p.x, p.y);
    pCtx.rotate(p.angle);
    pCtx.globalAlpha = p.alpha * flicker;
    pCtx.fillStyle = p.color;

    if (p.type === 'heart')       drawHeart(pCtx, p.size);
    else if (p.type === 'petal')  drawPetal(pCtx, p.size);
    else if (p.type === 'star')   drawStar(pCtx, p.size * 0.5);
    else {                        // sparkle: punto con glow
      pCtx.shadowColor = p.color;
      pCtx.shadowBlur = 8;
      pCtx.beginPath();
      pCtx.arc(0, 0, p.size, 0, Math.PI * 2);
      pCtx.fill();
    }
    pCtx.restore();
  }
  requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas(pCanvas);
  particles = Array.from({ length: CONFIG.particles.count }, () => makeParticle(true));
  animateParticles();
}

/* ═══════════════════════════════════════════
   5. PARALLAX — profundidad sutil con el mouse
   ═══════════════════════════════════════════ */
function initParallax() {
  // Solo en dispositivos con puntero fino (escritorio)
  if (!matchMedia('(pointer: fine)').matches) return;

  let targetX = 0, targetY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / innerWidth - 0.5);
    targetY = (e.clientY / innerHeight - 0.5);
  });

  const cards = document.querySelectorAll('.chapter-card, .hero-inner');
  const tick = () => {
    // Interpolación suave para movimiento fluido a 60 FPS
    curX += (targetX - curX) * 0.04;
    curY += (targetY - curY) * 0.04;
    cards.forEach((card) => {
      card.style.transform = `translate3d(${curX * -10}px, ${curY * -8}px, 0)`;
    });
    requestAnimationFrame(tick);
  };
  tick();
}

/* ═══════════════════════════════════════════
   6. CONFETI — solo en la pantalla final
   ═══════════════════════════════════════════ */
const cCanvas = document.getElementById('confetti');
const cCtx = cCanvas.getContext('2d');
let confettiPieces = [];
let confettiActive = false;

const C_COLORS = ['#f4c6ce', '#e6d9f5', '#f3e3c9', '#c9a96a', '#ffffff'];

function launchConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  resizeCanvas(cCanvas);

  confettiPieces = Array.from({ length: CONFIG.confetti.count }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.5,
    w: 5 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    speed: 1 + Math.random() * 2.2,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: 0.02 + Math.random() * 0.03,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.08,
    color: C_COLORS[Math.floor(Math.random() * C_COLORS.length)],
    alpha: 0.85,
  }));

  const start = performance.now();
  const DURATION = 9000; // el confeti se desvanece tras 9 s

  const tick = (now) => {
    cCtx.clearRect(0, 0, innerWidth, innerHeight);
    const elapsed = now - start;
    const fade = elapsed > DURATION ? Math.max(1 - (elapsed - DURATION) / 2000, 0) : 1;

    for (const c of confettiPieces) {
      c.y += c.speed;
      c.sway += c.swaySpeed;
      c.x += Math.sin(c.sway) * 1.1;
      c.angle += c.spin;
      if (c.y > innerHeight + 20 && fade === 1) { c.y = -20; c.x = Math.random() * innerWidth; }

      cCtx.save();
      cCtx.translate(c.x, c.y);
      cCtx.rotate(c.angle);
      cCtx.globalAlpha = c.alpha * fade;
      cCtx.fillStyle = c.color;
      cCtx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      cCtx.restore();
    }

    if (fade > 0) requestAnimationFrame(tick);
    else { cCtx.clearRect(0, 0, innerWidth, innerHeight); confettiActive = false; }
  };
  requestAnimationFrame(tick);
}

/* Observa la sección final: lanza el confeti una sola vez */
const finalObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    launchConfetti();
    finalObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

/* ═══════════════════════════════════════════
   7. NAVEGACIÓN
   ═══════════════════════════════════════════ */
startBtn.addEventListener('click', () => {
  story.hidden = false;              // aparecen los mensajes
  initReveals();                     // activa el revelado por scroll
  finalObserver.observe(finalSec);
  startMusic();                      // gesto del usuario: garantiza la música

  // Desplazamiento suave hacia el primer capítulo
  requestAnimationFrame(() => {
    story.querySelector('.chapter').scrollIntoView({ behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════════
   Redimensionado y arranque
   ═══════════════════════════════════════════ */
window.addEventListener('resize', () => {
  resizeCanvas(pCanvas);
  if (confettiActive) resizeCanvas(cCanvas);
});

initParticles();
initParallax();
