# Feliz cumpleaños, Mily ❤️

Un regalo digital artesanal: una carta de amor interactiva construida con **HTML5, CSS3 y JavaScript puro**. Sin frameworks. Lista para GitHub Pages.

---

## 📁 Estructura del proyecto

```
CumpleMily/
├── index.html              → Toda la estructura y los mensajes
├── css/
│   └── styles.css          → Estilos, colores y animaciones CSS
├── js/
│   └── main.js             → Música, partículas, revelados, confeti
├── assets/
│   ├── music/
│   │   └── music.mp3       → ⚠️ COLOCA AQUÍ tu canción (Unchained Melody)
│   └── photos/
│       ├── placeholder.svg → Imagen temporal (no borrar)
│       ├── foto1.jpg       → ⚠️ COLOCA AQUÍ tus fotos
│       ├── foto2.jpg
│       └── ... foto6.jpg
└── README.md
```

---

## 🚀 Publicar en GitHub Pages

1. Crea un repositorio en GitHub (puede ser privado con Pages, o público). Ejemplo: `cumple-mily`.
2. Sube todos los archivos del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Regalo de cumpleaños para Mily"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/cumple-mily.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / carpeta `/ (root)` → Save**.
4. Espera 1–2 minutos. Tu página estará en:
   `https://TU_USUARIO.github.io/cumple-mily/`

---

## 🎵 Cambiar la música

1. Coloca tu archivo mp3 en `assets/music/` con el nombre exacto **`music.mp3`**.
2. Listo. No hay que tocar código.

**Ajustar volumen o duración del fade-in:** abre `js/main.js` y edita al inicio:

```js
const CONFIG = {
  music: {
    targetVolume: 0.38,   // volumen final (0.35–0.40 recomendado)
    fadeSeconds: 5,       // duración del fade-in en segundos
    delayAfterWelcome: 1000,
  },
  ...
```

> ℹ️ Los navegadores bloquean el audio automático sin interacción. La página lo intenta al cargar y, si el navegador lo bloquea, la música inicia (con fade-in) al presionar **Comenzar** o el botón flotante **🎵 Nuestra canción**.

---

## 📸 Fotos (opcional)

Por ahora la galería muestra **marcos polaroid vacíos** que dicen "Nuestra foto irá aquí", conectando con la frase final *"La próxima foto que pongamos aquí..."*.

Para agregar fotos reales algún día:

1. Guarda las fotos en `assets/photos/` (ej. `foto1.jpg`). Formato recomendado: vertical (4:5), máximo ~1200px de ancho.
2. En `index.html`, sección `GALERÍA`, cambia el `src` del placeholder:
   ```html
   <figure class="polaroid reveal"><img src="assets/photos/foto1.jpg" alt="" loading="lazy" /></figure>
   ```
3. Para **agregar más marcos**, copia un bloque `<figure class="polaroid reveal">…</figure>` completo.

---

## ✍️ Agregar más mensajes (capítulos)

En `index.html`, copia un bloque completo de capítulo y pégalo donde quieras:

```html
<section class="chapter" data-bg="7" data-ornament="🌹">
  <div class="chapter-card">
    <span class="chapter-label reveal">❤️ Capítulo 13</span>
    <h2 class="reveal">Tu título aquí.</h2>
    <p class="reveal">Tu párrafo aquí.</p>
    <p class="reveal">Otro párrafo.</p>
  </div>
</section>
```

- `data-bg="1"` a `"12"` → elige el fondo (definidos en `styles.css`).
- `data-ornament="🌹"` → el pequeño detalle flotante de la sección.
- Cada `<p class="reveal">` aparece con animación escalonada automáticamente.

---

## 🎨 Modificar colores

Todos los colores están centralizados al inicio de `css/styles.css`:

```css
:root {
  --blanco:  #fffdfb;   /* fondo principal */
  --crema:   #fdf6ee;
  --rosa:    #f9dfe4;   /* rosa pastel */
  --lila:    #ece5f6;
  --dorado:  #c9a96a;   /* acentos dorados */
  --tinta:   #4a3f45;   /* color del texto */
}
```

Cambia un valor y toda la página se actualiza. Los fondos por capítulo están en la sección `FONDOS` del mismo archivo.

---

## ✨ Modificar animaciones

| Qué | Dónde |
|---|---|
| Velocidad de los revelados de texto | `--dur-reveal` en `:root` de `styles.css` |
| Curva de movimiento (estilo cine) | `--ease-cine` en `:root` |
| Cantidad de partículas flotantes | `CONFIG.particles.count` en `js/main.js` |
| Tipos de partículas | `CONFIG.particles.types` (`heart`, `sparkle`, `star`, `petal`) |
| Cantidad de confeti final | `CONFIG.confetti.count` en `js/main.js` |
| Latido del corazón, glow, flotación | `@keyframes` en `styles.css` |

La página respeta `prefers-reduced-motion` para accesibilidad.

---

## 💻 Probar localmente

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
python -m http.server 8000
```

Luego visita `http://localhost:8000`.

---

Hecho con ❤️ para Militza Yamile.
