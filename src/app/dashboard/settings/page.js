'use client';

import { SettingsForm } from '@/components/dashboard/settings-form';
import { HeadActions, HeadText, PageHead } from '@/components/dashboard/ui';
import { HelpTip } from '@/components/dashboard/help';

export default function SettingsPage() {
  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">System</span>
          <h1>Business settings</h1>
          <p>
            Contact details, workshop address, map location and booking rules used across the public website. These
            values are stored in PostgreSQL and update the live site without code changes.
          </p>
        </HeadText>
        <HeadActions>
          <HelpTip topicId="settings" />
        </HeadActions>
      </PageHead>

      <div style={{ display: 'grid', gap: 18 }}>
        <SettingsForm
          group="business"
          title="Business details"
          description="Used in the header, footer, contact page, structured data and WhatsApp defaults."
          fields={[
            { name: 'name', label: 'Business name', required: true, span: 2 },
            { name: 'tagline', label: 'Tagline' },
            { name: 'description', label: 'Business description', type: 'textarea', span: 2, rows: 3 },
            { name: 'addressLine', label: 'Address', span: 2 },
            { name: 'city', label: 'City' },
            { name: 'country', label: 'Country' },
            { name: 'phone', label: 'Phone number', placeholder: '+971 4 XXX XXXX' },
            { name: 'whatsapp', label: 'WhatsApp number', placeholder: '+971 5X XXX XXXX' },
            { name: 'email', label: 'Email address', type: 'email' },
            { name: 'hours', label: 'Opening hours', placeholder: 'Sat–Thu, 8:00 AM – 8:00 PM' },
            { name: 'mapQuery', label: 'Google Maps query', span: 2, help: 'Used to embed the map on the contact page. Use the workshop name and area or a full address.' },
            { name: 'currency', label: 'Currency', defaultValue: 'AED' },
            { name: 'timezone', label: 'Timezone', defaultValue: 'Asia/Dubai' },
          ]}
        />

        <SettingsForm
          group="booking"
          title="Booking rules"
          description="These rules are enforced by the booking API, not only the form. Minimum notice is counted from the appointment time in Dubai."
          fields={[
            { name: 'minNoticeHours', label: 'Minimum notice (hours)', type: 'number', defaultValue: 0 },
            { name: 'maxDaysAhead', label: 'Maximum days ahead', type: 'number', defaultValue: 60 },
            { name: 'pickupEnabled', label: 'Offer pickup and drop-off', type: 'checkbox', help: 'Shows the pickup option in the public booking wizard.' },
            { name: 'pickupNote', label: 'Pickup note', type: 'textarea', span: 2, rows: 3 },
          ]}
        />

        <SettingsForm
          group="banner"
          title="Hero slider behaviour"
          description="Controls how the homepage hero slider behaves for every slide. Individual slides, images, CTAs, overlay strength, order and scheduling are managed under Banners."
          fields={[
            { name: 'autoplay', label: 'Autoplay slides', type: 'checkbox', help: 'Automatically advances through the hero slides. Pauses on hover, focus and when the tab is hidden.' },
            { name: 'intervalSeconds', label: 'Seconds per slide', type: 'number', defaultValue: 7, help: 'Between 3 and 20 seconds.' },
            { name: 'transition', label: 'Transition style', type: 'select', options: [{ value: 'fade', label: 'Crossfade' }, { value: 'slide', label: 'Horizontal slide' }] },
            { name: 'transitionMs', label: 'Transition speed (ms)', type: 'number', defaultValue: 800, help: 'Between 200 and 2000 milliseconds. Animations are disabled for visitors who prefer reduced motion.' },
          ]}
        />

        <SettingsForm
          group="tracking"
          title="Tracking messages"          description="WhatsApp click-to-chat templates for each tracking stage. The dashboard opens WhatsApp with the message filled in — it never sends automatically. Placeholders: {name}, {reference}, {service}, {vehicle}, {date}, {time}, {stage}, {trackingUrl}."
          fields={[
            { name: 'templatePickupScheduled', label: 'Pickup scheduled', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateVehiclePickedUp', label: 'Vehicle picked up', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateReceivedAtWorkshop', label: 'Received at workshop', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateInitialInspection', label: 'Initial inspection', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateEstimateApproval', label: 'Estimate & approval', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateServiceInProgress', label: 'Service in progress', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateQualityInspection', label: 'Quality inspection', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateReadyForDelivery', label: 'Ready for delivery', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateOutForDelivery', label: 'Out for delivery', type: 'textarea', span: 2, rows: 3 },
            { name: 'templateDelivered', label: 'Delivered', type: 'textarea', span: 2, rows: 3 },
          ]}
        />
      </div>
    </>
  );
}
