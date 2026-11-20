(() => {
  const motion = window.Motion;
  const opening = document.querySelector('.ipetro-opening');
  if (!motion || !opening) return;

  const { animate, inView, scroll, stagger } = motion;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 740px)');
  const ease = [0.16, 1, 0.3, 1];
  const activeEntrances = new Set();
  const pendingGroups = new Set(document.querySelectorAll('.ipetro-page :is(.fact-strip, .role-grid)'));
  const demo = document.querySelector('#project-demo');
  const player = demo.querySelector('.video-slot-inner');
  let playerExpansion;
  let detachScroll;
  let detachGroups;
  let introPlayed = false;

  function play(target, keyframes, options) {
    const animation = animate(target, keyframes, { ease, ...options });
    activeEntrances.add(animation);
    animation.then(() => activeEntrances.delete(animation));
  }

  function syncDemo() {
    detachScroll?.();
    playerExpansion?.cancel();
    if (preference.matches) return;

    const start = compact.matches ? 'translateY(12px) scale(0.92)' : 'translateY(32px) scale(0.76)';
    playerExpansion = animate(player, {
      transform: [start, 'translateY(0px) scale(1)'],
    }, { ease: 'linear' });
    detachScroll = scroll(playerExpansion, { target: demo, offset: ['start 92%', 'start 28%'] });
  }

  function syncPreference() {
    syncDemo();
    detachGroups?.();
    if (preference.matches) {
      for (const animation of activeEntrances) animation.cancel();
      activeEntrances.clear();
      return;
    }

    if (!introPlayed && !location.hash && scrollY < opening.offsetHeight / 3) {
      play(opening.querySelector('.ipetro-panorama'), {
        transform: ['scale(1.17)', 'scale(1)'],
      }, { duration: 0.88 });
      play(opening.querySelector('.ipetro-wordmark'), {
        clipPath: ['inset(0% 64% -12% 0%)', 'inset(0% 0% -12% 0%)'],
        transform: ['translateY(32px)', 'translateY(0px)'],
      }, { duration: 0.72 });
      play(opening.querySelectorAll('.dpitch, .dhero-roleline, .dtags, .award-line'), {
        transform: ['translateY(18px)', 'translateY(0px)'],
        opacity: [0.72, 1],
      }, { duration: 0.46, delay: stagger(0.055, { startDelay: 0.1 }) });
    }
    introPlayed = true;

    detachGroups = inView([...pendingGroups], (group) => {
      pendingGroups.delete(group);
      play([...group.children], {
        transform: ['translateY(20px)', 'translateY(0px)'],
        opacity: [0.56, 1],
      }, { duration: 0.52, delay: stagger(0.075) });
    }, { amount: 'some', margin: '0px 0px -36px' });
  }

  syncPreference();
  preference.addEventListener('change', syncPreference);
  compact.addEventListener('change', syncDemo);
})();
