'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { media } from '@/styles/theme';
import { Button } from '@/components/ui/button';
import { Eyebrow, Display, Intro } from '@/components/ui/type';

const Hero = styled.section`
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  isolation: isolate;
  background: #08080a;

  ${media.lg} {
    min-height: max(720px, 92svh);
  }
`;

const Media = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(8, 8, 10, 0.92) 0%, rgba(8, 8, 10, 0.55) 48%, rgba(8, 8, 10, 0.15) 100%),
      linear-gradient(180deg, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0.12) 35%, rgba(8, 8, 10, 0.95) 100%);
  }

  img { object-fit: cover; }
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
  padding: calc(${({ theme }) => theme.layout.header} + 40px) ${({ theme }) => theme.layout.gutter} 44px;
`;

const Content = styled.div`
  max-width: 860px;
  padding-bottom: clamp(20px, 4vw, 44px);
`;

const Title = styled(Display)`
  max-width: 16ch;
  margin-bottom: 22px;
  text-wrap: balance;
`;

const Sub = styled(Intro)`
  color: ${({ theme }) => theme.colors.smoke};
  max-width: 54ch;
  font-size: clamp(15px, 1.7vw, 18px);
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 32px;
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
  gap: 20px;
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

  &::after {
    content: '';
    display: block;
    width: ${({ $active }) => ($active ? '52px' : '20px')};
    height: 1px;
    background: ${({ $active, theme }) => ($active ? theme.colors.brand : 'rgba(255,255,255,0.25)')};
    transition: width 300ms ease, background 300ms ease;
  }

  &:hover { color: ${({ theme }) => theme.colors.white}; }
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

  &:hover {
    background: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.brand};
    color: #0b0b0d;
  }
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
  title: 'Precision care, built around your car.',
  subtitle:
    'Scheduled servicing, diagnostics, repair and detailing under one roof — for every make and model on Dubai roads.',
  image: '/assets/images/hero/workshop.jpg',
  ctaLabel: 'Book a service',
  ctaHref: '/book',
};

export function HeroSlider({ banners = [], section = {} }) {
  const slides = banners.length ? banners : [fallbackSlide];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [paused, reduce, slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [banners.length]);

  const slide = slides[index] || slides[0];
  const secondaryLabel = section?.secondaryLabel || 'Explore services';
  const secondaryHref = section?.secondaryHref || '/services';

  const go = (direction) => setIndex((current) => (current + direction + slides.length) % slides.length);

  return (
    <Hero
      aria-roledescription="carousel"
      aria-label="Featured services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Media>
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.image || index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              src={slide.image || fallbackSlide.image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </motion.div>
        </AnimatePresence>
      </Media>
      <Grain aria-hidden="true" />

      <Inner>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Content>
              <Eyebrow>{section?.eyebrow || 'Dubai, UAE — Multi-brand auto care'}</Eyebrow>
              <Title $size="xl" $width="16ch">{slide.title}</Title>
              <Sub>{slide.subtitle}</Sub>
              <Actions>
                <Button href={slide.ctaHref || '/book'} size="lg">{slide.ctaLabel || 'Book a service'}</Button>
                <Button href={secondaryHref} variant="outline" size="lg">{secondaryLabel}</Button>
              </Actions>
            </Content>
          </motion.div>
        </AnimatePresence>

        <Controls>
          <Dots>
            {slides.map((item, slideIndex) => (
              <Dot
                key={item.id || item.title}
                type="button"
                $active={slideIndex === index}
                onClick={() => setIndex(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index}
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
      </Inner>

      <ScrollCue aria-hidden="true">Scroll to explore</ScrollCue>
    </Hero>
  );
}
