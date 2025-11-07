import {
  BASE_URL,
  PATIENT_PATH,
  FORM_FIELDS,
  COOKIES,
  PATTERNS,
} from './constants.js';
import { parseResults, extractSessionId } from './parser.js';

/**
 * MisResultados API Client for browser
 */
export class MisResultadosClient {
  constructor() {
    this.sessionId = null;
    this.userAgent =
      'MisResultados-PWA (+https://github.com/Boricua-Tools/resultados-medicos)';
  }

  /**
   * Build patient URL with control and license parameters
   */
  buildPatientUrl(control, license) {
    return `${BASE_URL}${PATIENT_PATH}?controlnumber=${control}&lablicense=${license}`;
  }

  /**
   * Build form data for patient submission
   */
  buildFormData(patientInfo, control, license) {
    const formData = new URLSearchParams({
      [FORM_FIELDS.LAST_NAME]: patientInfo.name,
      [FORM_FIELDS.BIRTH_YEAR]: patientInfo.year,
      [FORM_FIELDS.BIRTH_MONTH]: patientInfo.month,
      [FORM_FIELDS.BIRTH_DAY]: patientInfo.day,
      [FORM_FIELDS.CONTROL_NUMBER]: control,
      [FORM_FIELDS.LICENSE_NUMBER]: license,
      [FORM_FIELDS.RECAPTCHA]: '', // Empty for now
    });

    return formData;
  }

  /**
   * Fetch results from misresultados.com
   * @param {Object} patientInfo - Patient information
   * @param {string} control - Control number
   * @param {string} license - Lab license
   * @returns {Promise<Array>} Array of results
   */
  async fetchResults(patientInfo, control, license) {
    try {
      // Step 1: Get the patient form page to establish session
      const patientUrl = this.buildPatientUrl(control, license);
      console.log('Fetching patient form page...');

      const getResponse = await fetch(patientUrl, {
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept-Language': 'en-US,en;q=0.5',
        },
        credentials: 'include',
      });

      if (!getResponse.ok) {
        throw new Error(`HTTP ${getResponse.status}: ${getResponse.statusText}`);
      }

      // Extract session ID from Set-Cookie header
      // Note: In browser, we can't directly access Set-Cookie header due to security
      // The browser will handle cookies automatically with credentials: 'include'
      // But we need the session ID for PDF downloads, so we'll try to extract it later

      // Step 2: Submit the form with patient data
      console.log('Submitting patient information...');

      const formData = this.buildFormData(patientInfo, control, license);

      const postResponse = await fetch(patientUrl, {
        method: 'POST',
        headers: {
          'User-Agent': this.userAgent,
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: patientUrl,
          Origin: BASE_URL,
        },
        body: formData.toString(),
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error(`HTTP ${postResponse.status}: ${postResponse.statusText}`);
      }

      const html = await postResponse.text();

      // Parse results from HTML
      console.log('Parsing results...');
      const results = parseResults(html);

      // Try to get session ID from cookies (this may not work in browser due to security)
      // We'll handle PDF downloads differently in the browser
      const cookieHeader = postResponse.headers.get('set-cookie');
      if (cookieHeader) {
        this.sessionId = extractSessionId(cookieHeader);
      }

      return results;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  /**
   * Download PDF (opens in new tab in browser)
   * @param {string} pdfUrl - PDF URL
   */
  async downloadPDF(pdfUrl) {
    // In browser environment, we can't set custom headers for downloads
    // So we'll open the PDF in a new tab and let the browser handle it
    // The session cookie will be sent automatically
    window.open(pdfUrl, '_blank');
  }

  /**
   * Get PDF blob for viewing
   * @param {string} pdfUrl - PDF URL
   * @returns {Promise<Blob>} PDF blob
   */
  async getPDFBlob(pdfUrl) {
    try {
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'User-Agent': this.userAgent,
          Accept: 'application/pdf,*/*',
        },
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      // Verify it's a PDF
      if (!blob.type.includes('pdf')) {
        // Try to check the content
        const text = await blob.text();
        if (!text.includes(PATTERNS.PDF_HEADER)) {
          throw new Error('Response is not a PDF');
        }
      }

      return blob;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  }
}

export default MisResultadosClient;
