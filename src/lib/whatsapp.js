export function whatsappLink(whatsapp, message) {
  if (!whatsapp?.number) return null;
  const digits = `${whatsapp.countryCode || ''}${whatsapp.number}`.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || whatsapp.defaultMessage || '')}`;
}

export function buildWhatsappMessage(template, serviceName) {
  return String(template || '').replace('{service}', serviceName || 'your services');
}

export function clickToChatLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message || '')}`;
}
