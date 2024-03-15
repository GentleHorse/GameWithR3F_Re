import * as THREE from "three";
import { useControls } from "leva";

/**
 * GENERIC CUBE GEOMETRY
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

/**
 * MATERIALS NOTES
 */
// const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
// const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
// const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
// const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

/**
 * START BLOCK
 *
 * @param {*array} position the local position of the component
 *
 * @returns <BlckStart /> component
 */
function BlockStart({ position = [0, 0, 0] }) {
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

export default function Level() {
  return (
    <>
      <BlockStart position={[0, 0, 0]} />
    </>
  );
}
