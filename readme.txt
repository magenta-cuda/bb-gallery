=== Backbone Bootstrap Gallery ===
Contributors: Magenta Cuda
Tags: gallery, shortcode, lightbox, slideshow, responsive, plug-compatible, replacement
Requires at least: 4.4
Tested up to: 4.4
Stable tag: 1.3.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Responsive plug-compatible replacement for the built-in WordPress gallery shortcode.

== Description ==
This is a plug-compatible replacement for the built-in WordPress gallery shortcode.
It is implemented using a Backbone.js Model-View-Presenter (MVP) styled by a Twitter Bootstrap 3 stylesheet.
Using a MVP allows you to switch instantaneously (i.e. without doing a HTTP request) between multiple views of a gallery.
The default implementation supports a gallery view, carousel (slideshow) view, tabs view and a dense view of the gallery.
The view is styled by a Twitter Bootstrap 3 stylesheet so it is automatically responsive.
If the browser supports the CSS3 Flexbox the gallery view is implemented using a flexbox.
You can easily modify the Backbone templates to create your own customized views of the gallery.
The homepage for this plug-in is [https://bbfgallery.wordpress.com/](https://bbfgallery.wordpress.com/).

== Installation ==
1. Upload the folder "bb-gallery" to the "/wp-content/plugins/" directory.
2. Activate the plugin through the "Plugins" menu in WordPress.
3. Enable the BB Gallery option on the "Settings > Media" page.

== Frequently Asked Questions ==
= Where is the documentation? =
https://bbfgallery.wordpress.com/

== Screenshots ==
1. Gallery View.
2. Carousel View.
3. Tabs View.
4. Dense View.
5. Overlay of a Selected Image.
6. User Options Pane

== Changelog ==

= 1.3.3 =
* fixes for problems with mobile (touch screen, small screen and/or low bandwidth) devices

= 1.3.2 =
* add carousel interval option
* allow front-end to set options (minimum image width, number of columns, carousel interval) and save as a cookie

= 1.3.1 =
* better support for captions
* description now supports shortcodes
* prettify UI

= 1.3 =
* The gallery view and the dense view now support displaying a full viewport overlay of a selected image

= 1.2.1 =
* implement CSS object-fit in JavaScript for Microsoft Edge which does not have the CSS object-fit
* improved tabs view

= 1.2 =
* added dense view

= 1.1 =
* improved flex gallery

= 1.0 =
* Initial release.

== Upgrade Notice ==

= 1.3.3 =
* fixes for problems with mobile (touch screen, small screen and/or low bandwidth) devices

= 1.3.2 =
* add carousel interval option
* allow front-end to set options (minimum image width, number of columns, carousel interval) and save as a cookie

= 1.3.1 =
* better support for captions
* description now supports shortcodes
* prettify UI

= 1.3 =
* The gallery view and the dense view now support displaying a full viewport overlay of a selected image

= 1.2.1 =
* implement CSS object-fit in JavaScript for Microsoft Edge which does not have the CSS object-fit
* improved tabs view

= 1.2 =
* added dense view

= 1.1 =
* improved flex gallery

= 1.0 =
* Initial release.
