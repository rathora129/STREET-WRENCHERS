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
  gap: 12px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Card = styled.div`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
  display: flex;
  flex-direction: column;
  gap: 12px;

  header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
    letter-spacing: -0.01em;
  }

  header span {
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }
`;

const Models = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.muted};
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radii.pill};
    padding: 4px 8px;
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
                <Card key={brand.id || brand.name}>
                  <header>
                    <h3>{brand.name}</h3>
                    <span>{brand.models?.length || 0} models</span>
                  </header>
                  <Models>
                    {(brand.models || []).map((model) => (
                      <span key={model.id || model.name}>{model.name}</span>
                    ))}
                  </Models>
                </Card>
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
