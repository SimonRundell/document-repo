<?php
/**
 * Uninstall CodeMonkey Document Repository Plugin
 *
 * This file is executed when the plugin is uninstalled via the WordPress admin.
 * It removes all plugin data from the database.
 */

// If uninstall not called from WordPress, exit
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

// Delete plugin options
delete_option( 'document_repo_version' );

// Delete any transients
delete_transient( 'document_repo_cache' );

// Get all posts of the custom post type 'record'
$records = get_posts( array(
    'post_type' => 'record',
    'numberposts' => -1,
    'post_status' => 'any'
) );

// Delete all record posts and their meta data
foreach ( $records as $record ) {
    // Delete all post meta
    delete_post_meta( $record->ID, '_dr_docs' );
    
    // Delete the post
    wp_delete_post( $record->ID, true );
}

// Clear any cached data that has been removed
wp_cache_flush();

// Optional: Remove custom post type from database (WordPress will handle this automatically)
// but we can clean up any remaining traces
global $wpdb;

// Clean up any orphaned post meta
$wpdb->query( "DELETE FROM {$wpdb->postmeta} WHERE meta_key = '_dr_docs'" );

// Clean up any orphaned term relationships for the custom post type
$wpdb->query( 
    $wpdb->prepare( 
        "DELETE tr FROM {$wpdb->term_relationships} tr
         LEFT JOIN {$wpdb->posts} p ON tr.object_id = p.ID
         WHERE p.ID IS NULL OR p.post_type = %s",
        'record'
    )
);