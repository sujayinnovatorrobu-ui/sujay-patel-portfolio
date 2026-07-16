import { useEffect, useRef, useState } from 'react';

// Sheet 02 — the founder. Photo as an engineering figure, record on the right.
export default function Profile() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`profile${inView ? ' in-view' : ''}`}>
      <div className="frame" aria-hidden="true" />
      <span className="ghost" aria-hidden="true">02</span>

      <div className="p-inner">
        <figure className="p-photo">
          <img
            src="/me.jpg"
            alt="Sujay Patel at Project & Innovation Lab"
            loading="lazy"
          />
          <figcaption className="p-figcap">
            Fig. 01 — Project &amp; Innovation Lab, Ahmedabad
          </figcaption>
        </figure>

        <div className="p-text">
          <p className="eyebrow">Sheet 02 — The builder</p>

          <h2 className="p-heading">
            Machines first, <span className="p-outline">ventures next.</span>
          </h2>

          <p className="p-para">
            I took the diploma route straight after 10th — the fastest road to
            real hardware. Robotics &amp; Automation at Government Polytechnic
            Ahmedabad put me on the bench early, and I never left it.
          </p>

          <p className="p-para">
            Competitions became the proving ground: a ₹10,00,000 first prize at
            Robofest Gujarat 3.0, first place in the Adani RC Robo Race, and
            entries across every category by Robofest 5.0. The prize money
            didn&rsquo;t go home — it went into <strong>Project &amp; Innovation
            Lab</strong>, the startup our team runs, where 3D printing, CNC,
            laser engraving and PCB fabrication all happen in-house.
          </p>

          <p className="p-para">
            The lab ships products, not demos: a non-invasive hemoglobin
            analyser, the Vayu Rakshak air-sterilisation unit, warehouse
            robotics — each build documented in the open.
          </p>

          <blockquote className="p-quote">
            <span lang="sa">&ldquo;बलस्य मूलं विज्ञानम्&rdquo;</span>
            <span className="p-quote-en">
              Science is the root of strength.
            </span>
          </blockquote>

          <dl className="p-specs">
            <div className="p-spec">
              <dt>Team</dt>
              <dd>Project &amp; Innovation Lab</dd>
            </div>
            <div className="p-spec">
              <dt>Base</dt>
              <dd>Ahmedabad, IN</dd>
            </div>
            <div className="p-spec">
              <dt>Focus</dt>
              <dd>Automation products</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
