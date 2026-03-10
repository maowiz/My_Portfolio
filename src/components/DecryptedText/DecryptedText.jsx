import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

const srOnly = {
  position: 'absolute', width: '1px', height: '1px', padding: 0,
  margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0,
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const containerRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (orig, revealed) =>
      orig
        .split('')
        .map((c, i) => {
          if (c === ' ') return ' ';
          if (revealed.has(i)) return orig[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join(''),
    [availableChars]
  );

  const getNextIndex = useCallback(
    (revealed) => {
      const len = text.length;
      if (revealDirection === 'end') return len - 1 - revealed.size;
      if (revealDirection === 'center') {
        const mid = Math.floor(len / 2);
        const off = Math.floor(revealed.size / 2);
        const next = revealed.size % 2 === 0 ? mid + off : mid - off - 1;
        if (next >= 0 && next < len && !revealed.has(next)) return next;
        for (let i = 0; i < len; i++) if (!revealed.has(i)) return i;
        return 0;
      }
      return revealed.size;
    },
    [text, revealDirection]
  );

  const triggerDecrypt = useCallback(() => {
    setRevealedIndices(new Set());
    setIsAnimating(true);
  }, []);

  useEffect(() => {
    if (!isAnimating) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setRevealedIndices((prev) => {
        if (sequential) {
          if (prev.size < text.length) {
            const next = getNextIndex(prev);
            const s = new Set(prev);
            s.add(next);
            setDisplayText(shuffleText(text, s));
            return s;
          }
          clearInterval(interval);
          setIsAnimating(false);
          setIsDecrypted(true);
          return prev;
        }
        setDisplayText(shuffleText(text, prev));
        iteration++;
        if (iteration >= maxIterations) {
          clearInterval(interval);
          setIsAnimating(false);
          setDisplayText(text);
          setIsDecrypted(true);
        }
        return prev;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [isAnimating, text, speed, maxIterations, sequential, shuffleText, getNextIndex]);

  /* View trigger */
  useEffect(() => {
    if (animateOn !== 'view') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          triggerDecrypt();
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, triggerDecrypt]);

  /* Hover trigger */
  const triggerHover = useCallback(() => {
    if (isAnimating) return;
    setRevealedIndices(new Set());
    setIsDecrypted(false);
    setDisplayText(text);
    setIsAnimating(true);
  }, [isAnimating, text]);

  const resetPlain = useCallback(() => {
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
  }, [text]);

  useEffect(() => {
    setDisplayText(text);
    setIsDecrypted(animateOn !== 'click');
  }, [animateOn, text]);

  const events =
    animateOn === 'hover'
      ? { onMouseEnter: triggerHover, onMouseLeave: resetPlain }
      : {};

  return (
    <motion.span
      className={parentClassName}
      ref={containerRef}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
      {...events}
      {...props}
    >
      <span style={srOnly}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, i) => {
          const done = revealedIndices.has(i) || (!isAnimating && isDecrypted);
          return (
            <span key={i} className={done ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
}