// Mobile navigation drawer controller
export function initMobileNav() {
  const closeMobileNav = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-mobile-nav]');
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  };

  const toggleMobileNav = () => {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.querySelector('[data-mobile-nav]');
    if (!toggle || !menu) return;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
  };

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-nav-toggle]');
    if (toggle) {
      event.preventDefault();
      toggleMobileNav();
      return;
    }

    const menu = document.querySelector('[data-mobile-nav]');
    if (menu && menu.classList.contains('is-open')) {
      // Close when a menu link is tapped or when clicking outside the menu.
      if (event.target.closest('[data-mobile-nav] a') || !event.target.closest('[data-mobile-nav]')) {
        closeMobileNav();
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileNav();
  });
}
