const { createElement, render } = wp.element;

function getFileExtension(url) {
    const parts = url.split('?')[0].split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

function getFileType(ext) {
    const map = {
        'pdf': 'pdf',
        'doc': 'word',
        'docx': 'word',
        'xls': 'excel',
        'xlsx': 'excel',
        'ppt': 'powerpoint',
        'pptx': 'powerpoint',
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'gif': 'image',
        'ipynb': 'jupyter'
    };
    return map[ext] || 'file';
}

function DocumentList({ documents }) {
    if (!documents || documents.length === 0) {
        return createElement('p', null, 'No documents attached.');
    }

    return createElement(
        'ul',
        { className: 'dr-doc-list' },
        documents.map(doc => {
            const ext = getFileExtension(doc.url);
            const type = getFileType(ext);
            const iconClass = {
                'pdf': 'fa-file-pdf',
                'word': 'fa-file-word',
                'excel': 'fa-file-excel',
                'powerpoint': 'fa-file-powerpoint',
                'image': 'fa-file-image',
                'jupyter': 'fa-brands fa-python',
                'file': 'fa-file'
            }[type] || 'fa-file';

            return createElement('li', { key: doc.id, className: `dr-doc dr-doc-${type}` },
                createElement('i', { className: `dr-icon fa-solid ${iconClass}` }),
                createElement('a', { href: doc.url, download: true }, doc.title)
            );
        })
    );
}

document.addEventListener("DOMContentLoaded", function() {
    // Handle legacy shortcode format
    const legacyRoot = document.getElementById('dr-app');
    if (legacyRoot && typeof drData !== 'undefined') {
        render(createElement(DocumentList, { documents: drData }), legacyRoot);
    }

    // Handle new block format - scan for all block containers
    const blockContainers = document.querySelectorAll('[id^="dr-block-"]');
    blockContainers.forEach(container => {
        const blockId = container.id;
        const dataVar = 'drBlockData_' + blockId.replace('-', '_');
        if (window[dataVar]) {
            render(createElement(DocumentList, { documents: window[dataVar].documents }), container);
        }
    });

    // Handle new shortcode format - scan for all shortcode containers
    const shortcodeContainers = document.querySelectorAll('[id^="dr-shortcode-"]');
    shortcodeContainers.forEach(container => {
        const shortcodeId = container.id;
        const dataVar = 'drShortcodeData_' + shortcodeId.replace('-', '_');
        if (window[dataVar]) {
            render(createElement(DocumentList, { documents: window[dataVar].documents }), container);
        }
    });
});
