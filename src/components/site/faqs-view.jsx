'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Section, Container } from '@/components/ui/layout';
import { Heading, Intro } from '@/components/ui/type';
import { Accordion } from '@/components/ui/accordion';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 30px;

  button {
    padding: 9px 14px;
    border-radius: ${({ theme }) => theme.radii.pill};
    border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.brand : theme.colors.lineStrong)};
    background: ${({ $active }) => ($active ? 'rgba(242,106,13,0.1)' : 'transparent')};
    color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.muted)};
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;

    &:hover { border-color: ${({ theme }) => theme.colors.brand}; }
  }
`;

const Layout = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 56px);

  @media (min-width: 1080px) {
    grid-template-columns: 300px minmax(0, 1fr);
    align-items: start;
  }
`;

const Aside = styled.div`
  position: static;

  @media (min-width: 1080px) {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.header} + 24px);
  }
`;

export function FaqsView({ page, faqs = [] }) {
  const hero = page?.sections?.find((section) => section.type === 'PAGE_HERO');
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqs.map((faq) => faq.category).filter(Boolean)))],
    [faqs],
  );
  const [active, setActive] = useState('All');
  const visible = active === 'All' ? faqs : faqs.filter((faq) => faq.category === active);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'FAQs'}
        heading={hero?.heading || 'Straight answers.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/gallery/ac-service.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'FAQs', href: '/faqs' }]}
      />

      <Section $tone="coal">
        <Container>
          <Layout>
            <Aside>
              <Heading $size="sm" $width="16ch">Common questions.</Heading>
              <Intro style={{ marginTop: 14 }}>
                Answers about booking, pricing, AMC plans and vehicle care. If something is missing, contact the team
                and we will add it.
              </Intro>
              {categories.length > 1 ? (
                <Filters role="group" aria-label="Filter FAQs by category">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      $active={active === category}
                      aria-pressed={active === category}
                      onClick={() => setActive(category)}
                    >
                      {category}
                    </button>
                  ))}
                </Filters>
              ) : null}
              <Button href="/contact" variant="outline" size="sm">Ask a question</Button>
            </Aside>

            <div>
              {visible.length ? (
                <Accordion items={visible} />
              ) : (
                <EmptyState
                  title="No FAQs published yet"
                  text="Answers will appear here once they are published from the dashboard."
                  action={<Button href="/contact" variant="outline" size="sm">Contact the team</Button>}
                />
              )}
            </div>
          </Layout>
        </Container>
      </Section>

      <CtaBand
        heading="Still have a question?"
        subheading="Send it to the workshop and the team will respond with specifics for your car."
        ctaLabel="Contact us"
        ctaHref="/contact"
        secondaryLabel="Book a service"
        secondaryHref="/book"
      />
    </>
  );
}
