'use client';

import styled from 'styled-components';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { media } from '@/styles/theme';
import { Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro } from '@/components/ui/type';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { whatsappLink } from '@/lib/whatsapp';

const Grid = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 44px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.smoke};

  svg { flex: none; margin-top: 3px; color: ${({ theme }) => theme.colors.brand}; }

  span.label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-bottom: 2px;
  }

  a:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const MapFrame = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  min-height: 260px;
  background: ${({ theme }) => theme.colors.charcoal};

  iframe {
    display: block;
    width: 100%;
    height: 300px;
    border: 0;
    filter: grayscale(1) invert(0.92) contrast(0.88);
  }
`;

export function ContactSection({ heading = 'Ready when your car is.', body, settings, id = 'enquiry' }) {
  const business = settings?.business || {};
  const whatsapp = settings?.whatsapp || {};
  const waLink = whatsapp.enabled ? whatsappLink(whatsapp, whatsapp.defaultMessage) : null;
  const mapSrc = business.mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&output=embed`
    : null;

  return (
    <div id={id}>
      <Grid>
        <Info>
          <div>
            <Eyebrow>Visit us</Eyebrow>
            <Heading $size="sm" $width="18ch">{heading}</Heading>
            {body ? <Intro style={{ marginTop: 14 }}>{body}</Intro> : null}
          </div>

          <List>
            <Item>
              <MapPin size={17} aria-hidden="true" />
              <div>
                <span className="label">Workshop</span>
                {business.addressLine || 'Dubai, United Arab Emirates'}
              </div>
            </Item>
            {business.phone ? (
              <Item>
                <Phone size={17} aria-hidden="true" />
                <div>
                  <span className="label">Phone</span>
                  <a href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a>
                </div>
              </Item>
            ) : null}
            {business.email ? (
              <Item>
                <Mail size={17} aria-hidden="true" />
                <div>
                  <span className="label">Email</span>
                  <a href={`mailto:${business.email}`}>{business.email}</a>
                </div>
              </Item>
            ) : null}
            {business.hours ? (
              <Item>
                <Clock size={17} aria-hidden="true" />
                <div>
                  <span className="label">Hours</span>
                  {business.hours}
                </div>
              </Item>
            ) : null}
            {waLink ? (
              <Item>
                <MessageCircle size={17} aria-hidden="true" />
                <div>
                  <span className="label">WhatsApp</span>
                  <a href={waLink} target="_blank" rel="noopener noreferrer">Message the team</a>
                </div>
              </Item>
            ) : null}
          </List>

          {mapSrc ? (
            <MapFrame>
              <iframe
                src={mapSrc}
                title="Street Wrenchers location map"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </MapFrame>
          ) : null}
        </Info>

        <Panel $pad="clamp(22px, 3vw, 36px)">
          <Eyebrow>Send an enquiry</Eyebrow>
          <Heading $size="sm" $width="18ch" style={{ marginBottom: 10 }}>Tell us what your car needs.</Heading>
          <p style={{ color: '#96938d', fontSize: 13.5, lineHeight: 1.7, marginBottom: 22 }}>
            Share the basics and the team will respond with next steps. For an immediate appointment, use the
            booking form.
          </p>
          <EnquiryForm type="CONTACT" source="contact-section" showVehicle messageLabel="Your message" />
        </Panel>
      </Grid>
    </div>
  );
}
