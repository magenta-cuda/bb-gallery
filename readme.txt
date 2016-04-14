=== Backbone Bootstrap Gallery ===
Contributors: Magenta Cuda
Tags: gallery, shortcode, lightbox, slideshow, responsive, plug-compatible, replacement
Requires at least: 4.4
Tested up to: 4.5
Stable tag: 1.5.5
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
= Why is the page loading slowly? =
BB Gallery can preload full size images for better user interactivity.
This does not work well for low bandwidth and/or slow cpus.
You can set the bandwidth option to "low" to prevent preloading and force the use of low resolution images.

= Where is the documentation? =
https://bbfgallery.wordpress.com/

== Screenshots ==
1. Gallery View
2. Carousel View
3. Tabs View
4. Dense View
5. Overlay of a Selected Image
6. User Options Pane
7. Mobile Portrait View
8. Search Results
9. Settings

== Changelog ==

= 1.5.5 =

* use the WordPress REST API if available - no new features just a more modern implementation

= 1.5.3.1.1 =

* compatible with WordPress 4.5-RC1
* added language support
* more integration with jQuery Mobile

= 1.5.3.1 =

* replaced the Bootstrap carousel indicators with a jQuery mobile slider which is much more mobile friendly

= 1.5.3 =

* added support for mobile features: swipe, orientation change, ...
* fix overlay bug on old Internet Explorer
* add pause control to carousel

= 1.5.2.1 =
* various enhancements, bug fixes and improvements to code quality

= 1.5.2 =
* support history for multi-part search results

= 1.5.1 =
* support multi-part search results
* css tweaks

= 1.5 =
* search added
* enhancements for mobile

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

= 1.5.5 =

* use the WordPress REST API if available - no new features just a more modern implementation

= 1.5.3.1.1 =

* compatible with WordPress 4.5-RC1
* added language support
* more integration with jQuery Mobile

= 1.5.3.1 =

* replaced the Bootstrap carousel indicators with a jQuery mobile slider which is much more mobile friendly

= 1.5.3 =

* added support for mobile features: swipe, orientation change, ...
* fix overlay bug on old Internet Explorer
* add pause control to carousel

= 1.5.2.1 =
* various enhancements, bug fixes and improvements to code quality

= 1.5.2 =
* support history for multi-part search results

= 1.5.1 =
* support multi-part search results
* css tweaks

= 1.5 =
* search added
* enhancements for mobile

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

