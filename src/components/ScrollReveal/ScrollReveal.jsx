import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}) {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, i) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="word" key={i}>{word}</span>;
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      { ease: 'none', rotate: 0,
        scrollTrigger: { trigger: el, start: 'top bottom', end: rotationEnd, scrub: true } }
    );

    const words = el.querySelectorAll('.word');

    gsap.fromTo(words,
      { opacity: baseOpacity, willChange: 'opacity' },
      { ease: 'none', opacity: 1, stagger: 0.05,
        scrollTrigger: { trigger: el, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true } }
    );

    if (enableBlur) {
      gsap.fromTo(words,
        { filter: `blur(${blurStrength}px)` },
        { ease: 'none', filter: 'blur(0px)', stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true } }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}