import { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lights from "./utils/Lights.jsx";
import { Perf } from "r3f-perf";
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  Physics,
  CylinderCollider,
} from "@react-three/rapier";
import useSound from "use-sound";
import hitSound from "../../public/sounds/hit.mp3";
import gravitySwitch from "../../public/sounds/gravity-switch.wav";
import { Unicorn } from "./models/Unicorn.jsx";
import { Bear } from "./models/Bear.jsx";
import { Hamburger } from "./models/Hamburger.jsx";
import { Pot } from "./models/Pot.jsx";
import { PotLid } from "./models/PotLid.jsx";

export default function Experience() {
  const sphere = useRef();
  const cube = useRef();
  const button = useRef();
  const twister = useRef();

  /**
   * State - managing gravity
   */
  const [reveseGravityParam, setReverseGravityParam] = useState(1);

  /**
   * Set up sounds
   */
  const [playHitSound] = useSound(hitSound);
  const [playGravitySwitchSound] = useSound(gravitySwitch);

  /**
   * Load models
   */

  /**
   * Handler - cube jump (also adapt to reverse gravity)
   */
  const handleCubeJump = () => {
    const mass = cube.current.mass();

    cube.current.applyImpulse(
      { x: 0, y: 5 * reveseGravityParam * mass, z: 0 },
      true
    );
    cube.current.applyTorqueImpulse(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5,
      },
      true
    );
  };

  /**
   * Handler - reverse gravity
   */
  const handleReverseGravity = () => {
    setReverseGravityParam(
      (prevReveseGravityParam) => prevReveseGravityParam * -1
    );
    sphere.current.wakeUp();
    cube.current.wakeUp();

    playGravitySwitchSound();
  };

  /**
   * Function - rotate & move the twister with each frame
   */
  useFrame((state, delta) => {
    // Rotation
    const time = state.clock.getElapsedTime();

    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);

    twister.current.setNextKinematicRotation(quaternionRotation);

    // Move the position
    const angle = time * 0.5;

    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;

    twister.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
  });

  return (
    <>
      <OrbitControls makeDefault />

      <Perf position="top-left" />

      <Lights />

      <Physics gravity={[0, -9.81 * reveseGravityParam, 0]} debug={true}>
        {/* SPHERE */}
        <RigidBody
          ref={sphere}
          colliders="ball"
          gravityScale={1}
          restitution={0.5}
          friction={0.7}
          onSleep={() => {
            console.log("Sphere: sleep");
          }}
          onWake={() => {
            console.log("Sphere: wake up");
          }}
          onCollisionEnter={playHitSound}
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
          colliders={false}
          onSleep={() => {
            console.log("Cube: sleep");
          }}
          onWake={() => {
            console.log("Cube: wake up");
          }}
          onCollisionEnter={playHitSound}
        >
          <CuboidCollider mass={1} args={[0.5, 0.5, 0.5]} />
          <mesh castShadow onClick={handleCubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="purple" />
          </mesh>
        </RigidBody>

        {/* TWISTER */}
        <RigidBody ref={twister} friction={0} type="kinematicPosition">
          <mesh castShadow scale={[0.4, 0.4, 3]} position={[0, 1, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="snow" />
          </mesh>
        </RigidBody>

        {/* REVERSE GRAVITY BUTTON */}
        <RigidBody ref={button} type="fixed">
          <group position={[0, -1, 7]} scale={0.5}>
            <mesh castShadow onClick={handleReverseGravity}>
              <cylinderGeometry />
              <meshStandardMaterial color="crimson" />
            </mesh>
            <mesh position-y={-0.5}>
              <boxGeometry args={[3, 0.7, 3]} />
              <meshStandardMaterial color="#4F4F48" />
            </mesh>
          </group>
        </RigidBody>

        {/* FLOOR */}
        <RigidBody type="fixed" restitution={0} friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="lightblue" />
          </mesh>
        </RigidBody>

        {/* POT LID */}
        <RigidBody
          type="fixed"
          colliders={false}
          scale={15}
          position={[0, 8, 0]}
        >
          <CylinderCollider args={[0.025, 0.35]} position={[0, 0.025, 0]} />
          <PotLid />
        </RigidBody>

        {/* POT BODY */}
        <RigidBody type="fixed" colliders="trimesh">
          <Pot
            scale={15}
            position={[0, -1, 0]}
            rotation={[0, Math.PI * 0.5, 0]}
          />
        </RigidBody>
      </Physics>
    </>
  );
}
