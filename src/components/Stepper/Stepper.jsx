import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './Stepper.css';

const stepVariants = {
  enter: (d) => ({ x: d >= 0 ? '-100%' : '100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (d) => ({ x: d >= 0 ? '50%' : '-50%', opacity: 0 }),
};

export function Step({ children }) {
  return <div className="step-body">{children}</div>;
}

function StepIndicator({ step, currentStep, onClick, disabled }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  return (
    <motion.div onClick={() => !disabled && step !== currentStep && onClick(step)}
      className="stepper-indicator" animate={status} initial={false}>
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#1a1a2e', color: '#a0a0b5' },
          active: { scale: 1, backgroundColor: '#8B5CF6', color: '#8B5CF6' },
          complete: { scale: 1, backgroundColor: '#8B5CF6', color: '#8B5CF6' },
        }}
        transition={{ duration: 0.3 }}
        className="stepper-indicator-inner"
      >
        {status === 'complete' ? (
          <svg className="stepper-check" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
              strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : status === 'active' ? (
          <div className="stepper-active-dot" />
        ) : (
          <span className="stepper-step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="stepper-connector">
      <motion.div className="stepper-connector-inner"
        initial={false}
        animate={isComplete ? { width: '100%', backgroundColor: '#8B5CF6' } : { width: 0, backgroundColor: 'transparent' }}
        transition={{ duration: 0.4 }} />
    </div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div ref={ref} custom={direction} variants={stepVariants}
      initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}
      style={{ position: 'absolute', left: 0, right: 0, top: 0 }}>
      {children}
    </motion.div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);
  return (
    <motion.div className={className} style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }} transition={{ type: 'spring', duration: 0.4 }}>
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const update = (n) => {
    setCurrentStep(n);
    if (n > totalSteps) onFinalStepCompleted();
    else onStepChange(n);
  };

  return (
    <div className="stepper-outer">
      <div className="stepper-box">
        <div className="stepper-row">
          {stepsArray.map((_, i) => {
            const num = i + 1;
            return (
              <React.Fragment key={num}>
                <StepIndicator step={num} currentStep={currentStep}
                  onClick={(s) => { setDirection(s > currentStep ? 1 : -1); update(s); }} />
                {i < totalSteps - 1 && <StepConnector isComplete={currentStep > num} />}
              </React.Fragment>
            );
          })}
        </div>

        <StepContentWrapper isCompleted={isCompleted} currentStep={currentStep}
          direction={direction} className="stepper-content">
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className="stepper-footer">
            <div className={`stepper-footer-nav ${currentStep !== 1 ? 'spread' : 'end'}`}>
              {currentStep !== 1 && (
                <button onClick={() => { setDirection(-1); update(currentStep - 1); }} className="stepper-back">
                  {backButtonText}
                </button>
              )}
              <button onClick={() => {
                setDirection(1);
                if (isLastStep) update(totalSteps + 1);
                else update(currentStep + 1);
              }} className="stepper-next">
                {isLastStep ? 'Complete' : nextButtonText}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}