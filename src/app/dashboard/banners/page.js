'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

const PLACEMENTS = ['home-hero', 'home-promo', 'services', 'amc', 'contact'];

export default function BannersPage() {
  return (
    <ResourceManager
      resource="banners"
      helpTopic="banners"
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
        { name: 'eyebrow', label: 'Eyebrow', placeholder: 'e.g. Workshop open in Al Quoz' },
        { name: 'subtitle', label: 'Description', type: 'textarea', span: 2, rows: 2 },
        { name: 'image', label: 'Desktop image', type: 'image', folder: 'banners', required: true, help: 'Recommended 1920×1080 or wider. The hero uses this on laptops and desktops.' },
        { name: 'mobileImage', label: 'Mobile image', type: 'image', folder: 'banners', help: 'Optional portrait crop for phones. The desktop image is used when this is blank.' },
        { name: 'ctaLabel', label: 'Primary button label' },
        { name: 'ctaHref', label: 'Primary button link', placeholder: '/book' },
        { name: 'secondaryLabel', label: 'Secondary button label' },
        { name: 'secondaryHref', label: 'Secondary button link', placeholder: '/services' },
        { name: 'overlayOpacity', label: 'Image overlay (%)', type: 'number', defaultValue: 35, help: 'Darkens the photo so text stays readable. 20–60 is usually best.' },
        { name: 'placement', label: 'Placement', type: 'select', options: PLACEMENTS, defaultValue: 'home-hero' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0, help: 'Lower numbers appear first in the hero.' },
        { name: 'startsAt', label: 'Start date', type: 'date', help: 'Optional. The slide is hidden before this date.' },
        { name: 'endsAt', label: 'End date', type: 'date', help: 'Optional. The slide is hidden after this date.' },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
