'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ArrowRight, Check, ChevronLeft, ChevronRight, HelpCircle, Sparkles, X } from 'lucide-react';
import { GUIDE_STEPS, GUIDE_STORAGE_KEY, findHelpTopic } from '@/lib/dashboard-guide';

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
`;

const Trigger = styled.button`
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.muted};
  cursor: pointer;

  &:hover {
    border-color: rgba(242, 106, 13, 0.55);
    color: ${({ theme }) => theme.colors.brand};
  }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 2px; }
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 70;
  width: min(350px, 86vw);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  background: ${({ theme }) => theme.colors.surfaceRaised};
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  text-align: left;

  h3 {
    margin: 0 0 6px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 14px;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
  }

  ol {
    margin: 10px 0 0;
    padding-left: 18px;
    display: grid;
    gap: 5px;
    font-size: 11.8px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.smoke};
  }

  .effect {
    margin-top: 11px;
    padding: 9px 10px;
    border-radius: 7px;
    border: 1px solid rgba(242, 106, 13, 0.25);
    background: rgba(242, 106, 13, 0.07);
    color: ${({ theme }) => theme.colors.smoke};
    font-size: 11.5px;
    line-height: 1.55;
  }

  .effect b {
    display: block;
    margin-bottom: 2px;
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  a.more {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 12px;
    font-size: 11.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

export function HelpTip({ topicId, label = 'Help for this section' }) {
  const topic = findHelpTopic(topicId);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!topic) return null;

  return (
    <Wrap ref={wrapRef}>
      <Trigger
        type="button"
        aria-label={`${label}: ${topic.title}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`help-tip-${topic.id}`}
        onClick={() => setOpen((value) => !value)}
      >
        <HelpCircle size={15} aria-hidden="true" />
      </Trigger>
      {open ? (
        <Popover id={`help-tip-${topic.id}`} role="dialog" aria-label={`${topic.title} help`}>
          <h3>{topic.title}</h3>
          <p>{topic.summary}</p>
          <ol>
            {topic.steps.slice(0, 3).map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="effect">
            <b>On the website</b>
            {topic.effect}
          </div>
          <Link className="more" href={`/dashboard/help#topic-${topic.id}`} onClick={() => setOpen(false)}>
            Full guide <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </Popover>
      ) : null}
    </Wrap>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(5px);
`;

const TourCard = styled.div`
  width: min(560px, 100%);
  max-height: calc(100svh - 36px);
  overflow-y: auto;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  background: ${({ theme }) => theme.colors.charcoal};
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  outline: none;
`;

const TourHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  h2 {
    margin: 8px 0 0;
    font-size: clamp(20px, 3vw, 26px);
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.white};
  }

  button {
    flex: none;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: transparent;
    color: ${({ theme }) => theme.colors.muted};
    cursor: pointer;
  }

  button:hover { color: ${({ theme }) => theme.colors.white}; border-color: ${({ theme }) => theme.colors.lineStrong}; }
`;

const TourBody = styled.div`
  padding: 20px 24px 22px;

  p {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.smoke};
  }

  .module-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 16px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Progress = styled.div`
  height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  margin-top: 20px;

  span {
    display: block;
    height: 100%;
    width: ${({ $percent }) => `${$percent}%`};
    background: ${({ theme }) => theme.colors.brand};
    transition: width 220ms ease;
  }
`;

const TourFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 16px 24px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  .count {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.dim};
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    height: 38px;
    padding-inline: 15px;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: transparent;
    color: ${({ theme }) => theme.colors.smoke};
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  button:hover:not(:disabled) { background: ${({ theme }) => theme.colors.surface}; color: ${({ theme }) => theme.colors.white}; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }

  button.primary {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
    color: #ffffff;
  }

  button.primary:hover { background: ${({ theme }) => theme.colors.brandBright}; color: #ffffff; }

  button:focus-visible, a:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 2px; }
`;

export function markGuideSeen() {
  try {
    window.localStorage.setItem(GUIDE_STORAGE_KEY, 'done');
  } catch {
    /* storage can be unavailable in private modes */
  }
}

export function GuidedTour({ open, onClose }) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef(null);
  const restoreFocus = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(0);
    restoreFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKey = (event) => {
      if (event.key === 'Escape') {
        markGuideSeen();
        onCloseRef.current();
      }
      if (event.key === 'ArrowRight') setIndex((value) => Math.min(GUIDE_STEPS.length - 1, value + 1));
      if (event.key === 'ArrowLeft') setIndex((value) => Math.max(0, value - 1));
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (restoreFocus.current instanceof HTMLElement) restoreFocus.current.focus();
    };
  }, [open]);

  if (!open) return null;

  const step = GUIDE_STEPS[index];
  const topic = findHelpTopic(step.topicId);
  const last = index === GUIDE_STEPS.length - 1;
  const percent = Math.round(((index + 1) / GUIDE_STEPS.length) * 100);

  const finish = () => {
    markGuideSeen();
    onClose();
  };

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) finish();
      }}
    >
      <TourCard
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
        tabIndex={-1}
      >
        <TourHead>
          <div>
            <span className="eyebrow">
              <Sparkles size={12} aria-hidden="true" /> Guided walkthrough
            </span>
            <h2 id="tour-title">{step.title}</h2>
          </div>
          <button type="button" onClick={finish} aria-label="Close walkthrough">
            <X size={16} aria-hidden="true" />
          </button>
        </TourHead>

        <TourBody id="tour-description">
          <p>{step.description}</p>
          {topic ? (
            <Link className="module-link" href={topic.href} onClick={finish}>
              Open {topic.title} <ArrowRight size={13} aria-hidden="true" />
            </Link>
          ) : null}
          <Progress $percent={percent} aria-hidden="true"><span /></Progress>
        </TourBody>

        <TourFoot>
          <span className="count">{index + 1} of {GUIDE_STEPS.length}</span>
          <div className="actions">
            <button type="button" onClick={finish}>Skip walkthrough</button>
            <button type="button" disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>
              <ChevronLeft size={14} aria-hidden="true" /> Back
            </button>
            {last ? (
              <button type="button" className="primary" onClick={finish}>
                <Check size={14} aria-hidden="true" /> Finish
              </button>
            ) : (
              <button
                type="button"
                className="primary"
                onClick={() => setIndex((value) => Math.min(GUIDE_STEPS.length - 1, value + 1))}
              >
                Next <ChevronRight size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </TourFoot>
      </TourCard>
    </Backdrop>
  );
}
