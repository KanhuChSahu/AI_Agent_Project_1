const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import services and utilities
const googleSheetsService = require('./services/googleSheetsService');
const videoGenerationService = require('./services/videoGenerationService');
const sheetUtils = require('./utils/sheetUtils');
const { errorHandler, notFound, requestLogger, ApiError } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(requestLogger); // Add request logging middleware

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up file upload with multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle Google Sheet upload/URL
app.post('/upload-sheet', async (req, res) => {
  try {
    const { sheetUrl } = req.body;
    
    // Validate and extract the spreadsheet ID from the URL
    if (!sheetUtils.isValidSheetUrl(sheetUrl)) {
      return res.status(400).json({ error: 'Invalid Google Sheet URL' });
    }
    
    const spreadsheetId = sheetUtils.extractSpreadsheetId(sheetUrl);
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'Could not extract spreadsheet ID from URL' });
    }
    
    // Extract sheet name and range if present in the URL
    const { sheetName, range } = sheetUtils.extractSheetRange(sheetUrl);
    
    // Fetch data from the Google Sheet
    const sheetData = await googleSheetsService.getSheetData(spreadsheetId, sheetName);
    
    // Extract text content for video generation
    const textContent = googleSheetsService.extractTextContent(sheetData);
    
    res.json({ success: true, data: textContent });
  } catch (error) {
    console.error('Error processing sheet:', error);
    res.status(500).json({ error: 'Failed to process Google Sheet: ' + error.message });
  }
});

// Route to generate video from text
app.post('/generate-video', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Call the AI video generation service
    const videoUrl = await videoGenerationService.generateVideo(text);
    
    res.json({ success: true, videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Failed to generate video: ' + error.message });
  }
});

// Create necessary directories if they don't exist
const ensureDirectories = () => {
  const directories = ['uploads', 'public/videos'];
  
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize services
const initializeServices = async () => {
  try {
    // Initialize Google Sheets service if credentials are available
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      await googleSheetsService.initialize();
    } else {
      console.warn('Google Sheets API credentials not found. Some features may not work.');
    }
  } catch (error) {
    console.error('Error initializing services:', error);
  }
};

// Ensure required directories exist
ensureDirectories();

// Error handling middleware (must be after all routes)
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize services after server starts
  await initializeServices();
  
  console.log(`Open http://localhost:${PORT} in your browser to use the application`);
});