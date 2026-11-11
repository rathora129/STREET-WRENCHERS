'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowLeft, CalendarDays, Mail, MessageCircle, Phone, Receipt, Wallet } from 'lucide-react';
import { StatusBadge, labelize } from '@/components/dashboard/cells';
import { stageMeta } from '@/lib/booking-stages';
import { formatPrice } from '@/lib/utils';
import {
  DashButton,
  HeadActions,
  HeadText,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  RowLink,
  Spinner,
  StateBox,
  StatsGrid,
  StatCard,
  TableWrap,
  formatDateCell,
  formatDateTimeCell,
} from '@/components/dashboard/ui';

const Contact = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 14px;
  font-size: 12.5px;
  color: ${({ theme }) => theme.colors.muted};

  span { display: inline-flex; align-items: center; gap: 7px; }
  a { color: ${({ theme }) => theme.colors.brand}; }
`;

const Muted = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.dim};
`;

const Message = styled.p`
  max-width: 420px;
  font-size: 12.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.smoke};
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

const Timeline = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;

  li {
    position: relative;
    padding: 0 0 18px 22px;
    border-left: 1px solid ${({ theme }) => theme.colors.line};
    margin-left: 5px;
  }

  li::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 4px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brand};
  }

  li:last-child { border-left-color: transparent; padding-bottom: 0; }

  strong { display: block; font-size: 12.5px; color: ${({ theme }) => theme.colors.white}; }
  p { margin-top: 3px; font-size: 12.5px; color: ${({ theme }) => theme.colors.smoke}; line-height: 1.55; }
  time { display: block; margin-top: 4px; font-size: 10.5px; color: ${({ theme }) => theme.colors.dim}; }
`;

export default function CustomerHistoryPage() {
  const { id } = useParams();

  const customerQuery = useQuery({
    queryKey: ['admin-customer', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/customers/${id}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load customer');
      return payload.data;
    },
    enabled: Boolean(id),
  });

  const customer = customerQuery.data;
  const activities = (customer?.leads || [])
    .flatMap((lead) =>
      (lead.activities || []).map((activity) => ({
        ...activity,
        leadName: lead.name,
        leadType: lead.type,
      })),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 25);

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Operations · Customer</span>
          <h1>{customer?.name || 'Customer history'}</h1>
          <p>Every booking, website enquiry and CRM activity linked to this customer.</p>
          {customer ? (
            <Contact>
              <span><Phone size={13} /> <a href={`tel:${customer.phone}`}>{customer.phone}</a></span>
              {customer.email ? <span><Mail size={13} /> <a href={`mailto:${customer.email}`}>{customer.email}</a></span> : null}
              <span><CalendarDays size={13} /> Customer since {formatDateCell(customer.createdAt)}</span>
            </Contact>
          ) : null}
        </HeadText>
        <HeadActions>
          <DashButton as={Link} href="/dashboard/customers" $small>
            <ArrowLeft size={14} /> All customers
          </DashButton>
        </HeadActions>
      </PageHead>

      {customerQuery.isLoading ? (
        <StateBox><Spinner /> Loading customer history…</StateBox>
      ) : customerQuery.isError ? (
        <StateBox>
          <h3>Customer not found</h3>
          <p>{customerQuery.error.message}</p>
          <DashButton as={Link} href="/dashboard/customers" $small>Back to customers</DashButton>
        </StateBox>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <span className="label"><Receipt size={14} /> Bookings</span>
              <span className="value">{customer.totalBookings}</span>
              <span className="hint">Excluding cancelled</span>
            </StatCard>
            <StatCard>
              <span className="label"><Wallet size={14} /> Lifetime spend</span>
              <span className="value">{formatPrice(customer.totalSpent)}</span>
              <span className="hint">Completed bookings only</span>
            </StatCard>
            <StatCard>
              <span className="label"><CalendarDays size={14} /> Last visit</span>
              <span className="value" style={{ fontSize: 22 }}>
                {customer.lastVisitAt ? formatDateCell(customer.lastVisitAt) : 'No completed visit'}
              </span>
              <span className="hint">Latest completed appointment</span>
            </StatCard>
            <StatCard>
              <span className="label"><MessageCircle size={14} /> Enquiries</span>
              <span className="value">{customer.leads?.length || 0}</span>
              <span className="hint">Website and CRM enquiries</span>
            </StatCard>
          </StatsGrid>

          <div style={{ display: 'grid', gap: 18, marginTop: 18 }}>
            <Panel>
              <PanelHead>
                <h2>Bookings</h2>
                <Muted>{customer.bookings?.length || 0} total</Muted>
              </PanelHead>
              <PanelBody>
                {customer.bookings?.length ? (
                  <TableWrap>
                    <table>
                      <thead>
                        <tr>
                          <th>Reference</th>
                          <th>Service</th>
                          <th>Appointment</th>
                          <th>Stage</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Estimate</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {customer.bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td>{booking.reference}</td>
                            <td>{booking.service?.name || booking.serviceName}{booking.package?.name ? ` · ${booking.package.name}` : ''}</td>
                            <td>{formatDateCell(booking.preferredDate)} · {booking.preferredTime}</td>
                            <td>{stageMeta(booking.currentStage).customerLabel}</td>
                            <td><StatusBadge status={booking.status} /></td>
                            <td style={{ textAlign: 'right' }}>{booking.priceEstimate == null ? '—' : formatPrice(booking.priceEstimate)}</td>
                            <td style={{ textAlign: 'right' }}>
                              <RowLink as={Link} href={`/dashboard/bookings/${booking.id}`}>View</RowLink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                ) : (
                  <StateBox><h3>No bookings yet</h3><p>Bookings linked to this customer will appear here.</p></StateBox>
                )}
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHead>
                <h2>Enquiries</h2>
                <Muted>{customer.leads?.length || 0} total</Muted>
              </PanelHead>
              <PanelBody>
                {customer.leads?.length ? (
                  <TableWrap>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Message</th>
                          <th>Source</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customer.leads.map((lead) => (
                          <tr key={lead.id}>
                            <td>{formatDateTimeCell(lead.createdAt)}</td>
                            <td>{labelize(lead.type)}</td>
                            <td><Message>{lead.message || 'No message'}</Message></td>
                            <td>{lead.source || 'website'}</td>
                            <td><StatusBadge status={lead.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                ) : (
                  <StateBox><h3>No enquiries yet</h3><p>Website enquiries linked to this customer will appear here.</p></StateBox>
                )}
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHead>
                <h2>Recent activity</h2>
                <Muted>Latest CRM notes and follow-ups</Muted>
              </PanelHead>
              <PanelBody>
                {activities.length ? (
                  <Timeline>
                    {activities.map((activity) => (
                      <li key={activity.id}>
                        <strong>{activity.leadName} · {labelize(activity.type)}</strong>
                        <p>{activity.note}</p>
                        <time dateTime={activity.createdAt}>{formatDateTimeCell(activity.createdAt)}</time>
                      </li>
                    ))}
                  </Timeline>
                ) : (
                  <StateBox><h3>No activity logged</h3><p>CRM activities for this customer will appear here.</p></StateBox>
                )}
              </PanelBody>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}
