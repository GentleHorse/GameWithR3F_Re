import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import {
  CuboidCollider,
  RigidBody,
} from "@react-three/rapier";
import useSound from "use-sound";
import gravitySwitchSound from "../../../../public/sounds/gravity-switch.wav";

/**
 * 
 * @param {*int} reveseGravityParam the state of gravity (+1) or reversed gravity (-1)
 * @param {*function} onSetGravityParam the setter of the gravity state
 * @param {*function} onWakeUpObjects the function of waking up sleeping objects
 * 
 * @returns <ReverseGravityPushButton /> component 
 */
export default function ReverseGravityPushButton({
  reveseGravityParam,
  onSetGravityParam,
  onWakeUpObjects,
}) {
  /**
   * Refs - for RigidBody (> position control) and mesh(> color control)
   */
  const button = useRef();
  const buttonMesh = useRef();

  /**
   * Set up the sound for the switch
   */
  const [playGravitySwitchSound] = useSound(gravitySwitchSound);

  /**
   * Import the button glb model
   */
  const pushButton = useGLTF("/models/buttons/push-button.glb");

  /**
   * Handler - reverse gravity
   */
  const handleReverseGravity = () => {
    // Reverse gravity
    onSetGravityParam();

    // Change the button position (y-axis)
    button.current.setNextKinematicTranslation({
      x: 0,
      y: -0.1 * reveseGravityParam,
      z: 0,
    });

    // Change the button color
    if (reveseGravityParam === 1) {
      buttonMesh.current.material.color = { r: 0, g: 125 / 255, b: 25 / 255 };
    } else {
      buttonMesh.current.material.color = {
        r: 255 / 255,
        g: 0 / 255,
        b: 0 / 255,
      };
    }

    // Wake up sleeping objects
    onWakeUpObjects();

    // Play the gravity switch sound
    playGravitySwitchSound();
  };

  return (
    <>
      {/* REVERSE GRAVITY BUTTON - TOP */}
      <RigidBody ref={button} type="kinematicPosition" colliders={false}>
        <group position={[0, -2, 7]}>
          <CuboidCollider
            args={[1, 1, 1]}
            position={[0, 1.1, 0]}
            scale={[0.8, 0.25, 0.8]}
          />
          <mesh
            ref={buttonMesh}
            castShadow
            geometry={pushButton.nodes.Cube1340.geometry}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[1, 1, 4]}
            onClick={handleReverseGravity}
          >
            <meshStandardMaterial color="red" />
          </mesh>
        </group>
      </RigidBody>

      {/* REVERSE GRAVITY BUTTON - BOTTOM */}
      <RigidBody
        type="fixed"
        position={[0, -1.7, 7]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1.3, 1.3, 3]}
      >
        <mesh receiveShadow geometry={pushButton.nodes.Cube1340_1.geometry}>
          <meshStandardMaterial color="#4F4F48" />
        </mesh>
      </RigidBody>
    </>
  );
}

useGLTF.preload("/models/buttons/push-button.glb");
