<!-- Backbone.js templates for the 'gallery' shortcode using the WP REST API models        -->

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
                <figcaption><# print(bbg_xiv.getTitle(data)); #></figcaption>
                <a href="{{{ data.link }}}" target="_blank"<# if ( typeof data.gallery_index !== "undefined" ) { #> class="bbg_xiv-gallery_icon" data-gallery-index="{{{ data.gallery_index }}}"<# } #>>
                    <img src="<# print(bbg_xiv.getSrc(data,'viewport',true)); #>" srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'viewport',true)); #>"
                        alt="<# print(bbg_xiv.getAlt(data)); #>" title="<# print(bbg_xiv.getTitle(data)); #>" data-bbg_xiv-image-id="{{{ data.id }}}">
                </a>
            </figure>
        </div>
</script>

<!-- Flex Container Template -->
<script type="text/html" id="bbg_xiv-template_flex_container">
<div class="bbg_xiv-container bbg_xiv-flex_container" data-bbg_xiv-gallery-id="{{{ data.id }}}">
    {{{ data.items }}}
    <div class="bbg_xiv-flex_footer"></div>
    <!-- Full Browser Viewport View of an Image -->
    <div class="bbg_xiv-dense_outer">
    </div>
    <div class="bbg_xiv-dense_inner">
      <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
      <h1 class="bbg_xiv-dense_title"></h1>
      <img class="img-rounded bbg_xiv-img_overlay" sizes="<# print(bbg_xiv.getSizes(null,'viewport',false)); #>">
      <h1 class="bbg_xiv-dense_caption"></h1>
    </div>
</div>
</script>
<!-- Flex Item Template -->
<script type="text/html" id="bbg_xiv-template_flex_item">
    <div class="bbg_xiv-flex_item">
        <figure>
            <figcaption><# print(bbg_xiv.getTitle(data)); #></figcaption>
            <a href="{{{ data.link }}}" target="_blank"<# if ( typeof data.gallery_index !== "undefined" ) { #> class="bbg_xiv-gallery_icon" data-gallery-index="{{{ data.gallery_index }}}"<# } #>>
                <img src="<# print(bbg_xiv.getSrc(data,'viewport',true)); #>" srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'viewport',true)); #>"
                    alt="<# print(bbg_xiv.getAlt(data)); #>" title="<# print(bbg_xiv.getTitle(data)); #>" data-bbg_xiv-image-id="{{{ data.id }}}">
            </a>
        </figure>
        <a href="{{{ data.link }}}" target="_blank"<# if ( typeof data.gallery_index !== "undefined" ) { #> class="bbg_xiv-gallery_icon" data-gallery-index="{{{ data.gallery_index }}}"<# } #>>
            <!-- overlay for full viewport button -->
            <div class="bbg_xiv-dense_full_btn" title="<# print(bbg_xiv.getCaption(data)); #>">
                <button class="bbg_xiv-dense_full_btn bbg_xiv-flex_from_image btn">
                    <span class="glyphicon glyphicon-fullscreen"></span>
                </button>
            </div>
        </a>
    </div>
</script>

<!-- Carousel Container Template -->
<script type="text/html" id="bbg_xiv-template_carousel_container">
<div id="{{{ data.id }}}" class="carousel slide bbg_xiv-container" data-ride="carousel" data-interval="<?php echo get_option( 'bbg_xiv_carousel_interval', '2500' ); ?>">
  <!-- Indicators -->
  <!-- the original Bootstrap carousel slide indicators which actually works very well in desktop browser but is a failure for mobile
  <ol class="carousel-indicators">
    {{{ data.bullets }}}
  </ol>
  -->
  <div class="carousel-indicators bbg_xiv-jquery_mobile">
    <form>
      <div class="ui-field-contain">
        <label for="slider-{{{ data.id }}}" class="ui-hidden-accessible"></label>
        <input type="range" name="slider-{{{ data.id }}}" id="slider-{{{ data.id }}}" class="bbg_xiv-carousel_slider" value="1" min="1" max="{{{ data.size }}}" step="1" data-highlight="true">
      </div>
    </form>
  </div>
  <!-- Wrapper for slides -->
  <div class="carousel-inner">
    {{{ data.items }}}
  </div>
  <!-- Left and right controls -->
  <div class="left carousel-control">
    <a class="bbg_xiv-carousel_left left carousel-control" href="#{{{ data.id }}}" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="bbg_xiv-carousel_first carousel-control" href="#">
      <span class="glyphicon glyphicon-fast-backward"></span>
      <span class="sr-only">First</span>
    </a>
    <a class="bbg_xiv-carousel_play carousel-control" href="#">
      <span class="glyphicon glyphicon-pause"></span>
      <span class="sr-only">Pause</span>
    </a>
