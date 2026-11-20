(() => {
  const opening = document.querySelector('.ipetro-opening');
  const canvas = opening.querySelector('canvas');
  const source = opening.querySelector('.ipetro-panorama img');
  const controls = opening.querySelector('.ipetro-view-controls');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = window.Motion;

  function createRenderer() {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl || !source.naturalWidth || source.naturalWidth > gl.getParameter(gl.MAX_TEXTURE_SIZE)) return;

    function compile(type, code) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      return shader;
    }

    const vertex = compile(gl.VERTEX_SHADER, `
      attribute vec2 position;
      varying vec2 plane;
      void main() {
        plane = position;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `);
    const fragment = compile(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform sampler2D panorama;
      uniform float aspect;
      uniform float heading;
      varying vec2 plane;
      void main() {
        float lens = min(1.0, 1.22 / aspect);
        vec3 ray = normalize(vec3(plane.x * aspect * lens, plane.y * lens, 1.0));
        float longitude = atan(ray.x, ray.z) + heading;
        float latitude = asin(ray.y);
        vec2 uv = vec2(fract(longitude / 6.2831853 + 0.5), 0.5 - latitude / 3.1415927);
        gl_FragColor = texture2D(panorama, uv);
      }
    `);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, 'position');
    const aspect = gl.getUniformLocation(program, 'aspect');
    const heading = gl.getUniformLocation(program, 'heading');
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    } catch {
      return;
    }
    if (gl.getError() !== gl.NO_ERROR) return;

    return {
      resize() {
        const density = Math.min(devicePixelRatio || 1, 1.5);
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * density));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * density));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(aspect, canvas.width / canvas.height);
      },
      draw(angle) {
        gl.uniform1f(heading, angle % (Math.PI * 2));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
    };
  }

  function enablePanorama() {
    const renderer = createRenderer();
    if (!renderer) return;

    let angle = 0.14;
    let scrollAngle = 0;
    let frame = 0;
    let drag;
    let turn;
    let stopScroll;

    function requestDraw() {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        renderer.draw(angle + scrollAngle);
      });
    }

    function syncScroll() {
      turn?.stop();
      stopScroll?.();
      scrollAngle = 0;
      requestDraw();
      if (!motion || preference.matches) return;
      stopScroll = motion.scroll((progress) => {
        scrollAngle = progress * 0.5;
        requestDraw();
      }, { target: opening, offset: ['start start', 'end start'] });
    }

    controls.addEventListener('click', (event) => {
      const button = event.target.closest('[data-turn]');
      if (!button) return;
      turn?.stop();
      const destination = angle + Number(button.dataset.turn) * Math.PI / 5;
      if (!motion || preference.matches) {
        angle = destination;
        requestDraw();
        return;
      }
      turn = motion.animate(angle, destination, {
        duration: 0.65, ease: [0.22, 1, 0.36, 1],
        onUpdate(value) {
          angle = value;
          requestDraw();
        },
      });
    });

    opening.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0 || event.target.closest('a, button')) return;
      drag = { id: event.pointerId, x: event.clientX };
    });
    opening.addEventListener('pointermove', (event) => {
      if (drag?.id !== event.pointerId) return;
      const distance = event.clientX - drag.x;
      if (!opening.hasPointerCapture(drag.id)) {
        if (Math.abs(distance) < 7) return;
        opening.setPointerCapture(drag.id);
        opening.setAttribute('data-dragging', '');
        turn?.stop();
      }
      angle -= distance * 0.004;
      drag.x = event.clientX;
      requestDraw();
    });
    for (const type of ['pointerup', 'pointercancel', 'pointerleave', 'lostpointercapture']) {
      opening.addEventListener(type, (event) => {
        if (drag?.id !== event.pointerId) return;
        drag = undefined;
        opening.removeAttribute('data-dragging');
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      renderer.resize();
      requestDraw();
    });
    canvas.addEventListener('webglcontextlost', () => {
      resizeObserver.disconnect();
      preference.removeEventListener('change', syncScroll);
      stopScroll?.();
      turn?.stop();
      cancelAnimationFrame(frame);
      opening.removeAttribute('data-panorama-ready');
      controls.hidden = true;
    }, { once: true });

    opening.setAttribute('data-panorama-ready', '');
    controls.hidden = false;
    renderer.resize();
    renderer.draw(angle);
    resizeObserver.observe(canvas);
    preference.addEventListener('change', syncScroll);
    syncScroll();
  }

  if (source.complete) enablePanorama();
  else source.addEventListener('load', enablePanorama, { once: true });
})();
