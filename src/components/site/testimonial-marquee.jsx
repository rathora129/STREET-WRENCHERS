'use client';

import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassCard } from '@/styles/glass';
import { Button } from '@/components/ui/button';
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

const EmptyShell = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};

  ${media.md} {
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
  }
`;

const EmptyMedia = styled.div`
  position: relative;
  min-height: 172px;
  background: #101014;

  img { object-fit: cover; }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, rgba(11, 11, 13, 0.05) 0%, rgba(11, 11, 13, 0.62) 100%),
      linear-gradient(90deg, transparent 55%, rgba(19, 19, 23, 0.85) 100%);
    pointer-events: none;
  }

  ${media.md} {
    min-height: 100%;
  }
`;

const EmptyBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 13px;
  padding: clamp(22px, 3.2vw, 36px);
`;

const EmptyTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  align-self: flex-start;
  padding: 6px 11px;
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid rgba(242, 106, 13, 0.3);
  background: rgba(242, 106, 13, 0.08);
  color: ${({ theme }) => theme.colors.brand};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

const EmptyTitle = styled.p`
  max-width: 30ch;
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 600;
  line-height: 1.27;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.white};
`;

const EmptyText = styled.p`
  max-width: 46ch;
  font-size: 13.5px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.smoke};
`;

const EmptyActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

export function TestimonialsEmpty({ onReviewsPage = false }) {
  return (
    <EmptyShell data-testimonials-empty>
      <EmptyMedia>
        <Image
          src="/assets/images/hero/workshop.jpg"
          alt="Technician working on a car in the Street Wrenchers workshop"
          fill
          sizes="(min-width: 768px) 34vw, 100vw"
        />
      </EmptyMedia>
      <EmptyBody>
        <EmptyTag>
          <BadgeCheck size={12} aria-hidden="true" /> Verified reviews only
        </EmptyTag>
        <EmptyTitle>Customer stories will appear here as verified reviews are approved.</EmptyTitle>
        <EmptyText>
          Every review is confirmed with the customer before it is published, so the feedback you read here is genuine.
        </EmptyText>
        <EmptyActions>
          {onReviewsPage ? (
            <>
              <Button href="/book" size="sm">Book a service</Button>
              <Button href="/contact" variant="outline" size="sm">Contact the workshop</Button>
            </>
          ) : (
            <>
              <Button href="/reviews" size="sm">Visit reviews page</Button>
              <Button href="/contact" variant="outline" size="sm">Share your experience</Button>
            </>
          )}
        </EmptyActions>
      </EmptyBody>
    </EmptyShell>
  );
}

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
