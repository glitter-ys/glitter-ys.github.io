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
  container.style.display = 'none';
  
  wrapper.appendChild(container);

  // Toggle QR code display
  btn.addEventListener('click', () => {
    const isHidden = window.getComputedStyle(container).display === 'none';
    if (isHidden) {
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

  const btn = document.getElementById('qrcode-btn');
  const libSrc = btn.dataset.lib || 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

  const render = () => {
    try {
      const displayTitle = getDisplayTitle(title);
      const qrWrapper = ensureQrWrapper(container);
      ensureTitle(container, displayTitle);
      ensureDownload(container, displayTitle, qrWrapper);

      // eslint-disable-next-line no-undef
      if (!qrWrapper.dataset.qrcodeReady) {
        // eslint-disable-next-line no-undef
        new QRCode(qrWrapper, {
          text: window.location.href,
          width: 128,
          height: 128,
          colorDark : "#000000",
          colorLight : "#ffffff",
          correctLevel : QRCode.CorrectLevel.H
        });
        qrWrapper.dataset.qrcodeReady = 'true';
      }

      // Safety check to ensure container is visible
      if (container.style.display === 'none') {
        container.style.display = 'block';
      }
    } catch (err) {
      console.error('Error generating QR code:', err);
      container.innerHTML = 'Error generating QR Code. See console.';
    }
  };

  if (window.QRCode) {
    render();
    return;
  }

  if (!container.hasChildNodes()) {
    container.innerHTML = 'Loading...';
  }

  // Load QRCode library dynamically
  const script = document.createElement('script');
  script.src = libSrc;
  script.onload = render;
  script.onerror = () => {
    container.innerHTML = 'Error loading QR Code library.';
  };

  document.body.appendChild(script);
}

function getDisplayTitle(title) {
  let displayTitle = 'Article';
  try {
    if (title) {
      displayTitle = decodeURIComponent(title);
    }
  } catch (e) {
    console.error('Error decoding title:', e);
    displayTitle = title || 'Article';
  }

  return displayTitle;
}

function ensureQrWrapper(container) {
  const existing = container.querySelector('.qrcode-body');
  if (existing) {
    return existing;
  }

  const qrWrapper = document.createElement('div');
  qrWrapper.className = 'qrcode-body';
  container.appendChild(qrWrapper);
  return qrWrapper;
}

function ensureTitle(container, displayTitle) {
  let titleDiv = container.querySelector('.qrcode-title');
  if (!titleDiv) {
    titleDiv = document.createElement('div');
    titleDiv.className = 'qrcode-title';
    container.appendChild(titleDiv);
  }

  titleDiv.textContent = displayTitle;
}

function ensureDownload(container, displayTitle, qrWrapper) {
  let downloadLink = container.querySelector('.qrcode-download');
  if (!downloadLink) {
    downloadLink = document.createElement('button');
    downloadLink.className = 'qrcode-download';
    downloadLink.type = 'button';
    downloadLink.textContent = '下载二维码';
    downloadLink.setAttribute('aria-label', '下载二维码');
    container.appendChild(downloadLink);
  }

  const safeTitle = makeSafeFilename(displayTitle);
  downloadLink.dataset.filename = `${safeTitle}-qrcode.png`;

  if (downloadLink.dataset.bound !== 'true') {
    downloadLink.addEventListener('click', () => {
      const dataUrl = buildQrDownloadDataUrl(qrWrapper, displayTitle) || getQRCodeDataUrl(qrWrapper);
      if (!dataUrl) {
        return;
      }

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = downloadLink.dataset.filename;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    downloadLink.dataset.bound = 'true';
  }
}

function buildQrDownloadDataUrl(qrWrapper, title) {
  const source = getQrSource(qrWrapper);
  if (!source) {
    return '';
  }

  const padding = 20;
  const gap = 12;
  const headerText = '扫码阅读文章';
  const headerFontSize = 12;
  const headerLineHeight = Math.round(headerFontSize * 1.4);
  const fontSize = 16;
  const lineHeight = Math.round(fontSize * 1.45);
  const textWidth = Math.max(source.width, 320);
  const titleFont = `600 ${fontSize}px ${getDownloadFontFamily()}`;
  const lines = [];

  const scratch = document.createElement('canvas');
  const scratchCtx = scratch.getContext('2d');
  if (!scratchCtx) {
    return '';
  }

  scratchCtx.font = titleFont;
  const wrapped = wrapText(scratchCtx, title || '', textWidth);
  wrapped.forEach((line) => lines.push(line));

  const textHeight = lines.length ? lines.length * lineHeight : 0;
  const headerHeight = headerText ? headerLineHeight : 0;
  const width = textWidth + padding * 2;
  const height = padding
    + headerHeight
    + (headerText ? gap : 0)
    + source.height
    + (lines.length ? gap + textHeight : 0)
    + padding;
  const scale = window.devicePixelRatio || 1;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  ctx.scale(scale, scale);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  let cursorY = padding;

  if (headerText) {
    ctx.font = `500 ${headerFontSize}px ${getDownloadFontFamily()}`;
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(headerText, width / 2, cursorY);
    cursorY += headerHeight + gap;
  }

  const qrX = Math.round((width - source.width) / 2);
  ctx.drawImage(source.el, qrX, cursorY, source.width, source.height);
  cursorY += source.height + gap;

  if (lines.length) {
    ctx.font = titleFont;
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const textX = width / 2;
    lines.forEach((line) => {
      ctx.fillText(line, textX, cursorY);
      cursorY += lineHeight;
    });
  }

  return canvas.toDataURL('image/png');
}

function getQrSource(qrWrapper) {
  const canvas = qrWrapper.querySelector('canvas');
  if (canvas && canvas.width && canvas.height) {
    return { el: canvas, width: canvas.width, height: canvas.height };
  }

  const img = qrWrapper.querySelector('img');
  if (img && img.complete && img.naturalWidth && img.naturalHeight) {
    return { el: img, width: img.naturalWidth, height: img.naturalHeight };
  }

  return null;
}

function getQRCodeDataUrl(qrWrapper) {
  const img = qrWrapper.querySelector('img');
  if (img && img.src) {
    return img.src;
  }

  const canvas = qrWrapper.querySelector('canvas');
  if (canvas) {
    return canvas.toDataURL('image/png');
  }

  return '';
}

function makeSafeFilename(title) {
  const cleaned = (title || 'qrcode').trim().replace(/[\\/:*?"<>|]/g, '-');
  if (!cleaned) {
    return 'qrcode';
  }

  return cleaned.replace(/\s+/g, '-').toLowerCase();
}

function wrapText(ctx, text, maxWidth, maxLines) {
  if (!text) {
    return [];
  }

  const chars = Array.from(text);
  const lines = [];
  let line = '';
  let index = 0;
  const limitLines = Number.isFinite(maxLines) && maxLines > 0;

  while (index < chars.length) {
    const next = line + chars[index];
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = '';
      if (limitLines && lines.length === maxLines - 1) {
        break;
      }
      continue;
    }
    line = next;
    index += 1;
  }

  if (line) {
    lines.push(line);
  }

  if (limitLines && index < chars.length && lines.length) {
    let last = lines[lines.length - 1];
    const suffix = '...';
    while (last && ctx.measureText(last + suffix).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[lines.length - 1] = last + suffix;
  }

  return lines;
}

function getDownloadFontFamily() {
  return 'Arial, "Microsoft YaHei", sans-serif';
}
