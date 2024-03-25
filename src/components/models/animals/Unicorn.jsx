import * as THREE from "three";
import React from "react";
import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";

export default function Unicorn(props) {
  const { nodes } = useGLTF("/models/animals/unicorn.glb");

  // GUI
  const {
    bodyColor,
    bodyRoughness,
    bodyTransmission,
    bodyThickness,
    edgeColor,
    edgeMetalness,
    edgeRoughness,
    edgeWireframe,
  } = useControls("unicorn", {
    bodyColor: "#171e59",
    bodyRoughness: {
      value: 0.15,
      min: 0,
      max: 1,
      step: 0.01,
    },
    bodyTransmission: {
      value: 1,
      min: 0,
      max: 5,
      step: 0.01,
    },
    bodyThickness: {
      value: 0.5,
      min: 0,
      max: 5,
      step: 0.01,
    },
    edgeColor: "gold",
    edgeMetalness: {
      value: 0.7,
      min: 0,
      max: 1,
      step: 0.01,
    },
    edgeRoughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    edgeWireframe: false,
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Bone} />
      <primitive object={nodes.Bone037} />
      <primitive object={nodes.Bone014} />
      <primitive object={nodes.Bone035} />
      <primitive object={nodes.Bone036} />
      <primitive object={nodes.Bone038} />
      <group
        position={[0, 1.242, 0]}
        rotation={[0, Math.PI / 6, 0]}
        scale={0.489}
      >
        <skinnedMesh
          castShadow
          geometry={nodes.Cube.geometry}
          material={
            new THREE.MeshPhysicalMaterial({
              color: bodyColor,
              roughness: bodyRoughness,
              transmission: bodyTransmission,
              thickness: bodyThickness,
            })
          }
          skeleton={nodes.Cube.skeleton}
        />
        <skinnedMesh
          castShadow
          geometry={nodes.Cube_1.geometry}
          material={
            new THREE.MeshStandardMaterial({
              color: edgeColor,
              metalness: edgeMetalness,
              roughness: edgeRoughness,
              wireframe: edgeWireframe,
            })
          }
          skeleton={nodes.Cube_1.skeleton}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/animals/unicorn.glb");
