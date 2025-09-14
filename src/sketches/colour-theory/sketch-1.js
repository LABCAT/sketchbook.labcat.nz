import p5 from "p5";
import "@lib/p5.Polar.min.js";
import '@lib/p5.polygon.js';
import '@lib/sacredGeometry.js';
import {
  createShapeSelector,
  createRegenerateButton,
  updatePatternDisplay,
  setStrokeWeight,
  mousePressed,
  windowResized,
  isPortraitCanvas
} from './shared.js';

const sketch = (p) => {

  /**
   * Current shape type being used for drawing
   * @type {string}
   */
  p.currentShapeType = '';

  /**
   * Array of available polar shape types
   * @type {string[]}
   */
  p.shapeTypes = [
    'polarEllipse',
    'polarTriangle',
    'polarSquare',
    'polarPentagon',
    'polarHexagon',
    'polarHeptagon',
    'polarOctagon'
  ];

  /**
   * Current pattern function being used
   * @type {string}
   */
  p.currentPattern = '';

  /**
   * Array of available pattern drawing functions
   * @type {string[]}
   */
  p.patternFunctions = [
    'drawVesicaPiscis',
    'drawSeedOfLife',
    'drawEggOfLife',
    'drawFlowerOfLife'
  ];

  /**
   * Initializes the canvas and sets up the sketch
   */
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    p.noFill();
    setStrokeWeight(p);
    p.baseHue = p.random(360);
    p.complementaryHue = (p.baseHue + 180) % 360;
    p.currentShapeType = p.random(p.shapeTypes.filter(shape => shape !== p.currentShapeType));
    p.currentPattern = p.random(p.patternFunctions.filter(pattern => pattern !== p.currentPattern));
    createShapeSelector(p, p.currentShapeType);
    createRegenerateButton(p);
  };

  /**
   * Main drawing function that renders the sketch
   */
  p.draw = () => {
    const isPortrait = isPortraitCanvas(p);
    
    if (isPortrait) {
      const cellHeight = p.height / 2;
      p.drawCell(p.baseHue, p.complementaryHue, 0, 0, p.width, cellHeight);
      p.drawCell(p.complementaryHue, p.baseHue, 0, cellHeight, p.width, cellHeight);
    } else {
      const cellWidth = p.width / 2;
      p.drawCell(p.baseHue, p.complementaryHue, 0, 0, cellWidth, p.height);
      p.drawCell(p.complementaryHue, p.baseHue, cellWidth, 0, cellWidth, p.height);
    }
  };

  /**
   * Draws a single cell with background color and vesica piscis pattern
   * @param {number} bgHue - Background hue value
   * @param {number} strokeHue - Stroke hue value
   * @param {number} x - X position of the cell
   * @param {number} y - Y position of the cell
   * @param {number} w - Width of the cell
   * @param {number} h - Height of the cell
   */
  p.drawCell = (bgHue, strokeHue, x, y, w, h) => {
    const size = p.min(w, h) * 0.4;
    p.push();
    p.translate(x, y);
    p.fill(bgHue, 100, 100);
    p.noStroke();
    p.rect(0, 0, w, h);
    p.noFill();
    p.setCenter(w / 2, h / 2);
    p.stroke(strokeHue, 100, 100);
     p[p.currentPattern](p.currentShapeType, size);
    p.pop();
  };

  // Set up event handlers using shared functions
  p.mousePressed = () => mousePressed(p);
  p.windowResized = () => windowResized(p);
};

new p5(sketch);