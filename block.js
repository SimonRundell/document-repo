const { registerBlockType } = wp.blocks;
const { createElement, useState } = wp.element;
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
                'png': 'image', 'jpg': 'image', 'jpeg': 'image', 'gif': 'image',
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
                        { className: 'dr-doc-list dr-editor-list' },
                        documents.map(doc => {
                            const ext = getFileExtension(doc.url);
                            const type = getFileType(ext);
                            const iconClass = getIconClass(type);
                            const iconPrefix = getIconPrefix(type);
                            
                            return createElement(
                                'li',
                                { 
                                    key: doc.id, 
                                    className: `dr-doc dr-doc-${type}`,
                                    style: { position: 'relative' }
                                },
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
