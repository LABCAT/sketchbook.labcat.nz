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
    'drawFlowerOfLife',
    'drawFruitOfLife',
    'drawMetatronsCube'
  ];

  /**
   * Initializes the canvas and sets up the sketch
   */
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.colorMode(p.HSB, 360, 100, 100, 100);
    // p.noFill();
    setStrokeWeight(p);
    p.baseHue = p.random(360);
    p.complementaryHue = (p.baseHue + 180) % 360;
    p.currentShapeType = p.random(p.shapeTypes.filter(shape => shape !== p.currentShapeType));
     p.currentPattern = p.random(p.patternFunctions.filter(pattern => pattern !== p.currentPattern));
     createShapeSelector(p, p.currentShapeType);
     createRegenerateButton(p);
     p.createBlendModeSelector('ADD');
  };

   /**
   * Main drawing function that renders the sketch
   */
    p.draw = () => {
     p.clear();
     
     const cellWidth = p.width / 2;
     const cellHeight = p.height / 2;
    const baseColor = p.color(p.baseHue, 100, 100);
     const complementaryColor = p.color(p.complementaryHue, 100, 100);
     const altColor = p.getAltColor(p.currentBlendMode);
     
     p.drawCell(baseColor, p.complementaryHue, 0, 0, cellWidth, cellHeight);
     p.drawCell(altColor, p.baseHue, cellWidth, 0, cellWidth, cellHeight);
     p.drawCell(altColor, p.complementaryHue, 0, cellHeight, cellWidth, cellHeight);
     p.drawCell(complementaryColor, p.baseHue, cellWidth, cellHeight, cellWidth, cellHeight);
   };

  /**
   * Draws a single cell with background color and sacred geometry pattern
   * @param {p5.Color} bgColor - Background color object
   * @param {number} strokeHue - Stroke hue value
   * @param {number} x - X position of the cell
   * @param {number} y - Y position of the cell
   * @param {number} w - Width of the cell
   * @param {number} h - Height of the cell
   */
  p.drawCell = (bgColor, strokeHue, x, y, w, h) => {
    const size = p.min(w, h) * 0.35;
    p.push();
    p.translate(x, y);
    p.fill(bgColor);
    p.noStroke();
    p.rect(0, 0, w, h);
    p.noFill();
    p.setCenter(w / 2, h / 2);
    // p.fill(0, 0, 100, 100);
    p.fill(strokeHue, 100, 100, 20);
    p.stroke(strokeHue, 100, 100);
    p[p.currentPattern](p.currentShapeType, size);
    p.pop();
   };

  /**
   * Creates a blend mode dropdown selector
   * @param {string} currentBlendMode - Currently selected blend mode
   */
  p.createBlendModeSelector = (currentBlendMode = 'BLEND') => {
    const container = document.createElement('div');
    container.className = 'blend-mode-selector';
    Object.assign(container.style, {
      position: 'absolute', top: '10px', right: '10px', zIndex: '1000',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px'
    });
    
    const label = document.createElement('div');
    label.textContent = 'BLEND MODE';
    label.style.cssText = 'color: white; font-size: 10px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); background-color: rgba(0,0,0,0.7); padding: 5px; border-radius: 3px;';
    container.appendChild(label);
    
    const select = document.createElement('select');
    select.style.cssText = 'padding: 5px; border-radius: 3px; border: none; background-color: white; color: black; font-size: 12px; cursor: pointer;';
    
    const blendModes = [
      'ADD', 'DARKEST', 'LIGHTEST', 'EXCLUSION', 
      'MULTIPLY', 'SCREEN', 'REPLACE', 'REMOVE', 'DIFFERENCE', 
      'OVERLAY', 'HARD_LIGHT', 'SOFT_LIGHT', 'DODGE', 'BURN'
    ];
    
    blendModes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode;
      option.textContent = mode;
      if (mode === currentBlendMode) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    
  select.addEventListener('change', (event) => {
    event.stopPropagation();
    const selectedMode = event.target.value;
    p.currentBlendMode = selectedMode;
    p.blendMode(p[selectedMode]);
  });
  
  select.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  
  select.addEventListener('mousedown', (event) => {
    event.stopPropagation();
  });
    
    container.appendChild(select);
    document.body.appendChild(container);
    
    // Set initial blend mode
    p.currentBlendMode = currentBlendMode;
    p.blendMode(p[currentBlendMode]);
  };

  /**
   * Determines alternate color based on blend mode
   * @param {string} blendMode - Current blend mode
   * @returns {p5.Color} Color object (black or white)
   */
  p.getAltColor = (blendMode) => {
    if (blendMode === 'DARKEST') return p.color(0, 0, 100);
    if (blendMode === 'LIGHTEST') return p.color(0, 0, 0);
    return Math.random() < 0.5 ? p.color(0, 0, 0) : p.color(0, 0, 100);
  };

  // Set up event handlers using shared functions
  p.mousePressed = () => mousePressed(p);
  p.windowResized = () => windowResized(p);
};

new p5(sketch);