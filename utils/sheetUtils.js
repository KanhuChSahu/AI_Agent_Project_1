/**
 * Utility functions for handling Google Sheets URLs and IDs
 */

/**
 * Extract the spreadsheet ID from a Google Sheets URL
 * @param {string} url - The Google Sheets URL
 * @returns {string|null} - The extracted spreadsheet ID or null if invalid
 */
function extractSpreadsheetId(url) {
  if (!url) return null;

  try {
    // Handle different URL formats
    let spreadsheetId = null;

    // Format: https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit
    const standardMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (standardMatch && standardMatch[1]) {
      spreadsheetId = standardMatch[1];
    }

    // Format: https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit#gid={sheetId}
    const gidMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit#gid=\d+/);
    if (gidMatch && gidMatch[1]) {
      spreadsheetId = gidMatch[1];
    }

    // Format: https://docs.google.com/spreadsheets/d/{spreadsheetId}/edit?usp=sharing
    const sharingMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)\/edit\?usp=sharing/);
    if (sharingMatch && sharingMatch[1]) {
      spreadsheetId = sharingMatch[1];
    }

    // Direct ID format (not a URL)
    if (!spreadsheetId && /^[a-zA-Z0-9-_]+$/.test(url)) {
      spreadsheetId = url;
    }

    return spreadsheetId;
  } catch (error) {
    console.error('Error extracting spreadsheet ID:', error);
    return null;
  }
}

/**
 * Validate if a string is a valid Google Sheets URL or ID
 * @param {string} input - The input string to validate
 * @returns {boolean} - Whether the input is valid
 */
function isValidSheetUrl(input) {
  if (!input) return false;
  
  // Check if it's a valid Google Sheets URL
  const isUrl = input.startsWith('https://docs.google.com/spreadsheets/');
  
  // Check if it's a direct spreadsheet ID
  const isId = /^[a-zA-Z0-9-_]+$/.test(input);
  
  return isUrl || isId;
}

/**
 * Extract sheet name and range from a Google Sheets URL
 * @param {string} url - The Google Sheets URL
 * @returns {Object} - The extracted sheet name and range
 */
function extractSheetRange(url) {
  try {
    // Default values
    let sheetName = 'Sheet1';
    let range = 'A:Z';

    // Extract sheet name from URL if present
    const gidMatch = url.match(/gid=(\d+)/);
    if (gidMatch && gidMatch[1]) {
      // In a real implementation, you would need to fetch the sheet metadata
      // to get the sheet name from the gid
      // For now, we'll just use a placeholder
      sheetName = `Sheet${gidMatch[1]}`;
    }

    // Extract range from URL if present
    const rangeMatch = url.match(/range=([A-Z0-9:]+)/);
    if (rangeMatch && rangeMatch[1]) {
      range = rangeMatch[1];
    }

    return { sheetName, range };
  } catch (error) {
    console.error('Error extracting sheet range:', error);
    return { sheetName: 'Sheet1', range: 'A:Z' };
  }
}

module.exports = {
  extractSpreadsheetId,
  isValidSheetUrl,
  extractSheetRange
};