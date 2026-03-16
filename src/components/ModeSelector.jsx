const MODES = [
  { id: 'lines',   name: 'Lines'    },
  { id: 'dots',    name: 'Dots'     },
  { id: 'ascii',   name: 'ASCII'    },
  { id: 'mosaic',  name: 'Mosaic'   },
  { id: 'lowpoly', name: 'Low Poly' },
];

export default function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode-switcher">
      {MODES.map((m) => (
        <button
          key={m.id}
          className={`mode-switcher-btn ${mode === m.id ? 'active' : ''}`}
          onClick={() => onModeChange(m.id)}
        >
          {m.name}
        </button>
      ))}
    </div>
  );
}
