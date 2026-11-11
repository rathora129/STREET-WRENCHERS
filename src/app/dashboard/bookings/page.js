'use client';

import Link from 'next/link';
import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge } from '@/components/dashboard/cells';
import { RowLink } from '@/components/dashboard/ui';
import { BOOKING_STAGES, stageMeta } from '@/lib/booking-stages';

const STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function BookingsPage() {
  return (
    <ResourceManager
      resource="bookings"
      helpTopic="bookings"
      eyebrow="Operations"
      title="Bookings"
      description="Every service booking submitted through the website. Update the status, appointment details, estimate and internal notes."
      canCreate={false}
      canDelete={false}
      exportable
      searchPlaceholder="Search reference, customer or vehicle…"
      modalWide
      columns={[
        {
          key: 'reference',
          label: 'Booking',
          render: (row) => <MainCell primary={row.reference} sub={`${row.brandName || ''} ${row.modelName || ''}`.trim()} />,
        },
        { key: 'customerName', label: 'Customer', render: (row) => <MainCell primary={row.customerName} sub={row.phone} /> },
        { key: 'service', label: 'Service', render: (row) => <MainCell primary={row.service?.name || row.serviceName} sub={row.package?.name} /> },
        {
          key: 'preferredDate',
          label: 'Appointment',
          render: (row) => {
            const date = new Intl.DateTimeFormat('en-AE', {
              timeZone: 'Asia/Dubai',
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }).format(new Date(row.preferredDate));
            return <MainCell primary={date} sub={row.preferredTime} />;
          },
        },
        { key: 'priceEstimate', label: 'Estimate', type: 'price', align: 'right' },
        {
          key: 'currentStage',
          label: 'Service stage',
          render: (row) => <MainCell primary={stageMeta(row.currentStage).customerLabel} sub={row.registrationNumber} />,
        },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
      ]}
      filters={[
        {
          name: 'status',
          label: 'statuses',
          options: STATUSES.map((status) => ({ value: status, label: status.replace('_', ' ') })),
        },
        {
          name: 'currentStage',
          label: 'stages',
          options: BOOKING_STAGES.map((stage) => ({ value: stage.key, label: stage.label })),
        },
      ]}
      rowActions={(row) => (
        <RowLink as={Link} href={`/dashboard/bookings/${row.id}`}>
          View
        </RowLink>
      )}
      fields={[
        { name: 'status', label: 'Booking status', type: 'select', options: STATUSES, required: true },
        { name: 'priceEstimate', label: 'Price estimate (AED)', type: 'number' },
        { name: 'preferredDate', label: 'Appointment date', type: 'date' },
        { name: 'preferredTime', label: 'Appointment time', type: 'time' },
        { name: 'customerName', label: 'Customer name' },
        { name: 'phone', label: 'Phone' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'pickupRequired', label: 'Pickup and drop-off required', type: 'checkbox' },
        { name: 'pickupAddress', label: 'Pickup address', span: 2 },
        { name: 'adminNotes', label: 'Internal notes', type: 'longtext', span: 2 },
      ]}
    />
  );
}
