'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function BrandsPage() {
  return (
    <ResourceManager
      resource="brands"
      helpTopic="brands"
      eyebrow="Catalogue"
      title="Car brands"
      description="Brands power the vehicle selector, brand directory, brand pages and AMC compatibility. The All Makes carousel and brand pages use genuine vehicle photography: your uploaded brand vehicle photo first, otherwise the built-in showcase photograph for that make. Upload a logo to show your own mark in the card badge and fallback plate."
      createLabel="New brand"
      searchPlaceholder="Search brands…"
      modalWide
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
        { name: 'logo', label: 'Brand logo', type: 'image', folder: 'brands', help: 'Shown in the small badge on the brand card. Leave blank to use the built-in manufacturer mark.' },
        { name: 'image', label: 'Brand vehicle photo', type: 'image', folder: 'brands', help: 'Overrides the built-in showcase photo on the homepage carousel and the brand page. Use a clear, front three-quarter photo of a vehicle from this brand.' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isFeatured', label: 'Featured on homepage', type: 'checkbox' },
        { name: 'isActive', label: 'Active on website', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
