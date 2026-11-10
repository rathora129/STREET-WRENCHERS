'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ArrowUpRight, Gauge, Users, Fuel, Cog } from 'lucide-react';
import { SmartImage } from '@/components/ui/smart-image';
import { Badge } from '@/components/ui/badge';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.charcoal};
  transition: transform 260ms ease, border-color 260ms ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(242, 106, 13, 0.45);
  }
`;

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 19px;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  span.year {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.dim};
    white-space: nowrap;
    padding-top: 3px;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px 14px;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.muted};

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }

  svg { color: ${({ theme }) => theme.colors.dim}; }
`;

const Foot = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 22px;
    letter-spacing: -0.02em;
  }

  em {
    display: block;
    font-style: normal;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-top: 3px;
  }

  svg.arrow { color: ${({ theme }) => theme.colors.brand}; }
`;

export function VehicleCard({ vehicle, kind = 'rental' }) {
  const href = kind === 'rental' ? `/rental/${vehicle.slug}` : `/car-sales/${vehicle.slug}`;
  const title = kind === 'rental' ? vehicle.name : vehicle.title;
  const priceLabel = kind === 'rental' ? 'per day' : vehicle.negotiable ? 'asking price · negotiable' : 'asking price';

  return (
    <Card href={href}>
      <SmartImage
        src={vehicle.image}
        alt={title}
        ratio="16 / 10"
        radius="none"
        sizes="(max-width: 820px) 100vw, 33vw"
      />
      <Body>
        <Head>
          <h3>{title}</h3>
          <span className="year">{vehicle.year}</span>
        </Head>
        <Meta>
          <span><Cog size={12} aria-hidden="true" /> {vehicle.transmission || 'Transmission TBC'}</span>
          <span><Fuel size={12} aria-hidden="true" /> {vehicle.fuelType || 'Fuel TBC'}</span>
          {kind === 'rental' ? (
            <span><Users size={12} aria-hidden="true" /> {vehicle.seats} seats</span>
          ) : vehicle.mileage ? (
            <span><Gauge size={12} aria-hidden="true" /> {vehicle.mileage.toLocaleString()} km</span>
          ) : null}
        </Meta>
        {kind === 'sale' && vehicle.condition ? <Badge>{vehicle.condition === 'NEW' ? 'New' : 'Pre-owned'}</Badge> : null}
        <Foot>
          <div>
            <strong>AED {kind === 'rental' ? vehicle.dailyRate : vehicle.price}</strong>
            <em>{priceLabel}</em>
          </div>
          <ArrowUpRight size={18} className="arrow" aria-hidden="true" />
        </Foot>
      </Body>
    </Card>
  );
}
