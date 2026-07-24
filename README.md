# CodeMonkey Document Repository Plugin

A WordPress plugin for creating simple document repositories with direct media library integration.

## Features

- **Gutenberg Block**: Select documents directly from media library
- **Shortcodes**: Two types of shortcodes for different use cases
- **Custom Post Type**: "Record" post type for organized document collections
- **File Icons**: Automatic file type icons (PDF, Word, Excel, PowerPoint, images, etc.)
- **Image Thumbnails**: Image files show a real thumbnail preview instead of an icon, with a hover-to-zoom close-up
- **Extension Badges**: Every document shows a colour-coded file extension badge (PDF, DOCX, PNG, etc.)
- **Responsive Design**: Mobile-friendly document lists

## Usage

### Gutenberg Block
1. Add the "CodeMonkey Document Repository" block to your post/page
2. Click "Select Documents" to choose files from the media library
3. Customize the block title in the sidebar settings
4. Documents will display with appropriate icons and download links

### Shortcodes

#### Direct Document IDs
```
[documents ids="123,456,789" title="My Documents"]
```
- `ids`: Comma-separated list of attachment IDs
- `title`: Optional title for the document list (default: "Documents")

#### Record-based (Legacy)
```
[document_record id="123"]
```
- `id`: ID of a "Record" post type with attached documents

### Custom Post Type
The plugin creates a "Documents" post type (`record`) where you can:
1. Create a new record
2. Use the "Attached Documents" meta box to select files
3. Reference the record via shortcode

## File Types Supported

The plugin automatically detects and displays appropriate icons for:
- PDF files
- Microsoft Word documents (.doc, .docx)
- Microsoft Excel spreadsheets (.xls, .xlsx, .xlsm)
- Microsoft PowerPoint presentations (.ppt, .pptx)
- Images (.png, .jpg, .jpeg, .gif) - shown as a thumbnail preview rather than an icon
- Jupyter Notebooks (.ipynb)
- Generic files (fallback icon)

Every document also shows a colour-coded extension badge next to its filename (e.g. `PDF`, `DOCX`, `PNG`), matching the icon/thumbnail colour for that file type.

## Image Previews

Image files display a real thumbnail (WordPress's "medium" image size) instead of a generic icon, so visitors can see what the file is before downloading it. Hovering over a thumbnail scales it up in place for a closer look - this is a CSS-only zoom effect with no JavaScript, and it doesn't change the download behaviour of the filename link. If a site hasn't generated the "medium" size for an older upload yet, the plugin falls back to the standard image icon.

## Installation

1. Upload the plugin files to `/wp-content/plugins/document-repo/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Start using the Gutenberg block or shortcodes

## Troubleshooting

### Icons Not Showing
- The plugin automatically loads Font Awesome 6.4.0 from CDN
- If icons don't appear, check if another plugin/theme is conflicting
- Icons are loaded in both frontend and admin areas

### Documents Not Rendering
- Ensure attachment IDs are valid and files exist in media library
- Check browser console for JavaScript errors
- Verify Font Awesome CSS is loading properly

## Changelog

### Version 0.5.0
- Image files now display a real thumbnail preview (WordPress "medium" image size) instead of a generic icon
- Added a hover-to-zoom close-up preview on image thumbnails (CSS only, no click behaviour change)
- Every document now shows a colour-coded file extension badge next to its filename
- Shared rendering logic between the block and the `[documents]` shortcode to keep both in sync

### Version 0.4.1
- Fixed frontend rendering issues
- Improved Font Awesome icon loading
- Added direct HTML rendering (no JavaScript dependency)
- Enhanced icon display in block editor
- Better error handling for missing files

### Version 0.4.0
- Added direct media library selection in Gutenberg block
- Introduced new `[documents]` shortcode for direct attachment IDs
- Improved styling and responsive design
- Added Font Awesome integration for file icons
- Enhanced block editor interface

### Version 0.3.0
- Initial version with Record post type and basic Gutenberg block