</div>
  <div class="right carousel-control">
    <a class="bbg_xiv-carousel_close carousel-control" href="#">
      <span class="glyphicon glyphicon-remove"></span>
      <span class="sr-only">Close</span>
    </a>
    <a class="bbg_xiv-carousel_right right carousel-control" href="#{{{ data.id }}}" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <span class="sr-only">Next</span>
    </a>
    <a class="bbg_xiv-carousel_last carousel-control" href="#">
      <span class="glyphicon glyphicon-fast-forward"></span>
      <span class="sr-only">Last</span>
    </a>
    <a class="bbg_xiv-carousel_help carousel-control" href="https://bbfgallery.wordpress.com/#carousel" target="_blank">
      <span class="glyphicon glyphicon-question-sign"></span>
      <span class="sr-only">Help</span>
    </a>
  </div>
</div>
</script>
<!-- Carousel Item Template -->
<script type="text/html" id="bbg_xiv-template_carousel_item">
<figure class="item bbg_xiv-item<# if ( data.index === 0 ) { #> active<# } #>" data-index="{{{ data.index }}}">
  <a href="{{{ data.link }}}" target="_blank">
    <img src="<# print(bbg_xiv.getSrc(data,'container',false)); #>" srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'container',false)); #>">
  </a>
  <figcaption><# print(bbg_xiv.getTitle(data)); #><br><# print(bbg_xiv.getCaption(data)); #></figcaption>
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
      <a href="#" class="navbar-brand bbg_xiv-tabs_brand"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a>
    </div>
    <div id="{{{ data.id }}}_tabbar_collapse" class="collapse navbar-collapse bbg_xiv-closed">
      <ul class="nav nav-tabs">
        <li class="bbg_xiv-tabs_title"><a href="#"><?php _e( 'IMAGES:', 'bb_gallery' ); ?></a></li>
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
  <a href="#bbg_xiv-tab_pane{{{ data.index }}}" data-toggle="tab"><# print(bbg_xiv.getTitle(data)); #></a>
</li>
</script>
<!-- Tabs Item Template -->
<script type="text/html" id="bbg_xiv-template_tabs_item">
<figure id="bbg_xiv-tab_pane{{{ data.index }}}" role="tabpanel" class="tab-pane fade<# if ( data.index === 0 ) { #> active in<# } #>">
  <a href="{{{ data.link }}}" target="_blank"<# if ( typeof data.gallery_index !== "undefined" ) { #> class="bbg_xiv-gallery_icon" data-gallery-index="{{{ data.gallery_index }}}"<# } #>>
    <img class="bbg_xiv-tabs_img img-rounded" src="<# print(bbg_xiv.getSrc(data,'container',false)); #>"
        srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'container',false)); #>">
  </a>
  <figcaption><# if ( data.post_content ) { #>{{{ data.post_content }}}<# } else { #>{{{ data.caption }}}<# } #></figcaption>
</figure>
</script>

<!-- Dense Container Template -->
<script type="text/html" id="bbg_xiv-template_dense_container">
<div id="{{{ data.id }}}" class="bbg_xiv-dense_container" data-bbg_xiv-gallery-id="{{{ data.gallery }}}">
  <button type="button" id="bbg_xiv-highlight_color"></button>
  <button type="button" id="bbg_xiv-normal_color"></button>
  <div class="bbg_xiv-dense_button_box">
    <input type="radio" name="bbg_xiv-dense_li_mode" class="bbg_xiv-dense_li_mode" value="title"
      <# if ( data.mode === "title" ) { #>checked<# } #>>&nbsp;Title&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="radio" name="bbg_xiv-dense_li_mode" class="bbg_xiv-dense_li_mode" value="caption"
      <# if ( data.mode === "caption" ) { #>checked<# } #>>&nbsp;Caption&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="radio" name="bbg_xiv-dense_li_mode" class="bbg_xiv-dense_li_mode" value="alt"
      <# if ( data.mode === "alt" ) { #>checked<# } #>>&nbsp;Alt
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
    <img class="img-rounded bbg_xiv-img_overlay" sizes="<# print(bbg_xiv.getSizes(null,'viewport',false)); #>">
    <h1 class="bbg_xiv-dense_caption"></h1>
  </div>
