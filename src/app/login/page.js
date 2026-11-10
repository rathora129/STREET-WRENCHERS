import { redirect } from 'next/navigation';
import { getCurrentOwner } from '@/lib/auth';
import { LoginView } from '@/components/dashboard/login-view';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Owner Login',
  description: 'Secure owner access to the Street Wrenchers dashboard.',
  robots: { index: false, follow: false, nocache: true },
};

export default async function LoginPage() {
  const owner = await getCurrentOwner();
  if (owner) redirect('/dashboard');

  return <LoginView />;
}
