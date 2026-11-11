'use client';

import styled from 'styled-components';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { media } from '@/styles/theme';
import { BOOKING_STAGES, stageIndex } from '@/lib/booking-stages';
import { formatDate, formatDateTime } from '@/lib/utils';

const Page = styled.main`
  min-height: 100vh;
  background:
    radial-gradient(circle at 82% 0%, rgba(242, 106, 13, 0.13), transparent 42%),
    #08080a;
  padding-bottom: clamp(40px, 7vw, 80px);
`;

const Bar = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(8, 8, 10, 0.86);
  backdrop-filter: blur(14px);
`;

const BarInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 16px clamp(18px, 4vw, 32px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  img {
    height: 32px;
    width: auto;
  }
`;

const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.smoke};

  &:hover { color: ${({ theme }) => theme.colors.white}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 4px; }
`;

const Wrap = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: clamp(28px, 5vw, 56px) clamp(18px, 4vw, 32px) 0;
`;

const Intro = styled.div`
  margin-bottom: clamp(24px, 4vw, 38px);

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  h1 {
    margin: 10px 0 0;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(27px, 4.6vw, 44px);
    line-height: 1.08;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.white};
  }

  p {
    margin: 12px 0 0;
    max-width: 62ch;
    font-size: 14px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Layout = styled.div`
  display: grid;
  gap: 20px;
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1.55fr) minmax(280px, 0.9fr);
  }
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
  overflow: hidden;
`;

const CardHead = styled.div`
  padding: 20px clamp(18px, 3vw, 26px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  div span {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  div strong {
    display: block;
    margin-top: 4px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 15px;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StageBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(242, 106, 13, 0.4);
  background: rgba(242, 106, 13, 0.12);
  color: ${({ theme }) => theme.colors.white};
  font-size: 11px;
  font-weight: 600;
`;

const Summary = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1px;
  background: ${({ theme }) => theme.colors.line};
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  div {
    background: ${({ theme }) => theme.colors.charcoal};
    padding: 15px clamp(18px, 3vw, 26px);
  }

  dt {
    font-size: 9.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  dd {
    margin: 5px 0 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
  }
`;

const Latest = styled.div`
  padding: 18px clamp(18px, 3vw, 26px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(242, 106, 13, 0.05);

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  p {
    margin: 8px 0 0;
    font-size: 13.5px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.smoke};
  }

  em {
    display: block;
    margin-top: 7px;
    font-style: normal;
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

const Timeline = styled.ol`
  list-style: none;
  margin: 0;
  padding: 18px clamp(18px, 3vw, 26px) 22px;
  display: flex;
  flex-direction: column;
`;

const Step = styled.li`
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 12px;
  position: relative;
  padding-bottom: 18px;

  &:last-child { padding-bottom: 0; }

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 26px;
    bottom: 0;
    width: 1px;
    background: ${({ $state, theme }) =>
      $state === 'done' ? 'rgba(242,106,13,0.55)' : theme.colors.line};
  }

  &:last-child::before { display: none; }
`;

const Dot = styled.span`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
  margin-top: 1px;
  border: 1px solid ${({ $state, theme }) => ($state === 'done' ? 'rgba(242,106,13,0.7)' : $state === 'current' ? theme.colors.brand : theme.colors.lineStrong)};
  background: ${({ $state }) => ($state === 'done' ? 'rgba(242,106,13,0.18)' : $state === 'current' ? '#f26a0d' : '#101014')};
  color: ${({ $state }) => ($state === 'done' ? '#f26a0d' : $state === 'current' ? '#ffffff' : '#8a867f')};
  font-size: 10px;
  font-weight: 700;

  ${({ $state }) =>
    $state === 'current'
      ? 'box-shadow: 0 0 0 5px rgba(242,106,13,0.14);'
      : ''}
`;

const StepText = styled.div`
  strong {
    display: block;
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ $state, theme }) =>
      $state === 'upcoming' ? theme.colors.dim : theme.colors.white};
    line-height: 1.4;
  }

  p {
    margin: 3px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: ${({ $state, theme }) =>
      $state === 'upcoming' ? theme.colors.dim : theme.colors.muted};
  }

  time {
    display: block;
    margin-top: 4px;
    font-size: 10.5px;
    color: ${({ $state, theme }) =>
      $state === 'current' ? theme.colors.brand : theme.colors.dim};
  }
`;

const Side = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SideCard = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
  padding: 20px;

  h2 {
    margin: 0 0 6px;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.white};
  }

  > p {
    margin: 0 0 14px;
    font-size: 12.5px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const ContactRow = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: rgba(255, 255, 255, 0.02);
  color: ${({ theme }) => theme.colors.white};
  font-size: 13px;
  margin-top: 8px;
  transition: border-color 180ms ease, background 180ms ease;

  svg { flex: none; color: ${({ theme }) => theme.colors.brand}; }

  &:hover {
    border-color: rgba(242, 106, 13, 0.5);
    background: rgba(242, 106, 13, 0.07);
  }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 2px; }
`;

const Note = styled.div`
  display: flex;
  gap: 9px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 255, 255, 0.015);
  padding: 15px;
  font-size: 11.5px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.dim};

  svg { flex: none; margin-top: 1px; color: ${({ theme }) => theme.colors.brand}; }
`;

