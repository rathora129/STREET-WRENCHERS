import { getHomeData, getPage } from '@/services/content';
import { pageMetadata, faqSchema, JsonLd } from '@/lib/seo';
import { HomeView } from '@/components/site/home-view';

export async function generateMetadata() {
  const page = await getPage('home');
  return pageMetadata(page, { path: '/' });
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <HomeView data={data} />
      <JsonLd data={faqSchema(data.faqs)} />
    </>
  );
}
