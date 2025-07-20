# Google Sheets to Video AI Portal

A web portal that allows users to upload Google Sheets and convert text content to videos using AI technology.

## Features

- Upload Google Sheets by URL
- Extract text content from sheets
- Generate videos from text using AI
- Download generated videos

## Technologies Used

- Node.js and Express for the backend
- Google Sheets API for sheet integration
- Free AI video generation services
- EJS for templating
- Bootstrap for frontend styling

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Google Cloud Platform account (for Google Sheets API)
- An account with a free AI video generation service

### Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   DEMO_MODE=true  # Set to true to use demo data instead of actual Google Sheets API
   GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
   AI_VIDEO_API_KEY=your_api_key_here
   ```

4. Set up Google Sheets API (not required if using demo mode):
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable the Google Sheets API
   - Create credentials (OAuth client ID or service account)
   - Download the credentials JSON file and save it as `credentials.json` in the project root

5. Sign up for a free AI video generation service and get an API key (not required for basic demo functionality)

### Demo Mode

This application includes a demo mode that allows you to test the functionality without setting up Google Sheets API credentials:

1. Make sure `DEMO_MODE=true` is set in your `.env` file
2. Generate sample data by running:
   ```
   node scripts/demo-data.js
   ```
3. Start the application as normal
4. You can enter any text in the Google Sheet URL field - the application will use the demo data instead of actually accessing Google Sheets

### Running the Application

1. Start the server:
   ```
   npm start
   ```
   or for development with auto-reload:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter a Google Sheet URL in the provided input field
2. The application will extract text content from the sheet
3. Select which text entries you want to convert to videos
4. Click "Generate Videos" to start the conversion process
5. Once complete, you can preview and download the generated videos

## Google Sheets Format

For best results, your Google Sheet should have a column containing the text you want to convert to videos. The sheet should be publicly accessible or shared with the service account email if you're using a service account for authentication.

## Free AI Video Generation Services

This application is designed to work with free AI video generation services. Some options include:

- Fliki.ai (limited free tier)
- Invideo AI (free with watermark)
- Canva's AI video generator (limited free features)

You'll need to sign up for one of these services and integrate their API with this application.

## License

MIT