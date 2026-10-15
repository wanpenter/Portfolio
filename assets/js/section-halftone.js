(() => {
  document.querySelectorAll('[data-halftone]').forEach(name => {
  const section = name.closest('section, footer');
  const canvas = name?.querySelector('canvas');
  const context = canvas?.getContext('2d');
  if (!context || !section) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const text = name.querySelector('.halftone-text').textContent.trim();
  const baseInk = getComputedStyle(name).color.match(/[\d.]+/g).slice(0, 3).map(Number);
  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue('--signal').trim();
  const hex = /^#([\da-f]{6})$/i.exec(accent)?.[1] || '00A8B5';
  const cyan = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
  let width = 0;
  let height = 0;
  let scale = 1;
  let dots = [];
  let pointer = null;
  let ring = null;
  let frame = 0;
  let visible = true;
  let previousTime = 0;

  function wake() {
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function layout() {
    name.classList.add('is-halftone');
    width = name.clientWidth;
    height = name.clientHeight;
    if (!width || !height) return;
    scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const mask = document.createElement('canvas');
    mask.width = width;
    mask.height = height;
    const ink = mask.getContext('2d', { willReadFrequently: true });
    if (!ink) {
      name.classList.remove('is-halftone');
      return;
    }
    const titleStyle = getComputedStyle(name);
    const family = titleStyle.fontFamily;
    const weight = titleStyle.fontWeight;
    ink.font = `${weight} 100px ${family}`;
    const stretch = parseFloat(titleStyle.getPropertyValue('--halftone-scale-x')) || 1.14;
    const stretchY = parseFloat(titleStyle.getPropertyValue('--halftone-scale-y')) || 1;
    const fontSize = Math.min(120, (width - 24) / (ink.measureText(text).width * stretch) * 85);
    ink.font = `${weight} ${fontSize}px ${family}`;
    const metrics = ink.measureText(text);
    const ascent = metrics.actualBoundingBoxAscent;
    const descent = metrics.actualBoundingBoxDescent;
    ink.translate(width / 2, height / 2);
    ink.scale(stretch, stretchY);
    ink.fillText(text, -metrics.width / 2,
      (ascent - descent) / 2);

    const pixels = ink.getImageData(0, 0, width, height).data;
    const gap = width < 600 ? 3 : 5;
    dots = [];
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        let coverage = 0;
        for (let sy = -1; sy <= 1; sy++) {
          for (let sx = -1; sx <= 1; sx++) {
            const sampleX = Math.max(0, Math.min(width - 1, Math.floor(x + sx * gap / 3)));
            const sampleY = Math.max(0, Math.min(height - 1, Math.floor(y + sy * gap / 3)));
            coverage += pixels[(sampleY * width + sampleX) * 4 + 3];
          }
        }
        coverage /= 9 * 255;
        if (coverage < 0.06) continue;
        dots.push({ x, y, hx: x, hy: y, vx: 0, vy: 0, radius: Math.sqrt(coverage) * gap * 0.4 });
      }
    }
    ring = null;
    previousTime = 0;
    wake();
  }

  function draw(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    const delta = previousTime ? Math.min((now - previousTime) / 16.667, 2) : 1;
    previousTime = now;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.clearRect(0, 0, width, height);
    const age = ring ? now - ring.time : 1000;
    let moving = false;
    for (const dot of dots) {
      if (!motion.matches) {
        if (pointer) {
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 80) {
            const force = (1 - distance / 80) * 2.6 * delta;
            dot.vx += (dx / (distance || 1)) * force;
            dot.vy += (dy / (distance || 1)) * force;
          }
        }
        if (age < 900) {
          const dx = dot.hx - ring.x;
          const dy = dot.hy - ring.y;
          const distance = Math.hypot(dx, dy);
          const band = Math.max(0, 1 - Math.abs(distance - age * 0.9) / 26);
          const force = band * 3.2 * (1 - age / 900) * delta;
          dot.vx += dx / (distance || 1) * force;
          dot.vy += dy / (distance || 1) * force;
        }
        dot.vx = (dot.vx + (dot.hx - dot.x) * 0.05 * delta) * Math.pow(0.84, delta);
        dot.vy = (dot.vy + (dot.hy - dot.y) * 0.05 * delta) * Math.pow(0.84, delta);
        dot.x += dot.vx * delta;
        dot.y += dot.vy * delta;
      }
      const displacement = Math.hypot(dot.x - dot.hx, dot.y - dot.hy);
      if (!motion.matches && (displacement > 0.05 || Math.abs(dot.vx) + Math.abs(dot.vy) > 0.02)) moving = true;
      else {
        dot.x = dot.hx;
        dot.y = dot.hy;
        dot.vx = dot.vy = 0;
      }
      const warmth = motion.matches ? 0 : Math.min(1, displacement / 28);
      context.fillStyle = `rgb(${cyan.map((channel, i) => Math.round(baseInk[i] + (channel - baseInk[i]) * warmth)).join(',')})`;
      context.beginPath();
      context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      context.fill();
    }
    if (!motion.matches && (moving || age < 900)) wake();
    else previousTime = 0;
  }

  // Leave touch gestures available for normal page scrolling.
  function localPoint(event) {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }
  name.addEventListener('pointermove', event => {
    if (motion.matches || event.pointerType === 'touch') return;
    const point = localPoint(event);
    pointer = point.y >= -80 && point.y <= height + 80 ? point : null;
    wake();
  }, { passive: true });
  name.addEventListener('pointerleave', () => { pointer = null; wake(); });
  name.addEventListener('pointerdown', event => {
    if (motion.matches || event.target.closest('a, button')) return;
    const point = localPoint(event);
    if (point.y < -80 || point.y > height + 80) return;
    ring = { ...point, time: performance.now() };
    wake();
  }, { passive: true });
  motion.addEventListener('change', () => { pointer = null; layout(); });
  new ResizeObserver(layout).observe(name);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
    else { cancelAnimationFrame(frame); frame = 0; pointer = null; previousTime = 0; }
  }).observe(name);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; pointer = null; previousTime = 0; }
    else wake();
  });
  layout();
  document.fonts.ready.then(layout);
  });
})();
