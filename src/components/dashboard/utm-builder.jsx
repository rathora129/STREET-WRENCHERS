'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { Check, Copy, Link2 } from 'lucide-react';
import { Control, DashButton, FieldBlock, Notice, Panel, PanelBody, PanelHead, SelectControl } from './ui';

const Grid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  @media (min-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Output = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-top: 14px;

  code {
    flex: 1;
    min-width: 0;
    padding: 11px 12px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.smoke};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11.5px;
    overflow-wrap: anywhere;
  }
`;

export function UtmBuilder() {
  const { data } = useQuery({
    queryKey: ['admin-options'],
    queryFn: async () => {
      const response = await fetch('/api/admin/options');
      return response.json().then((payload) => payload.data);
    },
    staleTime: 120_000,
  });

  const campaigns = data?.campaigns || [];
  const [campaignId, setCampaignId] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [path, setPath] = useState('/');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const configured = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    setBaseUrl(configured.replace(/\/$/, ''));
  }, []);

  const selected = campaigns.find((campaign) => campaign.id === campaignId);

  useEffect(() => {
    if (!selected) return;
    setSource(selected.source || '');
    setMedium(selected.medium || '');
  }, [selected]);

  const url = useMemo(() => {
    if (!baseUrl) return '';
    try {
      const target = new URL(path || '/', `${baseUrl}/`);
      if (source) target.searchParams.set('utm_source', source);
      if (medium) target.searchParams.set('utm_medium', medium);
      const campaignValue = selected?.campaignId || selected?.slug;
      if (campaignValue) target.searchParams.set('utm_campaign', campaignValue);
      if (term) target.searchParams.set('utm_term', term);
      if (content) target.searchParams.set('utm_content', content);
      return target.toString();
    } catch {
      return '';
    }
  }, [baseUrl, path, source, medium, selected, term, content]);

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Panel>
      <PanelHead>
        <h2>UTM link builder</h2>
        <Link2 size={15} />
      </PanelHead>
      <PanelBody>
        <Grid>
          <FieldBlock>
            <span className="label">Campaign</span>
            <SelectControl value={campaignId} onChange={(event) => setCampaignId(event.target.value)}>
              <option value="">Manual / no campaign</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </SelectControl>
          </FieldBlock>
          <FieldBlock>
            <span className="label">Landing path</span>
            <Control value={path} onChange={(event) => setPath(event.target.value)} placeholder="/book" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">UTM source</span>
            <Control value={source} onChange={(event) => setSource(event.target.value)} placeholder="google" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">UTM medium</span>
            <Control value={medium} onChange={(event) => setMedium(event.target.value)} placeholder="cpc" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">UTM term</span>
            <Control value={term} onChange={(event) => setTerm(event.target.value)} placeholder="car service dubai" />
          </FieldBlock>
          <FieldBlock>
            <span className="label">UTM content</span>
            <Control value={content} onChange={(event) => setContent(event.target.value)} placeholder="hero-cta" />
          </FieldBlock>
        </Grid>

        <Output>
          <code>{url || 'Enter a valid site URL and path to build a tracking link.'}</code>
          <DashButton type="button" $small onClick={copy} disabled={!url}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </DashButton>
        </Output>

        {url ? (
          <div style={{ marginTop: 12 }}>
            <Notice>
              This link records UTM values in the visitor’s session. Leads submitted from it are attributed to the campaign in the CRM.
            </Notice>
          </div>
        ) : null}
      </PanelBody>
    </Panel>
  );
}
