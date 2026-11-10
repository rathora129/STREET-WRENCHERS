'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpRight,
  CalendarCheck2,
  Car,
  CheckCircle2,
  Clock3,
  Eye,
  MessageCircle,
  ShieldCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { media } from '@/styles/theme';
import { formatPrice } from '@/lib/utils';
import {
  DashButton,
  HeadActions,
  HeadText,
  PageHead,
  Panel,
  PanelBody,
  PanelHead,
  Spinner,
  StateBox,
  StatsGrid,
  StatCard,
  TableWrap,
  ToneBadge,
  TwoCol,
  formatDateCell,
  formatDateTimeCell,
  Notice,
} from './ui';

const MiniList = styled.ul`
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};

    &:last-child { border-bottom: 0; }
  }

  .who { font-size: 12.5px; color: ${({ theme }) => theme.colors.white}; font-weight: 500; }
  .what { margin-top: 2px; font-size: 11.5px; color: ${({ theme }) => theme.colors.dim}; line-height: 1.5; }
  .when { flex: none; font-size: 10.5px; color: ${({ theme }) => theme.colors.dim}; text-align: right; white-space: nowrap; }
`;

const ModuleGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;

  ${media.md} { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

const ModuleCard = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 15px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.coal};

  strong { display: block; font-size: 12.5px; color: ${({ theme }) => theme.colors.white}; }
  span { display: block; margin-top: 2px; font-size: 10.5px; color: ${({ theme }) => theme.colors.dim}; }

  &:hover { border-color: ${({ theme }) => theme.colors.lineStrong}; }
`;

const QuickGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${media.lg} { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`;

const QuickLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.charcoal};
  color: ${({ theme }) => theme.colors.smoke};
  font-size: 12px;

  svg { color: ${({ theme }) => theme.colors.brand}; }
  &:hover { border-color: ${({ theme }) => theme.colors.lineStrong}; color: ${({ theme }) => theme.colors.white}; }
`;

const Split = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 16px;

  ${media.lg} { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
`;

