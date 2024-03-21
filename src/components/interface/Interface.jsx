import { useKeyboardControls } from "@react-three/drei";
import { useEffect } from "react";

export default function Interface() {
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);
  const activateFly = useKeyboardControls((state) => state.activateFly);

  return (
    <div className="interface">
      {/* TIME */}
      <div className="time">0.00</div>

      {/* RESTART */}
      <div className="restart">Restart</div>

      {/* CONTROLS */}
      <div className="controls">
        <div className="row">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="row">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="row">
          <div className={`key ${jump ? "active" : ""} large`}></div>
        </div>
      </div>
    </div>
  );
}
