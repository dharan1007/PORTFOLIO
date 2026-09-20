export type WavePoint = { x: number; y: number; col: number; row: number };
export type WavePointer = { x: number; y: number } | null;

export function createGrid(width: number, height: number, spacing: number): WavePoint[] {
  const points: WavePoint[] = [];
  let row = 0;
  for (let y = -spacing; y <= height + spacing; y += spacing, row += 1) {
    let col = 0;
    for (let x = -spacing; x <= width + spacing; x += spacing, col += 1) {
      points.push({ x, y, col, row });
    }
  }
  return points;
}

export function sampleWave(point: WavePoint, time: number, pointer: WavePointer) {
  const phase = point.x * 0.014 + point.y * 0.011 + time * 0.00235;
  const cross = Math.cos(point.y * 0.018 - time * 0.00155);
  const sweep = Math.sin(point.x * 0.008 - time * 0.0018);
  const depth = Math.sin(phase) * 0.68 + cross * 0.21 + sweep * 0.24;

  let influence = 0;
  let pushX = 0;
  let pushY = 0;

  if (pointer) {
    const dx = point.x - pointer.x;
    const dy = point.y - pointer.y;
    const dist2 = dx * dx + dy * dy;
    const radius = 235;
    influence = Math.exp(-dist2 / (2 * radius * radius));
    const dist = Math.sqrt(dist2) || 1;
    pushX = (dx / dist) * influence * 20;
    pushY = (dy / dist) * influence * 14;
  }

  const travellingBand = Math.sin(point.col * 0.29 + point.row * 0.08 - time * 0.0065);
  const bandLift = Math.max(0, travellingBand - 0.72) / 0.28;

  return {
    x: point.x + Math.sin(point.y * 0.013 + time * 0.00165) * 12 + pushX,
    y: point.y + depth * 34 - bandLift * 18 - influence * 62 + pushY,
    radius: Math.max(1.35, 2.05 + depth * 0.78 + bandLift * 0.9 + influence * 1.2),
    alpha: Math.min(0.97, Math.max(0.42, 0.61 + depth * 0.2 + bandLift * 0.15 + influence * 0.18)),
    accent: influence > 0.43 || bandLift > 0.42
  };
}
