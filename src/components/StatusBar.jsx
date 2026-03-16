export default function StatusBar({ state, text }) {
  return (
    <div id="status">
      <span id="status-dot" className={state} />
      <span id="status-text">{text.toUpperCase()}</span>
    </div>
  );
}
