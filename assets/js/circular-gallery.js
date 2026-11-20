(() => {
  const sources = document.querySelectorAll('[data-circular-gallery]');
  const viewerLinks = document.querySelectorAll('a[data-gallery-viewer]');
  if (!sources.length && !viewerLinks.length) return;

  const viewer = document.createElement('dialog');
  viewer.className = 'gallery-viewer';
  viewer.setAttribute('aria-label', 'Full-size image');
  viewer.innerHTML = '<form method="dialog"><button aria-label="Close image" autofocus>×</button></form><img alt="">';
  const fullImage = viewer.querySelector('img');
  document.body.append(viewer);
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => fullImage.removeAttribute('src'));

  function bindViewer(link, alt) {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          typeof viewer.showModal !== 'function') return;
      event.preventDefault();
      fullImage.alt = alt;
      fullImage.src = link.href;
      viewer.showModal();
    });
  }

  viewerLinks.forEach((link) => bindViewer(link, link.querySelector('img').alt));

  sources.forEach((source) => {
    const cards = [...source.querySelectorAll(':scope > figure, :scope > article')];
    const gallery = document.createElement('div');
    gallery.className = 'project-image-strip';
    gallery.tabIndex = 0;
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-label', source.closest('section').querySelector('h2').textContent);

    let drag;
    gallery.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || !event.target.closest('a')) return;
      drag = { id: event.pointerId, x: event.clientX, left: gallery.scrollLeft };
    });
    gallery.addEventListener('dragstart', (event) => event.preventDefault());
    gallery.addEventListener('pointermove', (event) => {
      if (drag?.id !== event.pointerId) return;
      const distance = event.clientX - drag.x;
      if (!gallery.hasPointerCapture(event.pointerId)) {
        if (!(event.buttons & 1) || Math.abs(distance) < 8) return;
        gallery.setPointerCapture(event.pointerId);
        gallery.classList.add('is-dragging');
      }
      gallery.scrollLeft = drag.left - distance;
    });
    function finishDrag() {
      drag = undefined;
      gallery.classList.remove('is-dragging');
    }
    gallery.addEventListener('pointerup', finishDrag);
    gallery.addEventListener('pointercancel', finishDrag);
    gallery.addEventListener('lostpointercapture', finishDrag);

    cards.forEach((card) => {
      const image = card.querySelector('img[src]');
      if (!image) return;
      const caption = card.querySelector('figcaption, .pencak-journey-copy');
      const title = caption?.querySelector('strong, h3') ?? caption?.querySelector('span');
      const description = caption?.querySelector('p, strong + span');
      const slide = document.createElement('figure');
      const link = document.createElement('a');
      const preview = image.cloneNode(false);
      link.href = image.src;
      link.setAttribute('aria-label', 'View full size: ' + (title?.textContent.trim() || image.alt));
      link.append(preview);
      slide.append(link);

      if (caption) {
        const label = document.createElement('figcaption');
        label.textContent = title?.textContent.trim() || caption.textContent.trim();
        if (description) {
          const detail = document.createElement('span');
          detail.textContent = description.textContent.trim();
          label.append(detail);
        }
        slide.append(label);
      }

      if (source.classList.contains('pencak-art')) {
        link.dataset.artworkTitle = title?.textContent.trim() || image.alt;
        link.dataset.artworkAlt = image.alt;
      } else {
        bindViewer(link, image.alt);
      }

      gallery.append(slide);
    });

    if (gallery.children.length) source.replaceWith(gallery);
  });
})();
