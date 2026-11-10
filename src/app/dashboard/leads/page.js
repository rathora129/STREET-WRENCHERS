'use client';

import Link from 'next/link';
import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge } from '@/components/dashboard/cells';
import { RowLink } from '@/components/dashboard/ui';

const STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST'];
const TYPES = ['SERVICE_BOOKING', 'CONTACT', 'AMC', 'WHATSAPP', 'RENTAL', 'CAR_SALES', 'BUY_CAR', 'SELL_CAR', 'MARKETING'];

export default function LeadsPage() {
  return (
    <ResourceManager
      resource="leads"
      eyebrow="Operations · CRM"
      title="Leads & CRM"
      description="Central record of website enquiries and booking leads, including UTM attribution, status, follow-up and internal activity."
      canCreate={false}
      exportable
      searchPlaceholder="Search name, phone, vehicle or campaign…"
      columns={[
        { key: 'name', label: 'Lead', render: (row) => <MainCell primary={row.name} sub={row.phone} /> },
        { key: 'type', label: 'Type', render: (row) => <MainCell primary={row.type.replaceAll('_', ' ')} sub={row.vehicleBrand ? `${row.vehicleBrand} ${row.vehicleModel || ''}`.trim() : null} /> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'source', label: 'Source', render: (row) => <MainCell primary={row.utmSource || row.source || 'Direct'} sub={row.utmCampaign || row.campaign?.name} /> },
        { key: 'activities', label: 'Activity', render: (row) => row._count?.activities ?? 0, align: 'right' },
        { key: 'createdAt', label: 'Received', type: 'datetime' },
      ]}
      filters={[
        { name: 'status', label: 'statuses', options: STATUSES.map((status) => ({ value: status, label: status.replace('_', ' ') })) },
        { name: 'type', label: 'types', options: TYPES.map((type) => ({ value: type, label: type.replaceAll('_', ' ') })) },
        { name: 'campaignId', label: 'campaigns', optionsFrom: 'campaigns' },
      ]}
      rowActions={(row) => (
        <RowLink as={Link} href={`/dashboard/leads/${row.id}`}>
          Open
        </RowLink>
      )}
      fields={[
        { name: 'status', label: 'Lead status', type: 'select', options: STATUSES, required: true },
        { name: 'type', label: 'Lead type', type: 'select', options: TYPES },
        { name: 'name', label: 'Name' },
        { name: 'phone', label: 'Phone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'vehicleBrand', label: 'Vehicle brand' },
        { name: 'vehicleModel', label: 'Vehicle model' },
        { name: 'vehicleYear', label: 'Vehicle year', type: 'number' },
        { name: 'followUpAt', label: 'Follow-up date', type: 'date' },
        { name: 'notes', label: 'Internal notes', type: 'longtext', span: 2 },
      ]}
    />
  );
}
