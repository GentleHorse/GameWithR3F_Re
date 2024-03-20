export default function Interface() {
  return (
    <div className="interface">
      {/* TIME */}
      <div className="time">0.00</div>

      {/* RESTART */}
      <div className="restart">Restart</div>

      {/* CONTROLS */}
      <div className="controls">
        <div className="row">
          <div className="key"></div>
        </div>
        <div className="row">
          <div className="key"></div>
          <div className="key"></div>
          <div className="key"></div>
        </div>
        <div className="row">
          <div className="key large"></div>
        </div>
      </div>
    </div>
  );
}