</div>
</script>
<!-- Dense Title Template -->
<script type="text/html" id="bbg_xiv-template_dense_title">
<li id="bbg_xiv-dense_title_{{{ data.index }}}">
  <a href="{{{ data.link }}}" target="_blank">
    <span class="bbg_xiv-dense_li_title" title="<# print(bbg_xiv.getCaption(data)); #>"<# if ( data.mode !== "title" ) { #> style="display:none;"<# } #>>
      <# print(bbg_xiv.getTitle(data)); #></span>
    <span class="bbg_xiv-dense_li_caption" title="<# print(bbg_xiv.getTitle(data)); #>"<# if ( data.mode !== "caption" ) { #> style="display:none;"<# } #>>
      <# print(bbg_xiv.getCaption(data)); #></span>
    <span class="bbg_xiv-dense_li_alt" title="<# print(bbg_xiv.getTitle(data)); #>"<# if ( data.mode !== "alt" ) { #> style="display:none;"<# } #>>
      <# print(bbg_xiv.getAlt(data)); #></span>
  </a>
  <button class="bbg_xiv-dense_full_btn bbg_xiv-dense_from_title btn">
    <span class="glyphicon glyphicon-fullscreen"></span>
  </button>
</li>
</script>
<!-- Dense Image Template -->
<script type="text/html" id="bbg_xiv-template_dense_image">
<div id="bbg_xiv-dense_image_{{{ data.index }}}" class="bbg_xiv-dense_flex_item" title="<# print(bbg_xiv.getTitle(data)); #>">
  <img src="<# print(bbg_xiv.getSrc(data,'viewport',true)); #>" srcset="<# print(bbg_xiv.getSrcset(data)); #>" sizes="<# print(bbg_xiv.getSizes(data,'viewport',true)); #>"
      alt="<# print(bbg_xiv.getAlt(data)); #>" title="<# print(bbg_xiv.getTitle(data)); #>" data-bbg_xiv-image-id="{{{ data.id }}}">
  <a href="{{{ data.link }}}" target="_blank">
    <div class="bbg_xiv-dense_full_btn">
      <button class="bbg_xiv-dense_full_btn bbg_xiv-dense_from_image btn">
        <span class="glyphicon glyphicon-fullscreen"></span>
      </button>
    </div>
  </a>
</div>
</script>

<!-- Justified Gallery Container Template -->
<script type="text/html" id="bbg_xiv-template_justified_container">
<div class="bbg_xiv-container bbg_xiv-justified_container" data-bbg_xiv-gallery-id="{{{ data.id }}}">
    <div class="bbg_xiv-justified_gallery">
        {{{ data.items }}}
    </div>
    <!-- Full Browser Viewport View of an Image -->
    <div class="bbg_xiv-dense_outer">
    </div>
    <div class="bbg_xiv-dense_inner">
        <button class="bbg_xiv-dense_close"><span class="glyphicon glyphicon-remove"></span></button>
        <h1 class="bbg_xiv-dense_title"></h1>
        <img class="img-rounded bbg_xiv-img_overlay" sizes="<# print(bbg_xiv.getSizes(null,'viewport',false)); #>">
        <h1 class="bbg_xiv-dense_caption"></h1>
    </div>
</div>
</script>
<!-- Justified Gallery Item Template -->
<script type="text/html" id="bbg_xiv-template_justified_item">
    <div class="bbg_xiv-justified_item">
        <a href="{{{ data.link }}}" target="_blank">
            <img src="{{{ data.bbg_medium_src[0] }}}" alt="<# print(bbg_xiv.getAlt(data)); #>" title="<# print(bbg_xiv.getTitle(data)); #>" data-bbg_xiv-image-id="{{{ data.id }}}" />
        </a>	
        <div class="caption">
            <a href="{{{ data.link }}}" target="_blank"><# print(bbg_xiv.getCaption(data)); #></a>
            <button class="bbg_xiv-dense_full_btn bbg_xiv-dense_from_justified btn"><span class="glyphicon glyphicon-fullscreen"></span></button>
        </div>
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
