<!-- Backbone.js templates for the 'gallery' shortcode -->

<!-- These templates use the WordPress syntax for Backbone.js templates.                   -->
<!-- See bbg_xiv.templateOptions in the file ".../js/bbg_xiv-gallery.js".                  -->
<!-- You can modify these templates or even add your own template.                         -->
<!-- Your template should have ids like "bbg_xiv-template_{your template name}_container"  -->
<!-- and "bbg_xiv-template_{your template name}_item"                                      -->
<!-- Your container element should have class "bbg_xiv-bootstrap bbg_xiv-container"        --> 

<!-- Gallery Container Template -->
<script type="text/html" id="bbg_xiv-template_gallery_container">
<div class="container bbg_xiv-bootstrap bbg_xiv-container bbg_xiv-gallery_container">
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
<div class="bbg_xiv-container bbg_xiv-flex_container">
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

<!-- Carousel Container Template -->
<script type="text/html" id="bbg_xiv-template_carousel_container">
<div id="{{{ data.id }}}" class="carousel slide bbg_xiv-bootstrap bbg_xiv-container" data-ride="carousel">
  <button type="button" class="bbg_xiv-carousel_close_btn btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>
  <!-- Indicators -->
  <ol class="carousel-indicators">
    {{{ data.bullets }}}
  </ol>
  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    {{{ data.items }}}
  </div>
  <!-- Left and right controls -->
  <a class="left carousel-control" href="#{{{ data.id }}}" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#{{{ data.id }}}" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
</script>
<!-- Carousel Item Template -->
<script type="text/html" id="bbg_xiv-template_carousel_item">
<figure class="item bbg_xiv-item<# if ( data.index === 0 ) { #> active<# } #>">
  <a href="{{{ data.link }}}" target="_blank">
    <img src="{{{ data.url }}}">
  </a>
  <figcaption>{{{ data.post_title }}}</figcaption>
</figure>
</script>

