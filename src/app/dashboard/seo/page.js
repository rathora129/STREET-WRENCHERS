'use client';

import Link from 'next/link';
import { SettingsForm } from '@/components/dashboard/settings-form';
import { HeadText, Notice, PageHead } from '@/components/dashboard/ui';

export default function SeoPage() {
  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Marketing · SEO</span>
          <h1>SEO & integrations</h1>
          <p>
            Default metadata, social sharing image and marketing tags. Page-level overrides are managed in Pages,
            Services, AMC plans and Blog.
          </p>
        </HeadText>
      </PageHead>

      <div style={{ display: 'grid', gap: 18 }}>
        <Notice>
          Database redirects are managed on the <Link href="/dashboard/redirects" style={{ color: '#f26a0d' }}>Redirects</Link> page.
          Sitemap and robots are generated from live content at <Link href="/sitemap.xml" target="_blank" style={{ color: '#f26a0d' }}>/sitemap.xml</Link> and{' '}
          <Link href="/robots.txt" target="_blank" style={{ color: '#f26a0d' }}>/robots.txt</Link>.
        </Notice>

        <SettingsForm
          group="seo"
          title="Default SEO"
          description="Used when a page does not provide its own title or description."
          fields={[
            { name: 'defaultTitle', label: 'Default title', required: true, span: 2 },
            { name: 'titleTemplate', label: 'Title template', required: true, span: 2, help: 'Use %s for the page title, e.g. %s | Street Wrenchers.' },
            { name: 'defaultDescription', label: 'Default description', type: 'textarea', span: 2, rows: 3 },
            { name: 'ogImage', label: 'Default social image URL', span: 2 },
            { name: 'robots', label: 'Default robots directive', placeholder: 'index,follow' },
          ]}
        />

        <SettingsForm
          group="analytics"
          title="Marketing integrations"
          description="Public IDs only. Leave a field blank to disable that integration. These IDs are injected into the public website layout."
          fields={[
            { name: 'ga4Id', label: 'Google Analytics 4 ID', placeholder: 'G-XXXXXXXXXX' },
            { name: 'gtmId', label: 'Google Tag Manager ID', placeholder: 'GTM-XXXXXXX' },
            { name: 'metaPixelId', label: 'Meta Pixel ID', placeholder: '1234567890' },
            { name: 'googleAdsId', label: 'Google Ads ID', placeholder: 'AW-XXXXXXXXX' },
          ]}
        />
      </div>
    </>
  );
}
