import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

// Ensures the site layout (and its database redirect gate) runs for unmatched
// multi-segment paths before a 404 is returned.
export default function SiteCatchAll() {
  notFound();
}
