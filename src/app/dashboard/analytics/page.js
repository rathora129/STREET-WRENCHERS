'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowUpRight, BarChart3, Eye, MessageCircle, MousePointerClick, Users } from 'lucide-react';
import { media } from '@/styles/theme';
import {
  DashButton,
  HeadActions,
  HeadText,
  Notice,
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
} from '@/components/dashboard/ui';

const RangeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Chart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 180px;
  padding: 10px 0 0;

  .col {
    flex: 1;
    min-width: 4px;
    height: 100%;
    display: flex;
    align-items: flex-end;
    gap: 1px;
  }

  .bar {
    flex: 1;
    border-radius: 2px 2px 0 0;
    min-height: 2px;
    background: rgba(242, 106, 13, 0.8);
  }

  .bar.leads { background: rgba(90, 162, 234, 0.8); }
`;

const ChartFoot = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  font-size: 10px;
  color: ${({ theme }) => theme.colors.dim};
`;

const Legend = styled.div`
  display: flex;
  gap: 14px;
  font-size: 10.5px;
  color: ${({ theme }) => theme.colors.dim};

  span { display: inline-flex; align-items: center; gap: 5px; }
  i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    font-size: 12px;

    &:last-child { border-bottom: 0; }
  }

  .label { color: ${({ theme }) => theme.colors.smoke}; overflow-wrap: anywhere; }
  .value { color: ${({ theme }) => theme.colors.white}; font-variant-numeric: tabular-nums; white-space: nowrap; }
`;

