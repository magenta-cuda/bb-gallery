// Backbone.js Model View Presenter for the 'gallery' shortcode

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

(function(){
    var bbg_xiv=window.bbg_xiv=window.bbg_xiv||{};
    // URLs
    bbg_xiv.docUrl         = "http://docs.magentacuda.com/";
    bbg_xiv.helpOptionsUrl = "http://docs.magentacuda.com/#options";
    // Strings
    bbg_xiv.galleryOfGalleriesTitle=bbg_xiv_lang.galleryOfGalleriesTitle;
    // use WordPress templating syntax; see .../wp-includes/js/wp-util.js
    bbg_xiv.templateOptions={
        evaluate:    /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
        variable:    'data'
    };
    
    bbg_xiv.images={};
    bbg_xiv.search={};      // state info for multi part search results
    bbg_xiv.galleries={};   // state info for alternate galleries
    
    bbg_xiv.Image=Backbone.Model.extend({idAttribute:window.bbg_xiv.bbg_xiv_wp_rest_api?"id":"ID"});
    
    bbg_xiv.Images=Backbone.Collection.extend({model:bbg_xiv.Image});
    
    bbg_xiv.ImageView=Backbone.View.extend({
        render:function(srcOnly){
            var html=this.template(this.model.attributes);
            if(srcOnly){
                return html;
            }
            this.$el.html(html);
            return this;
        }    
    });
    
    bbg_xiv.GalleryView=Backbone.View.extend({
        render:function(){
            var html=this.template(this.model.attributes);
            this.$el.html(html);
            return this;
        }
    });
    
    bbg_xiv.renderBootstrapGallery=function(container,collection){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_gallery_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
            imageView.model=model;
            imagesHtml+=imageView.render(true);
            // Bootstrap's grid needs "clear" elements to correctly align non-uniformly sized items
            if(index%4===3){
                imagesHtml+='<br class="clearfix visible-lg-block">';
            }
            if(index%3===2){
                imagesHtml+='<br class="clearfix visible-md-block">';
            }
            if(index%2===1){
                imagesHtml+='<br class="clearfix visible-sm-block">';
            }
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_gallery_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.container"));
    };

    bbg_xiv.renderFlex=function(container,collection){
        var containerWidth=container.width();
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_flex_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function( model ) {
            model.attributes.bbg_xiv_container_width=containerWidth;
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:collection.id,
                    items:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_flex_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-flex_container"));
        if ( bbg_xiv.guiInterface === 'touch' ) {
            container.find("div.bbg_xiv-flex_container div.bbg_xiv-flex_item div.bbg_xiv-dense_full_btn").addClass("bbg_xiv-touch");
        }
    };

    bbg_xiv.renderTiles=function(container,collection,flags){
        // gallery tiles have exactly the same HTML elements as the gallery Flex items but we will use CSS specificity to override the Flex container CSS
        container.addClass("bbg_xiv-tiles_container");
        // in the default mode of the square tiles the images cover the square tiles i.e., object-fit: cover;
        if(flags.indexOf("contain")!==-1){
            // the images in the square tiles are contained in the square tiles i.e., object-fit: contain;
            container.addClass("bbg_xiv-contain");
        }else if(flags.indexOf("fill")!==-1){
            // object-fit: fill;
            container.addClass("bbg_xiv-fill");
        }
        bbg_xiv.renderFlex(container,collection);
        if(!Modernizr.objectfit||flags.indexOf("contain")!==-1){
            // IE and Edge do not support objectfit so we set a class to differentiate between landscape and portrait mode which will let our CSS rules simulate object-fit:cover
            container.find("div.bbg_xiv-flex_item img").load(function(){
                if(this.naturalWidth<this.naturalHeight){
                    jQuery(this).addClass("bbg_xiv-portrait");
                }
            });
        }
        var flexContainer    = container.find( 'div.bbg_xiv-flex_container');
        var galleryContainer = flexContainer.closest( 'div.bbg_xiv-gallery' ).addClass( 'bbg_xiv-caption_visible' );
        // flip display state of caption on hover
        container.find("div.bbg_xiv-dense_full_btn").hover(
            function() {
                if ( ! galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                    jQuery(this).parents("div.bbg_xiv-flex_item").find("figure figcaption").each(function(){
                        jQuery(this).show();
                    });
                }
            },
            function() {
                if ( ! galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                    jQuery(this).parents("div.bbg_xiv-flex_item").find("figure figcaption").each(function(){
                        jQuery(this).hide();
                    });
                }
            }
        );
        if ( bbg_xiv.guiInterface === 'touch' ) {
            container.find("div.bbg_xiv-flex_item a").click(function(e){
                if ( ! galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                    var caption=jQuery(this.parentNode).find("figure figcaption");
                    if(!caption.data("visible")){
                        container.find("div.bbg_xiv-flex_item figure figcaption").data("visible",false);
                        caption.data("visible",true);
                        e.preventDefault();
                    }
                }
            });
        }
    };

    bbg_xiv.renderCarousel=function(container,collection,id){
        var containerWidth=container.width();
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_carousel_item").html(),null,bbg_xiv.templateOptions);
        var bulletsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.browser=bbg_xiv.browser;
            model.attributes.index=index;
            model.attributes.bbg_xiv_container_width=containerWidth;
            imageView.model=model;
            var active=index ===0?' class="active"':'';
            bulletsHtml+='<li data-target="#'+id+'" data-slide-to="'+index+'"'+active+'></li>';
            imagesHtml+=imageView.render(true);
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    gallery:collection.id,
                    size:collection.length,
                    bullets:bulletsHtml,
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_carousel_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find( "div.carousel.slide"));
    };

    bbg_xiv.renderTabs=function(container,collection,id){
        var containerWidth=container.width();
        var tabView=new bbg_xiv.ImageView();
        tabView.template=_.template(jQuery("script#bbg_xiv-template_tabs_tab").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_tabs_item").html(),null,bbg_xiv.templateOptions);
        var tabsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.browser=bbg_xiv.browser;
            model.attributes.index=index;
            model.attributes.bbg_xiv_container_width=containerWidth;
            imageView.model=tabView.model=model;
            tabsHtml+=tabView.render(true);
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    tabs:tabsHtml,
                    items:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_tabs_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-template_tabs_container"));
    };

    bbg_xiv.renderDense=function(container,collection,id,mode){
        var containerWidth=container.width();
        var titleView=new bbg_xiv.ImageView();
        titleView.template=_.template(jQuery("script#bbg_xiv-template_dense_title").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_dense_image").html(),null,bbg_xiv.templateOptions);
        var titlesHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.mode=mode;
            model.attributes.index=index;
            model.attributes.bbg_xiv_container_width=containerWidth;
            imageView.model=titleView.model=model;
            titlesHtml+=titleView.render(true);
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    gallery:collection.id,
                    mode:mode,
                    titles:titlesHtml,
                    images:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_dense_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-dense_container"));
    };
    
    bbg_xiv.renderJustified=function(container,collection){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_justified_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function( model ) {
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:collection.id,
                    items:imagesHtml
                }
            }
        });
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_justified_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        var justifiedContainer=galleryView.render().$el.find("div.bbg_xiv-justified_container");
        container.append(justifiedContainer);
        var $justifiedGallery = justifiedContainer.find( 'div.bbg_xiv-justified_gallery' );
        $justifiedGallery.justifiedGallery({margins: 5, rowHeight: bbg_xiv.bbg_xiv_miro_row_height, lastRow: 'nojustify', refreshSensitivity: 0, refreshTime: 250 })
            .on( 'jg.complete jg.resize', function() {
            // Why are there negative margins on the img - anyway remove them
            $justifiedGallery.find( 'img' ).css( 'margin', '0' );
        });
        if ( bbg_xiv.guiInterface === 'touch' ) {
            justifiedContainer.addClass( 'bbg_xiv-touch' );
            $justifiedGallery.find( 'div.bbg_xiv-justified_item > a' ).click(function( e ) {
                e.preventDefault();
            });
            justifiedContainer.addClass( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ? 'bbg_xiv-portrait' : 'bbg_xiv-landscape' );
        }
        justifiedContainer   = container.find( 'div.bbg_xiv-justified_container' );
        var galleryContainer = justifiedContainer.closest( 'div.bbg_xiv-gallery' ).removeClass( 'bbg_xiv-caption_visible' );
        // if CC has been set to visible then override Justified Gallery's hover handlers
        justifiedContainer.find("div.bbg_xiv-justified_gallery div.bbg_xiv-justified_item").each(function(){
          var img=this.querySelector("img");
          var caption=this.querySelector("div.caption");
          [img,caption].forEach(function(item){
              // these handlers need work if executed before or after the Justified Gallery's handlers
              item.addEventListener("mouseover",function(e){
                  if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                      caption.style.display="block";
                      caption.style.opacity="0.7";
                      e.stopImmediatePropagation();
                  }
              });
              item.addEventListener("mouseout",function(e){
                  if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                      caption.style.display="block";
                      caption.style.opacity="0.7";
                      e.stopImmediatePropagation();
                  }
              });
          });
          jQuery( img ).closest( 'a' ).click(function( e ) {
              e.preventDefault();
          });
          jQuery( caption ).find( 'a' ).click( function( e ) {
              var $caption = jQuery( this ).closest( 'div.caption' );
              if ( parseFloat( $caption.css( 'opacity' ) ) < 0.1 ) {
                  e.preventDefault();
              }
          } );
        });
    };

    // renderGeneric() may work unmodified with your template.
    // Otherwise you can use it as a base for a render function specific to your template.
    // See renderGallery(), renderCarousel() or renderTabs() - all of which need some special HTML to work correctly.

    bbg_xiv.renderGeneric=function(container,collection,template){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_"+template+"_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function( model ) {
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        });
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_"+template+"_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("bbg_xiv-container"));
    };

    // debugging utilities
    
    // dumpFieldNames() dumps field names as <th> elements in a <tr> element
    var fieldNames=[];
    bbg_xiv.dumpFieldNames=function(collection){
        collection.forEach(function(model){
            Object.keys(model.attributes).forEach(function(key){
                if(fieldNames.indexOf(key)===-1){
                    fieldNames.push(key);
                }
            });
        });
        var buffer="<tr>";
        fieldNames.forEach(function(name){
            buffer+="<th>"+name+"</th>";
        });
        buffer+="</tr>";
        return buffer;
    };
    
    // dumpFieldValues() dumps field values as <td> elements in <tr> elements
    bbg_xiv.dumpFieldValues=function(collection){
        var buffer="";
        collection.forEach(function(model){
            buffer+="<tr>";
            fieldNames.forEach(function(name){
                buffer+="<td>"+model.attributes[name]+"</td>";
            });
            buffer+="</tr>";
        });
        return buffer;        
    };
    
    bbg_xiv.renderTable=function(container,collection){
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    collection:collection
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_table_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-table"));
    };
    
    bbg_xiv.constructImages=function(gallery){
        var images;
        if(window.bbg_xiv.bbg_xiv_wp_rest_api){
            images = bbg_xiv.images[ gallery.id ];
        }else{
            images = bbg_xiv.images[ gallery.id ] = new bbg_xiv.Images();
            try{
                images.reset(JSON.parse(window.bbg_xiv[gallery.id+"-data"]));
            }catch(e){
                console.log("reset(JSON.parse()) failed:",e);
                return images;
            }
        }
        images.id=gallery.id;
        images.constructed=true;
        return images;
    };
    
    bbg_xiv.renderGallery=function(gallery,view,flags){
        if(!flags){
            flags=[];
        }
        // extract flags from data attribute flags
        if(gallery.dataset.flags){
            flags=flags.concat(gallery.dataset.flags.split(","));
        }

        var jqGallery=jQuery(gallery);
        var images=bbg_xiv.images[gallery.id];
        if(!images||!images.constructed){
            images=bbg_xiv.constructImages(gallery);
        }
        // remember the initial statically loaded gallery so we can efficiently return to it
        bbg_xiv.galleries[gallery.id]=bbg_xiv.galleries[gallery.id]||{images:{"gallery_home":images},view:"gallery_home"};
        function constructOverlay() {
            // gallery or dense view shows a full browser viewport view of an image when its fullscreen glyph is clicked
            var outer          = jqGallery.find( 'div.bbg_xiv-dense_outer' );
            var inner          = jqGallery.find( 'div.bbg_xiv-dense_inner' );
            var $altInner      = jqGallery.find( 'div.bbg_xiv-dense_alt_inner' );
            var overlayShowing = false;
            var overlayLocked  = false;
            var mouseX         = NaN;
            var mouseY         = NaN;
            var $caption       = null;
            function hideOverlay( e ) {
                if ( ! overlayShowing ) {
                    // ignore events when overlay is transitioning to hide
                    return;
                }
                if ( e.type !== 'click' ) {
                    if ( overlayLocked ) {
                        return;
                    }
                    if ( Math.abs( e.screenX - mouseX ) < 10 && Math.abs( e.screenY - mouseY ) < 10 ) {
                        // ignore a small mouse movement
                        return;
                    }
                } else {
                    if ( ! overlayLocked ) {
                        // An unlocked overlay must be the alt overlay.
                        // When the alt overlay is showing from a hover use the first click in the inner to lock the alt overlay.
                        overlayLocked = true;
                        $altInner.addClass( 'bbg_xiv-locked' );
                        return;
                    }
                }
                // This is either a click event on a locked overlay or a large mouse move event on an unlocked alt overlay
                var $inner = jQuery( this );
                if ( $inner.hasClass( 'bbg_xiv-dense_outer' ) ) {
                    // $inner really is outer so ...
                    $inner = $altInner;
                }   
                overlayShowing = overlayLocked = false;
                $altInner.removeClass( 'bbg_xiv-locked' );
                mouseX = mouseY = NaN;
                // fade out and hide overlay
                $inner.css("opacity","0.0");
                outer.css("opacity","0.0");
                // workaround for a bug? in Chrome where navbar is not visible after an overlay is closed
                var $navbar = jQuery( 'div.bbg_xiv-gallery nav.bbg_xiv-gallery_navbar' ).css( 'opacity', '0.99' );
                window.setTimeout(function(){
                    $inner.hide();
                    outer.hide();
                    $navbar.css( 'opacity', '1.0' );
                }, $inner !== $altInner ? 2000 : 500 );
                // $caption.css( { display: 'block', opacity: '0.7' } );
            }   // function hideOverlay( e ) {
            inner.add( $altInner ).click( hideOverlay );
            outer.add( $altInner ).mousemove( hideOverlay );
            // when overlay is showing from hover use a click in the outer to lock the overlay
            outer.click( function( e ) {
                if ( !overlayLocked ) {
                    // The overlay must be the alt overlay.
                    overlayLocked = true;
                    $altInner.addClass( 'bbg_xiv-locked' );
                } else {
                    hideOverlay.call( this, e );
                }
            } );
            var fullImg     = inner.find( 'img' );
            var fullTitle   = inner.find( 'h1.bbg_xiv-dense_title' );
            var fullCaption = inner.find( 'h1.bbg_xiv-dense_caption' );
            if( typeof bbg_xiv.titleColor === 'undefined' ) {
                // save the initial values of title color and shadow as these will be changed
                bbg_xiv.titleColor  = fullTitle.css( 'color' );
                bbg_xiv.titleShadow = fullTitle.css( 'text-shadow' );
            }
            if ( bbg_xiv.guiInterface === 'mouse' ) {
                // only show title on mouseover
                fullImg.hover(
                    function() {
                        fullTitle.css({   color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                        fullCaption.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                    },
                    function() {
                        fullTitle.css({   color: 'transparent', textShadow: 'none' });
                        fullCaption.css({ color: 'transparent', textShadow: 'none' });
                    }
                );
            }
            var altOverlayView      = new bbg_xiv.ImageView();
            altOverlayView.template = _.template( jQuery( 'script#bbg_xiv-template_justified_alt_overlay' ).html(), null, bbg_xiv.templateOptions );
            function showOverlay( e ) {
                var $button;
                if ( this.tagName === 'A' ) {
                    // click from carousel info button
                    $button = jQuery( this );
                } else if ( this.tagName === 'SPAN' ) {
                    $button = jQuery( this.parentNode );
                } else {
                    $button = jQuery( this );
                }
                if ( parseFloat( $button.closest( 'div.caption' ).css( 'opacity' ) ) < 0.1 ) {
                    // click was on an invisible button so ignore it
                    return;
                }
                overlayShowing = true;
                overlayLocked  = e.type === 'click';
                mouseX         = e.screenX;
                mouseY         = e.screenY;
                $caption       = $button.parent( 'div.caption' );
                var alt        = $button.hasClass( 'bbg_xiv-carousel_info' ) || $button.hasClass( 'bbg_xiv-dense_alt_btn' );   // use the alternate overlay view
                if ( alt && overlayLocked ) {
                    $altInner.addClass( 'bbg_xiv-locked' );
                }
                var img;
                // the buttons are of four different types so the associated image is found differently depending on the type
                if ( $button.hasClass( 'bbg_xiv-carousel_info' ) ) {
                    // click from carousel info button
                    img = $button.closest( 'div.carousel' ).find( 'div.carousel-inner figure.item.active img' )[0];
                } else if ( $button.hasClass( 'bbg_xiv-dense_from_image' ) ) {
                    img = $button.parents( 'div.bbg_xiv-dense_flex_item' ).find( 'img' )[0];
                } else if ( $button.hasClass( 'bbg_xiv-dense_from_title' ) ) {
                    img = jQuery( 'div#' + this.parentNode.id.replace( 'title', 'image' ) ).find( 'img' )[0];
                } else if ( $button.hasClass( 'bbg_xiv-flex_from_image' ) ) {
                    img = $button.parents( 'div.bbg_xiv-flex_item' ).find( 'img' )[0];
                } else if ( $button.hasClass( 'bbg_xiv-dense_from_justified') ) {
                    img = $button.parents( 'div.bbg_xiv-justified_item' ).find( 'img' )[0];
                }
                var data;
                try {
                    var galleryId=jQuery(img).parents("div[data-bbg_xiv-gallery-id]")[0].dataset.bbg_xivGalleryId;
                    data = bbg_xiv.images[ galleryId ].get( img.dataset.bbg_xivImageId ).attributes;
                    if ( ! alt ) {
                        fullImg[0].src=bbg_xiv.getSrc(data,"viewport",false);
                        if(data.bbg_srcset){
                            fullImg[0].srcset=bbg_xiv.getSrcset(data);
                        }else{
                            fullImg[0].removeAttribute("sizes");
                        }
                        fullTitle[0].textContent=bbg_xiv.getTitle(data);
                        fullCaption[0].textContent=bbg_xiv.getCaption(data);
                    } else {
                        // instantiate the alternate overlay
                        altOverlayView.model = { attributes: data };
                        $altInner.find( 'div.bbg_xiv-dense_alt_items' ).html( altOverlayView.render( true ) );
                        $altInner.find( 'span.bbg_xiv-item_value a' ).click( function( e ) {
                            // click on a elements should be ignored if the overlay is not locked, propagation will then lock the overlay as expected
                            if ( ! jQuery( this ).parents( 'div.bbg_xiv-dense_alt_inner' ).hasClass( 'bbg_xiv-locked' ) ) {
                                e.preventDefault();
                            }
                        } );
                    }
                } catch ( error ) {
                    console.log('##### broken 1');
                    if ( ! alt ) {
                        fullImg[0].src = img.src;
                    }
                }
                // show and fade in overlay
                outer.show();
                if ( ! alt ) {
                    // show full image overlay
                    $altInner.hide();
                    inner.show();
                } else {
                    // show alternate overlay
                    inner.hide();
                    $altInner.show();
                }
                if ( bbg_xiv.guiInterface === 'touch' ) {
                    // force hover effects on touchscreen
                    fullTitle.css({   color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                    fullCaption.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                }
                window.setTimeout(function(){
                    ( ! alt ? inner : $altInner ).css( 'opacity', '1.0' );
                    outer.css("opacity","0.93");
                },100);
                $caption.css( { display: 'block', opacity: '0.7' } );
                e.preventDefault();
                e.stopPropagation();
            }  // function showOverlay( e ) {
            jqGallery.find( 'a.bbg_xiv-carousel_info' ).click( function( e ) {
                pause( this );
                // show alt overlay
                showOverlay.call( this, e );
            } );
            jqGallery.find( 'button.bbg_xiv-dense_full_btn, button.bbg_xiv-dense_alt_btn' ).click( showOverlay );
            jqGallery.find( 'button.bbg_xiv-dense_alt_btn span.glyphicon' ).mouseenter( showOverlay );
        }   // function constructOverlay() {
        var titlesButton=jqGallery.parents("div.bbg_xiv-gallery").find("nav.navbar button.bbg_xiv-titles").hide();
        switch(view){
        case "Gallery":
            if(flags.indexOf("tiles")!==-1){
                bbg_xiv.renderTiles(jqGallery,images,flags);
                constructOverlay();
                titlesButton.show();
            } else if ( Modernizr.flexbox && Modernizr.flexwrap && ! window.bbg_xiv.bbg_xiv_disable_flexbox ) {
                bbg_xiv.renderFlex(jqGallery,images);
                constructOverlay();
            }else{
                bbg_xiv.renderBootstrapGallery(jqGallery,images);
            }
            window.setTimeout(function(){
                jQuery(window).resize();
            },100);
            break;
        case "Justified":
            bbg_xiv.renderJustified(jqGallery,images);
            constructOverlay();
            titlesButton.show();
            break;
        case "Carousel":
            if(flags.indexOf("embedded-carousel")!==-1){
                jqGallery.addClass("bbg_xiv-embedded_carousel");
            }else{
                jQuery("html").css("overflow-y","hidden");
            }
            var carouselId="bbg_xiv-carousel_"+gallery.id;
            bbg_xiv.renderCarousel(jqGallery,images,carouselId);
            constructOverlay();
            // pause() can be called from a button's event handler to pause the carousel, the argument is the button
            function pause(button){
                var carousel=jQuery(button).parents("div.carousel");
                carousel.carousel("pause");
                carousel.find("a.bbg_xiv-carousel_play span.glyphicon").removeClass("glyphicon-pause").addClass("glyphicon-play");
            }
            // Wireup the handlers - this must be done here as the elements in the carousel view are dynamically created
            // Carousel pause handler
            jqGallery.find("a.bbg_xiv-carousel_play").click(function(e){
                var carousel=jQuery(this).parents("div.carousel");
                var jqThis=jQuery(this).find("span.glyphicon");
                if(jqThis.hasClass("glyphicon-pause")){
                    pause(this);
                }else{
                    jqThis.removeClass("glyphicon-play").addClass("glyphicon-pause");
                    carousel.carousel("next");
                    carousel.carousel("cycle");
                }
                e.preventDefault();      
            });
            jqGallery.find( 'a.bbg_xiv-carousel_left, a.bbg_xiv-carousel_right' ).click(function() {
                pause(this);
            });
            // Carousel rewind handler
            jqGallery.find("a.bbg_xiv-carousel_first span.glyphicon,a.bbg_xiv-carousel_last span.glyphicon").click(function(e){
                pause( this );
                var carousel=jQuery(this).parents("div.carousel");
                if(jQuery(this.parentNode).hasClass("bbg_xiv-carousel_first")){
                    carousel.carousel(0);
                }else{
                    carousel.carousel(images.length-1);
                }
                e.preventDefault();      
            });
            jqGallery.find("a.bbg_xiv-carousel_close").click(function(e){
                // restore "Gallery View"
                jqGallery.removeClass("bbg_xiv-embedded_carousel");
                bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"),"Carousel");
                jQuery( 'html' ).css( 'overflow-y', '' );
                e.preventDefault();      
            });
            var input=jqGallery.find("div.bbg_xiv-jquery_mobile input[type='range']");
            input.slider();
            var prevChangeTime;
            var slideChange=false;   // change event triggered by a carousel slid event
            // update Bootstrap carousel slide when jQuery mobile slider changes
            // jQuery Mobile should change the "type" from "range" to "number" but does not so force it.
            // TODO: Find out why jQuery Mobile is not doing this here - maybe I am doing something wrong.
            input.attr( 'type', 'number' ).val( '1' ).change(function() {
                if(slideChange){
                    // ignore change events triggered by a carousel slid event
                    return;
                }
                prevChangeTime=Date.now();
                var carousel=jQuery(this).parents("div.carousel");
                pause(input);
                // Since change events will occur much too rapidly wait until they quiesce
                window.setTimeout(function(){
                    if(Date.now()-prevChangeTime>=500){
                        var i=input.val();
                        if(jQuery.isNumeric(i)){
                            i = parseInt( i, 10 ) - 1;
                            if(i>=0&&i<images.length){
                                carousel.carousel(i);
                                pause(input);
                            }
                        }
                    }
                },500);
            }).keypress(function(e){
                if(e.which===13){
                    jQuery(this).blur();
                    e.preventDefault();
                }
            }).focus(function() {
                pause(this);
            }).on( 'slidestart', function() {
                pause(this);
            });
            // update jQuery Mobile slider when Bootstrap carousel changes slide
            jqGallery.find("div.carousel").on("slide.bs.carousel slid.bs.carousel",function(e){
                slideChange=true;
                // update input element and trigger change event to force update of slider position
                jQuery( this ).find( 'div.bbg_xiv-jquery_mobile input[type="number"]' ).val( parseInt( e.relatedTarget.dataset.index, 10 ) + 1 ).change();
                slideChange=false;
            });
            if ( flags.indexOf( 'embedded-carousel' ) !== -1 ) {
                window.setTimeout( function() {
                    // the timeout is necessary to give browser time to render the image before the scrolling is done
                    var $gallery     = jqGallery.closest( 'div.bbg_xiv-gallery' );
                    var $divCarousel = jqGallery.find( 'div.carousel' );
                    if ( $gallery.hasClass( 'bbg_xiv-fullscreen_gallery' ) ) {
                        // full screen
                        if ( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ) {
                            // portrait mode
                        } else {
                            // landscape mode
                            $gallery.scrollTop( $gallery[0].scrollHeight - $gallery.height() - 50 + 0.05 * $divCarousel.height() );
                        }
                    } else {
                        // not full screen
                        if(window.matchMedia("(max-aspect-ratio:1/1)").matches){
                            // portrait mode
                            jQuery(window).scrollTop( $divCarousel.offset().top - jQuery(window).height()/6 );
                        }else{
                            // landscape mode
                            // If WordPress admin bar is showing on frontend page adjust for it.
                            var $body            = jQuery( 'body' );
                            var $adminBar        = jQuery( 'div#wpadminbar' );
                            var adminBarHeight   = $body.hasClass( 'admin-bar' ) && $adminBar.css( 'position' ) == 'fixed' ? $adminBar.outerHeight() : 0;
                            var bodyBeforeHeight = 0;
                            if ( $body.hasClass( 'bbg_xiv-twentysixteen_with_border' ) ) {
                                // Adjust for the black border in the WordPress TwentySixteen theme.
                                var bodyBeforeStyle = window.getComputedStyle( $body[0], ':before' );
                                bodyBeforeHeight    = bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' ? parseInt( bodyBeforeStyle.height, 10 ) : 0;
                            }
                            jQuery( window ).scrollTop( $divCarousel.offset().top - $divCarousel.outerHeight() / 18 - adminBarHeight - bodyBeforeHeight );
                        }
                    }
                }, 500 );
            }
            jQuery("#"+carouselId).carousel({interval:bbg_xiv.bbg_xiv_carousel_interval,pause:false});
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
            bbg_xiv.prettifyTabs(jqGallery,true);
            jqGallery.find( 'nav.navbar ul.nav li a' ).click(function() {
                if(!Modernizr.objectfit){
                    // Microsoft Edge does not support CSS object-fit so do the object fit with JavaScript code
                    jQuery(this.href.substr(this.href.lastIndexOf("#"))+" img").each(function(){
                        var img=this;
                        var i=0;
                        var j=0;
                        var r0;
                        window.setTimeout(function f(){
                            var w=img.naturalWidth;
                            var h=img.naturalHeight;
                            var parent=jQuery(img.parentNode.parentNode.parentNode);
                            var W=parent.width();
                            var H=0.7*jQuery(window).height();
                            if(!w||!h||!W||!H||W<64||H<64){
                                if(i++<16){
                                    window.setTimeout(f,250);
                                }
                                return;
                            }
                            var r=Math.max(w/W,h/H);
                            if(r<0.125||r>8){
                                return;
                            }
                            if(typeof r0!=='undefined'&&r===r0){
                                return;
                            }
                            w=Math.floor(w/r);
                            h=Math.floor(h/r);
                            jQuery(img).css({width:w+"px",height:h+"px"});
                            r0=r;
                            if(j++<16){
                                window.setTimeout(f,250);
                            }
                        },250);
                    });
                }
                window.setTimeout(function() {
                    // the timeout is necessary to give browser time to render the image before the scrolling is done
                    var $window    = jQuery( window );
                    var $gallery   = jqGallery.closest( 'div.bbg_xiv-gallery' );
                    var fullscreen = $gallery.hasClass( 'bbg_xiv-fullscreen_gallery' );
                    var $content   = jqGallery.find( 'div.tab-content' );
                    if( window.matchMedia( '(max-aspect-ratio:1/1)' ).matches ) {
                        // portrait mode
                        if ( fullscreen ) {
                            $gallery.scrollTop( $gallery.scrollTop() + $content.position().top  - $window.height() / 3 - 20 );
                        } else {
                            $window.scrollTop( $content.offset().top - $window.height() / 3 - 20 );
                        }
                    } else {
                        // landscape mode
                        if ( fullscreen ) {
                            $gallery.scrollTop( $gallery.scrollTop() + $content.position().top - 90 );
                        } else {
                            var $body            = jQuery( 'body' );
                            var $adminBar        = jQuery( 'div#wpadminbar' );
                            // If WordPress admin bar is showing on frontend page adjust for it.
                            var adminBarHeight   = $body.hasClass( 'admin-bar' ) && $adminBar.css( 'position' ) == 'fixed' ? $adminBar.outerHeight() : 0;
                            var bodyBeforeHeight = 0;
                            if ( $body.hasClass( 'bbg_xiv-twentysixteen_with_border' ) ) {
                                // Adjust for the black border in the WordPress TwentySixteen theme.
                                var bodyBeforeStyle = window.getComputedStyle( $body[0], ':before' );
                                bodyBeforeHeight    = bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' ? parseInt( bodyBeforeStyle.height, 10 ) : 0;
                            }
                            var offset              = $window.height() >= 480 ? 80 : 40;
                            $window.scrollTop( $content.offset().top - offset - adminBarHeight - bodyBeforeHeight );
                        }
                    }
                }, 500 );
            });
            // intercept clicks when images belong to gallery of galleries
            if(jqGallery.hasClass("bbg_xiv-gallery_icons_mode")){
                jqGallery.find("div.bbg_xiv-template_tabs_container div.tab-content figure.tab-pane a").click(function(e){
                    var galleries=jqGallery.parent().find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li.bbg_xiv-alt_gallery");
                    // only intercept clicks on the home gallery
                    if(galleries.filter(".bbg_xiv-alt_gallery_home").hasClass("active")){
                        galleries.find("a[data-view='gallery_"+this.dataset.galleryIndex+"']").click();
                        e.preventDefault();
                    }
                });
            }
            // make the "Tabs" brand clickable for mobile devices and send click to the toggle button
            jqGallery.find("a.bbg_xiv-tabs_brand").click(function(e){
                var toggle=jQuery(this).siblings("button.navbar-toggle");
                if(toggle.css("display")!=="none"){
                    toggle.click();
                }
                e.preventDefault();
            });
            if ( bbg_xiv.guiInterface === 'touch' ) {
                // For mobile devices if a scrollbar is needed then initially expand the tab navbar as the collapsed tab navbar is not user friendly on mobile devices
                jQuery( 'div.bbg_xiv-gallery nav.bbg_xiv-gallery_navbar' ).find( 'span.glyphicon-collapse-down' ).each(function(){
                    var jqThis=jQuery(this);
                    if(jqThis.css("display")!=="none"){
                        jqThis.click();
                    }
                });
            }
            break;
        case "Dense":
            jQuery("html").css("overflow-y","hidden");
            bbg_xiv.renderDense(jqGallery,images,"bbg_xiv-dense_"+gallery.id,"title");
            jqGallery.find("div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item")
                .css("width",100/bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns+"%");
            var normal=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-normal_color").css("background-color");
            var highlight=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-highlight_color").css("background-color");
            jqGallery.find("div.bbg_xiv-dense_titles ul li").hover(
                function() {
                    // highlight matching image
                    jQuery(this).css({"background-color":highlight});
                    var img=jQuery("div#"+this.id.replace("title","image")).css({"border-color":highlight});
                    // scroll images view if matching image is hidden
                    var top=img.position().top;
                    var height=img.height();
                    var bottom=top+height;
                    var div = img.parents( 'div.bbg_xiv-dense_images' );
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function() {
                    jQuery(this).css({"background-color":normal});
                    jQuery("div#"+this.id.replace("title","image")).css({"border-color":normal});
                }
            );
            jqGallery.find("div.bbg_xiv-dense_flex_item").hover(
                function() {
                    jQuery(this).css({"border-color":highlight});
                    // highlight matching title
                    var li=jQuery("li#"+this.id.replace("image","title")).css({"background-color":highlight});
                    // scroll titles view if matching title is hidden
                    var top=li.position().top;
                    var height=li.height();
                    var bottom=top+height;
                    var div = li.parents( 'div.bbg_xiv-dense_titles' );
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function() {
                    jQuery(this).css({"border-color":normal});
                    jQuery("li#"+this.id.replace("image","title")).css({"background-color":normal});
                }
            );
            jqGallery.find( 'input.bbg_xiv-dense_li_mode' ).change(function() {
                // show titles or captions depending on the radio buttons 
                if(this.checked){
                    var div=jQuery("div.bbg_xiv-dense_container div.bbg_xiv-dense_titles");
                    if(this.value==="title"){
                        div.find("span.bbg_xiv-dense_li_caption").hide();
                        div.find("span.bbg_xiv-dense_li_title").show();
                        div.find("span.bbg_xiv-dense_li_alt").hide();
                    }else if(this.value==="caption"){
                        div.find("span.bbg_xiv-dense_li_title").hide();
                        div.find("span.bbg_xiv-dense_li_caption").show();
                        div.find("span.bbg_xiv-dense_li_alt").hide();
                    }else if(this.value==="alt"){
                        div.find("span.bbg_xiv-dense_li_title").hide();
                        div.find("span.bbg_xiv-dense_li_caption").hide();
                        div.find("span.bbg_xiv-dense_li_alt").show();
                    }
                }
            });
            jqGallery.find( 'button.bbg_xiv-dense_info_btn' ).click( function( e ) {
                window.open( bbg_xiv.docUrl + '#view-dense', '_blank' );
                e.preventDefault();      
            } );
            jqGallery.find("button.bbg_xiv-dense_close_btn").click(function(e){
                // restore "Gallery View"
                bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"));
                jQuery( 'html' ).css( 'overflow-y', '' );
                e.preventDefault();      
            });
            constructOverlay();
            break;
        // TODO: Add entry for new views here
        case "Table":
            bbg_xiv.renderTable(jqGallery,images);
            break;
        default:
            break;
        }
        var menuItems=jQuery(gallery.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav ul.bbg_xiv-view_menu li").show();
        if ( bbg_xiv.guiInterface !== 'mouse' || jQuery( window ).width() < bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
            // for touch and small screen devices hide the dense menu item
            menuItems.filter( '.bbg_xiv-large_viewport_only' ).hide();
        }
        if(bbg_xiv.search[gallery.id]){
            // displaying search results so hide gallery headings
            jQuery("div#"+gallery.id+"-alt_gallery_heading").hide();
            // and show search results heading
            jQuery("div#"+gallery.id+"-heading").show();
        }else if(bbg_xiv.galleries[gallery.id]){
            // displaying a gallery so hide search results heading
            jQuery("div#"+gallery.id+"-heading").hide();
            var galleryOfGalleries=typeof bbg_xiv.images[gallery.id].models[0].attributes.gallery_index!=="undefined";
            var divAltGalleryHeading=jQuery("div#"+gallery.id+"-alt_gallery_heading");
            if(galleryOfGalleries){
                // show heads up for gallery of galleries
                divAltGalleryHeading.find("span.bbg_xiv-alt_gallery_heading").text(bbg_xiv.galleryOfGalleriesTitle);
                // click handler for gallery icon images
                jqGallery.find("a.bbg_xiv-gallery_icon").click(function(e){
                    jqGallery.parent().find( 'nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li.bbg_xiv-alt_gallery > a[data-view="gallery_' +
                        this.dataset.galleryIndex+'"]').click();
                    e.preventDefault();
                });
                // hide inappropriate menu items for gallery of galleries
                menuItems.filter(".bbg_xiv-hide_for_gallery_icons").hide();
            }
            if(bbg_xiv.galleries[gallery.id].view!=="gallery_home"||galleryOfGalleries){
                // and show title of alternate galleries or heads up for gallery of galleries; except hide title for home gallery; 
                divAltGalleryHeading.show();
            }
        }
    };
    
    // tabs are used twice - to show a list of gallery titles and a list of image titles. prettifyTabs() implements the common functionality for both
    bbg_xiv.prettifyTabs=function(jqGallery,initial){
        // Adjust the tab view according to its environment
        var navbar=jqGallery.find("nav.navbar");
        // In portrait mode show the tabs navbar uncollapsed
        var toggle=navbar.find("button.navbar-toggle");
        if(toggle.css("display")!=="none"){
            toggle.click();
        }
        // Hide the expand glyph and scrollbar if not needed.
        navbar.find("div.navbar-collapse ul.nav").each(function(){
            if(jQuery(this).height()-8<=jQuery(this.parentNode).height()){
                jQuery(this).parents("nav.navbar").find("span.glyphicon").hide();
                jQuery(this.parentNode).addClass("bbg_xiv-hide_scroll");
            }
        });
        if(initial){
            // Wireup the handlers - this must be done here as the elements in the tab view are dynamically created
            // Clicking the expand glpyh shows all the tabs.
            jqGallery.find( 'span.glyphicon-collapse-down, span.glyphicon-collapse-up' ).click(function() {
                var jqThis=jQuery(this);
                var navbar=jQuery(this.parentNode).find("div.navbar-collapse");
                if(jqThis.hasClass("glyphicon-collapse-down")){
                    jqThis.removeClass("glyphicon-collapse-down").addClass("glyphicon-collapse-up");
                    navbar.removeClass("bbg_xiv-closed").addClass("bbg_xiv-open");
                }else{
                    jqThis.removeClass("glyphicon-collapse-up").addClass("glyphicon-collapse-down");
                    navbar.removeClass("bbg_xiv-open").addClass("bbg_xiv-closed");
                }
            });
        }
    };

    bbg_xiv.resetGallery=function(gallery,currentView){
        // restore "Gallery View"
        var divGallery=gallery.find("div.bbg_xiv-gallery_envelope")[0];
        var galleryOfGalleries=typeof bbg_xiv.images[divGallery.id].models[0].attributes.gallery_index!=="undefined";
        var defaultView=bbg_xiv.getDefaultView(jQuery(divGallery),galleryOfGalleries);
        if(currentView==="Carousel"&&defaultView==="Carousel"){
            defaultView="Gallery";
        }
        bbg_xiv.renderGallery(divGallery,defaultView);
        var liSelectView=gallery.find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
        var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li.bbg_xiv-view").removeClass("active").filter(".bbg_xiv-view_"+defaultView.toLowerCase()).addClass("active");
        liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
        jQuery(window).resize();
    };
     
    // getting attributes indirectly through functions will make it possible for one template to be used for both the REST mode and the old proprietary mode

    // the fullSize parameter is the size of the non-iconic view of the image and should either "viewport" or "container"
    // the icon parameter is a boolean indicating that the src is for a thumbnail

    // getSrc() sets the src attribute of <img> HTML elements which will be ignored on modern browsers that support the srcset attribute
    // i.e. the source selection logic of getSrc() will only be used on older browsers

    bbg_xiv.getSrc=function(data,fullSize,icon){
        switch(bbg_xiv.bandwidth){
        case "normal":
            return bbg_xiv.bbg_xiv_wp_rest_api?data.source_url:data.url;
        case "low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_large_src[0];
                }else{
                    return data.bbg_medium_large_src[0];
                }
            }
            break;
        case "very low":
            if(icon){
                return data.bbg_thumbnail_src[0];
            }else{
                if(fullSize==="viewport"){
                    return data.bbg_medium_large_src[0];
                }else{
                    return data.bbg_medium_src[0];
                }
            }
        }
    };

    bbg_xiv.getSrcset=function(data){
        if(bbg_xiv.bbg_xiv_bandwidth!=='auto'){
            // really should removeAttribute but this should work
            return "";
        }
        return data.bbg_srcset;
    };

    bbg_xiv.getTitle=function(data){
        return (bbg_xiv.bbg_xiv_wp_rest_api?data.title.rendered:data.post_title).trim();
    };

    bbg_xiv.getCaption=function(data,noAlt){
        var caption=bbg_xiv.bbg_xiv_wp_rest_api?jQuery(data.caption.rendered).text():data.post_excerpt;
        if(!caption&&!noAlt){
            caption=bbg_xiv.getAlt(data,true);
        }
        return caption.trim();
    };

    bbg_xiv.getAlt=function(data,noCaption){
        var alt=bbg_xiv.bbg_xiv_wp_rest_api?data.alt_text:data.image_alt;
        if(!alt&&!noCaption){
            alt=bbg_xiv.getCaption(data,true);
        }
        return alt.trim();
    };

    bbg_xiv.getPostContent=function(data){
        var postContent=bbg_xiv.bbg_xiv_wp_rest_api?data.bbg_post_content:data.post_content;
        if(postContent){
            return postContent;
        }
        return bbg_xiv.getCaption(data);
    };
    
    bbg_xiv.getSizes=function(data,fullSize,icon){
        if(bbg_xiv.bbg_xiv_bandwidth!=='auto'){
            // really should removeAttribute but this should work
            return "";
        }
        if(!data){
            if(fullSize==="viewport"&&!icon){
                return "100vw";
            }
            return "50vw";
        }         
        if(!data.bbg_srcset){
            // really should removeAttribute but this should work
            return "";
        } else if ( icon ) {
            return '10vw';
        }else if(fullSize==="viewport"){
            return "90vw";
        }else if(fullSize==="container"){
            return data.bbg_xiv_container_width+"px";
        }else{
            return "50vw";
        }
    };

    try{
        window.localStorage.setItem("test","test");
        window.localStorage.removeItem("test");
        bbg_xiv.localStorageAvailable=true;
    }catch(e){
        bbg_xiv.localStorageAvailable=false;
    }
    
    bbg_xiv.setCookie=function(name,value,expires){
        if(bbg_xiv.localStorageAvailable){
            localStorage.setItem(name,value);
        }else{
            var d=new Date();
            d.setTime(d.getTime()+(expires*24*60*60*1000));
            document.cookie=name+"="+value+"; expires="+d.toUTCString()+"; path=/";
        }
    };

    bbg_xiv.getCookie=function(name){
        if(bbg_xiv.localStorageAvailable){
            return localStorage.getItem(name);
        }else{
            var cookie=document.cookie;
            cookie += ";";
            var start=cookie.indexOf(name+"=");
            if(start===-1){
                return null;
            }
            start+=name.length+1;
            var end=cookie.indexOf(";",start);
            if(end===-1){
                return null;
            }
            return cookie.substring(start,end);
        }
    };

    bbg_xiv.calcBreakpoints=function(){
        var minFlexWidth=window.bbg_xiv.bbg_xiv_flex_min_width;
        bbg_xiv.breakpoints=[
            {width:2*minFlexWidth,cssClass:"100"},
            {width:3*minFlexWidth,cssClass:"50"},
            {width:4*minFlexWidth,cssClass:"33_3333"},
            {width:5*minFlexWidth,cssClass:"25"},
            {width:6*minFlexWidth,cssClass:"20"},
            {width:7*minFlexWidth,cssClass:"16_6666"},
            {width:8*minFlexWidth,cssClass:"14_2857"},
            {width:9*minFlexWidth,cssClass:"12_5"},
            {width:10*minFlexWidth,cssClass:"11_1111"},
            {width:11*minFlexWidth,cssClass:"10"},
            {width:12*minFlexWidth,cssClass:"9_0909"},
            { width: 1000000, cssClass: '8_3333' }
        ];
    };

    bbg_xiv.getOptionsFromCookie=function(){
        // override options with cookie values if they exists
        var cookie=bbg_xiv.getCookie("bbg_xiv");
        if(cookie){
            var options=JSON.parse(cookie);
            var carousel_interval=options.bbg_xiv_carousel_interval;
            if(jQuery.isNumeric(carousel_interval)&&carousel_interval>=1000){
                bbg_xiv.bbg_xiv_carousel_interval=carousel_interval;
            }
            var flex_min_width=options.bbg_xiv_flex_min_width;
            if(jQuery.isNumeric(flex_min_width)&&flex_min_width>=32&&flex_min_width<=1024){
                bbg_xiv.bbg_xiv_flex_min_width=flex_min_width;
            }
            var miro_row_height = options.bbg_xiv_miro_row_height;
            if ( jQuery.isNumeric( miro_row_height ) && miro_row_height >= 32 && miro_row_height <= 512 ) {
                bbg_xiv.bbg_xiv_miro_row_height = miro_row_height;
            }
            var max_search_results=options.bbg_xiv_max_search_results;
            if(jQuery.isNumeric(max_search_results)&&max_search_results>=1&&max_search_results<1048576){
                bbg_xiv.bbg_xiv_max_search_results=max_search_results;
            }
            var flex_number_of_dense_view_columns=options.bbg_xiv_flex_number_of_dense_view_columns;
            if(jQuery.isNumeric(flex_number_of_dense_view_columns)&&flex_number_of_dense_view_columns>=2&&flex_number_of_dense_view_columns<=32){
                bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=flex_number_of_dense_view_columns;
            }
            if(typeof options.bbg_xiv_default_view==="string"){
                bbg_xiv.bbg_xiv_default_view=options.bbg_xiv_default_view;
                bbg_xiv.usingServerDefaultView=false;
            }else{
                bbg_xiv.usingServerDefaultView=true;
            }
            if(typeof options.bbg_xiv_bandwidth==="string"){
                bbg_xiv.bbg_xiv_bandwidth=options.bbg_xiv_bandwidth;
            }
            if(typeof options.bbg_xiv_interface==="string"){
                bbg_xiv.bbg_xiv_interface=options.bbg_xiv_interface;
            }
        }else{
            bbg_xiv.usingServerDefaultView=true;
            bbg_xiv.bbg_xiv_bandwidth="auto";
            bbg_xiv.bbg_xiv_interface="auto";
        }
        var userAgent=navigator.userAgent;
        if(userAgent.indexOf("Firefox")!==-1){
            bbg_xiv.browser="Firefox";
        }else{
            bbg_xiv.browser="";
        }
        // compute bandwidth if bandwidth is set to auto - currently since this is not done reliably the user should set the bandwidth option manually
        if(bbg_xiv.bbg_xiv_bandwidth==="auto"){
            if(Modernizr.lowbandwidth){
                // this uses navigator.connection which is only supported by Android
                bbg_xiv.bandwidth="very low";
            }else if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)){
                // determining bandwidth by device type is not reliable!
                bbg_xiv.bandwidth="very low";
            }else{
                bbg_xiv.bandwidth="low";
            }
        }else{
            bbg_xiv.bandwidth=bbg_xiv.bbg_xiv_bandwidth;
        }
        // compute interface if interface is auto
        if(bbg_xiv.bbg_xiv_interface==="auto"){
            if(Modernizr.touchevents){
                bbg_xiv.guiInterface = 'touch';
            }else{
                bbg_xiv.guiInterface = 'mouse';
            }
        }else{
            bbg_xiv.guiInterface = bbg_xiv.bbg_xiv_interface;
        }
        if(bbg_xiv.bbg_xiv_wp_rest_api){
            // WP REST API requires that per_page be between 1 and 100 inclusive
            bbg_xiv.wpRestApiMaxPerPage=100;
        }
    };
    
    bbg_xiv.getOptionsFromCookie();
    bbg_xiv.calcBreakpoints();
    
    jQuery(window).resize(function(){
        var breakpoints=bbg_xiv.breakpoints;
        jQuery("div.bbg_xiv-flex_container,div.bbg_xiv-gallery_container").each(function(){
            var jqThis=jQuery(this);
            var width=jqThis.width();
            var pxWidth;
            var minFlexWidthForCaption=window.bbg_xiv.bbg_xiv_flex_min_width_for_caption;
            if(jqThis.parents("div.bbg_xiv-gallery_envelope").hasClass("bbg_xiv-tiles_container")){
                // set tile width and height in pixels so that tiles cover the div exactly and completely
                pxWidth = Math.floor( width / Math.floor( width / window.bbg_xiv.bbg_xiv_flex_min_width ) ) - 1;
                jqThis.find("div.bbg_xiv-flex_item").css({width:pxWidth,height:pxWidth});
                if(pxWidth<minFlexWidthForCaption){
                    jqThis.find("div.bbg_xiv-flex_item figcaption").hide();
                }
            }else{
                // find the smallest percentage width that satisfies the minimum image width
                breakpoints.forEach(function(breakpoint){
                  jqThis.removeClass("bbg_xiv-flex_width_"+breakpoint.cssClass);
                });
                for(var i=0;i<breakpoints.length;i++){
                    if(width<breakpoints[i].width){
                        var cssClass=breakpoints[i].cssClass;
                        jqThis.addClass("bbg_xiv-flex_width_"+cssClass);
                        pxWidth = parseFloat( cssClass.replace( '_', '.' ) ) / 100.0 * width;
                        if(pxWidth<minFlexWidthForCaption){
                            jqThis.addClass("bbg_xiv-flex_no_caption");
                        }else{
                            jqThis.removeClass("bbg_xiv-flex_no_caption");
                        }
                        break;
                    }
                }
            }
        });
        if ( bbg_xiv.guiInterface === 'mouse' && jQuery( window ).width() >= bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").show();
        }else{
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").hide();
        }  
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var menuItems=jQuery(this.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav ul.bbg_xiv-view_menu li").show();
            if ( bbg_xiv.guiInterface !== 'mouse' || jQuery( window ).width() < bbg_xiv.bbg_xiv_flex_min_width_for_dense_view ) {
                // for touch and small screen devices hide the dense menu item
                menuItems.filter(".bbg_xiv-large_viewport_only").hide();
            }
            if(typeof bbg_xiv.images[this.id].models[0].attributes.gallery_index!=="undefined"){
                // for a gallery of gallery icons hide the carousel and the dense menu items
                menuItems.filter(".bbg_xiv-hide_for_gallery_icons").hide();
            }
        });
    });

    bbg_xiv.getDefaultView=function(gallery,galleryOfGalleries){
        var defaultView;
        if(galleryOfGalleries||(galleryOfGalleries===null&&gallery.hasClass("bbg_xiv-gallery_icons_mode"))){
            // for gallery of galleries always use the gallery view
            defaultView = 'Gallery';
        }else{
            // use class to set default view if it exists otherwise use the global value
            defaultView = bbg_xiv.bbg_xiv_default_view ? bbg_xiv.bbg_xiv_default_view : 'Gallery';
            if(bbg_xiv.usingServerDefaultView){
                if(gallery.hasClass("bbg_xiv-default_view_gallery")){
                    defaultView="Gallery";
                }else if(gallery.hasClass("bbg_xiv-default_view_justified")){
                    defaultView="Justified";
                }else if(gallery.hasClass("bbg_xiv-default_view_carousel")){
                    defaultView="Carousel";
                }else if(gallery.hasClass("bbg_xiv-default_view_tabs")){
                    defaultView="Tabs";
                }
            }
            gallery.parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery").find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view ul.bbg_xiv-view_menu li.bbg_xiv-view")
                .removeClass("active").filter(".bbg_xiv-view_"+defaultView.toLowerCase()).addClass("active");
        }
        return defaultView;
    };
    
    jQuery(document).ready(function(){
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var gallery=this;
            var defaultView=bbg_xiv.getDefaultView(jQuery(gallery),null);
            // prettify Galleries tabs
            bbg_xiv.prettifyTabs(jQuery(gallery.parentNode).find("div.bbg_xiv-container"),true);
            if(bbg_xiv.bbg_xiv_wp_rest_api){
                // If the schema is not in sessionStorage it will be loaded asynchronously so must use wp.api.loadPromise.done()
                wp.api.loadPromise.done(function(){
                    var images=bbg_xiv.images[gallery.id]=new wp.api.collections.Media();
                    images.reset(JSON.parse(bbg_xiv[gallery.id+"-data"]));
                    bbg_xiv.renderGallery(gallery,defaultView,["initial"]);
                    jQuery( gallery ).closest( 'div.bbg_xiv-gallery' ).addClass( 'bbg_xiv-home_gallery' );
                    jQuery(window).resize();
                });
            }else{
                bbg_xiv.renderGallery(gallery,defaultView,["initial"]);
                jQuery( gallery ).closest( 'div.bbg_xiv-gallery' ).addClass( 'bbg_xiv-home_gallery' );
            }
        });

        // wireup the event handlers
        // wireup the handler for view selection
        jQuery("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a").click(function(e){
            var view=this.dataset.view;
            var jqThis=jQuery(this);
            var li=jqThis.parent();
            var select=li.parent();
            var liSelectView=li.parents("li.bbg_xiv-select_view");
            var container=jqThis.parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery");
            var divGallery=container.find("div.bbg_xiv-gallery_envelope")[0];
            function handleResponse( r ) {
                if(jqueryLoading){
                    jQuery.mobile.loading("hide");
                    jQuery(divGallery).children().detach();
                }
                if(r){
                    galleries.images[view]=bbg_xiv.constructImages(divGallery);
                    galleries.view=view;
                    container.find("div#"+divGallery.id+"-alt_gallery_heading span.bbg_xiv-alt_gallery_heading").text(title);
                    bbg_xiv.renderGallery(divGallery,defaultView);
                }else{
                    jQuery(divGallery).empty().append('<h1 class="bbg_xiv-warning">'+bbg_xiv_lang["Nothing Found"]+'</h1>');
                }
                jQuery(divGallery.parentNode).find("nav.navbar form.bbg_xiv-search_form button").prop("disabled",false);
            }
            if(["Gallery","Carousel","Justified","Tabs","Dense"].indexOf(view)>=0){
                // view selected
                select.find("li.bbg_xiv-view").removeClass("active");
                li.addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(this.textContent);
                bbg_xiv.renderGallery(divGallery,view);
            }else{
                // gallery selected
                // delete search state if it exists
                if(bbg_xiv.search[divGallery.id]){
                    delete bbg_xiv.search[divGallery.id];
                }
                container.find("div#"+divGallery.id+"-alt_gallery_heading").hide();
                var title=this.textContent;
                var galleries=bbg_xiv.galleries[divGallery.id];
                var galleryOfGalleries=(view!=="gallery_home")?false:null;
                var defaultView=bbg_xiv.getDefaultView(jQuery(divGallery),galleryOfGalleries);
                select.find("li.bbg_xiv-view").removeClass("active");
                var liGallery=select.find("li.bbg_xiv-view_"+defaultView.toLowerCase()).addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(liGallery.text());
                select.find("li.bbg_xiv-alt_gallery").removeClass("active");
                li.addClass("active");
                if(galleries.images[view]){
                    // images were previously loaded so just restore  the collection
                    bbg_xiv.images[divGallery.id]=galleries.images[view];
                    galleries.view=view;
                    if(view!=="gallery_home"){
                        container.find("div#"+divGallery.id+"-alt_gallery_heading span.bbg_xiv-alt_gallery_heading").text(title);
                    }
                    bbg_xiv.renderGallery(divGallery,defaultView);
                    // update active in gallery tabs
                    container.find("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li").removeClass("active").find("a[data-view='"+view+"']").parent().addClass("active");
                    if ( view !== 'gallery_home' ) {
                        jqThis.closest( 'div.bbg_xiv-gallery' ).removeClass( 'bbg_xiv-home_gallery' );
                    } else {
                        jqThis.closest( 'div.bbg_xiv-gallery' ).addClass( 'bbg_xiv-home_gallery' );
                    }
                    e.preventDefault();
                    return;
                }
                // setup headings
                jQuery("div#"+divGallery.id+"-heading").hide();
                var jqueryLoading=true;
                try {
                    // There is a very rare failure of the following
                    jQuery(divGallery).empty().append(jQuery.mobile.loading("show",{text:"Loading... please wait.",textVisible:true,textonly:false}));
                } catch ( error ) {
                    console.log( error );
                    //console.log("jQuery.mobile.loading._widget=",jQuery.mobile.loading._widget);
                    jQuery(divGallery).empty().append('<h1 class="bbg_xiv-info">Loading... please wait.</h1>');
                    jQuery.mobile.loading._widget=undefined;
                    jqueryLoading=false;
                }
                var specifiers=this.dataset.specifiers;
                // extract individual gallery parameters
                if(bbg_xiv.bbg_xiv_wp_rest_api){
                    // translation maps for gallery shortcode parameter names and values to WP REST API option names and values
                    var nameMap={
                        id:"parent",
                        ids:"include",
                        bb_tags:"bb-tags"
                    };
                    // really should have a value map per parameter name but fortunately there are no overlaps
                    var valueMap={
                        ASC:"asc",
                        DESC:"desc"
                    };
                }
                var matches=specifiers.match(/(\w+)="([^"]+)"/g);
                var parameters={};
                var ids=false;
                matches.forEach(function(match){
                    var specifier=match.match(/(\w+)="([^"]+)"/);
                    if(bbg_xiv.bbg_xiv_wp_rest_api){
                        // translate gallery shortcode parameters to WP REST API options
                        parameters[nameMap[specifier[1]]?nameMap[specifier[1]]:specifier[1]]=valueMap[specifier[2]]?valueMap[specifier[2]]:specifier[2];
                        if(specifier[1]==="ids"){
                            ids=true;
                        }
                    }else{
                        parameters[specifier[1]]=specifier[2];
                    }
                });
                if ( bbg_xiv.bbg_xiv_wp_rest_api && ids && ! parameters.orderby ) {
                    // for ids use the explicit order in ids
                    parameters.orderby = 'include';
                }
                var form=jqThis.parents("div.navbar-collapse").first().find("form[role='search']");
                if(bbg_xiv.bbg_xiv_wp_rest_api){
                    // uses the WP REST API - requires the WP REST API plugin
                    var images=bbg_xiv.images[divGallery.id]=new wp.api.collections.Media();
                    images.once("sync",function(){
                        // the sync event will occur once only on the Backbone fetch of the collection
                        handleResponse(!!this.length);
                    },images);
                    // get the collection specified by the parameters
                    parameters.per_page=bbg_xiv.wpRestApiMaxPerPage;
                    images.fetch({
                        data:parameters,
                        success: function() {
                        },
                        error: function( c, r ) {
                            console.log("error:r=",r);
                            handleResponse(false);
                        }
                    });
                }else{
                    // old proprietary non REST way to load the Backbone image collection - does not require the WP REST API plugin
                    var postData={
                        action:"bbg_xiv_search_media",
                        _wpnonce:form.find("input[name='_wpnonce']").val(),
                        _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                    };
                    // add individual gallery parameters to post data
                    for(var parameter in parameters){
                        postData[parameter]=parameters[parameter];
                    }
                    jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                        if(r==="-1"){
                            r="";
                        }
                        bbg_xiv.images[divGallery.id]=null;
                        bbg_xiv[divGallery.id+"-data"]=r;
                        handleResponse(!!r);
                    });
                }
                // update active in gallery tabs
                jqThis.parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery").find("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li").removeClass("active")
                    .find("a[data-view='"+view+"']").parent().addClass("active");
                if ( view !== 'gallery_home' ) {
                    jqThis.closest( 'div.bbg_xiv-gallery' ).removeClass( 'bbg_xiv-home_gallery' );
                } else {
                    jqThis.closest( 'div.bbg_xiv-gallery' ).addClass( 'bbg_xiv-home_gallery' );
                }
            }
            e.preventDefault();
        });
        // wireup Galleries tabs 
        jQuery("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li a[data-view^='gallery_']").click(function(e){
            jQuery(this).parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery")
                .find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a[data-view='"+this.dataset.view+"']").click();
            e.preventDefault();
        });
        // wireup the handler for searching
        jQuery("form.bbg_xiv-search_form input[type='text']").keypress(function(e){
            if(e.which===13){
                // need to do this to hide virtual keyboard on mobile devices
                jQuery(this).blur();
            }
        });
        jQuery("form.bbg_xiv-search_form button").each(function(){
            var query;
            var offset;
            var page;
            var count=Number.MAX_SAFE_INTEGER;
            var pages=Number.MAX_SAFE_INTEGER;
            jQuery(this).click(function(e){
                var searchLimit = parseInt( bbg_xiv.bbg_xiv_max_search_results, 10 );
                if(bbg_xiv.bbg_xiv_wp_rest_api&&searchLimit>bbg_xiv.wpRestApiMaxPerPage){
                    searchLimit=bbg_xiv.wpRestApiMaxPerPage;
                }
                var searchBtn=jQuery(this);
                searchBtn.prop("disabled",true);
                var startSearch="search images on site";
                var continueSearch="continue current search";
                var divGallery=searchBtn.parents("div.bbg_xiv-gallery").find("div.bbg_xiv-gallery_envelope")[0];
                var form=searchBtn.parents("form[role='search']");
                var input=form.find("input[type='text']");
                var value=input.val();
                var postData;
                if(value){
                    // new search
                    query=value;
                    offset=0;
                    page=1;
                    // start new search history
                    bbg_xiv.search[divGallery.id]={history:[],index:-1,done:false};
                    // get count
                    if(!window.bbg_xiv.bbg_xiv_wp_rest_api){
                        postData = {
                            action:"bbg_xiv_search_media_count",
                            query:query,
                            _wpnonce:form.find("input[name='_wpnonce']").val(),
                            _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                        };
                        jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                            count = parseInt( r, 10 );
                        });
                    }
                }else if(typeof query==="undefined"){
                    e.preventDefault();
                    return;
                }
                // setup headings
                jQuery("div#"+divGallery.id+"-alt_gallery_heading").hide();
                var jqueryLoading=true;
                try {
                    // There is a very rare failure of the following
                    jQuery(divGallery).empty().append(jQuery.mobile.loading("show",{text:"Loading... please wait.",textVisible:true,textonly:false}));
                } catch ( error) {
                    console.log( error );
                    //console.log("jQuery.mobile.loading._widget=",jQuery.mobile.loading._widget);
                    jQuery(divGallery).empty().append('<h1 class="bbg_xiv-info">Loading... please wait.</h1>');
                    jQuery.mobile.loading._widget=undefined;
                    jqueryLoading=false;
                }
                jQuery(divGallery).parent().find("div.bbg_xiv-search_header").hide();
                function handleResponse(r){
                    if(jqueryLoading){
                        jQuery.mobile.loading("hide");
                        jQuery(divGallery).children().detach();
                    }
                    if(r){
                        var images=bbg_xiv.constructImages(divGallery);
                        var prevOffset=offset;
                        var prevQuery=query;
                        var heading=jQuery("div#"+divGallery.id+"-heading");
                        var search=bbg_xiv.search[divGallery.id];
                        if((window.bbg_xiv.bbg_xiv_wp_rest_api&&page<=pages)||(!window.bbg_xiv.bbg_xiv_wp_rest_api&&offset+images.models.length<count)){
                            // this search has more images
                            offset+=searchLimit;
                            input.val("").attr("placeholder",continueSearch);
                            heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",false);
                        }else{
                            // all search results have been returned
                            search.done=true;
                            input.attr("placeholder",startSearch).val(query);
                            query=undefined;
                            offset=undefined;
                            heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",true);
                        }
                        // search results uses a heading to show status
                        heading.find("span.bbg_xiv-search_heading_first").text(bbg_xiv_lang["Search Results for"]+" \""+prevQuery+"\"");
                        var title;
                        if(window.bbg_xiv.bbg_xiv_wp_rest_api){
                            title = bbg_xiv_lang.Page + ' ' + ( page - 1 ) + ' ' + bbg_xiv_lang.of + ' ' + ( pages !== Number.MAX_SAFE_INTEGER ? pages : '?' );
                        }else{
                            title = bbg_xiv_lang.Images + ' ' + ( prevOffset + 1 ) + ' ' + bbg_xiv_lang.to + ' ' + ( prevOffset + images.models.length ) + ' ' + bbg_xiv_lang.of +
                                ' ' + ( count !== Number.MAX_SAFE_INTEGER ? count: '?' );
                        }
                        heading.find("span.bbg_xiv-search_heading_second").text(title);
                        // maintain a history of all images returned by this search
                        search.history.push({images:images,title:title});
                        search.index=search.history.length-1;
                        var defaultView = bbg_xiv.getDefaultView( jQuery( divGallery ), null );
                        bbg_xiv.renderGallery( divGallery, defaultView );
                        heading.find("button.bbg_xiv-search_scroll_left").attr("disabled",search.index===0);
                    }else{
                        jQuery(divGallery).empty().append('<h1 class="bbg_xiv-warning">'+bbg_xiv_lang["Nothing Found"]+'</h1>');
                    }
                    var liSelectView=jQuery(divGallery.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                    var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li.bbg_xiv-view").removeClass("active").filter(".bbg_xiv-view_gallery").addClass("active");
                    liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
                    searchBtn.prop("disabled",false);
                }
                if(window.bbg_xiv.bbg_xiv_wp_rest_api){
                    // uses the WP REST API - requires the WP REST API plugin
                    var images=bbg_xiv.images[divGallery.id]=new wp.api.collections.Media();
                    images.once("sync",function(){
                        // the sync event will occur once only on the Backbone fetch of the collection
                        handleResponse(!!this.length);
                    },images);
                    // get the next part of the multi-part search result as specified by page
                    images.fetch({
                        data:{
                            search:query,
                            // 'bb-tags':query,
                            page:page++,
                            per_page:searchLimit
                        },
                        success:function(c,r,o){
                            // set the page variable from the page query parameter of the next page url in the HTTP header field "Link"
                            var link=o.xhr.getResponseHeader("link");
                            if(link){
                                var matches=link.match(/(\?|&)page=(\d+)(&[^>]+>;|>;)\s+rel="next"/);
                                if(matches&&matches.length===4&&jQuery.isNumeric(matches[2])){
                                    page = parseInt( matches[2], 10 );
                                }else{
                                    // no next page means search is complete
                                }
                            }else{
                                // no HTTP "Link" header field means only one page so search is complete
                            }
                            // get count and pages from the HTTP header fields: "X-WP-Total", "X-WP-TotalPages" via wp-api.js
                            count=images.state.totalObjects;
                            pages=images.state.totalPages;
                        },
                        error: function( c, r ) {
                            console.log("error:r=",r);
                            handleResponse(false);
                        }
                    });
                }else{
                    // old proprietary non REST way to load the Backbone image collection - does not require the WP REST API plugin
                    // get the next part of the multi-part search result
                    postData = {
                        action:"bbg_xiv_search_media",
                        query:query,
                        limit:searchLimit,
                        offset:offset,
                        _wpnonce:form.find("input[name='_wpnonce']").val(),
                        _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                    };
                    jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                        bbg_xiv.images[divGallery.id]=null;
                        bbg_xiv[divGallery.id+"-data"]=r;
                        handleResponse(!!r);
                    });
                }
                searchBtn.closest( 'div.bbg_xiv-gallery' ).removeClass( 'bbg_xiv-home_gallery' );
                e.preventDefault();
            });
        });
        jQuery("button.bbg_xiv-home").click(function(e){
            jQuery(this).parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery")
                .find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a[data-view='gallery_home']").click();
            e.preventDefault();
        });
        jQuery( 'button.bbg_xiv-fullscreen' ).click(function() {
            var $gallery = jQuery( this ).closest( 'div.bbg_xiv-gallery' );
            if ( $gallery.hasClass( 'bbg_xiv-fullscreen_gallery' ) ) {
                $gallery.removeClass( 'bbg_xiv-fullscreen_gallery' );
                jQuery( 'html' ).removeClass( 'bbg_xiv-fullscreen_gallery' );
            } else {
                $gallery.addClass( 'bbg_xiv-fullscreen_gallery' );
                jQuery( 'html' ).addClass( 'bbg_xiv-fullscreen_gallery' );
            }
            jQuery( window ).resize();
        });
        jQuery( 'button.bbg_xiv-titles' ).click(function() {
            var galleryContainer   = jQuery( this ).closest( 'div.bbg_xiv-bootstrap.bbg_xiv-gallery' );
            var container          = galleryContainer.find( 'div.bbg_xiv-flex_container' );
            if(container.length){
                var figure=container.find("div.bbg_xiv-flex_item figure");
                var caption=figure.find("figcaption");
                if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                    caption.hide( 1000 );
                    galleryContainer.removeClass( 'bbg_xiv-caption_visible' );
                } else {
                    caption.show( 1000 );
                    galleryContainer.addClass( 'bbg_xiv-caption_visible' );
                }
                if(container.hasClass("bbg_xiv-contain")){
                    // in tiles contain mode center image if title not displayed
                    if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                        figure.find("img").removeClass("bbg_xiv-vertical_center");
                    }else{
                        figure.find("img").addClass("bbg_xiv-vertical_center");
                    }
                }
                return;
            }
            container=galleryContainer.find( 'div.bbg_xiv-justified_container' );
            if(container.length){
                if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                    galleryContainer.removeClass( 'bbg_xiv-caption_visible' );
                } else {
                    galleryContainer.addClass( 'bbg_xiv-caption_visible' );
                }
                window.setTimeout(function(){
                    var caption=container.find("div.caption");
                    if ( galleryContainer.hasClass( 'bbg_xiv-caption_visible' ) ) {
                        caption.css({ display: 'block', opacity: '0.7' });
                    } else {
                        caption.css({ display: 'none',  opacity: '0.0' });
                    }
                },1000);
            }
        });
        // wireup the handler for setting options
        jQuery("button.bbg_xiv-configure").click(function(e){
            divConfigure.find("input#bbg_xiv-carousel_delay").val(bbg_xiv.bbg_xiv_carousel_interval);
            divConfigure.find("input#bbg_xiv-min_image_width").val(bbg_xiv.bbg_xiv_flex_min_width);
            divConfigure.find( 'input#bbg_xiv-miro_row_height' ).val( bbg_xiv.bbg_xiv_miro_row_height );
            divConfigure.find("input#bbg_xiv-max_search_results").val(bbg_xiv.bbg_xiv_max_search_results);
            divConfigure.find("input#bbg_xiv-columns_in_dense_view").val(bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns);
            divConfigure.find("input[name='bbg_xiv-default_view']").prop("checked",false);
            if(bbg_xiv.usingServerDefaultView===false){
                divConfigure.find("input[name='bbg_xiv-default_view'][value='"+bbg_xiv.bbg_xiv_default_view+"']").prop("checked",true);
            }
            divConfigure.find("input[name='bbg_xiv-bandwidth']").prop("checked",false);
            divConfigure.find("input[name='bbg_xiv-bandwidth'][value='"+bbg_xiv.bbg_xiv_bandwidth+"']").prop("checked",true);
            divConfigure.find("input[name='bbg_xiv-interface']").prop("checked",false);
            divConfigure.find("input[name='bbg_xiv-interface'][value='"+bbg_xiv.bbg_xiv_interface+"']").prop("checked",true);
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.show();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.show();
            e.preventDefault();
        });
        var divConfigure=jQuery(".bbg_xiv-configure_inner");
        divConfigure.find( 'input[type="number"]#bbg_xiv-max_search_results' ).change(function() {
            // max seems to be broken so fix with javascript
            var jqThis=jQuery(this);
            var max     = parseInt( jqThis.val(), 10 );
            var attrMax = parseInt( jqThis.attr( 'max' ), 10 );
            if(bbg_xiv.bbg_xiv_wp_rest_api&&attrMax>bbg_xiv.wpRestApiMaxPerPage){
                // WP REST API requires that per_page be between 1 and 100 inclusive
                attrMax=bbg_xiv.wpRestApiMaxPerPage;
            }
            if(max>attrMax){
                jqThis.val(attrMax);
            }
        });
        divConfigure.find( 'button.bbg_xiv-configure_close,button.bbg_xiv-cancel_options' ).click(function() {
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
        });
        divConfigure.find("button.bbg_xiv-help_options").click(function(e){
            window.open(bbg_xiv.helpOptionsUrl,"_blank");
            e.preventDefault();
        });
        divConfigure.find("button.bbg_xiv-save_options").click(function(e){
            // save the options
            bbg_xiv.bbg_xiv_carousel_interval=divConfigure.find("input#bbg_xiv-carousel_delay").val();
            bbg_xiv.bbg_xiv_flex_min_width=divConfigure.find("input#bbg_xiv-min_image_width").val();
            bbg_xiv.bbg_xiv_miro_row_height = divConfigure.find( 'input#bbg_xiv-miro_row_height' ).val();
            bbg_xiv.bbg_xiv_max_search_results=divConfigure.find("input#bbg_xiv-max_search_results").val();
            bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=divConfigure.find("input#bbg_xiv-columns_in_dense_view").val();
            var defaultView=divConfigure.find("input[name='bbg_xiv-default_view']:checked").val();
            if(defaultView){
                bbg_xiv.bbg_xiv_default_view=defaultView;
                bbg_xiv.usingServerDefaultView=false;
            }else{
                bbg_xiv.usingServerDefaultView=true;
            }
            bbg_xiv.bbg_xiv_bandwidth=divConfigure.find("input[name='bbg_xiv-bandwidth']:checked").val();
            bbg_xiv.bbg_xiv_interface=divConfigure.find("input[name='bbg_xiv-interface']:checked").val();
            var cookie={
                bbg_xiv_carousel_interval:bbg_xiv.bbg_xiv_carousel_interval,
                bbg_xiv_flex_min_width:bbg_xiv.bbg_xiv_flex_min_width,
                bbg_xiv_miro_row_height: bbg_xiv.bbg_xiv_miro_row_height,
                bbg_xiv_max_search_results:bbg_xiv.bbg_xiv_max_search_results,
                bbg_xiv_flex_number_of_dense_view_columns:bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
                bbg_xiv_bandwidth:bbg_xiv.bbg_xiv_bandwidth,
                bbg_xiv_interface:bbg_xiv.bbg_xiv_interface
            };
            if(bbg_xiv.usingServerDefaultView===false){
                cookie.bbg_xiv_default_view=bbg_xiv.bbg_xiv_default_view;
            }
            cookie=JSON.stringify(cookie);
            bbg_xiv.setCookie("bbg_xiv",cookie,30);
            bbg_xiv.getOptionsFromCookie();
            bbg_xiv.calcBreakpoints();
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
            // redisplay the "Gallery" view using the new option values
            bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"));
            e.preventDefault();
        });
        jQuery("button.bbg_xiv-help").click(function(e){
            var view = jQuery( this ).closest( 'div.navbar-collapse' ).find( 'ul.navbar-nav li.bbg_xiv-select_view ul.bbg_xiv-view_menu li.bbg_xiv-view.active a' ).data( 'view' );
            window.open( bbg_xiv.docUrl + '#view-' + view.toLowerCase(), '_blank' );
            this.blur();
            e.preventDefault();
        });
        // wireup the handler for scrolling through search results
        jQuery( 'div.bbg_xiv-search_header button.bbg_xiv-search_scroll_left,div.bbg_xiv-search_header button.bbg_xiv-search_scroll_right' ).click(function() {
            var jqThis = jQuery( this );
            var heading=jqThis.parents("div.bbg_xiv-search_header");
            var id=heading.attr("id").replace("-heading","");
            var gallery=heading.parents("div.bbg_xiv-gallery");
            var search=bbg_xiv.search[id];
            if(jqThis.hasClass("bbg_xiv-search_scroll_left")){
                if(search.index>0){
                    if(!--search.index){
                        jqThis.attr("disabled",true);
                    }
                    heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",false);
                }else{
                }
            }else{
                if(search.index<search.history.length-1){
                    ++search.index;
                    if(search.index===search.history.length-1&&search.done){
                        heading.find("button.bbg_xiv-search_scroll_right").attr("disabled",true);
                    }
                    heading.find("button.bbg_xiv-search_scroll_left").attr("disabled",false);
                }else{
                    // load the next part of the multi-part search
                    gallery.find("nav.navbar form.bbg_xiv-search_form button[type='submit']").click();
                    return;
                }
            }
            if(search.index>=0&&search.index<search.history.length){
                var history=search.history[search.index];
                bbg_xiv.images[id]=history.images;
                heading.find("span.bbg_xiv-search_heading_second").text(history.title);
                var divGallery  = gallery.find( 'div.bbg_xiv-gallery_envelope' );
                var defaultView = bbg_xiv.getDefaultView( divGallery, null );
                bbg_xiv.renderGallery( divGallery[0], defaultView );
                // reset navbar to "Gallery" view
                var liSelectView=gallery.find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li.bbg_xiv-view").removeClass("active").filter(".bbg_xiv-view_gallery").addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
            }
        });
        // make the "Images" brand clickable for mobile devices and send click to the toggle button
        jQuery("a.bbg_xiv-images_brand,a.bbg_xiv-tabs_brand").click(function(e){
            var toggle=jQuery(this).siblings("button.navbar-toggle");
            if(toggle.css("display")!=="none"){
                toggle.click();
            }
            e.preventDefault();
        });
        // wireup mobile only events
        jQuery(window).on("swipe",function(e){
            var carousel=jQuery("div.bbg_xiv-gallery_envelope div.carousel");
            if(carousel.length){
                // ignore swipes near carousel slider
                if(e.pageY>jQuery("div.carousel-indicators").offset().top-50){
                    return;
                }
                if(e.swipestop.coords[0]>e.swipestart.coords[0]){
                    carousel.find("a.left.carousel-control").click();
                }else{
                    carousel.find("a.right.carousel-control").click();
                }
                return;
            }
            // hide/show title and caption of overlay on swipe
            var inner=jQuery("div.bbg_xiv-dense_inner");
            inner.find( '.bbg_xiv-dense_title, .bbg_xiv-dense_caption' ).each(function() {
                var $this = jQuery( this );
                var color = $this.css( 'color' );
                if ( color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)' ) {   // TODO: find safer test for transparent
                    $this.css({ color: 'transparent',      textShadow: 'none'             });
                }else{
                    $this.css({ color: bbg_xiv.titleColor, textShadow: bbg_xiv.titleShadow});
                }
            });
        });
        jQuery( window ).on( 'orientationchange', function() {
            var $body = jQuery( 'body' );
            if ( $body.hasClass( 'admin-bar' ) && jQuery( 'div#wpadminbar' ).css( 'position' ) == 'fixed' ) {
                $body.addClass( 'bbg_xiv-fixed_admin_bar' );
            } else {
                $body.removeClass( 'bbg_xiv-fixed_admin_bar' );
            }
            jQuery("div.bbg_xiv-gallery").each(function(){
                bbg_xiv.resetGallery(jQuery(this));
            });
        });
        if(!bbg_xiv.bbg_xiv_wp_rest_api){
            // if using the REST API cannot do resize here since the models may be asynchronously created
            jQuery(window).resize();
        }
        // If TwentySixteen theme has border then add class to body element to indicate this.
        var $body            = jQuery( 'body' );
        var bodyBeforeStyle  = window.getComputedStyle( $body[0], ':before' );
        if ( bodyBeforeStyle && bodyBeforeStyle.position === 'fixed' && bodyBeforeStyle.zIndex > 0 ) {
            var height = parseInt( bodyBeforeStyle.height, 10 );
            if ( height > 8 && height < 64 ) {
                $body.addClass( 'bbg_xiv-twentysixteen_with_border' );
            }
        }
        if ( $body.hasClass( 'admin-bar' ) && jQuery( 'div#wpadminbar' ).css( 'position' ) == 'fixed' ) {
            $body.addClass( 'bbg_xiv-fixed_admin_bar' );
        }
        
    });   // jQuery(document).ready(function(){

    //cookie test code
    //window.alert("bbg_xiv_test="+bbg_xiv.getCookie("bbg_xiv_test"));
    //bbg_xiv.setCookie("bbg_xiv_test",window.prompt("bbg_xiv_test","null"));
}());

