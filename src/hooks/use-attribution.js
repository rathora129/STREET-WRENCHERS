'use client';

import { useEffect, useState } from 'react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

export function useAttribution() {
  const [attribution, setAttribution] = useState({ utm: {}, landingPage: '', source: 'website' });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fresh = {};
      for (const key of UTM_KEYS) {
        const value = params.get(key);
        if (value) fresh[key] = value;
      }

      if (Object.keys(fresh).length) {
        window.sessionStorage.setItem('sw_utm', JSON.stringify(fresh));
        window.sessionStorage.setItem('sw_landing', window.location.pathname);
      }

      const stored = window.sessionStorage.getItem('sw_utm');
      const landing = window.sessionStorage.getItem('sw_landing') || window.location.pathname;
      let utm = {};
      try {
        utm = stored ? JSON.parse(stored) : {};
      } catch {
        utm = {};
      }

      setAttribution({
        utm,
        landingPage: landing,
        source: utm.utm_source || 'website',
      });
    } catch {
      setAttribution({ utm: {}, landingPage: window.location.pathname, source: 'website' });
    }
  }, []);

  return attribution;
}
