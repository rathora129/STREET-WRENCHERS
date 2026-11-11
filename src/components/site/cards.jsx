'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BadgeCheck, Car, Check, Star } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassCard, glassFeature } from '@/styles/glass';
import { CategoryIcon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/smart-image';
import { localBrandLogo } from '@/data/brand-logos';
import { brandShowcase } from '@/data/brand-showcase';
import { formatPrice, formatDate } from '@/lib/utils';

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  min-height: 100%;
  transition: border-color 260ms ease, transform 260ms ease, background 260ms ease, box-shadow 260ms ease;
  position: relative;

  ${media.hover} {
    &:hover {
      border-color: rgba(242, 106, 13, 0.42);
      background:
        radial-gradient(130% 120% at 88% -25%, rgba(242, 106, 13, 0.13), transparent 58%),
        linear-gradient(155deg, rgba(31, 31, 38, 0.76), rgba(14, 14, 18, 0.64));
      box-shadow:
        0 24px 56px rgba(0, 0, 0, 0.4),
        0 0 42px rgba(242, 106, 13, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
      transform: translateY(-4px);

      .arrow {
        background: ${({ theme }) => theme.colors.brand};
        color: #0b0b0d;
      }
    }
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const IconWrap = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.brandWash};
  color: ${({ theme }) => theme.colors.brand};
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.white};
`;

const Desc = styled.p`
  font-size: 13.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.muted};
  flex: 1;
`;

const Foot = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.smoke};
`;

const Price = styled.span`
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};

  strong {
    display: block;
    margin-top: 4px;
    font-size: 15px;
    letter-spacing: 0;
    text-transform: none;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
  }
`;

const Arrow = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.smoke};
  transition: background 220ms ease, color 220ms ease;
  flex: none;
`;

export function ServiceCard({ service }) {
  const price = service.price;
  return (
    <CardLink href={`/services/${service.slug}`} aria-label={`${service.name} details`}>
      <CardTop>
        <IconWrap>
          <CategoryIcon name={service.icon || service.category?.icon} size={20} />
        </IconWrap>
        {service.category ? <Badge>{service.category.name}</Badge> : null}
      </CardTop>
      <Title>{service.name}</Title>
      <Desc>{service.shortDescription}</Desc>
      <Foot>
        <Price>
          {price ? 'Starting from' : 'Pricing'}
          <strong>{price ? formatPrice(price, { from: true }) : 'Quoted after inspection'}</strong>
        </Price>
        <Arrow className="arrow">
          <ArrowUpRight size={17} aria-hidden="true" />
        </Arrow>
      </Foot>
    </CardLink>
  );
}

const PackageCardWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: clamp(24px, 3vw, 34px);
  ${({ $featured }) => ($featured ? glassFeature : glassCard)}
  border-radius: ${({ theme }) => theme.radii.md};
  position: relative;
`;

const PackageHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
`;

const PackageName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const PackagePrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(30px, 4vw, 40px);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.dim};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

const InclusionList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;

  li {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    font-size: 13.5px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg {
    flex: none;
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

export function PackageCard({ pack, href, featured = false }) {
  return (
    <PackageCardWrap $featured={featured}>
      <PackageHead>
        <div>
          <Badge $tone={featured ? 'brand' : 'neutral'}>{pack.tier}</Badge>
          <PackageName style={{ marginTop: 12 }}>{pack.name}</PackageName>
        </div>
      </PackageHead>
      <PackagePrice>
        <strong>{formatPrice(pack.price)}</strong>
        <span>{pack.priceNote || 'starting'}</span>
      </PackagePrice>
      {pack.description ? <Desc style={{ fontSize: 13.5 }}>{pack.description}</Desc> : null}
      <InclusionList>
        {pack.inclusions.slice(0, 6).map((item) => (
          <li key={item}>
            <Check size={14} strokeWidth={2} aria-hidden="true" />
            {item}
          </li>
        ))}
      </InclusionList>
      <Link
        href={href || '/book'}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#f26a0d',
        }}
      >
        Book this package <ArrowUpRight size={14} aria-hidden="true" />
      </Link>
    </PackageCardWrap>
  );
}

const AmcCardWrap = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: clamp(22px, 3vw, 30px);
  ${({ $featured }) => ($featured ? glassFeature : glassCard)}
  border-radius: ${({ theme }) => theme.radii.md};
  transition: transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease;

  ${media.hover} {
    &:hover {
      transform: translateY(-4px);
      border-color: rgba(242, 106, 13, 0.55);
      box-shadow:
        0 24px 56px rgba(0, 0, 0, 0.4),
        0 0 42px rgba(242, 106, 13, 0.09),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }
  }
`;

const AmcName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 20px;
  letter-spacing: -0.02em;
`;

const AmcPrice = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 34px;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.white};

  span {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-left: 6px;
  }
`;

const AmcList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    gap: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.55;
  }

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

