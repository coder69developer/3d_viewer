import React, { useState, useEffect, useRef } from 'react';
import './ControlsPanel.css';
import { Leva } from 'leva';

export function ControlsPanel({ 
  containerProps, 
  updateContainerProps, 
  handleLogoUpload, 
  handleLabelUpload, 
  handleModelSelect,
  captureScreenshot,
  screenshotData,
  openScreenshotInNewWindow,
  downloadScreenshot
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleExportClick = () => {
    if (!screenshotData) {
      // If no screenshot exists, capture one first
      captureScreenshot();
    } else {
      // Toggle dropdown if screenshot exists
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleDropdownOptionClick = (action) => {
    action();
    setIsDropdownOpen(false); // Close dropdown after action
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <div className="controls-panel">
      {/* Header */}
      <div className="controls-title-section">
          <h3>Container Controls</h3>
          <div className="controls-buttons">
            <button
              onClick={() => handleModelSelect('container')}
              className="btn-primary"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

      {/* Scrollable Content */}
      <div className="controls-content">
       

      {/* Screenshot Controls */}
      <div className="export-section">
        <h4>Export Options</h4>
        <div className="export-buttons" ref={dropdownRef}>
          <button
            onClick={handleExportClick}
            className="btn-export-main"
            title={screenshotData ? "Toggle export options" : "Capture current view of the 3D model"}
          >
            <span>📸 Export Model</span>
            <span className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </button>
          
          {screenshotData && isDropdownOpen && (
            <div className="export-dropdown">
              <button
                onClick={() => handleDropdownOptionClick(openScreenshotInNewWindow)}
                className="btn-export-option"
                title="Open screenshot in new window for printing or emailing"
              >
                🖨️ Print/Email View
              </button>
              <button
                onClick={() => handleDropdownOptionClick(downloadScreenshot)}
                className="btn-export-option"
                title="Download screenshot as PNG file"
              >
                💾 Download Image
              </button>
            </div>
          )}
        </div>
      </div>

              {/* Container Properties */}
        <div className="container-properties">
          {/* Scale Control */}
          <div>
            <label className="control-group">
              Scale: {containerProps.scale.toFixed(1)}
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={containerProps.scale}
                onChange={(e) => updateContainerProps({ scale: parseFloat(e.target.value) })}
              />
            </label>
          </div>

          {/* Rotation Control */}
          <div>
            <label className="control-group">
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
              />
            </label>
          </div>

          {/* Color Control */}
          <div>
            <label className="control-group">
              Body Color
              <input
                type="color"
                value={containerProps.bodyColor}
                onChange={(e) => updateContainerProps({ bodyColor: e.target.value })}
              />
            </label>
          </div>

          {/* Visibility Controls */}
          <div className="visibility-controls">
            <label>
              <input
                type="checkbox"
                checked={containerProps.labelVisible}
                onChange={(e) => updateContainerProps({ labelVisible: e.target.checked })}
              />
              Show Label
            </label>
            <label>
              <input
                type="checkbox"
                checked={containerProps.logoVisible}
                onChange={(e) => updateContainerProps({ logoVisible: e.target.checked })}
              />
              Show Logo
            </label>
          </div>

          {/* Logo Upload */}
          <div className="upload-section">
            <label>
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </label>
          </div>

          {/* Label Upload */}
          <div className="upload-section">
            <label>
              Upload Label
              <input
                type="file"
                accept="image/*"
                onChange={handleLabelUpload}
              />
            </label>
          </div>


          <Leva collapsed={true} />
        </div>
      </div>
    </div>
  );
} 