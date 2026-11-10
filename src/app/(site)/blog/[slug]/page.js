import { notFound } from 'next/navigation';
import { getBlogBySlug, getPublishedBlogs } from '@/services/content';
import { getSettings as getBusinessSettings } from '@/lib/settings';
import { buildMetadata, articleSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Narrow, Grid } from '@/components/ui/layout';
import { Prose, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { PageHero } from '@/components/site/page-hero';
import { BlogCard } from '@/components/site/cards';
import { CtaBand } from '@/components/site/cta-band';
import { Reveal } from '@/components/ui/reveal';

function renderBlocks(content) {
  const blocks = String(content || '').split(/\n{2,}/).filter((block) => block.trim());

  return blocks.map((block, index) => {
    const trimmed = block.trim();

    if (trimmed.startsWith('### ')) {
      return <h3 key={index}>{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={index}>{trimmed.slice(3)}</h2>;
    }

    const lines = trimmed.split('\n');
    if (lines.every((line) => /^[-*]\s/.test(line.trim()))) {
      return (
        <ul key={index}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{line.replace(/^[-*]\s/, '')}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} style={{ whiteSpace: 'pre-line' }}>
        {trimmed}
      </p>
    );
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return buildMetadata({ title: 'Article not found', path: `/blog/${slug}`, robots: 'noindex,nofollow' });
  }

  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.ogImage || post.coverImage || '/assets/banners/og-default.jpg',
    keywords: post.keywords || [],
    type: 'article',
  });
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const [recent, settings] = await Promise.all([getPublishedBlogs({ take: 4 }), getBusinessSettings()]);
  const related = recent.filter((item) => item.slug !== post.slug).slice(0, 3);
  const published = post.publishedAt
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
        new Date(post.publishedAt),
      )
    : null;

  return (
    <>
      <PageHero
        eyebrow={post.category || 'Journal'}
        heading={post.title}
        subheading={post.excerpt}
        image={post.coverImage || '/assets/images/hero/engine.jpg'}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <Section $tone="coal">
        <Narrow>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginBottom: 26 }}>
            <Badge $tone="brand">{post.author || settings.business.name}</Badge>
            {published ? <span style={{ fontSize: 12, color: '#96938d' }}>{published}</span> : null}
            {post.readMinutes ? (
              <span style={{ fontSize: 12, color: '#96938d' }}>{post.readMinutes} min read</span>
            ) : null}
          </div>

          <Prose>{renderBlocks(post.content)}</Prose>

          {post.tags?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 34 }}>
              {post.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
        </Narrow>
      </Section>

      {related.length ? (
        <Section $tone="charcoal">
          <div style={{ maxWidth: 1240, margin: '0 auto', paddingInline: 'clamp(20px, 4vw, 48px)' }}>
            <SectionHead
              eyebrow="More from the journal"
              title="Other notes from the workshop."
              action={null}
            />
            <Grid $cols={1} $md={2} $lg={3}>
              {related.map((item) => (
                <Reveal key={item.id}>
                  <BlogCard post={item} />
                </Reveal>
              ))}
            </Grid>
          </div>
        </Section>
      ) : null}

      <CtaBand
        heading="Need this looked at on your car?"
        subheading="Book a service and the team will confirm the scope after inspection."
        ctaLabel="Book a service"
        ctaHref="/book"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />

      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title, href: `/blog/${post.slug}` },
        ])}
      />
    </>
  );
}
