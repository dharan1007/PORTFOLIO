export function albumPose(relative) {
  const distance = Math.abs(relative);
  return {
    x: relative * 67,
    rotateY: Math.max(-52, Math.min(52, -relative * 29)) || 0,
    rotateZ: Math.max(-9, Math.min(9, relative * 4)),
    scale: Math.max(0.62, 1 - distance * 0.13),
    z: distance ? -100 * distance : 0,
    dim: Math.min(0.6, distance * 0.2),
  };
}
