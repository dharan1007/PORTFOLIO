import { describe, expect, it } from 'vitest';
import { orderedProjects, priorityProjectIds, projects, researchHighlightProject } from '../src/data/projects';

describe('portfolio project data', () => {
  it('keeps the approved priority ordering', () => {
    expect(orderedProjects().slice(0, 12).map((p) => p.id)).toEqual([...priorityProjectIds]);
  });

  it('keeps Zachitan as a research highlight', () => {
    expect(researchHighlightProject?.id).toBe('zachitan');
  });

  it('never treats Anshap as a project', () => {
    expect(projects.some((p) => /anshap/i.test(p.name))).toBe(false);
  });

  it('does not expose source links for private projects', () => {
    for (const project of projects.filter((p) => p.visibility.startsWith('Private'))) {
      expect(project.sourceUrl).toBeNull();
    }
  });
});
