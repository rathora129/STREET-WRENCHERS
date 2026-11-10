import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getSaleVehicleBySlug } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { VehicleDetail } from '@/components/site/vehicle-detail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const vehicle = await getSaleVehicleBySlug(slug);

  if (!vehicle) {
    return buildMetadata({ title: 'Vehicle not found', path: `/car-sales/${slug}`, robots: 'noindex,nofollow' });
  }

  return buildMetadata({
    title: vehicle.metaTitle || `${vehicle.title} for Sale in Dubai`,
    description:
      vehicle.metaDescription ||
      `${vehicle.title} (${vehicle.year}) for sale in Dubai at AED ${vehicle.price} with Street Wrenchers.`,
    path: `/car-sales/${vehicle.slug}`,
    image: vehicle.image || '/assets/banners/og-default.jpg',
  });
}

export default async function SaleVehiclePage({ params }) {
  const { slug } = await params;
  const module = await getModule('CAR_SALES');
  if (!module || module.status !== 'ACTIVE') notFound();

  const vehicle = await getSaleVehicleBySlug(slug);
  if (!vehicle) notFound();

  return (
    <>
      <VehicleDetail vehicle={vehicle} kind="sales" />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Car',
          name: vehicle.title,
          description: vehicle.description,
          image: vehicle.image,
          brand: { '@type': 'Brand', name: vehicle.brandName },
          model: vehicle.model,
          vehicleModelDate: String(vehicle.year),
          mileageFromOdometer: vehicle.mileage
            ? { '@type': 'QuantitativeValue', value: vehicle.mileage, unitCode: 'KMT' }
            : undefined,
          offers: {
            '@type': 'Offer',
            price: vehicle.price,
            priceCurrency: 'AED',
            availability: 'https://schema.org/InStock',
          },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Car Sales', href: '/car-sales' },
          { label: vehicle.title, href: `/car-sales/${vehicle.slug}` },
        ])}
      />
    </>
  );
}
