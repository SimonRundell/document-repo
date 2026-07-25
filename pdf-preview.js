/**
 * Client-side PDF thumbnail rendering (see dr_pdf_preview_types() in
 * document-repo.php). Renders the first page of each .dr-pdf-canvas into
 * itself using pdf.js, lazily as it scrolls into view. The file-type icon
 * markup already sits behind each canvas and stays visible as a fallback
 * until (or unless) rendering succeeds - see the CSS in style.css.
 */
(function () {
    'use strict';

    var WORKER_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    var RENDER_WIDTH = 200; // px; CSS then scales the canvas down to thumbnail size

    function renderPdfThumbnail(canvas) {
        var url = canvas.getAttribute('data-pdf-url');
        if (!url || !window.pdfjsLib) {
            return;
        }

        window.pdfjsLib.getDocument(url).promise
            .then(function (pdf) {
                return pdf.getPage(1);
            })
            .then(function (page) {
                var unscaledViewport = page.getViewport({ scale: 1 });
                var scale = RENDER_WIDTH / unscaledViewport.width;
                var viewport = page.getViewport({ scale: scale });

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                var ctx = canvas.getContext('2d');
                return page.render({ canvasContext: ctx, viewport: viewport }).promise;
            })
            .then(function () {
                canvas.classList.add('dr-pdf-rendered');
            })
            .catch(function () {
                canvas.classList.add('dr-pdf-render-failed');
            });
    }

    function init() {
        var canvases = document.querySelectorAll('.dr-pdf-canvas');
        if (!canvases.length || !window.pdfjsLib) {
            return;
        }

        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                        renderPdfThumbnail(entry.target);
                    }
                });
            }, { rootMargin: '200px' });

            canvases.forEach(function (canvas) {
                observer.observe(canvas);
            });
        } else {
            canvases.forEach(renderPdfThumbnail);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
