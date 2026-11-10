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
  MessageCircle,
  Phone,
  Send,
  Tag,
  User,
} from 'lucide-react';
import { StatusBadge, labelize } from '@/components/dashboard/cells';
import {
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
  formatDateTimeCell,
} from '@/components/dashboard/ui';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];
const TYPES = ['CONTACT', 'SERVICE_BOOKING', 'AMC', 'WHATSAPP', 'RENTAL', 'CAR_SALES', 'BUY_CAR', 'SELL_CAR', 'MARKETING'];
const ACTIVITY_TYPES = ['NOTE', 'CALL', 'WHATSAPP', 'EMAIL', 'MEETING', 'FOLLOW_UP'];

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

const Tags = styled.div`
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

const Timeline = styled.ol`
  display: grid;
  gap: 0;
  list-style: none;

  li {
    position: relative;
    padding: 0 0 18px 22px;
    border-left: 1px solid ${({ theme }) => theme.colors.line};
  }

  li:last-child { border-left-color: transparent; padding-bottom: 0; }

  li::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 3px;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.brand};
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-size: 10.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  .type { color: ${({ theme }) => theme.colors.brand}; font-weight: 600; }

  p {
    margin-top: 6px;
    font-size: 12.5px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.smoke};
    white-space: pre-wrap;
  }
