import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import Experience from "./Experience.jsx";
import ExperiencePracticeBasics from "./ExperiencePracticeBasics.jsx";
import Interface from "./components/interface/Interface.jsx";

export default function App() {
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "KeyW"] },
          { name: "backward", keys: ["ArrowDown", "KeyS"] },
          { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
          { name: "rightward", keys: ["ArrowRight", "KeyD"] },
          { name: "jump", keys: ["Space"] },
          { name: "activateFly", keys: ["Shift"] },
        ]}
      >
        <Canvas
          shadows
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [2.5, 5, 7],
          }}
        >
          <Experience />
          {/* <ExperiencePracticeBasics /> */}
        </Canvas>
        <Interface />
      </KeyboardControls>
    </>
  );
}
