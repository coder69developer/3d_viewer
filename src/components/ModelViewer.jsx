import React, { useState, useRef } from 'react';
import { Scene3D } from './Scene3D';
import { ControlsPanel } from './ControlsPanel';
import './ModelViewer.css';



export function ModelViewer({ modelPath, modelConfig, onBackToSelector }) {
  const [containerProps, setContainerProps] = useState({
    scale: 1,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    bodyColor: '#ffffff',
    labelVisible: true,
    logoVisible: true,
    customLogoUrl: null,
    customLabelUrl: null,
  });

  const [screenshotData, setScreenshotData] = useState(null);
  const screenshotRef = useRef();

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

  const handleLabelUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a new FileReader
      const reader = new FileReader();
      reader.onload = (e) => {
        // Use the base64 data URL directly
        updateContainerProps({ customLabelUrl: e.target.result });
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
      customLabelUrl: null,
    }));
  };

  const captureScreenshot = () => {
    if (screenshotRef.current) {
      screenshotRef.current.capture();
    }
  };

  const handleScreenshotCapture = (dataURL) => {
    setScreenshotData(dataURL);
  };

  const downloadScreenshot = () => {
    if (screenshotData) {
      const link = document.createElement('a');
      link.download = '3d-model-screenshot.png';
      link.href = screenshotData;
      link.click();
    }
  };

  const openScreenshotInNewWindow = () => {
    if (screenshotData) {
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
            <title>3D Model Screenshot</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
                background: #f5f5f5;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .screenshot {
                width: 100%;
                max-width: 100%;
                height: auto;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .controls {
                margin-top: 20px;
                text-align: center;
              }
              .btn {
                padding: 10px 20px;
                margin: 0 10px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
              }
              .btn:hover {
                background: #0056b3;
              }
              .btn-secondary {
                background: #6c757d;
              }
              .btn-secondary:hover {
                background: #545b62;
              }
              .model-info {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 4px;
                border-left: 4px solid #007bff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>3D Model Screenshot</h1>
              <div class="model-info">
                <h3>Model Specifications:</h3>
                <p><strong>Scale:</strong> ${containerProps.scale.toFixed(1)}x</p>
                <p><strong>Rotation:</strong> ${Math.round(containerProps.rotation[1] * (180/Math.PI))}°</p>
                <p><strong>Body Color:</strong> <span style="color: ${containerProps.bodyColor}">${containerProps.bodyColor}</span></p>
                <p><strong>Label Visible:</strong> ${containerProps.labelVisible ? 'Yes' : 'No'}</p>
                <p><strong>Logo Visible:</strong> ${containerProps.logoVisible ? 'Yes' : 'No'}</p>
                <p><strong>Custom Logo:</strong> ${containerProps.customLogoUrl ? 'Yes' : 'No'}</p>
                <p><strong>Custom Label:</strong> ${containerProps.customLabelUrl ? 'Yes' : 'No'}</p>
              </div>
              <img src="${screenshotData}" alt="3D Model Screenshot" class="screenshot" />
              <div class="controls">
                <button class="btn" onclick="window.print()">Print</button>
                <a href="mailto:?subject=3D Model Reference&body=Please find attached the 3D model screenshot for your reference." class="btn btn-secondary">Email</a>
                <a href="${screenshotData}" download="3d-model-screenshot.png" class="btn btn-secondary">Download</a>
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="model-viewer">
      {/* Header */}
      <div className="app-header">
        <div className="header-left">
          <button 
            onClick={onBackToSelector}
            className="back-button"
            title="Back to Model Selection"
          >
            ← Back
          </button>
          <h1>{modelConfig?.name || '3D Model Viewer'}</h1>
        </div>
        <div className="header-info">
          <span>Custom Container Designer</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Scene3D 
          containerProps={containerProps}
          screenshotRef={screenshotRef}
          onScreenshotCapture={handleScreenshotCapture}
        />
        
        <ControlsPanel
          containerProps={containerProps}
          updateContainerProps={updateContainerProps}
          handleLogoUpload={handleLogoUpload}
          handleLabelUpload={handleLabelUpload}
          handleModelSelect={handleModelSelect}
          captureScreenshot={captureScreenshot}
          screenshotData={screenshotData}
          openScreenshotInNewWindow={openScreenshotInNewWindow}
          downloadScreenshot={downloadScreenshot}
        />
      </div>
    </div>
  );
} 