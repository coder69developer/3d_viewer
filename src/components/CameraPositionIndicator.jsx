import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './CameraPositionIndicator.css';

export function CameraPositionIndicator({ orbitControlsRef }) {
  const { camera } = useThree();
  const indicatorRef = useRef();
  const [cameraInfo, setCameraInfo] = React.useState({
    position: [0, 0, 0],
    distance: 0,
    rotation: [0, 0, 0]
  });

  useFrame(() => {
    if (orbitControlsRef.current && indicatorRef.current) {
      const controls = orbitControlsRef.current;
      const distance = camera.position.distanceTo(controls.target);
      
      // Calculate rotation angles
      const direction = new THREE.Vector3()
        .subVectors(camera.position, controls.target)
        .normalize();
      
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(direction);
      
      const rotationX = (spherical.phi * 180) / Math.PI;
      const rotationY = (spherical.theta * 180) / Math.PI;
      
      setCameraInfo({
        position: [
          Math.round(camera.position.x * 100) / 100,
          Math.round(camera.position.y * 100) / 100,
          Math.round(camera.position.z * 100) / 100
        ],
        distance: Math.round(distance * 100) / 100,
        rotation: [Math.round(rotationX), Math.round(rotationY), 0]
      });

      // Update indicator position
      indicatorRef.current.position.copy(controls.target);
      indicatorRef.current.position.y += 2;
    }
  });

  return (
    <group ref={indicatorRef}>
      {/* Camera position indicator */}
      <mesh>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.8} />
      </mesh>
      
      {/* Distance indicator line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, -2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff6b6b" transparent opacity={0.5} />
      </line>
      
      {/* Camera position indicator (simplified) */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

 