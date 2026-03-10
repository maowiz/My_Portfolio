import { useEffect, useRef } from 'react';
import {
  EffectComposer,
  RenderPass,
  EffectPass,
  BloomEffect,
  ChromaticAberrationEffect,
} from 'postprocessing';
import * as THREE from 'three';
import './GridScan.css';

/* ── shaders ── */
const vert = `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;
uniform float uScanStarts[8];
uniform float uScanCount;
const int MAX_SCANS = 8;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define EPS 1e-6
float smoother01(float a,float b,float x){float t=clamp((x-a)/max(1e-5,(b-a)),0.,1.);return t*t*t*(t*(t*6.-15.)+10.);}
void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 p=(2.*fragCoord-iResolution.xy)/iResolution.y;
  vec3 ro=vec3(0.);vec3 rd=normalize(vec3(p,2.));
  float cR=cos(uTilt),sR=sin(uTilt);rd.xy=mat2(cR,-sR,sR,cR)*rd.xy;
  float cY=cos(uYaw),sY=sin(uYaw);rd.xz=mat2(cY,-sY,sY,cY)*rd.xz;
  vec2 skew=clamp(uSkew,vec2(-.7),vec2(.7));rd.xy+=skew*rd.z;
  vec3 color=vec3(0.);float minT=1e20;float gridScale=max(1e-5,uGridScale);
  float fadeStrength=2.;vec2 gridUV=vec2(0.);float hitIsY=1.;
  for(int i=0;i<4;i++){
    float isY=float(i<2);
    float pos=mix(-.2,.2,float(i))*isY+mix(-.5,.5,float(i-2))*(1.-isY);
    float num=pos-(isY*ro.y+(1.-isY)*ro.x);float den=isY*rd.y+(1.-isY)*rd.x;
    float t=num/den;vec3 h=ro+rd*t;
    float depthBoost=smoothstep(0.,3.,h.z);h.xy+=skew*.15*depthBoost;
    bool use=t>0.&&t<minT;gridUV=use?mix(h.zy,h.xz,isY)/gridScale:gridUV;
    minT=use?t:minT;hitIsY=use?isY:hitIsY;
  }
  vec3 hit=ro+rd*minT;float dist=length(hit-ro);
  float jitterAmt=clamp(uLineJitter,0.,1.);
  if(jitterAmt>0.){vec2 j=vec2(sin(gridUV.y*2.7+iTime*1.8),cos(gridUV.x*2.3-iTime*1.6))*(0.15*jitterAmt);gridUV+=j;}
  float fx=fract(gridUV.x);float fy=fract(gridUV.y);
  float ax=min(fx,1.-fx);float ay=min(fy,1.-fy);
  float wx=fwidth(gridUV.x);float wy=fwidth(gridUV.y);
  float halfPx=max(0.,uLineThickness)*.5;
  float tx=halfPx*wx;float ty=halfPx*wy;float aax=wx;float aay=wy;
  float lineX=1.-smoothstep(tx,tx+aax,ax);float lineY=1.-smoothstep(ty,ty+aay,ay);
  if(uLineStyle>.5){float dr=4.;float dd=.5;float vy=fract(gridUV.y*dr);float vx=fract(gridUV.x*dr);
    float dmy=step(vy,dd);float dmx=step(vx,dd);
    if(uLineStyle<1.5){lineX*=dmy;lineY*=dmx;}else{
      float dotr=6.;float dotw=.18;float cy2=abs(fract(gridUV.y*dotr)-.5);float cx2=abs(fract(gridUV.x*dotr)-.5);
      lineX*=1.-smoothstep(dotw,dotw+fwidth(gridUV.y*dotr),cy2);
      lineY*=1.-smoothstep(dotw,dotw+fwidth(gridUV.x*dotr),cx2);
    }}
  float primaryMask=max(lineX,lineY);
  vec2 gUV2=(hitIsY>.5?hit.xz:hit.zy)/gridScale;
  if(jitterAmt>0.){vec2 j2=vec2(cos(gUV2.y*2.1-iTime*1.4),sin(gUV2.x*2.5+iTime*1.7))*(0.15*jitterAmt);gUV2+=j2;}
  float fx2=fract(gUV2.x);float fy2=fract(gUV2.y);float ax2=min(fx2,1.-fx2);float ay2=min(fy2,1.-fy2);
  float wx2=fwidth(gUV2.x);float wy2=fwidth(gUV2.y);float tx2=halfPx*wx2;float ty2=halfPx*wy2;
  float lineX2=1.-smoothstep(tx2,tx2+wx2,ax2);float lineY2=1.-smoothstep(ty2,ty2+wy2,ay2);
  if(uLineStyle>.5){float dr2=4.;float dd2=.5;float vy2m=fract(gUV2.y*dr2);float vx2m=fract(gUV2.x*dr2);
    float dmy2=step(vy2m,dd2);float dmx2=step(vx2m,dd2);
    if(uLineStyle<1.5){lineX2*=dmy2;lineY2*=dmx2;}else{
      float dotr2=6.;float dotw2=.18;float cy3=abs(fract(gUV2.y*dotr2)-.5);float cx3=abs(fract(gUV2.x*dotr2)-.5);
      lineX2*=1.-smoothstep(dotw2,dotw2+fwidth(gUV2.y*dotr2),cy3);
      lineY2*=1.-smoothstep(dotw2,dotw2+fwidth(gUV2.x*dotr2),cx3);
    }}
  float altMask=max(lineX2,lineY2);
  float edgeDistX=min(abs(hit.x-(-.5)),abs(hit.x-.5));float edgeDistY=min(abs(hit.y-(-.2)),abs(hit.y-.2));
  float edgeDist=mix(edgeDistY,edgeDistX,hitIsY);float edgeGate=1.-smoothstep(gridScale*.5,gridScale*2.,edgeDist);
  altMask*=edgeGate;float lineMask=max(primaryMask,altMask);float fade=exp(-dist*fadeStrength);
  float dur=max(.05,uScanDuration);float del=max(0.,uScanDelay);float scanZMax=2.;
  float widthScale=max(.1,uScanGlow);float sigma=max(.001,.18*widthScale*uScanSoftness);float sigmaA=sigma*2.;
  float combinedPulse=0.;float combinedAura=0.;
  float cycle=dur+del;float tCycle=mod(iTime,cycle);float scanPhase=clamp((tCycle-del)/dur,0.,1.);
  float phase=scanPhase;
  if(uScanDirection>.5&&uScanDirection<1.5){phase=1.-phase;}
  else if(uScanDirection>1.5){float t2=mod(max(0.,iTime-del),2.*dur);phase=(t2<dur)?(t2/dur):(1.-(t2-dur)/dur);}
  float scanZ=phase*scanZMax;float dz=abs(hit.z-scanZ);
  float lineBand=exp(-.5*(dz*dz)/(sigma*sigma));
  float taper=clamp(uPhaseTaper,0.,.49);float headW=taper;float tailW=taper;
  float headFade2=smoother01(0.,headW,phase);float tailFade2=1.-smoother01(1.-tailW,1.,phase);
  float phaseWindow=headFade2*tailFade2;
  combinedPulse+=lineBand*phaseWindow*clamp(uScanOpacity,0.,1.);
  float auraBand=exp(-.5*(dz*dz)/(sigmaA*sigmaA));
  combinedAura+=(auraBand*.25)*phaseWindow*clamp(uScanOpacity,0.,1.);
  for(int i=0;i<MAX_SCANS;i++){
    if(float(i)>=uScanCount)break;
    float tAI=iTime-uScanStarts[i];float pI=clamp(tAI/dur,0.,1.);
    if(uScanDirection>.5&&uScanDirection<1.5){pI=1.-pI;}
    else if(uScanDirection>1.5){pI=(pI<.5)?(pI*2.):(1.-(pI-.5)*2.);}
    float sZI=pI*scanZMax;float dzI=abs(hit.z-sZI);
    float lBI=exp(-.5*(dzI*dzI)/(sigma*sigma));
    float hFI=smoother01(0.,headW,pI);float tFI=1.-smoother01(1.-tailW,1.,pI);
    combinedPulse+=lBI*hFI*tFI*clamp(uScanOpacity,0.,1.);
    float aBI=exp(-.5*(dzI*dzI)/(sigmaA*sigmaA));
    combinedAura+=(aBI*.25)*hFI*tFI*clamp(uScanOpacity,0.,1.);
  }
  float lineVis=lineMask;vec3 gridCol=uLinesColor*lineVis*fade;
  vec3 scanCol=uScanColor*combinedPulse;vec3 scanAura=uScanColor*combinedAura;
  color=gridCol+scanCol+scanAura;
  float n=fract(sin(dot(gl_FragCoord.xy+vec2(iTime*123.4),vec2(12.9898,78.233)))*43758.5453123);
  color+=(n-.5)*uNoise;color=clamp(color,0.,1.);
  float alpha=clamp(max(lineVis,combinedPulse),0.,1.);
  float gx=1.-smoothstep(tx*2.,tx*2.+aax*2.,ax);float gy=1.-smoothstep(ty*2.,ty*2.+aay*2.,ay);
  float halo=max(gx,gy)*fade;alpha=max(alpha,halo*clamp(uBloomOpacity,0.,1.));
  fragColor=vec4(color,alpha);
}
void main(){vec4 c;mainImage(c,vUv*iResolution.xy);gl_FragColor=c;}
`;

