(() => {
  const root = document.querySelector('.bwf');
  if (!root) return;
  const word = root.querySelector('.bwf-word');
  const inner = root.querySelector('.bwf-word-in');
  const letters = [...inner.querySelectorAll('.bwf-l')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer:coarse)');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const approach = (from, to, fraction, dt) => to + (from - to) * Math.pow(1 - fraction, dt * 60);
  const pointer = { x:0, y:0, u:.5, inside:false };
  let visible = false;
  let frame = 0;
  let fitFrame = 0;
  let last = 0;
  let fittedWidth = 0;
  let beam = 58;
  let px = 0;
  let py = 0;
  let glow = 0;

  root.dataset.in = motion.matches ? 'true' : 'false';
  root.querySelectorAll('.bwf-label,.bwf-fade,.bwf-lw').forEach((el, i) => {
    el.style.setProperty('--bwf-d', `${Math.min(i * 45, 600)}ms`);
  });
  root.querySelectorAll('.bwf-link').forEach(link => {
    link.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 9.5 7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  });

  function fit() {
    fitFrame = 0;
    const box = inner.parentElement;
    const target = box.clientWidth - 2 * (parseFloat(getComputedStyle(box).paddingLeft) || 0);
    if (target <= 0 || target === fittedWidth) return;
    fittedWidth = target;
    inner.style.fontSize = '100px';
    const measured = inner.getBoundingClientRect().width;
    const size = Math.min(target / measured * 100, target * .42);
    const style = getComputedStyle(inner);
    const ctx = document.createElement('canvas').getContext('2d');
    let baseline = .8;
    let ascent = .72;
    if (ctx) {
      ctx.font = `${style.fontWeight} 100px ${style.fontFamily}`;
      const metrics = ctx.measureText(inner.textContent.trim());
      if (metrics.actualBoundingBoxAscent > 0) ascent = metrics.actualBoundingBoxAscent / 100;
      if (metrics.fontBoundingBoxAscent > 0 && metrics.fontBoundingBoxDescent >= 0) {
        baseline = clamp(((100 - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent) / 100, .5, 1.2);
      }
    }
    inner.style.fontSize = `${size}px`;
    word.style.height = `${size * (baseline - ascent * .3)}px`;
    const bounds = root.getBoundingClientRect();
    root.style.setProperty('--bwf-rw', `${bounds.width}px`);
    root.style.setProperty('--bwf-rh', `${bounds.height}px`);
    let top = 0;
    const positions = letters.map(letter => {
      let x = 0;
      let y = 0;
      let element = letter;
      while (element && element !== root) {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      }
      return { x, y };
    });
    positions.forEach(({x, y}, i) => {
      letters[i].style.setProperty('--bwf-x', `${x}px`);
      letters[i].style.setProperty('--bwf-y', `${y}px`);
      if (i === 0) top = y;
    });
    root.style.setProperty('--bwf-top', `${top}px`);
    root.style.setProperty('--bwf-bot', `${top + size * .92}px`);
  }
  function scheduleFit() {
    if (!fitFrame) fitFrame = requestAnimationFrame(fit);
  }
  function paint() {
    root.style.setProperty('--bwf-b', `${beam.toFixed(2)}%`);
    root.style.setProperty('--bwf-px', `${px.toFixed(1)}px`);
    root.style.setProperty('--bwf-py', `${py.toFixed(1)}px`);
    root.style.setProperty('--bwf-g', glow.toFixed(3));
  }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || motion.matches || coarse.matches) return;
    if (last && now - last < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const dt = last ? Math.min(.1, (now - last) / 1000) : 1 / 60;
    last = now;
    const time = now / 1000;
    const idle = 58 + 9 * (.7 * Math.sin(time * .21) + .3 * Math.sin(time * .077 + 1.3));
    const target = pointer.inside ? (30 + 52 * pointer.u) * .75 + idle * .25 : idle;
    beam = approach(beam, target, .035, dt);
    px = approach(px, pointer.x, .16, dt);
    py = approach(py, pointer.y, .16, dt);
    glow = approach(glow, pointer.inside ? 1 : 0, .06, dt);
    paint();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (visible && !document.hidden && !motion.matches && !coarse.matches) frame = requestAnimationFrame(tick);
    else if (motion.matches || coarse.matches) {
      root.dataset.in = 'true';
      beam = 58;
      px = pointer.x;
      py = pointer.y;
      glow = pointer.inside ? 1 : 0;
      paint();
    }
  }
  function move(event) {
    const bounds = root.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.u = clamp(pointer.x / bounds.width, 0, 1);
    pointer.inside = event.type !== 'pointerleave';
    if (motion.matches || coarse.matches) sync();
  }
  root.addEventListener('pointermove', move, { passive:true });
  root.addEventListener('pointerenter', move, { passive:true });
  root.addEventListener('pointerleave', move, { passive:true });
  letters.forEach(letter => {
    letter.addEventListener('click', () => {
      if (motion.matches) return;
      letter.classList.remove('is-hop');
      void letter.offsetWidth;
      letter.classList.add('is-hop');
    });
    letter.addEventListener('animationend', () => letter.classList.remove('is-hop'));
  });
  new ResizeObserver(scheduleFit).observe(root);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) root.dataset.in = 'true';
    sync();
  }, { threshold:.12 }).observe(root);
  motion.addEventListener('change', sync);
  coarse.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  document.fonts.ready.then(() => { fittedWidth = 0; scheduleFit(); });
  fit();
})();
