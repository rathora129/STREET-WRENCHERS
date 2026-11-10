'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge } from '@/components/dashboard/cells';
import { UtmBuilder } from '@/components/dashboard/utm-builder';

const STATUSES = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'];

export default function CampaignsPage() {
  return (
    <>
      <ResourceManager
        resource="campaigns"
        eyebrow="Marketing"
        title="Campaigns"
        description="Track paid and organic campaigns. UTM values from public forms are matched to these campaign IDs in the CRM."
        createLabel="New campaign"
        searchPlaceholder="Search campaigns…"
        columns={[
          { key: 'name', label: 'Campaign', render: (row) => <MainCell primary={row.name} sub={row.campaignId || row.slug} /> },
          { key: 'channel', label: 'Channel', render: (row) => <MainCell primary={`${row.source} / ${row.medium}`} sub={row.landingPage} /> },
          { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
          { key: 'leads', label: 'Leads', render: (row) => row._count?.leads ?? 0, align: 'right' },
          { key: 'events', label: 'Events', render: (row) => row._count?.events ?? 0, align: 'right' },
          { key: 'startDate', label: 'Starts', type: 'date' },
        ]}
        filters={[
          { name: 'status', label: 'statuses', options: STATUSES.map((status) => ({ value: status, label: status })) },
        ]}
        fields={[
          { name: 'name', label: 'Campaign name', required: true, span: 2 },
          { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
          { name: 'campaignId', label: 'UTM campaign ID', placeholder: 'Defaults to the slug' },
          { name: 'source', label: 'UTM source', required: true, placeholder: 'google, meta, whatsapp' },
          { name: 'medium', label: 'UTM medium', required: true, placeholder: 'cpc, social, email' },
          { name: 'landingPage', label: 'Landing page', placeholder: '/book', span: 2 },
          { name: 'status', label: 'Status', type: 'select', options: STATUSES, defaultValue: 'DRAFT', required: true },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
          { name: 'utmTerm', label: 'UTM term' },
          { name: 'utmContent', label: 'UTM content' },
          { name: 'notes', label: 'Notes', type: 'longtext', span: 2 },
        ]}
      />
      <div style={{ marginTop: 20 }}>
        <UtmBuilder />
      </div>
    </>
  );
}
