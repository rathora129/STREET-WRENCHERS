'use client';

import Link from 'next/link';
import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge } from '@/components/dashboard/cells';
import { RowLink } from '@/components/dashboard/ui';

const TEMPLATES = [
  { value: 'default', label: 'Default content page' },
  { value: 'home', label: 'Homepage' },
  { value: 'legal', label: 'Legal page' },
  { value: 'module', label: 'Module page' },
];

export default function PagesPage() {
  return (
    <ResourceManager
      resource="pages"
      helpTopic="pages"
      eyebrow="Website content · CMS"
      title="Pages & sections"
      description="Website pages and their content sections. Seeded system pages power the live site; edits publish immediately when the page status is Published."
      createLabel="New page"
      searchPlaceholder="Search pages…"
      modalWide
      columns={[
        { key: 'title', label: 'Page', render: (row) => <MainCell primary={row.title} sub={`/${row.slug === 'home' ? '' : row.slug}`} /> },
        { key: 'template', label: 'Template' },
        { key: 'sections', label: 'Sections', render: (row) => row._count?.sections ?? 0, align: 'right' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'updatedAt', label: 'Updated', type: 'date' },
      ]}
      filters={[
        {
          name: 'status',
          label: 'statuses',
          options: [
            { value: 'PUBLISHED', label: 'Published' },
            { value: 'DRAFT', label: 'Draft' },
          ],
        },
        { name: 'template', label: 'templates', options: TEMPLATES },
      ]}
      rowActions={(row) => (
        <RowLink as={Link} href={`/dashboard/pages/${row.id}`}>
          Sections
        </RowLink>
      )}
      fields={[
        { name: 'title', label: 'Page title', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from title' },
        { name: 'template', label: 'Template', type: 'select', options: TEMPLATES, required: true, defaultValue: 'default' },
        { name: 'status', label: 'Status', type: 'select', options: ['PUBLISHED', 'DRAFT'], required: true, defaultValue: 'DRAFT' },
        { name: 'publishedAt', label: 'Publish date', type: 'date' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'metaTitle', label: 'SEO title', span: 2 },
        { name: 'metaDescription', label: 'SEO description', type: 'textarea', span: 2, rows: 2 },
        { name: 'keywords', label: 'SEO keywords', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'canonical', label: 'Canonical URL' },
        { name: 'robots', label: 'Robots directive', defaultValue: 'index,follow' },
        { name: 'ogTitle', label: 'Social title' },
        { name: 'ogDescription', label: 'Social description', type: 'textarea', rows: 2 },
        { name: 'ogImage', label: 'Social image', type: 'image', folder: 'seo' },
      ]}
    />
  );
}
