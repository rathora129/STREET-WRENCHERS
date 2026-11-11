import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Tracking link unavailable',
  robots: { index: false, follow: false, nocache: true },
};

export default function TrackingNotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at 50% 0%, rgba(242,106,13,0.12), transparent 45%), #08080a',
        padding: '32px 20px',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 14,
          background: '#111113',
          padding: 'clamp(26px, 5vw, 40px)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(242,106,13,0.14)',
            color: '#f26a0d',
            marginBottom: 18,
          }}
        >
          <ShieldAlert size={22} aria-hidden="true" />
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Sora, sans-serif',
            fontSize: 'clamp(22px, 4vw, 28px)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          This tracking link is unavailable
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.7, color: '#b9b6b0' }}>
          The link may have been revoked, replaced, or typed incorrectly. Contact the workshop and we will send you a
          fresh link to your vehicle&apos;s service page.
        </p>
        <Link
          href="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            padding: '12px 20px',
            borderRadius: 8,
            background: '#f26a0d',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Contact the workshop
        </Link>
      </div>
    </main>
  );
}
