// Build-time configuration. Vite only exposes variables prefixed with VITE_.
// Set VITE_BACKEND_URL in .env (local) or in the hosting provider's env settings.
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// All counselling inquiries go to this single WhatsApp number.
export const WHATSAPP_PHONE = '916354051487'; // wa.me format: country code + number, digits only
export const WHATSAPP_DISPLAY = '+91 6354 051 487'; // human-readable format
