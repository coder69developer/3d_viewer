import React from 'react';
import './CameraControls.css';

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

export function CameraControls({ 
  showPositionIndicator, 
  onTogglePositionIndicator,
  cameraInfo = { currentPreset: 'isometric', isTransitioning: false, cameraDistance: 10 }
}) {
  const { currentPreset, isTransitioning, cameraDistance } = cameraInfo;

  // Transition to a camera preset
  const transitionToPreset = (presetKey) => {
    if (window.transitionToPreset) {
      window.transitionToPreset(presetKey);
    }
  };

  // Zoom camera in/out
  const zoomCamera = (direction) => {
    if (window.zoomCamera) {
      window.zoomCamera(direction);
    }
  };

  // Reset camera to default position
  const resetCamera = () => {
    if (window.resetCamera) {
      window.resetCamera();
    }
  };

  return (
    <div className="camera-controls">
      <div className="camera-controls-header">
        <h4>📷 Camera Controls</h4>
        <button 
          onClick={resetCamera}
          className="camera-reset-btn"
          title="Reset to default view"
        >
          🔄 Reset
        </button>
      </div>

      {/* Camera Presets */}
      <div className="camera-presets">
        <h5>Quick Views</h5>
        <div className="preset-grid">
          {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => transitionToPreset(key)}
              className={`preset-btn ${currentPreset === key ? 'active' : ''}`}
              title={preset.name}
            >
              {getPresetIcon(key)}
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <h5>Zoom</h5>
        <div className="zoom-buttons">
          <button
            onClick={() => zoomCamera('in')}
            className="zoom-btn"
            title="Zoom In"
            disabled={isTransitioning}
          >
            🔍+
          </button>
          <span className="zoom-distance">{cameraDistance.toFixed(1)}m</span>
          <button
            onClick={() => zoomCamera('out')}
            className="zoom-btn"
            title="Zoom Out"
            disabled={isTransitioning}
          >
            🔍-
          </button>
        </div>
      </div>

      {/* Camera Info */}
      <div className="camera-info">
        <div className="info-item">
          <span className="info-label">Current View:</span>
          <span className="info-value">{CAMERA_PRESETS[currentPreset]?.name || 'Custom'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Distance:</span>
          <span className="info-value">{cameraDistance.toFixed(1)}m</span>
        </div>
        {isTransitioning && (
          <div className="transition-indicator">
            <span>🔄 Transitioning...</span>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <div className="camera-advanced-options">
        <h5>🔧 Advanced Options</h5>
        <div className="advanced-option">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showPositionIndicator}
              onChange={onTogglePositionIndicator}
            />
            <span className="toggle-text">Show Camera Position</span>
          </label>
          <span className="toggle-description">Display real-time camera coordinates</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="camera-instructions">
        <h5>💡 How to Use</h5>
        <ul>
          <li><strong>Mouse:</strong> Drag to rotate, scroll to zoom</li>
          <li><strong>Touch:</strong> Swipe to rotate, pinch to zoom</li>
          <li><strong>Quick Views:</strong> Click preset buttons for instant positioning</li>
          <li><strong>Reset:</strong> Return to default isometric view</li>
        </ul>
      </div>
    </div>
  );
}

// Helper function to get icons for preset views
function getPresetIcon(presetKey) {
  const icons = {
    front: '⬆️',
    back: '⬇️',
    left: '⬅️',
    right: '➡️',
    top: '⬆️',
    bottom: '⬇️',
    isometric: '🔲',
    closeup: '🔍'
  };
  return icons[presetKey] || '📷';
} 