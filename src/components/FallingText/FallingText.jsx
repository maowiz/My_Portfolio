import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import './FallingText.css';

export default function FallingText({
  className = '',
  text = '',
  highlightWords = [],
  highlightClass = 'highlighted',
  trigger = 'auto',
  backgroundColor = 'transparent',
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = '1rem',
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split(' ');
    textRef.current.innerHTML = words
      .map((w) => {
        const isH = highlightWords.some((hw) => w.startsWith(hw));
        return `<span class="word ${isH ? highlightClass : ''}">${w}</span>`;
      })
      .join(' ');
  }, [text, highlightWords, highlightClass]);

  useEffect(() => {
    if (trigger === 'auto') { setStarted(true); return; }
    if (trigger === 'scroll' && containerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      obs.observe(containerRef.current);
      return () => obs.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!started) return;
    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const rect = containerRef.current.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = Math.floor(rect.height);
    if (w <= 0 || h <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width: w, height: h, background: backgroundColor, wireframes },
    });

    const bound = { isStatic: true, render: { fillStyle: 'transparent' } };
    const floor = Bodies.rectangle(w / 2, h + 25, w, 50, bound);
    const left = Bodies.rectangle(-25, h / 2, 50, h, bound);
    const right = Bodies.rectangle(w + 25, h / 2, 50, h, bound);
    const ceil = Bodies.rectangle(w / 2, -25, w, 50, bound);

    const wordSpans = textRef.current.querySelectorAll('.word');
    const wordBodies = [...wordSpans].map((elem) => {
      const r2 = elem.getBoundingClientRect();
      const x = r2.left - rect.left + r2.width / 2;
      const y = r2.top - rect.top + r2.height / 2;
      const body = Bodies.rectangle(x, y, r2.width, r2.height, {
        render: { fillStyle: 'transparent' },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = 'absolute';
      elem.style.left = `${body.position.x}px`;
      elem.style.top = `${body.position.y}px`;
      elem.style.transform = 'translate(-50%, -50%)';
    });

    const mouse = Mouse.create(containerRef.current);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, left, right, ceil, mc, ...wordBodies.map((wb) => wb.body)]);
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const loop = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`;
        elem.style.top = `${body.position.y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        try { canvasContainerRef.current.removeChild(render.canvas); } catch {}
      }
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [started, gravity, wireframes, backgroundColor, mouseConstraintStiffness]);

  const handleTrigger = () => {
    if (!started && (trigger === 'click' || trigger === 'hover')) setStarted(true);
  };

  return (
    <div
      ref={containerRef}
      className={`falling-text-container ${className}`}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
    >
      <div ref={textRef} className="falling-text-target" style={{ fontSize, lineHeight: 1.4 }} />
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  );
}