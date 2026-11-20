(() => {
  const motion = window.Motion;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = [0.22, 1, 0.36, 1];

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
