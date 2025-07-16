import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Container } from './Container';
import { CameraControls } from './CameraControls';
import { CameraControlsLogic } from './CameraControlsLogic';
import { CameraPositionIndicator } from './CameraPositionIndicator';
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
  const orbitControlsRef = useRef();
  const [showPositionIndicator, setShowPositionIndicator] = useState(false);
  const [showCameraControls, setShowCameraControls] = useState(false);
  const [cameraInfo, setCameraInfo] = useState({
    currentPreset: 'isometric',
    isTransitioning: false,
    cameraDistance: 10,
    cameraPosition: [8, 6, 8]
  });

  const handleCameraInfoUpdate = (info) => {
    setCameraInfo(info);
  };

  return (
    <div className="scene-container">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 45 }}
        className="scene-canvas"
        shadows
      >
        {/* Balanced lighting for product visualization */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight
          position={[-10, -10, -5]}
          intensity={0.3}
          color="#ffffff"
        />
        <pointLight position={[0, 5, 0]} intensity={0.2} />
        <pointLight position={[0, -5, 0]} intensity={0.1} />
        
        {/* Soft environment lighting */}
        <Environment preset="apartment" />
        
        {/* Ground plane for realistic product placement */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="#f8f9fa" 
            transparent 
            opacity={0.6}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        
        {/* Subtle shadow under the model */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent 
            opacity={0.05}
          />
        </mesh>
        
        {/* Center the model in the scene */}
        <ModelCentering>
          <Suspense fallback={null}>
            <Container {...containerProps} />
          </Suspense>
        </ModelCentering>
        
        {/* Camera position indicator (optional) */}
        {showPositionIndicator && (
          <CameraPositionIndicator orbitControlsRef={orbitControlsRef} />
        )}
        
        {/* Camera Controls Logic (inside Canvas) */}
        <CameraControlsLogic 
          orbitControlsRef={orbitControlsRef}
          onCameraInfoUpdate={handleCameraInfoUpdate}
        />
        
        {/* Enhanced OrbitControls with better product viewing experience */}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={30}
          target={[0, 0, 0]}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.8}
          zoomSpeed={1.2}
          panSpeed={0.8}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />

        <ScreenshotCapture ref={screenshotRef} onCapture={onScreenshotCapture} />
      </Canvas>
      
      {/* Camera Controls Toggle Button */}
      <div className="camera-controls-toggle">
        <button
          onClick={() => setShowCameraControls(!showCameraControls)}
          className="camera-toggle-btn"
          title={showCameraControls ? "Hide Camera Controls" : "Show Camera Controls"}
        >
          {showCameraControls ? '📷' : '📷'}
        </button>
      </div>

      {/* Camera Controls Overlay */}
      {showCameraControls && (
        <div className="camera-controls-overlay">
          <CameraControls 
            showPositionIndicator={showPositionIndicator}
            onTogglePositionIndicator={() => setShowPositionIndicator(!showPositionIndicator)}
            cameraInfo={cameraInfo}
          />
        </div>
      )}
    </div>
  );
} 