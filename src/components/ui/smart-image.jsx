'use client';

import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio || '16 / 9'};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.charcoal};
  border-radius: ${({ $radius, theme }) => ($radius === 'none' ? '0' : theme.radii.md)};

  img {
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const Fallback = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 70% 20%, rgba(242, 106, 13, 0.16), transparent 55%),
    linear-gradient(135deg, #141418 0%, #0a0a0c 100%);

  span {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 13px;
    letter-spacing: 0.3em;
    color: ${({ theme }) => theme.colors.dim};
    text-transform: uppercase;
  }
`;

export function SmartImage({
  src,
  alt = '',
  ratio,
  sizes = '(max-width: 820px) 100vw, 50vw',
  priority = false,
  radius,
  className,
  objectPosition = 'center',
  zoom = false,
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <Frame
      $ratio={ratio}
      $radius={radius}
      className={className}
      style={zoom ? { '--zoom': true } : undefined}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          style={{ objectPosition }}
        />
      ) : (
        <Fallback aria-hidden="true">
          <span>Street Wrenchers</span>
        </Fallback>
      )}
    </Frame>
  );
}
