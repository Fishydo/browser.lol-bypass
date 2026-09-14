(() => {
  'use strict';

  const FORM_SELECTOR = 'form.p-6.pt-8.space-y-8';

  const getForm = () =>
    document.querySelector(FORM_SELECTOR) ||
    document.querySelector('form');

  const hide = el => {
    if (!el || el === document.documentElement || el === document.body) return;
    el.dataset.uiHiddenByScript = 'true';
    el.style.setProperty('display', 'none', 'important');
  };

  function clean() {
    const form = getForm();
    if (!form) return;

    const keep = new Set();
    let node = form;

    while (node) {
      keep.add(node);
      node = node.parentElement;
    }

    [...document.body.children].forEach(child => {
      if (!keep.has(child) && !child.contains(form)) {
        hide(child);
      }
    });

    let current = form;

    while (current && current !== document.body) {
      [...current.parentElement.children].forEach(sibling => {
        if (sibling !== current && !sibling.contains(form)) {
          hide(sibling);
        }
      });

      current = current.parentElement;
    }

    // Hide browsers requiring Sign in
    form.querySelectorAll('button[type="button"]').forEach(button => {
      const signIn = [...button.querySelectorAll('span')]
        .some(span =>
          span.textContent.trim().toLowerCase() === 'sign in'
        );

      if (signIn) hide(button);
    });

    // Hide Location Premium
    form.querySelectorAll('button[type="button"]').forEach(button => {
      const text = button.textContent
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (
        text.includes('location') &&
        text.includes('premium')
      ) {
        const section = button.closest('.w-full');
        if (section) hide(section);
      }
    });

    // Hide Advanced Settings
    form.querySelectorAll('button[type="button"]').forEach(button => {
      const text = button.textContent
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

      if (text.includes('advanced settings')) {
        const section = button.closest('.w-full');
        if (section) hide(section);
      }
    });

    // Keep Launch Browser functional
    const launch = form.querySelector('button[type="submit"]');

    if (launch) {
      launch.style.removeProperty('display');
      launch.style.removeProperty('visibility');
      launch.style.setProperty(
        'pointer-events',
        'auto',
        'important'
      );
    }

    form.style.display = 'block';
    form.style.visibility = 'visible';
    form.style.opacity = '1';
    form.style.height = 'auto';
    form.style.width = '100%';

    document.body.style.margin = '0';
  }

  clean();

  let queued = false;

  const observer = new MutationObserver(() => {
    if (queued) return;

    queued = true;

    requestAnimationFrame(() => {
      queued = false;
      clean();
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.browserUICleaner = {
    clean,

    stop() {
      observer.disconnect();
      console.log('UI cleaner stopped.');
    }
  };

  console.log(
    '%cDone — only the browser form is visible.',
    'color:#22c55e;font-weight:bold'
  );
})();
