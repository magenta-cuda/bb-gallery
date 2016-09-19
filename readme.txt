=== Backbone Bootstrap Gallery ===
Contributors: Magenta Cuda
Tags: gallery, shortcode, lightbox, slideshow, responsive, plug-compatible, replacement
Requires at least: 4.4
Tested up to: 4.6
Stable tag: 1.8
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Responsive plug-compatible replacement for the built-in WordPress gallery shortcode.

== Description ==
This is a responsive, mobile-friendly plug-compatible replacement for the built-in WordPress gallery shortcode.
It is implemented using a [Backbone.js](http://backbonejs.org/) Model-View-Presenter (MVP) populated via the [WordPress REST API](http://v2.wp-api.org/).
It is styled by a [Twitter Bootstrap 3](http://getbootstrap.com/) stylesheet and has touch optimizations from [jQuery Mobile](https://jquerymobile.com/).
Using a MVP allows you to [switch instantaneously](https://bbfgallery.wordpress.com/#navbar) (i.e. without doing a HTTP request) between multiple views of a gallery.
The default implementation supports a [gallery view](https://bbfgallery.wordpress.com/#gallery), [Miro's Justified Gallery](http://miromannino.github.io/Justified-Gallery/) view, a [carousel view](https://bbfgallery.wordpress.com/#carousel), a [tabs view](https://bbfgallery.wordpress.com/#tabs) and a [dense view](https://bbfgallery.wordpress.com/#dense) of the gallery.
Using the WP REST API allows you to [dynamically load](https://bbfgallery.wordpress.com/#alt_galleries) (i.e. without reloading the entire page) new galleries.
The view is styled by a Twitter Bootstrap 3 stylesheet so it is automatically responsive.
If the browser supports the CSS3 Flexbox the gallery view is implemented using a flexbox.
You can easily modify the Backbone templates to create your own customized views of the gallery.
The homepage for this plug-in is [https://bbfgallery.wordpress.com/](https://bbfgallery.wordpress.com/).

== Installation ==
1. Upload the folder "bb-gallery" to the "/wp-content/plugins/" directory.
2. Activate the plugin using the "Dashboard > Plugins > Installed Plugins" page.
3. Check the "Enable BB Gallery" option on the "Dashboard > Settings > Media" page. The defaults for all other options should work reasonably well. Save the settings.
4. Visit any page which has a gallery shortcode.
5. If you are not happy simply uninstall the plugin. Your website will not be changed in anyway.

== Frequently Asked Questions ==
= Why is the page loading slowly? =
BB Gallery can preload full size images for better user interactivity.
This does not work well for low bandwidth and/or slow cpus.
You can set the bandwidth option to "low" to prevent preloading and force the use of low resolution images.

= Is it necessary to install the WP REST API plugin? =
No. If the WP REST API plugin is not installed this plugin will use its own proprietary AJAX API to populate the Backbone.js collections.

= Where is the documentation? =
https://bbfgallery.wordpress.com/

== Screenshots ==
1. [Multiple Views of a Gallery](https://bbfgallery.wordpress.com/#navbar)
2. [Gallery View](https://bbfgallery.wordpress.com/#gallery)
3. [Alternate Flexbox Gallery View](https://bbfgallery.wordpress.com/#gallery-flexbox)
4. [Carousel View](https://bbfgallery.wordpress.com/#carousel)
5. [Tabs View](https://bbfgallery.wordpress.com/#tabs)
6. [Dense View](https://bbfgallery.wordpress.com/#dense)
7. [Dynamically Loading Galleries](https://bbfgallery.wordpress.com/#alt_galleries)
8. Dynamically Generating Galleries from Search Criteria
9. [Overlay of a Selected Image](https://bbfgallery.wordpress.com/#overlay)
10. Mobile Portrait View
11. [User Options Pane](https://bbfgallery.wordpress.com/#options)
12. [Admin Settings](https://bbfgallery.wordpress.com/#installation)

== Changelog ==

= 1.8 =

* replaced <picture> with <img srcset> for better support of Retina displays
* added support for [Miro's Justified Gallery](http://miromannino.github.io/Justified-Gallery/)
* bug fixes and css tweaks

= 1.7.3.4 =

* bug fix

= 1.7.3.3 =

* bug fix

= 1.7.3.2 =

* bug fixes
* compatibility with WordPress 4.6 RC1

= 1.7.3.1 =

* add object-fit contain and fill modes to tiles view
* css tweaks and bug fixes

= 1.7.3 =

* added tiles view - show images as [butt joined square image tiles](https://bbfgallery.wordpress.com/#gallery)
* css tweaks and bug fixes

= 1.7.1.2 =

* option to [embed carousel inside post content](https://bbfgallery.wordpress.com/#carousel)
* option to individually specify initial view of gallery
* css tweaks to prettify carousel

= 1.7.1.1 =

* show loadable galleries as a gallery of clickable representative images in place of a list of clickable titles
* bug fixes and usability enhancements

= 1.7.1 =

* option to make the carousel as the initial view
* option to show the dynamically loadable galleries as tabs
* bug fixes, css tweaks and usability enhancements

= 1.7 =

* support for dynamically loading galleries using the WordPress REST API to populate Backbone.js collections.

= 1.5.5 =

* use the WordPress REST API if available - no new features just a more modern implementation
* css tweaks and bug fixes

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

= 1.8 =

* replaced <picture> with <img srcset> for better support of Retina displays
* added support for [Miro's Justified Gallery](http://miromannino.github.io/Justified-Gallery/)
* bug fixes and css tweaks

= 1.7.3.4 =

* bug fix

= 1.7.3.3 =

* bug fix

= 1.7.3.2 =

* bug fixes
* compatibility with WordPress 4.6 RC1

= 1.7.3.1 =

* add object-fit contain and fill modes to tiles view
* css tweaks and bug fixes

= 1.7.3 =

* added tiles view - show images as butt joined square image tiles
* css tweaks and bug fixes

= 1.7.1.2 =

* option to embed carousel inside post content
* option to individually specify initial view of gallery
* css tweaks to prettify carousel

= 1.7.1.1 =

* show loadable galleries as a gallery of clickable representative images in place of a list of clickable titles
* bug fixes and usability enhancements

= 1.7.1 =

* option to make the carousel as the initial view
* option to show the dynamically loadable galleries as tabs
* bug fixes, css tweaks and usability enhancements

= 1.7 =

* support for dynamically loading galleries using the WordPress REST API to populate Backbone.js collections.

= 1.5.5 =

* use the WordPress REST API if available - no new features just a more modern implementation
* css tweaks and bug fixes

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

