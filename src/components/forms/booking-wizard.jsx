'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Car, Wrench, CalendarClock, UserRound } from 'lucide-react';
import { media } from '@/styles/theme';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Field, LabelText, Input, Textarea, Select, FieldError, FormStatus } from '@/components/ui/field';
import { useBookingStore } from '@/store/booking';
import { useAttribution } from '@/hooks/use-attribution';
import { BOOKING_TIMES, FUEL_TYPES } from '@/lib/site';

const Shell = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 40px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) 350px;
  }
`;

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.charcoal};
  padding: clamp(22px, 3vw, 38px);
`;

const Stepper = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: clamp(24px, 3vw, 36px);
`;

const StepItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid ${({ $active, $done, theme }) => ($active || $done ? theme.colors.brand : theme.colors.line)};
  opacity: ${({ $active, $done }) => ($active || $done ? 1 : 0.55)};
`;

const StepLabel = styled.span`
  display: none;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};

  ${media.md} {
    display: block;
  }
`;

const StepName = styled.span`
  font-size: 11px;
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.dim)};
  letter-spacing: 0.02em;
`;

const PanelTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(20px, 2.4vw, 26px);
  letter-spacing: -0.02em;
  margin-bottom: 6px;
`;

const PanelIntro = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.muted};
  line-height: 1.65;
  margin-bottom: 24px;
  max-width: 58ch;
`;

const Choices = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  margin-top: 8px;

  ${media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Choice = styled.button`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
  padding: 15px 16px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand : theme.colors.lineStrong)};
  background: ${({ $active }) => ($active ? 'rgba(242,106,13,0.09)' : 'rgba(255,255,255,0.02)')};
  border-radius: ${({ theme }) => theme.radii.sm};
  text-align: left;
  transition: border-color 160ms ease, background 160ms ease;

  strong {
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.white};
  }

  span {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.muted};
    line-height: 1.5;
  }

  &:hover {
    border-color: ${({ $active, theme }) => ($active ? theme.colors.brand : 'rgba(255,255,255,0.3)')};
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(74px, 1fr));
  gap: 8px;
`;

const TimeButton = styled.button`
  height: 42px;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand : theme.colors.lineStrong)};
  background: ${({ $active }) => ($active ? 'rgba(242,106,13,0.12)' : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.muted)};
  font-size: 12.5px;
  border-radius: 6px;
  transition: border-color 140ms ease, color 140ms ease;

  &:hover { border-color: ${({ theme }) => theme.colors.brand}; color: ${({ theme }) => theme.colors.white}; }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.smoke};
  cursor: pointer;

  input {
    width: 17px;
    height: 17px;
    margin-top: 2px;
    accent-color: ${({ theme }) => theme.colors.brand};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.colors.white}; }
`;

const Summary = styled.aside`
  position: static;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: linear-gradient(180deg, #111115 0%, #0b0b0e 100%);
  padding: clamp(20px, 2.5vw, 28px);
  display: flex;
  flex-direction: column;
  gap: 18px;

  ${media.lg} {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.header} + 24px);
  }
`;

const SummaryTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 16px;
  letter-spacing: -0.01em;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 11px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 12.5px;

  span:first-child {
    color: ${({ theme }) => theme.colors.dim};
    flex: none;
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.smoke};
    text-align: right;
  }
`;

const Total = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  span {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 30px;
    letter-spacing: -0.03em;
  }
`;

const SummaryNote = styled.p`
  font-size: 11.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.dim};
`;

const SuccessShell = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 720px;
  margin-inline: auto;

  svg { color: ${({ theme }) => theme.colors.success}; }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(24px, 3vw, 32px);
    letter-spacing: -0.03em;
  }

  p { color: ${({ theme }) => theme.colors.muted}; font-size: 14.5px; line-height: 1.7; }
`;

const Reference = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 16px 18px;
  border: 1px dashed rgba(242, 106, 13, 0.5);
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(242, 106, 13, 0.06);

  span {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 18px;
    color: ${({ theme }) => theme.colors.brand};
    letter-spacing: 0.04em;
  }
`;

const ErrorList = styled.ul`
  margin: 6px 0 0;
  padding-left: 16px;
  list-style: disc;
  font-size: 12px;
  line-height: 1.5;
`;

const phoneRule = Yup.string()
  .trim()
  .min(5, 'Enter a valid phone number')
  .max(40)
  .matches(/^[+\d][\d\s()-]{4,}$/, 'Enter a valid phone number')
  .required('Phone number is required');

