import { useEffect, useRef, useState } from 'react';
import { ITEMS } from './WorkGallery.jsx';

const COUNT = ITEMS.length;
const TAU = Math.PI * 2;

// Two modes:
//  - overlay (default): fullscreen page, hijacks the wheel, Esc/Back to exit
//  - embedded: a 100vh section in the normal page flow; rotation is driven by
//    page scroll (plus drag), so it never traps the user's wheel
export default function RingGallery({ onBack, embedded = false }) {
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const engine = useRef({ rot: -2.2, drag: 0, scrollRot: 0, raf: 0, dragX: null });
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    const st = engine.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      const RX = Math.min(window.innerWidth * 0.42, 660);
      const RZ = RX * 0.92;
      const LIFT = Math.min(window.innerHeight * 0.09, 90);

      const target = st.scrollRot + st.drag;
      st.rot += (target - st.rot) * (reduced ? 1 : 0.06);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const phi = ((i - st.rot) / COUNT) * TAU;
        const depth = (Math.cos(phi) + 1) / 2; // 1 = front, 0 = back
        const x = Math.sin(phi) * RX;
        const z = (Math.cos(phi) - 1) * RZ;
        const y = -LIFT + depth * (LIFT * 3); // back cards float up, front card hangs low
        const scale = 0.42 + depth * 0.58;
        // every card faces the exact center of the ring: sides go edge-on,
        // the far side flips fully around (mirrored back, like the reference)
        el.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
          `rotateY(${phi}rad) scale(${scale})`;
        el.style.zIndex = String(Math.round(100 + depth * 100));
        el.style.filter = `brightness(${0.35 + depth * 0.65})`;
      });

      const f = ((Math.round(st.rot) % COUNT) + COUNT) % COUNT;
      setFocus(prev => (prev === f ? prev : f));
      st.raf = requestAnimationFrame(apply);
    };

    st.raf = requestAnimationFrame(apply);

    const spin = e => {
      st.drag += (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.0028;
    };

    const onWheel = e => {
      e.preventDefault();
      spin(e);
    };

    // Embedded: hijack the wheel only while the section is seated in the
    // viewport AND the cursor is inside the ring zone. Near the top/bottom
    // edges the page keeps scrolling, so the user can always leave.
    const onWheelEmbedded = e => {
      const r = rootRef.current.getBoundingClientRect();
      const seated = r.top <= 90 && r.bottom >= window.innerHeight - 90;
      const inRing =
        e.clientX > r.left + r.width * 0.08 &&
        e.clientX < r.right - r.width * 0.08 &&
        e.clientY > r.top + r.height * 0.16 &&
        e.clientY < r.top + r.height * 0.86;
      if (seated && inRing) {
        e.preventDefault();
        spin(e);
      }
    };

    const onKey = e => {
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        st.drag = Math.round(st.rot) + 1;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        st.drag = Math.round(st.rot) - 1;
    };

    const onScroll = () => {
      st.scrollRot = window.scrollY * 0.006;
    };

    const onPointerDown = e => { st.dragX = e.clientX; };
    const onPointerMove = e => {
      if (st.dragX === null) return;
      st.drag += (st.dragX - e.clientX) * 0.008;
      st.dragX = e.clientX;
    };
    const onPointerUp = () => { st.dragX = null; };

    const rootEl = rootRef.current;

    if (embedded) {
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('wheel', onWheelEmbedded, { passive: false });
    } else {
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('keydown', onKey);
    }
    rootEl.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(st.raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('wheel', onWheelEmbedded);
      window.removeEventListener('keydown', onKey);
      rootEl.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onBack, embedded]);

  return (
    <div
      ref={rootRef}
      className={`gallery${embedded ? ' gallery-embedded' : ''}`}
    >
      <div className="frame" aria-hidden="true" />
      {embedded && <span className="ghost" aria-hidden="true">04</span>}

      <div className="g-top">
        {embedded ? (
          <span className="g-mark">Sheet 04 — Capabilities</span>
        ) : (
          <button className="g-back" type="button" onClick={onBack}>
            ← Back to sheet 01
          </button>
        )}
        <span className="g-mark">The build wheel</span>
        <span className="g-hint">{embedded ? 'Scroll / drag ⟲' : 'Scroll ⟳'}</span>
      </div>

      <div className="r-stage" aria-label="Capabilities carousel" data-cursor="SPIN">
        {ITEMS.map((item, i) => (
          <figure
            key={item.src}
            className="g-card r-card"
            ref={el => { cardRefs.current[i] = el; }}
          >
            <img src={item.src} alt={item.title} draggable="false" />
          </figure>
        ))}

        <p className="r-center">
          From concept to working hardware —
          <em> design, fabricate, program, ship.</em>
        </p>
      </div>

      <div className="g-caption" aria-live="polite">
        <span className="g-index">
          {String(focus + 1).padStart(2, '0')} / {String(COUNT).padStart(2, '0')}
        </span>
        <span className="g-title">{ITEMS[focus].title}</span>
        <span className="g-meta">{ITEMS[focus].meta}</span>
      </div>
    </div>
  );
}
