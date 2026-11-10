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
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Receipt,
  User,
  Wrench,
} from 'lucide-react';
import { StatusBadge, labelize } from '@/components/dashboard/cells';
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
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

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
      adminNotes: booking.adminNotes || '',
    });
  }, [booking]);

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
    mutation.mutate(payload);
  };

  const utm = booking.utm && typeof booking.utm === 'object' ? Object.entries(booking.utm).filter(([, value]) => value) : [];
  const phoneDigits = waNumber(booking.phone);

  return (
    <>
      <BackBar>
        <Link href="/dashboard/bookings"><ArrowLeft size={14} /> All bookings</Link>
        <span style={{ fontSize: 11.5, color: '#66645f' }}>Created {formatDateTimeCell(booking.createdAt)}</span>
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
