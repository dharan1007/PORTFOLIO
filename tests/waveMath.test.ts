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
    expect(sample.alpha).toBeGreaterThanOrEqual(0.22);
    expect(sample.radius).toBeGreaterThanOrEqual(1.15);
  });

  it('moves slowly but materially over time without pointer input', () => {
    const point = { x: 200, y: 100, col: 7, row: 4 };
    const first = sampleWave(point, 0, null);
    const later = sampleWave(point, 500, null);
    const distance = Math.hypot(later.x - first.x, later.y - first.y);
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(14);
  });

  it('reacts strongly near the cursor', () => {
    const point = { x: 200, y: 100, col: 7, row: 4 };
    const resting = sampleWave(point, 0, null);
    const active = sampleWave(point, 0, { x: 200, y: 100 });
    expect(Math.abs(active.y - resting.y)).toBeGreaterThan(20);
    expect(active.radius).toBeGreaterThan(resting.radius);
  });

  it('returns no color channel or accent flag', () => {
    const sample = sampleWave({ x: 120, y: 80, col: 3, row: 2 }, 300, null);
    expect('accent' in sample).toBe(false);
  });
});
