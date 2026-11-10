'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function BrandsPage() {
  return (
    <ResourceManager
      resource="brands"
      eyebrow="Catalogue"
      title="Car brands"
      description="Brands power the vehicle selector, brand directory and AMC compatibility. Logos are optional but recommended."
      createLabel="New brand"
      searchPlaceholder="Search brands…"
      columns={[
        { key: 'name', label: 'Brand', render: (row) => <MainCell primary={row.name} sub={row.country || row.slug} /> },
        { key: 'models', label: 'Models', render: (row) => row._count?.models ?? 0 },
        { key: 'bookings', label: 'Bookings', render: (row) => row._count?.bookings ?? 0 },
        { key: 'isFeatured', label: 'Featured', render: (row) => <YesNo value={row.isFeatured} yes="Featured" no="Standard" /> },
        { key: 'isActive', label: 'Active', render: (row) => <YesNo value={row.isActive} /> },
      ]}
      filters={[
        {
          name: 'isActive',
          label: 'active brands',
          options: [
            { value: 'true', label: 'Active only' },
            { value: 'false', label: 'Inactive only' },
          ],
        },
        {
          name: 'isFeatured',
          label: 'featured brands',
          options: [
            { value: 'true', label: 'Featured only' },
            { value: 'false', label: 'Not featured' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Brand name', required: true },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'country', label: 'Country of origin' },
        { name: 'logo', label: 'Brand logo', type: 'image', folder: 'brands' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isFeatured', label: 'Featured on homepage', type: 'checkbox' },
        { name: 'isActive', label: 'Active on website', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
