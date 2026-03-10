import { useRef, useEffect } from 'react';

export default function LetterGlitch({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const letters = useRef([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const ctx = useRef(null);
  const lastTime = useRef(Date.now());

  const chars = Array.from(characters);
  const fontSize = 16;
  const charW = 10;
  const charH = 20;

  const rChar = () => chars[Math.floor(Math.random() * chars.length)];
  const rColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)];

  const hexToRgb = (hex) => {
    hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  };

  const interp = (s, e, f) => `rgb(${Math.round(s.r + (e.r - s.r) * f)},${Math.round(s.g + (e.g - s.g) * f)},${Math.round(s.b + (e.b - s.b) * f)})`;

  const initLetters = (cols, rows) => {
    grid.current = { columns: cols, rows };
    letters.current = Array.from({ length: cols * rows }, () => ({
      char: rChar(), color: rColor(), targetColor: rColor(), colorProgress: 1,
    }));
  };

  const draw = () => {
    if (!ctx.current || !letters.current.length) return;
    const { width, height } = canvasRef.current.getBoundingClientRect();
    ctx.current.clearRect(0, 0, width, height);
    ctx.current.font = `${fontSize}px monospace`;
    ctx.current.textBaseline = 'top';
    letters.current.forEach((l, i) => {
      ctx.current.fillStyle = l.color;
      ctx.current.fillText(l.char, (i % grid.current.columns) * charW, Math.floor(i / grid.current.columns) * charH);
    });
  };

  const resize = () => {
    const c = canvasRef.current;
    if (!c) return;
    const p = c.parentElement;
    if (!p) return;
    const dpr = window.devicePixelRatio || 1;
    const r = p.getBoundingClientRect();
    c.width = r.width * dpr; c.height = r.height * dpr;
    c.style.width = `${r.width}px`; c.style.height = `${r.height}px`;
    if (ctx.current) ctx.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    initLetters(Math.ceil(r.width / charW), Math.ceil(r.height / charH));
    draw();
  };

  const update = () => {
    const count = Math.max(1, Math.floor(letters.current.length * 0.05));
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * letters.current.length);
      letters.current[idx].char = rChar();
      letters.current[idx].targetColor = rColor();
      if (!smooth) { letters.current[idx].color = letters.current[idx].targetColor; letters.current[idx].colorProgress = 1; }
      else letters.current[idx].colorProgress = 0;
    }
  };

  const smoothPass = () => {
    let dirty = false;
    letters.current.forEach((l) => {
      if (l.colorProgress < 1) {
        l.colorProgress = Math.min(1, l.colorProgress + 0.05);
        const s = hexToRgb(l.color), e = hexToRgb(l.targetColor);
        if (s && e) { l.color = interp(s, e, l.colorProgress); dirty = true; }
      }
    });
    if (dirty) draw();
  };

  const animate = () => {
    const now = Date.now();
    if (now - lastTime.current >= glitchSpeed) { update(); draw(); lastTime.current = now; }
    if (smooth) smoothPass();
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    ctx.current = canvasRef.current?.getContext('2d');
    resize(); animate();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => { cancelAnimationFrame(animRef.current); resize(); animate(); }, 100); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
  }, [glitchSpeed, smooth]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {outerVignette && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle,rgba(0,0,0,0) 60%,rgba(0,0,0,1) 100%)' }} />
      )}
      {centerVignette && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 60%)' }} />
      )}
    </div>
  );
}