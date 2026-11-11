'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[app] root render failed', error?.digest || error?.message || 'unknown error');
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '48px 20px',
          background: '#08080a',
          color: '#f4f2ef',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#f26a0d',
            }}
          >
            Temporary issue
          </p>
          <h1 style={{ margin: '14px 0 10px', fontSize: 28, lineHeight: 1.2 }}>
            We couldn&apos;t load this page.
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 14, lineHeight: 1.7, color: '#b9b5ae' }}>
            The service is briefly unavailable. Your data is safe — please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 22px',
              borderRadius: 8,
              border: 0,
              background: '#f26a0d',
              color: '#08080a',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
