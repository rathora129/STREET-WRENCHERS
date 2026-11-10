import { v2 as cloudinary } from 'cloudinary';
import { ApiError, ok, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const POST = route(async (request) => {
  await requireOwner();

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(
      503,
      'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to the environment, then restart the app.',
    );
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const baseFolder = (process.env.CLOUDINARY_UPLOAD_FOLDER || 'street-wrenchers').replace(/^\/+|\/+$/g, '');
  const requested = String(body.folder || 'library')
    .toLowerCase()
    .replace(/[^a-z0-9/_-]/g, '')
    .replace(/^\/+|\/+$/g, '');
  const folder = requested ? `${baseFolder}/${requested}` : baseFolder;
  const timestamp = Math.floor(Date.now() / 1000);

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);

  return ok(
    {
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    },
    NO_STORE,
  );
});
