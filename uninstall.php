<?php

if ( !defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit();
}

$option_names = [
    'bbg_xiv_flex_min_width',
    'bbg_xiv_flex_min_width_for_caption',
    'bbg_xiv_carousel_interval',
    'bbg_xiv_flex_min_width_for_dense_view',
    'bbg_xiv_flex_number_of_dense_view_columns',
    'bbg_xiv_shortcode',
    'bbg_xiv_table'
];

foreach ( $option_names as $option_name ) {
    delete_option( $option_name );
}

?>

