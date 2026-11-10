import { prisma } from '@/lib/prisma';
import {
  ApiError,
  ok,
  readJsonBody,
  requireOwner,
  route,
} from '@/lib/http';
import { getResource, serialize } from '@/lib/admin/resources';

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
  const { resource, id } = await params;
  const config = resolveResource(resource);
  const item = await prisma[config.delegate].findUnique({
    where: { id },
    ...(config.list.include ? { include: config.list.include } : {}),
  });

  if (!item) throw new ApiError(404, `${config.label} not found`);
  return ok(serialize(item), NO_STORE);
});

export const PATCH = route(async (request, { params }) => {
  await requireOwner();
  const { resource, id } = await params;
  const config = resolveResource(resource);

  if (!config.updateSchema) throw new ApiError(405, `${config.label} records cannot be edited`);

  const { data: parsed, body } = await readJsonBody(request, config.updateSchema);

  // Zod partial schemas still apply field defaults; keep only fields the client sent.
  const present = Object.fromEntries(
    Object.keys(body || {})
      .filter((key) => key in parsed)
      .map((key) => [key, parsed[key]]),
  );

  const data = config.transform ? await config.transform(present, { mode: 'update', id }) : present;

  const item = await prisma[config.delegate].update({
    where: { id },
    data,
    ...(config.list.include ? { include: config.list.include } : {}),
  });

  return ok(serialize(item), NO_STORE);
});

export const DELETE = route(async (request, { params }) => {
  await requireOwner();
  const { resource, id } = await params;
  const config = resolveResource(resource);

  if (!config.canDelete) {
    throw new ApiError(405, `${config.label} records cannot be deleted`);
  }

  await prisma[config.delegate].delete({ where: { id } });
  return ok({ deleted: true, id }, NO_STORE);
});
