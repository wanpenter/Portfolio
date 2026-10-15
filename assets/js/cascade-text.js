(() => {
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('en', { granularity:'grapheme' })
    : null;

  document.querySelectorAll('[data-cascade]').forEach(heading => {
    const text = heading.textContent.trim();
    const fragment = document.createDocumentFragment();
    let index = 0;

    text.split(/(\s+)/).forEach(part => {
      if (/^\s+$/.test(part)) {
        fragment.append(document.createTextNode(part));
        index += part.length;
        return;
      }

      const word = document.createElement('span');
      word.className = 'cascade-word';
      word.setAttribute('aria-hidden', 'true');
      const chars = segmenter
        ? Array.from(segmenter.segment(part), item => item.segment)
        : Array.from(part);
      chars.forEach(char => {
        const letter = document.createElement('span');
        letter.className = 'cascade-char';
        letter.textContent = char;
        letter.style.setProperty('--cascade-delay', `${index++ * 25}ms`);
        word.append(letter);
      });
      fragment.append(word);
    });

    heading.setAttribute('aria-label', text);
    heading.replaceChildren(fragment);
  });
})();
