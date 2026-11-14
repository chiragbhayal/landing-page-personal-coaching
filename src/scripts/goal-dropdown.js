// Goal dropdown (custom listbox) controller
export function initGoalDropdown() {
  const closeDropdown = (dropdown, returnFocus = false) => {
    const trigger = dropdown.querySelector('[data-goal-trigger]');
    const menu = dropdown.querySelector('[data-goal-menu]');
    trigger.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    if (returnFocus) trigger.focus();
  };

  const openDropdown = (dropdown, focusOption = false) => {
    const trigger = dropdown.querySelector('[data-goal-trigger]');
    const menu = dropdown.querySelector('[data-goal-menu]');
    trigger.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    if (focusOption) {
      (menu.querySelector('[aria-selected="true"]') || menu.querySelector('[data-goal-option]')).focus();
    }
  };

  document.addEventListener('click', (event) => {
    const dropdown = event.target.closest('[data-goal-dropdown]');

    document.querySelectorAll('[data-goal-dropdown]').forEach((item) => {
      if (item !== dropdown) closeDropdown(item);
    });

    if (!dropdown) return;

    const trigger = event.target.closest('[data-goal-trigger]');
    if (trigger) {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeDropdown(dropdown);
      else openDropdown(dropdown);
      return;
    }

    const option = event.target.closest('[data-goal-option]');
    if (!option) return;

    const value = option.getAttribute('data-value');
    dropdown.querySelector('[data-goal-value]').textContent = value;
    dropdown.querySelector('input[name="goal"]').value = value;
    dropdown.querySelectorAll('[data-goal-option]').forEach((item) => {
      item.setAttribute('aria-selected', String(item === option));
    });
    closeDropdown(dropdown, true);
  });

  document.addEventListener('keydown', (event) => {
    const dropdown = event.target.closest('[data-goal-dropdown]');
    if (!dropdown) return;

    const trigger = dropdown.querySelector('[data-goal-trigger]');
    const menu = dropdown.querySelector('[data-goal-menu]');
    const options = Array.from(dropdown.querySelectorAll('[data-goal-option]'));
    const optionIndex = options.indexOf(event.target);

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDropdown(dropdown, true);
      return;
    }

    if (event.target === trigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      openDropdown(dropdown, true);
      return;
    }

    if (optionIndex >= 0 && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let nextIndex = optionIndex;
      if (event.key === 'ArrowDown') nextIndex = (optionIndex + 1) % options.length;
      if (event.key === 'ArrowUp') nextIndex = (optionIndex - 1 + options.length) % options.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = options.length - 1;
      options[nextIndex].focus();
    }

    if (event.key === 'Tab' && !menu.hidden) closeDropdown(dropdown);
  });
}
