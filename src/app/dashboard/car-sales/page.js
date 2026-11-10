'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';

export default function CarSalesPage() {
  return (
    <ResourceManager
      resource="sales"
      eyebrow="Future modules"
      title="Cars for sale"
      description="Vehicles listed for sale. The public sales pages show these only when the Car Sales module is Active and the vehicle is published."
      createLabel="Add vehicle for sale"
      searchPlaceholder="Search vehicles…"
      modalWide
      columns={[
        { key: 'title', label: 'Vehicle', render: (row) => <MainCell primary={row.title} sub={`${row.brandName} ${row.model} · ${row.year}`} /> },
        { key: 'price', label: 'Price', type: 'price', align: 'right' },
        { key: 'mileage', label: 'Mileage', render: (row) => (row.mileage ? `${row.mileage.toLocaleString('en-AE')} km` : '—') },
        { key: 'condition', label: 'Condition', render: (row) => <StatusBadge status={row.condition} /> },
        { key: 'isPublished', label: 'Published', render: (row) => <YesNo value={row.isPublished} /> },
        { key: 'isSold', label: 'Sold', render: (row) => <YesNo value={row.isSold} yes="Sold" no="Available" /> },
      ]}
      filters={[
        { name: 'brandId', label: 'brands', optionsFrom: 'brands' },
        {
          name: 'isPublished',
          label: 'published vehicles',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Unpublished' },
          ],
        },
        {
          name: 'isSold',
          label: 'sold status',
          options: [
            { value: 'true', label: 'Sold' },
            { value: 'false', label: 'Available' },
          ],
        },
      ]}
      fields={[
        { name: 'title', label: 'Listing title', required: true, span: 2 },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from title' },
        { name: 'brandId', label: 'Brand record', type: 'relation', optionsFrom: 'brands', placeholder: 'Optional' },
        { name: 'brandName', label: 'Brand name', required: true },
        { name: 'model', label: 'Model', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true },
        { name: 'mileage', label: 'Mileage (km)', type: 'number' },
        { name: 'condition', label: 'Condition', type: 'select', options: ['USED', 'NEW'], defaultValue: 'USED' },
        { name: 'price', label: 'Price (AED)', type: 'number', required: true },
        { name: 'negotiable', label: 'Price negotiable', type: 'checkbox', defaultValue: true },
        { name: 'transmission', label: 'Transmission' },
        { name: 'fuelType', label: 'Fuel type' },
        { name: 'bodyType', label: 'Body type' },
        { name: 'color', label: 'Colour' },
        { name: 'description', label: 'Description', type: 'longtext', span: 2, required: true },
        { name: 'image', label: 'Main image', type: 'image', folder: 'sales' },
        { name: 'gallery', label: 'Gallery URLs', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'features', label: 'Features', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: false },
        { name: 'isSold', label: 'Mark as sold', type: 'checkbox' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'metaTitle', label: 'SEO title' },
        { name: 'metaDescription', label: 'SEO description', type: 'textarea', span: 2, rows: 2 },
      ]}
    />
  );
}
