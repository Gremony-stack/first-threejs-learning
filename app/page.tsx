'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import RoomModel from '@/components/Model';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

function Player() {
  const velocityY = useRef(0);
  const isGrounted = useRef(false);
  const jumpTarget = useRef(0);

  const direction = useRef(new THREE.Vector3());
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') setKeys((k) => ({ ...k, forward: true }));
      if (e.code === 'KeyS') setKeys((k) => ({ ...k, backward: true }));
      if (e.code === 'KeyA') setKeys((k) => ({ ...k, left: true }));
      if (e.code === 'KeyD') setKeys((k) => ({ ...k, right: true }));
      if (e.code === 'Space') setKeys((k) => ({ ...k, space: true }));
    };

    const up = (e: KeyboardEvent) => {
      if (e.code === 'KeyW') setKeys((k) => ({ ...k, forward: false }));
      if (e.code === 'KeyS') setKeys((k) => ({ ...k, backward: false }));
      if (e.code === 'KeyA') setKeys((k) => ({ ...k, left: false }));
      if (e.code === 'KeyD') setKeys((k) => ({ ...k, right: false }));
      if (e.code === 'Space') setKeys((k) => ({ ...k, space: false }));
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame(({ camera }) => {
    direction.current.set(0, 0, 0);

    if (keys.forward) direction.current.z -= 1;
    if (keys.backward) direction.current.z += 1;
    if (keys.left) direction.current.x -= 1;
    if (keys.right) direction.current.x += 1;

    direction.current.normalize();
    direction.current.applyEuler(camera.rotation);

    camera.position.addScaledVector(direction.current, 0.05);

    // Kunci tinggi kamera (supaya tidak jatuh)
    camera.position.y = 1.6;

    if (keys.space && isGrounted.current) {
      jumpTarget.current = 5.08;
      isGrounted.current = false;
    }

    if (!isGrounted.current) {
      velocityY.current = THREE.MathUtils.lerp(
        velocityY.current,
        jumpTarget.current,
        0.1
      );
      jumpTarget.current -= 0.1;
      camera.position.y += velocityY.current;
      console.log(`
        velocityY : ${velocityY.current},
        posY : ${camera.position.y}
        
        code by ahmadadptr001
        `);
    }

    if (camera.position.y <= 1.6) {
      camera.position.y = 1.6;
      velocityY.current = 0;
      isGrounted.current = true;
    }
  });

  return <PointerLockControls />;
}

export default function Home() {
  const [showDIalogChair4, setShowDialogChair4] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const DialogChair4 = () => {
    return (
      <AnimatePresence>
        <div className="absolute overflow-x-hidden inset-0 grid place-items-center z-50">
          <motion.div
            initial={{ y: 200, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 200, scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 20,
            }}
            className="relative w-105 h-50 flex flex-col justify-center items-center"
            style={{ transformOrigin: 'bottom center' }}
          >
            <div className="absolute inset-0 bg-sky-500/20 blur-3xl animate-pulse" />

            <div
              className="relative w-full h-full border-2 border-sky-500 text-sky-400 flex flex-col justify-center items-center"
              style={{
                clipPath:
                  'polygon(10% 0%, 90% 0%, 100% 15%, 100% 85%, 90% 100%, 10% 100%, 0% 85%, 0% 15%)',
                boxShadow: '0 0 20px #ff0000, inset 0 0 20px rgba(0,0,255,0.4)',
              }}
            >
              <div className="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-sky-400 to-transparent animate-pulse" />

              <div className="absolute bottom-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-sky-400 to-transparent animate-pulse" />

              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, letterSpacing: '0.2em' }}
                transition={{ duration: 0.5 }}
                className="text-4xl uppercase font-extrabold tracking-[0.2em]"
              >
                {text ?? 'Tidak diketahui'}
              </motion.p>

              <p className="mt-3 text-xs tracking-[0.4em] text-sky-300/70">
                INFORMASI BENDA
              </p>

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-sky-500/20 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  };
  return (
    <div className="min-h-screen h-screen">
      <div className="crosshair" />
      {showDIalogChair4 && <DialogChair4 />}
      <Canvas camera={{ position: [0, -2, 2] }}>
        <RoomModel
          showDIalogChair4={showDIalogChair4}
          setShowDialogChair4={setShowDialogChair4}
          text={text}
          setText={setText}
        />
        <Player />
      </Canvas>
    </div>
  );
}