const Split = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  ${media.lg} { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); }
`;

const RANGES = [7, 30, 90];

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);

  const query = useQuery({
    queryKey: ['admin-analytics', days],
    queryFn: async () => {
      const response = await fetch(`/api/admin/analytics?days=${days}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load analytics');
      return payload.data;
    },
  });

  const data = query.data;
  const max = data ? Math.max(1, ...data.daily.map((day) => Math.max(day.pageViews, day.leads))) : 1;

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Overview</span>
          <h1>Website analytics</h1>
          <p>
            First-party events recorded in PostgreSQL. Page views, WhatsApp clicks and booking starts are captured by
            the website tracker — no fabricated numbers.
          </p>
        </HeadText>
        <HeadActions>
          <RangeRow>
            {RANGES.map((range) => (
              <DashButton
                key={range}
                $small
                $variant={days === range ? 'primary' : undefined}
                type="button"
                onClick={() => setDays(range)}
              >
                {range} days
              </DashButton>
            ))}
          </RangeRow>
        </HeadActions>
      </PageHead>

      {query.isLoading ? (
        <StateBox><Spinner /><p>Loading analytics…</p></StateBox>
      ) : query.isError ? (
        <StateBox><h3>Analytics unavailable</h3><p>{query.error.message}</p><DashButton $small onClick={() => query.refetch()}>Try again</DashButton></StateBox>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <StatsGrid>
            <StatCard>
              <div className="top"><span>Page views</span><Eye size={16} /></div>
              <span className="value">{data.totals.pageViews}</span>
              <span className="hint">Last {data.rangeDays} days</span>
            </StatCard>
            <StatCard>
              <div className="top"><span>WhatsApp clicks</span><MessageCircle size={16} /></div>
              <span className="value">{data.totals.whatsappClicks}</span>
              <span className="hint">Floating and inline buttons</span>
            </StatCard>
            <StatCard>
              <div className="top"><span>Booking starts</span><MousePointerClick size={16} /></div>
              <span className="value">{data.totals.bookingStarts}</span>
              <span className="hint">{data.totals.bookingSubmissions} submissions</span>
            </StatCard>
            <StatCard>
              <div className="top"><span>Leads & bookings</span><Users size={16} /></div>
              <span className="value">{data.totals.leads + data.totals.bookings}</span>
              <span className="hint">{data.totals.leads} leads · {data.totals.bookings} bookings</span>
            </StatCard>
          </StatsGrid>

          <Panel>
            <PanelHead>
              <h2>Traffic by day</h2>
              <Legend>
                <span><i style={{ background: 'rgba(242,106,13,0.8)' }} /> Page views</span>
                <span><i style={{ background: 'rgba(90,162,234,0.8)' }} /> Leads</span>
              </Legend>
            </PanelHead>
            <PanelBody>
              {data.totals.pageViews === 0 && data.totals.leads === 0 ? (
                <StateBox>
                  <BarChart3 size={24} />
                  <h3>No events in this period</h3>
                  <p>Visit the public website to generate page-view events, then return here.</p>
                </StateBox>
              ) : (
                <>
                  <Chart>
                    {data.daily.map((day) => (
                      <div className="col" key={day.date} title={`${day.date}: ${day.pageViews} views, ${day.leads} leads`}>
                        <div className="bar" style={{ height: `${Math.max(1, (day.pageViews / max) * 100)}%` }} />
                        <div className="bar leads" style={{ height: `${Math.max(1, (day.leads / max) * 100)}%` }} />
                      </div>
                    ))}
                  </Chart>
                  <ChartFoot>
                    <span>{formatDateCell(data.daily[0]?.date)}</span>
                    <span>{formatDateCell(data.daily[data.daily.length - 1]?.date)}</span>
                  </ChartFoot>
                </>
              )}
            </PanelBody>
          </Panel>

          <Split>
            <Panel>
              <PanelHead>
                <h2>Top pages</h2>
                <span style={{ fontSize: 10.5, color: '#66645f' }}>By page views</span>
              </PanelHead>
              {data.topPages.length ? (
                <List>
                  {data.topPages.map((page) => (
                    <li key={page.path}>
                      <span className="label">{page.path}</span>
                      <span className="value">{page.count}</span>
                    </li>
                  ))}
                </List>
              ) : (
                <StateBox><p>No page-view events recorded yet.</p></StateBox>
              )}
            </Panel>

            <Panel>
              <PanelHead>
                <h2>Lead sources</h2>
                <Link href="/dashboard/leads" style={{ fontSize: 11.5, color: '#f26a0d' }}>Open CRM</Link>
              </PanelHead>
              {data.leadSources.length ? (
                <List>
                  {data.leadSources.map((source) => (
                    <li key={source.source}>
                      <span className="label">{source.source}</span>
                      <span className="value">{source.count}</span>
                    </li>
                  ))}
                </List>
              ) : (
                <StateBox><p>No leads recorded in this period.</p></StateBox>
              )}
            </Panel>
          </Split>

          <Split>
            <Panel>
              <PanelHead>
                <h2>Campaign performance</h2>
                <Link href="/dashboard/campaigns" style={{ fontSize: 11.5, color: '#f26a0d' }}>Manage campaigns</Link>
              </PanelHead>
              {data.campaigns.length ? (
                <TableWrap $min="600px">
                  <table>
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Leads</th>
                        <th style={{ textAlign: 'right' }}>Events</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.campaigns.map((campaign) => (
                        <tr key={campaign.id}>
                          <td>
                            <span className="primary">{campaign.name}</span>
                            <span className="sub">{campaign.campaignId}</span>
                          </td>
                          <td>{campaign.source} / {campaign.medium}</td>
                          <td><ToneBadge $tone={campaign.status === 'ACTIVE' ? 'success' : 'neutral'}>{campaign.status}</ToneBadge></td>
                          <td style={{ textAlign: 'right' }}>{campaign.leads}</td>
                          <td style={{ textAlign: 'right' }}>{campaign.events}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              ) : (
                <StateBox>
                  <BarChart3 size={22} />
                  <h3>No campaigns yet</h3>
                  <p>Create a campaign to group leads and events by source.</p>
                  <DashButton as={Link} href="/dashboard/campaigns" $small>Create campaign</DashButton>
                </StateBox>
              )}
            </Panel>

            <Panel>
              <PanelHead>
                <h2>Pipeline mix</h2>
                <ArrowUpRight size={14} />
              </PanelHead>
              <PanelBody>
                <h3 style={{ fontSize: 12, marginBottom: 8 }}>Bookings</h3>
                {Object.keys(data.bookingStatuses).length ? (
                  <List style={{ marginBottom: 16 }}>
                    {Object.entries(data.bookingStatuses).map(([status, count]) => (
                      <li key={status}>
                        <span className="label">{status.replace('_', ' ')}</span>
                        <span className="value">{count}</span>
                      </li>
                    ))}
                  </List>
                ) : <p style={{ fontSize: 11.5, color: '#66645f', marginBottom: 16 }}>No bookings in this period.</p>}

                <h3 style={{ fontSize: 12, marginBottom: 8 }}>Leads</h3>
                {Object.keys(data.leadStatuses).length ? (
                  <List>
                    {Object.entries(data.leadStatuses).map(([status, count]) => (
                      <li key={status}>
                        <span className="label">{status.replace('_', ' ')}</span>
                        <span className="value">{count}</span>
                      </li>
                    ))}
                  </List>
                ) : <p style={{ fontSize: 11.5, color: '#66645f' }}>No leads in this period.</p>}
              </PanelBody>
            </Panel>
          </Split>

          <Notice>
            Analytics is first-party and stored in the same PostgreSQL database. If you configure GA4, GTM, Meta Pixel
            or Google Ads IDs in SEO & integrations, those scripts also load on the public website.
          </Notice>
        </div>
      )}
    </>
  );
}
