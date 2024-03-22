import { Physics } from "@react-three/rapier";
import Lights from "./components/util-components/Lights.jsx";
import Background from "./components/util-components/Background.jsx";
import { Level } from "./components/level/Level.jsx";
import { Perf } from "r3f-perf";
import MarbleBallPlayer from "./components/player/MarbleBallPlayer.jsx";
import useGame from "./stores/useGame.js";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);

  return (
    <>
      <Background />

      <axesHelper />

      <Perf position="top-left" />

      <Physics debug={false}>
        <Lights />
        <Level count={blocksCount} />
        <MarbleBallPlayer />
      </Physics>
    </>
  );
}
