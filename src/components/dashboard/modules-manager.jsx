'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { ArrowUpRight, Check, Save } from 'lucide-react';
import { MODULE_DEFINITIONS, MODULE_KEYS } from '@/data/modules';
import {
  Control,
  DashButton,
  FieldBlock,
  HeadActions,
  HeadText,
  Notice,
  PageHead,
  Panel,
  PanelBody,
  SelectControl,
  Spinner,
  StateBox,
  TextControl,
  ToneBadge,
} from './ui';
import { HelpTip } from './help';

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
  overflow: hidden;
`;

const CardHead = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  h2 { font-size: 16px; }
  p { margin-top: 3px; font-size: 11.5px; color: ${({ theme }) => theme.colors.dim}; }
  a { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: ${({ theme }) => theme.colors.brand}; margin-top: 7px; }
`;

const CardBody = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const STATUS_CONSEQUENCE = {
  ACTIVE: 'Live on the public website with listings and calls to action.',
  COMING_SOON: 'Visible in navigation with a coming-soon page and enquiry form. Listings stay hidden.',
  HIDDEN: 'Removed from public navigation and returns a 404 page.',
  DRAFT: 'Removed from public navigation. Internal preparation only.',
};

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

export function ModulesManager() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState(null);
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  const query = useQuery({
    queryKey: ['settings', 'modules'],
    queryFn: () => api('/api/admin/settings/modules'),
  });

  useEffect(() => {
    if (query.data && !values) setValues(query.data);
  }, [query.data, values]);

  const mutation = useMutation({
    mutationFn: (payload) =>
      api('/api/admin/settings/modules', { method: 'PUT', body: JSON.stringify(payload) }),
    onSuccess: (saved) => {
      setValues(saved);
      setFlash('Module controls saved. Public pages will reflect the change on the next request.');
      setError('');
      queryClient.invalidateQueries({ queryKey: ['settings', 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['overview'] });
    },
    onError: (mutationError) => {
      setFlash('');
      setError(mutationError.message);
    },
  });

  if (query.isLoading || !values) {
    return <StateBox><Spinner /><p>Loading module controls…</p></StateBox>;
  }

  if (query.isError) {
    return <StateBox><h3>Could not load module controls</h3><p>{query.error.message}</p></StateBox>;
  }

  function setField(key, field, value) {
    setValues((current) => ({
      ...current,
      [key]: { ...current[key], [field]: value },
    }));
  }

  return (
    <>
      <PageHead>
        <HeadText>
          <span className="eyebrow">Future modules</span>
          <h1>Module controls</h1>
          <p>
            Car Rental, Car Sales, Buy a Car and Sell Your Car are built as independent modules. Status changes are
            enforced in the public routes and APIs — not only hidden with CSS.
          </p>
        </HeadText>
        <HeadActions>
          <HelpTip topicId="modules" />
          <DashButton
            $variant="primary"
            $small
            type="button"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(values)}
          >
            <Save size={14} /> {mutation.isPending ? 'Saving…' : 'Save all controls'}
          </DashButton>
        </HeadActions>
      </PageHead>

      {flash ? <div style={{ marginBottom: 14 }}><Notice $tone="success">{flash}</Notice></div> : null}
      {error ? <div style={{ marginBottom: 14 }}><Notice $tone="error">{error}</Notice></div> : null}

      <Grid>
        {MODULE_KEYS.map((key) => {
          const definition = MODULE_DEFINITIONS[key];
          const module = values[key] || {};
          const status = module.status || 'HIDDEN';
          return (
            <Card key={key}>
              <CardHead>
                <div>
                  <h2>{definition.label}</h2>
                  <p>{definition.description}</p>
                  <Link href={definition.publicPath} target="_blank" rel="noreferrer">
                    Open public page <ArrowUpRight size={11} />
                  </Link>
                </div>
                <ToneBadge $tone={status === 'ACTIVE' ? 'success' : status === 'COMING_SOON' ? 'warning' : 'neutral'}>
                  {status.replace('_', ' ')}
                </ToneBadge>
              </CardHead>
              <CardBody>
                <FieldBlock>
                  <span className="label">Status</span>
                  <SelectControl
                    value={status}
                    onChange={(event) => setField(key, 'status', event.target.value)}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="COMING_SOON">Coming soon</option>
                    <option value="HIDDEN">Hidden</option>
                    <option value="DRAFT">Draft</option>
                  </SelectControl>
                  <span className="help">{STATUS_CONSEQUENCE[status]}</span>
                </FieldBlock>

                <FieldBlock>
                  <span className="label">Headline</span>
                  <Control value={module.headline || ''} onChange={(event) => setField(key, 'headline', event.target.value)} />
                </FieldBlock>

                <FieldBlock>
                  <span className="label">Description</span>
                  <TextControl
                    value={module.description || ''}
                    rows={3}
                    onChange={(event) => setField(key, 'description', event.target.value)}
                  />
                </FieldBlock>

                <FieldBlock>
                  <span className="label">Image URL</span>
                  <Control
                    value={module.image || ''}
                    onChange={(event) => setField(key, 'image', event.target.value)}
                    placeholder="/assets/images/gallery/…"
                  />
                  <span className="help">Copy a URL from the Media Library or use a static asset path.</span>
                </FieldBlock>

                <FieldBlock>
                  <span className="label">Launch date / note</span>
                  <Control
                    value={module.launchDate || ''}
                    onChange={(event) => setField(key, 'launchDate', event.target.value)}
                    placeholder="e.g. Q1 2027"
                  />
                </FieldBlock>
              </CardBody>
            </Card>
          );
        })}
      </Grid>

      <div style={{ marginTop: 18 }}>
        <Panel>
          <PanelBody>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#96938d' }}>
                Changes apply to navigation, public routes, sitemap and booking/enquiry APIs.
              </span>
              <DashButton $variant="primary" $small type="button" disabled={mutation.isPending} onClick={() => mutation.mutate(values)}>
                <Check size={14} /> {mutation.isPending ? 'Saving…' : 'Save all controls'}
              </DashButton>
            </div>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}
