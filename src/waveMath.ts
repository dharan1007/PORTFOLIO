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
  const phase = point.x * 0.012 + point.y * 0.01 + time * 0.00115;
  const cross = Math.cos(point.y * 0.016 - time * 0.00085);
  const sweep = Math.sin(point.x * 0.006 - time * 0.00095);
  const depth = Math.sin(phase) * 0.7 + cross * 0.2 + sweep * 0.16;

  let influence = 0;
  let pushX = 0;
  let pushY = 0;

  if (pointer) {
    const dx = point.x - pointer.x;
    const dy = point.y - pointer.y;
    const dist2 = dx * dx + dy * dy;
    const radius = 250;
    influence = Math.exp(-dist2 / (2 * radius * radius));

    const dist = Math.sqrt(dist2) || 1;
    pushX = (dx / dist) * influence * 28;
    pushY = (dy / dist) * influence * 20;
  }

  return {
    x: point.x + Math.sin(point.y * 0.01 + time * 0.0008) * 7 + pushX,
    y: point.y + depth * 22 - influence * 24 + pushY,
    radius: Math.max(1.15, 1.85 + depth * 0.45 + influence * 0.7),
    alpha: Math.min(0.88, Math.max(0.22, 0.44 + depth * 0.12 + influence * 0.18))
  };
}
