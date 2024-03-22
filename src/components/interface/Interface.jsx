import { useKeyboardControls } from "@react-three/drei";
import useGame from "../../stores/useGame.js";

export default function Interface() {
  /**
   * KEYBOARD INPUT STATES
   */
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);
  const activateFly = useKeyboardControls((state) => state.activateFly);

  /**
   * THE GAME PHASE STATE AND RESTART METHOD
   */
  const phase = useGame((state) => state.phase);
  const restart = useGame((state) => state.restart);

  return (
    <div className="interface">
      {/* TIME */}
      <div className="time">0.00</div>

      {/* RESTART */}
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}

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
