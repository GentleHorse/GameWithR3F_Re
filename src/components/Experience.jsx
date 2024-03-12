import { useRef, useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import Lights from "./utils/Lights.jsx";
import { Perf } from "r3f-perf";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  Physics,
} from "@react-three/rapier";

export default function Experience() {
  const sphere = useRef();
  const cube = useRef();
  const button = useRef();

  // State - managing gravity
  const [reveseGravityParam, setReverseGravityParam] = useState(1);

  // Handler - cube jump
  const handleCubeJump = () => {
    cube.current.applyImpulse({ x: 0, y: 5, z: 0 }, true);
    cube.current.applyTorqueImpulse(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5,
      },
      true
    );
  };

  // Handler - reverse gravity
  const handleReverseGravity = () => {
    setReverseGravityParam(
      (prevReveseGravityParam) => prevReveseGravityParam * -1
    );
    sphere.current.wakeUp();
    cube.current.wakeUp();
    button.current.wakeUp();
  };

  return (
    <>
      <OrbitControls makeDefault />

      <Perf position="top-left" />

      <Lights />

      <Physics gravity={[0, -9.81 * reveseGravityParam, 0]} debug>
        {/* SPHERE */}
        <RigidBody
          ref={sphere}
          colliders="ball"
          gravityScale={1}
          friction={0.7}
        >
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* CUBE */}
        <RigidBody
          ref={cube}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0.5}
          friction={0.7}
        >
          <mesh castShadow onClick={handleCubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="purple" />
          </mesh>
        </RigidBody>

        {/* REVERSE GRAVITY BUTTON */}
        <RigidBody ref={button} type="fixed">
          <mesh
            position={[0, -1, 3]}
            scale={0.5}
            onClick={handleReverseGravity}
          >
            <cylinderGeometry />
            <meshStandardMaterial color="crimson" />
          </mesh>
        </RigidBody>

        {/* CEILING */}
        <RigidBody type="fixed" friction={0.7}>
          <mesh receiveShadow position-y={3.5}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="lightblue" />
          </mesh>
        </RigidBody>

        {/* FLOOR */}
        <RigidBody type="fixed" friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="lightblue" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  );
}
