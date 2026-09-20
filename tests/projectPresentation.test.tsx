import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectPreview } from '../src/components/ProjectPreview';
import { ProjectStory } from '../src/components/ProjectStory';
import { getProjectById } from '../src/data/projects';

describe('project presentation', () => {
  it('renders a real live preview iframe for a public live surface', () => {
    const project = getProjectById('raedius')!;
    render(<ProjectPreview project={project} />);
    const image = screen.getByRole('img', { name: /RÆDIUS current public project preview/i });
    expect(image.getAttribute('src')).toContain('image.thum.io/get/width/1200/crop/800/noanimate/');
    expect(image.getAttribute('src')).toContain(project.liveUrl!);
    expect(screen.getByText('LIVE SNAPSHOT ↗')).toBeVisible();
  });

  it('renders a project-specific how-it-works visualization', () => {
    const project = getProjectById('spool')!;
    const { container } = render(<ProjectStory project={project} />);
    expect(screen.getByText(/snapshot the source deterministically/i)).toBeVisible();
    expect(container.querySelector('[data-visual-mode]')).toBeTruthy();
    expect(screen.getByText(/SPOOL \/ SYSTEM MAP/i)).toBeVisible();
  });

  it('uses different visualization modes across projects', () => {
    const first = render(<ProjectStory project={getProjectById('raedius')!} />).container.querySelector('[data-visual-mode]')?.getAttribute('data-visual-mode');
    const second = render(<ProjectStory project={getProjectById('arkhe')!} />).container.querySelector('[data-visual-mode]')?.getAttribute('data-visual-mode');
    expect(first).not.toBe(second);
  });
});
