<?php
/**
 * Plugin Name: CodeMonkey Document Repository
 * Plugin URI: https://codemonkey.co.uk/plugins/document-repository
 * Description: Simple document repository with direct media selection in Gutenberg blocks and shortcodes for easy file downloads.
 * Version: 0.5.0
 * Author: Simon Rundell for CodeMonkey Ltd
 * Author URI: https://codemonkey.co.uk
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: document-repo
 * Domain Path: /languages
 * Requires at least: 5.0
 * Tested up to: 6.3
 * Requires PHP: 7.4
 * Network: false
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Define plugin constants
define( 'DOCUMENT_REPO_VERSION', '0.5.0' );
define( 'DOCUMENT_REPO_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'DOCUMENT_REPO_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

// Helper function to get document data from attachment IDs
function dr_get_documents_data($doc_ids) {
    $doc_data = [];
    if (!is_array($doc_ids)) {
        $doc_ids = array_filter(array_map('intval', explode(',', $doc_ids)));
    }
    
    foreach ($doc_ids as $doc_id) {
        $doc = get_post($doc_id);
        if ($doc && $doc->post_type === 'attachment') {
            $doc_data[] = [
                'id' => $doc->ID,
                'title' => $doc->post_title ?: $doc->post_name,
                'url' => wp_get_attachment_url($doc->ID)
            ];
        }
    }
    
    return $doc_data;
}

// Helper function to get file type from extension
function dr_get_file_type($ext) {
    $map = array(
        'pdf' => 'pdf',
        'doc' => 'word',
        'docx' => 'word',
        'xls' => 'excel',
        'xlsx' => 'excel',
        'ppt' => 'powerpoint',
        'pptx' => 'powerpoint',
        'png' => 'image',
        'jpg' => 'image',
        'jpeg' => 'image',
        'gif' => 'image',
        'ipynb' => 'jupyter'
    );
    return isset($map[$ext]) ? $map[$ext] : 'file';
}

// Helper function to get icon class for file type
function dr_get_icon_class($type) {
    $icons = array(
        'pdf' => 'fa-file-pdf',
        'word' => 'fa-file-word',
        'excel' => 'fa-file-excel',
        'powerpoint' => 'fa-file-powerpoint',
        'image' => 'fa-file-image',
        'jupyter' => 'fa-python', // Note: Python icon is in brands, handled in template
        'file' => 'fa-file'
    );
    return isset($icons[$type]) ? $icons[$type] : 'fa-file';
}

// Renders a single document <li>: image thumbnail (falls back to icon if no
// generated thumbnail exists yet) or file-type icon, plus an extension badge.
function dr_render_doc_item($doc) {
    $ext = strtolower(pathinfo($doc['url'], PATHINFO_EXTENSION));
    $type = dr_get_file_type($ext);

    $thumb = ($type === 'image' && !empty($doc['id'])) ? wp_get_attachment_image_src($doc['id'], 'medium') : false;

    $item = '<li class="dr-doc dr-doc-' . esc_attr($type) . '">';

    if ($thumb) {
        $item .= '<span class="dr-thumb-wrap"><img src="' . esc_url($thumb[0]) . '" width="' . esc_attr($thumb[1]) . '" height="' . esc_attr($thumb[2]) . '" alt="' . esc_attr($doc['title']) . '" class="dr-thumbnail" loading="lazy"></span>';
    } else {
        $icon_class = dr_get_icon_class($type);
        $icon_prefix = ($type === 'jupyter') ? 'fa-brands' : 'fa-solid';
        $item .= '<i class="dr-icon ' . esc_attr($icon_prefix) . ' ' . esc_attr($icon_class) . '"></i>';
    }

    $item .= '<a href="' . esc_url($doc['url']) . '" download>' . esc_html($doc['title']) . '</a>';

    if ($ext) {
        $item .= '<span class="dr-ext-badge">' . esc_html(strtoupper($ext)) . '</span>';
    }

    $item .= '</li>';
    return $item;
}

// Renders the shared "<div><h3>...</h3><ul>...</ul></div>" markup used by
// both the [documents] shortcode and the Gutenberg block's server render.
function dr_render_documents_html($doc_data, $title, $wrapper_class) {
    $output = '<div class="' . esc_attr($wrapper_class) . '">';
    $output .= '<h3>' . esc_html($title) . '</h3>';
    $output .= '<ul class="dr-doc-list">';

    foreach ($doc_data as $doc) {
        $output .= dr_render_doc_item($doc);
    }

    $output .= '</ul>';
    $output .= '</div>';
    return $output;
}

// Register "Record" custom post type
function dr_register_record_cpt() {
    register_post_type( 'record', array(
        'label' => 'Documents',
        'public' => true,
        'supports' => ['title', 'editor'],
        'show_in_rest' => true,
    ));
}
add_action( 'init', 'dr_register_record_cpt' );

// Add Meta Box for selecting documents
function dr_add_meta_box() {
    add_meta_box( 'dr_docs', 'Attached Documents', 'dr_meta_box_callback', 'record', 'normal', 'default' );
}
add_action( 'add_meta_boxes', 'dr_add_meta_box' );

function dr_meta_box_callback($post) {
    $docs = get_post_meta($post->ID, '_dr_docs', true);
    $docs = $docs ? explode(',', $docs) : [];
    ?>
    <div id="dr-docs-meta-box">
        <ul id="dr-docs-list">
            <?php foreach ($docs as $doc_id):
                $doc = get_post($doc_id);
                if ($doc && $doc->post_type === 'attachment'): ?>
                    <li data-id="<?php echo esc_attr($doc->ID); ?>">
                        <?php echo esc_html($doc->post_title); ?>
                        <button class="dr-remove-doc">×</button>
                    </li>
                <?php endif; 
            endforeach; ?>
        </ul>
        <input type="hidden" id="dr_docs" name="dr_docs" value="<?php echo esc_attr(implode(',', $docs)); ?>">
        <button type="button" class="button" id="dr-add-docs">Add Documents</button>
    </div>
    <?php
}

function dr_save_meta($post_id) {
    if (isset($_POST['dr_docs'])) {
        update_post_meta($post_id, '_dr_docs', sanitize_text_field($_POST['dr_docs']));
    }
}
add_action('save_post', 'dr_save_meta');

// Load admin script
function dr_admin_scripts($hook) {
    global $post;
    
    // Load Font Awesome in admin for block editor
    wp_enqueue_style(
        'font-awesome-admin',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        [],
        '6.4.0'
    );
    
    if (($hook === 'post-new.php' || $hook === 'post.php') && $post && $post->post_type === 'record') {
        wp_enqueue_media();
        wp_enqueue_script(
            'dr-admin',
            plugins_url('admin.js', __FILE__),
            ['jquery'],
            filemtime(plugin_dir_path(__FILE__) . 'admin.js'),
            true
        );
    }
}
add_action('admin_enqueue_scripts', 'dr_admin_scripts');

// Enqueue Font Awesome for frontend display
function dr_frontend_styles() {
    wp_enqueue_style(
        'font-awesome',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        [],
        '6.4.0'
    );
}
add_action('wp_enqueue_scripts', 'dr_frontend_styles');

// Shortcode [document_record id="123"] - for record-based documents
function dr_shortcode($atts) {
    $atts = shortcode_atts(['id' => 0], $atts, 'document_record');
    $post_id = intval($atts['id']);
    if (!$post_id) return 'No record specified';

    wp_enqueue_script(
        'dr-frontend',
        plugins_url('frontend.js', __FILE__),
        ['wp-element'],
        filemtime(plugin_dir_path(__FILE__) . 'frontend.js'),
        true
    );

    wp_enqueue_style(
        'dr-frontend-style',
        plugins_url('style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );

    $docs = get_post_meta($post_id, '_dr_docs', true);
    $doc_data = dr_get_documents_data($docs);

    wp_localize_script('dr-frontend', 'drData', $doc_data);

    return '<div id="dr-app"></div>';
}
add_shortcode('document_record', 'dr_shortcode');

// Shortcode [documents ids="123,456,789" title="My Documents"] - for direct document IDs
function dr_documents_shortcode($atts) {
    $atts = shortcode_atts([
        'ids' => '',
        'title' => 'Documents'
    ], $atts, 'documents');
    
    if (empty($atts['ids'])) return 'No documents specified';
    
    $doc_data = dr_get_documents_data($atts['ids']);
    if (empty($doc_data)) return 'No valid documents found';

    wp_enqueue_style(
        'dr-frontend-style',
        plugins_url('style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );

    return dr_render_documents_html($doc_data, $atts['title'], 'dr-document-shortcode');
}
add_shortcode('documents', 'dr_documents_shortcode');

// Register Gutenberg Block
function dr_register_block() {
    wp_register_script(
        'dr-block',
        plugins_url('block.js', __FILE__),
        ['wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-data'],
        filemtime(plugin_dir_path(__FILE__) . 'block.js')
    );

    wp_register_style(
        'dr-block-style',
        plugins_url('style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );

    register_block_type('document-repo/document-block', array(
        'editor_script' => 'dr-block',
        'style' => 'dr-block-style',
        'editor_style' => 'dr-block-style',
        'render_callback' => 'dr_render_block',
        'attributes' => array(
            'documents' => array(
                'type' => 'array',
                'default' => [],
                'items' => array(
                    'type' => 'object',
                    'properties' => array(
                        'id' => array('type' => 'number'),
                        'title' => array('type' => 'string'),
                        'url' => array('type' => 'string'),
                    ),
                ),
            ),
            'title' => array(
                'type' => 'string',
                'default' => 'Documents',
            ),
        ),
    ));
}
add_action('init', 'dr_register_block');

function dr_render_block($attributes) {
    $documents = isset($attributes['documents']) ? $attributes['documents'] : [];
    $title = isset($attributes['title']) ? $attributes['title'] : 'Documents';
    
    if (empty($documents)) {
        return '<p>No documents selected.</p>';
    }

    wp_enqueue_style(
        'dr-frontend-style',
        plugins_url('style.css', __FILE__),
        [],
        filemtime(plugin_dir_path(__FILE__) . 'style.css')
    );

    return dr_render_documents_html($documents, $title, 'dr-document-block');
}
