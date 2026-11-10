import { redirect } from 'next/navigation';
import { getCurrentOwner } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/shell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: {
    default: 'Owner Dashboard',
    template: '%s | Street Wrenchers Dashboard',
  },
  description: 'Private operations dashboard for Street Wrenchers.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardLayout({ children }) {
  const owner = await getCurrentOwner();
  if (!owner) redirect('/login?next=/dashboard');

  return (
    <DashboardShell owner={{ name: owner.name, email: owner.email }}>
      {children}
    </DashboardShell>
  );
}
