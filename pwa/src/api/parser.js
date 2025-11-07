import { PATTERNS, BASE_URL } from './constants.js';

/**
 * Parse results from HTML response
 * @param {string} html - HTML content from misresultados.com
 * @returns {Array<Object>} Array of result objects
 */
export function parseResults(html) {
  const results = [];

  // First try to extract from the large-only table (desktop version), then main table
  let largeTableMatch = html.match(PATTERNS.LARGE_TABLE);
  if (!largeTableMatch) {
    largeTableMatch = html.match(PATTERNS.MAIN_TABLE);
  }

  if (!largeTableMatch) {
    console.warn('No results table found in HTML');
    return results;
  }

  const tableHtml = largeTableMatch[1];

  // Extract all table rows
  const rowMatches = [...tableHtml.matchAll(PATTERNS.TABLE_ROW)];

  for (let i = 0; i < rowMatches.length; i++) {
    const rowContent = rowMatches[i][1];
    // Skip header rows and rows without data cells
    if (rowContent.includes('<th') || !rowContent.includes('<td')) {
      continue;
    }

    // Extract PDF URL from the row
    const pdfLinkMatch = rowContent.match(PATTERNS.PDF_LINK);

    if (pdfLinkMatch) {
      // Use a simpler approach: split by <td> tags and extract text
      const cells = rowContent.split('<td>').slice(1); // Skip first empty element

      if (cells.length >= 4) {
        // Extract text content from each cell, removing HTML tags
        const cleanCell = (cellHtml) => {
          return cellHtml
            .replace(/<[^>]*>/g, '')
            .replace(/&[^;]+;/g, '')
            .trim();
        };

        const result = {
          order: cleanCell(cells[1]) || '', // Second cell: order
          license: cleanCell(cells[2]) || '', // Third cell: license
          transmitted: cleanCell(cells[3]) || '', // Fourth cell: transmitted
          pdfUrl: BASE_URL + pdfLinkMatch[1],
        };

        // Only add if we have the required data
        if (
          result.order &&
          result.license &&
          result.transmitted &&
          result.pdfUrl
        ) {
          results.push(result);
        }
      }
    }
  }

  return results;
}

/**
 * Extract session ID from cookies
 * @param {string} cookieString - Cookie string from response
 * @returns {string|null} Session ID or null
 */
export function extractSessionId(cookieString) {
  if (!cookieString) {
    return null;
  }

  const match = cookieString.match(PATTERNS.SESSION_ID);
  return match ? match[1] : null;
}

/**
 * Parse control number and lab license from URL
 * @param {string} url - URL containing control number and lab license
 * @returns {Object|null} Object with control and license or null
 */
export function parseUrlParams(url) {
  try {
    const urlObj = new URL(url);
    const control =
      urlObj.searchParams.get('controlnumber') ||
      urlObj.searchParams.get('control');
    const license =
      urlObj.searchParams.get('lablicense') ||
      urlObj.searchParams.get('license');

    if (control && license) {
      return { control, license };
    }

    // Fallback to regex if URL params don't work
    const match = url.match(PATTERNS.CONTROL_LICENSE_URL);
    if (match) {
      return {
        control: match[1] || match[4],
        license: match[2] || match[3],
      };
    }

    return null;
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
}
