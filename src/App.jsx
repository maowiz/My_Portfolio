import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FiHome, FiUser, FiBriefcase, FiLayers, FiMail,
  FiExternalLink, FiGithub, FiDownload, FiArrowRight, FiArrowUpRight,
} from 'react-icons/fi';

/* Backgrounds */
import LaserFlow from './components/LaserFlow/LaserFlow';
import GridScan from './components/GridScan/GridScan';
import LetterGlitch from './components/LetterGlitch/LetterGlitch';
import Particles from './components/Particles/Particles';

/* Hero components */
import DecryptedText from './components/DecryptedText/DecryptedText';
import TiltedCard from './components/TiltedCard/TiltedCard';

/* Section components */
import ScrollReveal from './components/ScrollReveal/ScrollReveal';
import { AnimatedCounter } from './components/Counter/Counter';
import LogoLoop from './components/LogoLoop/LogoLoop';
import Dock from './components/Dock/Dock';

import {
  personalInfo, summary, stats, skills, toolLogos,
  experience, projects, education, certifications, navItems,
} from './data';

gsap.registerPlugin(ScrollTrigger);

/* ══════ PROJECT MODAL ══════ */
function ProjectModal({ isOpen, onClose, project }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(16px)' }} />
      <div
        style={{
          position:'relative', width:'100%', maxWidth:'720px', maxHeight:'90vh',
          overflowY:'auto', borderRadius:'20px',
          background:'var(--bg-elevated)', border:'1px solid var(--border)',
          boxShadow:'0 40px 100px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {project.image && (
          <div style={{ position:'relative', overflow:'hidden', height:'240px' }}>
            <img src={project.image} alt={project.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, var(--bg-elevated), transparent 60%)' }} />
          </div>
        )}
        <button onClick={onClose} style={{
          position:'absolute', top:'1rem', right:'1rem',
          width:'36px', height:'36px', borderRadius:'50%',
          background:'rgba(0,0,0,0.6)', border:'1px solid var(--border)',
          color:'var(--text-primary)', cursor:'pointer', fontSize:'1rem',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>✕</button>
        <div style={{ padding:'clamp(1.5rem, 5vw, 2.5rem)' }}>
          <div className="project-card__metric" style={{ marginBottom:'0.75rem' }}>{project.metric}</div>
          <h2 style={{ fontSize:'clamp(1.5rem,4vw,2rem)', fontWeight:800, letterSpacing:'-0.02em', color:'var(--text-primary)', marginBottom:'0.25rem' }}>
            {project.title}
          </h2>
          <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.75rem', color:'var(--text-accent)', marginBottom:'1.5rem' }}>
            {project.subtitle} · {project.year}
          </p>
          <p style={{ fontSize:'1rem', color:'var(--text-secondary)', lineHeight:1.8, marginBottom:'2rem' }}>
            {project.fullDescription || project.description}
          </p>
          <div className="project-card__tech" style={{ marginBottom:'2rem' }}>
            {project.tech?.map(t => <span key={t} className="project-card__tech-tag">{t}</span>)}
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem' }}>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration:'none' }}>
                Live Demo <FiExternalLink size={13} />
              </a>
            )}
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ textDecoration:'none' }}>
              Source Code <FiGithub size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════ APP ══════ */
