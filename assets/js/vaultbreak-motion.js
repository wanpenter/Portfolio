(() => {
  const opening = document.querySelector('.vaultbreak-opening');
  const motion = window.Motion;
  if (!opening || !motion) return;

  const { animate, scroll } = motion;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 740px)');
  const scene = opening.querySelector('.vaultbreak-scene');
  const photo = scene.querySelector('img');
  const scan = scene.querySelector('.vaultbreak-scan');
  const title = opening.querySelector('h1');
  const demo = document.querySelector('#project-demo');
  const player = demo.querySelector('.video-slot-inner');
  const gallery = document.querySelector('#project-gallery [data-project-tour]');
  const galleryStage = gallery.querySelector('[data-tour-stage]');
  const introAnimations = [];
  const scrollTracks = [];
  const ease = [0.16, 1, 0.3, 1];

  function animateScroll(target, keyframes, options) {
    const animation = animate(target, keyframes, { ease: 'linear' });
    const detach = scroll(animation, options);
    scrollTracks.push(() => {
      detach();
      animation.cancel();
      target.style.removeProperty('transform');
    });
  }

  function syncScroll() {
    for (const stop of scrollTracks.splice(0)) stop();
    if (preference.matches) return;

    const photoEnd = compact.matches ? 'translateY(6%) scale(1.04)' : 'translateY(13%) scale(1.1)';
    animateScroll(scene, {
      transform: ['translateY(0%) scale(1)', photoEnd],
    }, { target: opening, offset: ['start start', 'end start'] });

    const playerStart = compact.matches ? 'scale(0.94)' : 'scale(0.82, 0.94)';
    animateScroll(player, {
      transform: [playerStart, 'scale(1, 1)'],
    }, { target: demo, offset: ['start 95%', 'start 32%'] });

    const detachGallery = scroll((progress) => {
      galleryStage.style.setProperty('--gallery-reveal', progress);
    }, { target: gallery, offset: ['start 96%', 'start 34%'] });
    scrollTracks.push(() => {
      detachGallery();
      galleryStage.style.removeProperty('--gallery-reveal');
    });
  }

  if (!preference.matches && !location.hash && scrollY < opening.offsetHeight / 3) {
    introAnimations.push(
      animate(photo, {
        transform: ['scale(1.12)', 'scale(1)'],
      }, { duration: 1.05, ease }),
      animate(scan, {
        transform: ['translateX(-101%)', 'translateX(1%)'],
        opacity: [0, 0.8, 0.8, 0],
      }, {
        duration: 0.9,
        ease: 'easeInOut',
        opacity: { duration: 0.9, ease: 'linear', times: [0, 0.15, 0.78, 1] },
      }),
      animate(title, {
        transform: ['translateX(20px)', 'translateX(0px)'],
        clipPath: ['inset(-15% 48% -22% -3%)', 'inset(-15% -3% -22% -3%)'],
      }, { duration: 0.73, delay: 0.08, ease }),
    );
  }

  preference.addEventListener('change', () => {
    if (preference.matches) {
      for (const animation of introAnimations.splice(0)) animation.cancel();
      photo.style.removeProperty('transform');
      scan.style.removeProperty('transform');
      scan.style.removeProperty('opacity');
      title.style.removeProperty('transform');
      title.style.removeProperty('clip-path');
    }
    syncScroll();
  });
  compact.addEventListener('change', syncScroll);
  syncScroll();
})();
