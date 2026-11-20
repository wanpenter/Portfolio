(() => {
  const motion = window.Motion;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const tallViewport = matchMedia('(min-height: 680px)');
  const ease = [0.22, 1, 0.36, 1];

  function setupTour(tour) {
    const stage = tour.querySelector('[data-tour-stage]');
    const scenesFrame = tour.querySelector('[data-tour-scenes]');
    const controls = tour.querySelector('[data-tour-controls]');
    const meter = tour.querySelector('[data-tour-meter] span');
    const buttons = [...(controls?.querySelectorAll('button') ?? [])];
    const figures = controls
      ? buttons.map((button) => document.getElementById(button.getAttribute('aria-controls')))
      : [...scenesFrame.querySelectorAll(':scope > figure')];
    const scenes = figures.map((figure, index) => {
      const button = buttons[index];
      const image = figure.querySelector('img');
      if (button) {
        const thumbnail = image.cloneNode();
        thumbnail.alt = '';
        button.prepend(thumbnail);
      }
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
        button?.setAttribute('aria-pressed', String(current));
        figure.hidden = !current;
      });

      if (controls && controls.scrollWidth > controls.clientWidth) {
        const rail = controls.getBoundingClientRect();
        const thumb = scenes[index].button.getBoundingClientRect();
        const inset = 3;
        if (thumb.left < rail.left + inset) controls.scrollLeft += thumb.left - rail.left - inset;
        if (thumb.right > rail.right - inset) controls.scrollLeft += thumb.right - rail.right + inset;
      }

      if (!transition || !motion || preference.matches || !outgoing?.naturalWidth || !incoming.naturalWidth) return;

      const image = outgoing.cloneNode();
      image.className = 'project-tour-previous';
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
      const enabled = Boolean(motion) && !preference.matches && tallViewport.matches;
      tour.classList.toggle('is-scroll-tour', enabled);
      if (!enabled) {
        clearTransition();
        if (!controls) {
          for (const { figure } of scenes) figure.hidden = false;
          selected = -1;
        }
        return;
      }

      if (selected < 0) showScene(0, false);
      const ceiling = parseFloat(getComputedStyle(stage).top);
      stopTour = motion.scroll((progress) => {
        if (meter) meter.style.transform = `scaleX(${progress})`;
        const index = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
        showScene(index);
      }, {
        target: tour,
        offset: [`start ${ceiling}px`, `end ${ceiling + stage.offsetHeight}px`],
      });
    }

    buttons.forEach((button, index) => button.addEventListener('click', () => {
      showScene(index);
      if (!stopTour) return;

      const start = tour.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(stage).top);
      const distance = tour.offsetHeight - stage.offsetHeight;
      window.scrollTo({ top: start + distance * (index + 0.5) / scenes.length, behavior: 'instant' });
    }));

    if (controls) {
      showScene(0, false);
      controls.hidden = false;
    }
    if (!motion) return;

    motion.inView(tour, () => {
      scenes.forEach(({ image }) => { image.loading = 'eager'; });
    }, { margin: '0px 0px 300px 0px' });

    startTour();
    new ResizeObserver(startTour).observe(stage);
    preference.addEventListener('change', startTour);
    tallViewport.addEventListener('change', startTour);
  }

  document.querySelectorAll('[data-project-tour]').forEach(setupTour);
})();