const vehicleSchema = Yup.object({
  brandId: Yup.string().required('Choose your car brand'),
  modelName: Yup.string().trim().min(1, 'Enter your model').max(120).required('Enter your model'),
  year: Yup.number()
    .typeError('Choose a year')
    .min(1950, 'Enter a valid year')
    .max(new Date().getFullYear() + 1, 'Enter a valid year')
    .required('Choose a year'),
  fuelType: Yup.string().required('Choose a fuel type'),
});

const serviceSchema = Yup.object({
  serviceId: Yup.string().required('Choose a service'),
  packageId: Yup.string(),
});

const scheduleSchema = ({ minDate, maxDate }) =>
  Yup.object({
    date: Yup.string()
      .required('Choose a date')
      .test('range', 'Choose a date within the booking window', (value) => {
        if (!value) return false;
        return value >= minDate && value <= maxDate;
      }),
    time: Yup.string().required('Choose a time'),
    pickupRequired: Yup.boolean(),
    pickupAddress: Yup.string().when('pickupRequired', {
      is: true,
      then: (schema) => schema.trim().min(6, 'Add a pickup address').max(500).required('Add a pickup address'),
      otherwise: (schema) => schema,
    }),
  });

const detailsSchema = Yup.object({
  customerName: Yup.string().trim().min(2, 'Enter your name').max(160).required('Name is required'),
  phone: phoneRule,
  email: Yup.string().trim().email('Enter a valid email').max(200),
  notes: Yup.string().max(4000),
});

const STEPS = [
  { name: 'Vehicle', label: 'Step 1', icon: Car },
  { name: 'Service', label: 'Step 2', icon: Wrench },
  { name: 'Schedule', label: 'Step 3', icon: CalendarClock },
  { name: 'Details', label: 'Step 4', icon: UserRound },
];

const dubaiToday = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  return parts;
};

const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const formatDate = (value) => {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
};

function fieldError(touched, errors, key) {
  return touched[key] && errors[key] ? <FieldError>{errors[key]}</FieldError> : null;
}

