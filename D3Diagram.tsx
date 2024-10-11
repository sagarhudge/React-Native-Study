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
    length: number;
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
                .attr('x2', orientation === "horizontal" ? x + length + offsetX : x + offsetX)
                .attr('y2', orientation === "horizontal" ? y : y + length)
                .attr('stroke', '#000')
                .attr('stroke-width', 1.5)
                .on('click', () => handleElementClick({ type: 'busbar', x: x + offsetX, y }));

            line.raise(); // Bring line to front
        };

        const drawImage = (imgSrc: string, { x, y, length, orientation }: CircuitElement, offsetX: number) => {
            const image = svg.append('image')
                .attr('href', imgSrc)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length)
                .on('click', () => handleElementClick({ type: imgSrc, x: x + offsetX, y }));

            applyRotation(image, x + offsetX, y, length, orientation);
            image.raise(); // Bring image to front
        };

        const drawHalfCurve = ({ x, y, length }: CircuitElement, offsetX: number) => {
            const halfCurvePath = `M${x + offsetX},${y} Q${x + length / 2 + offsetX},${y - length} ${x + length + offsetX},${y}`;
            const path = svg.append('path')
                .attr('d', halfCurvePath)
                .attr('stroke', '#000')
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .on('click', () => handleElementClick({ type: 'halfcurve', x: x + offsetX, y }));

            path.raise(); // Bring path to front
        };

        const drawCurve = ({ x, y, length }: CircuitElement, offsetX: number) => {
            const curveImage = svg.append('image')
                .attr('href', curve)
                .attr('x', x + offsetX)
                .attr('y', y)
                .attr('width', length)
                .attr('height', length)
                .on('click', () => handleElementClick({ type: 'curve', x: x + offsetX, y }));

            curveImage.raise(); // Bring image to front
        };

        const drawText = ({ x, y, content }: CircuitElement, offsetX: number) => {
            // Create a text element
            const textElement = svg.append('text')
                .attr('x', x + offsetX)
                .attr('y', y)
                .text(content)
                .attr('font-size', '14px')
                .attr('fill', '#000');

            // Get the bounding box of the text
            const bbox = textElement.node()?.getBBox();

            if (bbox) {
                // Create a rectangle behind the text for the border
                svg.append('rect')
                    .attr('x', bbox.x - 2) // Adding some padding
                    .attr('y', bbox.y - 2) // Adding some padding
                    .attr('width', bbox.width + 4) // Adding some padding
                    .attr('height', bbox.height + 4) // Adding some padding
                    .attr('fill', 'none')
                    .attr('stroke', '#000')
                    .attr('stroke-width', 1);

                textElement.raise(); // Bring text to front
            }
        };

        const drawDottedBox = ({ x, y, row1Height, row2Height, width }: CircuitElement, offsetX: number) => {
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