export function AmcCard({ plan, featured = false }) {
  return (
    <AmcCardWrap href={`/amc/${plan.slug}`} $featured={featured}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {featured ? <Badge $tone="brand">Most popular</Badge> : <Badge>Annual plan</Badge>}
        {plan.icon ? (
          <span
            style={{
              width: 38,
              height: 38,
              flex: 'none',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 8,
              background: 'rgba(242,106,13,0.12)',
              color: '#f26a0d',
              border: '1px solid rgba(242,106,13,0.28)',
            }}
          >
            <CategoryIcon name={plan.icon} size={18} />
          </span>
        ) : null}
      </div>
      <AmcName>{plan.name}</AmcName>
      <AmcPrice>
        {formatPrice(plan.price)}
        <span>/ {plan.billingPeriod === 'YEAR' ? 'year' : plan.billingPeriod.toLowerCase()}</span>
      </AmcPrice>
      {plan.tagline ? <Desc style={{ fontSize: 13 }}>{plan.tagline}</Desc> : null}
      <AmcList>
        {plan.inclusions.slice(0, 4).map((item) => (
          <li key={item}>
            <Check size={13} aria-hidden="true" /> {item}
          </li>
        ))}
        {plan.inclusions.length > 4 ? (
          <li style={{ color: '#96938d' }}>+ {plan.inclusions.length - 4} more inclusions</li>
        ) : null}
      </AmcList>
      <Foot style={{ borderTop: 'none', paddingTop: 0 }}>
        <span style={{ color: '#f26a0d', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          View plan
        </span>
        <ArrowUpRight size={16} color="#f26a0d" aria-hidden="true" />
      </Foot>
    </AmcCardWrap>
  );
}

const BrandCard = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  isolation: isolate;
  transition: transform 280ms ease, border-color 280ms ease, box-shadow 280ms ease;

  ${media.hover} {
    &:hover {
      transform: translateY(-4px);
      border-color: rgba(242, 106, 13, 0.55);
      box-shadow:
        0 24px 48px rgba(0, 0, 0, 0.45),
        0 0 40px rgba(242, 106, 13, 0.08);

      .brand-cover {
        transform: scale(1.055);
      }

      .brand-sheen {
        opacity: 1;
      }

      .brand-arrow {
        background: ${({ theme }) => theme.colors.brand};
        border-color: ${({ theme }) => theme.colors.brand};
        color: #0b0b0d;
      }
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 3px;
  }
`;

const BrandMedia = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 72% 18%, rgba(242, 106, 13, 0.16), transparent 58%),
    linear-gradient(140deg, #17171c 0%, #0b0b0d 100%);

  .brand-cover {
    object-fit: cover;
    transition: transform 900ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const BrandShade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(8, 8, 10, 0.3) 0%,
    rgba(8, 8, 10, 0) 30%,
    rgba(8, 8, 10, 0.04) 72%,
    rgba(8, 8, 10, 0.42) 100%
  );
  pointer-events: none;
`;

const BrandSheen = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  background: linear-gradient(118deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 44%);
  transition: opacity 320ms ease;
  pointer-events: none;
`;

const LogoPlate = styled.div`
  width: min(58%, 168px);
  height: 84px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background:
    radial-gradient(circle at 50% 0%, rgba(242, 106, 13, 0.12), transparent 70%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.015));
  display: grid;
  place-items: center;
  padding: 14px 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 18px 40px rgba(0, 0, 0, 0.32);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${({ $local }) => ($local ? 'brightness(0) invert(1)' : 'none')};
  }
`;

const LogoFallback = styled.div`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.brand};
  background: rgba(242, 106, 13, 0.12);
  border: 1px solid rgba(242, 106, 13, 0.26);
`;

const BrandLogo = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  padding: 7px;
  background: rgba(8, 8, 10, 0.66);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: ${({ theme }) => theme.colors.white};
  pointer-events: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: ${({ $local }) => ($local ? 'brightness(0) invert(1)' : 'none')};
  }
`;

