import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getRentalVehicleBySlug } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { VehicleDetail } from '@/components/site/vehicle-detail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vehicle = await getRentalVehicleBySlug(slug);

  if (!vehicle) {
    return buildMetadata({ title: 'Vehicle not found', path: `/rental/${slug}`, robots: 'noindex,nofollow' });
  }

  return buildMetadata({
    title: vehicle.metaTitle || `${vehicle.name} Rental in Dubai`,
    description:
      vehicle.metaDescription ||
      `Rent the ${vehicle.name} in Dubai from AED ${vehicle.dailyRate} per day with Street Wrenchers.`,
    path: `/rental/${vehicle.slug}`,
    image: vehicle.image || '/assets/banners/og-default.jpg',
  });
}

export default async function RentalVehiclePage({ params }) {
  const { slug } = await params;
  const module = await getModule('CAR_RENTAL');
  if (!module || module.status !== 'ACTIVE') notFound();

  const vehicle = await getRentalVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <>
      <VehicleDetail vehicle={vehicle} kind="rental" />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: vehicle.name,
          description: vehicle.description,
          image: vehicle.image,
          brand: { '@type': 'Brand', name: vehicle.brand },
          offers: {
            '@type': 'Offer',
            price: vehicle.dailyRate,
            priceCurrency: 'AED',
            availability:
              vehicle.availability === 'AVAILABLE'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/LimitedAvailability',
          },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Car Rental', href: '/rental' },
          { label: vehicle.name, href: `/rental/${vehicle.slug}` },
        ])}
      />
    </>
  );
}
