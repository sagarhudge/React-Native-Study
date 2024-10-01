{
  "components": [
    {
      "type": "bus",
      "start": { "x": 50, "y": 50 },
      "end": { "x": 450, "y": 50 },
      "label": "12K BUS SECT 2"
    },
    {
      "type": "isolator",
      "x": 100,
      "y": 100,
      "orientation": "horizontal",
      "label": "33KV BS 1 PT ISOLATING DISC"
    },
    {
      "type": "line",
      "start": { "x": 100, "y": 50 },
      "end": { "x": 100, "y": 200 }
    },
    {
      "type": "breaker",
      "x": 150,
      "y": 150,
      "label": "6KV BS 2 BREAKER SECT 2"
    },
    {
      "type": "ground",
      "x": 200,
      "y": 200
    },
    {
      "type": "text",
      "x": 50,
      "y": 250,
      "text": "TO DUMCPT"
    }
  ]
}

import React, { useState, useEffect } from 'react';

interface CircuitElement {
  type: string;
  x?: number;
  y?: number;
  start?: { x: number, y: number };
  end?: { x: number, y: number };
  label?: string;
  orientation?: string;
}

interface CircuitProps {
  data: { components: CircuitElement[] };
}

const Circuit: React.FC<CircuitProps> = ({ data }) => {

  const renderComponent = (component: CircuitElement, index: number) => {
    switch (component.type) {
      case 'bus':
        return (
          <g key={index}>
            <line
              x1={component.start?.x} y1={component.start?.y}
              x2={component.end?.x} y2={component.end?.y}
              stroke="black" strokeWidth="5"
            />
            <text x={component.start?.x} y={component.start?.y - 10} fontSize="12">{component.label}</text>
          </g>
        );
      case 'line':
        return (
          <line
            key={index}
            x1={component.start?.x} y1={component.start?.y}
            x2={component.end?.x} y2={component.end?.y}
            stroke="black" strokeWidth="2"
          />
        );
      case 'isolator':
        return (
          <g key={index}>
            <rect
              x={component.x} y={component.y}
              width="20" height="5" fill="black"
              transform={component.orientation === "vertical" ? "rotate(90)" : ""}
            />
            <text x={component.x! + 25} y={component.y! + 10} fontSize="10">{component.label}</text>
          </g>
        );
      case 'breaker':
        return (
          <g key={index}>
            <circle cx={component.x} cy={component.y} r="10" fill="none" stroke="black" strokeWidth="2" />
            <text x={component.x! + 20} y={component.y! + 5} fontSize="10">{component.label}</text>
          </g>
        );
      case 'ground':
        return (
          <g key={index}>
            <line x1={component.x} y1={component.y} x2={component.x} y2={component.y! + 20} stroke="black" strokeWidth="2" />
            <line x1={component.x! - 10} y1={component.y! + 20} x2={component.x! + 10} y2={component.y! + 20} stroke="black" strokeWidth="2" />
            <line x1={component.x! - 5} y1={component.y! + 25} x2={component.x! + 5} y2={component.y! + 25} stroke="black" strokeWidth="2" />
          </g>
        );
      case 'text':
        return (
          <text key={index} x={component.x} y={component.y} fontSize="12">{component.text}</text>
        );
      default:
        return null;
    }
  };

  return (
    <svg width="500" height="500" style={{ border: '1px solid black' }}>
      {data.components.map((component, index) => renderComponent(component, index))}
    </svg>
  );
};

export default Circuit;


import React from 'react';
import Circuit from './Circuit';

const App: React.FC = () => {
  const jsonData = {
    "components": [
      { "type": "bus", "start": { "x": 50, "y": 50 }, "end": { "x": 450, "y": 50 }, "label": "12K BUS SECT 2" },
      { "type": "isolator", "x": 100, "y": 100, "orientation": "horizontal", "label": "33KV BS 1 PT ISOLATING DISC" },
      { "type": "line", "start": { "x": 100, "y": 50 }, "end": { "x": 100, "y": 200 } },
      { "type": "breaker", "x": 150, "y": 150, "label": "6KV BS 2 BREAKER SECT 2" },
      { "type": "ground", "x": 200, "y": 200 },
      { "type": "text", "x": 50, "y": 250, "text": "TO DUMCPT" }
    ]
  };

  return (
    <div>
      <h1>Electrical Circuit Diagram</h1>
      <Circuit data={jsonData} />
    </div>
  );
};

export default App;
