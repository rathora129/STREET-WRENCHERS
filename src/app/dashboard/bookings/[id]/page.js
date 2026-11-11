'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import {
  ArrowLeft,
  CalendarClock,
  Car,
  Check,
  Copy,
  ExternalLink,
  History,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  RefreshCw,
  ShieldOff,
  User,
  Wrench,
} from 'lucide-react';
import { StatusBadge, labelize } from '@/components/dashboard/cells';
import { HelpTip } from '@/components/dashboard/help';
import { BOOKING_STAGES, stageMeta } from '@/lib/booking-stages';
import {
  CheckControl,
  Control,
  DashButton,
  FieldBlock,
  FormGrid,
  HeadActions,
  HeadText,
  Notice,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  SelectControl,
  Spinner,
  StateBox,
  TextControl,
  TwoCol,
  formatDateCell,
  formatDateTimeCell,
} from '@/components/dashboard/ui';
import { formatPrice, toDateInputValue } from '@/lib/utils';

const STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

const BackBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Details = styled.dl`
  display: grid;
  gap: 14px;

  div {
    display: grid;
    grid-template-columns: 116px minmax(0, 1fr);
    gap: 10px;
    padding-bottom: 13px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  div:last-child { border-bottom: 0; padding-bottom: 0; }

  dt {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  dd {
    font-size: 12.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.smoke};
    overflow-wrap: anywhere;
  }

  dd a { color: ${({ theme }) => theme.colors.brand}; }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const UtmList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    display: inline-flex;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.ink};
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.muted};
  }

  b { color: ${({ theme }) => theme.colors.smoke}; font-weight: 600; }
`;

function waNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('971')) return digits;
  if (digits.startsWith('0')) return `971${digits.slice(1)}`;
  return digits;
}

function toDubaiDateTimeInput(value) {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  const hour = part('hour') === '24' ? '00' : part('hour');
  return `${part('year')}-${part('month')}-${part('day')}T${hour}:${part('minute')}`;
}

function toIsoFromDubaiInput(value) {
  if (!value) return null;
  return `${value.length === 16 ? `${value}:00` : value}+04:00`;
}

const TrackLinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  input {
    flex: 1 1 250px;
    min-width: 0;
    padding: 10px 12px;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.smoke};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11.5px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const EventList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

const EventItem = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 9px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.ink};
  display: grid;
  gap: 7px;

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  header strong {
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.white};
  }

  header time {
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.dim};
  }

  p {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
    white-space: pre-wrap;
  }

  p b {
    display: block;
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-bottom: 3px;
  }

  p.customer b { color: ${({ theme }) => theme.colors.brand}; }
`;

const MessagePreview = styled.pre`
  margin: 10px 0 0;
  padding: 12px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.smoke};
  font-size: 11.5px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div>
      <dt>{Icon ? <Icon size={12} /> : null}{label}</dt>
      <dd>{children || '—'}</dd>
    </div>
  );
}

