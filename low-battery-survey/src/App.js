import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Cat, RefreshCw, Send, Sparkles } from 'lucide-react';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const STORAGE_KEY = 'low_battery_survey_responses_v1';

const INITIAL_RESPONSES = [
  {
    name: "Alex",
    q1: "Often exhausted / Drained quickly",
    q2: "Implicit bias & clique exclusivity",
    q3: "Yes, heavily discouraging"
  },
  {
    name: "Taylor",
    q1: "Sometimes overwhelmed",
    q2: "High-energy networking culture",
    q3: "Neutral / Unsure"
  }
];

export default function App() {
  const [page, setPage] = useState('survey'); // 'survey' hoặc 'dashboard'
  const [responses, setResponses] = useState([]);
  const [name, setName] = useState('');
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setResponses(JSON.parse(saved));
      } catch (e) {
        setResponses(INITIAL_RESPONSES);
      }
    } else {
      setResponses(INITIAL_RESPONSES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESPONSES));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name to submit!');
      return;
    }
    if (!q1 || !q2 || !q3) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const newResponse = { name: name.trim(), q1, q2, q3 };
    const updated = [newResponse, ...responses];
    setResponses(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setPage('dashboard');
    }, 1200);
  };

  const handleRefresh = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setResponses(JSON.parse(saved));
    }
  };

  const countAnswers = (questionKey, optionsList) => {
    return optionsList.map(opt => responses.filter(r => r[questionKey] === opt).length);
  };

  const q1Options = [
    "Often exhausted / Drained quickly",
    "Sometimes overwhelmed",
    "Rarely / High social energy"
  ];

  const q2Options = [
    "High-energy networking culture",
    "Implicit bias & clique exclusivity",
    "Rigid attendance & audition policies",
    "Lack of quiet onboarding formats"
  ];

  const q3Options = [
    "Yes, heavily discouraging",
    "Slightly hindering",
    "Neutral / Unsure",
    "Not a barrier at all"
  ];

  const q1Data = {
    labels: ['Often Drained', 'Sometimes', 'Rarely'],
    datasets: [{
      label: 'Responses',
      data: countAnswers('q1', q1Options),
      backgroundColor: ['#ff8fab', '#ffb703', '#8ecae6'],
      borderColor: '#2b2b2b',
      borderWidth: 2,
    }]
  };

  const q2Data = {
    labels: ['Networking Culture', 'Implicit Bias', 'Rigid Policies', 'No Quiet Onboarding'],
    datasets: [{
      label: 'Responses',
      data: countAnswers('q2', q2Options),
      backgroundColor: ['#ff8fab', '#ffb703', '#8ecae6', '#b5e48c'],
      borderColor: '#2b2b2b',
      borderWidth: 2,
    }]
  };

  const q3Data = {
    labels: ['Yes, heavily', 'Slightly', 'Neutral', 'Not a barrier'],
    datasets: [{
      label: 'Responses',
      data: countAnswers('q3', q3Options),
      backgroundColor: ['#ff6b6b', '#ffd166', '#06d6a0', '#118ab2'],
      borderColor: '#2b2b2b',
      borderWidth: 2,
    }]
  };

  return (
    <div className="app-container">
      <header className="nav-header">
        <div className="nav-title">
          <Cat size={28} color="#2b2b2b" />
          <span>Low Battery Club Access</span>
        </div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${page === 'survey' ? 'active' : ''}`}
            onClick={() => setPage('survey')}
          >
            Take Survey
          </button>
          <button 
            className={`nav-btn ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPage('dashboard')}
          >
            Live Charts ({responses.length})
          </button>
        </div>
      </header>

      {page === 'survey' ? (
        <main>
          <div className="sketch-card">
            <div className="doodle-badge">
              <Sparkles size={14} style={{ display: 'inline', marginRight: 4 }} /> 
              Research Mini-Survey
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
              Access Inequality & Low Social Battery
            </h1>
            <p style={{ color: '#555', marginBottom: '20px', lineHeight: 1.5 }}>
              Help us analyze systemic barriers in university student communities. Share your honest perspective below!
            </p>

            {/* Ô trống để bạn chèn link ảnh Github vào đây sau */}
            <div className="img-placeholder">
              <span>[ Insert GitHub Illustration / Chiikawa Artwork Here ]</span>
            </div>

            {submittedMessage ? (
              <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '1.3rem', fontWeight: 700, color: '#2a9d8f' }}>
                🎉 Thank you! Recording your response & switching to live charts...
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nameInput">Your Name or Nickname:</label>
                  <input 
                    id="nameInput"
                    type="text" 
                    placeholder="e.g. Chiikawa Fan or Alex..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>1. How would you rate your social battery during campus activities?</label>
                  {q1Options.map((opt, idx) => (
                    <label key={idx} className="radio-option">
                      <input 
                        type="radio" 
                        name="q1" 
                        value={opt} 
                        checked={q1 === opt}
                        onChange={(e) => setQ1(e.target.value)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="form-group">
                  <label>2. What do you think is the primary barrier for students with low social battery joining clubs?</label>
                  {q2Options.map((opt, idx) => (
                    <label key={idx} className="radio-option">
                      <input 
                        type="radio" 
                        name="q2" 
                        value={opt} 
                        checked={q2 === opt}
                        onChange={(e) => setQ2(e.target.value)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="form-group">
                  <label>3. Do you feel campus organizations implicitly filter out introverted or low-battery students?</label>
                  {q3Options.map((opt, idx) => (
                    <label key={idx} className="radio-option">
                      <input 
                        type="radio" 
                        name="q3" 
                        value={opt} 
                        checked={q3 === opt}
                        onChange={(e) => setQ3(e.target.value)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" className="sketch-btn">
                  <Send size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  Submit & View Live Charts
                </button>
              </form>
            )}
          </div>
        </main>
      ) : (
        <main>
          <div className="sketch-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div className="doodle-badge">Live Research Analytics</div>
                <h2 style={{ fontSize: '1.8rem' }}>Community Insight Dashboard</h2>
              </div>
              <button className="nav-btn" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={16} /> Refresh Responses
              </button>
            </div>

            <p style={{ color: '#555', marginBottom: '25px' }}>
              Total participants recorded: <strong>{responses.length}</strong>. Click refresh to check for new entries.
            </p>

            <div className="charts-grid">
              <div className="chart-box">
                <h3>Social Battery Status</h3>
                <Bar data={q1Data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>

              <div className="chart-box">
                <h3>Primary Perceived Barrier</h3>
                <Doughnut data={q2Data} options={{ responsive: true }} />
              </div>

              <div className="chart-box" style={{ gridColumn: '1 / -1' }}>
                <h3>Implicit Exclusion in Clubs</h3>
                <Bar data={q3Data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
        </main>
      )}

      <footer>
        <p>Research Project • Low Social Battery & Club Access Inequality • Powered by React & Netlify</p>
      </footer>
    </div>
  );
}