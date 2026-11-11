'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReducedMotion } from 'framer-motion';
import { media } from '@/styles/theme';
import { TestimonialCard } from './cards';

const Viewport = styled.div`
  overflow: hidden;
  padding-block: 4px;

  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%);

  ${media.md} {
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 2%, #000 98%, transparent 100%);
    mask-image: linear-gradient(90deg, transparent 0, #000 2%, #000 98%, transparent 100%);
  }
`;

const Track = styled.div`
  display: flex;
  gap: var(--marquee-gap);
  width: max-content;
  will-change: transform;
  touch-action: pan-y;
  cursor: grab;

  &:active { cursor: grabbing; }
`;

const Group = styled.div`
  display: flex;
  gap: var(--marquee-gap);
  flex: none;
`;

const Item = styled.div`
  flex: none;
  width: clamp(264px, 82vw, 380px);
  display: flex;

  > * { width: 100%; height: 100%; }

  ${media.md} {
    width: clamp(290px, 32vw, 380px);
  }
`;

const StaticRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(min(270px, 100%), 1fr));
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;

  ${Item} {
    scroll-snap-align: start;
    width: clamp(272px, 62vw, 380px);
  }
`;

export function TestimonialMarquee({ items = [], speed = 26 }) {
  const reduce = useReducedMotion();
  const trackRef = useRef(null);
  const firstGroupRef = useRef(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const pausedRef = useRef(false);
  const dragRef = useRef(null);

  const loop = items.length >= 3 && !reduce;

  useEffect(() => {
    if (!loop) return undefined;
    const track = trackRef.current;
    const group = firstGroupRef.current;
    if (!track || !group) return undefined;

    const measure = () => {
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
      halfRef.current = group.offsetWidth + gap;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(group);
    observer.observe(track);

    let frame;
    let last = performance.now();
    const tick = (now) => {
      const delta = Math.min(64, now - last);
      last = now;
      if (!pausedRef.current && halfRef.current > 0) {
        offsetRef.current = (offsetRef.current + (speed * delta) / 1000) % halfRef.current;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [loop, speed]);

  if (!loop) {
    if (items.length < 3 && !reduce) {
      return (
        <StaticRow>
          {items.map((testimonial) => (
            <Item key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </Item>
          ))}
        </StaticRow>
      );
    }
    return (
      <ScrollRow role="region" aria-label="Customer testimonials" tabIndex={0}>
        {items.map((testimonial) => (
          <Item key={testimonial.id}>
            <TestimonialCard testimonial={testimonial} />
          </Item>
        ))}
      </ScrollRow>
    );
  }

  const pause = () => { pausedRef.current = true; };
  const resume = () => {
    if (!dragRef.current) pausedRef.current = false;
  };

  return (
    <Viewport
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) resume();
      }}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse') return;
        pause();
        dragRef.current = { x: event.clientX, start: offsetRef.current };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragRef.current || !trackRef.current) return;
        const delta = event.clientX - dragRef.current.x;
        const half = halfRef.current || 1;
        offsetRef.current = ((dragRef.current.start - delta) % half + half) % half;
        trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }}
      onPointerUp={() => {
        dragRef.current = null;
        resume();
      }}
      onPointerCancel={() => {
        dragRef.current = null;
        resume();
      }}
    >
      <Track ref={trackRef} style={{ '--marquee-gap': '16px' }}>
        <Group ref={firstGroupRef}>
          {items.map((testimonial, index) => (
            <Item
              key={testimonial.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              <TestimonialCard testimonial={testimonial} />
            </Item>
          ))}
        </Group>
        <Group aria-hidden="true">
          {items.map((testimonial) => (
            <Item key={`copy-${testimonial.id}`}>
              <TestimonialCard testimonial={testimonial} />
            </Item>
          ))}
        </Group>
      </Track>
    </Viewport>
  );
}
