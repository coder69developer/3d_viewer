import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Container } from './Container';

export function ModelViewer({ modelPath }) {
  const [containerProps, setContainerProps] = useState({
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    bodyColor: '#ffffff',
    labelVisible: true,
    logoVisible: true,
    customLogoUrl: null,
  });

  const updateContainerProps = (newProps) => {
    setContainerProps(prev => ({ ...prev, ...newProps }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a new FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        // Use the base64 data URL directly
        updateContainerProps({ customLogoUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleModelSelect = (modelType) => {
    // Reset container properties when model changes
    setContainerProps(prev => ({
      ...prev,
      scale: 1,
      rotation: [0, 0, 0],
      position: [0, 0, 0],
      customLogoUrl: null,
    }));
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: '#f0f0f0' }}
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
        
        <Suspense fallback={null}>
          <Container {...containerProps} />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>

      {/* Controls panel */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          maxWidth: '300px',
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem', 
          borderBottom: '1px solid #eee', 
          paddingBottom: '0.5rem' 
        }}>
          <h3 style={{ margin: 0 }}>Container Controls</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => handleModelSelect('container')}
              style={{
                padding: '0.25rem 0.75rem',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Container Properties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Scale Control */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Scale: {containerProps.scale.toFixed(1)}
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={containerProps.scale}
                onChange={(e) => updateContainerProps({ scale: parseFloat(e.target.value) })}
                style={{ width: '100%', marginTop: '0.25rem' }}
              />
            </label>
          </div>

          {/* Rotation Control */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Rotation: {Math.round(containerProps.rotation[1] * (180/Math.PI))}°
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.1"
                value={containerProps.rotation[1]}
                onChange={(e) => updateContainerProps({
                  rotation: [containerProps.rotation[0], parseFloat(e.target.value), containerProps.rotation[2]]
                })}
                style={{ width: '100%', marginTop: '0.25rem' }}
              />
            </label>
          </div>

          {/* Color Control */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Body Color
              <input
                type="color"
                value={containerProps.bodyColor}
                onChange={(e) => updateContainerProps({ bodyColor: e.target.value })}
                style={{ width: '100%', height: '30px', marginTop: '0.25rem' }}
              />
            </label>
          </div>

          {/* Visibility Controls */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            padding: '0.5rem',
            background: '#f8f9fa',
            borderRadius: '4px',
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={containerProps.labelVisible}
                onChange={(e) => updateContainerProps({ labelVisible: e.target.checked })}
              />
              Show Label
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={containerProps.logoVisible}
                onChange={(e) => updateContainerProps({ logoVisible: e.target.checked })}
              />
              Show Logo
            </label>
          </div>

          {/* Logo Upload */}
          <div style={{
            padding: '0.5rem',
            background: '#f8f9fa',
            borderRadius: '4px',
          }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ 
                  width: '100%', 
                  marginTop: '0.25rem',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: 'white',
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
} 