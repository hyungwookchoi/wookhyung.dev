'use client';

import { useEffect, useRef, useState } from 'react';

export default function ProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight;
          const winHeight = window.innerHeight;
          const totalDocScrollLength = docHeight - winHeight;

          if (totalDocScrollLength <= 0) {
            setScrollProgress(0);
            ticking.current = false;
            return;
          }

          const scrollPosition = (scrollTop / totalDocScrollLength) * 100;
          setScrollProgress(Math.min(Math.max(scrollPosition, 0), 100));

          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-[#799EFF] transition-transform duration-75 ease-linear origin-left"
        style={{
          transform: `scaleX(${scrollProgress / 100})`,
        }}
      />
    </div>
  );
}