`;

function waNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('971')) return digits;
  if (digits.startsWith('0')) return `971${digits.slice(1)}`;
  return digits;
}

function toDateTimeLocal(value) {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
}

function DetailRow({ icon: Icon, label, children }) {
  return (
    <div>
      <dt>{Icon ? <Icon size={12} /> : null}{label}</dt>
      <dd>{children || '—'}</dd>
    </div>
  );
}

function LeadDetail() {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [activity, setActivity] = useState({ type: 'NOTE', note: '' });
  const [activityError, setActivityError] = useState('');

  const leadQuery = useQuery({
    queryKey: ['admin-lead', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/leads/${id}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load lead');
      return payload.data;
    },
    enabled: Boolean(id),
  });

  const activitiesQuery = useQuery({
    queryKey: ['lead-activities', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/leads/${id}/activities`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load activity');
      return payload.data;
    },
    enabled: Boolean(id),
  });

  const lead = leadQuery.data;

  useEffect(() => {
    if (!lead) return;
    setForm({
      status: lead.status,
      type: lead.type,
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      vehicleBrand: lead.vehicleBrand || '',
      vehicleModel: lead.vehicleModel || '',
      vehicleYear: lead.vehicleYear ?? '',
      followUpAt: toDateTimeLocal(lead.followUpAt),
      notes: lead.notes || '',
    });
  }, [lead]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not update lead');
      return body.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['admin-lead', id], data);
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
      setError('');
      setNotice('Lead updated.');
    },
    onError: (mutationError) => {
      setNotice('');
      setError(mutationError.message);
    },
  });

  const activityMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`/api/admin/leads/${id}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not add activity');
      return body.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead-activities', id] });
      setActivity((current) => ({ ...current, note: '' }));
      setActivityError('');
    },
    onError: (mutationError) => setActivityError(mutationError.message),
  });

  if (leadQuery.isLoading) {
    return (
      <StateBox>
        <Spinner />
        <p>Loading lead…</p>
      </StateBox>
    );
  }

  if (leadQuery.isError || !form) {
    return (
      <StateBox>
        <h3>Lead not found</h3>
        <p>{leadQuery.error?.message || 'This lead is no longer available.'}</p>
        <Link href="/dashboard/leads" style={{ color: '#f26a0d', fontSize: 12 }}>Back to leads</Link>
      </StateBox>
    );
  }

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const followUpAt = form.followUpAt
      ? `${form.followUpAt.length === 16 ? `${form.followUpAt}:00` : form.followUpAt}+04:00`
      : null;
    const payload = {
      status: form.status,
      type: form.type,
      name: form.name,
      phone: form.phone,
      email: form.email.trim() || null,
      vehicleBrand: form.vehicleBrand.trim() || null,
      vehicleModel: form.vehicleModel.trim() || null,
      vehicleYear: form.vehicleYear === '' ? null : Number(form.vehicleYear),
      followUpAt,
      notes: form.notes.trim() || null,
    };
    mutation.mutate(payload);
  };

  const addActivity = (event) => {
    event.preventDefault();
    if (!activity.note.trim()) {
      setActivityError('Add a short note before saving.');
      return;
    }
    activityMutation.mutate({ type: activity.type, note: activity.note.trim() });
  };

  const utm = [
    ['source', lead.utmSource],
    ['medium', lead.utmMedium],
    ['campaign', lead.utmCampaign],
    ['term', lead.utmTerm],
    ['content', lead.utmContent],
  ].filter(([, value]) => value);
  const phoneDigits = waNumber(lead.phone);
  const activities = activitiesQuery.data || [];

  return (
    <>
      <BackBar>
        <Link href="/dashboard/leads"><ArrowLeft size={14} /> All leads</Link>
        <span style={{ fontSize: 11.5, color: '#66645f' }}>Received {formatDateTimeCell(lead.createdAt)}</span>
      </BackBar>

      <PageHead>
        <HeadText>
          <span className="eyebrow">CRM · {labelize(lead.type)}</span>
          <h1>{lead.name}</h1>
          <p>
            {lead.message ? lead.message.slice(0, 120) : 'No message supplied.'}
          </p>
        </HeadText>
        <HeadActions>
          <StatusBadge status={lead.status} />
          <a href={`tel:${lead.phone}`}><DashButton as="span"><Phone size={14} /> Call</DashButton></a>
          {phoneDigits ? (
            <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">
              <DashButton as="span"><MessageCircle size={14} /> WhatsApp</DashButton>
            </a>
          ) : null}
          {lead.booking ? (
            <Link href={`/dashboard/bookings/${lead.booking.id}`}>
              <DashButton as="span" $variant="ghost"><ExternalLink size={14} /> {lead.booking.reference}</DashButton>
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
                $variant={lead.status === status ? 'primary' : 'ghost'}
                disabled={mutation.isPending || lead.status === status}
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
          <PanelHead><h2>Enquiry</h2></PanelHead>
          <PanelBody>
            <Details>
              <DetailRow icon={User} label="Contact">
                {lead.name}
                <span style={{ display: 'block', color: '#96938d' }}>{lead.phone}</span>
              </DetailRow>
              <DetailRow icon={Mail} label="Email">
                {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : '—'}
              </DetailRow>
              <DetailRow icon={Car} label="Vehicle">
                {[lead.vehicleBrand, lead.vehicleModel, lead.vehicleYear].filter(Boolean).join(' ') || '—'}
              </DetailRow>
              <DetailRow icon={Tag} label="Source">
                {lead.source || 'website'}
                {lead.campaign ? (
                  <span style={{ display: 'block', color: '#96938d' }}>
                    Campaign: {lead.campaign.name} ({lead.campaign.campaignId})
                  </span>
                ) : null}
                {lead.landingPage ? (
                  <span style={{ display: 'block', color: '#96938d' }}>Landing: {lead.landingPage}</span>
                ) : null}
              </DetailRow>
              <DetailRow icon={CalendarClock} label="Follow-up">
                {lead.followUpAt ? formatDateTimeCell(lead.followUpAt) : 'Not scheduled'}
              </DetailRow>
              <DetailRow label="Booking">
                {lead.booking ? (
                  <Link href={`/dashboard/bookings/${lead.booking.id}`}>
                    {lead.booking.reference} · {labelize(lead.booking.status)}
                  </Link>
                ) : 'No booking linked'}
              </DetailRow>
            </Details>

            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#66645f', marginBottom: 7 }}>
                Message
              </p>
              <p style={{ fontSize: 12.5, lineHeight: 1.75, color: '#cbc8c2', whiteSpace: 'pre-wrap' }}>
                {lead.message || 'The enquiry did not include a message.'}
              </p>
            </div>

            {utm.length ? (
              <div style={{ marginTop: 18 }}>
                <p style={{ fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#66645f', marginBottom: 8 }}>
                  UTM parameters
                </p>
                <Tags>
                  {utm.map(([key, value]) => (
                    <span key={key}><b>{key}</b> {value}</span>
                  ))}
                </Tags>
              </div>
            ) : null}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHead><h2>Activity timeline</h2></PanelHead>
          <PanelBody>
            {activitiesQuery.isLoading ? (
              <StateBox><Spinner /><p>Loading activity…</p></StateBox>
            ) : activities.length ? (
              <Timeline>
                {activities.map((item) => (
                  <li key={item.id}>
                    <div className="meta">
                      <span className="type">{labelize(item.type)}</span>
                      <span>·</span>
                      <span>{formatDateTimeCell(item.createdAt)}</span>
                    </div>
                    <p>{item.note}</p>
                  </li>
                ))}
              </Timeline>
            ) : (
              <p style={{ fontSize: 12.5, color: '#96938d', lineHeight: 1.7 }}>
                No activity has been logged yet. Use the form below to record calls, messages and follow-ups.
              </p>
            )}

            <form onSubmit={addActivity} style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <FormGrid>
                <FieldBlock>
                  <span className="label">Activity type</span>
                  <SelectControl value={activity.type} onChange={(event) => setActivity((current) => ({ ...current, type: event.target.value }))}>
                    {ACTIVITY_TYPES.map((type) => (
                      <option key={type} value={type}>{labelize(type)}</option>
                    ))}
                  </SelectControl>
                </FieldBlock>
                <div />
                <FieldBlock className="span-2">
                  <span className="label">Note</span>
                  <TextControl
                    rows={3}
                    value={activity.note}
                    onChange={(event) => setActivity((current) => ({ ...current, note: event.target.value }))}
                    placeholder="What happened in this interaction?"
                  />
                </FieldBlock>
              </FormGrid>
              {activityError ? <p style={{ marginTop: 10, fontSize: 11.5, color: '#ff9a9d' }}>{activityError}</p> : null}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <DashButton type="submit" $variant="primary" $small disabled={activityMutation.isPending}>
                  <Send size={13} /> {activityMutation.isPending ? 'Saving…' : 'Log activity'}
                </DashButton>
              </div>
            </form>
          </PanelBody>
        </Panel>
      </TwoCol>

      <Panel>
        <PanelHead><h2>Lead details and follow-up</h2></PanelHead>
        <PanelBody>
          <form onSubmit={submit}>
            <FormGrid>
              <FieldBlock>
                <span className="label">Status</span>
                <SelectControl value={form.status} onChange={set('status')}>
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{labelize(status)}</option>
                  ))}
                </SelectControl>
              </FieldBlock>
              <FieldBlock>
                <span className="label">Lead type</span>
                <SelectControl value={form.type} onChange={set('type')}>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>{labelize(type)}</option>
                  ))}
                </SelectControl>
              </FieldBlock>
              <FieldBlock>
                <span className="label">Name</span>
                <Control value={form.name} onChange={set('name')} />
              </FieldBlock>
              <FieldBlock>
                <span className="label">Phone</span>
                <Control value={form.phone} onChange={set('phone')} />
              </FieldBlock>
              <FieldBlock className="span-2">
                <span className="label">Email</span>
                <Control type="email" value={form.email} onChange={set('email')} />
              </FieldBlock>
              <FieldBlock>
                <span className="label">Vehicle brand</span>
                <Control value={form.vehicleBrand} onChange={set('vehicleBrand')} />
              </FieldBlock>
              <FieldBlock>
                <span className="label">Vehicle model</span>
                <Control value={form.vehicleModel} onChange={set('vehicleModel')} />
              </FieldBlock>
              <FieldBlock>
                <span className="label">Vehicle year</span>
                <Control type="number" min="1900" max="2100" value={form.vehicleYear} onChange={set('vehicleYear')} />
              </FieldBlock>
              <FieldBlock>
                <span className="label">Follow-up date and time</span>
                <Control type="datetime-local" value={form.followUpAt} onChange={set('followUpAt')} />
              </FieldBlock>
              <FieldBlock className="span-2">
                <span className="label">Internal notes</span>
                <TextControl rows={4} value={form.notes} onChange={set('notes')} placeholder="Recording of the conversation, next steps and objections" />
              </FieldBlock>
            </FormGrid>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
              <DashButton type="submit" $variant="primary" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Save lead'}
              </DashButton>
            </div>
          </form>
        </PanelBody>
      </Panel>
    </>
  );
}

export default function LeadDetailPage() {
  return <LeadDetail />;
}
