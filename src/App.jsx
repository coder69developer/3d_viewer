import React, { useState } from 'react'
import './App.css'
import { ModelViewer } from './components/ModelViewer'
import { ModelSelector } from './components/ModelSelector'

// Model configuration - you can expand this with actual model paths
const modelConfigs = {
  container: {
    path: 'container',
    name: 'Container',
  },
  container2: {
    path: 'container', // Using same model for now
    name: 'Container Pro',
  },
  container3: {
    path: 'bottle', // Using same model for now
    name: 'Spray Bottle',
  }
};

function App() {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [showModelSelector, setShowModelSelector] = useState(true);

  const handleModelSelect = (modelId) => {
    console.log("Selected model ID:", modelId);
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
