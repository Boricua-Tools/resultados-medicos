/**
 * Internationalization (i18n) module
 */
import es from '../locales/es.js';
import en from '../locales/en.js';
import { getLanguage, saveLanguage } from '../storage/localStorage.js';

const translations = {
  es,
  en,
};

let currentLanguage = getLanguage();

/**
 * Get translation for a key
 * @param {string} key - Translation key (e.g., 'app.title')
 * @param {Object} params - Parameters for string interpolation
 * @returns {string} Translated string
 */
export function t(key, params = {}) {
  const keys = key.split('.');
  let value = translations[currentLanguage];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  // Fallback to Spanish if not found
  if (value === undefined) {
    value = translations.es;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
  }

  // String interpolation
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  return value || key;
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Set language
 * @param {string} lang - Language code ('es' or 'en')
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    saveLanguage(lang);
    updatePageTranslations();
  }
}

/**
 * Update all translations on the page
 */
export function updatePageTranslations() {
  // Update elements with data-i18n attribute
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Update placeholders
  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Update aria-labels
  const ariaLabels = document.querySelectorAll('[data-i18n-aria-label]');
  ariaLabels.forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    el.setAttribute('aria-label', t(key));
  });

  // Update language toggle button
  const langToggle = document.getElementById('language-toggle');
  if (langToggle) {
    langToggle.textContent = currentLanguage === 'es' ? 'English' : 'Español';
  }
}

/**
 * Initialize i18n
 */
export function initI18n() {
  updatePageTranslations();
}

export default {
  t,
  getCurrentLanguage,
  setLanguage,
  updatePageTranslations,
  initI18n,
};
