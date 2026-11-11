import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  ApiError,
  ok,
  readJson,
  requireOwner,
  route,
} from '@/lib/http';
import { sectionReorderSchema } from '@/lib/validation/resources';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const PATCH = route(async (request) => {
  await requireOwner();
  const { pageId, orderedIds, previousIds } = await readJson(request, sectionReorderSchema);

  let result;
  try {
    result = await prisma.$transaction(
      async (tx) => {
        const page = await tx.page.findUnique({ where: { id: pageId }, select: { id: true } });
        if (!page) throw new ApiError(404, 'Page not found');

        const current = await tx.pageSection.findMany({
          where: { pageId },
          select: { id: true, sortOrder: true },
          orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        });

        const currentIds = current.map((section) => section.id);
        const currentById = new Map(current.map((section) => [section.id, section]));
        const incoming = new Set(orderedIds);

        if (currentIds.length !== orderedIds.length || !orderedIds.every((id) => currentById.has(id))) {
          throw new ApiError(409, 'The section list changed. Reload the page and try again.');
        }
        if (incoming.size !== orderedIds.length) {
          throw new ApiError(422, 'A section can only appear once in the new order.');
        }
        if (
          previousIds &&
          (previousIds.length !== currentIds.length ||
            previousIds.some((id, index) => id !== currentIds[index]))
        ) {
          throw new ApiError(409, 'The section order was changed elsewhere. Reload the page and try again.');
        }

        const updates = orderedIds
          .map((id, index) => ({ id, sortOrder: index }))
          .filter(({ id, sortOrder }) => currentById.get(id).sortOrder !== sortOrder);

        if (updates.length) {
          await Promise.all(
            updates.map((update) =>
              tx.pageSection.update({
                where: { id: update.id },
                data: { sortOrder: update.sortOrder },
                select: { id: true },
              }),
            ),
          );
        }

        return { pageId, orderedIds, updated: updates.length };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 15000 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P2034' || error.code === 'P2028')
    ) {
      throw new ApiError(409, 'Another reorder was saved at the same time. Reload the page and try again.');
    }
    throw error;
  }

  return ok(result, NO_STORE);
});
