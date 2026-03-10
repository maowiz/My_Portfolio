import { useEffect, useRef } from 'react';
import './PixelCard.css';

class Pixel {
  constructor(canvas, ctx, x, y, color, speed) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = (Math.random() * 0.8 + 0.1) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInt = 2;
    this.maxSize = Math.random() * (this.maxSizeInt - this.minSize) + this.minSize;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
    this.delay = Math.sqrt(
      (x - this.width / 2) ** 2 + (y - this.height / 2) ** 2
    );
  }
  draw() {
    const off = this.maxSizeInt * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + off, this.y + off, this.size, this.size);
  }
  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) { this.counter += this.counterStep; return; }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) this.shimmer(); else this.size += this.sizeStep;
    this.draw();
  }
  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) { this.isIdle = true; return; }
    this.size -= 0.1;
    this.draw();
  }
  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

export default function PixelCard({
  variant = 'default',
  gap,
  speed,
  colors,
  noFocus,
  className = '',
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const animRef = useRef(null);
  const prevTimeRef = useRef(performance.now());

  const VARIANTS = {
    default: { gap: 5, speed: 35, colors: '#f8fafc,#f1f5f9,#cbd5e1', noFocus: false },
    blue: { gap: 10, speed: 25, colors: '#e0f2fe,#7dd3fc,#0ea5e9', noFocus: false },
    purple: { gap: 6, speed: 40, colors: '#1a0a2e,#8B5CF6,#06B6D4', noFocus: false },
    pink: { gap: 6, speed: 80, colors: '#fecdd3,#fda4af,#e11d48', noFocus: true },
  };

  const cfg = VARIANTS[variant] || VARIANTS.default;
  const fGap = gap ?? cfg.gap;
  const fSpeed = speed ?? cfg.speed;
  const fColors = colors ?? cfg.colors;
  const fNoFocus = noFocus ?? cfg.noFocus;

  const initPixels = () => {
    if (!containerRef.current || !canvasRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = w;
    canvasRef.current.height = h;
    canvasRef.current.style.width = `${w}px`;
    canvasRef.current.style.height = `${h}px`;

    const colorsArr = fColors.split(',');
    const pxs = [];
    const eff = Math.max(1, Math.min(100, parseInt(fSpeed, 10))) * 0.001;
    for (let x = 0; x < w; x += parseInt(fGap, 10)) {
      for (let y = 0; y < h; y += parseInt(fGap, 10)) {
        const c = colorsArr[Math.floor(Math.random() * colorsArr.length)];
        pxs.push(new Pixel(canvasRef.current, ctx, x, y, c, eff));
      }
    }
    pixelsRef.current = pxs;
  };

  const doAnimate = (fnName) => {
    animRef.current = requestAnimationFrame(() => doAnimate(fnName));
    const now = performance.now();
    if (now - prevTimeRef.current < 1000 / 60) return;
    prevTimeRef.current = now;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    let allIdle = true;
    for (const px of pixelsRef.current) {
      px[fnName]();
      if (!px.isIdle) allIdle = false;
    }
    if (allIdle) cancelAnimationFrame(animRef.current);
  };

  const handleAnim = (name) => {
    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => doAnimate(name));
  };

  useEffect(() => {
    initPixels();
    const ro = new ResizeObserver(() => initPixels());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => { ro.disconnect(); cancelAnimationFrame(animRef.current); };
  }, [fGap, fSpeed, fColors]);

  return (
    <div
      ref={containerRef}
      className={`pixel-card ${className}`}
      onMouseEnter={() => handleAnim('appear')}
      onMouseLeave={() => handleAnim('disappear')}
      onFocus={fNoFocus ? undefined : () => handleAnim('appear')}
      onBlur={fNoFocus ? undefined : () => handleAnim('disappear')}
      tabIndex={fNoFocus ? -1 : 0}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
      {children}
    </div>
  );
}