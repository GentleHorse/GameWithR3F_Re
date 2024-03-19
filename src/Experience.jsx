import { Physics } from "@react-three/rapier";
import Lights from "./components/utils/Lights.jsx";
import Background from "./components/utils/Background.jsx";
import { Level } from "./components/level/Level.jsx";
import { Perf } from "r3f-perf";
import MarbleBallPlayer from "./components/player/MarbleBallPlayer.jsx";

export default function Experience() {
  return (
    <>
      <Background />

      <axesHelper />

      <Perf position="top-left" />

      <Physics debug={false}>
        <Lights />
        <Level />
        <MarbleBallPlayer />
      </Physics>
    </>
  );
}
