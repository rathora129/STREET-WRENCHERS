'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import {
  CheckControl,
  Control,
  DashButton,
  FieldBlock,
  FormGrid,
  Notice,
  Panel,
  PanelBody,
  PanelHead,
  SelectControl,
  StateBox,
  Spinner,
  TextControl,
} from './ui';

async function api(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'Request failed');
    error.details = payload.details || [];
    throw error;
  }
  return payload.data;
}

export function SettingsForm({ group, title, description, fields, renderExtra }) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState({});
  const [initialized, setInitialized] = useState(false);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  const query = useQuery({
    queryKey: ['settings', group],
    queryFn: () => api(`/api/admin/settings/${group}`),
  });

  useEffect(() => {
    if (query.data && !initialized) {
      setValues(query.data);
      setInitialized(true);
    }
  }, [query.data, initialized]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      api(`/api/admin/settings/${group}`, { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: (saved) => {
      setValues(saved);
      setFlash('Settings saved. The website will use them on the next request.');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['settings', group] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
    onError: (mutationError) => {
      setFlash('');
      setError(
        mutationError.details?.length
          ? `${mutationError.message}: ${mutationError.details.map((detail) => `${detail.field} ${detail.message}`).join('; ')}`
          : mutationError.message,
      );
    },
  });

  if (query.isLoading) {
    return <StateBox><Spinner /><p>Loading settings…</p></StateBox>;
  }

  if (query.isError) {
    return <StateBox><h3>Could not load settings</h3><p>{query.error.message}</p></StateBox>;
  }

  function setValue(name, value) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    setFlash('');
    setError('');
    mutation.mutate(values);
  }

  return (
    <Panel>
      <PanelHead>
        <h2>{title}</h2>
      </PanelHead>
      <PanelBody>
        {description ? (
          <p style={{ fontSize: 12, lineHeight: 1.7, color: '#96938d', marginBottom: 16 }}>{description}</p>
        ) : null}

        {flash ? <div style={{ marginBottom: 14 }}><Notice $tone="success">{flash}</Notice></div> : null}
        {error ? <div style={{ marginBottom: 14 }}><Notice $tone="error">{error}</Notice></div> : null}

        <form onSubmit={submit}>
          <FormGrid>
            {fields.map((field) => {
              const value = values[field.name] ?? (field.type === 'checkbox' ? false : '');
              if (field.type === 'checkbox') {
                return (
                  <div key={field.name} className={field.span === 2 ? 'span-2' : ''}>
                    <CheckControl>
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => setValue(field.name, event.target.checked)}
                      />
                      <span>
                        {field.label}
                        {field.help ? <span className="help" style={{ display: 'block' }}>{field.help}</span> : null}
                      </span>
                    </CheckControl>
                  </div>
                );
              }

              return (
                <FieldBlock key={field.name} className={field.span === 2 ? 'span-2' : ''}>
                  <span className="label">{field.label}{field.required ? <em>*</em> : null}</span>
                  {field.type === 'textarea' ? (
                    <TextControl
                      value={value}
                      rows={field.rows || 3}
                      onChange={(event) => setValue(field.name, event.target.value)}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'select' ? (
                    <SelectControl value={value} onChange={(event) => setValue(field.name, event.target.value)}>
                      {(field.options || []).map((option) =>
                        typeof option === 'string' ? (
                          <option key={option} value={option}>{option}</option>
                        ) : (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ),
                      )}
                    </SelectControl>
                  ) : (
                    <Control
                      type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : 'text'}
                      value={value}
                      onChange={(event) =>
                        setValue(field.name, field.type === 'number' ? event.target.value : event.target.value)
                      }
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.help ? <span className="help">{field.help}</span> : null}
                </FieldBlock>
              );
            })}
          </FormGrid>

          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <DashButton type="submit" $variant="primary" $small disabled={mutation.isPending}>
              <Check size={14} /> {mutation.isPending ? 'Saving…' : 'Save settings'}
            </DashButton>
            <span style={{ fontSize: 11, color: '#66645f' }}>Saved to the database.</span>
          </div>
        </form>

        {typeof renderExtra === 'function' ? <div style={{ marginTop: 18 }}>{renderExtra(values)}</div> : null}
      </PanelBody>
    </Panel>
  );
}
