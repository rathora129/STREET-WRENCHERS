'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

const PLACEMENTS = ['home-hero', 'home-promo', 'services', 'amc', 'contact'];

export default function BannersPage() {
  return (
    <ResourceManager
      resource="banners"
      eyebrow="Website content"
      title="Banners"
      description="Hero slides and promotional banners. Only active banners inside their schedule window are shown on the website."
      createLabel="New banner"
      searchPlaceholder="Search banners…"
      columns={[
        { key: 'title', label: 'Banner', render: (row) => <MainCell primary={row.title} sub={row.subtitle} /> },
        { key: 'placement', label: 'Placement' },
        { key: 'startsAt', label: 'Starts', type: 'date' },
        { key: 'endsAt', label: 'Ends', type: 'date' },
        { key: 'sortOrder', label: 'Order', align: 'right' },
        { key: 'isActive', label: 'Active', render: (row) => <YesNo value={row.isActive} /> },
      ]}
      filters={[
        { name: 'placement', label: 'placements', options: PLACEMENTS },
        {
          name: 'isActive',
          label: 'active banners',
          options: [
            { value: 'true', label: 'Active only' },
            { value: 'false', label: 'Inactive only' },
          ],
        },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, span: 2 },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea', span: 2, rows: 2 },
        { name: 'image', label: 'Desktop image', type: 'image', folder: 'banners', required: true },
        { name: 'mobileImage', label: 'Mobile image', type: 'image', folder: 'banners' },
        { name: 'ctaLabel', label: 'Button label' },
        { name: 'ctaHref', label: 'Button link' },
        { name: 'placement', label: 'Placement', type: 'select', options: PLACEMENTS, defaultValue: 'home-hero' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'startsAt', label: 'Start date', type: 'date' },
        { name: 'endsAt', label: 'End date', type: 'date' },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
