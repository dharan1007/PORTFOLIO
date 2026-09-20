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
  const phase = point.x * 0.015 + point.y * 0.0105 + time * 0.00105;
  const cross = Math.cos(point.y * 0.017 - time * 0.00072);
  const depth = Math.sin(phase) * 0.72 + cross * 0.28;
  let influence = 0;
  let pushX = 0;
  let pushY = 0;

  if (pointer) {
    const dx = point.x - pointer.x;
    const dy = point.y - pointer.y;
    const dist2 = dx * dx + dy * dy;
    const radius = 210;
    influence = Math.exp(-dist2 / (2 * radius * radius));
    const dist = Math.sqrt(dist2) || 1;
    pushX = (dx / dist) * influence * 12;
    pushY = (dy / dist) * influence * 8;
  }

  return {
    x: point.x + Math.sin(point.y * 0.012 + time * 0.00055) * 4 + pushX,
    y: point.y + depth * 15 - influence * 30 + pushY,
    radius: Math.max(1.15, 1.65 + depth * 0.6 + influence * 0.8),
    alpha: Math.min(0.9, Math.max(0.34, 0.52 + depth * 0.19 + influence * 0.16)),
    accent: influence > 0.56 || ((point.col + point.row * 3) % 41 === 0 && depth > 0.55)
  };
}
