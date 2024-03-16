import { useState, useRef } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import Unicorn from "../models/animals/Unicorn";

/**
 * GENERIC CUBE GEOMETRY
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * START BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockStart /> component
 */
function BlockStart({ position = [0, 0, 0] }) {
  // GUI
  const { color } = useControls("start block", {
    color: "limegreen",
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={new THREE.MeshStandardMaterial({ color: color })}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
}

/**
 * SPINNER TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockSpinner /> component
 */
function BlockSpinner({ position = [0, 0, 0] }) {
  // Ref - spinner
  const obstacle = useRef();

  // State - spinner speed (randomize speed of multiple spinners)
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() <= 0.5 ? -1 : 1)
  );

  // GUI
  const { floorColor, obstacleColor } = useControls("spinner block", {
    floorColor: "greenyellow",
    obstacleColor: "orangered",
  });

  // Rotate the spinner
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const euler = new THREE.Euler(0, time * speed, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);

    obstacle.current.setNextKinematicRotation(quaternion);
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={new THREE.MeshStandardMaterial({ color: floorColor })}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      {/* SPINNER */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={new THREE.MeshStandardMaterial({ color: obstacleColor })}
          scale={[3.5, 0.3, 0.3]}
          castShadow
        />
      </RigidBody>
    </group>
  );
}

/**
 * LIMBO TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockLimbo /> component
 */
function BlockLimbo({ position = [0, 0, 0] }) {
  // Ref - limbo
  const obstacle = useRef();

  // State - limbo time offset (differentiate its start position)
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  // GUI
  const { floorColor, obstacleColor } = useControls("limbo block", {
    floorColor: "greenyellow",
    obstacleColor: "orangered",
  });

  // Make the limbo obstacle move vertically
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    // Relative translation, instead of absolute translation
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={new THREE.MeshStandardMaterial({ color: floorColor })}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      {/* LIMBO */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={new THREE.MeshStandardMaterial({ color: obstacleColor })}
          scale={[3.5, 0.3, 0.3]}
          castShadow
        />
      </RigidBody>
    </group>
  );
}

/**
 * AXE TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockAxe /> component
 */
function BlockAxe({ position = [0, 0, 0] }) {
  // Ref - axe
  const obstacle = useRef();

  // State - axe time offset (differentiate its start position)
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  // GUI
  const { floorColor, obstacleColor } = useControls("axe block", {
    floorColor: "greenyellow",
    obstacleColor: "orangered",
  });

  // Make the axe obstacle move horizontally
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    // Relative translation, instead of absolute translation
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.8,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      {/* FLOOR */}
      <mesh
        geometry={boxGeometry}
        material={new THREE.MeshStandardMaterial({ color: floorColor })}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      {/* AXE */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={new THREE.MeshStandardMaterial({ color: obstacleColor })}
          scale={[1.5, 1.5, 0.3]}
          castShadow
        />
      </RigidBody>
    </group>
  );
}

/**
 * END BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockEnd /> component
 */
function BlockEnd({ position = [0, 0, 0] }) {
  // GUI
  const { color } = useControls("end block", {
    color: "limegreen",
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={new THREE.MeshStandardMaterial({ color: color })}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />

      <Unicorn />
    </group>
  );
}

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 16]} />
      <BlockSpinner position={[0, 0, 12]} />
      <BlockLimbo position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} />
      <BlockEnd position={[0, 0, 0]} />
    </>
  );
}
