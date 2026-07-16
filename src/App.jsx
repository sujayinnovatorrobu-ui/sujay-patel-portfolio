import { useEffect, useState } from 'react';
import WorkGallery from './WorkGallery.jsx';
import RingGallery from './RingGallery.jsx';
import Profile from './Profile.jsx';
import Tape from './Tape.jsx';
import Cursor from './Cursor.jsx';
import Telemetry from './Telemetry.jsx';
import Showcase from './Showcase.jsx';




export default function App() {
  const [view, setView] = useState('home');
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);


  const toggleTheme = () =>
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));



  const openWork = e => {
    e.preventDefault();
    setView('work');
  };

  const openCaps = e => {
    e.preventDefault();
    setView('caps');
  };

  if (view === 'work') {
    return (
      <>
        <Cursor />
        <WorkGallery onBack={() => setView('home')} />
      </>
    );
  }

  if (view === 'caps') {
    return (
      <>
        <Cursor />
        <RingGallery onBack={() => setView('home')} />
      </>
    );
  }

  return (
    <main className="page">
      <Cursor />
      <div className="sheet">
        <div className="frame" aria-hidden="true" />

        <div className="content">
          <header className="topbar rise d1">
            <a className="mark" href="/">
              SP<em>.</em>PORTFOLIO
            </a>
            <nav className="nav" aria-label="Primary">
              <a href="mailto:innovation@gpahmedabad.ac.in">Contact</a>
              <button
                className="theme-btn"
                type="button"
                onClick={toggleTheme}
                aria-label="Switch color theme"
              >
                {theme === 'dark' ? '◐ Light' : '◑ Dark'}
              </button>
            </nav>
          </header>

          <div className="callouts rise d5" aria-hidden="true">
            <div className="callout c1">
              <span className="co-label"><em>01</em>Machine vision &amp; perception</span>
              <span className="co-line" />
            </div>
            <div className="callout c2">
              <span className="co-label"><em>02</em>Motion control &amp; actuation</span>
              <span className="co-line" />
            </div>
            <div className="callout c3">
              <span className="co-label"><em>03</em>PLC &amp; process automation</span>
              <span className="co-line" />
            </div>
          </div>

          <section className="hero">
            <p className="eyebrow rise d2">Founder in fabrication — Robotics &amp; Automation, Ahmedabad</p>

            <h1 className="name rise d3">
              <span>Sujay</span> <span className="last">Patel</span>
            </h1>

            <p className="lede rise d4">
              <strong>Engineer by training, entrepreneur by intent.</strong> I design
              industrial automation systems — and I&rsquo;m building the ventures
              around them. Diploma candidate in Robotics &amp; Automation at
              Government Polytechnic, Ahmedabad.
            </p>

            <div className="actions rise d5">
              <a className="btn btn-primary" href="mailto:innovation@gpahmedabad.ac.in">
                Start a conversation
              </a>
            </div>
          </section>
          <Telemetry />

          <footer className="rise d5">
            <div className="titleblock" role="table" aria-label="Profile summary">
              <div className="tb-cell">
                <span className="tb-label">Education</span>
                <span className="tb-value">Diploma — Robotics &amp; Automation</span>
              </div>
              <div className="tb-cell">
                <span className="tb-label">Institute</span>
                <span className="tb-value">Government Polytechnic, Ahmedabad</span>
              </div>
              <div className="tb-cell">
                <span className="tb-label">Orientation</span>
                <span className="tb-value">Automation products &amp; ventures</span>
              </div>
              <div className="tb-cell">
                <span className="tb-label">Status</span>
                <span className="tb-value tb-status">
                  <span className="led" aria-hidden="true" />
                  Open to collaboration
                </span>
              </div>
            </div>
            <p className="sheetmeta">Sheet 01 / 04 · Scale 1:1 · Rev A · 2026</p>
          </footer>
        </div>
      </div>

      {/* Sheet 02 — the founder */}
      <Profile />

      {/* the record, taped across the seam between sheets */}
      <Tape />

      {/* Sheet 03 — public ventures & government projects */}
      <Showcase />

      {/* Sheet 04 — the build wheel */}
      <RingGallery embedded />
    </main>
  );
}

