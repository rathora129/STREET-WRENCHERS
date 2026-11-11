'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { media } from '@/styles/theme';
import { Button } from '@/components/ui/button';
import { Eyebrow, Display, Intro } from '@/components/ui/type';

const Hero = styled.section`
  position: relative;
  min-height: calc(100svh - var(--sw-header-h));
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: #08080a;
  touch-action: pan-y;

  ${media.lg} {
    min-height: max(600px, calc(84svh - var(--sw-header-h)));
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

const Stack = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
`;

const SlideLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  will-change: opacity, transform;

  .desktop { object-fit: cover; }
  .mobile { display: none; object-fit: cover; }

  @media (max-width: 700px) {
    .desktop { display: ${({ $hasMobile }) => ($hasMobile ? 'none' : 'block')}; }
    .mobile { display: ${({ $hasMobile }) => ($hasMobile ? 'block' : 'none')}; }
  }
`;

const Shade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const Grain = styled.div`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.16;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
`;

const Inner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.container};
  margin-inline: auto;
  padding: clamp(28px, 4vw, 48px) ${({ theme }) => theme.layout.gutter} clamp(28px, 4vw, 44px);
  position: relative;
  z-index: 1;
`;

const Content = styled.div`
  max-width: 860px;
  padding-bottom: clamp(20px, 4vw, 44px);
`;

const Title = styled(Display)`
  max-width: 16ch;
  margin-bottom: 18px;
  text-wrap: balance;
`;

const Sub = styled(Intro)`
  color: ${({ theme }) => theme.colors.smoke};
  max-width: 54ch;
  font-size: clamp(15px, 1.35vw, 17px);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 26px;
`;

const Controls = styled.div`
  margin-top: clamp(34px, 5vw, 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px;
`;

const Dot = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 0;
  padding: 4px 0;
  font-size: 10px;
  letter-spacing: 0.16em;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.dim)};
  transition: color 200ms ease;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    width: ${({ $active }) => ($active ? '52px' : '20px')};
    height: 1px;
    background: ${({ $active, theme }) => ($active ? theme.colors.brand : 'rgba(255,255,255,0.25)')};
    transition: width 300ms ease, background 300ms ease;
  }

  &:hover { color: ${({ theme }) => theme.colors.white}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 4px; }
`;

const Arrows = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(8, 8, 10, 0.25);
  backdrop-filter: blur(6px);
  color: ${({ theme }) => theme.colors.white};
  display: grid;
  place-items: center;
  transition: background 200ms ease, border-color 200ms ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
    color: #ffffff;
  }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 3px; }
`;

const ScrollCue = styled.div`
  display: none;
  position: absolute;
  right: ${({ theme }) => theme.layout.gutter};
  bottom: 110px;
  writing-mode: vertical-rl;
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};
  gap: 14px;
  align-items: center;

  &::after {
    content: '';
    width: 1px;
    height: 54px;
    background: linear-gradient(to bottom, rgba(242, 106, 13, 0.8), transparent);
  }

  ${media.lg} { display: flex; }
`;

const fallbackSlide = {
  id: 'fallback',
  title: 'Precision care, built around your car.',
  subtitle:
    'Scheduled servicing, diagnostics, repair and detailing under one roof — for every make and model on Dubai roads.',
  image: '/assets/images/hero/workshop.jpg',
  ctaLabel: 'Book a service',
  ctaHref: '/book',
  overlayOpacity: 50,
};

function overlayStyle(value) {
  const strength = Math.min(90, Math.max(0, Number(value ?? 35))) / 100;
  const left = Math.min(0.97, strength + 0.52);
  const mid = Math.min(0.9, strength + 0.08);
  const top = Math.min(0.95, strength + 0.3);
  return {
    background: `linear-gradient(90deg, rgba(8,8,10,${left}) 0%, rgba(8,8,10,${mid}) 52%, rgba(8,8,10,0.12) 100%), linear-gradient(180deg, rgba(8,8,10,${top}) 0%, rgba(8,8,10,0.1) 36%, rgba(8,8,10,0.95) 100%)`,
  };
}

