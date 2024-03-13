import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience.jsx";

export default function App() {
  return (
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [2.5, 8, 15],
      }}
    >
      <Experience />
    </Canvas>
  );
}
