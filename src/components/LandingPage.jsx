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

        <div className="gesture-card">
          <div className="gesture-card-header">
            <span className="gesture-badge">Gesture</span>
            <span className="gesture-title">Thumbs Up</span>
          </div>
          <p className="gesture-description">
            Hold a thumbs up toward the camera to trigger a burst effect.
            The app detects your hand in real time — keep the gesture steady
            for a moment and a radial animation will fire from your thumb tip.
          </p>
          <div className="gesture-steps">
            <div className="gesture-step">
              <span className="gesture-step-num">1</span>
              <span>Point your thumb upward with your fist closed</span>
            </div>
            <div className="gesture-step">
              <span className="gesture-step-num">2</span>
              <span>Hold still for a brief moment so the app can confirm</span>
            </div>
            <div className="gesture-step">
              <span className="gesture-step-num">3</span>
              <span>A glowing burst will radiate from your thumb tip</span>
            </div>
          </div>
          <p className="gesture-note">Works in all visual modes. 2.5 s cooldown between triggers.</p>
        </div>

        <button className="start-btn" onClick={onStart}>
          Start
        </button>

        <p className="landing-note">Camera access will be requested</p>
      </div>
    </div>
  );
}
