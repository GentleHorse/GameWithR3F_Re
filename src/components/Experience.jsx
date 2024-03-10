import { OrbitControls } from "@react-three/drei";
import Lights from "./utils/Lights.jsx";
import { Perf } from "r3f-perf";
import { RigidBody, Physics } from "@react-three/rapier";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Lights />

      <Perf position="top-left" />

      <Physics>
        <RigidBody>
          <mesh castShadow position={[-2, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <mesh castShadow position={[2, 2, 0]} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1} scale={[10, 0.1, 10]}>
            <boxGeometry />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}
