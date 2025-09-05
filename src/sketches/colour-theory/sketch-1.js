import p5 from "p5";
import "@lib/p5.Polar.min.js";
import '@lib/p5.polygon.js';

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
    p.setStrokeWeight();
    p.baseHue = p.random(360);
    p.complementaryHue = (p.baseHue + 180) % 360;
    p.currentShapeType = p.random(p.shapeTypes.filter(shape => shape !== p.currentShapeType));
    p.currentPattern = p.random(p.patternFunctions.filter(pattern => pattern !== p.currentPattern));
    p.createShapeSelector(p.currentShapeType);
    p.createRegenerateButton();
  };

  /**
   * Main drawing function that renders the sketch
   */
  p.draw = () => {
    const isPortrait = p.isPortraitCanvas();
    
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
    p[p.currentPattern](size);
    p.pop();
  };

  /**
   * Draws the vesica piscis pattern
   * @param {number} size - Size of the pattern
   */
  p.drawVesicaPiscis = (size) => {
    if (p.currentShapeType === 'polarEllipse') {
      p.polarEllipse(0, size, size);
      p.polarEllipse(0, size / 2, size /2);
      p.polarEllipse(0, size / 4 * 3, size / 4 * 3, size / 4);
      p.polarEllipse(0, size / 4 * 3, size / 4 * 3, -size / 4);
    } else {
      p[p.currentShapeType](0, size);
      p[p.currentShapeType](0, size / 2);
      p[p.currentShapeType](0, size / 4 * 3, -size / 4);
      p[p.currentShapeType](180, size / 4 * 3, -size / 4);
    }
  };

  /**
   * Draws the seed of life pattern
   * @param {number} size - Size of the pattern
   */
  p.drawSeedOfLife = (size) => {
    const shapeSize = size / 2;
    if (p.currentShapeType === 'polarEllipse') {
      p.polarEllipse(0, shapeSize, shapeSize);
      p.polarEllipses(6, shapeSize, shapeSize, shapeSize);
    }
    else {
      p[p.currentShapeType](0, shapeSize);
      p[`${p.currentShapeType}s`](6, shapeSize, shapeSize);
    }
  };

  /**
   * Draws the seed of life pattern
   * @param {number} size - Size of the pattern
   */
  p.drawEggOfLife = (size) => {
    const shapeSize = size / 3;
    if (p.currentShapeType === 'polarEllipse') {
      p.polarEllipse(0, shapeSize, shapeSize);
      p.polarEllipses(6, shapeSize, shapeSize, shapeSize * 2);
    }
    else {
      p[p.currentShapeType](0, shapeSize);
      p[`${p.currentShapeType}s`](6, shapeSize, shapeSize * 2);
    }
  };

  /**
   * Draws the flower of life pattern
   * @param {number} size - Size of the pattern
   */
  p.drawFlowerOfLife = (size) => {
    const shapeSize = size / 3;
    if (p.currentShapeType === 'polarEllipse') {
      p.polarEllipse(0, size, size);
      p.polarEllipse(0, shapeSize, shapeSize);
      p.polarEllipses(6, shapeSize, shapeSize, shapeSize);
      p.polarEllipses(12, shapeSize, shapeSize, shapeSize * 2);
    }
    else {
      p[p.currentShapeType](0, size);
      p[p.currentShapeType](0, shapeSize);
      p[`${p.currentShapeType}s`](6, shapeSize, shapeSize);
      p[`${p.currentShapeType}s`](12, shapeSize, shapeSize * 2);
    }
  };

  p.createShapeSelector = (currentShape) => {
    const container = document.createElement('div');
    container.className = 'shape-selector';
    Object.assign(container.style, {
      position: 'absolute', top: '10px', left: '10px', zIndex: '1000',
      display: 'flex', alignItems: 'center', gap: '5px'
    });
    
    const label = document.createElement('div');
    label.textContent = 'SELECT SHAPE';
    label.style.cssText = 'color: white; font-size: 10px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); background-color: rgba(0,0,0,0.7); padding: 5px; border-radius: 3px;';
    container.appendChild(label);
    
    const shapeNames = ['Circle', 'Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon'];
    
    shapeNames.forEach((shapeName, index) => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'shape';
      radio.value = p.shapeTypes[index];
      radio.style.display = 'none';
      
      const button = document.createElement('div');
      Object.assign(button.style, {
        width: '28px', height: '28px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      });
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 20 20');
      svg.style.cssText = 'width: 20px; height: 20px; stroke: black; stroke-width: 2; fill: none;';
      
      // Create shape
      if (shapeName === 'Circle') {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '10'); circle.setAttribute('cy', '10'); circle.setAttribute('r', '8');
        svg.appendChild(circle);
      } else if (shapeName === 'Triangle') {
        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        triangle.setAttribute('points', '10,2 18,16 2,16');
        svg.appendChild(triangle);
      } else if (shapeName === 'Square') {
        const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        square.setAttribute('x', '2'); square.setAttribute('y', '2'); 
        square.setAttribute('width', '16'); square.setAttribute('height', '16');
        svg.appendChild(square);
      } else {
        const sides = { Pentagon: 5, Hexagon: 6, Heptagon: 7, Octagon: 8 }[shapeName];
        const rotationOffset = shapeName === 'Hexagon' ? Math.PI / 6 : 
                              shapeName === 'Octagon' ? Math.PI / 8 : 0;
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const points = [];
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI / sides) - Math.PI / 2 + rotationOffset;
          points.push(`${10 + 8 * Math.cos(angle)},${10 + 8 * Math.sin(angle)}`);
        }
        polygon.setAttribute('points', points.join(' '));
        svg.appendChild(polygon);
      }
      
      button.appendChild(svg);
      
      const handleClick = (event) => {
        if (event) {
          event.stopPropagation();
          event.preventDefault();
        }
        document.querySelectorAll('input[name="shape"]').forEach(r => {
          r.checked = false;
          const nextSibling = r.nextElementSibling;
          if (nextSibling) nextSibling.style.backgroundColor = 'transparent';
        });
        radio.checked = true;
        button.style.backgroundColor = 'white';
        p.currentShapeType = radio.value;
      };
      
      button.addEventListener('click', handleClick);
      if (radio.value === currentShape) handleClick();
      
      container.appendChild(radio);
      container.appendChild(button);
    });
    
    document.body.appendChild(container);
  };

  /**
   * Creates the regenerate button and pattern display
   */
  p.createRegenerateButton = () => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end';
    container.style.gap = '10px';
    container.style.zIndex = '1000';

    const patternText = document.createElement('div');
    patternText.id = 'pattern-display';
    patternText.style.color = 'white';
    patternText.style.fontSize = '14px';
    patternText.style.fontWeight = 'bold';
    patternText.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
    patternText.style.backgroundColor = 'rgba(0,0,0,0.7)';
    patternText.style.padding = '5px 10px';
    patternText.style.borderRadius = '3px';

    const button = document.createElement('button');
    button.textContent = 'REGENERATE';
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.borderRadius = '5px';
    

    container.appendChild(patternText);
    container.appendChild(button);
    document.body.appendChild(container);
    
    p.updatePatternDisplay();
  };

  /**
   * Updates the pattern display text
   */
  p.updatePatternDisplay = () => {
    const patternDisplay = document.getElementById('pattern-display');
    if (patternDisplay) {
      const patternName = p.currentPattern.replace('draw', '').replace(/([A-Z])/g, ' $1').trim();
      patternDisplay.textContent = patternName;
    }
  };

  /**
   * Sets the global stroke weight based on the smaller dimension of the canvas
   */
  p.setStrokeWeight = () => {
    const weight = p.min(p.width, p.height) * 0.01;
    p.strokeWeight(weight);
  };

  /**
   * Handles mouse press events
   */
  p.mousePressed = () => {
    const elements = document.elementsFromPoint(p.mouseX + p.canvas.offsetLeft, p.mouseY + p.canvas.offsetTop);
    const isOverShapeSelector = elements.some(el => el.closest('.shape-selector'));
    
    if (isOverShapeSelector) return;
    
    p.baseHue = p.random(360);
    p.complementaryHue = (p.baseHue + 180) % 360;
    p.currentShapeType = p.random(p.shapeTypes.filter(shape => shape !== p.currentShapeType));
    p.currentPattern = p.random(p.patternFunctions.filter(pattern => pattern !== p.currentPattern));
    
    p.updatePatternDisplay();
    
    const allRadios = document.querySelectorAll('input[name="shape"]');
    allRadios.forEach(r => {
      r.checked = false;
      const shapeButton = r.nextElementSibling;
      if (shapeButton) {
        shapeButton.style.backgroundColor = 'transparent';
      }
    });
    
    const selectedRadio = document.querySelector(`input[value="${p.currentShapeType}"]`);
    if (selectedRadio) {
      selectedRadio.checked = true;
      const shapeButton = selectedRadio.nextElementSibling;
      if (shapeButton) {
        shapeButton.style.backgroundColor = 'white';
      }
    }
  };

  /**
   * Resizes the canvas when the window is resized and redraws
   */
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.setStrokeWeight();
    p.redraw();
  };

  /**
   * Checks if the canvas is in portrait orientation
   * @returns {boolean} true if portrait, false otherwise
   */
  p.isPortraitCanvas = () => {
    return p.height > p.width;
  };

  /** 
   * Converts a string to a deterministic seed for p5.js random functions
   * Used with highlight.xyz for consistent generative art
   * @param {string} str - The string to convert to a seed
   * @returns {number} A deterministic seed value
   */
  p.hashToSeed = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return Math.abs(hash);
  };
};

new p5(sketch);