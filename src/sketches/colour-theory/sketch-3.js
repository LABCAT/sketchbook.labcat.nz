import p5 from "p5";
import "@lib/p5.Polar.min.js";
import '@lib/p5.polygon.js';
import '@lib/sacredGeometry.js';
import {
  setStrokeWeight,
  windowResized,
} from './shared.js';

const sketch = (p) => {
  /**
   * Current shape type being used for drawing
   * @type {string}
   */
  p.currentShapeType = '';

  /**
   * Animation progress from 0 to 1
   * @type {number}
   */
  p.animationProgress = 0;

  /**
   * Animation duration in milliseconds
   * @type {number}
   */
  p.animationDuration = 500;

  /**
   * Auto regeneration interval in milliseconds
   * @type {number}
   */
  p.autoRegenInterval = 2000;

  /**
   * Time when last regeneration occurred
   * @type {number}
   */
  p.lastRegenTime = 0;

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
   * Current pattern set containing different patterns for each cell
   * @type {string[]}
   */
  p.currentPatternSet = [];

  /**
   * Current shape set containing different shapes for each cell
   * @type {string[]}
   */
  p.currentShapeSet = [];

  /**
   * Array of available pattern drawing functions
   * @type {string[]}
   */
  p.patternFunctions = [
    'drawVesicaPiscis',
    'drawSeedOfLife',
    'drawEggOfLife',
    'drawFlowerOfLife',
    'drawFruitOfLife',
    'drawMetatronsCube',
    'drawTreeOfLife'
  ];


  /**
   * Initializes the canvas and sets up the sketch
   */
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    setStrokeWeight(p);
    
    p.initializeRandomValues();
    p.createRegenerateButton();
  };

  /**
   * Generates unique pattern and shape sets with no duplicates
   */
  p.generateUniquePatternSet = () => {
    const shuffledPatterns = [...p.patternFunctions].sort(() => Math.random() - 0.5);
    const shuffledShapes = [...p.shapeTypes].sort(() => Math.random() - 0.5);
    p.currentShapeSet = shuffledShapes.slice(0, 4);
    return shuffledPatterns.slice(0, 4);
  };

  /**
   * Initializes random values for the sketch
   */
  p.initializeRandomValues = () => {
    p.baseHue = p.random(360);
    p.complementaryHue = (p.baseHue + 180) % 360;
    p.currentPatternSet = p.generateUniquePatternSet();
    p.animationProgress = 0;
    p.animationStartTime = p.millis();
    p.lastRegenTime = p.millis();
  };

  /**
   * Main drawing function that renders the sketch
   */
  p.draw = () => {
    p.clear();
    
    // Update animation progress
    const elapsed = p.millis() - p.animationStartTime;
    p.animationProgress = p.constrain(elapsed / p.animationDuration, 0, 1);
    
    // Auto-regenerate every 5 seconds
    if (p.millis() - p.lastRegenTime > p.autoRegenInterval) {
      p.initializeRandomValues();
    }
    
    const cellWidth = p.width / 2;
    const cellHeight = p.height / 2;
    const cellAspectRatio = cellWidth / cellHeight;
    
    if (cellAspectRatio > 1.5 && window.innerHeight < 500) {
      // Single row layout when aspect ratio > 3:2
      const singleCellWidth = p.width / 4;
      const singleCellHeight = p.height;
      p.drawCell(p.color(p.complementaryHue, 20, 100), p.complementaryHue, 0, 0, singleCellWidth, singleCellHeight, true, 0);
      p.drawCell(p.color(p.complementaryHue, 100, 20), p.complementaryHue, singleCellWidth, 0, singleCellWidth, singleCellHeight, false, 1);
      p.drawCell(p.color(p.baseHue, 20, 100), p.baseHue, singleCellWidth * 2, 0, singleCellWidth, singleCellHeight, true, 2);
      p.drawCell(p.color(p.baseHue, 100, 20), p.baseHue, singleCellWidth * 3, 0, singleCellWidth, singleCellHeight, false, 3);
    } else {
      // 2x2 grid layout
      p.drawCell(p.color(p.complementaryHue, 100, 20), p.complementaryHue, 0, 0, cellWidth, cellHeight, true, 0);
      p.drawCell(p.color(p.baseHue, 20, 100), p.baseHue, cellWidth, 0, cellWidth, cellHeight, false, 1);
      p.drawCell(p.color(p.complementaryHue, 20, 100), p.complementaryHue, 0, cellHeight, cellWidth, cellHeight, false, 2);
      p.drawCell(p.color(p.baseHue, 100, 20), p.baseHue, cellWidth, cellHeight, cellWidth, cellHeight, true, 3);
    }
  };

  /**
   * Draws a single cell with background color and sacred geometry pattern
   * @param {p5.Color} bgColor - Background color object
   * @param {number} strokeHue - Stroke hue value
   * @param {number} x - X position of the cell
   * @param {number} y - Y position of the cell
   * @param {number} w - Width of the cell
   * @param {number} h - Height of the cell
   * @param {boolean} isTintedBG - Whether background is tinted (true) or shaded (false)
   * @param {number} patternIndex - Index of pattern from currentPatternSet
   */
  p.drawCell = (bgColor, strokeHue, x, y, w, h, isTintedBG, patternIndex) => {
    const maxSize = p.min(w, h) * 0.35;
    const size = maxSize * p.animationProgress;
    p.push();
    p.translate(x, y);
    p.fill(bgColor);
    p.noStroke();
    p.rect(0, 0, w, h);
    p.noFill();
    p.setCenter(w / 2, h / 2);
    
    if (isTintedBG) {
      // Tints: reduce saturation
      p.stroke(strokeHue, 100, 100);
      p.fill(strokeHue, 40, 100);
      p[p.currentPatternSet[patternIndex]](p.currentShapeSet[patternIndex], size);
      
      p.stroke(strokeHue, 80, 100);
      p.fill(strokeHue, 100, 40);
      p[p.currentPatternSet[patternIndex]](p.currentShapeSet[patternIndex], size / 2);
    } else {
      // Shades: reduce brightness
      p.stroke(strokeHue, 100, 100);
      p.fill(strokeHue, 100, 40);
      p[p.currentPatternSet[patternIndex]](p.currentShapeSet[patternIndex], size);
      
      p.stroke(strokeHue, 100, 80);
      p.fill(strokeHue, 40, 100);
      p[p.currentPatternSet[patternIndex]](p.currentShapeSet[patternIndex], size / 2);
    }
    p.pop();
   };


  /**
   * Customized mouse press handler for sketch-3
   * Regenerates the sketch when clicked
   */
  p.mousePressed = () => {
    p.initializeRandomValues();
  };

  /**
   * Handles key press events
   * and saves the sketch as a PNG
   * if the user presses Ctrl + S
   */
  p.keyPressed = () => {
    if (p.keyIsDown(p.CONTROL) && p.key === 's') {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      p.save(`sketch-3_${timestamp}.png`);
      return false;
    }
  };

  /**
   * Creates a simple regenerate button without pattern display
   */
  p.createRegenerateButton = () => {
    const button = document.createElement('button');
    button.textContent = 'REGENERATE';
    button.style.cssText = 'position: absolute; bottom: 10px; right: 10px; background: black; color: white; border: none; padding: 10px 20px; cursor: pointer; font-size: 16px; border-radius: 5px; z-index: 1000;';
    document.body.appendChild(button);
  };

  // Set up event handlers using shared functions
  p.windowResized = () => windowResized(p);
};

new p5(sketch);