import React from "react";

const ElectricCircuitDiagram = ({ data }) => {
  const renderBlock = (block, index) => {
    return (
      <g key={index} className="lock" style={{ strokeDasharray: "5,5" }}>
        {block.steps.map((step, idx) => renderStep(step, idx))}
      </g>
    );
  };

  const renderStep = (step, index) => {
    switch (step.type) {
      case "bezierCurve":
        return (
          <path
            key={index}
            d={step.direction === "left" 
              ? `M${step.x},${step.y} Q${step.x - 10},${step.y - 10} ${step.x + 20},${step.y}`
              : `M${step.x},${step.y} Q${step.x + 10},${step.y + 10} ${step.x + 20},${step.y}`}
            stroke="black"
            fill="transparent"
          />
        );
      case "horizontalWire":
        return (
          <line
            key={index}
            x1={step.x}
            y1={step.y}
            x2={step.x + step.length}
            y2={step.y}
            stroke="black"
          />
        );
      case "verticalWire":
        return (
          <line
            key={index}
            x1={step.x}
            y1={step.y}
            x2={step.x}
            y2={step.y + step.length}
            stroke="black"
          />
        );
      case "openSwitch":
        return (
          <g key={index}>
            <line x1={step.x} y1={step.y} x2={step.x + 20} y2={step.y} stroke="black" />
            <circle cx={step.x} cy={step.y} r="3" fill="black" />
            {step.ground === "left" && (
              <line x1={step.x - 10} y1={step.y} x2={step.x - 10} y2={step.y + 20} stroke="black" />
            )}
          </g>
        );
      case "textBox":
        return (
          <g key={index}>
            <rect
              x={step.x}
              y={step.y}
              width="40"
              height="20"
              stroke="black"
              fill="none"
            />
            <text x={step.x + 5} y={step.y + 15} fontSize="10">{step.value}</text>
          </g>
        );
      case "wireToComponent":
        return (
          <g key={index}>
            <line x1={step.x} y1={step.y} x2={step.x} y2={step.y + step.length} stroke="black" />
            <rect x={step.x - 5} y={step.y + step.length} width="10" height="20" stroke="black" fill="none" />
          </g>
        );
      case "groundConnection":
        return (
          <line
            key={index}
            x1={step.x}
            y1={step.y}
            x2={step.x}
            y2={step.y + step.length}
            stroke="black"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg width="500" height="500">
      {data.blocks.map((block, index) => renderBlock(block, index))}
    </svg>
  );
};

export default ElectricCircuitDiagram;


{
  "blocks": [
    {
      "type": "lock",
      "steps": [
        {"type": "bezierCurve", "x": 10, "y": 20, "direction": "left"},
        {"type": "horizontalWire", "x": 50, "y": 20, "length": 50},
        {"type": "bezierCurve", "x": 100, "y": 20, "direction": "right"},
        {"type": "verticalWire", "x": 150, "y": 20, "length": 80},
        {"type": "openSwitch", "x": 150, "y": 100, "ground": "left"},
        {"type": "textBox", "x": 140, "y": 130, "value": "1200"},
        {"type": "wireToComponent", "x": 140, "y": 150, "length": 30, "component": "nonPolarCapacitor", "orientation": "verticalDown"},
        {"type": "groundConnection", "x": 140, "y": 180, "length": 30}
      ]
    }
  ]
}