export function BookingWizard({ brands = [], services = [], bookingSettings = {}, initialServiceSlug = '' }) {
  const store = useBookingStore();
  const { setFields, setStep, reset } = store;
  const attribution = useAttribution();
  const [bounds, setBounds] = useState({ min: '', max: '' });
  const [confirmation, setConfirmation] = useState(null);

  const selectedBrand = useMemo(() => brands.find((brand) => brand.id === store.brandId), [brands, store.brandId]);
  const selectedService = useMemo(
    () => services.find((service) => service.id === store.serviceId),
    [services, store.serviceId],
  );
  const selectedPackage = useMemo(
    () => selectedService?.packages?.find((pack) => pack.id === store.packageId) || null,
    [selectedService, store.packageId],
  );

  const estimatedPrice = selectedPackage?.price ?? selectedService?.price ?? null;

  useEffect(() => {
    if (!initialServiceSlug) return;
    const match = services.find((item) => item.slug === initialServiceSlug);
    if (match) {
      setFields({ serviceId: match.id, serviceName: match.name });
    }
    // Apply the pre-selected service once when arriving from a service page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialServiceSlug]);

  useEffect(() => {
    const min = dubaiToday();
    setBounds({ min, max: addDays(min, bookingSettings.maxDaysAhead || 60) });

    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ type: 'BOOKING_START', path: window.location.pathname }),
    }).catch(() => {});
  }, [bookingSettings.maxDaysAhead]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        customerName: values.customerName.trim(),
        phone: values.phone.trim(),
        email: values.email?.trim() || undefined,
        brandId: values.brandId || undefined,
        brandName: selectedBrand?.name || '',
        modelName: values.modelName,
        year: Number(values.year),
        fuelType: values.fuelType,
        serviceId: values.serviceId,
        packageId: values.packageId || undefined,
        date: values.date,
        time: values.time,
        pickupRequired: Boolean(values.pickupRequired),
        pickupAddress: values.pickupAddress?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        source: attribution.source || 'website',
        utm: {
          utm_source: attribution.utm?.utm_source,
          utm_medium: attribution.utm?.utm_medium,
          utm_campaign: attribution.utm?.utm_campaign,
          utm_term: attribution.utm?.utm_term,
          utm_content: attribution.utm?.utm_content,
        },
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(body.details) && body.details[0]?.message;
        throw new Error(detail || body.error || 'Could not submit the booking. Please try again.');
      }

      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ type: 'BOOKING_SUBMIT', path: window.location.pathname }),
      }).catch(() => {});

      return body.data;
    },
    onSuccess: (data) => setConfirmation(data),
  });

  if (confirmation) {
    return (
      <SuccessShell role="status">
        <CheckCircle2 size={32} strokeWidth={1.6} aria-hidden="true" />
        <h3>Booking request received.</h3>
        <p>
          Your request has been sent to the workshop. The team will contact you to confirm the slot and
          discuss the work. This is a request, not a confirmed appointment.
        </p>
        <Reference>
          <span>Booking reference</span>
          <strong>{confirmation.reference}</strong>
        </Reference>
        <SummaryRow style={{ width: '100%' }}>
          <span>Service</span>
          <span>
            {confirmation.serviceName}
            {confirmation.packageName ? ` — ${confirmation.packageName}` : ''}
          </span>
        </SummaryRow>
        <SummaryRow style={{ width: '100%' }}>
          <span>Requested</span>
          <span>{formatDate(store.date)} at {store.time}</span>
        </SummaryRow>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Button
            variant="outline"
            icon={false}
            onClick={() => {
              reset();
              setConfirmation(null);
            }}
          >
            Book another service
          </Button>
          <Button href="/" variant="ghost">Back to home</Button>
        </div>
      </SuccessShell>
    );
  }

  const currentStep = store.step;

  return (
    <Shell>
      <Card>
        <Stepper aria-label="Booking progress">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <StepItem key={item.name} $active={active} $done={done} aria-current={active ? 'step' : undefined}>
                <StepLabel>
                  <Icon size={12} style={{ marginRight: 6, verticalAlign: -1 }} aria-hidden="true" />
                  {done ? <Check size={12} style={{ marginRight: 4, verticalAlign: -1 }} aria-hidden="true" /> : null}
                  {item.label}
                </StepLabel>
                <StepName $active={active}>{item.name}</StepName>
              </StepItem>
            );
          })}
        </Stepper>

        {currentStep === 0 ? (
          <Formik
            initialValues={{
              brandId: store.brandId,
              modelName: store.modelName,
              year: store.year,
              fuelType: store.fuelType,
            }}
            validationSchema={vehicleSchema}
            enableReinitialize
            onSubmit={(values) => {
              setFields({ ...values, brandName: selectedBrand?.name || '' });
              setStep(1);
            }}
          >
            {({ values, errors, touched, isSubmitting }) => {
              const brand = brands.find((item) => item.id === values.brandId);
              return (
                <Form noValidate>
                  <PanelTitle>Tell us about your car.</PanelTitle>
                  <PanelIntro>The make, model and year let the team confirm parts and the right scope of work.</PanelIntro>
                  <div style={{ display: 'grid', gap: 18 }}>
                    <Field>
                      <LabelText>
                        Car brand <em>*</em>
                      </LabelText>
                      <FormikField as={Select} name="brandId">
                        <option value="">Select your brand</option>
                        {brands.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </FormikField>
                      {fieldError(touched, errors, 'brandId')}
                    </Field>

                    <Field>
                      <LabelText>
                        Model <em>*</em>
                      </LabelText>
                      <FormikField
                        as={Input}
                        name="modelName"
                        list="booking-model-options"
                        placeholder={brand ? `e.g. ${brand.models[0] || 'Your model'}` : 'Choose a brand first'}
                        autoComplete="off"
                      />
                      <datalist id="booking-model-options">
                        {(brand?.models || []).map((model) => (
                          <option key={model} value={model} />
                        ))}
                      </datalist>
                      {fieldError(touched, errors, 'modelName')}
                    </Field>

                    <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                      <Field>
                        <LabelText>
                          Manufacturing year <em>*</em>
                        </LabelText>
                        <FormikField as={Select} name="year">
                          <option value="">Select year</option>
                          {Array.from({ length: new Date().getFullYear() + 1 - 1990 }, (_, index) => new Date().getFullYear() + 1 - index).map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </FormikField>
                        {fieldError(touched, errors, 'year')}
                      </Field>
                      <Field>
                        <LabelText>
                          Fuel type <em>*</em>
                        </LabelText>
                        <FormikField as={Select} name="fuelType">
                          <option value="">Select fuel type</option>
                          {FUEL_TYPES.map((fuel) => (
                            <option key={fuel} value={fuel}>{fuel}</option>
                          ))}
                        </FormikField>
                        {fieldError(touched, errors, 'fuelType')}
                      </Field>
                    </div>
                  </div>

                  <Actions>
                    <span />
                    <Button type="submit" disabled={isSubmitting}>Continue</Button>
                  </Actions>
                </Form>
              );
            }}
          </Formik>
        ) : null}

        {currentStep === 1 ? (
          <Formik
            initialValues={{ serviceId: store.serviceId, packageId: store.packageId }}
            validationSchema={serviceSchema}
            enableReinitialize
            onSubmit={(values) => {
              const service = services.find((item) => item.id === values.serviceId);
              const pack = service?.packages?.find((item) => item.id === values.packageId);
              setFields({
                serviceId: values.serviceId,
                serviceName: service?.name || '',
                packageId: values.packageId,
                packageName: pack?.name || '',
              });
              setStep(2);
            }}
          >
            {({ values, errors, touched, setFieldValue }) => {
              const service = services.find((item) => item.id === values.serviceId);
              return (
                <Form noValidate>
                  <PanelTitle>What does your car need?</PanelTitle>
                  <PanelIntro>
                    Choose the service closest to your requirement. If you are unsure, book the inspection and the
                    team will confirm the right scope.
                  </PanelIntro>
                  <Field>
                    <LabelText>
                      Service <em>*</em>
                    </LabelText>
                    <FormikField as={Select} name="serviceId" onChange={(event) => {
                      setFieldValue('serviceId', event.target.value);
                      setFieldValue('packageId', '');
                    }}>
                      <option value="">Select a service</option>
                      {services.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                          {item.price ? ` — from AED ${item.price}` : ''}
                        </option>
                      ))}
                    </FormikField>
                    {fieldError(touched, errors, 'serviceId')}
                  </Field>

                  {service?.packages?.length ? (
                    <div style={{ marginTop: 24 }}>
                      <LabelText>Package (optional)</LabelText>
                      <Choices>
                        <Choice
                          type="button"
                          $active={!values.packageId}
                          onClick={() => setFieldValue('packageId', '')}
                        >
                          <strong>Standard {service.name}</strong>
                          <span>Price confirmed after inspection</span>
                        </Choice>
                        {service.packages.map((pack) => (
                          <Choice
                            key={pack.id}
                            type="button"
                            $active={values.packageId === pack.id}
                            onClick={() => setFieldValue('packageId', pack.id)}
                          >
                            <strong>{pack.name}</strong>
                            <span>AED {pack.price}{pack.priceNote ? ` · ${pack.priceNote}` : ''}</span>
                          </Choice>
                        ))}
                      </Choices>
                    </div>
                  ) : null}

                  <Actions>
                    <BackButton type="button" onClick={() => setStep(0)}>
                      <ArrowLeft size={13} /> Back
                    </BackButton>
                    <Button type="submit">Continue</Button>
                  </Actions>
                </Form>
              );
            }}
          </Formik>
        ) : null}

        {currentStep === 2 ? (
          <Formik
            initialValues={{
              date: store.date,
              time: store.time,
              pickupRequired: store.pickupRequired,
              pickupAddress: store.pickupAddress,
            }}
            validationSchema={scheduleSchema({ minDate: bounds.min, maxDate: bounds.max })}
            enableReinitialize
            onSubmit={(values) => {
              setFields(values);
              setStep(3);
            }}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form noValidate>
                <PanelTitle>Choose a preferred time.</PanelTitle>
                <PanelIntro>
                  Select a date and time that suits you. The team will confirm availability before the appointment.
                </PanelIntro>
                <div style={{ display: 'grid', gap: 18 }}>
                  <Field>
                    <LabelText>
                      Preferred date <em>*</em>
                    </LabelText>
                    <FormikField as={Input} type="date" name="date" min={bounds.min} max={bounds.max} />
                    {fieldError(touched, errors, 'date')}
                  </Field>

                  <div>
                    <LabelText>Preferred time <em style={{ color: '#f26a0d' }}>*</em></LabelText>
                    <TimeGrid style={{ marginTop: 8 }} role="group" aria-label="Preferred time">
                      {BOOKING_TIMES.map((slot) => (
                        <TimeButton
                          key={slot}
                          type="button"
                          $active={values.time === slot}
                          aria-pressed={values.time === slot}
                          onClick={() => setFieldValue('time', slot)}
                        >
                          {slot}
                        </TimeButton>
                      ))}
                    </TimeGrid>
                    {fieldError(touched, errors, 'time')}
                  </div>

                  {bookingSettings.pickupEnabled ? (
                    <>
                      <CheckRow>
                        <input
                          type="checkbox"
                          checked={values.pickupRequired}
                          onChange={(event) => setFieldValue('pickupRequired', event.target.checked)}
                        />
                        <span>I would like pickup and drop-off</span>
                      </CheckRow>
                      {bookingSettings.pickupNote ? (
                        <span style={{ fontSize: 11.5, color: '#66645f', marginTop: -8 }}>{bookingSettings.pickupNote}</span>
                      ) : null}
                      {values.pickupRequired ? (
                        <Field>
                          <LabelText>
                            Pickup address <em>*</em>
                          </LabelText>
                          <FormikField as={Textarea} name="pickupAddress" rows={2} placeholder="Building, street and area in Dubai" />
                          {fieldError(touched, errors, 'pickupAddress')}
                        </Field>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <Actions>
                  <BackButton type="button" onClick={() => setStep(1)}>
                    <ArrowLeft size={13} /> Back
                  </BackButton>
                  <Button type="submit">Continue</Button>
                </Actions>
              </Form>
            )}
          </Formik>
        ) : null}

        {currentStep === 3 ? (
          <Formik
            initialValues={{
              customerName: store.customerName,
              phone: store.phone,
              email: store.email,
              notes: store.notes,
            }}
            validationSchema={detailsSchema}
            enableReinitialize
            onSubmit={async (values, helpers) => {
              setFields(values);
              try {
                await mutation.mutateAsync({ ...useBookingStore.getState(), ...values });
              } catch (error) {
                helpers.setStatus(error.message);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form noValidate>
                <PanelTitle>Your contact details.</PanelTitle>
                <PanelIntro>
                  We use these details only to confirm and manage this booking. No payment is taken online.
                </PanelIntro>
                <div style={{ display: 'grid', gap: 18 }}>
                  <Field>
                    <LabelText>
                      Full name <em>*</em>
                    </LabelText>
                    <FormikField as={Input} name="customerName" autoComplete="name" placeholder="Your name" />
                    {fieldError(touched, errors, 'customerName')}
                  </Field>
                  <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                    <Field>
                      <LabelText>
                        Phone <em>*</em>
                      </LabelText>
                      <FormikField as={Input} type="tel" name="phone" autoComplete="tel" placeholder="+971 5X XXX XXXX" />
                      {fieldError(touched, errors, 'phone')}
                    </Field>
                    <Field>
                      <LabelText>Email</LabelText>
                      <FormikField as={Input} type="email" name="email" autoComplete="email" placeholder="you@example.com" />
                      {fieldError(touched, errors, 'email')}
                    </Field>
                  </div>
                  <Field>
                    <LabelText>Notes</LabelText>
                    <FormikField as={Textarea} name="notes" rows={3} placeholder="Anything the team should know about the car or the booking" />
                    {fieldError(touched, errors, 'notes')}
                  </Field>
                </div>

                {mutation.isError || status ? (
                  <FormStatus $tone="error" style={{ marginTop: 18 }}>
                    {status || mutation.error?.message}
                  </FormStatus>
                ) : null}

                <Actions>
                  <BackButton type="button" onClick={() => setStep(2)}>
                    <ArrowLeft size={13} /> Back
                  </BackButton>
                  <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                    {mutation.isPending ? 'Sending…' : 'Request booking'}
                  </Button>
                </Actions>
              </Form>
            )}
          </Formik>
        ) : null}
      </Card>

      <Summary>
        <SummaryTitle>Your booking</SummaryTitle>
        <SummaryRow>
          <span>Vehicle</span>
          <span>
            {store.modelName
              ? `${selectedBrand?.name || store.brandName || ''} ${store.modelName} ${store.year || ''}`.trim()
              : 'Not selected'}
          </span>
        </SummaryRow>
        <SummaryRow>
          <span>Fuel</span>
          <span>{store.fuelType || '—'}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Service</span>
          <span>{store.serviceName || 'Not selected'}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Package</span>
          <span>{selectedPackage?.name || 'Standard'}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Preferred</span>
          <span>{store.date ? `${formatDate(store.date)}${store.time ? ` · ${store.time}` : ''}` : 'Not selected'}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Pickup</span>
          <span>{store.pickupRequired ? 'Requested' : 'Not required'}</span>
        </SummaryRow>
        <Total>
          <span>Estimated</span>
          <strong>{estimatedPrice ? `AED ${estimatedPrice}` : 'TBC'}</strong>
        </Total>
        <SummaryNote>
          {estimatedPrice
            ? 'Starting price for the selected package. Any additional work is quoted for approval before it begins.'
            : 'Price is confirmed after inspection. You approve any work before it starts.'}
        </SummaryNote>
        {store.step > 0 ? (
          <Link href="/contact" style={{ fontSize: 11.5, color: '#96938d' }}>
            Need help? Contact the workshop <ArrowRight size={12} style={{ verticalAlign: -1 }} aria-hidden="true" />
          </Link>
        ) : null}
        <Badge $tone="brand">No online payment</Badge>
      </Summary>
    </Shell>
  );
}
