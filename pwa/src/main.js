/**
 * Main application entry point
 */
import MisResultadosClient from './api/client.js';
import { parseUrlParams } from './api/parser.js';
import {
  savePatientInfo,
  getPatientInfo,
  clearPatientInfo,
} from './storage/localStorage.js';
import {
  showScreen,
  showLoading,
  hideLoading,
  showToast,
  populateDays,
  populateMonths,
  populateYears,
  formatDate,
  clearForm,
} from './components/ui.js';
import { t, setLanguage, initI18n, getCurrentLanguage } from './components/i18n.js';

// Global state
let apiClient = null;
let currentResults = [];

/**
 * Initialize the application
 */
function init() {
  console.log('Initializing MisResultados PWA...');

  // Initialize API client
  apiClient = new MisResultadosClient();

  // Initialize i18n
  initI18n();

  // Populate date dropdowns
  populateDateDropdowns();

  // Setup event listeners
  setupEventListeners();

  // Check if patient info exists
  const patientInfo = getPatientInfo();
  if (patientInfo) {
    // Show fetch screen
    displayPatientInfo(patientInfo);
    showScreen('fetch-screen');
  } else {
    // Show setup screen
    showScreen('setup-screen');
  }

  console.log('App initialized successfully');
}

/**
 * Populate date dropdowns
 */
function populateDateDropdowns() {
  const daySelect = document.getElementById('birth-day');
  const monthSelect = document.getElementById('birth-month');
  const yearSelect = document.getElementById('birth-year');

  if (daySelect) populateDays(daySelect);
  if (monthSelect) populateMonths(monthSelect);
  if (yearSelect) populateYears(yearSelect);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Patient setup form
  const patientForm = document.getElementById('patient-form');
  if (patientForm) {
    patientForm.addEventListener('submit', handlePatientSetup);
  }

  // Edit patient button
  const editPatientBtn = document.getElementById('edit-patient-btn');
  if (editPatientBtn) {
    editPatientBtn.addEventListener('click', handleEditPatient);
  }

  // Fetch results form
  const fetchForm = document.getElementById('fetch-form');
  if (fetchForm) {
    fetchForm.addEventListener('submit', handleFetchResults);
  }

  // Link form
  const linkForm = document.getElementById('link-form');
  if (linkForm) {
    linkForm.addEventListener('submit', handleLinkSubmit);
  }

  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', handleBack);
  }

  // Language toggle
  const langToggle = document.getElementById('language-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', handleLanguageToggle);
  }
}

/**
 * Handle patient setup form submission
 */
async function handlePatientSetup(e) {
  e.preventDefault();

  const name = document.getElementById('patient-name').value.trim();
  const day = document.getElementById('birth-day').value;
  const month = document.getElementById('birth-month').value;
  const year = document.getElementById('birth-year').value;

  if (!name || !day || !month || !year) {
    showToast(t('errors.generic'), 'error');
    return;
  }

  const patientInfo = { name, day, month, year };

  if (savePatientInfo(patientInfo)) {
    showToast(t('success.patientSaved'), 'success');
    displayPatientInfo(patientInfo);
    showScreen('fetch-screen');
  } else {
    showToast(t('errors.generic'), 'error');
  }
}

/**
 * Display patient information
 */
function displayPatientInfo(patientInfo) {
  const nameEl = document.getElementById('display-patient-name');
  const dobEl = document.getElementById('display-patient-dob');

  if (nameEl) {
    nameEl.textContent = patientInfo.name;
  }

  if (dobEl) {
    dobEl.textContent = formatDate(
      patientInfo.day,
      patientInfo.month,
      patientInfo.year
    );
  }
}

/**
 * Handle edit patient button click
 */
function handleEditPatient() {
  const patientInfo = getPatientInfo();
  if (patientInfo) {
    // Pre-fill the form
    document.getElementById('patient-name').value = patientInfo.name;
    document.getElementById('birth-day').value = patientInfo.day;
    document.getElementById('birth-month').value = patientInfo.month;
    document.getElementById('birth-year').value = patientInfo.year;
  }

  showScreen('setup-screen');
}

/**
 * Handle fetch results form submission
 */
async function handleFetchResults(e) {
  e.preventDefault();

  const control = document.getElementById('control-number').value.trim();
  const license = document.getElementById('lab-license').value.trim();

  if (!control || !license) {
    showToast(t('errors.generic'), 'error');
    return;
  }

  await fetchAndDisplayResults(control, license);
}

