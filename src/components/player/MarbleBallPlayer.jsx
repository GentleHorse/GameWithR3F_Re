import { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import useGame from "../../stores/useGame.js";
import { materials } from "../../utils/materials.js";

export default function MarbleBallPlayer() {
  /**
   * MARBLE BALL RADIUS
   */
  const radius = 0.3;

  /**
   * GUI - SPHERE MATERIAL
   */
  const {
    flatShading,
    color,
    metalness,
    roughness,
    wireframe,
  } = useControls("marble ball", {
    flatShading: false,
    color: "#750000",
    metalness: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    wireframe: false,
  });

  /**
   * KEYBOARD CONTROL
   */
  // Ref for the marble ball
  const body = useRef();

  // Set up useKeyboardControls() hook
  const [subscribeKeys, getKeys] = useKeyboardControls();

  // Import "rapier" & "world" property from Rapier library
  const { rapier, world } = useRapier();

  /**
   *  ~~ Here's a logic to change the game phase ~~
   */
  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  useEffect(() => {
    const unsubscribeAny = subscribeKeys(() => start());

    return () => {
      return unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    // Get the marble ball position
    const bodyPosition = body.current.translation();

    // Successfully reached the goal
    if (bodyPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }

    // Fall from the level
    if (bodyPosition.y < -4) {
      restart();
    }
  });

  /**
   *  ~~ Here's a logic to make the ball jump ~~
   */
  const jump = () => {
    const origin = body.current.translation();
    origin.y -= radius + 0.01;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    // Jump is allowed only if the ball is close enough to the floor
    if (hit.toi < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.6, z: 0 });
    }
  };

  // For listening to state changes
  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      // Selector - which one to listen ?
      (state) => state.jump,

      // What you want to do when the selector's state change ?
      (value) => {
        if (value) {
          jump();
        }
      }
    );

    return () => {
      unsubscribeJump();
    };
  }, []);

  /**
   *  ~~ Here's a logic to make the ball move ~~
   *
   * In case the player presses two keys at the same time,
   * play with "one" vector value instead of multiple values.
   * ("Two" vectors are too strong!!)
   */
  useFrame((state, delta) => {
    // Get keys' states (pressed or not pressed)
    const { forward, backward, leftward, rightward, jump, activateFly } =
      getKeys();

    // "One" vector value for each force & roll
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    // "Velocity" which is applied when the key is pressed
    const impluseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    // Assign force & roll to keys
    if (forward) {
      impulse.z -= impluseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impluseStrength;
      torque.x += torqueStrength;
    }
    if (leftward) {
      impulse.x -= impluseStrength;
      torque.z += torqueStrength;
    }
    if (rightward) {
      impulse.x += impluseStrength;
      torque.z -= torqueStrength;
    }
    if (jump & activateFly) {
      impulse.y += impluseStrength * 2.5;
    }

    // Set force & roll vectors to RigidBody
    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
  });

  /**
   *  ~~ Here's a logic to reset the ball ~~
   *
   * We are listening to the phase changes
   * and whenever it changes to "ready",
   * reset() is triggered.
   */
  const reset = () => {
    body.current.setTranslation({ x: 0, y: 5, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });  // Reset linear velocity
    body.current.setAngvel({ x: 0, y: 0, z: 0 });  // Reset angular velocity
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") {
          reset();
        }
      }
    );

    return () => {
      unsubscribeReset();
    };
  }, []);

  /**
   * CAMERA ANIMATION
   */
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(20, 20, 20)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  useFrame((state, delta) => {
    // Get the marble ball position
    const bodyPosition = body.current.translation();

    // Camera position
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    // Camera target
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    // Lerp position & target
    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    // Set smoothed position & target
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <RigidBody
      ref={body}
      canSleep={false}
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[radius - 0.01, 1]} />
        <meshStandardMaterial
          flatShading={flatShading}
          color={color}
          metalness={metalness}
          roughness={roughness}
          wireframe={wireframe}
          aoMap={materials.floor.floor01.aoMap}
          normalMap={materials.floor.floor01.normalMap}
          roughnessMap={materials.floor.floor01.roughnessMap}
        />
      </mesh>
    </RigidBody>
  );
}
