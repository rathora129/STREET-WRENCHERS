import { prisma } from '@/lib/prisma';
import {
  ApiError,
  created,
  getPagination,
  ok,
  paginated,
  readJson,
  requireOwner,
  route,
} from '@/lib/http';
import {
  buildWhere,
  getResource,
  serialize,
} from '@/lib/admin/resources';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

function resolveResource(name) {
  const config = getResource(name);
  if (!config) throw new ApiError(404, 'Unknown dashboard resource');
  return config;
}

export const GET = route(async (request, { params }) => {
  await requireOwner();
  const { resource } = await params;
  const config = resolveResource(resource);
  const searchParams = new URL(request.url).searchParams;
  const { page, perPage, skip, take } = getPagination(searchParams);
  const where = buildWhere(config, searchParams);
  const delegate = prisma[config.delegate];

  const [items, total] = await Promise.all([
    delegate.findMany({
      where,
      ...(config.list.include ? { include: config.list.include } : {}),
      orderBy: config.list.orderBy,
      skip,
      take,
    }),
    delegate.count({ where }),
  ]);

  return ok(paginated(serialize(items), total, page, perPage), NO_STORE);
});

export const POST = route(async (request, { params }) => {
  await requireOwner();
  const { resource } = await params;
  const config = resolveResource(resource);

  if (!config.canCreate || !config.createSchema) {
    throw new ApiError(405, `${config.label} records cannot be created from the dashboard`);
  }

  const parsed = await readJson(request, config.createSchema);
  const data = config.transform ? await config.transform(parsed, { mode: 'create' }) : parsed;
  const delegate = prisma[config.delegate];
  const item = await delegate.create({
    data,
    ...(config.list.include ? { include: config.list.include } : {}),
  });

  return created(serialize(item));
});
