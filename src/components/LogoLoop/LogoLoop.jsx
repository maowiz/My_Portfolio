import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import './LogoLoop.css';

const SMOOTH_TAU = 0.25;
const MIN_COPIES = 2;
const COPY_HEADROOM = 2;

export default memo(function LogoLoop({
  logos = [],
  speed = 120,
  direction = 'left',
  logoHeight = 28,
  gap = 32,
  hoverSpeed = 0,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  ariaLabel = 'Technology logos',
  className,
  style,
}) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const seqRef = useRef(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState(MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const targetVelocity = useMemo(() => {
    const mag = Math.abs(speed);
    const dir = direction === 'left' ? 1 : -1;
    return mag * dir * (speed < 0 ? -1 : 1);
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const cw = containerRef.current?.clientWidth ?? 0;
    const sw = seqRef.current?.getBoundingClientRect?.()?.width ?? 0;
    if (sw > 0) {
      setSeqWidth(Math.ceil(sw));
      setCopyCount(Math.max(MIN_COPIES, Math.ceil(cw / sw) + COPY_HEADROOM));
    }
  }, []);

  /* Resize observer */
  useEffect(() => {
    const cb = () => updateDimensions();
    if (!window.ResizeObserver) {
      window.addEventListener('resize', cb);
      cb();
      return () => window.removeEventListener('resize', cb);
    }
    const obs = [containerRef, seqRef].map((r) => {
      if (!r.current) return null;
      const o = new ResizeObserver(cb);
      o.observe(r.current);
      return o;
    });
    cb();
    return () => obs.forEach((o) => o?.disconnect());
  }, [updateDimensions, logos, gap, logoHeight]);

  /* Image load observer */
  useEffect(() => {
    const imgs = seqRef.current?.querySelectorAll('img') ?? [];
    if (!imgs.length) { updateDimensions(); return; }
    let rem = imgs.length;
    const done = () => { rem--; if (rem === 0) updateDimensions(); };
    imgs.forEach((img) => {
      if (img.complete) done();
      else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); }
    });
  }, [logos, gap, logoHeight, updateDimensions]);

  /* Animation loop */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || seqWidth <= 0) return;

    let raf = null;
    let last = null;
    let offset = 0;
    let velocity = 0;

    const animate = (ts) => {
      if (last === null) last = ts;
      const dt = Math.max(0, ts - last) / 1000;
      last = ts;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;
      const ease = 1 - Math.exp(-dt / SMOOTH_TAU);
      velocity += (target - velocity) * ease;

      offset = ((offset + velocity * dt) % seqWidth + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { if (raf !== null) cancelAnimationFrame(raf); };
  }, [targetVelocity, seqWidth, isHovered, hoverSpeed]);

  const rootCls = [
    'logoloop', 'logoloop--horizontal',
    fadeOut && 'logoloop--fade',
    scaleOnHover && 'logoloop--scale-hover',
    className,
  ].filter(Boolean).join(' ');

  const cssVars = {
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor }),
  };

  return (
    <div ref={containerRef} className={rootCls} style={{ width: '100%', ...cssVars, ...style }}
         role="region" aria-label={ariaLabel}>
      <div ref={trackRef} className="logoloop__track"
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}>
        {Array.from({ length: copyCount }, (_, ci) => (
          <ul className="logoloop__list" key={ci} role="list"
              aria-hidden={ci > 0} ref={ci === 0 ? seqRef : undefined}>
            {logos.map((item, ii) => (
              <li className="logoloop__item" key={`${ci}-${ii}`} role="listitem">
                {item.href ? (
                  <a className="logoloop__link" href={item.href} target="_blank"
                     rel="noreferrer noopener" aria-label={item.title}>
                    <img src={item.src} alt={item.alt ?? ''} title={item.title}
                         loading="lazy" decoding="async" draggable={false} />
                  </a>
                ) : (
                  <img src={item.src} alt={item.alt ?? ''} title={item.title}
                       loading="lazy" decoding="async" draggable={false} />
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});