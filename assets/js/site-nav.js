(() => {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const header = nav.closest('.topbar');
  const toggle = header.querySelector('.nav-toggle');
  const mobile = matchMedia('(max-width:767px)');
  const links = [...nav.querySelectorAll('[data-nav-link]')];
  const sections = links.map(link => ({ link, section:document.querySelector(link.hash) }));
  let open = false;
  let frame = 0;
  let previousY = scrollY;
  let direction = 0;
  let travel = 0;

  function showHeader() {
    header.classList.remove('is-scroll-hidden');
    travel = 0;
    previousY = scrollY;
  }

  function syncVisibility() {
    const y = Math.max(0, Math.min(scrollY, document.documentElement.scrollHeight - innerHeight));
    const delta = y - previousY;
    previousY = y;
    if (y <= 16 || open || header.querySelector(':focus-visible')) {
      showHeader();
      return;
    }
    if (Math.abs(delta) < .5) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) { direction = nextDirection; travel = 0; }
    travel += Math.abs(delta);
    if (direction > 0 && travel >= 24 && y > header.offsetHeight + 24) {
      header.classList.add('is-scroll-hidden');
    } else if (direction < 0 && travel >= 10) {
      header.classList.remove('is-scroll-hidden');
    }
  }

  function setOpen(value, restoreFocus = false) {
    open = value && mobile.matches;
    toggle.hidden = !mobile.matches;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
    nav.hidden = mobile.matches && !open;
    if (open) showHeader();
    if (restoreFocus) toggle.focus();
  }

  function syncActive() {
    frame = 0;
    syncVisibility();
    const marker = Math.min(innerHeight * .4, header.offsetHeight + 180);
    const atEnd = scrollY > 0 && scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
    const current = atEnd ? sections.at(-1) : sections.find(({ section }) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= marker && bounds.bottom > marker;
    });
    links.forEach(link => {
      if (link === current?.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  toggle.addEventListener('click', () => setOpen(!open));
  header.addEventListener('focusin', showHeader);
  links.forEach(link => link.addEventListener('click', () => setOpen(false)));
  header.querySelector('.mark').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) setOpen(false, true);
  });
  document.addEventListener('pointerdown', event => {
    if (open && !header.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWasInNav = nav.contains(document.activeElement);
    setOpen(false, mobile.matches && focusWasInNav);
    showHeader();
    syncActive();
  });
  addEventListener('scroll', () => {
    if (!frame) frame = requestAnimationFrame(syncActive);
  }, { passive:true });
  setOpen(false);
  syncActive();
})();
