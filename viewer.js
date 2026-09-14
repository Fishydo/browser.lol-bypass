(() => {
  'use strict';

  function cleanViewer() {
    // Remove premium/unavailable resolutions
    const resolutionSelect =
      document.querySelector('#resolutionPresetSelect');

    if (resolutionSelect) {
      [...resolutionSelect.options].forEach(option => {
        const text = option.textContent.toLowerCase();

        if (
          option.disabled ||
          text.includes('4k') ||
          text.includes('qhd') ||
          text.includes('not available') ||
          text.includes('premium')
        ) {
          option.remove();
        }
      });

      // Remove "-- Select Preset --"
      [...resolutionSelect.options].forEach(option => {
        if (
          option.value === '' &&
          option.textContent.includes('Select Preset')
        ) {
          option.remove();
        }
      });
    }

    // Remove resolution Premium upgrade message
    document
      .querySelectorAll('.resolution-upgrade-note')
      .forEach(element => element.remove());

    // Remove Temp Mail
    document
      .querySelectorAll('.sidebar-section-header')
      .forEach(header => {
        const title = header
          .querySelector('h3')
          ?.textContent
          .trim()
          .toLowerCase();

        if (title === 'temp mail') {
          const section =
            header.closest('.sidebar-section') ||
            header.parentElement;

          section?.remove();
        }
      });

    // Remove Premium Quality setting
    document
      .querySelectorAll('.dev-setting-item')
      .forEach(item => {
        const label = item
          .querySelector('label')
          ?.textContent
          .trim()
          .toLowerCase();

        if (label === 'quality') {
          item.remove();
        }
      });
  }

  // Initial cleanup
  cleanViewer();

  // Reapply if the viewer dynamically re-renders
  let queued = false;

  const observer = new MutationObserver(() => {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      cleanViewer();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.viewerUICleaner = {
    clean: cleanViewer,

    stop() {
      observer.disconnect();
      console.log('[Viewer UI] Cleaner stopped.');
    }
  };

  console.log(
    '%cViewer UI cleaned.',
    'color:#22c55e;font-weight:bold'
  );
})();
