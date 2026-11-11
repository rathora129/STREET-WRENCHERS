'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function TestimonialsPage() {
  return (
    <ResourceManager
      resource="testimonials"
      helpTopic="testimonials"
      eyebrow="Website content"
      title="Testimonials"
      description="Verified customer reviews only. The website shows an honest empty state until published testimonials exist — do not add invented reviews."
      createLabel="Add testimonial"
      searchPlaceholder="Search testimonials…"
      columns={[
        { key: 'name', label: 'Customer', render: (row) => <MainCell primary={row.name} sub={row.vehicle} /> },
        { key: 'rating', label: 'Rating', render: (row) => `${row.rating} / 5` },
        { key: 'quote', label: 'Quote', render: (row) => <span style={{ color: '#96938d' }}>{row.quote.slice(0, 90)}{row.quote.length > 90 ? '…' : ''}</span> },
        { key: 'source', label: 'Source' },
        { key: 'reviewedAt', label: 'Reviewed', type: 'date' },
        { key: 'isFeatured', label: 'Featured', render: (row) => <YesNo value={row.isFeatured} yes="Featured" no="Standard" /> },
        { key: 'isPublished', label: 'Published', render: (row) => <YesNo value={row.isPublished} /> },
        { key: 'sortOrder', label: 'Order', align: 'right' },
      ]}
      filters={[
        {
          name: 'isPublished',
          label: 'published reviews',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Hidden' },
          ],
        },
        {
          name: 'isFeatured',
          label: 'featured reviews',
          options: [
            { value: 'true', label: 'Featured' },
            { value: 'false', label: 'Not featured' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Customer name', required: true },
        { name: 'vehicle', label: 'Vehicle', placeholder: 'e.g. Toyota Land Cruiser' },
        { name: 'rating', label: 'Rating (1–5)', type: 'number', defaultValue: 5, required: true },
        { name: 'source', label: 'Review source', placeholder: 'e.g. Google, in-person' },
        { name: 'reviewedAt', label: 'Review date', type: 'date' },
        { name: 'image', label: 'Avatar or photo', type: 'image', folder: 'testimonials', help: 'Optional. Shown as a small circular avatar in the review slider.' },
        { name: 'quote', label: 'Review text', type: 'textarea', span: 2, required: true, rows: 4 },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isFeatured', label: 'Featured review', type: 'checkbox' },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
