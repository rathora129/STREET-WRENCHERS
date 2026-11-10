'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';

export default function CarRentalPage() {
  return (
    <ResourceManager
      resource="rental"
      eyebrow="Future modules"
      title="Car rental fleet"
      description="Rental vehicles and rates. The public rental page shows these only when the Car Rental module is Active and the vehicle is published."
      createLabel="Add rental vehicle"
      searchPlaceholder="Search rental vehicles…"
      modalWide
      columns={[
        { key: 'name', label: 'Vehicle', render: (row) => <MainCell primary={row.name} sub={`${row.brand} ${row.model} · ${row.year}`} /> },
        { key: 'category', label: 'Category' },
        { key: 'dailyRate', label: 'Daily', type: 'price', align: 'right' },
        { key: 'availability', label: 'Availability', render: (row) => <StatusBadge status={row.availability} /> },
        { key: 'isPublished', label: 'Published', render: (row) => <YesNo value={row.isPublished} /> },
      ]}
      filters={[
        {
          name: 'availability',
          label: 'availability',
          options: ['AVAILABLE', 'RENTED', 'MAINTENANCE'].map((value) => ({ value, label: value })),
        },
        {
          name: 'isPublished',
          label: 'published vehicles',
          options: [
            { value: 'true', label: 'Published' },
            { value: 'false', label: 'Unpublished' },
          ],
        },
      ]}
      fields={[
        { name: 'name', label: 'Listing name', required: true, span: 2, placeholder: 'e.g. Toyota Land Cruiser 2024' },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'category', label: 'Category', required: true, placeholder: 'SUV, Sedan, Luxury' },
        { name: 'brand', label: 'Brand', required: true },
        { name: 'model', label: 'Model', required: true },
        { name: 'year', label: 'Year', type: 'number', required: true },
        { name: 'transmission', label: 'Transmission', required: true, placeholder: 'Automatic' },
        { name: 'fuelType', label: 'Fuel type', required: true, placeholder: 'Petrol' },
        { name: 'seats', label: 'Seats', type: 'number', required: true, defaultValue: 5 },
        { name: 'dailyRate', label: 'Daily rate (AED)', type: 'number', required: true },
        { name: 'weeklyRate', label: 'Weekly rate (AED)', type: 'number' },
        { name: 'monthlyRate', label: 'Monthly rate (AED)', type: 'number' },
        { name: 'deposit', label: 'Security deposit (AED)', type: 'number' },
        { name: 'description', label: 'Description', type: 'longtext', span: 2, required: true },
        { name: 'image', label: 'Main image', type: 'image', folder: 'rental' },
        { name: 'gallery', label: 'Gallery URLs', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'features', label: 'Features', type: 'tags', span: 2, help: 'Comma-separated.' },
        { name: 'availability', label: 'Availability', type: 'select', options: ['AVAILABLE', 'RENTED', 'MAINTENANCE'], defaultValue: 'AVAILABLE' },
        { name: 'isPublished', label: 'Published on website', type: 'checkbox', defaultValue: false },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'metaTitle', label: 'SEO title' },
        { name: 'metaDescription', label: 'SEO description', type: 'textarea', span: 2, rows: 2 },
      ]}
    />
  );
}
