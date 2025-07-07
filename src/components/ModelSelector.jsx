import React from 'react';
import './ModelSelector.css';
import containerThumbnail from '../assets/container_thumbnail.png';
import bottleThumbnail from '../assets/bottle_thumbnail.png';
import sprayBottleThumbnail from '../assets/spary_bottle_thumbnail.png';

const availableModels = [
  {
    id: 'container',
    name: 'Container',
    description: 'Standard shipping container with customizable branding',
    thumbnail: containerThumbnail,
    category: 'Shipping'
  },
  {
    id: 'container2',
    name: 'Bottle',
    description: 'Premium container with advanced customization options',
    thumbnail: bottleThumbnail,
    category: 'Shipping'
  },
  {
    id: 'container3',
    name: 'Spray Bottle',
    description: 'Luxury container with premium features and materials',
    thumbnail: sprayBottleThumbnail,
    category: 'Shipping'
  }
];

export function ModelSelector({ onModelSelect }) {
  return (
    <div className="model-selector">
      <div className="selector-header">
        <h1>Choose Your 3D Model</h1>
        <p>Select a model to customize and view in 3D</p>
      </div>
      
      <div className="models-grid">
        {availableModels.map((model) => (
          <div 
            key={model.id}
            className="model-card"
            onClick={() => onModelSelect(model.id)}
          >
            <div className="model-thumbnail">
              <img 
                src={model.thumbnail} 
                alt={`${model.name} thumbnail`}
                className="model-thumbnail-image"
              />
            </div>
            <div className="model-info">
              <h3>{model.name}</h3>
              <p className="model-description">{model.description}</p>
              <span className="model-category">{model.category}</span>
            </div>
            <div className="model-select-button">
              <span>Select Model</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="selector-footer">
        <p>More models coming soon...</p>
      </div>
    </div>
  );
} 