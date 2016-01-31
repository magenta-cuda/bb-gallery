<!-- Backbone.js templates for the 'gallery' shortcode -->

<!-- These templates use the WordPress syntax for Backbone.js templates.                   -->
<!-- See bbg_xiv.templateOptions in the file ".../js/bbg_xiv-gallery.js".                  -->
<!-- You can modify these templates or even add your own template.                         -->
<!-- Your template should have ids like "bbg_xiv-template_{your template name}_container"  -->
<!-- and "bbg_xiv-template_{your template name}_item"                                      -->
<!-- Your container element should have class "bbg_xiv-container"                          --> 

<!-- Gallery Container Template -->
<script type="text/html" id="bbg_xiv-template_gallery_container">
<div class="container bbg_xiv-container bbg_xiv-gallery_container">
    <div class="row">
        {{{ data.items }}}
    </div>
</div>
</script>
<!-- Gallery Item Template -->
<script type="text/html" id="bbg_xiv-template_gallery_item">
        <div class="bbg_xiv-flex_item col-sm-6 col-md-4 col-lg-3">
            <figure class="img-rounded bbg_xiv-gallery_item">
                <figcaption>{{{ data.post_title }}}</figcaption>
                <a href="{{{ data.link }}}" target="_blank">
                    <img src="{{{ data.url }}}" alt="{{{ data.post_title }}}" title="{{{ data.post_excerpt }}}">
                </a>
            </figure>
        </div>
</script>

<!-- Flex Container Template -->
<script type="text/html" id="bbg_xiv-template_flex_container">
<div class="bbg_xiv-container bbg_xiv-flex_container" data-bbg_xiv-gallery-id="{{{ data.id }}}">
    {{{ data.items }}}
    <!-- Full Browser Viewport View of an Image -->
    <div class="bbg_xiv-dense_outer">
    </div>
    <div class="bbg_xiv-dense_inner">
      <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
      <h1 class="bbg_xiv-dense_title"></h1>
      <picture>
        <source media="(min-width:1200px)">
        <source media="(min-width:992px)">
        <source media="(min-width:768px)">
        <img class="img-rounded">
      </picture>
      <h1 class="bbg_xiv-dense_caption"></h1>
    </div>
</div>
</script>
<!-- Flex Item Template -->
<script type="text/html" id="bbg_xiv-template_flex_item">
    <div class="bbg_xiv-flex_item">
        <figure>
            <figcaption>{{{ data.post_title }}}</figcaption>
            <a href="{{{ data.link }}}" target="_blank">
                <img src="<# print(bbg_xiv.getThumbnailUrl(data).src); #>" alt="{{{ data.post_title }}}" title="{{{ data.post_excerpt }}}" data-bbg_xiv-image-id="{{{ data.ID }}}">
            </a>
        </figure>
        <a href="{{{ data.link }}}" target="_blank">
            <!-- overlay for full viewport button -->
            <div class="bbg_xiv-dense_full_btn" title="{{{ data.post_excerpt }}}">
                <button class="bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn">
                    <span class="glyphicon glyphicon-fullscreen">
                </button>
            </div>
        </a>
    </div>
</script>

<!-- Carousel Container Template -->
<script type="text/html" id="bbg_xiv-template_carousel_container">
<div id="{{{ data.id }}}" class="carousel slide bbg_xiv-container" data-ride="carousel" data-interval="<?php echo get_option( 'bbg_xiv_carousel_interval', '2500' ); ?>">
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
  <figcaption>{{{ data.post_title }}}<br>{{{ data.post_excerpt }}}</figcaption>
</figure>
</script>

<!-- Tabs Container Template -->
<script type="text/html" id="bbg_xiv-template_tabs_container">
<div class="bbg_xiv-container bbg_xiv-template_tabs_container">
  <!-- Tabs -->
  <nav role="navigation" class="navbar navbar-default">
    <div class="navbar-header">
      <button type="button" data-target="#{{{ data.id }}}_tabbar_collapse" data-toggle="collapse" class="navbar-toggle">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a href="#" class="navbar-brand bbg_xiv-tabs_brand">Tabs:</a>
    </div>
    <div id="{{{ data.id }}}_tabbar_collapse" class="collapse navbar-collapse bbg_xiv-closed">
      <ul class="nav nav-tabs">
        {{{ data.tabs }}}
      </ul>
    </div>
    <span class="glyphicon glyphicon-collapse-down"></span>
  </nav>
  <!-- Panes -->
  <div class="tab-content">
    {{{ data.items }}}
  </div>
