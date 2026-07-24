/**
 * Lazy-loaded preview modal for Word/Excel/PowerPoint documents.
 * Embeds the Microsoft Office Online Viewer in an iframe, built and
 * inserted into the page only on first use. Vanilla JS, no dependencies.
 */
(function () {
    'use strict';

    function getOverlay() {
        var overlay = document.getElementById('dr-preview-overlay');
        if (overlay) {
            return overlay;
        }

        overlay = document.createElement('div');
        overlay.id = 'dr-preview-overlay';
        overlay.className = 'dr-preview-overlay';
        overlay.innerHTML =
            '<div class="dr-preview-modal" role="dialog" aria-modal="true">' +
                '<button type="button" class="dr-preview-close" aria-label="Close preview">&times;</button>' +
                '<div class="dr-preview-title"></div>' +
                '<iframe class="dr-preview-frame" title="Document preview"></iframe>' +
            '</div>';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target.classList.contains('dr-preview-close')) {
                closeModal();
            }
        });

        return overlay;
    }

    function openModal(url, title) {
        var overlay = getOverlay();
        overlay.querySelector('.dr-preview-title').textContent = title || '';
        overlay.querySelector('.dr-preview-frame').src = 'https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url);
        overlay.classList.add('is-open');
    }

    function closeModal() {
        var overlay = document.getElementById('dr-preview-overlay');
        if (!overlay) {
            return;
        }
        overlay.classList.remove('is-open');
        // Clear the src so the embedded document stops loading/playing once closed.
        overlay.querySelector('.dr-preview-frame').src = '';
    }

    document.addEventListener('click', function (e) {
        var trigger = e.target.closest('.dr-preview-trigger');
        if (!trigger) {
            return;
        }
        e.preventDefault();
        openModal(trigger.getAttribute('data-preview-url'), trigger.getAttribute('data-preview-title'));
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
})();
