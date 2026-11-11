'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';

export default function PackagesPage() {
  return (
    <ResourceManager
      resource="packages"
      helpTopic="services"
      eyebrow="Catalogue"
      title="Service packages"
      description="Fixed-scope packages shown on service pages and the homepage. A package can be linked to a service or offered site-wide."
      createLabel="New package"
      searchPlaceholder="Search packages…"
      modalWide
      columns={[
        { key: 'name', label: 'Package', render: (row) => <MainCell primary={row.name} sub={row.service?.name || 'Site-wide'} /> },
        { key: 'tier', label: 'Tier' },
        { key: 'price', label: 'Price', type: 'price', align: 'right' },
        { key: 'duration', label: 'Duration' },
        { key: 'isFeatured', label: 'Featured', render: (row) => <YesNo value={row.isFeatured} yes="Featured" no="Standard" /> },
        { key: 'isPublished', label: 'Status', render: (row) => <StatusBadge status={row.isPublished ? 'PUBLISHED' : 'DRAFT'} /> },
      ]}
      filters={[
        { name: 'serviceId', label: 'services', optionsFrom: 'services' },
        {
          name: 'isPublished',
          label: 'published packages',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Unpublished' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Package name', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'serviceId', label: 'Linked service', type: 'relation', optionsFrom: 'services', placeholder: 'No specific service' },
        { name: 'tier', label: 'Tier label', required: true, defaultValue: 'CUSTOM', placeholder: 'e.g. Essential, Premium' },
        { name: 'price', label: 'Package price (AED)', type: 'number', required: true },
        { name: 'priceNote', label: 'Price note', placeholder: 'e.g. incl. VAT' },
        { name: 'description', label: 'Description', type: 'textarea', span: 2 },
        { name: 'duration', label: 'Duration', placeholder: 'e.g. 3 hours' },
        { name: 'labourCharge', label: 'Labour charge (AED)', type: 'number' },
        { name: 'warranty', label: 'Warranty', placeholder: 'e.g. 6 months / 10,000 km' },
        { name: 'inclusions', label: 'Inclusions', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'exclusions', label: 'Exclusions', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'isFeatured', label: 'Featured package', type: 'checkbox' },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: true },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
      ]}
    />
  );
}
