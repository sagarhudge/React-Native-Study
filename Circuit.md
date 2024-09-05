Creating an interactive electric circuit diagram in React.js with JSON input involves building a structured representation of circuit components and rendering them dynamically based on the input data. Here's a step-by-step approach to achieve this:

### 1. Define JSON Structure
First, let's define a sample JSON structure that represents the circuit components:

```json
{
  "horizontalLines": [
    {
      "components": [
        {
          "type": "relay",
          "label": "Relay 1",
          "value": "16k"
        },
        {
          "type": "ground",
          "label": "GND 1"
        },
        {
          "type": "relay",
          "label": "Relay 2",
          "value": "16k"
        },
        {
          "type": "dot",
          "connections": [
            {
              "type": "verticalLine",
              "components": [
                {
                  "type": "relay",
                  "label": "Vertical Relay 1",
                  "value": "M"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "components": [/* Repeat as needed */]
    }
  ]
}
```

### 2. React Component Structure
To render the circuit, we'll create a React component that reads this JSON and dynamically renders SVG components.

#### Setup React Project
Ensure you have a React project set up. If not, you can create one using:

```bash
npx create-react-app circuit-diagram
cd circuit-diagram
npm install
```

#### Create Main Component
Create a `CircuitDiagram` component to parse the JSON and render the SVG elements.

```jsx
// CircuitDiagram.js
import React from 'react';

const CircuitDiagram = ({ data }) => {
  return (
    <svg width="800" height="600" style={{ border: '1px solid black' }}>
      {data.horizontalLines.map((line, lineIndex) => (
        <g key={`line-${lineIndex}`} transform={`translate(0, ${lineIndex * 100})`}>
          <line x1="10" y1="50" x2="700" y2="50" stroke="black" strokeWidth="2" />
          {line.components.map((component, index) => {
            switch (component.type) {
              case 'relay':
                return (
                  <g key={`component-${index}`} transform={`translate(${index * 150}, 0)`}>
                    <rect x="50" y="30" width="40" height="40" stroke="black" fill="transparent" />
                    <text x="70" y="25" textAnchor="middle">
                      {component.label}
                    </text>
                    <text x="70" y="90" textAnchor="middle">
                      {component.value}
                    </text>
                  </g>
                );
              case 'ground':
                return (
                  <g key={`component-${index}`} transform={`translate(${index * 150 + 50}, 0)`}>
                    <line x1="0" y1="70" x2="0" y2="90" stroke="black" strokeWidth="2" />
                    <polygon points="-10,90 10,90 0,100" fill="black" />
                    <text x="15" y="85" textAnchor="start">
                      {component.label}
                    </text>
                  </g>
                );
              case 'dot':
                return (
                  <g key={`component-${index}`} transform={`translate(${index * 150}, 0)`}>
                    <circle cx="70" cy="50" r="5" fill="black" />
                    <line x1="70" y1="55" x2="70" y2="90" stroke="black" strokeWidth="2" />
                    {component.connections.map((connection, connIndex) => (
                      <g key={`connection-${connIndex}`}>
                        {connection.components.map((connComponent, compIndex) => (
                          <rect
                            key={`conn-comp-${compIndex}`}
                            x="60"
                            y="100"
                            width="20"
                            height="20"
                            stroke="black"
                            fill="transparent"
                          />
                        ))}
                      </g>
                    ))}
                  </g>
                );
              default:
                return null;
            }
          })}
        </g>
      ))}
    </svg>
  );
};

export default CircuitDiagram;
```

#### Render the Component
In the main `App.js`, import and render the `CircuitDiagram` component with the JSON input.

```jsx
// App.js
import React from 'react';
import CircuitDiagram from './CircuitDiagram';
import circuitData from './circuitData.json'; // Create a JSON file with the structure defined above

const App = () => {
  return (
    <div className="App">
      <h1>Circuit Diagram</h1>
      <CircuitDiagram data={circuitData} />
    </div>
  );
};

export default App;
```

### 3. Styling and Layout Adjustments
You can adjust the sizes, spacing, and coordinates of the elements in the `CircuitDiagram` component to match your specific layout and styling needs.

### Final Notes
- **Flexibility**: The components' position can be adjusted to fit more complex circuit layouts.
- **SVG Icons**: For better visuals, consider using SVG icons specific to relays, grounds, and other circuit elements instead of simple shapes.
- **Validation**: Add validation in the component to handle unexpected JSON inputs gracefully.

This approach provides a dynamic way to visualize circuits in a React application based on JSON inputs, making it suitable for interactive and automated circuit rendering tasks.
