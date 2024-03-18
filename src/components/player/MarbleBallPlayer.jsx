import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";

export default function MarbleBallPlayer() {
  /**
   * MARBLE BALL RADIUS
   */
  const radius = 0.3;

  /**
   * OUTER FRAME MATERIAL
   */
  const {
    flatShadingOuter,
    colorOuter,
    metalnessOuter,
    roughnessOuter,
    wireframeOuter,
  } = useControls("marble ball - outer frame", {
    flatShadingOuter: false,
    colorOuter: "#8d6a1a",
    metalnessOuter: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughnessOuter: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    wireframeOuter: true,
  });

  /**
   * INNER SPHERE MATERIAL
   */
  const {
    flatShadingInner,
    colorInner,
    metalnessInner,
    roughnessInner,
    wireframeInner,
  } = useControls("marble ball - inner sphere", {
    flatShadingInner: true,
    colorInner: "#8c2c19",
    metalnessInner: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    roughnessInner: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    wireframeInner: false,
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

  // Here's a logic to make the ball jump ~~
  const jump = () => {
    const origin = body.current.translation();
    origin.y -= radius + 0.01;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.toi < 0.15) {
      {
        body.current.applyImpulse({ x: 0, y: 1, z: 0 });
      }
    }
  };

  useEffect(() => {
    subscribeKeys(
      // Selector - which one to listen ?
      (state) => {
        return state.jump;
      },

      // What you want to do when the selector's state change ?
      (value) => {
        if (value) {
          jump();
        }
      }
    );
  }, []);

  // Here's a logic to make the ball move ~~
  // * In case the player presses two keys at the same time,
  // * play with "one" vector value instead of multiple values.
  // * ("Two" vectors are too strong!!)
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
      impulse.y += impluseStrength * 5;
    }

    // Set force & roll vectors to RigidBody
    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
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
      {/* OUTER FRAME */}
      <mesh castShadow>
        <icosahedronGeometry args={[radius, 1]} />
        <meshStandardMaterial
          flatShading={flatShadingOuter}
          color={colorOuter}
          metalness={metalnessOuter}
          roughness={roughnessOuter}
          wireframe={wireframeOuter}
        />
      </mesh>

      {/* INNER SPHERE */}
      <mesh castShadow>
        <icosahedronGeometry args={[radius - 0.01, 1]} />
        <meshStandardMaterial
          flatShading={flatShadingInner}
          color={colorInner}
          metalness={metalnessInner}
          roughness={roughnessInner}
          wireframe={wireframeInner}
        />
      </mesh>
    </RigidBody>
  );
}
