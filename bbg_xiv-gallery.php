<?php

/*
Plugin Name: BB Gallery
Plugin URI: https://bbfgallery.wordpress.com/
Description: Gallery using Backbone.js, Bootstrap 3 and CSS3 Flexbox
Version: 1.0
Author: Magenta Cuda
Author URI: https://profiles.wordpress.org/magenta-cuda/
License: GPL2
*/

/*
    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License
    as published by the Free Software Foundation; either version 2
    of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

    Copyright 2015  Magenta Cuda
*/

# This is a plug compatible replacement for the built-in WordPress gallery shortcode.
# It uses user definable Backbone.js templates styled with a Twitter Bootstrap stylesheets.
# The user definable templates are in the file ".../js/bbg_xiv-gallery_templates.php".

add_action( 'wp_loaded', function( ) {
    remove_shortcode( 'gallery' );
    add_shortcode( 'gallery', 'bb_gallery_shortcode' );
} );

# excerpted from the WordPress function gallery_shortcode() of .../wp-includes/media.php

function bb_gallery_shortcode( $attr ) {
    require_once(  dirname( __FILE__ ) . '/bbg_xiv-gallery_templates.php' );

    $post = get_post();

    static $instance = 0;
    $instance++;
    static $bbg_xiv_data = [
        'version' => '1.0'
    ];

    if ( ! empty( $attr['ids'] ) ) {
      // 'ids' is explicitly ordered, unless you specify otherwise.
      if ( empty( $attr['orderby'] ) ) {
        $attr['orderby'] = 'post__in';
      }
      $attr['include'] = $attr['ids'];
    }

    /**
     * Filter the default gallery shortcode output.
     *
     * If the filtered output isn't empty, it will be used instead of generating
     * the default gallery template.
     *
     * @since 2.5.0
     * @since 4.2.0 The `$instance` parameter was added.
     *
     * @see gallery_shortcode()
     *
     * @param string $output   The gallery output. Default empty.
     * @param array  $attr     Attributes of the gallery shortcode.
     * @param int    $instance Unique numeric ID of this gallery shortcode instance.
     */

    $output = apply_filters( 'post_gallery', '', $attr, $instance );
    if ( $output != '' ) {
      return $output;
    }

    $atts = shortcode_atts( array(
      'order'      => 'ASC',
      'orderby'    => 'menu_order ID',
      'id'         => $post ? $post->ID : 0,
      'size'       => 'thumbnail',
      'include'    => '',
      'exclude'    => '',
      'link'       => ''
    ), $attr, 'gallery' );

    $id = intval( $atts['id'] );

    if ( ! empty( $atts['include'] ) ) {
      $_attachments = get_posts( array( 'include' => $atts['include'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );

      $attachments = array();
      foreach ( $_attachments as $key => $val ) {
        $attachments[$val->ID] = $_attachments[$key];
      }
    } elseif ( ! empty( $atts['exclude'] ) ) {
      $attachments = get_children( array( 'post_parent' => $id, 'exclude' => $atts['exclude'], 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
    } else {
      $attachments = get_children( array( 'post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $atts['order'], 'orderby' => $atts['orderby'] ) );
    }

    if ( empty( $attachments ) ) {
      return '';
    }

    if ( is_feed() ) {
      $output = "\n";
      foreach ( $attachments as $att_id => $attachment ) {
        $output .= wp_get_attachment_link( $att_id, $atts['size'], true ) . "\n";
      }
      return $output;
    }

    $float = is_rtl() ? 'right' : 'left';

    $selector = "gallery-{$instance}";

    $size_class = sanitize_html_class( $atts['size'] );
    
    $output = <<<EOD
<div class="bbg_xiv-bootstrap">
    <nav role="navigation" class="navbar navbar-inverse">
        <div class="navbar-header">
            <button type="button" data-target="#$selector-navbarCollapse" data-toggle="collapse" class="navbar-toggle">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
        </div>
        <div id="$selector-navbarCollapse" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Gallery</a></li>
                <li><a href="#">Carousel</a></li>
                <li><a href="#">Tabs</a></li>
                <!-- TODO: You may want to comment out the "Table" view for production environments. -->
                <li><a href="#">Table</a></li>
            </ul>
        </div>
    </nav>
</div>
EOD;

    $output .= "<div id='$selector' class='gallery galleryid-{$id} gallery-size-{$size_class} bbg_xiv-bootstrap'>BB Gallery Container</div>";

    foreach ( $attachments as $id => &$attachment ) {
        $src = wp_get_attachment_image_src( $id, 'full' );
        $img_url = wp_get_attachment_url($id);
        error_log( '$img_url=' . print_r( $img_url, true ) );
        $attachment->url = $img_url;
        $meta = wp_get_attachment_metadata($id);
        error_log( '$meta=' . print_r( $meta, true ) );
        $attachment->width  = $meta[ 'width'  ];
        $attachment->height = $meta[ 'height' ];
        $attr = ( trim( $attachment->post_excerpt ) ) ? array( 'aria-describedby' => "$selector-$id" ) : '';
        if ( ! empty( $atts['link'] ) && 'file' === $atts['link'] ) {
          $attachment->link = wp_get_attachment_url( $id );
        } elseif ( ! empty( $atts['link'] ) && 'none' === $atts['link'] ) {
          $attachment->link = '';
        } else {
          $attachment->link = get_attachment_link( $id );
        }
        # TODO: For the "Table" view you may want to unset some fields.
        unset( $attachment->post_password );
        error_log( '$attachment=' . print_r( $attachment, true ) );

        $image_meta  = wp_get_attachment_metadata( $id );
        $orientation = '';
        if ( isset( $image_meta['height'], $image_meta['width'] ) ) {
          $orientation = ( $image_meta['height'] > $image_meta['width'] ) ? 'portrait' : 'landscape';
        }
    }
    $bbg_xiv_data[ "$selector-data" ] = json_encode( array_values( $attachments ) );
    wp_localize_script( 'bbg_xiv-gallery', 'bbg_xiv', $bbg_xiv_data );
    return $output;
}

add_action( 'wp_enqueue_scripts', function( ) {
    wp_enqueue_style( 'bootstrap', plugins_url( '/css/bootstrap.css' , __FILE__ ) );
    wp_enqueue_style( 'bbg_xiv-gallery', plugins_url( '/css/bbg_xiv-gallery.css' , __FILE__ ), [ 'bootstrap' ] );
    wp_enqueue_script( 'backbone' );
    wp_enqueue_script( 'modernizr', plugins_url( '/js/modernizr.js' , __FILE__ ) );
    wp_enqueue_script( 'bootstrap', plugins_url( '/js/bootstrap.js' , __FILE__ ), [ 'jquery' ], FALSE, TRUE );
    wp_enqueue_script( 'bbg_xiv-gallery', plugins_url( '/js/bbg_xiv-gallery.js' , __FILE__ ), [ 'bootstrap' ], FALSE, TRUE );
} );

?>