export default function App() {
  const appRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = time => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' })
        .from('.hero-name', { y: 50, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.4')
        .from('.hero-title-line', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from('.hero-tagline', { y: 25, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .from('.hero-btns > *', { y: 15, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.4')
        .from('.hero-stats > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
        .from('.hero-visual', { scale: 0.92, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1');

      /* Fade LaserFlow as user scrolls past hero */
      gsap.to('.hero-bg', {
        opacity: 0,
        scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'top 20%', scrub: 1.5 },
      });

      /* Section reveals */
      gsap.utils.toArray('.reveal').forEach(el => {
        gsap.from(el, {
          y: 35, opacity: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        });
      });
      gsap.utils.toArray('.reveal-stagger').forEach(p => {
        gsap.from(Array.from(p.children), {
          y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' },
        });
      });

      /* Nav auto-hide */
      ScrollTrigger.create({
        onUpdate: self => {
          const nav = document.querySelector('.site-nav');
          if (!nav) return;
          gsap.to(nav, { y: self.direction === 1 && self.scroll() > 150 ? -80 : 0, duration: 0.4, ease: 'power3.out' });
        },
      });
    }, appRef);

    return () => { gsap.ticker.remove(raf); ctx.revert(); lenis.destroy(); };
  }, [loaded]);

  const scrollTo = id => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* PRELOADER */}
      <div className={`preloader ${loaded ? 'preloader--done' : ''}`}>
        <div style={{ textAlign:'center' }}>
          <div className="preloader__logo">maowiz<span>.</span></div>
          <div className="preloader__bar"><div className="preloader__fill" /></div>
        </div>
      </div>

      <div ref={appRef} style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s' }}>

        {/* ─── NAV ─── */}
        <nav className="site-nav">
          <div className="site-nav__inner">
            <a href="#hero" className="site-nav__brand" onClick={e => { e.preventDefault(); scrollTo('#hero'); }}>
              maowiz<span>.</span>
            </a>
            <div className="site-nav__links">
              {navItems.map(item => (
                <a key={item.href} href={item.href} className="site-nav__link">{item.label}</a>
              ))}
            </div>
            <a href="./assets/maowiz_resume.pdf" target="_blank" rel="noopener noreferrer" className="site-nav__cta">
              <FiDownload size={11} /> Resume
            </a>
          </div>
        </nav>

        {/* ─── DOCK ─── */}
        <div className="dock-wrap">
          <Dock items={[
            { icon: <FiHome size={18} />,      label: 'Home',     onClick: () => scrollTo('#hero') },
            { icon: <FiUser size={18} />,      label: 'About',    onClick: () => scrollTo('#about') },
            { icon: <FiBriefcase size={18} />, label: 'Work',     onClick: () => scrollTo('#experience') },
            { icon: <FiLayers size={18} />,    label: 'Projects', onClick: () => scrollTo('#projects') },
            { icon: <FiMail size={18} />,      label: 'Contact',  onClick: () => scrollTo('#contact') },
          ]} panelHeight={52} baseItemSize={44} magnification={62} />
        </div>

        <main>
          {/* ═══ HERO ═══ */}
          <section id="hero" style={{ minHeight:'100vh', position:'relative', overflow:'hidden' }}>
            {/* LaserFlow — more alive, faster wisp and flow */}
             <div className="hero-bg" style={{ position:'absolute', inset:0, zIndex:0, opacity:0.9, pointerEvents:'none' }}>
              <LaserFlow
                color="#8B5CF6"
                wispDensity={0.6} wispSpeed={15} wispIntensity={3.5}
                flowSpeed={0.35} fogIntensity={0.25} fogScale={0.3}
                decay={0.8} falloffStart={0.8}
              />
            </div>
            <div style={{ position:'absolute', inset:0, zIndex:1, background:'linear-gradient(180deg, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.6) 60%, var(--bg-base) 100%)' }} />

            <div className="container" style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', minHeight:'100vh', paddingTop:'96px', paddingBottom:'80px' }}>
              {/* Two-column on desktop, stacked on mobile */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'3rem', alignItems:'center', width:'100%' }}>
                {/* Desktop 2-col override via max-width */}
                <style>{`
                  @media (min-width: 960px) {
                    .hero-grid { grid-template-columns: 1.4fr 0.6fr !important; }
                  }
                `}</style>
                <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:'3rem', alignItems:'center', width:'100%' }}>

                  {/* Left text */}
                  <div>
                    <div className="hero-badge" style={{
                      display:'inline-flex', alignItems:'center', gap:'0.5rem',
                      padding:'0.35rem 0.9rem',
                      background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.3)',
                      borderRadius:'9999px', marginBottom:'1.5rem',
                    }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 8px #22c55e', display:'block' }} />
                      <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', color:'#a78bfa', letterSpacing:'0.1em' }}>
                        Open to new roles
                      </span>
                    </div>

                    <h1 className="hero-name" style={{
                      fontSize:'clamp(3rem, 9vw, 6rem)',
                      fontWeight:900, lineHeight:0.92,
                      letterSpacing:'-0.04em', color:'var(--text-primary)',
                      marginBottom:'1rem',
                    }}>
                      Maowiz<br />Saleem
                    </h1>

                    <div className="hero-title-line" style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                      <div style={{ width:40, height:2, background:'var(--accent)', flexShrink:0 }} />
                      <span style={{
                        fontFamily:'JetBrains Mono, monospace',
                        fontSize:'0.75rem', color:'var(--text-accent)',
                        letterSpacing:'0.15em', textTransform:'uppercase',
                      }}>{personalInfo.title}</span>
                    </div>

                    <p className="hero-tagline" style={{
                      fontSize:'clamp(0.95rem, 2vw, 1.15rem)',
                      color:'var(--text-secondary)',
                      maxWidth:460, lineHeight:1.75,
                      marginBottom:'2rem',
                    }}>{personalInfo.tagline}</p>

                    {/* CTA Buttons */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'3.5rem', width:'100%' }}>
                      <a
                        href="./assets/maowiz_resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ flex:'1 1 160px', maxWidth:'280px' }}
                      >
                        View Resume <FiDownload size={14} />
                      </a>
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="btn-ghost"
                        style={{ flex:'1 1 160px', maxWidth:'280px' }}
                      >
                        Get In Touch <FiMail size={14} />
                      </a>
                    </div>

                    {/* Stats — 2-col mobile, 4-col desktop */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
                      {stats.map((s, i) => (
                        <div key={i} className="stat-card">
                          <AnimatedCounter target={s.value} suffix={s.suffix} fontSize={28} />
                          <div className="stat-card__label">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right — photo (hidden on mobile via CSS) */}
                  <div className="hero-visual" style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <style>{`.hero-visual { display: none; } @media (min-width: 960px) { .hero-visual { display: flex !important; } }`}</style>
                    <TiltedCard
                      imageSrc={personalInfo.avatar} altText="Maowiz Saleem"
                      captionText={personalInfo.title}
                      containerHeight="400px" containerWidth="300px"
                      imageHeight="400px" imageWidth="300px"
                      rotateAmplitude={10} scaleOnHover={1.04}
                      displayOverlayContent
                      overlayContent={
                        <div style={{
                          position:'absolute', bottom:0, left:0, right:0,
                          background:'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                          padding:'1.5rem 1.25rem',
                        }}>
                          <DecryptedText text="MAOWIZ SALEEM" speed={70}
                            className="text-white font-bold tracking-widest"
                            style={{ fontSize:'0.75rem' }} />
                          <span style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.65rem', color:'#a78bfa', display:'block', marginTop:'2px' }}>
                            {personalInfo.title}
                          </span>
                        </div>
                      }
                    />
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* ═══ ABOUT ═══ */}
          <section id="about" className="section" style={{ background:'var(--bg-base)' }}>
            <div className="container">
              <div className="reveal" style={{ marginBottom:'1.5rem' }}>
                <div className="section__label">About</div>
              </div>
              <div className="reveal" style={{ maxWidth:800 }}>
                <ScrollReveal
                  baseOpacity={0.15} enableBlur blurStrength={3}
                  textClassName="about-reveal-text"
                  containerClassName=""
                  rotationEnd="bottom 75%" wordAnimationEnd="bottom 75%"
                >
                  {summary}
                </ScrollReveal>
                <style>{`.about-reveal-text { font-size: clamp(1.25rem, 3vw, 2rem); font-weight: 600; line-height: 1.55; letter-spacing: -0.01em; color: var(--text-primary); }`}</style>
              </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE — LetterGlitch background ═══ */}
          <section id="experience" style={{ position:'relative', overflow:'hidden' }}>
            {/* LetterGlitch background made more visible */}
            <div style={{ position:'absolute', inset:0, zIndex:0, opacity:0.25 }}>
              <LetterGlitch
                glitchColors={['#1a1a1a','#242424','#2a1a4a']}
                glitchSpeed={50}
                centerVignette outerVignette smooth
              />
            </div>
            <div style={{ position:'relative', zIndex:1, background:'rgba(12,12,12,0.92)', backdropFilter:'blur(2px)' }}>
              <div className="section container" style={{ paddingTop:'5rem', paddingBottom:'5rem' }}>
                <div className="reveal">
                  <div className="section__label">Experience</div>
                  <h2 className="section__title">Where I've Worked</h2>
                </div>
                <div className="reveal-stagger" style={{ marginTop:'2.5rem' }}>
                  {experience.map((exp, i) => (
                    <div key={i} className="exp-item">
                      <div className="exp-item__meta">
                        <div className="exp-item__period">{exp.period}</div>
                        <div className="exp-item__company">{exp.company}</div>
                        <div className="exp-item__location">{exp.location}</div>
                      </div>
                      <div className="exp-item__content">
                        <h3 className="exp-item__title">{exp.title}</h3>
                        <ul className="exp-item__highlights">
                          {exp.highlights.map((h, j) => (
                            <li key={j} className="exp-item__highlight">
                              <span className="exp-item__bullet">▹</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ PROJECTS ═══ */}
          <section id="projects" className="section">
            <div className="container">
              <div className="reveal">
                <div className="section__label">Projects</div>
                <h2 className="section__title">Selected Work</h2>
                <p className="section__desc" style={{ marginBottom:'3rem' }}>
                  End-to-end ML systems built for real clients — from data engineering through deployment.
                </p>
              </div>
              <div className="reveal-stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%,320px), 1fr))', gap:'1.5rem' }}>
                {projects.map(p => (
                  <div key={p.id} className="project-card" onClick={() => setSelectedProject(p)}>
                    <div style={{ overflow:'hidden' }}>
                      <img src={p.image} alt={p.title} className="project-card__image" loading="lazy" />
                    </div>
                    <div className="project-card__body">
                      <div className="project-card__metric">{p.metric}</div>
                      <h3 className="project-card__title">{p.title}</h3>
                      <p className="project-card__subtitle">{p.subtitle}</p>
                      <p className="project-card__desc">{p.description}</p>
                      <div className="project-card__tech">
                        {p.tech.slice(0,5).map(t => <span key={t} className="project-card__tech-tag">{t}</span>)}
                      </div>
                      <div className="project-card__links">
                        {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-card__link" onClick={e=>e.stopPropagation()}><FiExternalLink size={11}/> Live</a>}
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="project-card__link" onClick={e=>e.stopPropagation()}><FiGithub size={11}/> Code</a>
                        <span style={{ marginLeft:'auto', fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', color:'var(--text-muted)' }}>Details →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ SKILLS — GridScan background ═══ */}
          <section id="skills" style={{ position:'relative', overflow:'hidden' }}>
            {/* GridScan confined to skills section, increased opacity */}
            <div style={{ position:'absolute', inset:0, zIndex:0, opacity:0.4 }}>
              <GridScan
                sensitivity={0.2}
                linesColor="#1e1e2e"
                scanColor="#6d28d9"
                scanOpacity={0.5}
                gridScale={0.12}
                scanDirection="horizontal"
                enablePost={false}
              />
            </div>
            <div style={{ position:'relative', zIndex:1, background:'rgba(12,12,12,0.85)' }}>
              <div className="section container" style={{ paddingTop:'5rem', paddingBottom:'5rem' }}>
                <div className="reveal">
                  <div className="section__label">Skills</div>
                  <h2 className="section__title">Tech Stack</h2>
                  <p className="section__desc" style={{ marginBottom:'2.5rem' }}>
                    Tools and frameworks I use to build production ML systems.
                  </p>
                </div>
                <div className="reveal-stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 250px), 1fr))', gap:'1rem', marginBottom:'3rem' }}>
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="skill-card">
                      <h3 className="skill-card__title">{category}</h3>
                      <div className="skill-card__tags">
                        {items.map(skill => <span key={skill} className="skill-card__tag">{skill}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="reveal" style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', padding:'2rem 0', overflow:'hidden' }}>
                  <LogoLoop logos={toolLogos} speed={38} direction="left" logoHeight={34} gap={52} hoverSpeed={0} fadeOut fadeOutColor="transparent" />
                </div>
              </div>
            </div>
          </section>

          {/* ═══ EDUCATION ═══ */}
          <section className="section" style={{ background:'var(--bg-base)' }}>
            <div className="container">
              <div className="reveal">
                <div className="section__label">Education</div>
                <h2 className="section__title">Credentials</h2>
              </div>
              
              {/* Credentials mapping — Using the large project-card style requested by user */}
              <div className="reveal-stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap:'2rem', marginTop:'3rem' }}>
                <div className="project-card" style={{ cursor: 'default' }}>
                  <div style={{ overflow: 'hidden' }}>
                    <img src={education.image} alt={education.school} className="project-card__image" loading="lazy" />
                  </div>
                  <div className="project-card__body">
                    <div className="project-card__metric">{education.cgpa} CGPA</div>
                    <h3 className="project-card__title">{education.degree}</h3>
                    <p className="project-card__subtitle">{education.school}</p>
                    <p className="project-card__desc">Graduating {education.expected} · {education.honor}</p>
                  </div>
                </div>

                {certifications.map((cert, i) => (
                  <a key={i} href={cert.url} target="_blank" rel="noopener noreferrer" className="project-card" style={{ textDecoration:'none', display: 'block' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <img src={cert.image} alt={cert.issuer} className="project-card__image" loading="lazy" />
                    </div>
                    <div className="project-card__body">
                      <div className="project-card__metric">{cert.badge}</div>
                      <h3 className="project-card__title">{cert.title}</h3>
                      <p className="project-card__subtitle">{cert.issuer} · {cert.year}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ═══ CONTACT — Particles background ═══ */}
          <footer id="contact" style={{ position:'relative', overflow:'hidden', borderTop:'1px solid var(--border)' }}>
            {/* Particles — ambient dots in the contact section */}
            <div style={{ position:'absolute', inset:0, zIndex:0 }}>
              <Particles
                particleCount={120}
                particleSpread={12}
                speed={0.06}
                particleColors={['#8B5CF6', '#6d28d9', '#a78bfa', '#ffffff']}
                alphaParticles
                particleBaseSize={80}
                sizeRandomness={1.2}
                moveParticlesOnHover
                particleHoverFactor={0.5}
                disableRotation={false}
                cameraDistance={22}
              />
            </div>
            <div style={{ position:'relative', zIndex:1, background:'rgba(12,12,12,0.82)', backdropFilter:'blur(4px)' }}>
              <div className="section container" style={{ paddingTop:'5rem', paddingBottom:'4rem' }}>
                <div className="reveal" style={{ maxWidth:560 }}>
                  <div className="section__label">Contact</div>
                  <h2 style={{ fontSize:'clamp(2rem, 6vw, 3.5rem)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05, color:'var(--text-primary)', marginBottom:'1rem' }}>
                    Let's build<br />
                    <span style={{ color:'var(--text-muted)' }}>something great.</span>
                  </h2>
                  <p style={{ fontSize:'1.05rem', color:'var(--text-secondary)', lineHeight:1.75, marginBottom:'2rem', maxWidth:440 }}>
                    Open to full-time roles, contract work, and AI research collaborations. Let's talk.
                  </p>
                  <a href={`mailto:${personalInfo.email}`}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:'0.5rem',
                      fontSize:'clamp(0.9rem, 2.5vw, 1.35rem)',
                      fontWeight:700, color:'var(--text-primary)', textDecoration:'none',
                      transition:'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color='var(--text-accent)'}
                    onMouseLeave={e => e.currentTarget.style.color='var(--text-primary)'}>
                    {personalInfo.email} <FiArrowUpRight size={18} />
                  </a>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8 w-full max-w-[280px] sm:max-w-none">
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 whitespace-nowrap">
                      LinkedIn <FiArrowUpRight size={13} />
                    </a>
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 whitespace-nowrap">
                      GitHub <FiGithub size={13} />
                    </a>
                    <a href="./assets/maowiz_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 whitespace-nowrap">
                      Resume <FiDownload size={13} />
                    </a>
                  </div>
                </div>

                <div style={{ marginTop:'4rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
                  <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', color:'var(--text-muted)' }}>
                    © {new Date().getFullYear()} {personalInfo.name}
                  </p>
                  <p style={{ fontFamily:'JetBrains Mono, monospace', fontSize:'0.7rem', color:'var(--text-muted)' }}>
                    Designed & built with precision
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <ProjectModal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} project={selectedProject} />
    </>
  );
}
