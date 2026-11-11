'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  BadgeCheck,
  CalendarCheck2,
  Car,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  MessageCircle,
  PackageCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { media } from '@/styles/theme';
import { formatPrice } from '@/lib/utils';
import { stageMeta } from '@/lib/booking-stages';
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
  formatDateCell,
  formatDateTimeCell,
} from './ui';
import { HelpTip } from './help';

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

  .who { display: block; font-size: 12.5px; color: ${({ theme }) => theme.colors.white}; font-weight: 500; }
  .what { display: block; margin-top: 2px; font-size: 11.5px; color: ${({ theme }) => theme.colors.dim}; line-height: 1.5; }
  .when { flex: none; font-size: 10.5px; color: ${({ theme }) => theme.colors.dim}; text-align: right; white-space: nowrap; }
`;

const ModuleGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
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

const Split = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 16px;

  ${media.lg} { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
`;

const StageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  padding: 16px 18px 18px;
`;

const StageRow = styled.div`
  display: grid;
  grid-template-columns: minmax(118px, 158px) minmax(0, 1fr) 34px;
  align-items: center;
  gap: 10px;
  font-size: 12px;

  .label {
    color: ${({ theme }) => theme.colors.smoke};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .track {
    height: 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.07);
    overflow: hidden;
  }

  .fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.brandDeep}, ${({ theme }) => theme.colors.brand});
    min-width: ${({ $count }) => ($count > 0 ? '4px' : '0')};
  }

  .count {
    text-align: right;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${media.md} { grid-template-columns: repeat(4, minmax(0, 1fr)); }

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .label {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(1.3rem, 2vw, 1.65rem);
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.white};
  }

  .hint {
    font-size: 11px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.dim};
  }
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

  const { counts, recentBookings, recentLeads, upcoming, modules, stageBreakdown = [], recentActivity = [] } = data;
  const today = new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const stats = [
    { label: 'Today’s bookings', value: counts.todayBookings, hint: 'Appointments dated today', icon: CalendarCheck2 },
    { label: 'Pending bookings', value: counts.pendingBookings, hint: 'Awaiting team confirmation', icon: Clock3 },
    { label: 'Confirmed bookings', value: counts.confirmedBookings, hint: 'Confirmed appointments', icon: BadgeCheck },
    { label: 'Active services', value: counts.activeServices, hint: 'Published on the website', icon: Wrench },
    { label: 'Vehicles in workshop', value: counts.vehiclesInWorkshop, hint: 'Pickup through quality check', icon: Car },
    { label: 'Awaiting approval', value: counts.awaitingApproval, hint: 'Estimates with customers', icon: ClipboardCheck },
    { label: 'Ready for delivery', value: counts.readyForDelivery, hint: 'Waiting for handover', icon: PackageCheck },
    { label: 'Completed bookings', value: counts.completedBookings, hint: 'Lifetime completed jobs', icon: CheckCircle2 },
    { label: 'New enquiries', value: counts.newLeads, hint: `${counts.totalCustomers} customers in CRM`, icon: Users },
    { label: 'Page views · 7 days', value: counts.pageViews, hint: `${counts.whatsappClicks} WhatsApp clicks`, icon: Eye },
  ];

  const stageTotal = stageBreakdown.reduce((sum, stage) => sum + stage.count, 0);
  const stageMax = Math.max(1, ...stageBreakdown.map((stage) => stage.count));

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">{today} · Dubai</span>
          <h1>Workshop overview</h1>
          <p>Live bookings, workshop stages, customer enquiries and website activity from the Street Wrenchers database.</p>
        </HeadText>
        <HeadActions>
          <HelpTip topicId="dashboard" />
          <DashButton as={Link} href="/dashboard/bookings" $small>
            <CalendarCheck2 size={14} /> Bookings
          </DashButton>
          <DashButton as={Link} href="/dashboard/leads" $variant="primary" $small>
            <MessageCircle size={14} /> Open CRM
          </DashButton>
        </HeadActions>
      </PageHead>

      <StatsGrid>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard key={stat.label}>
              <div className="top"><span>{stat.label}</span><Icon size={16} /></div>
              <span className="value">{stat.value}</span>
              <span className="hint">{stat.hint}</span>
            </StatCard>
          );
        })}
      </StatsGrid>

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
            <Link href="/dashboard/leads">View CRM ({counts.newLeads} new)</Link>
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
            <h2>Service stage breakdown</h2>
            <Link href="/dashboard/bookings">Manage bookings</Link>
          </PanelHead>
          {stageTotal > 0 ? (
            <StageList>
              {stageBreakdown.map((stage) => (
                <StageRow key={stage.key} $count={stage.count}>
                  <span className="label">{stage.label}</span>
                  <span className="track" aria-hidden="true">
                    <span className="fill" style={{ width: `${Math.round((stage.count / stageMax) * 100)}%` }} />
                  </span>
                  <span className="count">{stage.count}</span>
                </StageRow>
              ))}
            </StageList>
          ) : (
            <StateBox>
              <Wrench size={24} />
              <h3>No stage activity yet</h3>
              <p>Stage counts appear once bookings enter the workshop workflow.</p>
            </StateBox>
          )}
        </Panel>

        <Panel>
          <PanelHead>
            <h2>Recent activity</h2>
            <Link href="/dashboard/bookings">Booking updates</Link>
          </PanelHead>
          {recentActivity.length ? (
            <MiniList>
              {recentActivity.map((event) => (
                <li key={event.id}>
                  <div>
                    <span className="who">{event.booking?.reference || 'Booking'}</span>
                    <span className="what">
                      {event.booking?.customerName ? `${event.booking.customerName} · ` : ''}
                      {stageMeta(event.stage).label}
                      {event.updatedBy ? ` · ${event.updatedBy}` : ''}
                    </span>
                  </div>
                  <div className="when">
                    {formatDateCell(event.createdAt)}
                    <br />
                    {new Intl.DateTimeFormat('en-AE', {
                      timeZone: 'Asia/Dubai',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date(event.createdAt))}
                  </div>
                </li>
              ))}
            </MiniList>
          ) : (
            <StateBox>
              <Activity size={24} />
              <h3>No stage updates yet</h3>
              <p>Stage changes and customer-visible updates will appear here.</p>
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

      <Panel style={{ marginTop: 16 }}>
        <PanelHead>
          <h2>Website &amp; revenue</h2>
          <Link href="/dashboard/analytics">Analytics</Link>
        </PanelHead>
        <PanelBody>
          <MetricsGrid>
            <div>
              <span className="label">Completed revenue</span>
              <strong>{counts.completedRevenue === null || counts.completedRevenue === undefined ? '—' : formatPrice(counts.completedRevenue)}</strong>
              <span className="hint">Completed bookings with a recorded estimate</span>
            </div>
            <div>
              <span className="label">Total bookings</span>
              <strong>{counts.totalBookings}</strong>
              <span className="hint">Lifetime booking records</span>
            </div>
            <div>
              <span className="label">Page views · 7 days</span>
              <strong>{counts.pageViews}</strong>
              <span className="hint">Recorded website visits</span>
            </div>
            <div>
              <span className="label">WhatsApp clicks · 7 days</span>
              <strong>{counts.whatsappClicks}</strong>
              <span className="hint">Click-to-chat actions</span>
            </div>
          </MetricsGrid>
        </PanelBody>
      </Panel>
    </>
  );
}
