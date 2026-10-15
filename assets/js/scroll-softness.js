(() => {
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  const coarse = matchMedia('(pointer:coarse)');
  const targets = [...document.querySelectorAll('.section-wordmark')];
  const visible = new Set();
  let frame = 0;
  let previousY = scrollY;
  let previousTime = 0;
  let softness = 0;
  targets.forEach(target => target.setAttribute('data-scroll-soften', ''));

  function clear() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    softness = 0;
    previousY = scrollY;
    targets.forEach(target => target.style.removeProperty('filter'));
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else { visible.delete(target); target.style.removeProperty('filter'); }
    });
  }, { rootMargin:'60px' });
  targets.forEach(target => observer.observe(target));

  function tick(now) {
    frame = 0;
    if (motion.matches || coarse.matches || document.hidden) { clear(); return; }
    if (previousTime && now - previousTime < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const dt = previousTime ? Math.min(64, now - previousTime) : 16.67;
    const distance = Math.abs(scrollY - previousY);
    const target = Math.min(.85, distance / Math.max(dt, 1) * .24);
    softness += (target - softness) * (1 - Math.exp(-dt / 65));
    previousY = scrollY;
    previousTime = now;
    if (softness < .025 && distance < .1) { clear(); return; }
    visible.forEach(element => { element.style.filter = `blur(${softness.toFixed(2)}px)`; });
    frame = requestAnimationFrame(tick);
  }

  addEventListener('scroll', () => {
    if (!motion.matches && !coarse.matches && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }, { passive:true });
  motion.addEventListener('change', clear);
  coarse.addEventListener('change', clear);
  document.addEventListener('visibilitychange', clear);
})();
