import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./components/utils/Lights.jsx";
import Background from "./components/utils/Background.jsx";
import Level from "./components/level/Level.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Background />

      <axesHelper />

      <Physics debug>
        <Lights />
        <Level />
      </Physics>
    </>
  );
}
