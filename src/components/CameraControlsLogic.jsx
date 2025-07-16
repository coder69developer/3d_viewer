import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CAMERA_PRESETS = {
  front: { position: [0, 0, 8], target: [0, 0, 0], name: 'Front View' },
  back: { position: [0, 0, -8], target: [0, 0, 0], name: 'Back View' },
  left: { position: [-8, 0, 0], target: [0, 0, 0], name: 'Left View' },
  right: { position: [8, 0, 0], target: [0, 0, 0], name: 'Right View' },
  top: { position: [0, 8, 0], target: [0, 0, 0], name: 'Top View' },
  bottom: { position: [0, -8, 0], target: [0, 0, 0], name: 'Bottom View' },
  isometric: { position: [8, 6, 8], target: [0, 0, 0], name: 'Isometric View' },
  closeup: { position: [0, 0, 3], target: [0, 0, 0], name: 'Close-up View' }
};

export function CameraControlsLogic({ orbitControlsRef, onCameraInfoUpdate }) {
  const { camera } = useThree();
  const [currentPreset, setCurrentPreset] = useState('isometric');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cameraDistance, setCameraDistance] = useState(10);
  
  const transitionRef = useRef({
    startPosition: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endPosition: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
    progress: 0,
    duration: 0
  });

  // Easing function for smooth transitions
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Smooth camera transition
  useFrame((state, delta) => {
    if (isTransitioning && orbitControlsRef.current) {
      const transition = transitionRef.current;
      transition.progress += delta / transition.duration;
      
      if (transition.progress >= 1) {
        // Transition complete
        camera.position.copy(transition.endPosition);
        orbitControlsRef.current.target.copy(transition.endTarget);
        orbitControlsRef.current.update();
        setIsTransitioning(false);
      } else {
        // Interpolate position and target
        const t = easeInOutCubic(transition.progress);
        camera.position.lerpVectors(transition.startPosition, transition.endPosition, t);
        orbitControlsRef.current.target.lerpVectors(transition.startTarget, transition.endTarget, t);
        orbitControlsRef.current.update();
      }
    }

    // Update camera info for parent component
    if (orbitControlsRef.current) {
      const distance = camera.position.distanceTo(orbitControlsRef.current.target);
      setCameraDistance(distance);
      
      onCameraInfoUpdate({
        currentPreset,
        isTransitioning,
        cameraDistance: distance,
        cameraPosition: [
          Math.round(camera.position.x * 100) / 100,
          Math.round(camera.position.y * 100) / 100,
          Math.round(camera.position.z * 100) / 100
        ]
      });
    }
  });

  // Expose camera control functions to parent
  useEffect(() => {
    if (orbitControlsRef.current) {
      // Transition to a camera preset
      window.transitionToPreset = (presetKey) => {
        if (isTransitioning || !orbitControlsRef.current) return;
        
        const preset = CAMERA_PRESETS[presetKey];
        if (!preset) return;

        setIsTransitioning(true);
        setCurrentPreset(presetKey);

        const transition = transitionRef.current;
        transition.startPosition.copy(camera.position);
        transition.startTarget.copy(orbitControlsRef.current.target);
        transition.endPosition.set(...preset.position);
        transition.endTarget.set(...preset.target);
        transition.progress = 0;
        transition.duration = 1.0; // 1 second transition
      };

      // Zoom camera in/out
      window.zoomCamera = (direction) => {
        if (isTransitioning || !orbitControlsRef.current) return;
        
        const zoomFactor = direction === 'in' ? 0.8 : 1.2;
        const newDistance = cameraDistance * zoomFactor;
        
        // Clamp distance
        const clampedDistance = Math.max(2, Math.min(20, newDistance));
        setCameraDistance(clampedDistance);
        
        // Calculate new position based on current direction
        const directionVector = new THREE.Vector3()
          .subVectors(camera.position, orbitControlsRef.current.target)
          .normalize();
        
        const newPosition = new THREE.Vector3()
          .copy(orbitControlsRef.current.target)
          .add(directionVector.multiplyScalar(clampedDistance));
        
        camera.position.copy(newPosition);
        orbitControlsRef.current.update();
      };

      // Reset camera to default position
      window.resetCamera = () => {
        window.transitionToPreset('isometric');
      };
    }

    return () => {
      // Cleanup global functions
      delete window.transitionToPreset;
      delete window.zoomCamera;
      delete window.resetCamera;
    };
  }, [camera, orbitControlsRef, isTransitioning, cameraDistance]);

  return null; // This component doesn't render anything
} 