/**
 * UI Utility functions
 */

/**
 * Show a screen and hide others
 * @param {string} screenId - ID of screen to show
 */
export function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen) => {
    screen.classList.add('hidden');
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
  }
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 */
export function showLoading(message = 'Cargando...') {
  const overlay = document.getElementById('loading-overlay');
  const text = document.getElementById('loading-text');

  if (text) {
    text.textContent = message;
  }

  if (overlay) {
    overlay.classList.remove('hidden');
  }
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in ms (default 5000)
 */
export function showToast(message, type = 'info', duration = 5000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

/**
 * Populate day select dropdown
 * @param {HTMLSelectElement} select - Select element
 */
export function populateDays(select) {
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i.toString().padStart(2, '0');
    option.textContent = i.toString().padStart(2, '0');
    select.appendChild(option);
  }
}

/**
 * Populate month select dropdown
 * @param {HTMLSelectElement} select - Select element
 */
export function populateMonths(select) {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i.toString().padStart(2, '0');
    option.textContent = `${i.toString().padStart(2, '0')} - ${months[i - 1]}`;
    select.appendChild(option);
  }
}

/**
 * Populate year select dropdown
 * @param {HTMLSelectElement} select - Select element
 */
export function populateYears(select) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 100; // Last 100 years

  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement('option');
    option.value = year.toString();
    option.textContent = year.toString();
    select.appendChild(option);
  }
}

/**
 * Format date for display
 * @param {string} day - Day (DD)
 * @param {string} month - Month (MM)
 * @param {string} year - Year (YYYY)
 * @returns {string} Formatted date
 */
export function formatDate(day, month, year) {
  return `${day}/${month}/${year}`;
}

/**
 * Clear form inputs
 * @param {HTMLFormElement} form - Form element
 */
export function clearForm(form) {
  form.reset();
}

export default {
  showScreen,
  showLoading,
  hideLoading,
  showToast,
  populateDays,
  populateMonths,
  populateYears,
  formatDate,
  clearForm,
};