function BookingDetail() {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [stageForm, setStageForm] = useState({
    stage: 'PICKUP_SCHEDULED',
    customerNote: '',
    internalNote: '',
    expectedDeliveryAt: '',
  });
  const [stageResult, setStageResult] = useState(null);
  const [origin, setOrigin] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const bookingQuery = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/bookings/${id}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load booking');
      return payload.data;
    },
    enabled: Boolean(id),
  });

  const booking = bookingQuery.data;

  useEffect(() => {
    if (!booking) return;
    setForm({
      status: booking.status,
      customerName: booking.customerName || '',
      phone: booking.phone || '',
      email: booking.email || '',
      priceEstimate: booking.priceEstimate ?? '',
      preferredDate: toDateInputValue(booking.preferredDate),
      preferredTime: booking.preferredTime || '',
      pickupRequired: Boolean(booking.pickupRequired),
      pickupAddress: booking.pickupAddress || '',
      registrationNumber: booking.registrationNumber || '',
      assignedTo: booking.assignedTo || '',
      expectedDeliveryAt: toDubaiDateTimeInput(booking.expectedDeliveryAt),
      adminNotes: booking.adminNotes || '',
    });
    setStageForm((current) => ({
      ...current,
      stage: booking.currentStage || 'PICKUP_SCHEDULED',
      expectedDeliveryAt: toDubaiDateTimeInput(booking.expectedDeliveryAt),
    }));
  }, [booking?.id]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not update booking');
      return body.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-booking', id], data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
      setError('');
      setNotice('Booking updated.');
    },
    onError: (mutationError) => {
      setNotice('');
      setError(mutationError.message);
    },
  });

  const stageMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/admin/bookings/${id}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not update the service stage');
      return body.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-booking', id], data.booking);
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
      setStageResult({ whatsappUrl: data.whatsappUrl, message: data.message });
      setStageForm((current) => ({
        ...current,
        stage: data.booking.currentStage,
        customerNote: '',
        internalNote: '',
        expectedDeliveryAt: toDubaiDateTimeInput(data.booking.expectedDeliveryAt),
      }));
      setError('');
      setNotice('Service stage updated and saved to the tracking history.');
    },
    onError: (mutationError) => {
      setNotice('');
      setError(mutationError.message);
    },
  });

  const trackingMutation = useMutation({
    mutationFn: async (action) => {
      const response = await fetch(`/api/admin/bookings/${id}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not update the tracking link');
      return body.data;
    },
    onSuccess: (data, action) => {
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
      setStageResult(null);
      setError('');
      setNotice(
        action === 'revoke'
          ? 'Tracking link revoked. The old link no longer works.'
          : 'New tracking link generated. The previous link no longer works.',
      );
    },
    onError: (mutationError) => {
      setNotice('');
      setError(mutationError.message);
    },
  });

  if (bookingQuery.isLoading) {
    return (
      <StateBox>
        <Spinner />
        <p>Loading booking…</p>
      </StateBox>
    );
  }

  if (bookingQuery.isError || !form) {
    return (
      <StateBox>
        <h3>Booking not found</h3>
        <p>{bookingQuery.error?.message || 'This booking is no longer available.'}</p>
        <Link href="/dashboard/bookings" style={{ color: '#f26a0d', fontSize: 12 }}>Back to bookings</Link>
      </StateBox>
    );
  }

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const payload = {
      status: form.status,
      customerName: form.customerName,
      phone: form.phone,
      email: form.email.trim() || null,
      priceEstimate: form.priceEstimate === '' ? null : Number(form.priceEstimate),
      preferredTime: form.preferredTime,
      pickupRequired: form.pickupRequired,
      pickupAddress: form.pickupAddress.trim() || null,
      adminNotes: form.adminNotes.trim() || null,
    };
    if (form.preferredDate) payload.preferredDate = `${form.preferredDate}T00:00:00+04:00`;
    payload.registrationNumber = form.registrationNumber.trim() || null;
    payload.assignedTo = form.assignedTo.trim() || null;
    payload.expectedDeliveryAt = form.expectedDeliveryAt ? toIsoFromDubaiInput(form.expectedDeliveryAt) : null;
    mutation.mutate(payload);
  };

  const setStage = (key) => (event) => {
    const value = event.target.value;
    setStageForm((current) => ({ ...current, [key]: value }));
  };

  const submitStage = (event) => {
    event.preventDefault();
    stageMutation.mutate({
      stage: stageForm.stage,
      customerNote: stageForm.customerNote.trim(),
      internalNote: stageForm.internalNote.trim(),
      expectedDeliveryAt: stageForm.expectedDeliveryAt ? toIsoFromDubaiInput(stageForm.expectedDeliveryAt) : null,
    });
  };

  const trackingUrl =
    booking.trackingEnabled && booking.trackingToken ? `${origin}/track/${booking.trackingToken}` : null;

  const copyTrackingLink = async () => {
    if (!trackingUrl) return;
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setError('');
      setNotice('Tracking link copied to the clipboard.');
    } catch {
      setNotice('');
      setError('Could not copy automatically — select the link field and copy it manually.');
    }
  };

  const changeTracking = (action) => {
    const prompt =
      action === 'revoke'
        ? 'Revoke this tracking link? The customer will lose access immediately.'
        : 'Generate a new tracking link? The current link will stop working.';
    if (!window.confirm(prompt)) return;
    trackingMutation.mutate(action);
  };

  const shareMessage = trackingUrl && phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
        `Hello ${booking.customerName}, you can follow your vehicle service (${booking.reference}) here: ${trackingUrl}`,
      )}`
    : null;

  const events = Array.isArray(booking.stageEvents) ? booking.stageEvents : [];

  const utm = booking.utm && typeof booking.utm === 'object' ? Object.entries(booking.utm).filter(([, value]) => value) : [];
  const phoneDigits = waNumber(booking.phone);

  return (
    <>
      <BackBar>
        <Link href="/dashboard/bookings"><ArrowLeft size={14} /> All bookings</Link>
        <span style={{ fontSize: 11.5, color: '#8a867f' }}>Created {formatDateTimeCell(booking.createdAt)}</span>
      </BackBar>

      <PageHead>
        <HeadText>
          <span className="eyebrow">Operations · Booking</span>
          <h1>{booking.reference}</h1>
          <p>
            {booking.serviceName}
            {booking.packageName ? ` · ${booking.packageName}` : ''} · {labelize(booking.status)}
          </p>
        </HeadText>
        <HeadActions>
          <StatusBadge status={booking.status} />
          <HelpTip topicId="bookings" />
          <a href={`tel:${booking.phone}`}><DashButton as="span"><Phone size={14} /> Call</DashButton></a>
          {phoneDigits ? (
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">
              <DashButton as="span"><MessageCircle size={14} /> WhatsApp</DashButton>
            </a>
          ) : null}
          {booking.lead ? (
            <Link href={`/dashboard/leads/${booking.lead.id}`}>
              <DashButton as="span" $variant="ghost"><ExternalLink size={14} /> Open lead</DashButton>
            </Link>
          ) : null}
        </HeadActions>
      </PageHead>

      {notice ? <Notice $tone="success" style={{ marginBottom: 16 }}>{notice}</Notice> : null}
      {error ? <Notice $tone="error" style={{ marginBottom: 16 }}>{error}</Notice> : null}

      <Panel style={{ marginBottom: 16 }}>
        <PanelBody>
          <StatusRow>
            <span style={{ fontSize: 11, color: '#96938d', marginRight: 4 }}>Quick status</span>
            {STATUSES.map((status) => (
              <DashButton
                key={status}
                type="button"
                $small
                $variant={booking.status === status ? 'primary' : 'ghost'}
                disabled={mutation.isPending || booking.status === status}
                onClick={() => mutation.mutate({ status })}
              >
                {labelize(status)}
              </DashButton>
            ))}
          </StatusRow>
        </PanelBody>
      </Panel>

      <TwoCol style={{ marginBottom: 16 }}>
        <Panel>
          <PanelHead>
            <h2>Service stage</h2>
            <span style={{ fontSize: 11.5, color: '#ffbd90' }}>{stageMeta(booking.currentStage).customerLabel}</span>
          </PanelHead>
          <PanelBody>
            <form onSubmit={submitStage}>
              <FormGrid>
                <FieldBlock>
                  <span className="label">Stage</span>
                  <SelectControl value={stageForm.stage} onChange={setStage('stage')}>
                    {BOOKING_STAGES.map((stage) => (
                      <option key={stage.key} value={stage.key}>{stage.label}</option>
                    ))}
                  </SelectControl>
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Expected delivery</span>
                  <Control
                    type="datetime-local"
                    value={stageForm.expectedDeliveryAt}
                    onChange={setStage('expectedDeliveryAt')}
                  />
                </FieldBlock>
                <FieldBlock className="span-2">
                  <span className="label">Customer-visible update</span>
                  <TextControl
                    rows={3}
                    value={stageForm.customerNote}
                    onChange={setStage('customerNote')}
                    placeholder="Shown on the customer tracking page, e.g. “Your vehicle passed quality inspection.”"
                  />
                </FieldBlock>
                <FieldBlock className="span-2">
                  <span className="label">Internal note (never shown to the customer)</span>
                  <TextControl
                    rows={3}
                    value={stageForm.internalNote}
                    onChange={setStage('internalNote')}
                    placeholder="Workshop-only note for this stage change"
                  />
                </FieldBlock>
              </FormGrid>
              <ButtonRow style={{ justifyContent: 'flex-end' }}>
                <DashButton type="submit" $variant="primary" disabled={stageMutation.isPending}>
                  {stageMutation.isPending ? 'Saving…' : 'Update stage'}
                </DashButton>
              </ButtonRow>
            </form>

            {stageResult?.message ? (
              <Notice style={{ marginTop: 14 }}>
                Update saved. Nothing was sent automatically.
                {stageResult.whatsappUrl ? (
                  <a
                    href={stageResult.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', marginLeft: 6, color: '#ffd0ac', fontWeight: 600, textDecoration: 'underline' }}
                  >
                    Send on WhatsApp
                  </a>
                ) : null}
                <MessagePreview>{stageResult.message}</MessagePreview>
              </Notice>
            ) : null}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHead>
            <h2>Customer tracking link</h2>
            <Link2 size={15} style={{ color: '#96938d' }} aria-hidden="true" />
          </PanelHead>
          <PanelBody>
            {trackingUrl ? (
              <>
                <p style={{ margin: '0 0 12px', fontSize: 12.5, lineHeight: 1.65, color: '#cbc8c2' }}>
                  Private, no-login link for this booking. Anyone with the link can see vehicle details, the stage
                  timeline and customer-visible updates — share it only with the customer.
                </p>
                <TrackLinkRow>
                  <input value={trackingUrl} readOnly aria-label="Customer tracking link" onFocus={(event) => event.target.select()} />
                  <DashButton type="button" $small onClick={copyTrackingLink}>
                    <Copy size={13} aria-hidden="true" /> Copy
                  </DashButton>
                </TrackLinkRow>
                <ButtonRow>
                  <a href={trackingUrl} target="_blank" rel="noreferrer">
                    <DashButton as="span" $small $variant="ghost">
                      <ExternalLink size={13} aria-hidden="true" /> Preview
                    </DashButton>
                  </a>
                  {shareMessage ? (
                    <a href={shareMessage} target="_blank" rel="noreferrer">
                      <DashButton as="span" $small>
                        <MessageCircle size={13} aria-hidden="true" /> Send via WhatsApp
                      </DashButton>
                    </a>
                  ) : null}
                  <DashButton
                    type="button"
                    $small
                    $variant="ghost"
                    disabled={trackingMutation.isPending}
                    onClick={() => changeTracking('generate')}
                  >
                    <RefreshCw size={13} aria-hidden="true" /> Regenerate
                  </DashButton>
                  <DashButton
                    type="button"
                    $small
                    $variant="danger"
                    disabled={trackingMutation.isPending}
                    onClick={() => changeTracking('revoke')}
                  >
                    <ShieldOff size={13} aria-hidden="true" /> Revoke
                  </DashButton>
                </ButtonRow>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 12px', fontSize: 12.5, lineHeight: 1.65, color: '#cbc8c2' }}>
                  No active tracking link. Generate one to give this customer a private page showing their
                  vehicle&apos;s progress. Revoking or regenerating immediately disables the old link.
                </p>
                <DashButton
                  type="button"
                  $variant="primary"
                  disabled={trackingMutation.isPending}
                  onClick={() => trackingMutation.mutate('generate')}
                >
                  <Link2 size={14} aria-hidden="true" /> {trackingMutation.isPending ? 'Generating…' : 'Generate tracking link'}
                </DashButton>
              </>
            )}
          </PanelBody>
        </Panel>
      </TwoCol>

      <Panel style={{ marginBottom: 16 }}>
        <PanelHead>
          <h2>Stage history</h2>
          <span style={{ fontSize: 11.5, color: '#96938d' }}>{events.length} update{events.length === 1 ? '' : 's'}</span>
        </PanelHead>
        <PanelBody>
          {events.length ? (
            <EventList>
              {events.map((event) => (
                <EventItem key={event.id}>
                  <header>
                    <strong>
                      {stageMeta(event.stage).customerLabel}
                    </strong>
                    <time dateTime={event.createdAt}>{formatDateTimeCell(event.createdAt)}</time>
                  </header>
                  {event.updatedBy ? (
                    <p style={{ fontSize: 11 }}>Updated by {event.updatedBy}</p>
                  ) : null}
                  {event.customerNote ? (
                    <p className="customer"><b>Customer-visible</b>{event.customerNote}</p>
                  ) : null}
                  {event.internalNote ? (
                    <p><b>Internal note</b>{event.internalNote}</p>
                  ) : null}
                </EventItem>
              ))}
            </EventList>
          ) : (
            <p style={{ margin: 0, fontSize: 12.5, color: '#96938d' }}>
              No stage updates yet. The first update will appear here and on the customer tracking page.
            </p>
          )}
        </PanelBody>
      </Panel>

      <TwoCol style={{ marginBottom: 16 }}>
        <Panel>
          <PanelHead><h2>Appointment and vehicle</h2></PanelHead>
          <PanelBody>
            <Details>
              <DetailRow icon={CalendarClock} label="Appointment">
                {formatDateCell(booking.preferredDate)}
                {booking.preferredTime ? <span style={{ display: 'block', color: '#96938d' }}>{booking.preferredTime} GST</span> : null}
              </DetailRow>
              <DetailRow icon={Wrench} label="Service">
                {booking.service?.name || booking.serviceName}
                {booking.package?.name ? <span style={{ display: 'block', color: '#96938d' }}>{booking.package.name}</span> : null}
              </DetailRow>
              <DetailRow icon={Car} label="Vehicle">
                {[booking.brandName, booking.modelName, booking.year].filter(Boolean).join(' ') || '—'}
                {booking.fuelType ? <span style={{ display: 'block', color: '#96938d' }}>{booking.fuelType}</span> : null}
              </DetailRow>
              <DetailRow label="Registration">
                {booking.registrationNumber || '—'}
              </DetailRow>
              <DetailRow label="Assigned to">
                {booking.assignedTo || 'Unassigned'}
              </DetailRow>
              <DetailRow label="Expected delivery">
                {booking.expectedDeliveryAt ? formatDateTimeCell(booking.expectedDeliveryAt) : 'Being confirmed'}
              </DetailRow>
              <DetailRow icon={MapPin} label="Pickup">
                {booking.pickupRequired ? booking.pickupAddress || 'Requested — address not provided' : 'Not requested'}
              </DetailRow>
              <DetailRow icon={Receipt} label="Estimate">
                {booking.priceEstimate == null ? 'Not quoted' : formatPrice(booking.priceEstimate)}
              </DetailRow>
              <DetailRow label="Source">
                {booking.source || 'website'}
              </DetailRow>
            </Details>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHead><h2>Customer</h2></PanelHead>
          <PanelBody>
            <Details>
              <DetailRow icon={User} label="Name">{booking.customerName}</DetailRow>
              <DetailRow icon={Phone} label="Phone">
                <a href={`tel:${booking.phone}`}>{booking.phone}</a>
              </DetailRow>
              <DetailRow icon={Mail} label="Email">
                {booking.email ? <a href={`mailto:${booking.email}`}>{booking.email}</a> : '—'}
              </DetailRow>
              <DetailRow icon={MessageCircle} label="WhatsApp">
                {phoneDigits ? (
                  <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">Open WhatsApp chat</a>
                ) : '—'}
              </DetailRow>
              <DetailRow label="Customer record">
                {booking.customer ? (
                  <Link href={`/dashboard/customers?q=${encodeURIComponent(booking.customer.phone)}`}>
                    {booking.customer.name}
                  </Link>
                ) : 'Not linked'}
              </DetailRow>
            </Details>
          </PanelBody>
        </Panel>
      </TwoCol>

      <TwoCol style={{ marginBottom: 16 }}>
        <Panel>
          <PanelHead><h2>Update this booking</h2></PanelHead>
          <PanelBody>
            <form onSubmit={submit}>
              <FormGrid>
                <FieldBlock>
                  <span className="label">Booking status</span>
                  <SelectControl value={form.status} onChange={set('status')}>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{labelize(status)}</option>
                    ))}
                  </SelectControl>
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Price estimate (AED)</span>
                  <Control type="number" min="0" step="0.01" value={form.priceEstimate} onChange={set('priceEstimate')} placeholder="Not quoted" />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Appointment date</span>
                  <Control type="date" value={form.preferredDate} onChange={set('preferredDate')} />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Appointment time</span>
                  <Control type="time" value={form.preferredTime} onChange={set('preferredTime')} />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Registration number</span>
                  <Control value={form.registrationNumber} onChange={set('registrationNumber')} placeholder="e.g. A 12345" />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Assigned staff</span>
                  <Control value={form.assignedTo} onChange={set('assignedTo')} placeholder="Technician or advisor" />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Expected delivery</span>
                  <Control type="datetime-local" value={form.expectedDeliveryAt} onChange={set('expectedDeliveryAt')} />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Customer name</span>
                  <Control value={form.customerName} onChange={set('customerName')} />
                </FieldBlock>
                <FieldBlock>
                  <span className="label">Phone</span>
                  <Control value={form.phone} onChange={set('phone')} />
                </FieldBlock>
                <FieldBlock className="span-2">
                  <span className="label">Email</span>
                  <Control type="email" value={form.email} onChange={set('email')} />
                </FieldBlock>
                <div className="span-2">
                  <CheckControl>
                    <input type="checkbox" checked={form.pickupRequired} onChange={set('pickupRequired')} />
                    <span>Pickup and drop-off required</span>
                  </CheckControl>
                </div>
                <FieldBlock className="span-2">
                  <span className="label">Pickup address</span>
                  <Control value={form.pickupAddress} onChange={set('pickupAddress')} />
                </FieldBlock>
                <FieldBlock className="span-2">
                  <span className="label">Internal notes</span>
                  <TextControl rows={4} value={form.adminNotes} onChange={set('adminNotes')} placeholder="Notes visible only to the workshop team" />
                </FieldBlock>
              </FormGrid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                <DashButton type="submit" $variant="primary" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving…' : 'Save changes'}
                </DashButton>
              </div>
            </form>
          </PanelBody>
        </Panel>

        <div style={{ display: 'grid', gap: 16 }}>
          <Panel>
            <PanelHead><h2>Customer notes</h2></PanelHead>
            <PanelBody>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, color: '#cbc8c2', whiteSpace: 'pre-wrap' }}>
                {booking.notes || 'The customer did not leave any notes with this booking.'}
              </p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHead><h2>Attribution</h2></PanelHead>
            <PanelBody>
              {utm.length ? (
                <UtmList>
                  {utm.map(([key, value]) => (
                    <span key={key}><b>{key}</b> {String(value)}</span>
                  ))}
                </UtmList>
              ) : (
                <p style={{ fontSize: 12, color: '#96938d' }}>
                  No campaign or UTM parameters were captured for this booking. Source: {booking.source || 'website'}.
                </p>
              )}
            </PanelBody>
          </Panel>
        </div>
      </TwoCol>
    </>
  );
}

export default function BookingDetailPage() {
  return <BookingDetail />;
}
