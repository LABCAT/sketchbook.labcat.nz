export const sketchMetadata = {
  'complementary-colours': {
    title: 'Complementary Colours',
    description: 'A sketch to explore complementary colours.',
    sketch: 'colour-theory/sketch-1.js',
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
