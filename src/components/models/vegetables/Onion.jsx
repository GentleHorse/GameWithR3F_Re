/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 onion.gltf --transform 
Files: onion.gltf [2.27KB] > C:\Users\toshi\Desktop\ThreeJs\create-a-game-with-r3f-re\onion-transformed.glb [1.44KB] (37%)
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Onion(props) {
  const { nodes, materials } = useGLTF('/models/vegetables/onion.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.onion.geometry} material={materials.brown} />
    </group>
  )
}

useGLTF.preload('/models/vegetables/onion.glb')