import { act, render, screen } from '@testing-library/react';
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
    expect(screen.getByRole('heading', { name:/HI, I'M DHARANTEJ/i })).toBeTruthy();
    expect(container.querySelector('.creator-hero video')).not.toBeNull();
    expect(container.querySelector('.creator-marquee')).not.toBeNull();
    expect(container.querySelector('.creator-about')).not.toBeNull();
    expect(container.querySelector('.creator-services')).not.toBeNull();
    expect(container.querySelectorAll('.creator-service')).toHaveLength(5);
    expect(container.querySelectorAll('.creator-sticky-card')).toHaveLength(3);
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
