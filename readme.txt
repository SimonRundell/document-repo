=== CodeMonkey Document Repository ===
Contributors: codemonkeylimited
Tags: documents, repository, gutenberg, media, download, pdf, files
Requires at least: 5.0
Tested up to: 6.3
Requires PHP: 7.4
Stable tag: 0.5.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Simple document repository plugin with direct media selection in Gutenberg blocks and shortcodes for easy file downloads.

== Description ==

CodeMonkey Document Repository is a WordPress plugin that makes it easy to create organized document collections for download. Perfect for sharing PDFs, Word documents, spreadsheets, presentations, and other files with your website visitors.

**Key Features:**

* **Gutenberg Block Integration** - Select documents directly from your media library
* **Multiple File Types** - Automatic icon detection for PDF, Word, Excel, PowerPoint, images, and more
* **Image Thumbnails** - Image files show a real thumbnail preview instead of an icon, with a hover-to-zoom close-up
* **File Extension Badges** - Every document shows a colour-coded extension badge (PDF, DOCX, PNG, etc.)
* **Two Shortcode Options** - Use direct attachment IDs or record-based collections
* **Responsive Design** - Mobile-friendly document lists
* **Custom Post Type** - Organize documents with the "Documents" post type
* **Font Awesome Icons** - Professional file type icons with color coding

**File Types Supported:**
* PDF files (red icon)
* Microsoft Word (.doc, .docx) - blue icon
* Microsoft Excel (.xls, .xlsx) - green icon
* Microsoft PowerPoint (.ppt, .pptx) - orange icon
* Images (.png, .jpg, .jpeg, .gif) - purple, shown as a thumbnail preview rather than an icon
* Jupyter Notebooks (.ipynb) - orange Python icon
* Generic files - gray file icon

**Usage Examples:**

Gutenberg Block:
1. Add "Document Repository" block to your post/page
2. Click "Select Documents" to choose files from media library
3. Customize the block title
4. Documents display with download links and file type icons

Shortcodes:
`[documents ids="123,456,789" title="Download Files"]`
`[document_record id="123"]`

== Installation ==

**Automatic Installation:**
1. Go to Plugins > Add New in your WordPress admin
2. Search for "CodeMonkey Document Repository"
3. Click Install Now and then Activate

**Manual Installation:**
1. Download the plugin ZIP file
2. Go to Plugins > Add New > Upload Plugin
3. Choose the ZIP file and click Install Now
4. Activate the plugin

**From Source:**
1. Upload the `document-repo` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= How do I add documents to my posts? =

You can use either the Gutenberg block called "Document Repository" or the shortcodes `[documents ids="123,456"]` where the numbers are attachment IDs from your media library.

= What file types are supported? =

All file types are supported. The plugin automatically detects common types (PDF, Word, Excel, PowerPoint, images, Jupyter notebooks) and shows appropriate icons, plus a colour-coded extension badge next to every filename.

= Do images show a thumbnail? =

Yes. Image files (.png, .jpg, .jpeg, .gif) show a real thumbnail instead of an icon, using WordPress's own generated "medium" image size. Hovering the thumbnail zooms it in for a closer look before downloading. If a site hasn't yet generated that image size for an older upload, the plugin falls back to the standard image icon.

= Can I customize the appearance? =

Yes! The plugin includes CSS classes for styling. You can override the styles in your theme's CSS file.

= Do I need to install Font Awesome separately? =

No, the plugin automatically loads Font Awesome 6.4.0 from CDN for the file type icons.

= Can I use this with the classic editor? =

Yes, you can use the shortcodes in any editor: `[documents ids="123,456" title="My Files"]`

== Screenshots ==

1. Gutenberg block interface with document selection
2. Frontend display with file type icons
3. Documents custom post type in admin
4. Shortcode examples in editor

== Changelog ==

= 0.5.0 =
* Image files now display a real thumbnail preview (WordPress "medium" image size) instead of a generic icon
* Added a hover-to-zoom close-up preview on image thumbnails (CSS only, no click behaviour change - the filename still downloads as before)
* Every document now shows a colour-coded file extension badge (PDF, DOCX, PNG, etc.) next to its filename
* Shared rendering logic between the block and the [documents] shortcode to keep both in sync

= 0.4.0 =
* Added direct media library selection in Gutenberg block
* Introduced new [documents] shortcode for direct attachment IDs
* Improved styling and responsive design
* Added Font Awesome integration for file icons
* Enhanced block editor interface
* Fixed frontend rendering issues
* Better error handling for missing files

= 0.3.0 =
* Initial version with Record post type and basic Gutenberg block

== Upgrade Notice ==

= 0.5.0 =
Adds image thumbnail previews (with hover-to-zoom) and file extension badges to both the block and shortcode output. No settings changes required.

= 0.4.0 =
Major update with improved Gutenberg block, better file type detection, and enhanced styling. Backup recommended before upgrading.

== Support ==

For support and feature requests, please contact CodeMonkey Ltd or visit our website.

== License ==

This plugin is licensed under the GPL v2 or later.

This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.