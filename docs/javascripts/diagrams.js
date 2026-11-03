/*
 * Expandable 3D diagram cards.
 * Wraps every Mermaid block in a card with a title bar and an "Expand" button. Expanded diagrams open
 * full screen with zoom (buttons, Ctrl/⌘ + wheel, + / - / 0 keys), drag-to-pan and Esc to close.
 * Material renders Mermaid asynchronously: the source <pre class="mermaid"> is removed and the rendered
 * <div class="mermaid"> (SVG in a closed shadow root) is inserted later, so a MutationObserver wraps it.
 */
(function () {
  const MIN = 0.5, MAX = 4, STEP = 0.25; // zoom limits (1 = fit to width)

  function nearestHeading(el) {
    let n = el;
    while (n && n !== document.body) {
      let p = n.previousElementSibling;
      while (p) { if (/^H[1-4]$/.test(p.tagName)) return p.textContent.replace('¶', '').trim(); p = p.previousElementSibling; }
      n = n.parentElement;
    }
    return '';
  }

  function wrap(src) {
    if (src.closest('.diagram3d')) return;
    // Material removes the Mermaid source before rendering, so label the card with its section heading
    const title = nearestHeading(src) || 'Diagram';
    const safe = title.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]);
    const fig = document.createElement('figure');
    fig.className = 'diagram3d';
    fig.innerHTML = `
      <div class="diagram3d__card" tabindex="0" role="button" aria-label="Expand diagram: ${safe}">
        <div class="diagram3d__bar">
          <span class="diagram3d__dots" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="diagram3d__label" title="${safe}">◆ ${safe}</span>
          <span class="diagram3d__zoom">
            <button type="button" class="diagram3d__btn" data-act="out" aria-label="Zoom out">−</button>
            <span class="diagram3d__pct" aria-live="polite">100%</span>
            <button type="button" class="diagram3d__btn" data-act="in" aria-label="Zoom in">+</button>
            <button type="button" class="diagram3d__btn" data-act="reset">Fit</button>
          </span>
          <button type="button" class="diagram3d__btn" data-act="toggle">⤢ Expand</button>
        </div>
        <div class="diagram3d__viewport"></div>
        <span class="diagram3d__hint">click to expand</span>
      </div>`;
    src.parentNode.insertBefore(fig, src);
    fig.querySelector('.diagram3d__viewport').appendChild(src);
    fig._zoom = 1;
  }

  function setZoom(fig, z) {
    fig._zoom = Math.min(MAX, Math.max(MIN, Math.round(z * 100) / 100));
    const m = fig.querySelector('.mermaid');
    if (m) m.style.zoom = fig.classList.contains('is-expanded') ? fig._zoom : '';
    fig.querySelector('.diagram3d__pct').textContent = Math.round(fig._zoom * 100) + '%';
  }

  let open = null;
  function expand(fig) {
    if (open) collapse(open);
    open = fig;
    fig.classList.add('is-expanded');
    document.body.classList.add('diagram3d-open');
    fig.querySelector('[data-act="toggle"]').textContent = '✕ Close';
    setZoom(fig, 1); // 100% = diagram fills the viewer width
    fig.querySelector('[data-act="toggle"]').focus();
  }
  function collapse(fig) {
    fig.classList.remove('is-expanded');
    document.body.classList.remove('diagram3d-open');
    fig.querySelector('[data-act="toggle"]').textContent = '⤢ Expand';
    setZoom(fig, 1);
    open = null;
  }

  // One set of delegated listeners for the whole document
  document.addEventListener('click', (e) => {
    const fig = e.target.closest && e.target.closest('.diagram3d');
    if (!fig) return;
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'toggle') return fig.classList.contains('is-expanded') ? collapse(fig) : expand(fig);
    if (act === 'in') return setZoom(fig, fig._zoom + STEP);
    if (act === 'out') return setZoom(fig, fig._zoom - STEP);
    if (act === 'reset') return setZoom(fig, 1);
    if (fig.classList.contains('is-expanded')) {
      if (e.target === fig) collapse(fig);       // click on the dimmed backdrop
    } else {
      expand(fig);
    }
  });
  document.addEventListener('keydown', (e) => {
    const card = e.target.closest && e.target.closest('.diagram3d__card');
    if (!open && card && (e.key === 'Enter' || e.key === ' ') && e.target === card) { e.preventDefault(); expand(card.parentElement); return; }
    if (!open) return;
    if (e.key === 'Escape') collapse(open);
    else if (e.key === '+' || e.key === '=') setZoom(open, open._zoom + STEP);
    else if (e.key === '-') setZoom(open, open._zoom - STEP);
    else if (e.key === '0') setZoom(open, 1);
  });
  document.addEventListener('wheel', (e) => {
    if (!open || !(e.ctrlKey || e.metaKey) || !open.contains(e.target)) return;
    e.preventDefault();
    setZoom(open, open._zoom + (e.deltaY < 0 ? STEP : -STEP));
  }, { passive: false });

  // Drag to pan inside the expanded viewport
  let drag = null;
  document.addEventListener('pointerdown', (e) => {
    if (!open || e.button !== 0 || e.target.closest('button')) return;
    const vp = open.querySelector('.diagram3d__viewport');
    if (!vp.contains(e.target)) return;
    drag = { vp, x: e.clientX, y: e.clientY, l: vp.scrollLeft, t: vp.scrollTop, moved: false };
  });
  document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
    drag.vp.scrollLeft = drag.l - dx;
    drag.vp.scrollTop = drag.t - dy;
  });
  document.addEventListener('pointerup', () => { drag = null; });

  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.matches('.md-typeset .mermaid')) wrap(root);
    root.querySelectorAll?.('.md-typeset .mermaid').forEach(wrap);
  }

  // Material removes <pre class="mermaid"> immediately and inserts the rendered <div class="mermaid">
  // only after Mermaid has loaded, so watch for diagrams being added instead of wrapping once on load.
  new MutationObserver((mutations) => {
    for (const m of mutations) m.addedNodes.forEach(scan);
  }).observe(document.documentElement, { childList: true, subtree: true });

  function bind() {
    if (open) collapse(open);
    scan(document.body);
  }
  if (window.document$) window.document$.subscribe(bind);
  else document.addEventListener('DOMContentLoaded', bind);
})();
