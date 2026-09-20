(function () {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    return;
  }

  var image = document.getElementById('lightbox-image');
  var title = document.getElementById('lightbox-title');
  var pdfLink = document.getElementById('lightbox-pdf');
  var closeButton = lightbox.querySelector('.lightbox-close');
  var stage = lightbox.querySelector('.lightbox-stage');
  var lastTrigger = null;

  function open(trigger) {
    lastTrigger = trigger;
    image.src = trigger.getAttribute('data-media-src');
    image.alt = trigger.getAttribute('data-media-alt') || '';
    title.textContent = trigger.getAttribute('data-media-title') || '';

    var pdf = trigger.getAttribute('data-media-pdf');
    if (pdf) {
      pdfLink.href = pdf;
      pdfLink.hidden = false;
    } else {
      pdfLink.removeAttribute('href');
      pdfLink.hidden = true;
    }

    lightbox.hidden = false;
    document.body.classList.add('is-locked');
    stage.classList.remove('is-zoomed');
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
    closeButton.focus();
  }

  function close() {
    if (lightbox.hidden) {
      return;
    }
    lightbox.hidden = true;
    document.body.classList.remove('is-locked');
    image.removeAttribute('src');
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) {
      return;
    }

    var trigger = event.target.closest('.media-trigger');
    if (trigger) {
      event.preventDefault();
      open(trigger);
      return;
    }

    if (lightbox.hidden) {
      return;
    }

    // Tippen auf die Seite zoomt, statt zu schliessen.
    if (event.target === image) {
      stage.classList.toggle('is-zoomed');
      return;
    }

    // X-Button, oder Klick neben den Dialog.
    if (event.target.closest('[data-lightbox-close]')) {
      close();
    } else if (event.target.closest('.lightbox') && !event.target.closest('.lightbox-dialog')) {
      close();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      close();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    var focusable = [];
    lightbox.querySelectorAll('a[href], button').forEach(function (node) {
      if (!node.hidden && node.offsetParent !== null) {
        focusable.push(node);
      }
    });
    if (!focusable.length) {
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
