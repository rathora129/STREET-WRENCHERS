'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Search } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro } from '@/components/ui/type';
import { Input } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';
import { BrandTile } from '@/components/site/cards';

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
`;

const SearchWrap = styled.div`
  position: relative;
  width: min(420px, 100%);

  svg {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.dim};
  }

  input { padding-left: 42px; }
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  ${media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export function BrandDirectory({ page, brands = [] }) {
  const [query, setQuery] = useState('');
  const hero = page?.sections?.find((section) => section.type === 'PAGE_HERO');

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return brands;
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(term) ||
        brand.models?.some((model) => model.name.toLowerCase().includes(term)),
    );
  }, [brands, query]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Brands'}
        heading={hero?.heading || 'The makes Dubai drives, covered.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/hero/detailing.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Car Brands', href: '/brands' }]}
      />

      <Section $tone="coal">
        <Container>
          <Toolbar>
            <div>
              <Eyebrow>Coverage</Eyebrow>
              <Heading $size="sm" $width="24ch">Find your make or model.</Heading>
              <Intro style={{ marginTop: 12 }}>
                Servicing and repair for mainstream, premium and electric vehicles. Tell us the model when booking
                and the team will confirm the scope.
              </Intro>
            </div>
            <SearchWrap>
              <Search size={16} aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search brand or model"
                aria-label="Search brands and models"
              />
            </SearchWrap>
          </Toolbar>

          {filtered.length ? (
            <Grid>
              {filtered.map((brand) => (
                <BrandTile key={brand.id || brand.name} brand={brand} />
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="No match found"
              text="Try a different brand or model, or contact the workshop — we can confirm coverage for your vehicle."
              action={<Button href="/contact" variant="outline" size="sm">Ask about your car</Button>}
            />
          )}

          <div style={{ marginTop: 28 }}>
            <Button href="/book">Book for your model</Button>
          </div>
        </Container>
      </Section>

      <CtaBand
        heading="Do not see your model?"
        subheading="Tell us the make, model and year and the team will confirm whether the work is covered."
        ctaLabel="Contact the workshop"
        ctaHref="/contact"
      />
    </>
  );
}
