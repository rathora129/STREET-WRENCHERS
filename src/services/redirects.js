import { cache } from 'react';
import { prisma } from '@/lib/prisma';

function normalizePath(pathname) {
  if (!pathname) return null;
  const trimmed = pathname.split('?')[0];
  if (trimmed.length > 1 && trimmed.endsWith('/')) return trimmed.slice(0, -1);
  return trimmed || null;
}

export const resolveRedirect = cache(async (pathname) => {
  const fromPath = normalizePath(pathname);
  if (!fromPath || fromPath.startsWith('/_next') || fromPath.startsWith('/api')) return null;

  return prisma.redirect.findFirst({
    where: {
      isActive: true,
      fromPath: fromPath === '/' ? '/' : { in: [fromPath, `${fromPath}/`] },
    },
    select: { toPath: true, statusCode: true },
  });
});
