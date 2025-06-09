import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ModelViewer } from './components/ModelViewer'
import { ModelSelector } from './components/ModelSelector'

// Sample models - replace these with your actual model paths
const models = [
  {
    id: '1',
    name: 'Model 1',
    path: '/models/container.glb', // Replace with your actual model path
  },
  {
    id: '2',
    name: 'Model 2',
    path: '/models/container2.glb', // Replace with your actual model path
  },
  {
    id: '3',
    name: 'Model 3',
    path: '/models/container3.glb', // Replace with your actual model path
  },
];

function App() {
  const [selectedModel, setSelectedModel] = useState(models[0].path);
  const [logoUrl, setLogoUrl] = useState(undefined);

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <ModelViewer modelPath={selectedModel} logoUrl={logoUrl} />
    </div>
  )
}

export default App
