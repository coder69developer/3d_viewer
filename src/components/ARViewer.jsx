import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ARButton, Interactive, useXR } from '@react-three/xr';
import { Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Container } from './Container';
import './ARViewer.css';

// AR Product Component
function ARProduct({ containerProps, onPlacement }) {
  const { camera } = useThree();
  const meshRef = useRef();
  const [isPlaced, setIsPlaced] = useState(false);
  const [position, setPosition] = useState([0, 0, -1]);
  const [scale, setScale] = useState(1);

  useFrame(() => {
    if (!isPlaced && meshRef.current) {
      // Follow camera until placed
      const cameraDirection = new THREE.Vector3(0, 0, -1);
      cameraDirection.applyQuaternion(camera.quaternion);
      const newPosition = camera.position.clone().add(cameraDirection.multiplyScalar(2));
      setPosition([newPosition.x, newPosition.y, newPosition.z]);
    }
  });

  const handleSelect = () => {
    if (!isPlaced) {
      setIsPlaced(true);
      onPlacement && onPlacement(position);
    }
  };

  const handleMove = (event) => {
    if (isPlaced) {
      setPosition(event.transform.position);
    }
  };

  const handleScale = (event) => {
    if (isPlaced) {
      const newScale = scale * (event.scale > 1 ? 1.1 : 0.9);
      setScale(Math.max(0.1, Math.min(5, newScale)));
    }
  };

  return (
    <Interactive
      onSelect={handleSelect}
      onMove={handleMove}
      onSqueeze={handleScale}
    >
      <mesh
        ref={meshRef}
        position={position}
        scale={[scale, scale, scale]}
        castShadow
        receiveShadow
      >
        <Container {...containerProps} />
      </mesh>
    </Interactive>
  );
}

// AR Scene Component
function ARScene({ containerProps, onPlacement }) {
  const { camera } = useThree();
  const [lightIntensity, setLightIntensity] = useState(1);

  useFrame(() => {
    // Adjust lighting based on camera movement
    if (camera) {
      const intensity = Math.max(0.3, Math.min(1.5, 1 - camera.position.y * 0.1));
      setLightIntensity(intensity);
    }
  });

  return (
    <>
      {/* AR Lighting */}
      <ambientLight intensity={0.4 * lightIntensity} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8 * lightIntensity}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3 * lightIntensity} />
      
      {/* AR Environment */}
      <Environment preset="apartment" />
      
      {/* AR Product */}
      <ARProduct containerProps={containerProps} onPlacement={onPlacement} />
    </>
  );
}

// Main AR Viewer Component
export function ARViewer({ containerProps, onBackToViewer }) {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [placementPosition, setPlacementPosition] = useState(null);
  const [arInstructions, setArInstructions] = useState('');

  useEffect(() => {
    // Check AR support
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
        setIsARSupported(isSupported);
        
        if (isSupported) {
          setArInstructions('AR is supported! Click "Start AR" to begin.');
        } else {
          setArInstructions('AR is not supported on this device.');
        }
      } else {
        setArInstructions('WebXR is not supported on this device.');
      }
    };

    checkARSupport();
  }, []);

  const handleARStart = () => {
    setIsARActive(true);
    setArInstructions('Point your camera at a flat surface and tap to place the product.');
  };

  const handleAREnd = () => {
    setIsARActive(false);
    setPlacementPosition(null);
  };

  const handlePlacement = (position) => {
    setPlacementPosition(position);
    setArInstructions('Product placed! You can move and scale it with gestures.');
  };

  if (!isARSupported) {
    return (
      <div className="ar-viewer">
        <div className="ar-header">
          <button onClick={onBackToViewer} className="back-button">
            ← Back to 3D Viewer
          </button>
          <h2>AR Product Viewer</h2>
        </div>
        <div className="ar-not-supported">
          <div className="ar-icon">📱</div>
          <h3>AR Not Supported</h3>
          <p>{arInstructions}</p>
          <p>AR requires a compatible mobile device with WebXR support.</p>
          <button onClick={onBackToViewer} className="btn-primary">
            Return to 3D Viewer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-viewer">
      <div className="ar-header">
        <button onClick={onBackToViewer} className="back-button">
          ← Back to 3D Viewer
        </button>
        <h2>AR Product Viewer</h2>
      </div>

      {!isARActive ? (
        <div className="ar-setup">
          <div className="ar-preview">
            <div className="ar-preview-content">
              <div className="ar-icon">📱</div>
              <h3>View Product in AR</h3>
              <p>Place the 3D product in your real environment using your device's camera.</p>
              <div className="ar-features">
                <div className="feature">
                  <span>🎯</span>
                  <span>Point camera at flat surface</span>
                </div>
                <div className="feature">
                  <span>👆</span>
                  <span>Tap to place product</span>
                </div>
                <div className="feature">
                  <span>🤏</span>
                  <span>Pinch to scale</span>
                </div>
                <div className="feature">
                  <span>🔄</span>
                  <span>Drag to move</span>
                </div>
              </div>
              <ARButton
                onStart={handleARStart}
                onEnd={handleAREnd}
                className="ar-start-btn"
              >
                Start AR Experience
              </ARButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="ar-active">
          <Canvas
            camera={{ position: [0, 0, 0], fov: 75 }}
            shadows
            className="ar-canvas"
          >
            <ARScene 
              containerProps={containerProps} 
              onPlacement={handlePlacement}
            />
          </Canvas>
          
          <div className="ar-overlay">
            <div className="ar-instructions">
              <p>{arInstructions}</p>
            </div>
            
            {placementPosition && (
              <div className="ar-controls">
                <button 
                  onClick={() => setPlacementPosition(null)}
                  className="ar-reset-btn"
                >
                  Reset Position
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 