'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Star } from 'lucide-react';
import { media } from '@/styles/theme';
import { CategoryIcon } from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { SmartImage } from '@/components/ui/smart-image';
import { formatPrice, formatDate } from '@/lib/utils';

const CardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 26px;
  background: ${({ theme }) => theme.colors.charcoal};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  min-height: 100%;
  transition: border-color 260ms ease, transform 260ms ease, background 260ms ease;
  position: relative;

  ${media.hover} {
    &:hover {
      border-color: rgba(242, 106, 13, 0.4);
      background: #16161b;
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
  border: 1px solid ${({ $featured, theme }) => ($featured ? 'rgba(242,106,13,0.45)' : theme.colors.line)};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $featured }) => ($featured ? 'linear-gradient(160deg, rgba(242,106,13,0.09), #111114 55%)' : '#111114')};
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
  border: 1px solid ${({ $featured }) => ($featured ? 'rgba(242,106,13,0.5)' : 'rgba(255,255,255,0.08)')};
  background: ${({ $featured }) => ($featured ? 'linear-gradient(165deg, rgba(242,106,13,0.12), #101014 60%)' : '#101014')};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: transform 260ms ease, border-color 260ms ease;

  ${media.hover} {
    &:hover { transform: translateY(-4px); border-color: rgba(242, 106, 13, 0.55); }
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
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.charcoal};
  transition: transform 260ms ease, border-color 260ms ease, background 260ms ease;

  ${media.hover} {
    &:hover {
      transform: translateY(-4px);
      border-color: rgba(242, 106, 13, 0.45);
      background: #16161b;

      .brand-cover {
        transform: scale(1.045);
      }

      .brand-arrow {
        background: ${({ theme }) => theme.colors.brand};
        color: #0b0b0d;
        border-color: transparent;
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
    radial-gradient(circle at 72% 18%, rgba(242, 106, 13, 0.2), transparent 58%),
    linear-gradient(140deg, #17171c 0%, #0b0b0d 100%);

  .brand-cover {
    object-fit: cover;
    transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const LogoPlate = styled.div`
  width: min(56%, 150px);
  aspect-ratio: 3 / 2;
  border-radius: 10px;
  background: #f4f1ea;
  display: grid;
  place-items: center;
  padding: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Monogram = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(30px, 4vw, 42px);
  font-weight: 600;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
`;

const BrandBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const BrandArrow = styled.span`
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.smoke};
  transition: background 220ms ease, color 220ms ease, border-color 220ms ease;
`;

function brandInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
}

function BrandVisual({ brand }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const showImage = brand.image && !imageFailed;
  const showLogo = brand.logo && !logoFailed;

  return (
    <BrandMedia>
      {showImage ? (
        <Image
          src={brand.image}
          alt={`${brand.name} vehicles serviced at Street Wrenchers`}
          fill
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="brand-cover"
          onError={() => setImageFailed(true)}
        />
      ) : showLogo ? (
        <LogoPlate>
          <img src={brand.logo} alt={`${brand.name} logo`} onError={() => setLogoFailed(true)} loading="lazy" />
        </LogoPlate>
      ) : (
        <Monogram aria-hidden="true">{brandInitials(brand.name)}</Monogram>
      )}
    </BrandMedia>
  );
}

export function BrandTile({ brand }) {
  const modelCount = brand._count?.models ?? brand.models?.length ?? 0;
  return (
    <BrandCard href={`/brands/${brand.slug}`} aria-label={`${brand.name} — ${modelCount} models covered`}>
      <BrandVisual brand={brand} />
      <BrandBody>
        <div>
          <strong>{brand.name}</strong>
          <span>{modelCount} {modelCount === 1 ? 'model' : 'models'} covered</span>
        </div>
        <BrandArrow className="brand-arrow">
          <ArrowUpRight size={16} aria-hidden="true" />
        </BrandArrow>
      </BrandBody>
    </BrandCard>
  );
}

const BlogCardWrap = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.charcoal};
  transition: transform 260ms ease, border-color 260ms ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.18);
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
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
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
  gap: 2px;

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
  const meta = [testimonial.vehicle, reviewDate ? formatDate(reviewDate) : null].filter(Boolean).join(' · ');

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
          <strong>{testimonial.name}</strong>
          {meta ? <span>{meta}</span> : null}
        </Person>
      </PersonRow>
    </TestimonialWrap>
  );
}
