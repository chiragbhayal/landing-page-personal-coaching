// Counselling form controller: validates, logs the lead to the CRM (if configured)
// and opens a pre-filled WhatsApp chat with the inquiry.
import { BACKEND_URL, WHATSAPP_PHONE, WHATSAPP_DISPLAY } from '../config.js';

// Pre-fill the form from URL query parameters (?name=&mobile=&goal=)
const prefillFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const mobile = params.get('mobile');
    const goal = params.get('goal');
    if (!name && !mobile && !goal) return;

    document.querySelectorAll('[data-counselling-form]').forEach((form) => {
      if (name) {
        const nameInput = form.querySelector('[name="name"]');
        if (nameInput) nameInput.value = name;
      }
      if (mobile) {
        const mobileInput = form.querySelector('[name="mobile"]');
        if (mobileInput) mobileInput.value = mobile;
      }
      if (goal) {
        const goalInput = form.querySelector('[name="goal"]');
        if (goalInput) goalInput.value = goal;
        const goalValue = form.querySelector('[data-goal-value]');
        if (goalValue) goalValue.textContent = goal;
      }
    });

    // Clean the query string so it doesn't linger in the address bar
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    }
  } catch (_) {
    /* ignore */
  }
};

const sendToCrm = ({ name, mobile, goal }) => {
  if (!BACKEND_URL) return;
  try {
    const payload = {
      name,
      email: `lead-${mobile}@fitnesswithgomzi.com`,
      mobile: `+91${mobile}`,
      message: `Counselling request for ${goal}`,
      subject: 'FWG Landing Page Counselling',
      source: 'fitnesswithgomzi',
      recipients: ['+' + WHATSAPP_PHONE],
      assignedTo: ['+' + WHATSAPP_PHONE],
      details: {
        goal,
        landingPage: window.location.href,
        submittedAt: new Date().toISOString(),
        whatsappRecipients: [{ desk: 'Primary Desk', number: WHATSAPP_DISPLAY }],
      },
    };

    // Non-blocking; keepalive lets the request finish even if the page navigates away.
    fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      console.warn('[Gomzi Counselling] Background CRM sync warning:', err);
    });
  } catch (crmErr) {
    console.warn('[Gomzi Counselling] Background CRM exception:', crmErr);
  }
};

const handleSubmit = (event) => {
  const form = event.target.closest('[data-counselling-form]');
  if (!form) return;

  event.preventDefault();
  event.stopPropagation();

  const nameInput = form.querySelector('[name="name"]');
  const mobileInput = form.querySelector('[name="mobile"]');
  const goalInput = form.querySelector('[name="goal"]');
  const submitButton = form.querySelector('[data-counselling-submit]');
  const status = form.querySelector('[data-counselling-status]');
  const name = nameInput ? nameInput.value.trim() : '';
  const mobile = mobileInput ? mobileInput.value.replace(/\D/g, '').slice(-10) : '';
  const goal = goalInput ? goalInput.value : 'Fat Loss (Level 1)';

  const showStatus = (text, isError = false) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = text;
    status.style.color = isError ? '#B42318' : '#233402';
  };

  // Validation
  if (!name) {
    showStatus('Please enter your full name.', true);
    if (nameInput) nameInput.focus();
    return;
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    showStatus('Please enter a valid 10-digit Mobile number.', true);
    if (mobileInput) mobileInput.focus();
    return;
  }

  // 1. Structured WhatsApp inquiry text
  const messageText =
    `*New Counselling Inquiry - Gomzi Transformation*\n\n` +
    `👤 *Full Name:* ${name}\n` +
    `📱 *Mobile Number:* +91 ${mobile}\n` +
    `🎯 *Selected Goal:* ${goal}\n` +
    `🌐 *Source:* Gomzi Landing Page\n\n` +
    `Hello Dr. Gautam Jani & Team, I would like to book my counselling session. Please let me know the next steps.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(messageText)}`;

  // 2. Background CRM capture
  sendToCrm({ name, mobile, goal });

  // 3. UI feedback
  showStatus(`Connecting to WhatsApp (${WHATSAPP_DISPLAY})… Please tap "Send" in the chat.`);

  const btnText = form.querySelector('[data-counselling-btn-text]');
  const originalLabel = btnText ? btnText.textContent : 'Book counselling on WhatsApp';
  if (submitButton) submitButton.disabled = true;
  if (btnText) {
    btnText.textContent = 'Connecting WhatsApp…';
  } else if (submitButton) {
    submitButton.textContent = 'Connecting WhatsApp…';
  }

  // 4. Open the WhatsApp chat with the pre-filled inquiry
  // Note: passing 'noopener' to window.open() makes it always return null, which made
  // the fallback below fire every time; so open normally and detach the opener manually.
  let opened = false;
  try {
    const wa = window.open(whatsappUrl, '_blank');
    if (wa && !wa.closed) {
      wa.opener = null;
      opened = true;
    }
  } catch (_) {
    /* ignore */
  }

  // Fallback for popup blockers / mobile webviews
  if (!opened) window.location.href = whatsappUrl;

  if (nameInput) nameInput.value = '';
  if (mobileInput) mobileInput.value = '';

  setTimeout(() => {
    if (submitButton) submitButton.disabled = false;
    if (btnText) {
      btnText.textContent = originalLabel;
    } else if (submitButton) {
      submitButton.textContent = originalLabel;
    }
  }, 2500);
};

export function initCounsellingForm() {
  prefillFromUrl();
  // Capture phase so we intercept before any default form action.
  document.addEventListener('submit', handleSubmit, true);
}
