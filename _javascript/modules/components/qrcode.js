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
  container.style.display = 'none';
  container.style.position = 'absolute';
  container.style.backgroundColor = '#fff';
  container.style.padding = '10px';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '4px';
  container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  container.style.zIndex = '1000';
  container.style.marginTop = '10px';
  
  wrapper.appendChild(container);

  // Toggle QR code display
  btn.addEventListener('click', () => {
    if (container.style.display === 'none') {
      showQRCode(container);
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

function showQRCode(container) {
  container.style.display = 'block';

  // Position it below the button
  // Since we appended to wrapper, we might need to adjust positioning if wrapper has relative positioning
  // or use Popper.js if available. For now simple appending.
  
  if (container.innerHTML !== '') {
    return; // Already generated
  }
  
  container.innerHTML = 'Loading...';

  // Load QRCode library dynamically
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  
  script.onload = () => {
    container.innerHTML = '';
    // eslint-disable-next-line no-undef
    new QRCode(container, {
      text: window.location.href,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  };
  
  script.onerror = () => {
    container.innerHTML = 'Error loading QR Code library.';
  };
  
  document.body.appendChild(script);
}
