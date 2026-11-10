'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function CategoriesPage() {
  return (
    <ResourceManager
      resource="categories"
      eyebrow="Catalogue"
      title="Service categories"
      description="Group services on the website. Categories with no published services are hidden from the public services page."
      createLabel="New category"
      searchPlaceholder="Search categories…"
      columns={[
        { key: 'name', label: 'Category', render: (row) => <MainCell primary={row.name} sub={row.slug} /> },
        { key: 'services', label: 'Services', render: (row) => row._count?.services ?? 0 },
        { key: 'sortOrder', label: 'Order', align: 'right' },
        { key: 'isActive', label: 'Active', render: (row) => <YesNo value={row.isActive} /> },
      ]}
      filters={[
        {
          name: 'isActive',
          label: 'active categories',
          options: [
            { value: 'true', label: 'Active only' },
            { value: 'false', label: 'Inactive only' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true, placeholder: 'e.g. Scheduled Maintenance' },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name', help: 'Leave blank to generate automatically.' },
        { name: 'description', label: 'Description', type: 'textarea', span: 2 },
        { name: 'icon', label: 'Icon key', placeholder: 'e.g. wrench' },
        { name: 'image', label: 'Category image', type: 'image', folder: 'services' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true, help: 'Inactive categories disappear from the public website.' },
      ]}
    />
  );
}
