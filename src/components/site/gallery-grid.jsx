'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassCard, glassOverlay } from '@/styles/glass';
import { SmartImage } from '@/components/ui/smart-image';
import { Carousel } from '@/components/ui/carousel';

const Grid = styled.div`
  display: grid;
  gap: ${({ $gap }) => $gap || '14px'};
  grid-template-columns: repeat(${({ $cols }) => $cols || 2}, minmax(0, 1fr));

  ${media.lg} {
    grid-template-columns: repeat(${({ $lg }) => $lg || 3}, minmax(0, 1fr));
  }
`;

const Tile = styled.button`
  position: relative;
  display: block;
  width: 100%;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  cursor: zoom-in;
  text-align: left;
  transition: border-color 220ms ease, box-shadow 220ms ease;

  ${media.hover} {
    &:hover {
      border-color: rgba(242, 106, 13, 0.38);
      box-shadow: 0 22px 48px rgba(0, 0, 0, 0.42), 0 0 34px rgba(242, 106, 13, 0.07);
    }
    &:hover img { transform: scale(1.045); }
    &:hover .zoom { opacity: 1; transform: translateY(0); }
  }

  img { transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1); }
`;

const Zoom = styled.span`
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(10, 10, 13, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 220ms ease, transform 220ms ease;
  pointer-events: none;
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  backdrop-filter: blur(12px) saturate(140%);

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: rgba(10, 10, 13, 0.9);
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 130;
  display: grid;
  place-items: center;
  padding: clamp(16px, 4vw, 48px);
  ${glassOverlay}
`;

const Stage = styled(motion.div)`
  position: relative;
  width: min(1180px, 100%);
  max-height: calc(100svh - 120px);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Figure = styled.div`
  position: relative;
  width: 100%;
  height: min(72svh, 760px);
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: #0d0d10;

  img { object-fit: contain; }
`;

const Caption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(12, 12, 16, 0.5);
  -webkit-backdrop-filter: blur(12px) saturate(130%);
  backdrop-filter: blur(12px) saturate(130%);
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12.5px;
  line-height: 1.5;

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: rgba(12, 12, 16, 0.94);
  }
`;

const Control = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(18, 18, 22, 0.55);
  color: #f6f5f2;
  cursor: pointer;
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  backdrop-filter: blur(14px) saturate(140%);
  transition: border-color 160ms ease, background 160ms ease;

  @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
    background: rgba(18, 18, 22, 0.94);
  }

  &:hover { border-color: #f26a0d; background: rgba(242, 106, 13, 0.16); }
`;

const TopBar = styled.div`
  position: absolute;
  top: -58px;
  right: 0;
  display: flex;
  gap: 10px;
  z-index: 2;
`;

const Arrows = styled.div`
  position: absolute;
  inset-inline: -22px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;

  ${Control} { pointer-events: auto; }

  ${media.lg} {
    inset-inline: -70px;
  }
`;

export function GalleryGrid({ items = [], columns = 2, largeColumns = 3, gap, priority = false, layout = 'grid' }) {
  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (direction) => {
      setActive((current) => {
        if (current === null) return current;
        return (current + direction + items.length) % items.length;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (active === null) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [active, close, step]);

  if (!items.length) return null;

  const renderTile = (item, index) => (
    <Tile
      key={item.id || item.url}
      type="button"
      onClick={() => setActive(index)}
      aria-label={`Open image ${index + 1} of ${items.length}${item.alt ? `: ${item.alt}` : ''}`}
      style={layout === 'carousel' ? { height: '100%' } : undefined}
    >
      <SmartImage
        src={item.url}
        alt={item.alt || ''}
        ratio={layout === 'carousel' ? '4 / 3' : index % 5 === 0 ? '4 / 3' : '1 / 1'}
        radius="none"
        priority={priority && index < 3}
        sizes={layout === 'carousel' ? '(max-width: 820px) 80vw, 34vw' : '(max-width: 820px) 50vw, 33vw'}
      />
      <Zoom className="zoom" aria-hidden="true">
        <Expand size={15} />
      </Zoom>
    </Tile>
  );

  return (
    <>
      {layout === 'carousel' ? (
        <Carousel
          label="Workshop gallery"
          items={items}
          itemWidth="clamp(244px, 34vw, 380px)"
          renderItem={renderTile}
        />
      ) : (
        <Grid $cols={columns} $lg={largeColumns} $gap={gap}>
          {items.map(renderTile)}
        </Grid>
      )}

      <AnimatePresence>
        {active !== null && items[active] ? (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            onClick={close}
          >
            <Stage
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <TopBar>
                <Control type="button" onClick={close} aria-label="Close viewer">
                  <X size={17} />
                </Control>
              </TopBar>
              <Figure>
                <Image
                  src={items[active].url}
                  alt={items[active].alt || ''}
                  fill
                  sizes="90vw"
                  priority
                />
                {items.length > 1 ? (
                  <Arrows>
                    <Control type="button" onClick={() => step(-1)} aria-label="Previous image">
                      <ChevronLeft size={18} />
                    </Control>
                    <Control type="button" onClick={() => step(1)} aria-label="Next image">
                      <ChevronRight size={18} />
                    </Control>
                  </Arrows>
                ) : null}
              </Figure>
              <Caption>
                <span>{items[active].alt}</span>
                <span>{active + 1} / {items.length}</span>
              </Caption>
            </Stage>
          </Overlay>
        ) : null}
      </AnimatePresence>
    </>
  );
}
