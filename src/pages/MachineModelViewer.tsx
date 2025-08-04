import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import React, { Suspense, useRef, useState, useEffect } from "react";
import * as THREE from 'three';

function Model({ path, resetSignal, onLoaded, isPlaying }: { 
  path: string, 
  resetSignal: number,
  onLoaded: (box: THREE.Box3) => void,
  isPlaying: boolean
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(path, true);
  const { actions } = useAnimations(animations, group);

  useFrame((state, delta) => {
    if (group.current && isPlaying && !actions['IntroAction']) {
      group.current.rotation.y += delta * 0.0001;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        0,
        delta * 1.5
      );
    }
  });

  useEffect(() => {
    if (group.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.x -= center.x;
      scene.position.y -= center.y;
      scene.position.z -= center.z;

      if (actions['IntroAction']) {
        actions['IntroAction'].setLoop(THREE.LoopOnce, 1);
        actions['IntroAction'].play().reset();
      } else {
        group.current.rotation.y = Math.PI;
        group.current.rotation.x = -0.5;
      }

      const centeredBox = new THREE.Box3().setFromObject(scene);
      onLoaded(centeredBox);
    }
  }, [scene, resetSignal, actions, onLoaded]);

  return <group ref={group}><primitive object={scene} /></group>;
}

function CameraAndControls({ boundingBox, isPlaying }: { boundingBox: THREE.Box3, isPlaying: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!boundingBox.isEmpty()) {
      const size = boundingBox.getSize(new THREE.Vector3());
      const center = boundingBox.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      
      const distance = maxDim * 0.8;
      
      camera.position.set(center.x + distance, center.y + distance * 0.5, center.z + distance);
      camera.lookAt(center.x, center.y, center.z);
      camera.near = maxDim * 0.01;
      camera.far = maxDim * 100;   
      camera.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.target.set(center.x, center.y, center.z);
        controlsRef.current.minDistance = maxDim * 0.1; 
        controlsRef.current.maxDistance = maxDim * 5;
        controlsRef.current.autoRotate = isPlaying;
        controlsRef.current.update();
        
        if (!initialized) {
          controlsRef.current.reset();
          setInitialized(true);
        }
      }
    }
  }, [boundingBox, camera, initialized, isPlaying]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan
      enableZoom
      enableRotate
      dampingFactor={0.1}
      autoRotate={isPlaying}
      autoRotateSpeed={2}
    />
  );
}

export default function MachineModelViewer({ modelPath }: { modelPath: string }) {
  const [boundingBox, setBoundingBox] = useState(new THREE.Box3());
  const [resetCounter, setResetCounter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  function reset() {
    setResetCounter((c) => c + 1);
    setIsPlaying(true);
  }

  function togglePlayPause() {
    setIsPlaying(!isPlaying);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "24rem" }}>
      <button
        onClick={reset}
        aria-label="Reset camera and model position"
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 10,
          padding: "8px 12px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
      
      <button
        onClick={togglePlayPause}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: "8px 12px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 4,
          cursor: "pointer",
          color: isPlaying ? "#ef4444" : "#10b981",
          fontWeight: "bold",
        }}
      >
        {isPlaying ? "◼" : "▷"}
      </button>

      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Suspense fallback={null}>
          <Model 
            path={modelPath} 
            resetSignal={resetCounter} 
            onLoaded={setBoundingBox}
            isPlaying={isPlaying}
          />
          <Environment preset="warehouse" />
        </Suspense>
        <CameraAndControls boundingBox={boundingBox} isPlaying={isPlaying} />
      </Canvas>
    </div>
  );
}