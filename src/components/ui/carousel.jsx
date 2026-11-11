'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { media } from '@/styles/theme';

const Wrap = styled.div`
  position: relative;
`;

const Viewport = styled.div`
  display: flex;
  gap: var(--carousel-gap, 14px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 4px;

  &::-webkit-scrollbar { display: none; }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 4px;
    border-radius: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

const Cell = styled.div`
  flex: 0 0 var(--carousel-item, 300px);
  min-width: 0;
  scroll-snap-align: start;
  display: flex;

  > * { width: 100%; }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(20, 20, 24, 0.5);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  -webkit-backdrop-filter: blur(12px) saturate(130%);
  backdrop-filter: blur(12px) saturate(130%);
  transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: rgba(19, 19, 23, 0.94);
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
    color: #ffffff;
    box-shadow: 0 0 26px rgba(242, 106, 13, 0.25);
  }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 2px; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }

  ${media.sm} {
    width: 42px;
    height: 42px;
  }
`;

export function Carousel({
  items = [],
  renderItem,
  label,
  itemWidth = '300px',
  gap = '14px',
  controls = true,
  autoplay = false,
  interval = 6000,
  className,
}) {
  const viewportRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  const measure = useCallback(() => {
    const node = viewportRef.current;
    if (!node) return;
    setCanPrev(node.scrollLeft > 4);
    setCanNext(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  }, []);

  useEffect(() => {
    measure();
    const node = viewportRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure, items.length]);

  const step = useCallback(
    (direction) => {
      const node = viewportRef.current;
      if (!node) return;
      node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' });
    },
    [reduce],
  );

  useEffect(() => {
    if (!autoplay || paused || reduce || items.length < 2) return undefined;
    const timer = window.setInterval(() => {
      const node = viewportRef.current;
      if (!node) return;
      if (node.scrollLeft + node.clientWidth >= node.scrollWidth - 8) {
        node.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        step(1);
      }
    }, Math.max(2500, interval));
    return () => window.clearInterval(timer);
  }, [autoplay, paused, reduce, items.length, interval, step]);

  if (!items.length) return null;

  return (
    <Wrap className={className}>
      {controls && items.length > 1 ? (
        <Nav>
          <NavButton type="button" onClick={() => step(-1)} disabled={!canPrev} aria-label={`Previous ${label || 'items'}`}>
            <ChevronLeft size={17} aria-hidden="true" />
          </NavButton>
          <NavButton type="button" onClick={() => step(1)} disabled={!canNext} aria-label={`Next ${label || 'items'}`}>
            <ChevronRight size={17} aria-hidden="true" />
          </NavButton>
        </Nav>
      ) : null}

      <Viewport
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={label || 'Carousel'}
        tabIndex={0}
        style={{ '--carousel-item': itemWidth, '--carousel-gap': gap }}
        onScroll={measure}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          }
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
      >
        {items.map((item, index) => (
          <Cell
            key={item.id || item.url || index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            {renderItem(item, index)}
          </Cell>
        ))}
      </Viewport>
    </Wrap>
  );
}
