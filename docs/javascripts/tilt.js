/* Mouse-follow 3D tilt for .tilt cards. Re-binds on MkDocs Material instant navigation. */
(function () {
  const MAX = 12; // degrees
  function bind() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('.tilt').forEach((el) => {
      if (el.dataset.tiltBound) return;
      el.dataset.tiltBound = '1';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${x * MAX}deg) rotateX(${-y * MAX}deg) translateZ(10px)`;
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
  }
  if (window.document$) window.document$.subscribe(bind);
  else document.addEventListener('DOMContentLoaded', bind);
})();
