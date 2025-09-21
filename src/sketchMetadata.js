export const sketchMetadata = {
  'complementary-colours': {
    title: 'Complementary Colours',
    description: 'A sketch to explore complementary colours.',
    sketch: 'colour-theory/sketch-1.js',
  },
  'blend-mode': {
    title: 'Blending Colours',
    description: 'A sketch to explore the p5js blendMode function.',
    sketch: 'colour-theory/sketch-2.js',
  },
  'monochromatic': {
    title: 'Monochromatic Colours',
    description: 'A sketch to explore the monochromatic colour scheme.',
    sketch: 'colour-theory/sketch-3.js',
  },
};

export function getAllSketches() {
  return Object.keys(sketchMetadata).map(id => ({
    id,
    ...sketchMetadata[id]
  }));
}

export function getSketchById(id) {
  return sketchMetadata[id] || null;
}
