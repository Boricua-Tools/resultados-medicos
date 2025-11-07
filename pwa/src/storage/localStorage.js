/**
 * Local Storage Manager for patient data
 */

const STORAGE_KEYS = {
  PATIENT_INFO: 'misresultados_patient_info',
  LANGUAGE: 'misresultados_language',
  THEME: 'misresultados_theme',
};

/**
 * Save patient information to localStorage
 * @param {Object} patientInfo - Patient information object
 * @param {string} patientInfo.name - Patient last names
 * @param {string} patientInfo.day - Birth day (DD)
 * @param {string} patientInfo.month - Birth month (MM)
 * @param {string} patientInfo.year - Birth year (YYYY)
 */
export function savePatientInfo(patientInfo) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.PATIENT_INFO,
      JSON.stringify(patientInfo)
    );
    return true;
  } catch (error) {
    console.error('Error saving patient info:', error);
    return false;
  }
}

/**
 * Get patient information from localStorage
 * @returns {Object|null} Patient information or null if not found
 */
export function getPatientInfo() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENT_INFO);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting patient info:', error);
    return null;
  }
}

/**
 * Clear patient information from localStorage
 */
export function clearPatientInfo() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PATIENT_INFO);
    return true;
  } catch (error) {
    console.error('Error clearing patient info:', error);
    return false;
  }
}

/**
 * Save language preference
 * @param {string} language - Language code ('es' or 'en')
 */
export function saveLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error('Error saving language:', error);
    return false;
  }
}

/**
 * Get language preference
 * @returns {string} Language code ('es' or 'en')
 */
export function getLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'es';
  } catch (error) {
    console.error('Error getting language:', error);
    return 'es';
  }
}

/**
 * Save theme preference
 * @param {string} theme - Theme ('light' or 'dark')
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error('Error saving theme:', error);
    return false;
  }
}

/**
 * Get theme preference
 * @returns {string} Theme ('light' or 'dark')
 */
export function getTheme() {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  } catch (error) {
    console.error('Error getting theme:', error);
    return 'light';
  }
}

/**
 * Clear all app data
 */
export function clearAllData() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

export default {
  savePatientInfo,
  getPatientInfo,
  clearPatientInfo,
  saveLanguage,
  getLanguage,
  saveTheme,
  getTheme,
  clearAllData,
};
