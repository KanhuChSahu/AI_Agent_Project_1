document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sheetForm = document.getElementById('sheetForm');
  const sheetDataCard = document.getElementById('sheetData');
  const sheetContent = document.getElementById('sheetContent');
  const generateBtn = document.getElementById('generateBtn');
  const videoResults = document.getElementById('videoResults');
  const videoContainer = document.getElementById('videoContainer');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');

  // Event Listeners
  sheetForm.addEventListener('submit', handleSheetSubmit);
  generateBtn.addEventListener('click', handleVideoGeneration);

  // Handle Sheet Form Submission
  async function handleSheetSubmit(e) {
    e.preventDefault();
    
    const sheetUrl = document.getElementById('sheetUrl').value.trim();
    if (!sheetUrl) return;

    // Show loading overlay
    showLoading('Extracting text from Google Sheet...');

    try {
      const response = await fetch('/upload-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheetUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process Google Sheet');
      }

      const data = await response.json();
      displaySheetData(data.data);
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      hideLoading();
    }
  }

  // Display Sheet Data in Table
  function displaySheetData(data) {
    // Clear previous content
    sheetContent.innerHTML = '';

    // Add rows for each text entry
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${item.row}" id="row-${item.row}" checked>
          </div>
        </td>
        <td>${item.row}</td>
        <td>${item.text}</td>
      `;
      sheetContent.appendChild(row);
    });

    // Show the sheet data card
    sheetDataCard.classList.remove('d-none');
  }

  // Handle Video Generation
  async function handleVideoGeneration() {
    // Get selected rows
    const selectedCheckboxes = document.querySelectorAll('.form-check-input:checked');
    if (selectedCheckboxes.length === 0) {
      showAlert('Please select at least one text entry to generate a video', 'warning');
      return;
    }

    // Clear previous video results
    videoContainer.innerHTML = '';
    videoResults.classList.add('d-none');

    // Show loading overlay
    showLoading('Generating videos with AI...');

    // Process each selected text entry
    const selectedRows = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    const textEntries = [];

    // Get text for each selected row
    selectedRows.forEach(rowNum => {
      const rowElement = document.querySelector(`#row-${rowNum}`).closest('tr');
      const textContent = rowElement.cells[2].textContent;
      textEntries.push({ row: rowNum, text: textContent });
    });

    try {
      // Generate videos for each text entry
      const videoPromises = textEntries.map(entry => generateVideoForText(entry));
      const results = await Promise.all(videoPromises);

      // Display generated videos
      displayVideos(results);
    } catch (error) {
      showAlert(error.message, 'danger');
    } finally {
      hideLoading();
    }
  }

  // Generate Video for a Single Text Entry
  async function generateVideoForText(entry) {
    try {
      const response = await fetch('/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: entry.text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();
      return {
        row: entry.row,
        text: entry.text,
        videoUrl: data.videoUrl
      };
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  // Display Generated Videos
  function displayVideos(videoResults) {
    videoContainer.innerHTML = '';

    videoResults.forEach(result => {
      const videoCard = document.createElement('div');
      videoCard.className = 'col-md-6 video-card';
      videoCard.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Video ${result.row}</h5>
            <div class="video-container">
              <video controls>
                <source src="${result.videoUrl}" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
            <p class="card-text">${result.text.substring(0, 100)}${result.text.length > 100 ? '...' : ''}</p>
            <a href="${result.videoUrl}" class="btn btn-primary" download>Download Video</a>
          </div>
        </div>
      `;
      videoContainer.appendChild(videoCard);
    });

    // Show the video results card
    videoResults.classList.remove('d-none');
  }

  // Helper Functions
  function showLoading(message) {
    loadingText.textContent = message || 'Processing...';
    loadingOverlay.classList.remove('d-none');
  }

  function hideLoading() {
    loadingOverlay.classList.add('d-none');
  }

  function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
  }
});