</div>
</script>
<!-- Tabs Tab Template -->
<script type="text/html" id="bbg_xiv-template_tabs_tab">
<li<# if ( data.index === 0 ) { #> class=" active"<# } #>>
  <a href="#bbg_xiv-tab_pane{{{ data.index }}}" data-toggle="tab">{{{ data.post_title }}}</a>
</li>
</script>
<!-- Tabs Item Template -->
<script type="text/html" id="bbg_xiv-template_tabs_item">
<figure id="bbg_xiv-tab_pane{{{ data.index }}}" role="tabpanel" class="tab-pane fade<# if ( data.index === 0 ) { #> active in<# } #>">
  <a href="{{{ data.link }}}" target="_blank">
    <img class="bbg_xiv-tabs_img img-rounded" src="{{{ data.url }}}">
  </a>
  <figcaption><# if ( data.post_content ) { #>{{{ data.post_content }}}<# } else { #>{{{ data.post_excerpt }}}<# } #></figcaption>
</figure>
</script>

<!-- Dense Container Template -->
<script type="text/html" id="bbg_xiv-template_dense_container">
<div id="{{{ data.id }}}" class="bbg_xiv-dense_container">
  <button type="button" id="bbg_xiv-highlight_color"></button>
  <button type="button" id="bbg_xiv-normal_color"></button>
  <div class="bbg_xiv-dense_button_box">
    <input type="radio" name="bbg_xiv-dense_li_mode" class="bbg_xiv-dense_li_mode" value="title"
      <# if ( data.mode === "title" ) { #>checked<# } #>>&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="radio" name="bbg_xiv-dense_li_mode" class="bbg_xiv-dense_li_mode" value="caption"
      <# if ( data.mode === "caption" ) { #>checked<# } #>>&nbsp;Caption
  </div>
  <button type="button" class="bbg_xiv-dense_close_btn btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>
  <div class="bbg_xiv-dense_titles">
    <ul class="list-unstyled">
      {{{ data.titles }}}
    </ul>
  </div>
  <div class="bbg_xiv-dense_images">
    <div class="bbg_xiv-dense_flex_images">
      {{{ data.images }}}
    </div>
  </div>
  <!-- Full Browser Viewport View of an Image -->
  <div class="bbg_xiv-dense_outer">
  </div>
  <div class="bbg_xiv-dense_inner">
    <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
    <h1 class="bbg_xiv-dense_title"></h1>
    <img class="img-rounded">
    <h1 class="bbg_xiv-dense_caption"></h1>
  </div>
</div>
</script>
<!-- Dense Title Template -->
<script type="text/html" id="bbg_xiv-template_dense_title">
<li id="bbg_xiv-dense_title_{{{ data.index }}}">
  <a href="{{{ data.link }}}" target="_blank">
    <span class="bbg_xiv-dense_li_title" title="{{{ data.post_excerpt }}}"<# if ( data.mode !== "title" ) { #> style="display:none;"<# } #>>
      {{{ data.post_title }}}</span>
    <span class="bbg_xiv-dense_li_caption" title="{{{ data.post_title }}}"<# if ( data.mode !== "caption" ) { #> style="display:none;"<# } #>>
      <# if ( data.post_excerpt ) { #>{{{ data.post_excerpt }}}</span><# } else { #>.....<# } #>
  </a>
  <button class="bbg_xiv-dense_full_btn bbg_xiv-dense_from_title btn">
    <span class="glyphicon glyphicon-fullscreen">
  </button>
</li>
</script>
<!-- Dense Image Template -->
<script type="text/html" id="bbg_xiv-template_dense_image">
<div id="bbg_xiv-dense_image_{{{ data.index }}}" class="bbg_xiv-dense_flex_item" title="{{{ data.post_title }}}">
  <img class="img-rounded" src="{{{ data.url }}}" alt="{{{ data.post_title }}}" title="{{{ data.post_excerpt }}}">
  <a href="{{{ data.link }}}" target="_blank">
    <div class="bbg_xiv-dense_full_btn">
      <button class="bbg_xiv-dense_full_btn bbg_xiv-dense_from_image btn">
        <span class="glyphicon glyphicon-fullscreen">
      </button>
    </div>
  </a>
</div>
</script>

<!-- Table Container Template -->
<script type="text/html" id="bbg_xiv-template_table_container">
<div class="bbg_xiv-table">
  <table class="table table-bordered table-striped bbg_xiv-table">
    <thead>
      <# print(bbg_xiv.dumpFieldNames(data.collection)); #>
    </thead>
    <tbody>
      <# print(bbg_xiv.dumpFieldValues(data.collection)); #>
    </tbody>
  </table>
</div>
</script>
