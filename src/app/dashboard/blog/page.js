'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge } from '@/components/dashboard/cells';

export default function BlogPage() {
  return (
    <ResourceManager
      resource="blog"
      eyebrow="Website content"
      title="Blog"
      description="Editorial articles for the public blog. Drafts stay hidden; publishing sets the date used in the blog listing and sitemap."
      createLabel="New article"
      searchPlaceholder="Search articles…"
      modalWide
      columns={[
        { key: 'title', label: 'Article', render: (row) => <MainCell primary={row.title} sub={row.slug} /> },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'publishedAt', label: 'Published', type: 'date' },
        { key: 'readMinutes', label: 'Read', render: (row) => (row.readMinutes ? `${row.readMinutes} min` : '—'), align: 'right' },
        { key: 'views', label: 'Views', align: 'right' },
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
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from title' },
        { name: 'category', label: 'Category', placeholder: 'e.g. Maintenance' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea', span: 2, required: true, rows: 3 },
        {
          name: 'content',
          label: 'Article content',
          type: 'longtext',
          span: 2,
          required: true,
          rows: 14,
          help: 'Use ## and ### for headings, blank lines between paragraphs, and "- " for list items.',
        },
        { name: 'coverImage', label: 'Cover image', type: 'image', folder: 'blog' },
        { name: 'author', label: 'Author', defaultValue: 'Street Wrenchers' },
        { name: 'tags', label: 'Tags', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'status', label: 'Status', type: 'select', options: ['DRAFT', 'PUBLISHED'], required: true, defaultValue: 'DRAFT' },
        { name: 'publishedAt', label: 'Publish date', type: 'date' },
        { name: 'readMinutes', label: 'Read minutes', type: 'number', placeholder: 'Calculated automatically' },
        { name: 'metaTitle', label: 'SEO title' },
        { name: 'metaDescription', label: 'SEO description', type: 'textarea', span: 2, rows: 2 },
        { name: 'keywords', label: 'SEO keywords', type: 'tags', span: 2 },
        { name: 'ogImage', label: 'Social image', type: 'image', folder: 'seo' },
      ]}
    />
  );
}
