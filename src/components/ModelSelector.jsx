import React from 'react';

export function ModelSelector({ models, selectedModel, onModelSelect }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      zIndex: 1000,
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '300px',
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Select Model</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelSelect(model.path)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: selectedModel === model.path ? '#e0e0e0' : 'white',
              cursor: 'pointer',
            }}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
} 