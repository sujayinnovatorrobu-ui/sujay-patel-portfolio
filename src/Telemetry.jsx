import { useEffect, useState } from 'react';

export default function Telemetry() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('https://hackatime.hackclub.com/api/v1/users/sujayr07/stats');
      if (!response.ok) throw new Error('Network response not ok');
      const json = await response.json();
      if (json.data) {
        setData(json.data);
      } else {
        throw new Error('No data field in response');
      }
    } catch (err) {
      console.error('Error fetching Hackatime stats:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="telemetry-block" data-cursor="SPIN">
      <div className="telemetry-header">
        <span className="telemetry-title">[ TELEMETRY MODULE ]</span>
        <div className="telemetry-status">
          <span className={`led-pulse ${loading ? 'loading' : error ? 'error' : 'active'}`} />
          <span className="status-text">{loading ? 'SYNCING...' : error ? 'OFFLINE' : 'ONLINE'}</span>
        </div>
      </div>

      <div className="telemetry-body">
        {loading ? (
          <div className="telemetry-loading">READING SENSOR DATA...</div>
        ) : error ? (
          <div className="telemetry-error">
            <span>CONNECTION FAIL</span>
            <button className="telemetry-retry" onClick={fetchStats} type="button">
              [ RE-CONNECT ]
            </button>
          </div>
        ) : (
          <>
            <div className="telemetry-grid">
              <div className="telemetry-cell">
                <span className="cell-label">TOTAL TIME</span>
                <span className="cell-value">{data.human_readable_total || '0h 0m'}</span>
              </div>
              <div className="telemetry-cell">
                <span className="cell-label">STREAK</span>
                <span className="cell-value telemetry-streak">
                  {data.streak || 0} DAYS 🔥
                </span>
              </div>
            </div>

            <div className="telemetry-languages">
              <span className="languages-title">PRIMARY TECHNOLOGIES</span>
              <div className="languages-list">
                {data.languages && data.languages.slice(0, 3).map((lang) => (
                  <div key={lang.name} className="lang-row">
                    <span className="lang-name">{lang.name}</span>
                    <div className="lang-bar-container">
                      <div
                        className="lang-bar"
                        style={{
                          width: `${lang.percent}%`,
                          backgroundColor: lang.name === 'Markdown' ? 'var(--accent)' : 'var(--steel)'
                        }}
                      />
                    </div>
                    <span className="lang-percent">{lang.percent}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="telemetry-footer">
              <span>SOURCE: HACKATIME.HACKCLUB.COM</span>
              <button className="telemetry-refresh" onClick={fetchStats} type="button" aria-label="Refresh telemetry data">
                [ RESET_CLOCK ]
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