/* ── helpers ── */
function srgbColor(hex) {
  return new THREE.Color(hex).convertSRGBToLinear();
}

function smoothDampVec2(current, target, vel, smoothTime, maxSpeed, dt) {
  const out = current.clone();
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current.clone().sub(target);
  const maxChange = maxSpeed * smoothTime;
  if (change.length() > maxChange) change.setLength(maxChange);
  const tgt = current.clone().sub(change);
  const temp = vel
    .clone()
    .addScaledVector(change, omega)
    .multiplyScalar(dt);
  vel.sub(temp.clone().multiplyScalar(omega)).multiplyScalar(exp);
  out.copy(tgt.clone().add(change.add(temp).multiplyScalar(exp)));
  if (target.clone().sub(current).dot(out.clone().sub(target)) > 0) {
    out.copy(target);
    vel.set(0, 0);
  }
  return out;
}

function smoothDampFloat(current, target, velRef, smoothTime, maxSpeed, dt) {
  smoothTime = Math.max(0.0001, smoothTime);
  const omega = 2 / smoothTime;
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  let change = current - target;
  const maxChange = maxSpeed * smoothTime;
  change = Math.sign(change) * Math.min(Math.abs(change), maxChange);
  const tgt = current - change;
  const temp = (velRef.v + omega * change) * dt;
  velRef.v = (velRef.v - omega * temp) * exp;
  let out = tgt + (change + temp) * exp;
  if ((target - current) * (out - target) > 0) {
    out = target;
    velRef.v = 0;
  }
  return { value: out, v: velRef.v };
}