export function HeroSlider({ banners = [], section = {}, options = {} }) {
  const slides = banners.length ? banners : [fallbackSlide];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduce = useReducedMotion();
  const touch = useRef({ x: 0, y: 0, tracking: false });

  const autoplay = options.autoplay !== false;
  const interval = Math.min(20, Math.max(3, Number(options.intervalSeconds) || 7)) * 1000;
  const transition = options.transition === 'slide' ? 'slide' : 'fade';
  const duration = Math.min(2, Math.max(0.2, (Number(options.transitionMs) || 800) / 1000));
  const multi = slides.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [banners.length]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay || paused || reduce || hidden || !multi) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, paused, reduce, hidden, multi, interval, slides.length]);

  const go = useCallback(
    (direction) => {
      setIndex((current) => (current + direction + slides.length) % slides.length);
    },
    [slides.length],
  );

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    touch.current = { x: event.clientX, y: event.clientY, tracking: true };
  };

  const onPointerUp = (event) => {
    if (!touch.current.tracking) return;
    const dx = event.clientX - touch.current.x;
    const dy = event.clientY - touch.current.y;
    touch.current.tracking = false;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  const slide = slides[index] || slides[0];
  const secondaryLabel = slide.secondaryLabel || section.secondaryLabel || 'Explore services';
  const secondaryHref = slide.secondaryHref || section.secondaryHref || '/services';
  const eyebrow = slide.eyebrow || section.eyebrow || 'Dubai, UAE — Multi-brand auto care';

  return (
    <Hero
      aria-roledescription="carousel"
      aria-label="Featured services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        touch.current.tracking = false;
      }}
      onKeyDown={(event) => {
        if (!multi) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          go(-1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          go(1);
        }
      }}
    >
      <Stack aria-live="off">
        {slides.map((item, slideIndex) => {
          const active = slideIndex === index;
          const x = transition === 'slide' ? (active ? '0%' : slideIndex < index ? '-100%' : '100%') : 0;
          return (
            <SlideLayer
              key={item.id || `${item.title}-${slideIndex}`}
              $hasMobile={Boolean(item.mobileImage)}
              initial={false}
              animate={{ opacity: active ? 1 : 0, x }}
              transition={{ duration: reduce ? 0 : duration, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden={!active}
            >
              <Image
                className="desktop"
                src={item.image || fallbackSlide.image}
                alt={item.title || ''}
                fill
                priority={slideIndex === 0}
                sizes="100vw"
              />
              {item.mobileImage ? (
                <Image
                  className="mobile"
                  src={item.mobileImage}
                  alt=""
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                />
              ) : null}
              <Shade style={overlayStyle(item.overlayOpacity)} />
            </SlideLayer>
          );
        })}
      </Stack>
      <Grain aria-hidden="true" />

      <Inner>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id || index}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <Content>
              <Eyebrow>{eyebrow}</Eyebrow>
              <Title $size="xl" $width="16ch">{slide.title}</Title>
              {slide.subtitle ? <Sub>{slide.subtitle}</Sub> : null}
              <Actions>
                <Button href={slide.ctaHref || '/book'} size="lg">{slide.ctaLabel || 'Book a service'}</Button>
                {secondaryLabel && secondaryHref ? (
                  <Button href={secondaryHref} variant="outline" size="lg">{secondaryLabel}</Button>
                ) : null}
              </Actions>
            </Content>
          </motion.div>
        </AnimatePresence>

        {multi ? (
          <Controls>
            <Dots role="tablist" aria-label="Choose a hero slide">
              {slides.map((item, slideIndex) => (
                <Dot
                  key={item.id || `${item.title}-dot`}
                  type="button"
                  role="tab"
                  aria-selected={slideIndex === index}
                  aria-label={`Slide ${slideIndex + 1} of ${slides.length}: ${item.title}`}
                  $active={slideIndex === index}
                  onClick={() => setIndex(slideIndex)}
                >
                  {String(slideIndex + 1).padStart(2, '0')}
                </Dot>
              ))}
            </Dots>
            <Arrows>
              <ArrowBtn type="button" onClick={() => go(-1)} aria-label="Previous slide">
                <ArrowLeft size={17} />
              </ArrowBtn>
              <ArrowBtn type="button" onClick={() => go(1)} aria-label="Next slide">
                <ArrowRight size={17} />
              </ArrowBtn>
            </Arrows>
          </Controls>
        ) : null}
      </Inner>

      <ScrollCue aria-hidden="true">Scroll to explore</ScrollCue>
    </Hero>
  );
}
