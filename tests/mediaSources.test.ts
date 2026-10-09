import { describe, expect, it } from 'vitest';
import { editorialAssets, getPhotoUrl, licensedMediaCredits } from '../src/data/media';
import { domains } from '../src/data/domains';

describe('real editorial media', () => {
 it('gives every public domain its own licensed source and distinct image',()=>{
   const ids=domains.map(domain=>editorialAssets[domain.id].photo.id);
   expect(ids.every(id=>Number.isInteger(id)&&id>0)).toBe(true);
   expect(new Set(ids).size).toBe(domains.length);
 });
 it('uses licensed footage rather than stock template placeholders',()=>{
   for(const asset of [editorialAssets.hero,editorialAssets.airadise]){
     expect(asset.video?.url).toMatch(/^https:\/\/assets\.mixkit\.co\/videos\/preview\/.*\.mp4$/);
     expect(asset.video?.page).toMatch(/^https:\/\/mixkit\.co\/free-stock-video\//);
   }
 });
 it('provides public, traceable credits without calling editorial images product screenshots',()=>{
   expect(licensedMediaCredits.length).toBeGreaterThan(10);
   expect(Object.values(editorialAssets).every(a=>a.photo.page.startsWith('https://www.pexels.com/photo/'))).toBe(true);
   expect(getPhotoUrl('hero',640)).toContain('&w=640');
   expect(licensedMediaCredits.every(c=>c.url.startsWith('https://'))).toBe(true);
 });
});
