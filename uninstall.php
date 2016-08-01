<?php

if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit();
}

$option_names = [
    'bbg_xiv_flex_min_width',
    'bbg_xiv_flex_min_width_for_caption',
    'bbg_xiv_carousel_interval',
    'bbg_xiv_default_view',
    'bbg_xiv_flex_min_width_for_dense_view',
    'bbg_xiv_flex_number_of_dense_view_columns',
    'bbg_xiv_max_search_results',
    'bbg_xiv_shortcode',
    'bbg_xiv_table',
    'bbg_xiv_use_embedded_carousel',
    'bbg_xiv_use_gallery_tabs',
    'bbg_xiv_use_tiles',
    'bbg_xiv_version',
    'bbg_xiv_wp_rest',
    'bbg_xiv_gallery_menu_1',
    'bbg_xiv_gallery_menu_2',
    'bbg_xiv_gallery_menu_3',
    'bbg_xiv_gallery_menu_4',
    'bbg_xiv_gallery_menu_5'
];

foreach ( $option_names as $option_name ) {
    delete_option( $option_name );
}

?>

