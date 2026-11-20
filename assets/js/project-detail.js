(() => {
  const main = document.querySelector('#project-main');
  const sections = [...main.querySelectorAll('.sec[id]')];
  const media = main.querySelector('.project-demo');
  const layout = main.querySelector('.project-layout');
  const hero = main.querySelector('.dhero');
  const header = document.querySelector('.topbar');
  const wide = matchMedia('(min-width: 961px) and (min-height: 650px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const guide = document.createElement('aside');
  guide.className = 'project-guide';
  guide.innerHTML = `
    <div class="project-preview" aria-hidden="true" hidden></div>
    <details class="project-contents">
      <summary>On this page</summary>
      <nav aria-label="On this page"><ol></ol></nav>
    </details>
    <div class="project-progress" aria-hidden="true"><span></span></div>`;

  const contents = guide.querySelector('details');
  const list = contents.querySelector('ol');
  const preview = guide.querySelector('.project-preview');
  const progress = guide.querySelector('.project-progress span');
  const cover = media.querySelector('video[poster]')?.poster ?? media.querySelector('img[src]')?.src;
  const actions = document.createElement('div');
  actions.className = 'project-hero-actions';
  function createAction(href, text) {
    const link = document.createElement('a');
    const label = document.createElement('span');
    link.href = href;
    label.className = 'project-action-label';
    label.textContent = text;
    link.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
    link.prepend(label);
    return link;
  }

  function focusTarget(target) {
    target.focus({ preventScroll: true });
  }

  if (!hero.hasAttribute('data-project-actions')) {
    const demoLink = createAction('#project-demo', media.querySelector('video') ? 'Watch demo' : 'View project preview');
    const contentsLink = createAction('#' + sections[0].id, 'Read about the project');
    actions.append(demoLink, contentsLink);
    hero.append(actions);
    demoLink.addEventListener('click', () => focusTarget(media));
    contentsLink.addEventListener('click', () => focusTarget(sections[0]));
  }

  let imageForSection = cover;
  const entries = sections.map((section) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + section.id;
    link.textContent = section.querySelector('h2').textContent;
    link.addEventListener('click', () => {
      if (!wide.matches) contents.open = false;
      focusTarget(section);
    });
    item.append(link);
    list.append(item);
    imageForSection = section.querySelector('img[src]')?.src ?? imageForSection;
    return { section, link, image: imageForSection };
  });

  layout.prepend(guide);
  layout.classList.add('has-guide');
  let active;
  let requestedImage;
  let frame = 0;
  let headerHeight;

  function showPreview(src) {
    if (!src || src === requestedImage) return;
    requestedImage = src;
    const image = new Image();
    image.alt = '';
    image.src = src;
    image.decode().then(() => {
      if (requestedImage !== src) return;
      preview.replaceChildren(image);
      preview.hidden = false;
    }).catch(() => {});
  }

  function update() {
    frame = 0;
    const activationLine = headerHeight + (wide.matches ? 80 : 124);
    const bounds = layout.getBoundingClientRect();
    let current = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top > activationLine) break;
      current = entry;
    }
    if (document.documentElement.scrollHeight > innerHeight &&
        document.documentElement.scrollHeight - innerHeight - scrollY <= 2) {
      current = entries.at(-1);
    }

    if (active !== current) {
      active?.link.removeAttribute('aria-current');
      current.link.setAttribute('aria-current', 'location');
      active = current;
      if (contents.open && !list.contains(document.activeElement)) {
        const linkBox = current.link.getBoundingClientRect();
        const listBox = list.getBoundingClientRect();
        if (linkBox.top < listBox.top) list.scrollTop += linkBox.top - listBox.top;
        if (linkBox.bottom > listBox.bottom) list.scrollTop += linkBox.bottom - listBox.bottom;
      }
    }

    const distance = Math.max(1, bounds.height - innerHeight + activationLine);
    const fraction = Math.max(0, Math.min(1, (activationLine - bounds.top) / distance));
    progress.style.transform = 'scaleX(' + fraction + ')';

    if (wide.matches) {
      showPreview(current.image);
      if (!reducedMotion.matches) {
        const offset = current.section.getBoundingClientRect().top - activationLine;
        const angle = Math.max(-6, Math.min(6, offset / 36));
        preview.style.setProperty('--project-tilt', angle + 'deg');
      }
    }
  }

  function scheduleUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function resize() {
    headerHeight = Math.ceil(header.getBoundingClientRect().height);
    document.body.style.setProperty('--project-header', headerHeight + 'px');
    scheduleUpdate();
  }

  function updateContentsMode() {
    contents.open = wide.matches;
    resize();
  }

  addEventListener('scroll', scheduleUpdate, { passive: true });
  addEventListener('resize', resize);
  wide.addEventListener('change', updateContentsMode);
  reducedMotion.addEventListener('change', scheduleUpdate);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(header);
    observer.observe(layout);
  }
  updateContentsMode();
})();
