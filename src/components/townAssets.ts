const NEST_IMAGES = [
  "/assets/town/nest-cutout/nest-level-1.png",
  "/assets/town/nest-cutout/nest-level-2.png",
  "/assets/town/nest-cutout/nest-level-3.png",
];

export const getNestImageForLevel = (level: number) => {
  if (level <= 0) {
    return undefined;
  }

  return NEST_IMAGES[Math.min(level, NEST_IMAGES.length) - 1];
};
