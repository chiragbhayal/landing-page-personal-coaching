// Contest-prep image slider controller (auto-advances every 5s, pauses on hover/focus)
const INTERVAL_MS = 5000;

const showSlide = (slider, index) => {
  const slides = Array.from(slider.querySelectorAll('[data-prep-slide-item]'));
  const dots = Array.from(slider.querySelectorAll('[data-prep-slide]'));
  if (!slides.length) return;
  const nextIndex = (index + slides.length) % slides.length;
  slider.setAttribute('data-index', String(nextIndex));
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === nextIndex;
    slide.setAttribute('data-active', String(active));
    slide.setAttribute('aria-hidden', String(!active));
  });
  dots.forEach((dot, dotIndex) => {
    dot.setAttribute('aria-current', String(dotIndex === nextIndex));
  });
};

const stopSlider = (slider) => {
  if (slider.__prepTimer) clearInterval(slider.__prepTimer);
  slider.__prepTimer = null;
};

const startSlider = (slider) => {
  stopSlider(slider);
  slider.__prepTimer = setInterval(() => {
    showSlide(slider, Number(slider.getAttribute('data-index') || 0) + 1);
  }, INTERVAL_MS);
};

export function initPrepSlider() {
  document.querySelectorAll('[data-prep-slider]').forEach((slider) => {
    showSlide(slider, 0);
    startSlider(slider);
    slider.addEventListener('mouseenter', () => stopSlider(slider));
    slider.addEventListener('mouseleave', () => startSlider(slider));
    slider.addEventListener('focusin', () => stopSlider(slider));
    slider.addEventListener('focusout', () => startSlider(slider));
  });

  document.addEventListener('click', (event) => {
    const slider = event.target.closest('[data-prep-slider]');
    if (!slider) return;

    const direction = event.target.closest('[data-prep-direction]');
    const dot = event.target.closest('[data-prep-slide]');
    if (!direction && !dot) return;

    const current = Number(slider.getAttribute('data-index') || 0);
    showSlide(
      slider,
      direction
        ? current + Number(direction.getAttribute('data-prep-direction'))
        : Number(dot.getAttribute('data-prep-slide')),
    );
    startSlider(slider);
  });

  document.addEventListener('keydown', (event) => {
    const slider = event.target.closest('[data-prep-slider]');
    if (!slider || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = Number(slider.getAttribute('data-index') || 0);
    showSlide(slider, current + (event.key === 'ArrowRight' ? 1 : -1));
  });
}
