<!-- Backbone.js templates for the 'gallery' shortcode -->

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
                <a href="{{{ data.link }}}" target="_blank">
                    <img src="{{{ data.url }}}">
                </a>
                <figcaption>{{{ data.post_title }}}</figcaption>
            </figure>
        </div>
</script>
