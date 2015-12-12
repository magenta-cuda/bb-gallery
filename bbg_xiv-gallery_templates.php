<!-- Backbone.js templates for the 'gallery' shortcode -->

<!-- These templates use the WordPress syntax for Backbone.js templates.                   -->
<!-- See bbg_xiv.templateOptions in the file ".../js/bbg_xiv-gallery.js".                  -->
<!-- You can modify these templates or even add your own template.                         -->
<!-- Your template should have ids like "bbg_xiv-template_{your template name}_container"  -->
<!-- and "bbg_xiv-template_{your template name}_item"                                      -->

<!-- Gallery Container Template -->
<script type="text/html" id="bbg_xiv-template_gallery_container">
<div class="container bbg_xiv-bootstrap bbg_xiv-gallery_container">
    <div class="row">
        {{{ data.items }}}
    </div>
</div>
</script>
<!-- Gallery Item Template -->
<script type="text/html" id="bbg_xiv-template_gallery_item">
        <div class="col-sm-6 col-md-4 col-lg-3">
            <figure class="img-rounded bbg_xiv-gallery_item">
                <figcaption>{{{ data.post_title }}}</figcaption>
                <a href="{{{ data.link }}}" target="_blank">
                    <img src="{{{ data.url }}}">
                </a>
            </figure>
        </div>
</script>

<!-- Flex Container Template -->
<script type="text/html" id="bbg_xiv-template_flex_container">
<div class="bbg_xiv-flex_container">
    {{{ data.items }}}
</div>
</script>
<!-- Flex Item Template -->
<script type="text/html" id="bbg_xiv-template_flex_item">
    <div class="bbg_xiv-flex_item">
        <figure>
            <figcaption>{{{ data.post_title }}}</figcaption>
            <a href="{{{ data.link }}}" target="_blank">
                <img src="{{{ data.url }}}" alt="{{{ data.post_title }}}">
            </a>
        </figure>
    </div>
</script>
