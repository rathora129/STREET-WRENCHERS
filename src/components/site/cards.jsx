'use client';

import styled from 'styled-components';
import Link from 'next/link';
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
          <CategoryIcon name={service.category?.icon} size={20} />
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
      {featured ? <Badge $tone="brand">Most popular</Badge> : <Badge>Annual plan</Badge>}
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

const BrandTileWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.015);
  transition: border-color 200ms ease, background 200ms ease;

  &:hover {
    border-color: rgba(242, 106, 13, 0.35);
    background: rgba(242, 106, 13, 0.05);
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white};
    letter-spacing: -0.01em;
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

export function BrandTile({ brand }) {
  return (
    <BrandTileWrap>
      <strong>{brand.name}</strong>
      <span>{brand._count?.models ?? brand.models?.length ?? 0} models covered</span>
    </BrandTileWrap>
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

export function TestimonialCard({ testimonial }) {
  return (
    <TestimonialWrap>
      <Stars aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star key={index} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        ))}
      </Stars>
      <Quote>“{testimonial.quote}”</Quote>
      <Person>
        <strong>{testimonial.name}</strong>
        {testimonial.vehicle ? <span>{testimonial.vehicle}</span> : null}
      </Person>
    </TestimonialWrap>
  );
}
