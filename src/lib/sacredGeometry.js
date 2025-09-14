// Sacred Geometry Library
// Shared functions for drawing sacred geometry patterns using p5.Polar

/**
 * Draws the vesica piscis pattern
 * @param {string} currentShapeType - Current shape type being used
 * @param {number} size - Size of the pattern
 */
p5.prototype.drawVesicaPiscis = function(currentShapeType, size) {
  if (currentShapeType === 'polarEllipse') {
    this.polarEllipse(0, size, size);
    this.polarEllipse(0, size / 2, size /2);
    this.polarEllipse(0, size / 4 * 3, size / 4 * 3, size / 4);
    this.polarEllipse(0, size / 4 * 3, size / 4 * 3, -size / 4);
  } else {
    this[currentShapeType](0, size);
    this[currentShapeType](0, size / 2);
    this[currentShapeType](0, size / 4 * 3, -size / 4);
    this[currentShapeType](180, size / 4 * 3, -size / 4);
  }
};

/**
 * Draws the seed of life pattern
 * @param {string} currentShapeType - Current shape type being used
 * @param {number} size - Size of the pattern
 */
p5.prototype.drawSeedOfLife = function(currentShapeType, size) {
  const shapeSize = size / 2;
  if (currentShapeType === 'polarEllipse') {
    this.polarEllipse(0, shapeSize, shapeSize);
    this.polarEllipses(6, shapeSize, shapeSize, shapeSize);
  }
  else {
    this[currentShapeType](0, shapeSize);
    this[`${currentShapeType}s`](6, shapeSize, shapeSize);
  }
};

/**
 * Draws the egg of life pattern
 * @param {string} currentShapeType - Current shape type being used
 * @param {number} size - Size of the pattern
 */
p5.prototype.drawEggOfLife = function(currentShapeType, size) {
  const shapeSize = size / 3;
  if (currentShapeType === 'polarEllipse') {
    this.polarEllipse(0, shapeSize, shapeSize);
    this.polarEllipses(6, shapeSize, shapeSize, shapeSize * 2);
  }
  else {
    this[currentShapeType](0, shapeSize);
    this[`${currentShapeType}s`](6, shapeSize, shapeSize * 2);
  }
};

/**
 * Draws the flower of life pattern
 * @param {string} currentShapeType - Current shape type being used
 * @param {number} size - Size of the pattern
 */
p5.prototype.drawFlowerOfLife = function(currentShapeType, size) {
  const shapeSize = size / 3;
  if (currentShapeType === 'polarEllipse') {
    this.polarEllipse(0, size, size);
    this.polarEllipse(0, shapeSize, shapeSize);
    this.polarEllipses(6, shapeSize, shapeSize, shapeSize);
    this.polarEllipses(12, shapeSize, shapeSize, shapeSize * 2);
  }
  else {
    this[currentShapeType](0, size);
    this[currentShapeType](0, shapeSize);
    this[`${currentShapeType}s`](6, shapeSize, shapeSize);
    this[`${currentShapeType}s`](12, shapeSize, shapeSize * 2);
  }
};

