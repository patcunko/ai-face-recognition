const MODES = [
  { id: 'lines',   name: 'Lines',    desc: 'Wireframe' },
  { id: 'dots',    name: 'Dots',     desc: 'Point cloud' },
  { id: 'ascii',   name: 'ASCII',    desc: 'Char grid' },
  { id: 'mosaic',  name: 'Mosaic',   desc: 'Pixel blocks' },
  { id: 'lowpoly', name: 'Low Poly', desc: 'Triangles' },
];

export default function LandingPage({ mode, onModeChange, onStart }) {
  return (
    <div className="landing">
      <div className="landing-content">
        <p className="landing-eyebrow">Real-time body tracking</p>
        <h1 className="landing-title">AI Facial Recognition</h1>
        <p className="landing-description">
          Your face, hands, and body are detected through your camera
          and rendered in real time. Choose a visual style to begin.
        </p>

        <div className="mode-grid">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`mode-card ${mode === m.id ? 'selected' : ''}`}
              onClick={() => onModeChange(m.id)}
            >
              <div className="mode-card-name">{m.name}</div>
              <div className="mode-card-desc">{m.desc}</div>
            </button>
          ))}
        </div>

        <button className="start-btn" onClick={onStart}>
          Start
        </button>

        <p className="landing-note">Camera access will be requested</p>
      </div>
    </div>
  );
}
