import { describe, expect, it } from 'vitest';
import { captureUrl, hasDedicatedWebsite } from '../src/components/ProjectPreview';
import { getProjectById, orderedProjects } from '../src/data/projects';
import { threeDObjects } from '../src/components/FloatObject';

describe('real-site and reference-3D assets',()=>{
  it('builds image capture URLs only from an actual project website',()=>{
    const project=getProjectById('raedius');
    expect(project?.liveUrl).toBeTruthy();
    const url=captureUrl(project!.liveUrl!,'desktop');
    expect(url).toContain(project!.liveUrl!);
    expect(url).toContain('image.thum.io');
    expect(captureUrl(project!.liveUrl!,'mobile')).toContain('/width/450/');
    expect(captureUrl(project!.liveUrl!,'detail',1)).toContain(encodeURIComponent(project!.liveUrl!));
  });
  it('uses three flagship sites with real public endpoints',()=>{
    for(const id of ['raedius','arkhe','spool'])expect(getProjectById(id)?.liveUrl).toMatch(/^https:\/\//);
  });
  it('keeps all 32 public project records and only labels actual live endpoints',()=>{
    expect(orderedProjects()).toHaveLength(32);
    expect(getProjectById('airadise')?.liveUrl).toBeNull();
    expect(getProjectById('codebase-os')?.sourceUrl).toMatch(/^https:\/\/github.com\//);
  });
  it('does not mistake the company homepage for an individual product live preview',()=>{
    expect(hasDedicatedWebsite(getProjectById('nexus')!)).toBe(false);
    expect(hasDedicatedWebsite(getProjectById('dot-os')!)).toBe(false);
    expect(hasDedicatedWebsite(getProjectById('spool')!)).toBe(true);
  });
  it('uses supplied 3D object imagery with independent transparent-object fallback',()=>{
    expect(Object.keys(threeDObjects)).toEqual(['moon','block','smile','pointer']);
    for(const key of Object.keys(threeDObjects) as Array<keyof typeof threeDObjects>){
      expect(threeDObjects[key].url).toMatch(/^https:\/\//);
      expect(threeDObjects[key].fallback).toMatch(/3dicons/);
    }
  });
});
