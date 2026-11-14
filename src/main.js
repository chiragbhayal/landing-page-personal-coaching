import './styles/main.css';

import { initMobileNav } from './scripts/mobile-nav.js';
import { initGoalDropdown } from './scripts/goal-dropdown.js';
import { initCounsellingForm } from './scripts/counselling-form.js';
import { initPrepSlider } from './scripts/prep-slider.js';

// Module scripts run after the document is parsed, so the DOM is ready here.
initMobileNav();
initGoalDropdown();
initCounsellingForm();
initPrepSlider();
