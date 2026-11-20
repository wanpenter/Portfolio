(() => {
  const opening = document.querySelector('.workshop-opening');
  const motion = window.Motion;
  if (!opening || !motion) return;

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = opening.querySelector('.workshop-scene');
  const demo = document.querySelector('#project-demo');
  const player = demo.querySelector('.video-slot-inner');
  const stopTracks = [];

  function trackScroll(element, property, target, offset) {
    const stop = motion.scroll((progress) => {
      element.style.setProperty(property, progress);
    }, { target, offset });
    stopTracks.push(() => {
      stop();
      element.style.removeProperty(property);
    });
  }

  function syncMotion() {
    for (const stop of stopTracks.splice(0)) stop();
    if (preference.matches) {
      opening.classList.remove('is-entering');
      return;
    }
    trackScroll(scene, '--bay-scroll', opening, ['start start', 'end start']);
    trackScroll(player, '--preview-scroll', demo, ['start 95%', 'start 30%']);
  }

  if (!preference.matches && !location.hash && scrollY < opening.offsetHeight / 3) {
    scene.querySelector('img').addEventListener('animationend', () => {
      opening.classList.remove('is-entering');
    }, { once: true });
    opening.classList.add('is-entering');
  }

  syncMotion();
  preference.addEventListener('change', syncMotion);
})();
