'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { CheckCircle2 } from 'lucide-react';
import { FormGrid, Field, LabelText, Input, Textarea, FieldError, FormStatus } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { useAttribution } from '@/hooks/use-attribution';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Success = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: clamp(24px, 3vw, 34px);
  border: 1px solid rgba(52, 185, 129, 0.35);
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(52, 185, 129, 0.06);

  svg { color: ${({ theme }) => theme.colors.success}; }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 22px;
    letter-spacing: -0.02em;
  }

  p { color: ${({ theme }) => theme.colors.muted}; font-size: 14px; line-height: 1.7; }
`;

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Enter your name').max(160).required('Name is required'),
  phone: Yup.string()
    .trim()
    .min(5, 'Enter a valid phone number')
    .max(40)
    .matches(/^[+\d][\d\s()-]{4,}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  email: Yup.string().trim().email('Enter a valid email').max(200),
  vehicleBrand: Yup.string().max(120),
  vehicleModel: Yup.string().max(120),
  vehicleYear: Yup.number()
    .transform((value, original) => (original === '' ? undefined : value))
    .min(1950, 'Enter a valid year')
    .max(new Date().getFullYear() + 1, 'Enter a valid year'),
  message: Yup.string().max(4000),
});

async function submitLead(values, { type, source, amcPlanId, attribution }) {
  const body = {
    name: values.name.trim(),
    phone: values.phone.trim(),
    email: values.email?.trim() || undefined,
    type,
    vehicleBrand: values.vehicleBrand?.trim() || undefined,
    vehicleModel: values.vehicleModel?.trim() || undefined,
    vehicleYear: values.vehicleYear || undefined,
    message: values.message?.trim() || undefined,
    source: attribution.source || source || 'website',
    utmSource: attribution.utm?.utm_source,
    utmMedium: attribution.utm?.utm_medium,
    utmCampaign: attribution.utm?.utm_campaign,
    utmTerm: attribution.utm?.utm_term,
    utmContent: attribution.utm?.utm_content,
    landingPage: attribution.landingPage,
    amcPlanId: amcPlanId || undefined,
  };

  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || 'Could not send your enquiry. Please try again.');
  }

  fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({ type: 'LEAD_SUBMIT', path: window.location.pathname, metadata: { form: type } }),
  }).catch(() => {});

  return payload.data;
}

export function EnquiryForm({
  type = 'CONTACT',
  source = 'website',
  amcPlanId,
  showVehicle = false,
  messageLabel = 'How can we help?',
  submitLabel = 'Send enquiry',
  successTitle = 'Enquiry received',
  successBody = 'The team will review your message and respond using the contact details you provided.',
  defaultMessage = '',
}) {
  const attribution = useAttribution();
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (values) => submitLead(values, { type, source, amcPlanId, attribution }),
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <Success role="status">
        <CheckCircle2 size={26} strokeWidth={1.7} aria-hidden="true" />
        <h3>{successTitle}</h3>
        <p>{successBody}</p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} icon={false}>
          Send another enquiry
        </Button>
      </Success>
    );
  }

  const initialValues = {
    name: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    message: defaultMessage,
  };

  return (
    <Wrap>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values, helpers) => {
          try {
            await mutation.mutateAsync(values);
            helpers.resetForm();
          } catch (error) {
            helpers.setStatus(error.message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form noValidate>
            <FormGrid>
              <Field>
                <LabelText>
                  Full name <em>*</em>
                </LabelText>
                <FormikField as={Input} name="name" autoComplete="name" placeholder="Your name" aria-invalid={Boolean(touched.name && errors.name)} />
                {touched.name && errors.name ? <FieldError>{errors.name}</FieldError> : null}
              </Field>
              <Field>
                <LabelText>
                  Phone <em>*</em>
                </LabelText>
                <FormikField as={Input} name="phone" type="tel" autoComplete="tel" placeholder="+971 5X XXX XXXX" aria-invalid={Boolean(touched.phone && errors.phone)} />
                {touched.phone && errors.phone ? <FieldError>{errors.phone}</FieldError> : null}
              </Field>
              <Field style={{ gridColumn: '1 / -1' }}>
                <LabelText>Email</LabelText>
                <FormikField as={Input} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
                {touched.email && errors.email ? <FieldError>{errors.email}</FieldError> : null}
              </Field>

              {showVehicle ? (
                <>
                  <Field>
                    <LabelText>Car brand</LabelText>
                    <FormikField as={Input} name="vehicleBrand" placeholder="e.g. Toyota" />
                  </Field>
                  <Field>
                    <LabelText>Model</LabelText>
                    <FormikField as={Input} name="vehicleModel" placeholder="e.g. Camry" />
                  </Field>
                  <Field>
                    <LabelText>Year</LabelText>
                    <FormikField as={Input} name="vehicleYear" type="number" inputMode="numeric" min="1950" max={new Date().getFullYear() + 1} placeholder="e.g. 2021" />
                    {touched.vehicleYear && errors.vehicleYear ? <FieldError>{errors.vehicleYear}</FieldError> : null}
                  </Field>
                </>
              ) : null}

              <Field style={{ gridColumn: '1 / -1' }}>
                <LabelText>{messageLabel}</LabelText>
                <FormikField as={Textarea} name="message" rows={4} placeholder="Tell us what you need" />
              </Field>
            </FormGrid>

            {status ? <FormStatus $tone="error" style={{ marginTop: 16 }}>{status}</FormStatus> : null}

            <div style={{ marginTop: 20 }}>
              <Button type="submit" disabled={isSubmitting} icon={false}>
                {isSubmitting ? 'Sending…' : submitLabel}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Wrap>
  );
}
