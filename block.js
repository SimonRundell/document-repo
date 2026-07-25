const { registerBlockType } = wp.blocks;
const { createElement, useState, useRef } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button, TextControl, Placeholder } = wp.components;

registerBlockType('document-repo/document-block', {
    title: 'CodeMonkey Document Repository',
    icon: 'portfolio',
    category: 'widgets',
    attributes: {
        documents: { 
            type: 'array', 
            default: [],
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    url: { type: 'string' }
                }
            }
        },
        title: { type: 'string', default: 'Documents' },
    },

    edit: (props) => {
        const { attributes: { documents, title }, setAttributes } = props;
        const [mediaFrame, setMediaFrame] = useState(null);
        const [dragIndex, setDragIndex] = useState(null);
        const [overIndex, setOverIndex] = useState(null);
        const listRef = useRef(null);

        const openMediaLibrary = () => {
            let frame;
            
            if (mediaFrame) {
                frame = mediaFrame;
            } else {
                frame = wp.media({
                    title: 'Select Documents',
                    button: { text: 'Select Documents' },
                    multiple: true,
                    library: { type: null } // Allow all file types
                });

                frame.on('select', function() {
                    const attachments = frame.state().get('selection').toJSON();
                    const newDocuments = attachments.map(att => ({
                        id: att.id,
                        title: att.title || att.filename,
                        url: att.url
                    }));
                    setAttributes({ documents: newDocuments });
                });

                setMediaFrame(frame);
            }

            frame.open();
        };

        const removeDocument = (docId) => {
            const updatedDocs = documents.filter(doc => doc.id !== docId);
            setAttributes({ documents: updatedDocs });
        };

        const moveDocument = (fromIndex, toIndex) => {
            if (fromIndex === toIndex || fromIndex == null || toIndex == null) return;
            const updatedDocs = documents.slice();
            const [moved] = updatedDocs.splice(fromIndex, 1);
            updatedDocs.splice(toIndex, 0, moved);
            setAttributes({ documents: updatedDocs });
        };

        // The block editor canvas renders inside an iframe, which breaks native
        // HTML5 drag-and-drop in inconsistent, browser-dependent ways. Gutenberg's
        // own block reordering sidesteps this by tracking the pointer manually
        // instead of relying on dragstart/dragover/drop - this does the same.
        const handleDragHandleMouseDown = (index) => (e) => {
            if (e.button !== 0) return; // left click only
            e.preventDefault();

            const container = listRef.current;
            if (!container) return;

            const ownerWindow = container.ownerDocument.defaultView || window;
            let currentOverIndex = index;

            setDragIndex(index);
            setOverIndex(index);

            const onMouseMove = (moveEvent) => {
                const items = Array.from(container.children);
                let newIndex = items.length - 1;
                for (let i = 0; i < items.length; i++) {
                    const rect = items[i].getBoundingClientRect();
                    if (moveEvent.clientY < rect.top + rect.height / 2) {
                        newIndex = i;
                        break;
                    }
                }
                if (newIndex !== currentOverIndex) {
                    currentOverIndex = newIndex;
                    setOverIndex(newIndex);
                }
            };

            const onMouseUp = () => {
                moveDocument(index, currentOverIndex);
                setDragIndex(null);
                setOverIndex(null);
                ownerWindow.removeEventListener('mousemove', onMouseMove);
                ownerWindow.removeEventListener('mouseup', onMouseUp);
            };

            ownerWindow.addEventListener('mousemove', onMouseMove);
            ownerWindow.addEventListener('mouseup', onMouseUp);
        };

        const getFileExtension = (url) => {
            const parts = url.split('?')[0].split('.');
            return parts.length > 1 ? parts.pop().toLowerCase() : '';
        };

        const getFileType = (ext) => {
            const map = {
                'pdf': 'pdf',
                'doc': 'word', 'docx': 'word',
                'xls': 'excel', 'xlsx': 'excel',
                'ppt': 'powerpoint', 'pptx': 'powerpoint',
                'png': 'image', 'jpg': 'image', 'jpeg': 'image', 'gif': 'image', 'webp': 'image',
                'ipynb': 'jupyter'
            };
            return map[ext] || 'file';
        };

        const getIconClass = (type) => {
            const icons = {
                'pdf': 'fa-file-pdf',
                'word': 'fa-file-word',
                'excel': 'fa-file-excel',
                'powerpoint': 'fa-file-powerpoint',
                'image': 'fa-file-image',
                'jupyter': 'fa-python',
                'file': 'fa-file'
            };
            return icons[type] || 'fa-file';
        };

        const getIconPrefix = (type) => {
            return type === 'jupyter' ? 'fa-brands' : 'fa-solid';
        };

        return createElement(
            'div',
            { className: 'dr-block-editor' },
            createElement(
                InspectorControls,
                null,
                createElement(
                    PanelBody,
                    { title: 'Document Settings', initialOpen: true },
                    createElement(TextControl, {
                        label: 'Block Title',
                        value: title,
                        onChange: (value) => setAttributes({ title: value })
                    }),
                    createElement(Button, {
                        isPrimary: true,
                        onClick: openMediaLibrary,
                        style: { marginTop: '10px' }
                    }, 'Select Documents'),
                    documents.length > 0 && createElement(Button, {
                        isDestructive: true,
                        onClick: () => setAttributes({ documents: [] }),
                        style: { marginTop: '10px', marginLeft: '10px' }
                    }, 'Clear All')
                )
            ),
            documents.length === 0 ? 
                createElement(
                    Placeholder,
                    { 
                        icon: 'portfolio',
                        label: 'CodeMonkey Document Repository',
                        instructions: 'Select documents from your media library to display.'
                    },
                    createElement(Button, {
                        isPrimary: true,
                        onClick: openMediaLibrary
                    }, 'Select Documents')
                ) :
                createElement(
                    'div',
                    { className: 'dr-document-block' },
                    createElement('h3', { style: { marginBottom: '15px' } }, title),
                    createElement(
                        'ul',
                        { className: 'dr-doc-list dr-editor-list', ref: listRef },
                        documents.map((doc, index) => {
                            const ext = getFileExtension(doc.url);
                            const type = getFileType(ext);
                            const iconClass = getIconClass(type);
                            const iconPrefix = getIconPrefix(type);
                            const isDragging = dragIndex === index;
                            const isOver = overIndex === index && dragIndex !== null && dragIndex !== index;

                            return createElement(
                                'li',
                                {
                                    key: doc.id,
                                    className: `dr-doc dr-doc-${type}${isDragging ? ' dr-doc-dragging' : ''}${isOver ? ' dr-doc-drag-over' : ''}`,
                                    style: { position: 'relative' }
                                },
                                createElement('i', {
                                    className: 'dr-drag-handle fa-solid fa-grip-vertical',
                                    style: { marginRight: '8px', cursor: 'grab', color: '#999', touchAction: 'none' },
                                    onMouseDown: handleDragHandleMouseDown(index)
                                }),
                                createElement('i', {
                                    className: `dr-icon ${iconPrefix} ${iconClass}`,
                                    style: { marginRight: '8px' }
                                }),
                                createElement('span', null, doc.title),
                                createElement(Button, {
                                    isSmall: true,
                                    isDestructive: true,
                                    onClick: () => removeDocument(doc.id),
                                    style: {
                                        marginLeft: 'auto',
                                        minWidth: '24px',
                                        height: '24px',
                                        padding: '0'
                                    }
                                }, '×')
                            );
                        })
                    )
                )
        );
    },

    save: () => null, // Render handled by PHP
});
