(() => {
  const motion = window.Motion;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = [0.22, 1, 0.36, 1];

  function setupTour(tour) {
    const stage = tour.querySelector('.pencak-gallery-stage');
    const scenesFrame = tour.querySelector('.pencak-scenes');
    const controls = tour.querySelector('.pencak-scene-controls');
    const meter = tour.querySelector('.pencak-tour-meter span');
    const scenes = [...controls.querySelectorAll('button')].map((button) => {
      const figure = document.getElementById(button.getAttribute('aria-controls'));
      const image = figure.querySelector('img');
      const thumbnail = image.cloneNode();
      thumbnail.alt = '';
      button.prepend(thumbnail);
      return { button, figure, image };
    });
    tour.style.setProperty('--scene-count', scenes.length);
    let selected = -1;
    let stopTour;
    let sceneAnimation;
    let previousImage;

    function clearTransition() {
      if (sceneAnimation) {
        sceneAnimation.cancel();
        scenes[selected].image.style.removeProperty('opacity');
        scenes[selected].image.style.removeProperty('transform');
      }
      sceneAnimation = undefined;
      previousImage?.remove();
      previousImage = undefined;
    }

    function showScene(index, transition = true) {
      if (index === selected) return;
      const outgoing = scenes[selected]?.image;
      const incoming = scenes[index].image;
      const direction = index > selected ? 1 : -1;
      clearTransition();
      selected = index;

      scenes.forEach(({ button, figure }, sceneIndex) => {
        const current = sceneIndex === index;
        button.setAttribute('aria-pressed', String(current));
        figure.hidden = !current;
      });

      if (!transition || !motion || preference.matches || !outgoing?.naturalWidth || !incoming.naturalWidth) return;

      const image = outgoing.cloneNode();
      image.className = 'pencak-previous-scene';
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      image.removeAttribute('style');
      scenesFrame.prepend(image);
      previousImage = image;

      sceneAnimation = motion.animate(incoming, {
        opacity: [0, 1],
        transform: [
          `translateX(${direction * 12}px) scale(1.04)`,
          'translateX(0) scale(1)',
        ],
      }, { duration: 0.5, ease });
      Promise.resolve(sceneAnimation).then(() => {
        image.remove();
        if (previousImage === image) previousImage = undefined;
      }).catch(() => image.remove());
    }

    function startTour() {
      stopTour?.();
      stopTour = undefined;
      const enabled = Boolean(motion) && !preference.matches && innerHeight >= 680;
      tour.classList.toggle('is-scroll-tour', enabled);
      if (!enabled) {
        clearTransition();
        return;
      }

      const ceiling = parseFloat(getComputedStyle(stage).top);
      stopTour = motion.scroll((progress) => {
        meter.style.transform = `scaleX(${progress})`;
        const index = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
        showScene(index);
      }, {
        target: tour,
        offset: [`start ${ceiling}px`, `end ${ceiling + stage.offsetHeight}px`],
      });
    }

    scenes.forEach(({ button }, index) => button.addEventListener('click', () => {
      showScene(index);
      if (!stopTour) return;

      const start = tour.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top);
      const distance = tour.offsetHeight - stage.offsetHeight;
      window.scrollTo({ top: start + distance * (index + 0.5) / scenes.length, behavior: 'instant' });
    }));

    showScene(0, false);
    controls.hidden = false;
    if (!motion) return;

    motion.inView(tour, () => {
      scenes.forEach(({ image }) => { image.loading = 'eager'; });
    }, { margin: '0px 0px 300px 0px' });

    startTour();
    new ResizeObserver(startTour).observe(stage);
    preference.addEventListener('change', startTour);
  }

  document.querySelectorAll('.pencak-tour').forEach(setupTour);
  if (!motion) return;

  const { animate, inView, scroll } = motion;
  const arena = document.querySelector('.pencak-arena-window');
  const arenaPhoto = arena.querySelector('img');
  const award = document.querySelector('[data-pencak-reveal]');
  const awardPhoto = award.querySelector('img');
  let detachScroll;
  let detachAward;
  let arenaAnimation;
  let awardAnimation;
  let awardSeen = false;

  function syncPreference() {
    if (preference.matches) {
      detachScroll?.();
      detachAward?.();
      arenaAnimation?.cancel();
      awardAnimation?.cancel();
      arenaPhoto.style.removeProperty('transform');
      return;
    }

    arenaAnimation = animate(arenaPhoto, {
      transform: ['translateY(0%)', 'translateY(-10%)'],
    }, { ease: 'linear' });
    detachScroll = scroll(arenaAnimation, {
      target: arena,
      offset: ['start start', 'end start'],
    });

    if (!awardSeen) {
      detachAward = inView(award, () => {
        awardSeen = true;
        awardAnimation = animate(awardPhoto, {
          clipPath: ['inset(0 24% 0 0)', 'inset(0 0% 0 0)'],
        }, { duration: 0.72, ease });
      }, { amount: 0.18 });
    }
  }

  syncPreference();
  preference.addEventListener('change', syncPreference);
})();
