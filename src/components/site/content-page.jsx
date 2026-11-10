'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Split } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, Prose } from '@/components/ui/type';
import { Reveal } from '@/components/ui/reveal';
import { SmartImage } from '@/components/ui/smart-image';
import { Accordion } from '@/components/ui/accordion';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

const Points = styled.div`
  display: grid;
  gap: 1px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.line};
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Point = styled.div`
  background: ${({ theme }) => theme.colors.coal};
  padding: clamp(20px, 2.6vw, 30px);

  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
  }

  p {
    font-size: 13.5px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

function TextSection({ section }) {
  return (
    <Section $tone="charcoal">
      <Container>
        <Split $ratio="1fr 1.05fr">
          <Reveal>
            <div>
              {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
              <Heading $width="20ch">{section.heading}</Heading>
              {section.body ? (
                <Prose style={{ marginTop: 22, whiteSpace: 'pre-line' }}>{section.body}</Prose>
              ) : null}
            </div>
          </Reveal>
          {section.image ? (
            <Reveal delay={0.08}>
              <SmartImage
                src={section.image}
                alt={section.imageAlt || section.heading || ''}
                ratio="4 / 3"
                sizes="(max-width: 820px) 100vw, 48vw"
              />
            </Reveal>
          ) : null}
        </Split>
      </Container>
    </Section>
  );
}

function PointsSection({ section }) {
  const points = section.data?.points || [];
  if (!points.length) return null;
  return (
    <Section>
      <Container>
        <div style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>
          {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
          <Heading $width="22ch">{section.heading}</Heading>
          {section.subheading ? <Intro style={{ marginTop: 16 }}>{section.subheading}</Intro> : null}
        </div>
        <Points>
          {points.map((point) => (
            <Point key={point.title}>
              <strong>{point.title}</strong>
              <p>{point.text}</p>
            </Point>
          ))}
        </Points>
      </Container>
    </Section>
  );
}

function FaqsSection({ section, faqs }) {
  const items = faqs?.length ? faqs : section.data?.faqs || [];
  if (!items.length) return null;
  return (
    <Section $tone="charcoal">
      <Container>
        <Grid $cols={1} $md={2} $lg={2}>
          <div>
            {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
            <Heading $width="18ch">{section.heading || 'Straight answers.'}</Heading>
            {section.subheading ? <Intro style={{ marginTop: 16 }}>{section.subheading}</Intro> : null}
          </div>
          <Accordion items={items} />
        </Grid>
      </Container>
    </Section>
  );
}

export function ContentPage({ page }) {
  const sections = page?.sections || [];
  const hero = sections.find((section) => section.type === 'PAGE_HERO') || sections[0];
  const rest = sections.filter((section) => section !== hero);
  const path = `/${page.slug}`;
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: page.title, href: path },
  ];

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow}
        heading={hero?.heading || page.title}
        subheading={hero?.subheading}
        image={hero?.image}
        imageAlt={hero?.imageAlt}
        breadcrumbs={breadcrumbs}
      />

      {rest.map((section, index) => {
        switch (section.type) {
          case 'TEXT':
          case 'INTRO':
            return <TextSection key={section.id || section.key} section={section} />;
          case 'WHY':
            return <PointsSection key={section.id || section.key} section={section} />;
          case 'CTA':
            return (
              <CtaBand
                key={section.id || section.key}
                heading={section.heading}
                subheading={section.subheading || section.body}
                ctaLabel={section.ctaLabel}
                ctaHref={section.ctaHref}
                secondaryLabel={section.secondaryLabel}
                secondaryHref={section.secondaryHref}
              />
            );
          case 'FAQS':
            return (
              <FaqsSection
                key={section.id || section.key}
                section={section}
                faqs={page.faqs}
              />
            );
          default: {
            const hasBody = section.heading || section.body;
            if (!hasBody) return null;
            return (
              <Section key={section.id || section.key} $tone={index % 2 ? 'coal' : undefined}>
                <Container>
                  <div style={{ maxWidth: 820 }}>
                    {section.eyebrow ? <Eyebrow>{section.eyebrow}</Eyebrow> : null}
                    <Heading $width="24ch">{section.heading}</Heading>
                    {section.body ? (
                      <Prose style={{ marginTop: 20, whiteSpace: 'pre-line' }}>{section.body}</Prose>
                    ) : null}
                  </div>
                </Container>
              </Section>
            );
          }
        }
      })}
    </>
  );
}