const BrandArrow = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.white};
  background: rgba(8, 8, 10, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 220ms ease, color 220ms ease, border-color 220ms ease;
  pointer-events: none;
`;

const BrandFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 3px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.muted};
  }

  span::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brand};
  }
`;

function BrandVisual({ brand }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [failedLogo, setFailedLogo] = useState(null);
  const showcase = brandShowcase(brand.slug);
  const localLogo = localBrandLogo(brand.slug);
  const logoSrc = [brand.logo, localLogo].filter(Boolean).find((src) => src !== failedLogo);
  const photo = !imageFailed ? brand.image || showcase?.src : null;
  const photoAlt = brand.image ? `${brand.name} vehicle serviced at Street Wrenchers` : showcase?.alt;
  const modelCount = brand._count?.models ?? brand.models?.length ?? 0;

  return (
    <>
      <BrandMedia>
        {photo ? (
          <Image
            src={photo}
            alt={photoAlt || `${brand.name} vehicle`}
            fill
            sizes="(max-width: 560px) 78vw, (max-width: 1080px) 42vw, 300px"
            className="brand-cover"
            onError={() => setImageFailed(true)}
          />
        ) : logoSrc ? (
          <LogoPlate $local={logoSrc !== brand.logo}>
            <img src={logoSrc} alt={`${brand.name} logo`} onError={() => setFailedLogo(logoSrc)} loading="lazy" />
          </LogoPlate>
        ) : (
          <LogoFallback>
            <Car size={30} strokeWidth={1.6} aria-hidden="true" />
          </LogoFallback>
        )}
        <BrandShade aria-hidden="true" />
        <BrandSheen className="brand-sheen" aria-hidden="true" />
      </BrandMedia>
      {photo && logoSrc ? (
        <BrandLogo $local={logoSrc !== brand.logo} aria-hidden="true">
          <img src={logoSrc} alt="" onError={() => setFailedLogo(logoSrc)} />
        </BrandLogo>
      ) : null}
      <BrandArrow className="brand-arrow" aria-hidden="true">
        <ArrowUpRight size={15} strokeWidth={2} />
      </BrandArrow>
      <BrandFoot>
        <strong>{brand.name}</strong>
        <span>
          {modelCount} {modelCount === 1 ? 'model' : 'models'} covered
        </span>
      </BrandFoot>
    </>
  );
}

export function BrandTile({ brand }) {
  const modelCount = brand._count?.models ?? brand.models?.length ?? 0;
  return (
    <BrandCard href={`/brands/${brand.slug}`} aria-label={`${brand.name} — ${modelCount} models covered`}>
      <BrandVisual brand={brand} />
    </BrandCard>
  );
}

const BlogCardWrap = styled(Link)`
  display: flex;
  flex-direction: column;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  transition: transform 260ms ease, border-color 260ms ease, box-shadow 260ms ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(242, 106, 13, 0.42);
    box-shadow:
      0 24px 52px rgba(0, 0, 0, 0.4),
      0 0 38px rgba(242, 106, 13, 0.07);
  }
`;

const BlogBody = styled.div`
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const BlogMeta = styled.div`
  display: flex;
  gap: 10px;
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};
`;

const BlogTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 19px;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;

export function BlogCard({ post }) {
  return (
    <BlogCardWrap href={`/blog/${post.slug}`}>
      <SmartImage src={post.coverImage} alt={post.title} ratio="16 / 10" radius="none" sizes="(max-width: 820px) 100vw, 33vw" />
      <BlogBody>
        <BlogMeta>
          {post.category ? <span>{post.category}</span> : null}
          <span>{formatDate(post.publishedAt)}</span>
          {post.readMinutes ? <span>{post.readMinutes} min</span> : null}
        </BlogMeta>
        <BlogTitle>{post.title}</BlogTitle>
        <Desc>{post.excerpt}</Desc>
      </BlogBody>
    </BlogCardWrap>
  );
}

const TestimonialWrap = styled.figure`
  margin: 0;
  padding: clamp(22px, 3vw, 30px);
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
`;

const Stars = styled.div`
  display: flex;
  gap: 3px;
  color: ${({ theme }) => theme.colors.brand};
`;

const Quote = styled.blockquote`
  margin: 0;
  font-size: 14.5px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.smoke};
  flex: 1;
`;

const Person = styled.figcaption`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;

  strong {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 999px;
  border: 1px solid rgba(242, 106, 13, 0.34);
  background: rgba(242, 106, 13, 0.1);
  color: ${({ theme }) => theme.colors.brand};
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const PersonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: auto;
`;

const Avatar = styled.span`
  position: relative;
  width: 38px;
  height: 38px;
  flex: none;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: #17171c;

  img { object-fit: cover; }
`;

export function TestimonialCard({ testimonial }) {
  const reviewDate = testimonial.reviewedAt || testimonial.createdAt;
  const source = testimonial.source?.trim();
  const meta = [testimonial.vehicle, source, reviewDate ? formatDate(reviewDate) : null].filter(Boolean).join(' · ');

  return (
    <TestimonialWrap>
      <Stars aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star key={index} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ))}
      </Stars>
      <Quote>“{testimonial.quote}”</Quote>
      <PersonRow>
        {testimonial.image ? (
          <Avatar>
            <Image src={testimonial.image} alt="" fill sizes="38px" />
          </Avatar>
        ) : null}
        <Person>
          <NameRow>
            <strong>{testimonial.name}</strong>
            {source ? (
              <VerifiedBadge title={`Review source: ${source}`}>
                <BadgeCheck size={11} aria-hidden="true" /> Verified
              </VerifiedBadge>
            ) : null}
          </NameRow>
          {meta ? <span>{meta}</span> : null}
        </Person>
      </PersonRow>
    </TestimonialWrap>
  );
}