/**
 * Handle link form submission
 */
async function handleLinkSubmit(e) {
  e.preventDefault();

  const link = document.getElementById('result-link').value.trim();

  if (!link) {
    showToast(t('errors.generic'), 'error');
    return;
  }

  const params = parseUrlParams(link);

  if (!params || !params.control || !params.license) {
    showToast(t('errors.invalidLink'), 'error');
    return;
  }

  // Pre-fill the manual form
  document.getElementById('control-number').value = params.control;
  document.getElementById('lab-license').value = params.license;

  await fetchAndDisplayResults(params.control, params.license);
}

/**
 * Fetch and display results
 */
async function fetchAndDisplayResults(control, license) {
  const patientInfo = getPatientInfo();

  if (!patientInfo) {
    showToast(t('errors.noPatientInfo'), 'error');
    showScreen('setup-screen');
    return;
  }

  try {
    showLoading(t('loading.fetchingResults'));

    const results = await apiClient.fetchResults(patientInfo, control, license);

    hideLoading();

    if (results.length === 0) {
      showToast(t('results.noResults'), 'warning');
      return;
    }

    currentResults = results;
    displayResults(results);
    showScreen('results-screen');
  } catch (error) {
    hideLoading();
    console.error('Error fetching results:', error);
    showToast(t('errors.fetchFailed'), 'error');
  }
}

/**
 * Display results
 */
function displayResults(results) {
  const resultsCount = document.getElementById('results-count');
  const resultsList = document.getElementById('results-list');

  if (resultsCount) {
    resultsCount.textContent = t('results.count', { count: results.length });
  }

  if (resultsList) {
    resultsList.innerHTML = '';

    results.forEach((result, index) => {
      const card = createResultCard(result, index);
      resultsList.appendChild(card);
    });
  }
}

/**
 * Create result card element
 */
function createResultCard(result, index) {
  const card = document.createElement('div');
  card.className = 'result-card';

  card.innerHTML = `
    <div class="result-header">
      <span class="icon">📄</span>
      <strong>${t('results.order')}: ${result.order}</strong>
    </div>
    <div class="result-info">
      <div class="result-info-row">
        <span class="result-info-label">${t('results.license')}:</span>
        <span class="result-info-value">${result.license}</span>
      </div>
      <div class="result-info-row">
        <span class="result-info-label">${t('results.transmitted')}:</span>
        <span class="result-info-value">${result.transmitted}</span>
      </div>
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" data-action="view" data-index="${index}">
        ${t('results.viewPDF')}
      </button>
      <button class="btn btn-secondary" data-action="download" data-index="${index}">
        ${t('results.download')}
      </button>
    </div>
  `;

  // Add event listeners
  const viewBtn = card.querySelector('[data-action="view"]');
  const downloadBtn = card.querySelector('[data-action="download"]');

  if (viewBtn) {
    viewBtn.addEventListener('click', () => handleViewPDF(result));
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => handleDownloadPDF(result));
  }

  return card;
}

/**
 * Handle view PDF
 */
async function handleViewPDF(result) {
  try {
    // Open PDF in new tab
    apiClient.downloadPDF(result.pdfUrl);
  } catch (error) {
    console.error('Error viewing PDF:', error);
    showToast(t('errors.pdfFailed'), 'error');
  }
}

/**
 * Handle download PDF
 */
async function handleDownloadPDF(result) {
  try {
    showLoading(t('loading.downloadingPDF'));

    const blob = await apiClient.getPDFBlob(result.pdfUrl);

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate filename
    const dateStr = result.transmitted.replace(/[^0-9]/g, '-');
    a.download = `resultado_${result.order}_${dateStr}.pdf`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    hideLoading();
    showToast(t('success.patientSaved'), 'success'); // Reusing success message
  } catch (error) {
    hideLoading();
    console.error('Error downloading PDF:', error);
    showToast(t('errors.pdfFailed'), 'error');
  }
}

/**
 * Handle back button
 */
function handleBack() {
  showScreen('fetch-screen');
}

/**
 * Handle language toggle
 */
function handleLanguageToggle(e) {
  e.preventDefault();
  const currentLang = getCurrentLanguage();
  const newLang = currentLang === 'es' ? 'en' : 'es';
  setLanguage(newLang);

  // Re-render results if they exist
  if (currentResults.length > 0) {
    displayResults(currentResults);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
