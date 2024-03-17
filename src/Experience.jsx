import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Lights from "./components/utils/Lights.jsx";
import Background from "./components/utils/Background.jsx";
import { Level } from "./components/level/Level.jsx";
import { Perf } from "r3f-perf";
import MarbleBallPlayer from "./components/player/MarbleBallPlayer.jsx";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Background />

      <axesHelper />

      <Perf position="top-left" />

      <Physics debug={true}>
        <Lights />
        <Level />
        <MarbleBallPlayer />
      </Physics>
    </>
  );
}
