import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedCounter({ target, suffix = '', label, fontSize = 36 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    // Determine decimal places from the target value
    const decStr = target.toString().split('.')[1] || '';
    const decimals = decStr.length; // 0 for integers, 1 for 1.5, 2 for 3.95
    
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ value: 0 }, {
            value: target,
            duration: 1.5,
            ease: 'power3.out',
            onUpdate: function() {
              const current = this.targets()[0].value;
              setVal(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));
            }
          });
        }
      });
    });
    return () => ctx.revert();
  }, [target]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', lineHeight: 1 }}>
        <span style={{
          fontSize,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {val}{suffix}
        </span>
      </div>
      {label && (
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginTop: '0.5rem',
        }}>{label}</p>
      )}
    </div>
  );
}

// We also need to export Counter mapping to AnimatedCounter just in case anything explicitly imports Counter,
// although App.jsx only imports AnimatedCounter from './components/Counter/Counter'
export default AnimatedCounter;