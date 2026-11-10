import { ApiError, ok, readJson, requireOwner, route } from '@/lib/http';
import { getSettingGroup, saveSettingGroup, SETTINGS_SCHEMAS } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const GET = route(async (request, { params }) => {
  await requireOwner();
  const { group } = await params;
  if (!SETTINGS_SCHEMAS[group]) throw new ApiError(404, 'Unknown settings group');

  return ok(await getSettingGroup(group), NO_STORE);
});

export const PUT = route(async (request, { params }) => {
  await requireOwner();
  const { group } = await params;
  const schema = SETTINGS_SCHEMAS[group];
  if (!schema) throw new ApiError(404, 'Unknown settings group');

  const data = await readJson(request, schema);
  const saved = await saveSettingGroup(group, data);

  return ok(saved, NO_STORE);
});
