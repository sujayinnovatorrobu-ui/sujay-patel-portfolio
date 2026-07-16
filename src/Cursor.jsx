import { useEffect, useRef } from 'react';

// CAD crosshair cursor: hairlines + ring follow the pointer with a live
// coordinate readout, like a drawing tool. Over interactive elements the
// readout becomes a bracket command. Desktop (fine pointer) only.
export default function Cursor() {
  const rootRef = useRef(null);
  const vRef = useRef(null);
  const hRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.documentElement.classList.add('has-cursor');

    const st = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: window.innerWidth / 2,
      ty: window.innerHeight / 2,
      scale: 1,
      tScale: 1,
      label: '',
      lastText: '',
      seen: false,
      raf: 0,
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = reduced ? 1 : 0.3;
    const pad = n => String(Math.round(n)).padStart(4, '0');

    const onMove = e => {
      st.tx = e.clientX;
      st.ty = e.clientY;
      if (!st.seen) {
        st.seen = true;
        rootRef.current.style.opacity = '1';
      }
    };

    const onOver = e => {
      const link = e.target.closest('a, button');
      const zone = e.target.closest('[data-cursor]');
      st.label = link ? 'OPEN' : zone ? zone.dataset.cursor : '';
      st.tScale = st.label ? 1.9 : 1;
      rootRef.current.classList.toggle('is-active', !!st.label);
    };

    const onLeave = () => { rootRef.current.style.opacity = '0'; };
    const onEnter = () => { if (st.seen) rootRef.current.style.opacity = '1'; };

    const loop = () => {
      st.x += (st.tx - st.x) * ease;
      st.y += (st.ty - st.y) * ease;
      st.scale += (st.tScale - st.scale) * (reduced ? 1 : 0.18);

      vRef.current.style.transform = `translateX(${st.x}px)`;
      hRef.current.style.transform = `translateY(${st.y}px)`;
      ringRef.current.style.transform =
        `translate(${st.x}px, ${st.y}px) scale(${st.scale})`;
      labelRef.current.style.transform =
        `translate(${st.x + 20}px, ${st.y + 20}px)`;

      const text = st.label
        ? `[ ${st.label} ]`
        : `X ${pad(st.x)} · Y ${pad(st.y)}`;
      if (text !== st.lastText) {
        labelRef.current.textContent = text;
        st.lastText = text;
      }

      st.raf = requestAnimationFrame(loop);
    };

    st.raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(st.raf);
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <span className="cur-v" ref={vRef} />
      <span className="cur-h" ref={hRef} />
      <span className="cur-ring" ref={ringRef} />
      <span className="cur-label" ref={labelRef} />
    </div>
  );
}
