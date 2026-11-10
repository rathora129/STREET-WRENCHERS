'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function FaqsPage() {
  return (
    <ResourceManager
      resource="faqs"
      eyebrow="Website content"
      title="FAQs"
      description="Questions shown on the FAQ page and on individual service pages. Answers also feed FAQ structured data for search engines."
      createLabel="Add FAQ"
      searchPlaceholder="Search questions…"
      modalWide
      columns={[
        { key: 'question', label: 'Question', render: (row) => <MainCell primary={row.question} sub={row.category} /> },
        { key: 'service', label: 'Service', render: (row) => row.service?.name || '—' },
        { key: 'page', label: 'Page', render: (row) => row.page?.title || '—' },
        { key: 'isPublished', label: 'Published', render: (row) => <YesNo value={row.isPublished} /> },
        { key: 'sortOrder', label: 'Order', align: 'right' },
      ]}
      filters={[
        { name: 'serviceId', label: 'services', optionsFrom: 'services' },
        { name: 'pageId', label: 'pages', optionsFrom: 'pages' },
        {
          name: 'isPublished',
          label: 'published FAQs',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Hidden' },
          ],
        },
      ]}
      fields={[
        { name: 'question', label: 'Question', required: true, span: 2 },
        { name: 'answer', label: 'Answer', type: 'longtext', span: 2, required: true },
        { name: 'category', label: 'Category', placeholder: 'e.g. Servicing, AMC, Detailing' },
        { name: 'serviceId', label: 'Linked service', type: 'relation', optionsFrom: 'services', placeholder: 'Not service-specific' },
        { name: 'pageId', label: 'Linked page', type: 'relation', optionsFrom: 'pages', placeholder: 'Not page-specific' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