const STATUS_TONE = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export function OverviewView() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const response = await fetch('/api/admin/overview');
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load dashboard');
      return payload.data;
    },
  });

  if (isLoading) {
    return (
      <StateBox>
        <Spinner />
        <p>Loading today’s workshop overview…</p>
      </StateBox>
    );
  }

  if (isError) {
    return (
      <StateBox>
        <h3>Dashboard unavailable</h3>
        <p>{error.message}</p>
        <DashButton $small onClick={() => refetch()} type="button">Try again</DashButton>
      </StateBox>
    );
  }

  const { counts, recentBookings, recentLeads, upcoming, modules } = data;
  const today = new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">{today} · Dubai</span>
          <h1>Workshop overview</h1>
          <p>Live bookings, customer enquiries and website activity from the Street Wrenchers database.</p>
        </HeadText>
        <HeadActions>
          <DashButton as={Link} href="/dashboard/bookings" $small>
            <CalendarCheck2 size={14} /> Bookings
          </DashButton>
          <DashButton as={Link} href="/dashboard/leads" $variant="primary" $small>
            <MessageCircle size={14} /> Open CRM
          </DashButton>
        </HeadActions>
      </PageHead>

      <StatsGrid>
        <StatCard>
          <div className="top"><span>Today’s bookings</span><CalendarCheck2 size={16} /></div>
          <span className="value">{counts.todayBookings}</span>
          <span className="hint">{counts.pendingBookings} pending or confirmed</span>
        </StatCard>
        <StatCard>
          <div className="top"><span>New leads</span><Users size={16} /></div>
          <span className="value">{counts.newLeads}</span>
          <span className="hint">{counts.totalCustomers} customers in CRM</span>
        </StatCard>
        <StatCard>
          <div className="top"><span>Completed revenue</span><CheckCircle2 size={16} /></div>
          <span className="value">{counts.completedRevenue === null || counts.completedRevenue === undefined ? '—' : formatPrice(counts.completedRevenue)}</span>
          <span className="hint">From completed bookings</span>
        </StatCard>
        <StatCard>
          <div className="top"><span>Page views · 7 days</span><Eye size={16} /></div>
          <span className="value">{counts.pageViews}</span>
          <span className="hint">{counts.whatsappClicks} WhatsApp clicks</span>
        </StatCard>
      </StatsGrid>

      <QuickGrid style={{ marginTop: 16 }}>
        <QuickLink href="/dashboard/services">
          <Wrench size={16} />
          <span>{counts.publishedServices} published services</span>
        </QuickLink>
        <QuickLink href="/dashboard/blog">
          <ShieldCheck size={16} />
          <span>{counts.publishedBlogs} published articles</span>
        </QuickLink>
        <QuickLink href="/dashboard/bookings">
          <Car size={16} />
          <span>{counts.totalBookings} lifetime bookings</span>
        </QuickLink>
        <QuickLink href="/dashboard/modules">
          <Clock3 size={16} />
          <span>Manage future modules</span>
        </QuickLink>
      </QuickGrid>

      <Split>
        <Panel>
          <PanelHead>
            <h2>Recent bookings</h2>
            <Link href="/dashboard/bookings">View all</Link>
          </PanelHead>
          {recentBookings.length ? (
            <TableWrap $min="620px">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Appointment</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <span className="primary">{booking.reference}</span>
                        <span className="sub">{formatDateTimeCell(booking.createdAt)}</span>
                      </td>
                      <td>
                        <span className="primary">{booking.customerName}</span>
                        <span className="sub">{booking.phone}</span>
                      </td>
                      <td>{booking.service?.name || booking.serviceName}</td>
                      <td>
                        {formatDateCell(booking.preferredDate)}
                        <span className="sub">{booking.preferredTime}</span>
                      </td>
                      <td><ToneBadge $tone={STATUS_TONE[booking.status]}>{booking.status.replace('_', ' ')}</ToneBadge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          ) : (
            <StateBox>
              <CalendarCheck2 size={24} />
              <h3>No bookings yet</h3>
              <p>Public bookings will appear here as soon as they are submitted.</p>
            </StateBox>
          )}
        </Panel>

        <Panel>
          <PanelHead>
            <h2>New enquiries</h2>
            <Link href="/dashboard/leads">View CRM</Link>
          </PanelHead>
          {recentLeads.length ? (
            <MiniList>
              {recentLeads.map((lead) => (
                <li key={lead.id}>
                  <div>
                    <span className="who">{lead.name}</span>
                    <span className="what">
                      {lead.type.replaceAll('_', ' ')} · {lead.phone}
                    </span>
                  </div>
                  <div className="when">
                    {formatDateCell(lead.createdAt)}
                    <br />
                    <ToneBadge $tone={lead.status === 'NEW' ? 'warning' : 'neutral'}>{lead.status}</ToneBadge>
                  </div>
                </li>
              ))}
            </MiniList>
          ) : (
            <StateBox>
              <MessageCircle size={24} />
              <h3>No enquiries yet</h3>
              <p>Contact, AMC and module enquiries will be listed here.</p>
            </StateBox>
          )}
        </Panel>
      </Split>

      <Split>
        <Panel>
          <PanelHead>
            <h2>Upcoming appointments</h2>
            <Link href="/dashboard/bookings">Manage</Link>
          </PanelHead>
          {upcoming.length ? (
            <MiniList>
              {upcoming.map((booking) => (
                <li key={booking.id}>
                  <div>
                    <span className="who">{booking.customerName} · {booking.reference}</span>
                    <span className="what">
                      {booking.service?.name || booking.serviceName} · {booking.brandName} {booking.modelName}
                    </span>
                  </div>
                  <div className="when">
                    {formatDateCell(booking.preferredDate)}
                    <br />
                    {booking.preferredTime}
                  </div>
                </li>
              ))}
            </MiniList>
          ) : (
            <StateBox>
              <Clock3 size={24} />
              <h3>Nothing scheduled</h3>
              <p>Upcoming confirmed and pending appointments will appear here.</p>
            </StateBox>
          )}
        </Panel>

        <Panel>
          <PanelHead>
            <h2>Future modules</h2>
            <Link href="/dashboard/modules">Controls</Link>
          </PanelHead>
          <PanelBody>
            <ModuleGrid>
              {modules.map((module) => (
                <ModuleCard key={module.key} href="/dashboard/modules">
                  <div>
                    <strong>{module.label}</strong>
                    <span>Website status</span>
                  </div>
                  <ToneBadge
                    $tone={
                      module.status === 'ACTIVE'
                        ? 'success'
                        : module.status === 'COMING_SOON'
                          ? 'warning'
                          : module.status === 'HIDDEN'
                            ? 'neutral'
                            : 'info'
                    }
                  >
                    {module.status.replace('_', ' ')}
                  </ToneBadge>
                </ModuleCard>
              ))}
            </ModuleGrid>
          </PanelBody>
        </Panel>
      </Split>

      {counts.completedRevenue === null ? (
        <div style={{ marginTop: 16 }}>
          <Notice>
            Revenue is calculated only from completed bookings that have a price estimate recorded. No fabricated figures are shown.
          </Notice>
        </div>
      ) : null}
    </>
  );
}
