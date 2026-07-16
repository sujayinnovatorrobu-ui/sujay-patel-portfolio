import { useEffect, useRef, useState } from 'react';

// Chronological field record — each card is one milestone.
export const ITEMS = [
  {
    src: '/work/2.jpg',
    title: 'Robofest Gujarat 3.0 — First Prize',
    meta: 'Maze Solving Robot · ₹10,00,000 · Grand Finale, Science City',
  },
  {
    src: '/work/3.jpg',
    title: 'Robofest Gujarat 4.0 — Proof of Concept',
    meta: 'Fun Robotics & Maze Solving · Level II · Science City, Ahmedabad',
  },
  {
    src: '/work/5.jpg',
    title: 'Drobotics Conclave 2026 — First Place',
    meta: 'RC Robo Race · ₹25,000 · Adani University, Ahmedabad',
  },
  {
    src: '/work/4.jpg',
    title: 'Felicitated on the state stage',
    meta: 'Government of Gujarat ceremony',
  },
  {
    src: '/work/1.jpg',
    title: 'Robofest Gujarat 5.0 — All categories',
    meta: 'AI autonomous · maze solving · robo athletes · homobot',
  },
  {
    src: '/work/6.jpg',
    title: 'Robofest Gujarat 5.0 — The squad',
    meta: "India's biggest robotic competition · Science City",
  },
  {
    src: '/work/7.jpg',
    title: 'Grand Finale 2026',
    meta: 'Team and full robot fleet · Science City, Ahmedabad',
  },
  {
    src: '/work/8.jpg',
    title: 'The fleet',
    meta: 'Six robots built in-house at Project & Innovation Lab',
  },
];

const COUNT = ITEMS.length;

export default function WorkGallery({ onBack }) {
  const cardRefs = useRef([]);
  const engine = useRef({ p: -2.6, target: 0, raf: 0, dragY: null });
  const [focus, setFocus] = useState(0);

  useEffect(() => {
    const st = engine.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      const R = Math.min(window.innerWidth * 0.36, 540);
      const YS = Math.min(window.innerHeight * 0.24, 200);
      const STEP = 0.55;

      st.p += (st.target - st.p) * (reduced ? 1 : 0.075);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - st.p;
        const a = d * STEP;
        const x = Math.sin(a) * R;
        const y = -d * YS;
        const z = (Math.cos(a) - 1) * R;
        const ad = Math.abs(d);
        const scale = 1 + Math.max(0, 1 - ad) * 0.08;
        el.style.transform =
          `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) ` +
          `rotateY(${a * 0.9}rad) scale(${scale})`;
        el.style.opacity = String(1 - Math.min(Math.max((ad - 2.6) / 1.4, 0), 1));
        el.style.zIndex = String(Math.round(200 - ad * 10));
        el.style.filter = `brightness(${1 - Math.min(ad * 0.13, 0.5)})`;
      });

      const f = Math.min(Math.max(Math.round(st.p), 0), COUNT - 1);
      setFocus(prev => (prev === f ? prev : f));
      st.raf = requestAnimationFrame(apply);
    };

    st.raf = requestAnimationFrame(apply);

    const clampTarget = v => Math.min(Math.max(v, -0.4), COUNT - 0.6);

    const onWheel = e => {
      e.preventDefault();
      st.target = clampTarget(st.target + e.deltaY * 0.0032);
    };

    const onKey = e => {
      if (e.key === 'Escape') onBack();
      if (e.key === 'ArrowDown' || e.key === 'PageDown')
        st.target = clampTarget(Math.round(st.target) + 1);
      if (e.key === 'ArrowUp' || e.key === 'PageUp')
        st.target = clampTarget(Math.round(st.target) - 1);
    };

    const onPointerDown = e => { st.dragY = e.clientY; };
    const onPointerMove = e => {
      if (st.dragY === null) return;
      st.target = clampTarget(st.target + (st.dragY - e.clientY) * 0.011);
      st.dragY = e.clientY;
    };
    const onPointerUp = () => { st.dragY = null; };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(st.raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onBack]);

  return (
    <div className="gallery">
      <div className="frame" aria-hidden="true" />

      <div className="g-top">
        <button className="g-back" type="button" onClick={onBack}>
          ← Back to sheet 01
        </button>
        <span className="g-mark">Field record — competitions &amp; builds</span>
        <span className="g-hint">Scroll ↓</span>
      </div>

      <div className="g-stage" aria-label="Milestone gallery" data-cursor="SCROLL">
        {ITEMS.map((item, i) => (
          <figure
            key={item.src}
            className="g-card"
            ref={el => { cardRefs.current[i] = el; }}
          >
            <img src={item.src} alt={item.title} draggable="false" />
          </figure>
        ))}
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
