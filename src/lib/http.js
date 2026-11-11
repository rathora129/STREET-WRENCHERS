import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { getCurrentOwner } from './auth';

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function ok(data, init) {
  return NextResponse.json({ ok: true, data }, { status: 200, ...init });
}

export function created(data) {
  return NextResponse.json({ ok: true, data }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(message, status = 400, details) {
  return NextResponse.json({ ok: false, error: message, details }, { status });
}

export function tooManyRequests(retryAfter) {
  return NextResponse.json(
    { ok: false, error: 'Too many requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter), 'Cache-Control': 'no-store' } },
  );
}

export async function requireOwner() {
  const owner = await getCurrentOwner();
  if (!owner) throw new ApiError(401, 'Authentication required');
  return owner;
}

const MAX_JSON_BYTES = 256 * 1024;

export async function readJsonBody(request, schema) {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_JSON_BYTES) {
    throw new ApiError(413, 'Request body is too large');
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON');
  }
  if (Buffer.byteLength(raw, 'utf8') > MAX_JSON_BYTES) {
    throw new ApiError(413, 'Request body is too large');
  }

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new ApiError(400, 'Request body must be valid JSON');
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiError(
      422,
      'Validation failed',
      result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    );
  }
  return { data: result.data, body };
}

export async function readJson(request, schema) {
  const { data } = await readJsonBody(request, schema);
  return data;
}

export function getPagination(searchParams, { defaultPerPage = 20, maxPerPage = 100 } = {}) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const perPage = Math.min(maxPerPage, Math.max(1, Number(searchParams.get('perPage')) || defaultPerPage));
  return { page, perPage, skip: (page - 1) * perPage, take: perPage };
}

export function paginated(items, total, page, perPage) {
  return {
    items,
    pagination: {
      page,
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    },
  };
}

export function route(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ApiError) {
        return fail(error.message, error.status, error.details);
      }
      if (error instanceof ZodError) {
        return fail(
          'Validation failed',
          422,
          error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })),
        );
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : 'value';
          return fail(`A record with this ${target} already exists`, 409);
        }
        if (error.code === 'P2025') return fail('Record not found', 404);
        if (error.code === 'P2003') return fail('Related record not found', 409);
      }
      console.error('[api]', error);
      return fail('Something went wrong. Please try again.', 500);
    }
  };
}

export function clientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function searchParam(searchParams, key) {
  const value = searchParams.get(key);
  return value && value.trim() ? value.trim() : undefined;
}
