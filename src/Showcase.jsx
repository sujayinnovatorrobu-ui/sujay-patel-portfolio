import { useEffect, useRef, useState } from 'react';

const PROJECTS = [
  {
    id: 'vayu',
    category: 'GOVT_DEPLOYED',
    title: 'Vayu Rakshak (Air Steriliser)',
    specs: 'UVC Irradiation Chambers · HEPA H13 Filtration · Active Fan Ventilation',
    narrative: 'Engineered during the COVID-19 pandemic. Built in-house at the lab and deployed in collaboration with Government clinics to sterilise indoor patient areas.',
    badge: 'STATE_APPROVED',
    tech: ['Arduino Nano', 'UVC Logic Controllers', 'Custom Sheet Metal Fab']
  },
  {
    id: 'hemo',
    category: 'MEDICAL_DEVICE',
    title: 'Non-Invasive Hemoglobin Analyser',
    specs: 'Multi-Wavelength PPG Earlobe Probe · Optical Absorption Sensing · LCD Display',
    narrative: 'Designed a painless medical screener that measures blood hemoglobin levels instantly without drawing blood. Deployed at public health checkup camps.',
    badge: 'IN_SCREENING_TRIALS',
    tech: ['ESP32', 'PPG Custom Optoelectronics', 'Analog Filtering Circuitry']
  },
  {
    id: 'warehouse',
    category: 'INDUSTRIAL_ROBOTICS',
    title: 'Autonomous Warehouse Rover',
    specs: 'Differential Drive Chassis · LiDAR Mapping · ROS NavMesh Engine',
    narrative: 'Developed a heavy-duty materials transport platform for local fabrication warehouses. Incorporates automatic obstacle avoidance and route optimization.',
    badge: 'ACTIVE_DEPLOYMENT',
    tech: ['Raspberry Pi 4', 'BLDC Motor Hubs', 'LiDAR Sensor Node']
  },
  {
    id: 'awards',
    category: 'STATE_CHAMPIONSHIPS',
    title: 'Robofest Gujarat & Adani Conclave',
    specs: '₹10,00,000 First Prize (3.0) · 1st Place Adani Race · Gujarat Felicitations',
    narrative: 'Honoured on the state stage by Government of Gujarat dignitaries. Led the Project & Innovation Lab fleet of 6 custom-fabricated robots in championship runs.',
    badge: 'GOLD_MEDALS',
    tech: ['Floodfill Algorithms', 'RC Motion Control', 'Custom Chassis Milling']
  }
];

export default function Showcase() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeId, setActiveId] = useState('vayu');

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`showcase${inView ? ' in-view' : ''}`}>
      <div className="frame" aria-hidden="true" />
      <span className="ghost" aria-hidden="true">03</span>

      <div className="showcase-inner">
        <div className="showcase-intro">
          <p className="eyebrow">Sheet 03 — Public Ventures &amp; Deployments</p>
          <h2 className="showcase-heading">
            Government projects <span className="showcase-outline">&amp; achievements.</span>
          </h2>
          <p className="showcase-lede">
            Engineering is about solving real-world challenges. These are the custom-fabricated
            products and robotics projects we deployed for public screening, healthcare,
            and state-level competitions.
          </p>
        </div>

        <div className="showcase-grid">
          {PROJECTS.map((proj) => {
            const isActive = activeId === proj.id;
            return (
              <div
                key={proj.id}
                className={`showcase-card ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveId(proj.id)}
                data-cursor="TRACK"
              >
                <div className="card-header">
                  <span className="card-category">[{proj.category}]</span>
                  <span className="card-badge">{proj.badge}</span>
                </div>
                <h3 className="card-title">{proj.title}</h3>
                <p className="card-specs">{proj.specs}</p>
                <p className="card-narrative">{proj.narrative}</p>
                
                <div className="card-tech">
                  {proj.tech.map((t, idx) => (
                    <span key={idx} className="tech-tag">// {t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
