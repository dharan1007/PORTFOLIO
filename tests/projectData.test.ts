import { describe, expect, it } from 'vitest';
import { orderedProjects, priorityProjectIds, projects, researchHighlightProject } from '../src/data/projects';
import { domains, groupedProjects, projectDomain } from '../src/data/domains';

describe('portfolio project data', () => {
  it('categorizes every public project exactly once', () => {
    const groups = groupedProjects();
    const ids = groups.flatMap(group => group.projects.map(project => project.id));
    expect(groups).toHaveLength(6);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.slice().sort()).toEqual(orderedProjects().map(p => p.id).sort());
    expect(groups.every(group => group.projects.length > 0)).toBe(true);
    expect(Object.keys(projectDomain).length).toBe(orderedProjects().length);
    expect(domains.map(d => d.id)).toEqual(['connection','intelligence','engineering','signals','applied','laboratory']);
  });

  it('keeps the approved priority ordering', () => {
    expect(orderedProjects().slice(0, 12).map((p) => p.id)).toEqual([...priorityProjectIds]);
  });

  it('keeps Zachitan as a research highlight', () => {
    expect(researchHighlightProject?.id).toBe('zachitan');
  });

  it('keeps the retired predecessor out of the active public catalogue', () => {
    expect(orderedProjects().some((p) => p.id === 'maleu')).toBe(false);
    expect(projects.some((p) => p.id === 'maleu' && /superseded/i.test(p.status))).toBe(true);
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