export function TrackingView({ booking, business, whatsappUrl }) {
  const currentIndex = stageIndex(booking.currentStage);
  const eventByStage = new Map();
  for (const event of booking.events) {
    if (!eventByStage.has(event.stage)) eventByStage.set(event.stage, event);
  }
  const latestNote = booking.events.find((event) => event.customerNote);
  const vehicle = [booking.brandName, booking.modelName].filter(Boolean).join(' ') || 'Vehicle';
  const current = BOOKING_STAGES[currentIndex];

  return (
    <Page>
      <Bar>
        <BarInner>
          <Link href="/" aria-label="Street Wrenchers home">
            <img src="/assets/brand/street-wrenchers-logo.png" alt="Street Wrenchers" />
          </Link>
          <Back href="/contact">
            <ArrowLeft size={13} aria-hidden="true" /> Contact workshop
          </Back>
        </BarInner>
      </Bar>

      <Wrap>
        <Intro>
          <span>
            <MapPin size={12} aria-hidden="true" /> Vehicle service tracking
          </span>
          <h1>Follow your vehicle&apos;s progress.</h1>
          <p>
            This private page is updated by the workshop team as your vehicle moves through the service.
            Keep this link to yourself — it does not require a login.
          </p>
        </Intro>

        <Layout>
          <Card>
            <CardHead>
              <div>
                <span>Booking reference</span>
                <strong>{booking.reference}</strong>
              </div>
              <StageBadge>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f26a0d' }} aria-hidden="true" />
                {current.customerLabel}
              </StageBadge>
            </CardHead>

            <Summary>
              <div>
                <dt>Vehicle</dt>
                <dd>{vehicle}</dd>
              </div>
              {booking.year ? (
                <div>
                  <dt>Year / fuel</dt>
                  <dd>{booking.year}{booking.fuelType ? ` · ${booking.fuelType}` : ''}</dd>
                </div>
              ) : null}
              <div>
                <dt>Service</dt>
                <dd>{booking.serviceName}{booking.packageName ? ` · ${booking.packageName}` : ''}</dd>
              </div>
              <div>
                <dt>Appointment</dt>
                <dd>{formatDate(booking.preferredDate)} · {booking.preferredTime}</dd>
              </div>
              <div>
                <dt>Expected delivery</dt>
                <dd>{booking.expectedDeliveryAt ? formatDateTime(booking.expectedDeliveryAt) : 'Being confirmed'}</dd>
              </div>
            </Summary>

            {latestNote ? (
              <Latest>
                <span>
                  <MessageCircle size={12} aria-hidden="true" /> Latest workshop update
                </span>
                <p>{latestNote.customerNote}</p>
                <em>{formatDateTime(latestNote.createdAt)}</em>
              </Latest>
            ) : null}

            <Timeline aria-label="Service progress">
              {BOOKING_STAGES.map((stage, index) => {
                const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';
                const event = eventByStage.get(stage.key);
                return (
                  <Step key={stage.key} $state={state}>
                    <Dot $state={state}>
                      {state === 'done' ? <Check size={13} aria-hidden="true" /> : index + 1}
                    </Dot>
                    <StepText $state={state}>
                      <strong>{stage.customerLabel}</strong>
                      {state === 'current' ? <p>{stage.description}</p> : null}
                      {event?.createdAt ? (
                        <time dateTime={event.createdAt}>
                          {state === 'current' ? 'Updated ' : ''}{formatDateTime(event.createdAt)}
                        </time>
                      ) : null}
                    </StepText>
                  </Step>
                );
              })}
            </Timeline>
          </Card>

          <Side>
            <SideCard>
              <h2>Workshop contact</h2>
              <p>Questions about the work, timing or an update? Speak to the team directly.</p>
              {business.phone ? (
                <ContactRow href={`tel:${business.phone.replace(/\s/g, '')}`}>
                  <Phone size={15} aria-hidden="true" /> {business.phone}
                </ContactRow>
              ) : null}
              {whatsappUrl ? (
                <ContactRow href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={15} aria-hidden="true" /> WhatsApp the workshop
                </ContactRow>
              ) : null}
              {business.email ? (
                <ContactRow href={`mailto:${business.email}`}>
                  <Mail size={15} aria-hidden="true" /> {business.email}
                </ContactRow>
              ) : null}
              {business.hours ? (
                <ContactRow as="span" style={{ cursor: 'default' }}>
                  <Clock size={15} aria-hidden="true" /> {business.hours}
                </ContactRow>
              ) : null}
              {!business.phone && !whatsappUrl && !business.email ? (
                <p style={{ margin: 0 }}>Contact details are being updated. Please use the website contact page.</p>
              ) : null}
            </SideCard>

            <SideCard>
              <h2>How updates work</h2>
              <p>
                The team changes the stage as work progresses. Customer-visible notes appear above the timeline.
                Internal workshop notes are never shown on this page.
              </p>
              <p style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
                <CalendarDays size={13} aria-hidden="true" style={{ color: '#f26a0d' }} />
                Last updated {formatDateTime(latestNote?.createdAt || booking.events[0]?.createdAt || booking.updatedAt)}
              </p>
            </SideCard>

            <Note>
              <ShieldCheck size={15} aria-hidden="true" />
              This link is private and can be revoked by the workshop. If it stops working, contact the team for a new
              link. Never share it publicly.
            </Note>
          </Side>
        </Layout>
      </Wrap>
    </Page>
  );
}
