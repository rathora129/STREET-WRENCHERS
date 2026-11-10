'use client';

import styled, { keyframes } from 'styled-components';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.35); }
  70% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
`;

const Float = styled.a`
  position: fixed;
  right: clamp(16px, 3vw, 28px);
  bottom: clamp(16px, 3vw, 28px);
  z-index: 80;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #25d366;
  color: #04120a;
  animation: ${pulse} 2.8s infinite;

  &:hover {
    background: #37e176;
  }
`;

export function trackWhatsappClick(serviceName) {
  try {
    fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        type: 'WHATSAPP_CLICK',
        path: window.location.pathname,
        metadata: serviceName ? { service: serviceName } : undefined,
      }),
    });
  } catch {
    // Tracking must never block the chat link.
  }
}

export function WhatsAppFloat({ settings }) {
  const wa = settings?.whatsapp;
  if (!wa?.enabled || !wa?.showFloatingButton) return null;
  const link = whatsappLink(wa, wa.defaultMessage);
  if (!link) return null;

  return (
    <Float
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Street Wrenchers on WhatsApp"
      onClick={() => trackWhatsappClick()}
    >
      <MessageCircle size={26} strokeWidth={1.8} aria-hidden="true" />
    </Float>
  );
}
