'use client';

import styled from 'styled-components';
import { Section, Narrow } from '@/components/ui/layout';
import { PageHero } from '@/components/site/page-hero';

const Updated = styled.p`
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};
  margin-bottom: 24px;
`;

const Block = styled.section`
  padding-block: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(18px, 2vw, 22px);
    letter-spacing: -0.01em;
    margin-bottom: 14px;
  }

  p {
    color: ${({ theme }) => theme.colors.muted};
    font-size: 14.5px;
    line-height: 1.8;

    & + p { margin-top: 12px; }
  }
`;

export function LegalPage({ page }) {
  const sections = page.sections || [];
  const hero = sections.find((section) => section.type === 'PAGE_HERO');
  const content = sections.filter((section) => section !== hero);
  const updated = page.updatedAt
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(page.updatedAt))
    : null;

  return (
    <>
      <PageHero
        eyebrow="Legal"
        heading={page.title}
        subheading={page.metaDescription}
        image={hero?.image || '/assets/images/hero/workshop.jpg'}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: page.title, href: `/${page.slug}` },
        ]}
      />
      <Section $tone="coal">
        <Narrow>
          {updated ? <Updated>Last updated — {updated}</Updated> : null}
          {content.map((section) => (
            <Block key={section.id || section.key}>
              {section.heading ? <h2>{section.heading}</h2> : null}
              {String(section.body || '')
                .split('\n\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </Block>
          ))}
        </Narrow>
      </Section>
    </>
  );
}
