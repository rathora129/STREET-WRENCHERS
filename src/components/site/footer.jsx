'use client';

import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { media } from '@/styles/theme';
import { FOOTER_NAV, LOGO_SRC } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';

const Foot = styled.footer`
  background: ${({ theme }) => theme.colors.coal};
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  padding-top: clamp(52px, 7vw, 88px);
  color: ${({ theme }) => theme.colors.muted};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.container};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;

const Top = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: 1.3fr 1fr 1fr;
  }

  ${media.lg} {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
  }
`;

const BrandCol = styled.div`
  p {
    margin-top: 18px;
    font-size: 13.5px;
    line-height: 1.8;
    max-width: 34ch;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const BrandRow = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const LogoFrame = styled.span`
  position: relative;
  width: 54px;
  height: 54px;
`;

const BrandName = styled.div`
  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 15px;
    letter-spacing: 0.16em;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    display: block;
    margin-top: 5px;
    font-size: 8.5px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Col = styled.div`
  h4 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: 18px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  a {
    font-size: 13.5px;
    color: ${({ theme }) => theme.colors.muted};
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover { color: ${({ theme }) => theme.colors.white}; }
  }

  .soon {
    font-size: 8px;
    letter-spacing: 0.1em;
    color: ${({ theme }) => theme.colors.brand};
    border: 1px solid rgba(242, 106, 13, 0.3);
    border-radius: 3px;
    padding: 1px 4px;
  }
`;

const ContactLine = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

const Bottom = styled.div`
  margin-top: clamp(44px, 6vw, 72px);
  padding-block: 26px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  flex-wrap: wrap;
  gap: 14px 28px;
  align-items: center;
  justify-content: space-between;
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.dim};

  a:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const LegalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;

  a { color: ${({ theme }) => theme.colors.muted}; }
`;

export function Footer({ settings, navModules = [] }) {
  const business = settings?.business || {};
  const whatsapp = settings?.whatsapp || {};
  const year = new Date().getFullYear();
  const waLink = whatsappLink(whatsapp, whatsapp.defaultMessage);

  return (
    <Foot>
      <Inner>
        <Top>
          <BrandCol>
            <BrandRow href="/">
              <LogoFrame>
                <Image src={LOGO_SRC} alt="Street Wrenchers" fill sizes="54px" style={{ objectFit: 'contain' }} />
              </LogoFrame>
              <BrandName>
                <strong>STREET WRENCHERS</strong>
                <span>Precision · Performance · Reliability</span>
              </BrandName>
            </BrandRow>
            <p>
              Multi-brand automotive service centre in Dubai — scheduled maintenance, diagnostics,
              mechanical repair, detailing and paint protection.
            </p>
          </BrandCol>

          {FOOTER_NAV.map((column) => (
            <Col key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}

          <Col>
            <h4>Find us</h4>
            <ul>
              <ContactLine>
                <MapPin size={14} aria-hidden="true" />
                <span>{business.addressLine || 'Dubai, United Arab Emirates'}</span>
              </ContactLine>
              {business.phone ? (
                <ContactLine>
                  <Phone size={14} aria-hidden="true" />
                  <a href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a>
                </ContactLine>
              ) : null}
              {business.email ? (
                <ContactLine>
                  <Mail size={14} aria-hidden="true" />
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </ContactLine>
              ) : null}
              {business.hours ? (
                <ContactLine>
                  <Clock size={14} aria-hidden="true" />
                  <span>{business.hours}</span>
                </ContactLine>
              ) : null}
              {waLink && whatsapp.enabled ? (
                <ContactLine>
                  <a href={waLink} target="_blank" rel="noopener noreferrer">WhatsApp the team</a>
                </ContactLine>
              ) : null}
              {navModules.map((module) => (
                <li key={module.href}>
                  <Link href={module.href}>
                    {module.label}
                    {module.status === 'COMING_SOON' ? <span className="soon">Soon</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Top>

        <Bottom>
          <span>© {year} Street Wrenchers. All rights reserved. Dubai, UAE · AED.</span>
          <LegalLinks>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/login">Owner Login</Link>
          </LegalLinks>
        </Bottom>
      </Inner>
    </Foot>
  );
}
