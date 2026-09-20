import { describe, expect, it } from 'vitest';
import { createGrid, sampleWave } from '../src/waveMath';

describe('hero wave math', () => {
  it('creates a structured deterministic grid', () => {
    const points = createGrid(400, 300, 40);
    expect(points.length).toBeGreaterThan(40);
    expect(new Set(points.map((p) => p.x)).size).toBeGreaterThan(5);
    expect(new Set(points.map((p) => p.y)).size).toBeGreaterThan(5);
  });

  it('has a visible resting state before pointer movement', () => {
    const sample = sampleWave({ x: 200, y: 100, col: 2, row: 3 }, 800, null);
    expect(Math.abs(sample.y - 100)).toBeGreaterThan(0.5);
    expect(sample.alpha).toBeGreaterThanOrEqual(0.34);
    expect(sample.radius).toBeGreaterThanOrEqual(1.15);
  });

  it('reacts more strongly near the pointer', () => {
    const point = { x: 200, y: 100, col: 2, row: 3 };
    const resting = sampleWave(point, 800, null);
    const active = sampleWave(point, 800, { x: 200, y: 100 });
    expect(Math.abs(active.y - point.y)).toBeGreaterThan(Math.abs(resting.y - point.y));
    expect(active.radius).toBeGreaterThan(resting.radius);
  });
});