/* ── component ── */
export const GridScan = ({
  sensitivity = 0.55,
  lineThickness = 1,
  linesColor = '#392e4e',
  scanColor = '#FF9FFC',
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineStyle = 'solid',
  lineJitter = 0.1,
  scanDirection = 'pingpong',
  enablePost = true,
  bloomIntensity = 0,
  bloomThreshold = 0,
  bloomSmoothing = 0,
  chromaticAberration = 0.002,
  noiseIntensity = 0.01,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanPhaseTaper = 0.9,
  scanDuration = 2.0,
  scanDelay = 2.0,
  snapBackDelay = 250,
  className,
  style,
}) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const composerRef = useRef(null);
  const bloomRef = useRef(null);
  const chromaRef = useRef(null);
  const rafRef = useRef(null);

  const lookTarget = useRef(new THREE.Vector2(0, 0));
  const tiltTarget = useRef(0);
  const yawTarget = useRef(0);
  const lookCurrent = useRef(new THREE.Vector2(0, 0));
  const lookVel = useRef(new THREE.Vector2(0, 0));
  const tiltCurrent = useRef(0);
  const tiltVel = useRef(0);
  const yawCurrent = useRef(0);
  const yawVel = useRef(0);

  const MAX_SCANS = 8;
  const scanStartsRef = useRef([]);

  const s = THREE.MathUtils.clamp(sensitivity, 0, 1);
  const skewScale = THREE.MathUtils.lerp(0.06, 0.2, s);
  const tiltScale = THREE.MathUtils.lerp(0.12, 0.3, s);
  const yawScale = THREE.MathUtils.lerp(0.1, 0.28, s);
  const smoothTime = THREE.MathUtils.lerp(0.45, 0.12, s);
  const maxSpeed = Infinity;
  const yBoost = THREE.MathUtils.lerp(1.2, 1.6, s);

  /* ── global mouse (works behind pointer-events:none parents) ── */
  useEffect(() => {
    let leaveTimer = null;

    const onMove = (e) => {
      if (leaveTimer) {
        clearTimeout(leaveTimer);
        leaveTimer = null;
      }
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      lookTarget.current.set(nx, ny);
    };

    const onLeave = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        lookTarget.current.set(0, 0);
        tiltTarget.current = 0;
        yawTarget.current = 0;
      }, Math.max(0, snapBackDelay));
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [snapBackDelay]);

  /* ── Three.js renderer + shader ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const uniforms = {
      iResolution: {
        value: new THREE.Vector3(
          container.clientWidth,
          container.clientHeight,
          renderer.getPixelRatio()
        ),
      },
      iTime: { value: 0 },
      uSkew: { value: new THREE.Vector2(0, 0) },
      uTilt: { value: 0 },
      uYaw: { value: 0 },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineStyle: { value: lineStyle === 'dashed' ? 1 : lineStyle === 'dotted' ? 2 : 0 },
      uLineJitter: { value: Math.max(0, Math.min(1, lineJitter || 0)) },
      uScanOpacity: { value: scanOpacity },
      uNoise: { value: noiseIntensity },
      uBloomOpacity: { value: bloomIntensity },
      uScanGlow: { value: scanGlow },
      uScanSoftness: { value: scanSoftness },
      uPhaseTaper: { value: scanPhaseTaper },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: scanDelay },
      uScanDirection: {
        value: scanDirection === 'backward' ? 1 : scanDirection === 'pingpong' ? 2 : 0,
      },
      uScanStarts: { value: new Array(MAX_SCANS).fill(0) },
      uScanCount: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    let composer = null;
    if (enablePost) {
      composer = new EffectComposer(renderer);
      composerRef.current = composer;
      composer.addPass(new RenderPass(scene, camera));
      const bloom = new BloomEffect({
        intensity: 1.0,
        luminanceThreshold: bloomThreshold,
        luminanceSmoothing: bloomSmoothing,
      });
      bloom.blendMode.opacity.value = Math.max(0, bloomIntensity);
      bloomRef.current = bloom;
      const chroma = new ChromaticAberrationEffect({
        offset: new THREE.Vector2(chromaticAberration, chromaticAberration),
        radialModulation: true,
        modulationOffset: 0.0,
      });
      chromaRef.current = chroma;
      const fx = new EffectPass(camera, bloom, chroma);
      fx.renderToScreen = true;
      composer.addPass(fx);
    }

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.iResolution.value.set(
        container.clientWidth,
        container.clientHeight,
        renderer.getPixelRatio()
      );
      if (composerRef.current)
        composerRef.current.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let last = performance.now();
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
      last = now;

      lookCurrent.current.copy(
        smoothDampVec2(
          lookCurrent.current,
          lookTarget.current,
          lookVel.current,
          smoothTime,
          maxSpeed,
          dt
        )
      );
      const tiltSm = smoothDampFloat(
        tiltCurrent.current,
        tiltTarget.current,
        { v: tiltVel.current },
        smoothTime,
        maxSpeed,
        dt
      );
      tiltCurrent.current = tiltSm.value;
      tiltVel.current = tiltSm.v;
      const yawSm = smoothDampFloat(
        yawCurrent.current,
        yawTarget.current,
        { v: yawVel.current },
        smoothTime,
        maxSpeed,
        dt
      );
      yawCurrent.current = yawSm.value;
      yawVel.current = yawSm.v;

      const skew = new THREE.Vector2(
        lookCurrent.current.x * skewScale,
        -lookCurrent.current.y * yBoost * skewScale
      );
      material.uniforms.uSkew.value.set(skew.x, skew.y);
      material.uniforms.uTilt.value = tiltCurrent.current * tiltScale;
      material.uniforms.uYaw.value = THREE.MathUtils.clamp(
        yawCurrent.current * yawScale,
        -0.6,
        0.6
      );
      material.uniforms.iTime.value = now / 1000;

      renderer.clear(true, true, true);
      if (composerRef.current) composerRef.current.render(dt);
      else renderer.render(scene, camera);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      material.dispose();
      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`gridscan${className ? ` ${className}` : ''}`}
      style={style}
    />
  );
};

export default GridScan;