(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const skills = document.querySelector('.skill-marquees');
  const toggle = document.querySelector('.skill-motion-toggle');
  const education = document.getElementById('education');
  const lanes = [];
  let paused = false;
  let frame = 0;
  let previousY = scrollY;

  skills?.querySelectorAll('.skill-lane').forEach(lane => {
    const viewport = lane.querySelector('.skill-marquee');
    const track = lane.querySelector('.skill-track');
    const source = track.querySelector('.skill-list');
    const state = { viewport, source, track, width: 0,
      direction: lane.dataset.direction === 'right' ? -1 : 1, dragging: null };

    state.normalise = () => {
      if (motion.matches || !state.width) return;
      if (viewport.scrollLeft < state.width || viewport.scrollLeft >= state.width * 2) {
        viewport.scrollLeft = state.width + ((viewport.scrollLeft % state.width) + state.width) % state.width;
      }
    };
    state.resize = () => {
      track.querySelectorAll('[aria-hidden]').forEach(copy => copy.remove());
      state.width = source.getBoundingClientRect().width;
      if (!motion.matches && state.width > 0) {
        const copies = Math.ceil(viewport.clientWidth / state.width) + 3;
        for (let i = 0; i < copies; i++) {
          const copy = source.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          track.append(copy);
        }
        viewport.scrollLeft = state.width;
      } else viewport.scrollLeft = 0;
    };
    viewport.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      state.dragging = { id: event.pointerId, x: event.clientX };
    });
    viewport.addEventListener('pointermove', event => {
      const drag = state.dragging;
      if (!drag || drag.id !== event.pointerId) return;
      const delta = drag.x - event.clientX;
      if (Math.abs(delta) < 3) return;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
      viewport.scrollLeft += delta;
      drag.x = event.clientX;
      state.normalise();
    });
    const finish = event => {
      if (state.dragging?.id !== event.pointerId) return;
      state.dragging = null;
      viewport.classList.remove('is-dragging');
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    };
    viewport.addEventListener('pointerup', finish);
    viewport.addEventListener('pointercancel', finish);
    viewport.addEventListener('lostpointercapture', finish);
    viewport.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      viewport.scrollLeft += event.key === 'ArrowLeft' ? -180 : 180;
      state.normalise();
    });
    new ResizeObserver(state.resize).observe(viewport);
    lanes.push(state);
  });

  toggle?.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Resume scroll movement' : 'Pause scroll movement');
    toggle.querySelector('span').textContent = paused ? 'Resume' : 'Pause';
  });

  const create = (tag, className, text) => {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  let timeline;
  let journeyList;
  let progress;
  let activeYear;
  let activePeriod;
  let events = [];
  let active = -1;
  if (education && typeof journeyChapters !== 'undefined') {
    timeline = create('div', 'journey-scroll');
    timeline.classList.toggle('has-motion', !motion.matches);
    const rail = create('div', 'journey-rail');
    activeYear = create('span', 'journey-active-year', journeyChapters[0].period.slice(0, 4));
    activePeriod = create('span', 'journey-rail-period', journeyChapters[0].period);
    rail.append(activeYear, activePeriod, create('p', '', 'From secondary school to Game Technology at UTeM.'));
    const list = journeyList = create('ol', 'journey-events');
    list.setAttribute('aria-label', 'Education timeline');
    progress = create('li', 'journey-progress');
    progress.setAttribute('aria-hidden', 'true');
    list.append(progress);
    events = journeyChapters.map(chapter => {
      const event = create('li', 'journey-event');
      const article = create('article', 'journey-event-content');
      const header = create('div', 'journey-event-header');
      const logos = create('div', 'journey-event-logos');
      chapter.logos.forEach(logo => {
        const image = document.createElement('img');
        image.src = logo.src;
        image.alt = logo.alt;
        image.width = image.height = 72;
        image.loading = 'lazy';
        image.decoding = 'async';
        logos.append(image);
      });
      header.append(logos, create('span', 'journey-period', chapter.period));
      article.append(header, create('h3', '', chapter.institution),
        create('p', 'journey-program', chapter.program),
        create('p', 'journey-description', chapter.description),
        create('span', 'journey-result', chapter.result));
      event.append(article);
      list.append(event);
      return event;
    });
    timeline.append(rail, list);
    education.querySelector('.journey-board').replaceWith(timeline);
  }

  let skillsVisible = false;
  let timelineVisible = false;
  const visibility = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target === skills) skillsVisible = entry.isIntersecting;
      if (entry.target === timeline) timelineVisible = entry.isIntersecting;
    });
    schedule();
  }, { rootMargin:'120px' });
  if (skills) visibility.observe(skills);
  if (timeline) visibility.observe(timeline);

  function draw() {
    frame = 0;
    const delta = scrollY - previousY;
    previousY = scrollY;
    if (document.hidden) return;
    // Read timeline geometry before moving the skill rows or changing classes.
    const list = timelineVisible ? journeyList.getBoundingClientRect() : null;
    const positions = timelineVisible ? events.map(event => event.getBoundingClientRect().top) : [];
    if (!motion.matches && !paused && skillsVisible && delta) {
      // Distance follows the page directly, so the rows stop as soon as scrolling stops.
      lanes.forEach(lane => {
        if (lane.dragging) return;
        lane.viewport.scrollLeft += delta * 0.48 * lane.direction;
        lane.normalise();
      });
    }
    if (!list) return;
    const fill = Math.max(0, Math.min(1, (innerHeight * 0.62 - list.top - 30) / Math.max(1, list.height - 60)));
    progress.style.transform = `scaleY(${fill})`;
    let current = 0;
    events.forEach((event, i) => {
      const reached = positions[i] + 30 <= innerHeight * 0.62;
      event.classList.toggle('is-reached', reached || motion.matches);
      if (reached) current = i;
    });
    if (current !== active) {
      active = current;
      activeYear.textContent = journeyChapters[active].period.slice(0, 4);
      activePeriod.textContent = journeyChapters[active].period;
      events.forEach((event, i) => {
        if (i === active) event.setAttribute('aria-current', 'step');
        else event.removeAttribute('aria-current');
      });
    }
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  motion.addEventListener('change', () => {
    timeline?.classList.toggle('has-motion', !motion.matches);
    lanes.forEach(lane => lane.resize());
    previousY = scrollY;
    schedule();
  });
  document.addEventListener('visibilitychange', () => { previousY = scrollY; schedule(); });
  document.fonts.ready.then(() => { lanes.forEach(lane => lane.resize()); schedule(); });
  schedule();
})();
