'use client';

import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, YesNo } from '@/components/dashboard/cells';

export default function RedirectsPage() {
  return (
    <ResourceManager
      resource="redirects"
      helpTopic="seo"
      eyebrow="System · SEO"
      title="Redirects"
      description="Database-backed redirects applied without a redeploy. Permanent rules (301/308) are served as a permanent 308 response, temporary rules (302/307) as a temporary 307 response — search engines treat these exactly like their 301/302 equivalents."
      createLabel="New redirect"
      searchPlaceholder="Search paths…"
      columns={[
        { key: 'fromPath', label: 'From', render: (row) => <MainCell primary={row.fromPath} sub={row.toPath} /> },
        { key: 'statusCode', label: 'Code' },
        { key: 'isActive', label: 'Active', render: (row) => <YesNo value={row.isActive} /> },
        { key: 'note', label: 'Note' },
      ]}
      filters={[
        {
          name: 'isActive',
          label: 'active redirects',
          options: [
            { value: 'true', label: 'Active only' },
            { value: 'false', label: 'Inactive only' },
          ],
        },
      ]}
      fields={[
        { name: 'fromPath', label: 'From path', required: true, placeholder: '/old-page', help: 'Must start with /.' },
        { name: 'toPath', label: 'To path', required: true, placeholder: '/new-page' },
        {
          name: 'statusCode',
          label: 'Status code',
          type: 'select',
          options: [
            { value: '301', label: '301 — Permanent' },
            { value: '302', label: '302 — Temporary' },
            { value: '307', label: '307 — Temporary (method preserved)' },
            { value: '308', label: '308 — Permanent (method preserved)' },
          ],
          defaultValue: '301',
          required: true,
        },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
        { name: 'note', label: 'Note', type: 'textarea', span: 2, rows: 2 },
      ]}
    />
  );
}
