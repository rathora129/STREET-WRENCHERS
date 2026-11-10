'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    let id = window.sessionStorage.getItem('sw_session_id');
    if (!id) {
      id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem('sw_session_id', id);
    }
    return id;
  } catch {
    return null;
  }
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const sessionId = getSessionId();
    const params = new URLSearchParams(window.location.search);

    try {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          type: 'PAGE_VIEW',
          path: pathname,
          sessionId,
          source: params.get('utm_source') || undefined,
          medium: params.get('utm_medium') || undefined,
          campaignId: params.get('utm_campaign') || undefined,
          metadata: { referrer: document.referrer || null },
        }),
      });
    } catch {
      // Analytics failures are non-blocking.
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: pathname });
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
