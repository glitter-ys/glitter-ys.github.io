/**
 * Add a QR Code to the sharing options
 */

export function initQRCode() {
  const btn = document.getElementById('qrcode-btn');

  if (!btn) {
    return;
  }

  const wrapper = btn.closest('.share-wrapper');
  
  // Create container for QR code
  const container = document.createElement('div');
  container.id = 'qrcode-container';
  container.className = 'qrcode-container'; // Add class for styling
  
  wrapper.appendChild(container);

  // Toggle QR code display
  btn.addEventListener('click', () => {
    if (container.style.display === 'none') {
      showQRCode(container, btn.dataset.title);
    } else {
      container.style.display = 'none';
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (event) => {
    if (!btn.contains(event.target) && !container.contains(event.target)) {
      container.style.display = 'none';
    }
  });
}

function showQRCode(container, title) {
  container.style.display = 'block';

  if (container.hasChildNodes()) {
    return; // Already generated
  }

  container.innerHTML = 'Loading...';

  // Load QRCode library dynamically
  const script = document.createElement('script');
  const btn = document.getElementById('qrcode-btn');
  script.src = btn.dataset.lib || 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

  script.onload = () => {
    try {
      container.innerHTML = '';

      // QR Code Wrapper
      const qrWrapper = document.createElement('div');
      qrWrapper.className = 'qrcode-body';
      container.appendChild(qrWrapper);

      // Title
      const titleDiv = document.createElement('div');
      titleDiv.className = 'qrcode-title';
      let displayTitle = 'Article';
      try {
        if (title) {
          displayTitle = decodeURIComponent(title);
        }
      } catch (e) {
        console.error('Error decoding title:', e);
        displayTitle = title || 'Article';
      }
      titleDiv.innerText = displayTitle;
      container.appendChild(titleDiv);

      // Download Link
      const downloadLink = document.createElement('a');
      downloadLink.className = 'qrcode-download';
      downloadLink.innerText = 'Download';
      downloadLink.download = 'qrcode.png';
      // Initial href (placeholder)
      downloadLink.href = '#';
      container.appendChild(downloadLink);

      // eslint-disable-next-line no-undef
      const qrcode = new QRCode(qrWrapper, {
        text: window.location.href,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });

      // Set download link href
      setTimeout(() => {
        const img = qrWrapper.querySelector('img');
        if (img) {
          downloadLink.href = img.src;
        } else {
          // Fallback if it renders canvas only (some versions)
          const canvas = qrWrapper.querySelector('canvas');
          if (canvas) {
            downloadLink.href = canvas.toDataURL('image/png');
          }
        }
      }, 100);

    } catch (err) {
      console.error('Error generating QR code:', err);
      container.innerHTML = 'Error generating QR Code. See console.';
    }
  };

  script.onerror = () => {
    container.innerHTML = 'Error loading QR Code library.';
  };

  document.body.appendChild(script);
}
