import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';

const noMotion = {
 matches:false, media:'(prefers-reduced-motion: reduce)', onchange:null,
 addListener:()=>{}, removeListener:()=>{}, addEventListener:()=>{}, removeEventListener:()=>{}, dispatchEvent:()=>true
};

class VisibilityObserver {
 observe() {}
 unobserve() {}
 disconnect() {}
 takeRecords() { return []; }
}

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => noMotion));
  vi.stubGlobal('IntersectionObserver', VisibilityObserver);
  vi.stubGlobal('ResizeObserver', VisibilityObserver);
  vi.stubGlobal('scrollTo', vi.fn());
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
  Object.defineProperty(window, 'scrollY', { configurable:true, writable:true, value:0 });
  window.history.replaceState({}, '', '/');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('portfolio experience', () => {
  it('shows the five-section creator portfolio with genuine project media', () => {
    const { container } = render(<App />);
    expect(screen.getByRole('heading', { name:/HI, I'M DHARAN TEJ REDDY \.P/i })).toBeTruthy();
    expect(container.querySelector('.creator-hero video')).toBeNull();
    expect(container.querySelectorAll('.creator-sculpture .float-object')).toHaveLength(4);
    expect(container.querySelectorAll('.creator-about .float-object')).toHaveLength(4);
    expect(container.querySelectorAll('.creator-sticky-card .editorial-photo')).toHaveLength(0);
    expect(container.querySelectorAll('.creator-sticky-card [data-project-snapshot]')).toHaveLength(9);
    expect(Array.from(container.querySelectorAll('.creator-sticky-card')).map(item=>item.querySelector('[data-website-gallery]')?.getAttribute('data-website-gallery'))).toEqual(['raedius','arkhe','spool']);
    expect(container.querySelector('[data-dot-matrix]')).not.toBeNull();
    expect(container.querySelector('[data-reactive-wave]')).toBeNull();
    expect(container.querySelectorAll('.creator-hero [data-reactive-object]')).toHaveLength(4);
    expect(container.querySelector('[data-creator-nav]')).not.toBeNull();
    const nav=screen.getByRole('navigation',{name:'Portfolio main navigation'});
    for(const href of ['/', '/projects', '/about', '/experience', '/contact']){
      expect(nav.querySelector('a[href="'+href+'"]')).not.toBeNull();
    }
    expect(nav.querySelector('a[href="#creator-marquee"]')).not.toBeNull();
    expect(container.querySelector('.creator-marquee')).not.toBeNull();
    expect(container.querySelector('.creator-about')).not.toBeNull();
    expect(container.querySelector('.creator-services')).not.toBeNull();
    expect(container.querySelectorAll('.creator-service')).toHaveLength(5);
    expect(container.querySelectorAll('.creator-sticky-card')).toHaveLength(3);
    expect(Array.from(container.querySelectorAll('.creator-page>section')).map(node=>node.className)).toEqual(['creator-hero','creator-marquee','creator-about','creator-services','creator-projects']);
    expect(container.querySelectorAll('.creator-marquee-viewport')).toHaveLength(2);
    expect(container.querySelectorAll('.creator-marquee-tile').length).toBeGreaterThan(20);
    expect(container.querySelector('.creator-mobile-menu')).not.toBeNull();
    expect(container.textContent).not.toContain('Nextlevel Studio');
  });

  it('shows a black-and-white dot matrix and independently controlled 3D object motion',()=>{
    const {container}=render(<App/>);
    const root=container.querySelector('.creator-page');
    const matrix=container.querySelector('[data-dot-matrix]');
    expect(matrix).not.toBeNull();
    expect(container.querySelector('[data-reactive-wave]')).toBeNull();
    const startOn=root?.getAttribute('data-motion-enabled')==='true';
    expect(container.querySelectorAll('.creator-hero [data-float-motion]')).toHaveLength(4);
    const control=container.querySelector<HTMLButtonElement>('[data-motion-toggle]');
    expect(control).not.toBeNull();
    expect(control?.getAttribute('aria-pressed')).toBe(String(startOn));
    fireEvent.click(control!);
    expect(container.querySelector('.creator-page')?.getAttribute('data-motion-enabled')).toBe(String(!startOn));
    expect(container.querySelector('[data-reactive-object]')?.getAttribute('data-float-motion')).toBe(!startOn?'on':'off');
    expect(container.querySelector('[data-dot-matrix]')).not.toBeNull();
    fireEvent.click(control!);
    expect(container.querySelector('.creator-page')?.getAttribute('data-motion-enabled')).toBe(String(startOn));
  });

  it('scrolls the second section horizontally via accessible buttons and keyboard',()=>{
    const {container}=render(<App/>);
    const rows=Array.from(container.querySelectorAll<HTMLElement>('[data-scrollable-gallery]'));
    expect(rows).toHaveLength(2);
    const first=rows[0].querySelector<HTMLElement>('.creator-marquee-viewport')!;
    expect(first.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('role')).toBe('region');
    Object.defineProperty(first,'clientWidth',{configurable:true,value:800});
    Object.defineProperty(first,'scrollWidth',{configurable:true,value:5600});
    first.scrollLeft=1900;
    const previous=first.scrollLeft;
    fireEvent.click(rows[0].querySelector<HTMLButtonElement>('button[aria-label="Scroll right gallery right"]')!);
    expect(first.scrollLeft).toBeGreaterThan(previous);
    const afterClick=first.scrollLeft;
    fireEvent.keyDown(first,{key:'ArrowLeft'});
    expect(first.scrollLeft).toBeLessThan(afterClick);
  });

  it('renders each project in exactly one of six editorial chapters', () => {
    window.history.replaceState({}, '', '/projects');
    const { container } = render(<App />);
    const chapters = container.querySelectorAll('.domain-chapter');
    expect(chapters).toHaveLength(6);
    const links = Array.from(container.querySelectorAll('.domain-chapter [data-project-id]'));
    expect(links).toHaveLength(32);
    const ids = links.map(item=>item.getAttribute('data-project-id'));
    expect(new Set(ids).size).toBe(32);
    expect(container.querySelector('#connection')).not.toBeNull();
    expect(container.querySelector('#laboratory')).not.toBeNull();
  });

  it('hides the header on downward scroll and returns on upward scroll', () => {
    const queued: FrameRequestCallback[] = [];
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {queued.push(callback);return queued.length;}));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    window.history.replaceState({}, '', '/contact');
    const { container } = render(<App />);
    const header = container.querySelector('#siteNavWrap');
    expect(header?.classList.contains('nav-is-hidden')).toBe(false);
    act(() => { window.scrollY=410;window.dispatchEvent(new Event('scroll'));while(queued.length) queued.shift()?.(16);});
    expect(header?.classList.contains('nav-is-hidden')).toBe(true);
    act(() => {window.scrollY=250;window.dispatchEvent(new Event('scroll'));while(queued.length) queued.shift()?.(32);});
    expect(header?.classList.contains('nav-is-hidden')).toBe(false);
  });

  it('keeps contact actions and resume link available', () => {
    window.history.replaceState({}, '', '/contact');
    const { container } = render(<App />);
    const mail = container.querySelector('a[href="mailto:dharan.poduvu@gmail.com"]');
    const resume = container.querySelector('a[href="/assets/Poduvu_Dharantej_Reddy_Resume.pdf"]');
    expect(mail).not.toBeNull();
    expect(resume).not.toBeNull();
  });
});
