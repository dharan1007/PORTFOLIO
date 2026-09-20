import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

export function Reveal({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setEnhanced(true);
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const state = !enhanced || visible ? 'entered' : 'pending';
  return (
    <div ref={ref} className={'reveal ' + (enhanced ? (visible ? 'is-visible ' : 'is-pending ') : '') + className} data-motion-state={state}>
      {children}
    </div>
  );
}
