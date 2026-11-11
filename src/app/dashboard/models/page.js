'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function ModelsPage() {
  return (
    <ResourceManager
      resource="models"
      helpTopic="brands"
      eyebrow="Catalogue"
      title="Vehicle models"
      description="Models help customers pick their vehicle quickly during booking and show AMC compatibility."
      createLabel="New model"
      searchPlaceholder="Search models…"
      columns={[
        { key: 'name', label: 'Model', render: (row) => <MainCell primary={row.name} sub={row.brand?.name} /> },
        {
          key: 'years',
          label: 'Years',
          render: (row) => (row.yearFrom || row.yearTo ? `${row.yearFrom || '—'} – ${row.yearTo || 'present'}` : '—'),
        },
        { key: 'fuelTypes', label: 'Fuel types', render: (row) => (row.fuelTypes?.length ? row.fuelTypes.join(', ') : '—') },
        { key: 'isActive', label: 'Active', render: (row) => <YesNo value={row.isActive} /> },
        { key: 'sortOrder', label: 'Order', align: 'right' },
      ]}
      filters={[
        { name: 'brandId', label: 'brands', optionsFrom: 'brands' },
        {
          name: 'isActive',
          label: 'active models',
          options: [
            { value: 'true', label: 'Active only' },
            { value: 'false', label: 'Inactive only' },
          ],
        },
      ]}
      fields={[
        { name: 'brandId', label: 'Brand', type: 'relation', optionsFrom: 'brands', required: true },
        { name: 'name', label: 'Model name', required: true },
        { name: 'slug', label: 'Slug', placeholder: 'auto-generated from name' },
        { name: 'yearFrom', label: 'Year from', type: 'number' },
        { name: 'yearTo', label: 'Year to', type: 'number', placeholder: 'Leave blank for current' },
        { name: 'fuelTypes', label: 'Fuel types', type: 'tags', span: 2, help: 'Comma-separated, e.g. Petrol, Hybrid, Electric.' },
        { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active on website', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}
