import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Container } from './Container';
import './Scene3D.css';

// Component to access the renderer for screenshot functionality
const ScreenshotCapture = React.forwardRef(({ onCapture }, ref) => {
  const { gl, scene, camera } = useThree();
  
  const captureScreenshot = () => {
    // Render the scene to get the current view
    gl.render(scene, camera);
    
    // Get the canvas data as a data URL
    const canvas = gl.domElement;
    const dataURL = canvas.toDataURL('image/png');
    
    onCapture(dataURL);
  };

  // Expose the capture function to parent component
  React.useImperativeHandle(ref, () => ({
    capture: captureScreenshot
  }));

  return null;
});

// Component to center the model in the scene
const ModelCentering = ({ children }) => {
  const groupRef = useRef();
  
  useEffect(() => {
    if (groupRef.current) {
      // Center the model by adjusting its position
      groupRef.current.position.set(0, -1, 0);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

export function Scene3D({ containerProps, screenshotRef, onScreenshotCapture }) {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 45 }}
      className="scene-canvas"
      shadows
    >
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} />
      
      <Environment preset="city" />
      
      {/* Center the model in the scene */}
      <ModelCentering>
        <Suspense fallback={null}>
          <Container {...containerProps} />
        </Suspense>
      </ModelCentering>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={25}
        target={[0, 0, 0]}
      />

      <ScreenshotCapture ref={screenshotRef} onCapture={onScreenshotCapture} />
    </Canvas>
  );
} 