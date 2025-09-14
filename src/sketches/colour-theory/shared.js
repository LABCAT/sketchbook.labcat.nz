// Shared functions for colour theory sketches

/**
 * Creates the shape selector UI
 * @param {p5} p - p5 instance
 * @param {string} currentShape - Currently selected shape
 */
export const createShapeSelector = (p, currentShape) => {
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
 * @param {p5} p - p5 instance
 */
export const createRegenerateButton = (p) => {
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
  
  updatePatternDisplay(p);
};

/**
 * Updates the pattern display text
 * @param {p5} p - p5 instance
 */
export const updatePatternDisplay = (p) => {
  const patternDisplay = document.getElementById('pattern-display');
  if (patternDisplay) {
    const patternName = p.currentPattern.replace('draw', '').replace(/([A-Z])/g, ' $1').trim();
    patternDisplay.textContent = patternName;
  }
};

/**
 * Sets the global stroke weight based on the smaller dimension of the canvas
 * @param {p5} p - p5 instance
 */
export const setStrokeWeight = (p) => {
  const weight = p.min(p.width, p.height) * 0.01;
  p.strokeWeight(weight);
};

/**
 * Handles mouse press events
 * @param {p5} p - p5 instance
 */
export const mousePressed = (p) => {
  const elements = document.elementsFromPoint(p.mouseX + p.canvas.offsetLeft, p.mouseY + p.canvas.offsetTop);
  const isOverShapeSelector = elements.some(el => el.closest('.shape-selector'));
  const isOverBlendModeSelector = elements.some(el => el.closest('.blend-mode-selector'));
  
  if (isOverShapeSelector || isOverBlendModeSelector) return;
  
  p.baseHue = p.random(360);
  p.complementaryHue = (p.baseHue + 180) % 360;
  p.currentShapeType = p.random(p.shapeTypes.filter(shape => shape !== p.currentShapeType));
  p.currentPattern = p.random(p.patternFunctions.filter(pattern => pattern !== p.currentPattern));
  
  updatePatternDisplay(p);
  
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
 * @param {p5} p - p5 instance
 */
export const windowResized = (p) => {
  p.resizeCanvas(p.windowWidth, p.windowHeight);
  setStrokeWeight(p);
  p.redraw();
};

/**
 * Checks if the canvas is in portrait orientation
 * @param {p5} p - p5 instance
 * @returns {boolean} true if portrait, false otherwise
 */
export const isPortraitCanvas = (p) => {
  return p.height > p.width;
};

