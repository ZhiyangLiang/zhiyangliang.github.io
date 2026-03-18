const SIGNAL_VIEWER_SIGNALS = [
  { key: 'aes', displayLabel: 'Aesthetic Quality' },
  { key: 'wat', displayLabel: 'Watermark Probability' },
  { key: 'cla', displayLabel: 'Perceptual Sharpness' },
  { key: 'ent', displayLabel: 'Information Density' },
  { key: 'luma', displayLabel: 'Visual Brightness' },
];

const SIGNAL_VIEWER_LEVELS = ['low', 'medium', 'high'];

function initializePage() {
  setupSignalViewer();
  setupBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

document.addEventListener('click', handleSignalViewerClick);

function handleSignalViewerClick(event) {
  const control = event.target.closest('.signal-nav, .signal-level-button, .signal-selector-button');
  if (!control) {
    return;
  }

  const section = control.closest('#signal-visualizations');
  const viewer = section ? section.querySelector('.signal-viewer') : null;
  if (!viewer) {
    return;
  }

  event.preventDefault();
  if (control.classList.contains('signal-nav-prev')) {
    changeSignalViewerSignal(viewer, -1);
    return;
  }
  if (control.classList.contains('signal-nav-next')) {
    changeSignalViewerSignal(viewer, 1);
    return;
  }
  if (control.classList.contains('signal-level-button')) {
    setSignalViewerLevel(viewer, control.dataset.level);
    return;
  }
  if (control.classList.contains('signal-selector-button')) {
    setSignalViewerSignal(viewer, control.dataset.signal);
  }
}

function getSignalViewerImagePath(level, signal) {
  return `static/Vis_Cases/${level}_${signal}.png`;
}

function ensureSignalViewerState(viewer) {
  const defaultLevel = SIGNAL_VIEWER_LEVELS.includes(viewer.dataset.defaultLevel)
    ? viewer.dataset.defaultLevel
    : 'low';

  if (!SIGNAL_VIEWER_LEVELS.includes(viewer.dataset.currentLevel)) {
    viewer.dataset.currentLevel = defaultLevel;
  }
  if (!SIGNAL_VIEWER_SIGNALS.some(signal => signal.key === viewer.dataset.currentSignal)) {
    viewer.dataset.currentSignal = SIGNAL_VIEWER_SIGNALS[0].key;
  }
}

function renderSignalViewer(viewer) {
  ensureSignalViewerState(viewer);

  const image = viewer.querySelector('.signal-viewer-image');
  const title = viewer.querySelector('.signal-viewer-title-value');
  const caption = viewer.querySelector('.signal-viewer-caption');
  const levelButtons = viewer.querySelectorAll('.signal-level-button');
  const signalButtons = document.querySelectorAll('#signal-visualizations .signal-selector-button');

  if (!image || !title || !caption) {
    return;
  }

  const signal =
    SIGNAL_VIEWER_SIGNALS.find(item => item.key === viewer.dataset.currentSignal) ||
    SIGNAL_VIEWER_SIGNALS[0];
  const level = viewer.dataset.currentLevel;
  const titleCaseLevel = level.charAt(0).toUpperCase() + level.slice(1);

  image.src = getSignalViewerImagePath(level, signal.key);
  image.alt = `${signal.displayLabel} with ${level} control strength`;
  title.textContent = signal.displayLabel;
  caption.textContent = `${titleCaseLevel} Control Strength`;

  levelButtons.forEach(button => {
    const isActive = button.dataset.level === level;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  signalButtons.forEach(button => {
    const isActive = button.dataset.signal === signal.key;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function changeSignalViewerSignal(viewer, offset) {
  ensureSignalViewerState(viewer);

  const currentIndex = SIGNAL_VIEWER_SIGNALS.findIndex(
    signal => signal.key === viewer.dataset.currentSignal
  );
  const baseIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex =
    (baseIndex + offset + SIGNAL_VIEWER_SIGNALS.length) % SIGNAL_VIEWER_SIGNALS.length;

  viewer.dataset.currentSignal = SIGNAL_VIEWER_SIGNALS[nextIndex].key;
  renderSignalViewer(viewer);
}

function setSignalViewerLevel(viewer, level) {
  if (!SIGNAL_VIEWER_LEVELS.includes(level)) {
    return;
  }

  viewer.dataset.currentLevel = level;
  renderSignalViewer(viewer);
}

function setSignalViewerSignal(viewer, signalKey) {
  if (!SIGNAL_VIEWER_SIGNALS.some(signal => signal.key === signalKey)) {
    return;
  }

  viewer.dataset.currentSignal = signalKey;
  renderSignalViewer(viewer);
}

function setupSignalViewer() {
  const viewers = document.querySelectorAll('.signal-viewer');
  if (viewers.length === 0) {
    return;
  }

  viewers.forEach(viewer => {
    ensureSignalViewerState(viewer);
    renderSignalViewer(viewer);
  });
}

function setupBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) {
    return;
  }

  const toggleVisibility = () => {
    const isVisible = window.pageYOffset > 300;
    button.classList.toggle('visible', isVisible);
  };

  window.addEventListener('scroll', toggleVisibility);
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleVisibility();
}
