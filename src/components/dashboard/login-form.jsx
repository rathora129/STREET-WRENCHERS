'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Formik, Field as FormikField } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { LockKeyhole } from 'lucide-react';
import { Field, LabelText, Input, FieldError, FormStatus } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

const schema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

async function signIn(values) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Could not sign in');
  return payload.data;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      router.replace(next && next.startsWith('/dashboard') ? next : '/dashboard');
      router.refresh();
    },
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
      onSubmit={async (values, helpers) => {
        try {
          await mutation.mutateAsync(values);
        } catch (error) {
          helpers.setStatus(error.message);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting, status }) => (
        <Form noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field>
            <LabelText>
              Email <em>*</em>
            </LabelText>
            <FormikField as={Input} name="email" type="email" autoComplete="username" placeholder="owner@streetwrenchers.ae" autoFocus />
            {touched.email && errors.email ? <FieldError>{errors.email}</FieldError> : null}
          </Field>
          <Field>
            <LabelText>
              Password <em>*</em>
            </LabelText>
            <FormikField as={Input} name="password" type="password" autoComplete="current-password" placeholder="Your password" />
            {touched.password && errors.password ? <FieldError>{errors.password}</FieldError> : null}
          </Field>

          {status ? <FormStatus $tone="error">{status}</FormStatus> : null}

          <Button type="submit" size="lg" disabled={isSubmitting || mutation.isPending} icon={false}>
            <LockKeyhole size={15} style={{ marginRight: 2 }} aria-hidden="true" />
            {isSubmitting || mutation.isPending ? 'Signing in…' : 'Sign in to dashboard'}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
