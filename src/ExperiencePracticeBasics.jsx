import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Geometry, Base, Addition } from "@react-three/csg";
import Lights from "./components/utils/Lights.jsx";
import { Perf } from "r3f-perf";
import {
  CuboidCollider,
  RigidBody,
  Physics,
  CylinderCollider,
  InstancedRigidBodies,
} from "@react-three/rapier";
import useSound from "use-sound";
import hitSound from "../public/sounds/hit.mp3";
import Pot from "./components/models/utensils/Pot.jsx";
import PotLid from "./components/models/utensils/PotLid.jsx";
import ReverseGravityPushButton from "./components/models/reverse-gravity-push-button/ReverseGravityPushButton.jsx";

export default function ExperiencePracticeBasics() {
  const sphere = useRef();
  const cube = useRef();
  const twister = useRef();

  /**
   * State - managing gravity
   */
  const [reveseGravityParam, setReverseGravityParam] = useState(1);

  /**
   * Set up sounds
   */
  const [playHitSound] = useSound(hitSound);

  /**
   * Import models
   */
  const clear = useGLTF("/models/weather-icons/clear.glb");

  /**
   * Object instances' count & matrices
   */
  const objectsCount = 300;
  const instances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < objectsCount; i++) {
      instances.push({
        key: "instance_" + i,
        position: [
          (Math.random() - 0.5) * 8,
          4 + i * 0.2,
          (Math.random() - 0.5) * 8,
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);

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
   * Handler - wake up sleeping objects
   */
  const wakeUpSleepingObjects = () => {
    sphere.current.wakeUp();
    cube.current.wakeUp();
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

      <Environment preset="city" />

      <Lights />

      <Physics gravity={[0, -9.81 * reveseGravityParam, 0]} debug={false}>
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

        {/* HUNDREDS OF OBJECTS */}
        <InstancedRigidBodies instances={instances}>
          <instancedMesh castShadow args={[undefined, undefined, objectsCount]}>
            <Geometry useGroups>
              <Base
                scale={0.15}
                geometry={clear.nodes.Curve052.geometry}
                material={clear.materials.clearMaterial}
              />
              <Addition
                scale={0.15}
                geometry={clear.nodes.Curve052_1.geometry}
                material={clear.materials.edgeMaterial}
              />
            </Geometry>
          </instancedMesh>
        </InstancedRigidBodies>

        {/* TWISTER */}
        <RigidBody ref={twister} friction={0} type="kinematicPosition">
          <mesh castShadow scale={[0.4, 0.4, 3]} position={[0, 0.5, 0]}>
            <boxGeometry />
            <meshStandardMaterial color="snow" />
          </mesh>
        </RigidBody>

        {/* GRAVITY BUTTON */}
        <ReverseGravityPushButton
          reveseGravityParam={reveseGravityParam}
          onSetGravityParam={() => {
            setReverseGravityParam(
              (prevReveseGravityParam) => prevReveseGravityParam * -1
            );
          }}
          onWakeUpObjects={wakeUpSleepingObjects}
        />

        {/* FLOOR */}
        <RigidBody type="fixed" restitution={0} friction={0.7}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="lightblue" />
          </mesh>
        </RigidBody>

        {/* POT LID */}
        <RigidBody
          // type="fixed"
          colliders={false}
          scale={15}
          // position={[0, 8, -8]}
          position={[0, 40, 0]}
          rotation={[0, Math.PI * 0.5, 0]}
          // rotation={[-Math.PI * 0.7, 0, 0]}
        >
          <CylinderCollider args={[0.025, 0.35]} position={[0, 0.025, 0]} />
          <PotLid />
        </RigidBody>

        {/* POT BODY */}
        <RigidBody type="fixed" colliders="trimesh">
          <Pot
            scale={[15, 10, 15]}
            position={[0, -1, 0]}
            rotation={[0, Math.PI * 0.5, 0]}
          />
        </RigidBody>
      </Physics>
    </>
  );
}
