'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell } from '@/components/dashboard/cells';

export default function CustomersPage() {
  return (
    <ResourceManager
      resource="customers"
      eyebrow="Operations"
      title="Customers"
      description="Everyone who has booked a service or submitted an enquiry. Phone number is the unique customer identifier."
      createLabel="Add customer"
      searchPlaceholder="Search name, phone or email…"
      exportable
      canDelete={false}
      columns={[
        { key: 'name', label: 'Customer', render: (row) => <MainCell primary={row.name} sub={row.phone} /> },
        { key: 'email', label: 'Email' },
        { key: 'bookings', label: 'Bookings', render: (row) => row._count?.bookings ?? 0, align: 'right' },
        { key: 'leads', label: 'Leads', render: (row) => row._count?.leads ?? 0, align: 'right' },
        { key: 'totalSpent', label: 'Total spent', type: 'price', align: 'right' },
        { key: 'lastVisitAt', label: 'Last visit', type: 'date' },
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'phone', label: 'Phone', required: true, placeholder: '+971 5X XXX XXXX', help: 'Stored as the unique customer identifier.' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'notes', label: 'Internal notes', type: 'textarea', span: 2 },
      ]}
    />
  );
}
