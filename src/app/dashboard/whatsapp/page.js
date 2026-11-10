'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { SettingsForm } from '@/components/dashboard/settings-form';
import { DashButton, HeadText, Notice, PageHead, Panel, PanelBody } from '@/components/dashboard/ui';

export default function WhatsappPage() {
  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Marketing · Channels</span>
          <h1>WhatsApp</h1>
          <p>
            Control the floating WhatsApp button, prefilled messages and the number used across the public website.
            WhatsApp clicks are recorded as analytics events.
          </p>
        </HeadText>
        <DashButton as={Link} href="/dashboard/leads?type=WHATSAPP" $small>
          WhatsApp leads
        </DashButton>
      </PageHead>

      <div style={{ display: 'grid', gap: 18 }}>
        <Notice>
          Use the full international number without spaces or a plus sign in the country code and number fields. The
          floating button only appears when WhatsApp is enabled and “Show floating button” is on.
        </Notice>

        <SettingsForm
          group="whatsapp"
          title="WhatsApp settings"
          description="Numbers and message templates are stored in the database and used by the website immediately after saving."
          fields={[
            { name: 'enabled', label: 'Enable WhatsApp links across the site', type: 'checkbox' },
            { name: 'showFloatingButton', label: 'Show floating WhatsApp button', type: 'checkbox' },
            { name: 'countryCode', label: 'Country code', placeholder: '971', help: 'Digits only, no plus sign.' },
            { name: 'number', label: 'WhatsApp number', placeholder: '501234567', help: 'Without the country code.' },
            { name: 'defaultMessage', label: 'Default message', type: 'textarea', span: 2, rows: 2 },
            { name: 'serviceMessage', label: 'Service enquiry message', type: 'textarea', span: 2, rows: 2, help: 'Use {service} where the service name should appear.' },
            { name: 'amcMessage', label: 'AMC message', type: 'textarea', span: 2, rows: 2 },
            { name: 'rentalMessage', label: 'Rental message', type: 'textarea', span: 2, rows: 2 },
            { name: 'salesMessage', label: 'Car sales message', type: 'textarea', span: 2, rows: 2 },
          ]}
          renderExtra={(values) => {
            const digits = `${values.countryCode || ''}${values.number || ''}`.replace(/\D/g, '');
            const link = digits ? `https://wa.me/${digits}?text=${encodeURIComponent(values.defaultMessage || '')}` : null;
            return (
              <Panel>
                <PanelBody>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: 15 }}>Link preview</h3>
                      <p style={{ marginTop: 4, fontSize: 12, color: '#96938d' }}>
                        {link ? 'This is the link visitors will open from the floating button.' : 'Add a country code and number to generate the link.'}
                      </p>
                    </div>
                    {link ? (
                      <DashButton as="a" href={link} target="_blank" rel="noreferrer" $variant="primary" $small>
                        <MessageCircle size={14} /> Test WhatsApp link
                      </DashButton>
                    ) : null}
                  </div>
                  {link ? (
                    <code style={{ display: 'block', marginTop: 12, padding: 10, borderRadius: 6, background: '#0c0c0f', border: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: '#cbc8c2', overflowWrap: 'anywhere' }}>
                      {link}
                    </code>
                  ) : null}
                </PanelBody>
              </Panel>
            );
          }}
        />
      </div>
    </>
  );
}
