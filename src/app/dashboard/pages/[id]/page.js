'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ResourceManager } from '@/components/dashboard/resource-manager';
import { MainCell, StatusBadge, YesNo } from '@/components/dashboard/cells';
import { Panel, PanelBody, Spinner, StateBox } from '@/components/dashboard/ui';

const BackBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 18px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  h2 { font-size: 18px; }
  p { margin-top: 4px; font-size: 12px; color: ${({ theme }) => theme.colors.muted}; }
  .right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
`;

const SECTION_TYPES = [
  'HERO',
  'PAGE_HERO',
  'INTRO',
  'TEXT',
  'SERVICES',
  'PACKAGES',
  'AMC',
  'BRANDS',
  'WHY',
  'PROCESS',
  'GALLERY',
  'TESTIMONIALS',
  'BLOG',
  'FAQS',
  'CTA',
  'CONTACT',
  'MODULE_PROMO',
];

export default function PageSectionsPage() {
  const params = useParams();
  const id = params.id;

  const pageQuery = useQuery({
    queryKey: ['admin-page-summary', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/pages/${id}`);
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Could not load page');
      return payload.data;
    },
    enabled: Boolean(id),
  });

  if (pageQuery.isLoading) {
    return (
      <StateBox>
        <Spinner />
        <p>Loading page…</p>
      </StateBox>
    );
  }

  if (pageQuery.isError) {
    return (
      <StateBox>
        <h3>Page not found</h3>
        <p>{pageQuery.error.message}</p>
        <Link href="/dashboard/pages" style={{ color: '#f26a0d', fontSize: 12 }}>Back to pages</Link>
      </StateBox>
    );
  }

  const page = pageQuery.data;
  const viewHref = page.slug === 'home' ? '/' : `/${page.slug}`;

  return (
    <>
      <BackBar>
        <Link href="/dashboard/pages"><ArrowLeft size={14} /> All pages</Link>
        {page.status === 'PUBLISHED' ? (
          <a href={viewHref} target="_blank" rel="noreferrer">
            View page on website <ExternalLink size={13} />
          </a>
        ) : null}
      </BackBar>

      <Panel style={{ marginBottom: 20 }}>
        <PanelBody>
          <Summary>
            <div>
              <h2>{page.title}</h2>
              <p>
                /{page.slug === 'home' ? '' : page.slug} · {page.template} template · {page._count?.sections ?? 0} sections
              </p>
            </div>
            <div className="right">
              <StatusBadge status={page.status} />
              <Link href={`/dashboard/pages?q=${encodeURIComponent(page.title)}`} style={{ fontSize: 12, color: '#f26a0d' }}>
                Edit page metadata
              </Link>
            </div>
          </Summary>
        </PanelBody>
      </Panel>

      <ResourceManager
        resource="sections"
        helpTopic="pages"
        eyebrow="CMS · Page content"
        title={`Sections · ${page.title}`}
        description="Sections are rendered in sort order. The section key is the stable identifier used by the page layout, so change it only when you know the template expects a new key."
        createLabel="New section"
        searchPlaceholder="Search sections…"
        modalWide
        fixedFilters={{ pageId: id }}
        payloadDefaults={{ pageId: id }}
        columns={[
          { key: 'key', label: 'Section', render: (row) => <MainCell primary={row.key} sub={row.type} /> },
          { key: 'heading', label: 'Heading' },
          { key: 'sortOrder', label: 'Order', align: 'right' },
          { key: 'isVisible', label: 'Visible', render: (row) => <YesNo value={row.isVisible} /> },
          { key: 'updatedAt', label: 'Updated', type: 'date' },
        ]}
        filters={[
          { name: 'type', label: 'types', options: SECTION_TYPES.map((type) => ({ value: type, label: type })) },
          {
            name: 'isVisible',
            label: 'visible sections',
            options: [
              { value: 'true', label: 'Visible' },
              { value: 'false', label: 'Hidden' },
            ],
          },
        ]}
        fields={[
          { name: 'key', label: 'Section key', required: true, placeholder: 'e.g. intro, why, faqs' },
          { name: 'type', label: 'Section type', type: 'select', options: SECTION_TYPES, required: true, defaultValue: 'TEXT' },
          { name: 'eyebrow', label: 'Eyebrow' },
          { name: 'heading', label: 'Heading' },
          { name: 'subheading', label: 'Subheading', span: 2 },
          { name: 'body', label: 'Body text', type: 'longtext', span: 2 },
          { name: 'image', label: 'Image', type: 'image', folder: 'pages' },
          { name: 'imageAlt', label: 'Image alt text' },
          { name: 'ctaLabel', label: 'Primary button label' },
          { name: 'ctaHref', label: 'Primary button link' },
          { name: 'secondaryLabel', label: 'Secondary button label' },
          { name: 'secondaryHref', label: 'Secondary button link' },
          {
            name: 'data',
            label: 'Structured data (JSON)',
            type: 'json',
            span: 2,
            help: 'Used by WHY, PROCESS and similar sections. Edit with care and keep valid JSON.',
          },
          { name: 'sortOrder', label: 'Sort order', type: 'number', defaultValue: 0 },
          { name: 'isVisible', label: 'Visible on website', type: 'checkbox', defaultValue: true },
        ]}
      />
    </>
  );
}
