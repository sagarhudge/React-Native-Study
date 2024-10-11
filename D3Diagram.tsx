import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';

// Define the structure of an element
interface CircuitElement {
    type: string;
    orientation?: string;
    x: number;
    y: number;
    length?: number; // Make length optional
    visible: boolean;
    content?: string; // Only for text elements
    row1Height?: number; // Only for dotBox
    row2Height?: number; // Only for dotBox
    width?: number; // Only for dotBox
}

// Define the structure of a circuit structure
interface CircuitStructure {
    id: number;
    elements: CircuitElement[];
}

// JSON input for the circuit diagram
const circuitData: { structures: CircuitStructure[] } = {
    structures: [
        {
            id: 1,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 90, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                { type: "dotBox", x: 180, y: 55, row1Height: 130, row2Height: 190, width: 150, visible: true },
            ]
        },
        {
            id: 2,
            elements: [
                { type: "busbar", orientation: "horizontal", x: 180, y: 100, length: 60, visible: true },
                { type: "camera", x: 240, y: 88, length: 25, visible: true },
                { type: "busbar", orientation: "horizontal", x: 265, y: 100, length: 90, visible: true },
                { type: "openSwitch", x: 280, y: 96, orientation: "right", length: 50, visible: true },
                { type: "ground", x: 260, y: 110, orientation: "left", length: 30, visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 143, length: 50, visible: true },
                { type: "text", x: 290, y: 210, content: "1200", visible: true },
                { type: "busbar", orientation: "vertical", x: 305, y: 215, length: 200, visible: true },
                { type: "busbar", orientation: "horizontal", x: 305, y: 265, length: -70, visible: true },
                { type: "busbar", orientation: "vertical", x: 235, y: 334, length: -70, visible: true },
                { type: "curve", x: 160, y: 314, length: 150, visible: true },
                { type: "halfcurve", x: 290, y: 430, length: 30, visible: true },
                { type: "dotBox", x: 180, y: 55, row1Height: 130, row2Height: 190, width: 150, visible: true },
            ]
        }
    ]
};

const CircuitDiagramD3: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear the SVG before drawing

        const drawElement = (element: CircuitElement, offsetX: number) => {
            if (!element.visible) return;

            switch (element.type) {
                case "busbar":
                    drawBusbar(element, offsetX);
                    break;
                case "camera":
                    drawImage(camera, element, offsetX);
                    break;
                case "openSwitch":
                    drawImage(openSwitch, element, offsetX);
                    break;
                case "ground":
                    drawImage(ground, element, offsetX);
                    break;
                case "text":
                    drawText(element, offsetX);
                    break;
                case "curve":
                    drawCurve(element, offsetX);
                    break;
                case "halfcurve":
                    drawHalfCurve(element, offsetX);
                    break;
                case "dotBox":
                    drawDottedBox(element, offsetX);
                    break;
                default:
                    break;
            }
        };

        const drawBusbar = ({ orientation, x, y, length }: CircuitElement, offsetX: number) => {
            const line = svg.append('line')
                .attr('x1', x + offsetX)
                .attr('y1', y)
                .attr('x2', orientation === "horizontal" ? x + (length ?? 0) + offsetX : x + offsetX)
                .attr('y2', orientation === "horizontal" ? y : y + (length ?? 0))
                .attr('stroke', '#000')
                .attr('stroke-width', 1.5)
                .on('click', () => handleElementClick({ type: 'busbar', x: x + offsetX, y, length, visible: true }));

            line.raise(); // Bring line to front
        };

        const drawImage = (imgSrc: string, { x, y, length, orientation }: CircuitElement, offsetX: number) => {
            const image = svg.append('image')
                .attr('href', imgSrc)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length ?? 25) // Default width if length is undefined
                .attr('height', length ?? 25) // Default height if length is undefined
                .on('click', () => handleElementClick({ type: imgSrc, x: x + offsetX, y, length, visible: true }));

            applyRotation(image, x + offsetX, y, length ?? 25, orientation); // Default to 25 if length is undefined
            image.raise(); // Bring image to front
        };

        const drawHalfCurve = ({ x, y, length }: CircuitElement, offsetX: number) => {
            const halfCurvePath = `M${x + offsetX},${y} Q${x + (length ?? 30) / 2 + offsetX},${y - (length ?? 30)} ${x + (length ?? 30) + offsetX},${y}`;
            const path = svg.append('path')
                .attr('d', halfCurvePath)
                .attr('stroke', '#000')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .on('click', () => handleElementClick({ type: 'halfcurve', x: x + offsetX, y, length, visible: true }));

            path.raise(); // Bring path to front
        };

        const drawCurve = ({ x, y, length }: CircuitElement, offsetX: number) => {
            const curveImage = svg.append('image')
                .attr('href', curve)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length ?? 25) // Default width if length is undefined
                .attr('height', length ?? 25) // Default height if length is undefined
                .on('click', () => handleElementClick({ type: 'curve', x: x + offsetX, y, length, visible: true }));

            curveImage.raise(); // Bring image to front
        };

        const drawText = ({ x, y, content }: CircuitElement, offsetX: number) => {
            const textElement = svg.append('text')
                .text(content)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('fill', 'black')
                .on('click', () => handleElementClick({ type: 'text', x: x + offsetX, y, length: 0, visible: true })); // Length can be set to 0 for text

            // Adjust the position of the text based on its bounding box
            const bbox = textElement.node()?.getBBox();
            const padding = 5;

            textElement
                .attr('x', x + offsetX - (bbox?.width ?? 0) / 2)
                .attr('y', y + (bbox?.height ?? 0) + padding)
                .on('click', () => handleElementClick({ type: 'text', x: x + offsetX, y, length: bbox?.width ?? 0, visible: true }));

            textElement.raise(); // Bring text to front
        };

        const drawDottedBox = ({ x, y, row1Height = 50, row2Height = 50, width = 100 }: CircuitElement, offsetX: number) => {
            const rect1 = svg.append('rect')
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', width)
                .attr('height', row1Height)
                .attr('stroke', 'green')
                .attr('fill', 'none')
                .attr('stroke-dasharray', '5,5');

            const rect2 = svg.append('rect')
                .attr('x', x + offsetX)
                .attr('y', y + row1Height)
                .attr('width', width)
                .attr('height', row2Height)
                .attr('stroke', 'green')
                .attr('fill', 'none')
                .attr('stroke-dasharray', '5,5');

            rect1.raise(); // Bring rectangle to front
            rect2.raise(); // Bring rectangle to front
        };

        const handleElementClick = (element: CircuitElement) => {
            // Handle element click event
            console.log('Element clicked:', element);
            alert(`Clicked on: ${JSON.stringify(element)}`);
        };

        const applyRotation = (element: any, x: number, y: number, length: number, orientation?: string) => {
            if (orientation) {
                const rotation = orientation === 'right' ? 90 : orientation === 'left' ? -90 : orientation === 'up' ? 180 : 0;
                element.attr('transform', `translate(${x},${y}) rotate(${rotation})`);
            }
        };

        circuitData.structures.forEach((structure) => {
            structure.elements.forEach((element) => drawElement(element, structure.id * 200));
        });
    }, []);

    return (
        <svg ref={svgRef} width="800" height="600" style={{ border: '1px solid black' }} />
    );
};

export default CircuitDiagramD3;
