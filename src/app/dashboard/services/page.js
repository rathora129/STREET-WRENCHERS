'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';
import { CategoryIcon } from '@/components/ui/icon';

export default function ServicesPage() {
  return (
    <ResourceManager
      resource="services"
      helpTopic="services"
      eyebrow="Catalogue"
      title="Services"
      description="Every service on the website. Prices are shown as reference prices, so use the price note to explain what is included or when a quote is required."
      createLabel="New service"
      searchPlaceholder="Search services…"
      modalWide
      columns={[
        { key: 'name', label: 'Service', render: (row) => <MainCell primary={row.name} sub={row.category?.name} /> },
        { key: 'icon', label: 'Icon', render: (row) => <CategoryIcon name={row.icon || row.category?.icon} size={17} /> },
        { key: 'price', label: 'Price', type: 'price', align: 'right' },
        { key: 'duration', label: 'Duration' },
        { key: 'isFeatured', label: 'Featured', render: (row) => <YesNo value={row.isFeatured} yes="Featured" no="Standard" /> },
        { key: 'isPublished', label: 'Status', render: (row) => <StatusBadge status={row.isPublished ? 'PUBLISHED' : 'DRAFT'} /> },
        { key: 'sortOrder', label: 'Order', align: 'right' },
      ]}
      filters={[
        { name: 'categoryId', label: 'categories', optionsFrom: 'categories' },
        {
          name: 'isPublished',
          label: 'published services',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Unpublished' },
          ],
        },
        {
          name: 'isFeatured',
          label: 'featured services',
          options: [
            { value: 'true', label: 'Featured' },
            { value: 'false', label: 'Not featured' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Service name', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'categoryId', label: 'Category', type: 'relation', optionsFrom: 'categories', required: true },
        { name: 'shortDescription', label: 'Short description', type: 'textarea', span: 2, required: true, rows: 2 },
        { name: 'description', label: 'Full description', type: 'longtext', span: 2, required: true },
        { name: 'price', label: 'Reference price (AED)', type: 'number', placeholder: 'Leave blank for quote only' },
        { name: 'priceNote', label: 'Price note', placeholder: 'e.g. From, depending on vehicle' },
        { name: 'duration', label: 'Duration', placeholder: 'e.g. 2–3 hours' },
        { name: 'icon', label: 'Service icon', type: 'icon', span: 2, help: 'Search the icon library and pick the symbol shown on service cards. Changes apply across the website without code.' },
        { name: 'image', label: 'Main image', type: 'image', folder: 'services' },
        { name: 'gallery', label: 'Gallery image URLs', type: 'tags', span: 2, help: 'Comma-separated URLs. Upload each image first from the Media Library.' },
        { name: 'inclusions', label: 'What is included', type: 'tags', span: 2, help: 'Comma-separated list items.' },
        { name: 'benefits', label: 'Benefits', type: 'tags', span: 2, help: 'Comma-separated list items.' },
        { name: 'isFeatured', label: 'Show on homepage featured services', type: 'checkbox' },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: true },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'metaTitle', label: 'SEO title' },
        { name: 'metaDescription', label: 'SEO description', type: 'textarea', span: 2, rows: 2 },
        { name: 'keywords', label: 'SEO keywords', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'ogImage', label: 'Social share image', type: 'image', folder: 'seo' },
      ]}
    />
  );
}
