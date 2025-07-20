const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

/**
 * Service for interacting with Google Sheets API
 */
class GoogleSheetsService {
  constructor() {
    this.sheets = null;
    this.initialized = false;
    this.demoMode = process.env.DEMO_MODE === 'true';
    this.demoDataPath = path.join(__dirname, '../demo/sample-sheet-data.json');
  }

  /**
   * Initialize the Google Sheets API client
   */
  async initialize() {
    try {
      // Check if demo mode is enabled
      if (this.demoMode) {
        console.log('Running in demo mode. Google Sheets API will not be used.');
        
        // Check if demo data exists
        if (!fs.existsSync(this.demoDataPath)) {
          console.warn('Demo data not found. Please run scripts/demo-data.js to generate sample data.');
        }
        
        this.initialized = true;
        return;
      }
      
      // Create auth client using credentials
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
      
      const client = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: client });
      this.initialized = true;
      
      console.log('Google Sheets API client initialized');
    } catch (error) {
      console.error('Error initializing Google Sheets API client:', error);
      throw error;
    }
  }

  /**
   * Get data from a Google Sheet
   * @param {string} spreadsheetId - The ID of the spreadsheet
   * @param {string} range - The range to fetch (e.g., 'Sheet1!A1:B10')
   * @returns {Promise<Array>} - The sheet data
   */
  async getSheetData(spreadsheetId, range = 'Sheet1') {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // If in demo mode, return sample data
      if (this.demoMode) {
        return this.getDemoData();
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      
      if (!rows || rows.length === 0) {
        return [];
      }

      // Assuming the first row contains headers
      const headers = rows[0];
      const data = [];

      // Convert rows to objects with header keys
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rowData = {};
        
        // Add row number for reference
        rowData.row = i;
        
        // Map column values to header keys
        for (let j = 0; j < headers.length; j++) {
          rowData[headers[j]] = row[j] || '';
        }
        
        data.push(rowData);
      }

      return data;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw error;
    }
  }

  /**
   * Get demo data for testing without Google Sheets API
   * @returns {Array} - Sample sheet data
   */
  getDemoData() {
    try {
      if (fs.existsSync(this.demoDataPath)) {
        const data = JSON.parse(fs.readFileSync(this.demoDataPath, 'utf8'));
        console.log('Using demo data instead of Google Sheets API');
        return data;
      } else {
        // Return basic sample data if demo file doesn't exist
        console.warn('Demo data file not found. Using basic sample data.');
        return [
          { row: 1, text: 'Sample text for video 1' },
          { row: 2, text: 'Sample text for video 2' },
          { row: 3, text: 'Sample text for video 3' }
        ];
      }
    } catch (error) {
      console.error('Error reading demo data:', error);
      return [
        { row: 1, text: 'Sample text for video 1' },
        { row: 2, text: 'Sample text for video 2' },
        { row: 3, text: 'Sample text for video 3' }
      ];
    }
  }

  /**
   * Get sheet metadata (titles, IDs, etc.)
   * @param {string} spreadsheetId - The ID of the spreadsheet
   * @returns {Promise<Object>} - The spreadsheet metadata
   */
  async getSheetMetadata(spreadsheetId) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching sheet metadata:', error);
      throw error;
    }
  }

  /**
   * Extract text content from sheet data
   * @param {Array} sheetData - The sheet data
   * @param {string} textColumn - The column name containing text for videos
   * @returns {Array} - Array of objects with row numbers and text content
   */
  extractTextContent(sheetData, textColumn = 'text') {
    return sheetData.map(row => ({
      row: row.row,
      text: row[textColumn] || ''
    })).filter(item => item.text.trim() !== '');
  }
}

module.exports = new GoogleSheetsService();