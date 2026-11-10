import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedPage, getPublishedBlogs, getPublishedBlogCount } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container, Grid } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';
import { BlogCard } from '@/components/site/cards';
import { CtaBand } from '@/components/site/cta-band';

const PER_PAGE = 9;

export async function generateMetadata() {
  const page = await getPublishedPage('blog');
  return pageMetadata(page, { path: '/blog', fallbackTitle: 'Workshop Journal' });
}

export default async function BlogPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const current = Math.max(1, Number(pageParam) || 1);

  const [page, posts, total] = await Promise.all([
    getPublishedPage('blog'),
    getPublishedBlogs({ take: PER_PAGE, skip: (current - 1) * PER_PAGE }),
    getPublishedBlogCount(),
  ]);

  if (!page) notFound();

  const hero = page.sections?.find((section) => section.type === 'PAGE_HERO');
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Journal'}
        heading={hero?.heading || 'Notes from the workshop.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/hero/engine.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }]}
      />

      <Section $tone="coal">
        <Container>
          {posts.length ? (
            <>
              <Grid $cols={1} $md={2} $lg={3}>
                {posts.map((post) => (
                  <Reveal key={post.id}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </Grid>

              {totalPages > 1 ? (
                <nav
                  aria-label="Blog pagination"
                  style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 40, justifyContent: 'center' }}
                >
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <Link
                      key={number}
                      href={number === 1 ? '/blog' : `/blog?page=${number}`}
                      aria-current={number === current ? 'page' : undefined}
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        border: `1px solid ${number === current ? '#f26a0d' : 'rgba(255,255,255,0.16)'}`,
                        color: number === current ? '#f6f5f2' : '#96938d',
                        background: number === current ? 'rgba(242,106,13,0.14)' : 'transparent',
                        fontSize: 13,
                      }}
                    >
                      {number}
                    </Link>
                  ))}
                </nav>
              ) : null}
            </>
          ) : (
            <EmptyState
              title="The journal is being prepared"
              text="Practical maintenance guidance from the workshop will be published here. In the meantime, contact the team with your questions."
              action={<Button href="/contact" variant="outline" size="sm">Ask the workshop</Button>}
            />
          )}
        </Container>
      </Section>

      <CtaBand
        heading="Have a question about your car?"
        subheading="Send it to the workshop and the team will point you in the right direction."
        ctaLabel="Contact us"
        ctaHref="/contact"
        secondaryLabel="Book a service"
        secondaryHref="/book"
      />

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
        ])}
      />
    </>
  );
}
