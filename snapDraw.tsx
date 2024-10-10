
//snapsvg-cjs.d.ts
declare module 'snapsvg-cjs' {
    export interface SnapOptions {
        // Add any specific options you want to type here
    }

    export interface Element {
        attr(attrs: { [key: string]: any }): this;
        transform(transformString: string): this;
        click(handler: () => void): this;
        // Add more methods as needed
    }

    export interface Snap {
        line(x1: number, y1: number, x2: number, y2: number): Element;
        rect(x: number, y: number, width: number, height: number): Element;
        circle(cx: number, cy: number, r: number): Element;
        path(d: string): Element;
        image(src: string, x: number, y: number, width: number, height: number): Element;
        text(x: number, y: number, text: string): Element;
        clear(): void;
        group(...elements: Element[]): Element;
        // Add more methods as needed
    }

    export function Snap(selector: string | HTMLElement, options?: SnapOptions): Snap;
}


//tsconfig
{
    "compilerOptions": {
        "strict": true,
        // other options...
    },
    "include": [
        "src/**/*",
        "path/to/snapsvg-cjs.d.ts"  // Adjust the path accordingly
    ]
}

 //main   

import React, { useEffect, useRef } from 'react';
import Snap from 'snapsvg-cjs';
import ground from './ground.svg';
import openSwitch from './openSwitch.svg';
import curve from './curve.svg';
import camera from './camera.svg';

// Define the types for circuit elements
interface CircuitElement {
    type: string;
    orientation?: string;
    x: number;
    y: number;
    length: number;
    visible: boolean;
    content?: string; // Only applicable for text elements
}

// JSON input for the circuit diagram
const circuitData = {
    elements: [
        { type: "busbar", orientation: "horizontal", x: 150, y: 100, length: 60, visible: true },
        { type: "busbar", orientation: "horizontal", x: 240, y: 100, length: 60, visible: true },
        { type: "camera", x: 210, y: 83, length: 35, visible: true },
        { type: "openSwitch", x: 275, y: 96, orientation: "right", length: 50, visible: true },
        { type: "ground", x: 240, y: 100, orientation: "left", length: 50, visible: true },
        { type: "busbar", orientation: "vertical", x: 300, y: 143, length: 50, visible: true },
        { type: "text", x: 283, y: 210, content: "1200", visible: true },
        { type: "busbar", orientation: "vertical", x: 300, y: 215, length: 200, visible: true },
        { type: "busbar", orientation: "horizontal", x: 300, y: 265, length: -100, visible: true },
        { type: "busbar", orientation: "vertical", x: 200, y: 334, length: -70, visible: true },
        { type: "curve", x: 125, y: 314, length: 150, visible: true },
        { type: "halfcurve", x: 285, y: 430, length: 30, visible: true },
        // Uncomment for additional circuit elements
        // { type: "busbar", orientation: "horizontal", x: 350, y: 100, length: 200, visible: true },
        // { type: "camera", x: 425, y: 85, length: 30, visible: true },
        // { type: "openSwitch", x: 525, y: 96, orientation: "right", length: 50, visible: true },
        // { type: "ground", x: 490, y: 100, orientation: "left", length: 50, visible: true },
        // { type: "busbar", orientation: "vertical", x: 550, y: 143, length: 50, visible: true },
        // { type: "text", x: 533, y: 210, content: "1200", visible: true },
        // { type: "busbar", orientation: "vertical", x: 550, y: 215, length: 200, visible: true },
        // { type: "busbar", orientation: "horizontal", x: 550, y: 265, length: -100, visible: true },
        // { type: "busbar", orientation: "vertical", x: 450, y: 334, length: -70, visible: true },
        // { type: "curve", x: 375, y: 314, length: 150, visible: true },
        // { type: "halfcurve", x: 535, y: 430, length: 30, visible: true },
    ]
};

const CircuitDiagramSnap: React.FC = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const s = Snap(svgRef.current);

        const drawElement = (element: CircuitElement) => {
            if (!element.visible) return;

            switch (element.type) {
                case "busbar":
                    drawBusbar(element);
                    break;
                case "camera":
                    drawImage(camera, element);
                    break;
                case "openSwitch":
                    drawImage(openSwitch, element);
                    break;
                case "ground":
                    drawImage(ground, element);
                    break;
                case "text":
                    drawText(element);
                    break;
                case "curve":
                    drawCurve(element);
                    break;
                case "halfcurve":
                    drawHalfCurve(element);
                    break;
                default:
                    break;
            }
        };

        const drawBusbar = ({ orientation, x, y, length }: CircuitElement) => {
            const line = orientation === "horizontal"
                ? s.line(x, y, x + length, y)
                : s.line(x, y, x, y + length);
            line.attr({ stroke: "#000", strokeWidth: 1.5 });
        };

        const drawImage = (imgSrc: string, { x, y, length, orientation }: CircuitElement) => {
            const image = s.image(imgSrc, x, y, length, length);
            applyRotation(image, x, y, length, orientation);
            if (imgSrc === camera) {
                image.click(() => alert('Camera clicked!'));
            }
        };

        const drawHalfCurve = ({ x, y, length }: CircuitElement) => {
            const halfCurvePath = `M${x},${y} Q${x + length / 2},${y - length} ${x + length},${y}`;
            s.path(halfCurvePath).attr({ stroke: "#000", strokeWidth: 2, fill: "none" });
        };

        const drawCurve = ({ x, y, length }: CircuitElement) => {
            const curveImage = s.image(curve, x, y, length, length);
            applyRotation(curveImage, x, y, length);
        };

        const drawText = ({ x, y, content }: CircuitElement) => {
            const textElement = s.text(x, y, content).attr({ fontSize: "14px", fill: "#000" });
            const bbox = textElement.getBBox();
            const border = s.rect(bbox.x - 2, bbox.y - 2, bbox.width + 4, bbox.height + 4)
                .attr({ fill: "none", stroke: "#000", strokeWidth: 1 });
            s.group(border, textElement);
        };

        const applyRotation = (element: any, x: number, y: number, length: number, orientation: string = '') => {
            const centerX = x + length / 2;
            const centerY = y + length / 2;
            const rotations: { [key: string]: string } = {
                left: `rotate(90, ${centerX}, ${centerY})`,
                right: `rotate(-90, ${centerX}, ${centerY})`,
                down: `rotate(180, ${centerX}, ${centerY})`,
            };
            if (orientation in rotations) {
                element.transform(rotations[orientation]);
            }
        };

        const DottedBox = ({ x, y, width, height }: { x: number; y: number; width: number; height: number; }) => {
            const sections = [0, height / 2];
            sections.forEach(section => {
                s.rect(x, y + section, width, height / 2).attr({
                    fill: "none",
                    stroke: "green",
                    strokeWidth: 1,
                    strokeDasharray: "5,5",
                });
            });
        };

        // Clear the SVG before drawing to avoid duplicate elements
        s.clear();

        // Draw elements from JSON input
        circuitData.elements.forEach(drawElement);
        DottedBox({ x: 150, y: 80, width: 200, height: 290 });
        DottedBox({ x: 380, y: 80, width: 200, height: 290 });

    }, []);

    return (
        <svg ref={svgRef} width="98%" height="600" style={{ border: "1px solid black" }} />
    );
};

export default CircuitDiagramSnap;
