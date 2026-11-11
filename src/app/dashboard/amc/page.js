'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';

export default function AmcPage() {
  return (
    <ResourceManager
      resource="amc"
      helpTopic="amc"
      eyebrow="Catalogue"
      title="AMC plans"
      description="Annual maintenance contracts. Link plans to brands and models to show compatibility on the public AMC pages."
      createLabel="New AMC plan"
      searchPlaceholder="Search AMC plans…"
      modalWide
      columns={[
        { key: 'name', label: 'Plan', render: (row) => <MainCell primary={row.name} sub={row.tagline} /> },
        { key: 'price', label: 'Price', type: 'price', align: 'right' },
        { key: 'durationMonths', label: 'Months', render: (row) => `${row.durationMonths} months` },
        { key: 'kmLimit', label: 'KM limit', render: (row) => row.kmLimit ? `${row.kmLimit.toLocaleString('en-AE')} km` : 'Unlimited' },
        { key: 'isFeatured', label: 'Featured', render: (row) => <YesNo value={row.isFeatured} yes="Featured" no="Standard" /> },
        { key: 'isPublished', label: 'Status', render: (row) => <StatusBadge status={row.isPublished ? 'PUBLISHED' : 'DRAFT'} /> },
        { key: 'sortOrder', label: 'Order', align: 'right' },
      ]}
      filters={[
        {
          name: 'isPublished',
          label: 'published plans',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Unpublished' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Plan name', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'tagline', label: 'Tagline' },
        { name: 'description', label: 'Description', type: 'longtext', span: 2, required: true },
        { name: 'price', label: 'Plan price (AED)', type: 'number', required: true },
        { name: 'priceNote', label: 'Price note' },
        { name: 'billingPeriod', label: 'Billing period', type: 'select', defaultValue: 'YEAR', options: ['YEAR', 'MONTH'] },
        { name: 'durationMonths', label: 'Duration (months)', type: 'number', defaultValue: 12, required: true },
        { name: 'kmLimit', label: 'Kilometre limit', type: 'number', placeholder: 'Leave blank for unlimited' },
        { name: 'icon', label: 'Plan icon', type: 'icon', span: 2, help: 'Optional icon from the shared library.' },
        { name: 'image', label: 'Plan image', type: 'image', folder: 'amc', help: 'Optional image used on the plan detail page.' },
        { name: 'brandIds', label: 'Compatible brands', type: 'multi-relation', optionsFrom: 'brands', getValue: (row) => row.brands?.map((brand) => brand.id) || [], help: 'Hold ⌘/Ctrl to select multiple brands.' },
        { name: 'modelIds', label: 'Compatible models', type: 'multi-relation', optionsFrom: 'models', getValue: (row) => row.models?.map((model) => model.id) || [], help: 'Optional. Hold ⌘/Ctrl to select multiple models.' },
        { name: 'inclusions', label: 'Inclusions', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'exclusions', label: 'Exclusions', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'benefits', label: 'Benefits', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'isFeatured', label: 'Featured plan', type: 'checkbox' },
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
