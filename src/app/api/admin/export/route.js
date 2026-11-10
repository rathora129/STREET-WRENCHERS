import { prisma } from '@/lib/prisma';
import { ApiError, requireOwner, route } from '@/lib/http';
import { buildWhere, getResource } from '@/lib/admin/resources';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLUMNS = {
  leads: [
    ['createdAt', 'Created'],
    ['name', 'Name'],
    ['phone', 'Phone'],
    ['email', 'Email'],
    ['type', 'Type'],
    ['status', 'Status'],
    ['vehicleBrand', 'Vehicle brand'],
    ['vehicleModel', 'Vehicle model'],
    ['vehicleYear', 'Vehicle year'],
    ['message', 'Message'],
    ['source', 'Source'],
    ['utmSource', 'UTM source'],
    ['utmMedium', 'UTM medium'],
    ['utmCampaign', 'UTM campaign'],
    ['utmTerm', 'UTM term'],
    ['utmContent', 'UTM content'],
    ['landingPage', 'Landing page'],
    ['followUpAt', 'Follow up'],
    ['notes', 'Notes'],
  ],
  bookings: [
    ['reference', 'Reference'],
    ['createdAt', 'Created'],
    ['status', 'Status'],
    ['customerName', 'Customer'],
    ['phone', 'Phone'],
    ['email', 'Email'],
    ['brandName', 'Brand'],
    ['modelName', 'Model'],
    ['year', 'Year'],
    ['fuelType', 'Fuel'],
    ['serviceName', 'Service'],
    ['packageName', 'Package'],
    ['preferredDate', 'Preferred date'],
    ['preferredTime', 'Preferred time'],
    ['pickupRequired', 'Pickup'],
    ['pickupAddress', 'Pickup address'],
    ['priceEstimate', 'Price estimate (AED)'],
    ['notes', 'Customer notes'],
    ['adminNotes', 'Admin notes'],
    ['source', 'Source'],
  ],
  customers: [
    ['name', 'Name'],
    ['phone', 'Phone'],
    ['email', 'Email'],
    ['totalBookings', 'Bookings'],
    ['totalSpent', 'Total spent (AED)'],
    ['lastVisitAt', 'Last visit'],
    ['createdAt', 'Created'],
    ['notes', 'Notes'],
  ],
};

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export const GET = route(async (request) => {
  await requireOwner();

  const url = new URL(request.url);
  const resource = url.searchParams.get('resource');
  const config = getResource(resource);
  const columns = COLUMNS[resource];

  if (!config || !columns) {
    throw new ApiError(400, 'This resource cannot be exported');
  }

  const where = buildWhere(config, url.searchParams);
  const rows = await prisma[config.delegate].findMany({
    where,
    orderBy: config.list.orderBy,
    take: 5000,
  });

  const lines = [columns.map(([, label]) => csvCell(label)).join(',')];
  for (const row of rows) {
    lines.push(
      columns
        .map(([key]) => {
          const value = row[key];
          if (value instanceof Date) return csvCell(value.toISOString());
          if (typeof value === 'object' && value !== null) return csvCell(Number(value));
          return csvCell(value);
        })
        .join(','),
    );
  }

  const csv = `\uFEFF${lines.join('\r\n')}\r\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="street-wrenchers-${resource}-${stamp}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
});
