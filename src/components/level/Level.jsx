import { useState, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { Float, Text, useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import Unicorn from "../models/animals/Unicorn";

import FloorRoughnessTexture from "../../../public/textures/SurfaceImperfections003_1K_var1.jpg";
import FloorNormalTexture from "../../../public/textures/SurfaceImperfections003_1K_Normal.jpg";

/**
 * GENERIC CUBE GEOMETRY
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * MATERIAL COLOR
 */
const edgeBlockFloorColor = "#4d5139";
const trapBlockFloorColor = "#183229";
const trapBlockObstacleColor = "#64363C";
const wallColor = "#535953";

/**
 * Floor params
 */
const floorRestitution = 0.2;
const floorFriction = 1;

/**
 * 0. START BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockStart /> component
 */
export function BlockStart({ position = [0, 0, 0] }) {
  // GUI
  const { color } = useControls("start block", {
    color: edgeBlockFloorColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  return (
    <group position={position}>
      <Float floatIntensity={0.45} rotationIntensity={0.45}>
        <Text
          font="./fonts/shippori-mincho-b1-v21-japanese-800.woff"
          scale={0.5}
          maxWidth={2.5}
          lineHeight={0.75}
          textAlign="left"
          position={[-0.75, 0.65, 0]}
          rotation-y={0.45}
        >
          Marble race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <RigidBody
        type="fixed"
        restitution={floorRestitution}
        friction={floorFriction}
      >
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: color,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

/**
 * 1. SPINNER TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockSpinner /> component
 */
export function BlockSpinner({ position = [0, 0, 0] }) {
  // GUI
  const { floorColor, obstacleColor } = useControls("spinner block", {
    floorColor: trapBlockFloorColor,
    obstacleColor: trapBlockObstacleColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  // Ref - spinner
  const obstacle = useRef();

  // State - spinner speed (randomize speed of multiple spinners)
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() <= 0.5 ? -1 : 1)
  );

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
      <RigidBody
        type="fixed"
        restitution={floorRestitution}
        friction={floorFriction}
      >
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: floorColor,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>

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
 * 2. LIMBO TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockLimbo /> component
 */
export function BlockLimbo({ position = [0, 0, 0] }) {
  // GUI
  const { floorColor, obstacleColor } = useControls("limbo block", {
    floorColor: trapBlockFloorColor,
    obstacleColor: trapBlockObstacleColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  // Ref - limbo
  const obstacle = useRef();

  // State - limbo time offset (differentiate its start position)
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

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
      <RigidBody
        type="fixed"
        restitution={floorRestitution}
        friction={floorFriction}
      >
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: floorColor,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>

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
 * 3. AXE TRAP BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockAxe /> component
 */
export function BlockAxe({ position = [0, 0, 0] }) {
  // GUI
  const { floorColor, obstacleColor } = useControls("axe block", {
    floorColor: trapBlockFloorColor,
    obstacleColor: trapBlockObstacleColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  // Ref - axe
  const obstacle = useRef();

  // State - axe time offset (differentiate its start position)
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

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
      <RigidBody
        type="fixed"
        restitution={floorRestitution}
        friction={floorFriction}
      >
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: floorColor,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>

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
 * 4. END BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlockEnd /> component
 */
export function BlockEnd({ position = [0, 0, 0] }) {
  // GUI
  const { color } = useControls("end block", {
    color: edgeBlockFloorColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  return (
    <group position={position}>
      <Text
        font="./fonts/shippori-mincho-b1-v21-japanese-800.woff"
        scale={1}
        position={[0, 0.75, 0]}
      >
        Finish
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <RigidBody
        type="fixed"
        restitution={floorRestitution}
        friction={floorFriction}
      >
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: color,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, 0, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>

      <RigidBody type="fixed" colliders={false}>
        <group rotation={[0, Math.PI * 0.15, 0]}>
          <CuboidCollider args={[0.4, 0.75, 1]} position={[0, 2, 0]} />
          <CuboidCollider args={[0.4, 0.5, 0.4]} position={[0, 0.7, -0.5]} />
        </group>
        <Unicorn />
      </RigidBody>
    </group>
  );
}

/**
 * BOUNDS WALLS
 *
 * @param {*int} length the number of blocks including the start & end blocks
 *
 * @returns <Bounds /> component
 */
function Bounds({ length = 1 }) {
  // GUI
  const { color } = useControls("bounds walls", {
    color: wallColor,
  });

  // Load material roughness and normal textures
  const [floorRoughness, floorNormal] = useTexture([
    FloorRoughnessTexture,
    FloorNormalTexture,
  ]);

  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        {/* RIGHT WALL */}
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: color,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[2 + 0.15, 0.75 - 0.2, -((length - 1) * 4) / 2]}
          scale={[0.3, 1.5, length * 4]}
          castShadow
        />

        {/* LEFT WALL */}
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: color,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[-(2 + 0.15), 0.75 - 0.2, -((length - 1) * 4) / 2]}
          scale={[0.3, 1.5, length * 4]}
          receiveShadow
        />
        {/* BACK WALL */}
        <mesh
          geometry={boxGeometry}
          material={
            new THREE.MeshStandardMaterial({
              color: color,
              roughnessMap: floorRoughness,
              normalMap: floorNormal,
            })
          }
          position={[0, 0.75 - 0.2, -((length - 1) * 4 + 2)]}
          scale={[4 + 0.3 * 2, 1.5, 0.3]}
          receiveShadow
        />
      </RigidBody>
    </>
  );
}

export function Level({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo], // React Component Functions
  seed = 0,
}) {
  // Store blocks infomation
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const typeIndex = Math.floor(Math.random() * types.length);
      const type = types[typeIndex];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}

      <BlockEnd position={[0, 0, -(count + 1) * 4]} />

      <Bounds length={count + 2} />
    </>
  );
}
