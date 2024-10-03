{
  "components": [
    {
      "type": "switch",
      "x": 50,
      "y": 100,
      "label": "SW1",
      "connections": [{ "type": "ground", "x": 50, "y": 120 }]
    },
    {
      "type": "wire",
      "x1": 50,
      "y1": 100,
      "x2": 150,
      "y2": 100
    },
    {
      "type": "switch",
      "x": 150,
      "y": 100,
      "label": "SW2",
      "connections": [{ "type": "ground", "x": 150, "y": 120 }]
    },
    {
      "type": "wire",
      "x1": 150,
      "y1": 100,
      "x2": 250,
      "y2": 100
    },
    {
      "type": "vertical_wire",
      "x1": 250,
      "y1": 100,
      "x2": 250,
      "y2": 200
    },
    {
      "type": "switch",
      "x": 250,
      "y": 150,
      "label": "SW3",
      "connections": [{ "type": "ground", "x": 250, "y": 170 }]
    },
    {
      "type": "down_arrow",
      "x": 250,
      "y": 200
    }
  ]
}

import React from 'react';

const CircuitDiagram = ({ data }) => {
  return (
    <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" style={{ border: '1px solid black' }}>
      {data.components.map((component, index) => {
        switch (component.type) {
          case 'switch':
            return (
              <g key={index}>
                {/* Switch as a rectangle */}
                <rect x={component.x} y={component.y - 10} width="20" height="20" fill="lightgray" stroke="black" />
                {/* Switch Label */}
                <text x={component.x} y={component.y - 15} fontSize="10">{component.label}</text>
                {/* Ground connection */}
                {component.connections.map((connection, idx) => (
                  <g key={idx}>
                    {/* Wire to ground */}
                    <line
                      x1={component.x + 10}
                      y1={component.y + 10}
                      x2={connection.x + 10}
                      y2={connection.y}
                      stroke="black"
                      strokeWidth="2"
                    />
                    {/* Ground symbol */}
                    <circle cx={connection.x + 10} cy={connection.y} r="5" stroke="black" fill="none" />
                    <line x1={connection.x + 5} y1={connection.y} x2={connection.x + 15} y2={connection.y} stroke="black" />
                  </g>
                ))}
              </g>
            );
          case 'wire':
            return (
              <line
                key={index}
                x1={component.x1}
                y1={component.y1}
                x2={component.x2}
                y2={component.y2}
                stroke="black"
                strokeWidth="2"
              />
            );
          case 'vertical_wire':
            return (
              <line
                key={index}
                x1={component.x1}
                y1={component.y1}
                x2={component.x2}
                y2={component.y2}
                stroke="black"
                strokeWidth="2"
              />
            );
          case 'down_arrow':
            return (
              <g key={index}>
                {/* Down arrow */}
                <line x1={component.x} y1={component.y} x2={component.x} y2={component.y + 20} stroke="black" strokeWidth="2" />
                <polygon points={`${component.x - 5},${component.y + 20} ${component.x + 5},${component.y + 20} ${component.x},${component.y + 30}`} fill="black" />
              </g>
            );
          default:
            return null;
        }
      })}
    </svg>
  );
};

const App = () => {
  const circuitData = {
    "components": [
      {
        "type": "switch",
        "x": 50,
        "y": 100,
        "label": "SW1",
        "connections": [{ "type": "ground", "x": 50, "y": 120 }]
      },
      {
        "type": "wire",
        "x1": 50,
        "y1": 100,
        "x2": 150,
        "y2": 100
      },
      {
        "type": "switch",
        "x": 150,
        "y": 100,
        "label": "SW2",
        "connections": [{ "type": "ground", "x": 150, "y": 120 }]
      },
      {
        "type": "wire",
        "x1": 150,
        "y1": 100,
        "x2": 250,
        "y2": 100
      },
      {
        "type": "vertical_wire",
        "x1": 250,
        "y1": 100,
        "x2": 250,
        "y2": 200
      },
      {
        "type": "switch",
        "x": 250,
        "y": 150,
        "label": "SW3",
        "connections": [{ "type": "ground", "x": 250, "y": 170 }]
      },
      {
        "type": "down_arrow",
        "x": 250,
        "y": 200
      }
    ]
  };

  return (
    <div>
      <h1>Circuit Diagram</h1>
      <CircuitDiagram data={circuitData} />
    </div>
  );
};

export default App;
