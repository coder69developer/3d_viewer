import React, { useState } from 'react'
import './App.css'
import { ModelViewer } from './components/ModelViewer'
import { ModelSelector } from './components/ModelSelector'

// Model configuration - you can expand this with actual model paths
const modelConfigs = {
  container: {
    path: '/3d_viewer/models/container.glb',
    name: 'Container',
    controls: {
      scale: { min: 0.1, max: 2, step: 0.1 },
      rotation: { min: 0, max: Math.PI * 2, step: 0.1 },
      bodyColor: '#ffffff',
      labelVisible: true,
      logoVisible: true,
    }
  },
  container2: {
    path: '/3d_viewer/models/container.glb', // Using same model for now
    name: 'Container Pro',
    controls: {
      scale: { min: 0.1, max: 2, step: 0.1 },
      rotation: { min: 0, max: Math.PI * 2, step: 0.1 },
      bodyColor: '#ffffff',
      labelVisible: true,
      logoVisible: true,
    }
  },
  container3: {
    path: '/3d_viewer/models/container.glb', // Using same model for now
    name: 'Container Deluxe',
    controls: {
      scale: { min: 0.1, max: 2, step: 0.1 },
      rotation: { min: 0, max: Math.PI * 2, step: 0.1 },
      bodyColor: '#ffffff',
      labelVisible: true,
      logoVisible: true,
    }
  }
};

function App() {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [showModelSelector, setShowModelSelector] = useState(true);

  const handleModelSelect = (modelId) => {
    setSelectedModelId(modelId);
    setShowModelSelector(false);
  };

  const handleBackToSelector = () => {
    setShowModelSelector(true);
    setSelectedModelId(null);
  };

  if (showModelSelector) {
    return <ModelSelector onModelSelect={handleModelSelect} />;
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ModelViewer 
        modelPath={modelConfigs[selectedModelId]?.path}
        modelConfig={modelConfigs[selectedModelId]}
        onBackToSelector={handleBackToSelector}
      />
    </div>
  )
}

export default App
