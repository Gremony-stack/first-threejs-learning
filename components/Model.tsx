'use client';
import { useGLTF } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { div } from 'framer-motion/client';

type ModelProps = {
  scale?: number;
  showDIalogChair4: boolean;
  setShowDialogChair4: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

export default function RoomModel({
  scale = 2,
  showDIalogChair4,
  setShowDialogChair4,
  text,
  setText
}: ModelProps) {
  const { scene } = useGLTF('/models/room.glb');
  const [chairPosition, setChairPosition] = useState<THREE.Vector3 | null>(null)

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (['Object_4', 'Object_16', 'Object_3', 'Object_9', 'Object_2'].includes(child.name)) {
          child.userData.type = 'kursi';
        } else if (child.name === 'Object_8') {
          child.userData.type = 'piano'
        } else if (['Object_12', 'Object_5'].includes(child.name)) {
          child.userData.type = 'meja'
        }
      }
    });
  }, [scene]);

  return (
    <>
      <primitive
        object={scene}
        scale={scale}
        onClick={(e: any) => {
          e.stopPropagation();
          const target = e.object.userData.type;
          console.log('mesh ditekan: ', e.object.name);

          setShowDialogChair4(true);
          if (target === 'kursi') {
            setText('kursi')
          } else if (target === 'piano') {
            setText('piano')
          } else if (target === 'meja') {
            setText('meja')
          }
          else {
            setShowDialogChair4(false);
          }
        }}
      />

      
    </>
  );
}
