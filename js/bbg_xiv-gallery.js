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
    bbg_xiv.helpMVPUrl="https://bbfgallery.wordpress.com/#navbar";
    bbg_xiv.helpOptionsUrl="https://bbfgallery.wordpress.com/#options";
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
    }

    bbg_xiv.renderFlex=function(container,collection){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_flex_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
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
        if(bbg_xiv.interface==="touch"){
            container.find("div.bbg_xiv-flex_container div.bbg_xiv-flex_item div.bbg_xiv-dense_full_btn").addClass("bbg_xiv-touch");
        }
    }

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
    }

    bbg_xiv.renderCarousel = function( container, collection, id ) {
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_carousel_item").html(),null,bbg_xiv.templateOptions);
        var bulletsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.index=index;
            imageView.model=model;
            var active=index ===0?' class="active"':'';
            bulletsHtml+='<li data-target="#'+id+'" data-slide-to="'+index+'"'+active+'></li>';
            imagesHtml+=imageView.render(true);
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:id,
                    size:collection.length,
                    bullets:bulletsHtml,
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_carousel_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find( "div.carousel.slide"));
    }

    bbg_xiv.renderTabs=function(container,collection,id){
        var tabView=new bbg_xiv.ImageView();
        tabView.template=_.template(jQuery("script#bbg_xiv-template_tabs_tab").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_tabs_item").html(),null,bbg_xiv.templateOptions);
        var tabsHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.index=index;
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
    }

    bbg_xiv.renderDense=function(container,collection,id,mode){
        var titleView=new bbg_xiv.ImageView();
        titleView.template=_.template(jQuery("script#bbg_xiv-template_dense_title").html(),null,bbg_xiv.templateOptions);
        var imageView=new bbg_xiv.ImageView();
        imageView.template=_.template(jQuery("script#bbg_xiv-template_dense_image").html(),null,bbg_xiv.templateOptions);
        var titlesHtml="";
        var imagesHtml="";
        collection.forEach(function(model,index){
            model.attributes.mode=mode;
            model.attributes.index=index;
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
    }
    
    // renderGeneric() may work unmodified with your template.
    // Otherwise you can use it as a base for a render function specific to your template.
    // See renderGallery(), renderCarousel() or renderTabs() - all of which need some special HTML to work correctly.

    bbg_xiv.renderGeneric=function(container,collection,template){
        var imageView=new bbg_xiv.ImageView();
        // attach template to imageView not ImageView.prototype since template is specific to imageView
        imageView.template=_.template( jQuery("script#bbg_xiv-template_"+template+"_item").html(),null,bbg_xiv.templateOptions);
        var imagesHtml="";
        collection.forEach(function(model,index){
            imageView.model=model;
            imagesHtml+=imageView.render(true);
        } );
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
    }

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
        if(window.bbg_xiv.bbg_xiv_wp_rest_api){
            var images=bbg_xiv.images[gallery.id];
        }else{
            var images=bbg_xiv.images[gallery.id]=new bbg_xiv.Images();
            try{
                images.reset(JSON.parse(window.bbg_xiv[gallery.id+"-data"]));
            }catch(e){
                console.log("reset(JSON.parse()) failed:",e);
                return images;
            }
        }
        images.id=gallery.id;
        // find closest match for thumbnail, small, medium and large
        var widths=[Math.log(bbg_xiv.bbg_xiv_flex_min_width),Math.log(768),Math.log(992),Math.log(1200)];
        images.models.forEach(function(model){
            var diffs=[Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
            var urls=[];
            var attributes=model.attributes;
            if(bbg_xiv.bbg_xiv_wp_rest_api){
                var sizes=attributes.media_details.sizes;
            }else{
                if(!attributes.sizes){
                    attributes.sizes={};
                }
                var sizes=attributes.sizes;
                sizes.full={url:attributes.url,width:attributes.width,height:attributes.height};
            }
            Object.keys(sizes).forEach(function(size){
                var image=sizes[size];
                widths.forEach(function(width,i){
                    var diff=Math.abs(Math.log(image.width)-width);
                    if(diff<diffs[i]){
                        diffs[i]=diff;
                        urls[i]=bbg_xiv.bbg_xiv_wp_rest_api?image.source_url:image.url;
                    }
                });
            });
            model.attributes.bbg_xiv_thumbnail_url=urls[0];
            model.attributes.bbg_xiv_small_url=urls[1];
            model.attributes.bbg_xiv_medium_url=urls[2];
            model.attributes.bbg_xiv_large_url=urls[3];
        });
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
        function constructOverlay(){
            // gallery or dense view shows a full browser viewport view of an image when its fullscreen glyph is clicked
            var outer=jqGallery.find("div.bbg_xiv-dense_outer");
            var inner=jqGallery.find("div.bbg_xiv-dense_inner").click(function(e){
                // fade out and hide overlay
                inner.css("opacity","0.0");
                outer.css("opacity","0.0");
                window.setTimeout(function(){
                    inner.hide();
                    outer.hide();
                },2000);
            });
            var fullImg=inner.find("img");
            var fullLarge=inner.find("source[media='(min-width:1200px)']")[0];
            var fullMedium=inner.find("source[media='(min-width:992px)']")[0];
            var fullSmall=inner.find("source[media='(max-width:991px)']")[0];
            var fullTitle=inner.find("h1.bbg_xiv-dense_title");
            var fullTitleColor=fullTitle.css("color");
            var fullTitleShadow=fullTitle.css("text-shadow");
            var fullCaption=inner.find("h1.bbg_xiv-dense_caption");
            var fullCaptionColor=fullCaption.css("color");
            var fullCaptionShadow=fullCaption.css("text-shadow");
            if(bbg_xiv.interface==="touch"){
                // force hover effects on touchscreen
                fullTitle.css({color:fullTitleColor,textShadow:fullTitleShadow});
                fullCaption.css({color:fullCaptionColor,textShadow:fullCaptionShadow});
            }else{
                // only show title on mouseover
                fullImg.hover(
                    function(){
                        fullTitle.css({color:fullTitleColor,textShadow:fullTitleShadow});
                        fullCaption.css({color:fullCaptionColor,textShadow:fullCaptionShadow});
                    },
                    function(){
                        fullTitle.css({color:"transparent",textShadow:"none"});
                        fullCaption.css({color:"transparent",textShadow:"none"});
                    }
                );
            }
            jqGallery.find("button.bbg_xiv-dense_full_btn").click(function(e){
                var jqThis=jQuery(this);
                // the buttons are of three different types so the associated image is found differently depending on the type
                if(jqThis.hasClass("bbg_xiv-dense_from_image")){
                    var img=jQuery(this).parents("div.bbg_xiv-dense_flex_item").find("img")[0];
                }else if(jqThis.hasClass("bbg_xiv-dense_from_title")){
                    var img=jQuery("div#"+this.parentNode.id.replace("title","image")).find("img")[0];
                }else if(jqThis.hasClass("bbg_xiv-flex_from_image")){
                    var img=jQuery(this).parents("div.bbg_xiv-flex_item").find("img")[0];
                }
                fullImg[0].src=img.src;
                fullLarge.srcset=img.src;
                fullMedium.srcset=img.src;
                fullSmall.srcset=img.src;
                // try and replace img src with better match 
                try{
                    var imageId=img.dataset.bbg_xivImageId;
                    if(imageId){
                        var galleryId=jQuery(img).parents("div[data-bbg_xiv-gallery-id]")[0].dataset.bbg_xivGalleryId;
                        if(galleryId){
                            var urls=bbg_xiv.getImageUrl(bbg_xiv.images[galleryId].get(imageId).attributes);
                            fullImg[0].src=urls.src;
                            fullLarge.srcset=urls.src;
                            fullMedium.srcset=urls.medium;
                            fullSmall.srcset=urls.small;
                        }
                    }
                }catch(e){
                }
                fullTitle[0].textContent=img.alt;
                fullCaption[0].textContent=img.title;
                // show and fade in overlay
                outer.show();
                inner.show();
                window.setTimeout(function(){
                    inner.css("opacity","1.0");
                    outer.css("opacity","0.93");
                },100);
                e.preventDefault();
                e.stopPropagation();
            });
        }
        var titlesButton=jqGallery.parents("div.bbg_xiv-gallery").find("nav.navbar button.bbg_xiv-titles").hide();
        switch(view){
        case "Gallery":
            if(flags.indexOf("tiles")!==-1){
                bbg_xiv.renderTiles(jqGallery,images,flags);
                constructOverlay();
                titlesButton.show();
            } else if(Modernizr.flexbox&&Modernizr.flexwrap&&!window.bbg_xiv['bbg_xiv_disable_flexbox']){
                bbg_xiv.renderFlex(jqGallery,images);
                constructOverlay();
            }else{
                bbg_xiv.renderBootstrapGallery(jqGallery,images);
            }
            jQuery(window).resize();
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
                        jqGallery.parent().find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li.bbg_xiv-alt_gallery > a[data-view='gallery_"
                            +this.dataset.galleryIndex+"']").click();
                        e.preventDefault();
                    });
                }
                if(bbg_xiv.galleries[gallery.id].view!=="gallery_home"||galleryOfGalleries){
                    // and show title of alternate galleries or heads up for gallery of galleries; except hide title for home gallery; 
                    divAltGalleryHeading.show();
                }
            }
            break;
        case "Carousel":
            var overflow=jQuery("html").css("overflow-y");
            if(flags.indexOf("embedded-carousel")!==-1){
                jqGallery.addClass("bbg_xiv-embedded_carousel");
            }else{
                jQuery("html").css("overflow-y","hidden");
            }
            var carouselId="bbg_xiv-carousel_"+gallery.id;
            bbg_xiv.renderCarousel(jqGallery,images,carouselId);
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
            jqGallery.find("a.bbg_xiv-carousel_left,a.bbg_xiv-carousel_right").click(function(e){
                pause(this);
            });
            // Carousel rewind handler
            jqGallery.find("a.bbg_xiv-carousel_first span.glyphicon,a.bbg_xiv-carousel_last span.glyphicon").click(function(e){
                pause(this)
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
                bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"));
                jQuery("html").css("overflow-y",overflow);
                e.preventDefault();      
            });
            var input=jqGallery.find("div.bbg_xiv-jquery_mobile input[type='range']");
            input.slider();
            var prevChangeTime;
            var slideChange=false;   // change event triggered by a carousel slid event
            // update Bootstrap carousel slide when jQuery mobile slider changes
            // jQuery Mobile should change the "type" from "range" to "number" but does not so force it.
            // TODO: Find out why jQuery Mobile is not doing this here - maybe I am doing something wrong.
            input.attr("type","number").val("1").change(function(e){
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
                            i=parseInt(i)-1;
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
            }).focus(function(e){
                pause(this);
            }).on("slidestart",function(e){
                pause(this);
            });
            // update jQuery Mobile slider when Bootstrap carousel changes slide
            jqGallery.find("div.carousel").on("slide.bs.carousel slid.bs.carousel",function(e){
                slideChange=true;
                // update input element and trigger change event to force update of slider position
                jQuery(this).find("div.bbg_xiv-jquery_mobile input[type='number']").val(parseInt(e.relatedTarget.dataset.index,10)+1).change();
                slideChange=false;
            });
            jQuery("#"+carouselId).carousel({interval:bbg_xiv.bbg_xiv_carousel_interval,pause:false});
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
            bbg_xiv.prettifyTabs(jqGallery,true);
            jqGallery.find("nav.navbar ul.nav li a").click(function(e){
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
                window.setTimeout(function(){
                    // the timeout is necessary to give browser time to render the image before the scrolling is done
                    if(window.matchMedia("(max-aspect-ratio:1/1)").matches){
                        // portrait mode
                        jQuery(window).scrollTop(jqGallery.find("div.tab-content").offset().top-jQuery(window).height()/3-20);
                    }else{
                        // landscape mode
                        jQuery(window).scrollTop(jqGallery.find("div.tab-content").offset().top-80);
                    }
                },500);
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
            if( bbg_xiv.interface==="touch"){
                // For mobile devices if a scrollbar is needed then initially expand the tab navbar as the collapsed tab navbar is not user friendly on mobile devices
                navbar.find("span.glyphicon-collapse-down").each(function(){
                    var jqThis=jQuery(this);
                    if(jqThis.css("display")!=="none"){
                        jqThis.click();
                    }
                });
            }
            break;
        case "Dense":
            var overflow=jQuery("html").css("overflow-y");
            jQuery("html").css("overflow-y","hidden");
            bbg_xiv.renderDense(jqGallery,images,"bbg_xiv-dense_"+gallery.id,"title");
            jqGallery.find("div.bbg_xiv-dense_images div.bbg_xiv-dense_flex_images div.bbg_xiv-dense_flex_item")
                .css("width",100/bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns+"%");
            var normal=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-normal_color").css("background-color");
            var highlight=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-highlight_color").css("background-color");
            jqGallery.find("div.bbg_xiv-dense_titles ul li").hover(
                function(e){
                    // highlight matching image
                    jQuery(this).css({"background-color":highlight});
                    var img=jQuery("div#"+this.id.replace("title","image")).css({"border-color":highlight});
                    // scroll images view if matching image is hidden
                    var top=img.position().top;
                    var height=img.height();
                    var bottom=top+height;
                    var div=img.parents("div.bbg_xiv-dense_images")
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function(e){
                    jQuery(this).css({"background-color":normal});
                    jQuery("div#"+this.id.replace("title","image")).css({"border-color":normal});
                }
            );
            jqGallery.find("div.bbg_xiv-dense_flex_item").hover(
                function(e){
                    jQuery(this).css({"border-color":highlight});
                    // highlight matching title
                    var li=jQuery("li#"+this.id.replace("image","title")).css({"background-color":highlight});
                    // scroll titles view if matching title is hidden
                    var top=li.position().top;
                    var height=li.height();
                    var bottom=top+height;
                    var div=li.parents("div.bbg_xiv-dense_titles")
                    var scrollTop=div.scrollTop();
                    var scrollHeight=div.height();
                    if(top<0){
                        div.scrollTop(scrollTop+top-scrollHeight/2-height/2);
                    }else if(bottom>scrollHeight){
                        div.scrollTop(scrollTop+(bottom-scrollHeight)+scrollHeight/2-height/2);
                    }
                },
                function(e){
                    jQuery(this).css({"border-color":normal});
                    jQuery("li#"+this.id.replace("image","title")).css({"background-color":normal});
                }
            );
            jqGallery.find("input.bbg_xiv-dense_li_mode").change(function(e){
                // show titles or captions depending on the radio buttons 
                if(this.checked){
                    var div=jQuery("div.bbg_xiv-dense_container div.bbg_xiv-dense_titles");
                    if(this.value==="title"){
                        div.find("span.bbg_xiv-dense_li_caption").hide();
                        div.find("span.bbg_xiv-dense_li_title").show();
                    }else if(this.value==="caption"){
                        div.find("span.bbg_xiv-dense_li_title").hide();
                        div.find("span.bbg_xiv-dense_li_caption").show();
                    }
                }
            });
            jqGallery.find("button.bbg_xiv-dense_close_btn").click(function(e){
                // restore "Gallery View"
                bbg_xiv.resetGallery(jQuery(this).parents("div.bbg_xiv-gallery"));
                jQuery("html").css("overflow-y",overflow);
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
            jqGallery.find("span.glyphicon-collapse-down,span.glyphicon-collapse-up").click(function(e){
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

    bbg_xiv.resetGallery=function(gallery){
        // restore "Gallery View"
        bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
        var liSelectView=gallery.find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
        var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li.bbg_xiv-view").removeClass("active").filter(".bbg_xiv-view_gallery").addClass("active");
        liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
        jQuery(window).resize();
    };
    
    bbg_xiv.getThumbnailUrl=function(data){
        switch(bbg_xiv.bandwidth){
        case "normal":
            return {
                src      :bbg_xiv.bbg_xiv_wp_rest_api?data.source_url:data.url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_medium_url,
                large    :data.bbg_xiv_large_url
            };
        case "low":
            return {
                src      :data.bbg_xiv_small_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_small_url,
                large    :data.bbg_xiv_small_url
            };
        case "very low":
            return {
                src      :data.bbg_xiv_thumbnail_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_thumbnail_url,
                medium   :data.bbg_xiv_thumbnail_url,
                large    :data.bbg_xiv_thumbnail_url
            }; 
        }
    };
    
    bbg_xiv.getImageUrl=function(data){
        switch(bbg_xiv.bandwidth){
        case "normal":
            return {
                src      :bbg_xiv.bbg_xiv_wp_rest_api?data.source_url:data.url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_medium_url,
                large    :data.bbg_xiv_large_url
            };
        case "low":
        case "very low":
            return {
                src      :data.bbg_xiv_small_url,
                thumbnail:data.bbg_xiv_thumbnail_url,
                small    :data.bbg_xiv_small_url,
                medium   :data.bbg_xiv_small_url,
                large    :data.bbg_xiv_small_url
            };
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
            cookie+=";"
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
            {width:1000000,class:"8_3333"}
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
            var max_search_results=options.bbg_xiv_max_search_results;
            if(jQuery.isNumeric(max_search_results)&&max_search_results>=1&&max_search_results<1048576){
                bbg_xiv.bbg_xiv_max_search_results=max_search_results;
            }
            var flex_number_of_dense_view_columns=options.bbg_xiv_flex_number_of_dense_view_columns;
            if(jQuery.isNumeric(flex_number_of_dense_view_columns)&&flex_number_of_dense_view_columns>=2&&flex_number_of_dense_view_columns<=32){
                bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=flex_number_of_dense_view_columns;
            }
            if(typeof options.bbg_xiv_bandwidth==="string"){
                bbg_xiv.bbg_xiv_bandwidth=options.bbg_xiv_bandwidth;
            }
            if(typeof options.bbg_xiv_interface==="string"){
                bbg_xiv.bbg_xiv_interface=options.bbg_xiv_interface;
            }
        }else{
            bbg_xiv.bbg_xiv_bandwidth="auto";
            bbg_xiv.bbg_xiv_interface="auto";
        }
        // compute bandwidth if bandwidth is set to auto - currently since this is not done reliably the user should set the bandwidth option manually
        if(bbg_xiv.bbg_xiv_bandwidth==="auto"){
            if(Modernizr.lowbandwidth){
                // this uses navigator.connection which is only supported by Android
                bbg_xiv.bandwidth="very low";
            }else if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                // determining bandwidth by device type is not reliable!
                bbg_xiv.bandwidth="very low";
            }else{
                bbg_xiv.bandwidth="normal";
            }
        }else{
            bbg_xiv.bandwidth=bbg_xiv.bbg_xiv_bandwidth;
        }
        // compute interface if interface is auto
        if(bbg_xiv.bbg_xiv_interface==="auto"){
            if(Modernizr.touchevents){
                bbg_xiv.interface="touch";
            }else{
                bbg_xiv.interface="mouse";
            }
        }else{
            bbg_xiv.interface=bbg_xiv.bbg_xiv_interface;
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
            var minFlexWidthForCaption=window.bbg_xiv.bbg_xiv_flex_min_width_for_caption;
            if(jqThis.parents("div.bbg_xiv-gallery_envelope").hasClass("bbg_xiv-tiles_container")){
                // set tile width and height in pixels so that tiles cover the div exactly and completely
                var pxWidth=Math.floor(width/Math.floor(width/window.bbg_xiv.bbg_xiv_flex_min_width))-1;
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
                        var pxWidth=parseFloat(cssClass.replace("_","."))/100.0*width;
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
        if(bbg_xiv.interface==="mouse"&&jQuery(window).width()>=bbg_xiv.bbg_xiv_flex_min_width_for_dense_view){
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").show();
        }else{
            jQuery(".bbg_xiv-configure_inner .bbg_xiv-mouse_only_option").hide();
        }  
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var menuItems=jQuery(this.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav ul.bbg_xiv-view_menu li").show();
            if(bbg_xiv.interface!=="mouse"||jQuery(window).width()<bbg_xiv.bbg_xiv_flex_min_width_for_dense_view){
                // for touch and small screen devices hide the dense menu item
                menuItems.filter(".bbg_xiv-large_viewport_only").hide();
            }  
            if(typeof bbg_xiv.images[this.id].models[0].attributes.gallery_index!=="undefined"){
                // for a gallery of gallery icons hide the carousel and the dense menu items
                menuItems.filter(".bbg_xiv-hide_for_gallery_icons").hide();
            }
        });
    });

    jQuery(document).ready(function(){
        jQuery("div.bbg_xiv-gallery_envelope").each(function(){
            var gallery=this;
            var jqThis=jQuery(this);
            if(jqThis.hasClass("bbg_xiv-gallery_icons_mode")){
                // for gallery of galleries always use the gallery view
                var defaultView="Gallery";
            }else{
                // use class to set default view if it exists otherwise use the global value
                var defaultView=bbg_xiv.bbg_xiv_default_view?bbg_xiv.bbg_xiv_default_view:"Gallery";
                if(jqThis.hasClass("bbg_xiv-default_view_gallery")){
                    defaultView="Gallery";
                }else if(jqThis.hasClass("bbg_xiv-default_view_carousel")){
                    defaultView="Carousel";
                }else if(jqThis.hasClass("bbg_xiv-default_view_tabs")){
                    defaultView="Tabs";
                }
                jqThis.parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery").find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view ul.bbg_xiv-view_menu li.bbg_xiv-view")
                    .removeClass("active").filter(".bbg_xiv-view_"+defaultView.toLowerCase()).addClass("active");
            }

            // prettify Galleries tabs
            bbg_xiv.prettifyTabs(jQuery(gallery.parentNode).find("div.bbg_xiv-container"),true);
            if(bbg_xiv.bbg_xiv_wp_rest_api){
                // If the schema is not in sessionStorage it will be loaded asynchronously so must use wp.api.loadPromise.done()
                wp.api.loadPromise.done(function(){
                    var images=bbg_xiv.images[gallery.id]=new wp.api.collections.Media();
                    images.reset(JSON.parse(bbg_xiv[gallery.id+"-data"]));
                    bbg_xiv.renderGallery(gallery,defaultView,["initial"]);
                    jQuery(window).resize();
                });
            }else{
                bbg_xiv.renderGallery(gallery,defaultView,["initial"]);
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
            if(["Gallery","Carousel","Tabs","Dense"].indexOf(view)>=0){
                select.find("li.bbg_xiv-view").removeClass("active");
                li.addClass("active");
                liSelectView.find("a.bbg_xiv-selected_view span").text(this.textContent);
                var gallery=jqThis.parents("div.bbg_xiv-gallery");
                bbg_xiv.renderGallery(divGallery,view);
            }else{
                // delete search state if it exists
                if(bbg_xiv.search[divGallery.id]){
                    delete bbg_xiv.search[divGallery.id];
                }
                container.find("div#"+divGallery.id+"-alt_gallery_heading").hide();
                var title=this.textContent;
                var galleries=bbg_xiv.galleries[divGallery.id];
                select.find("li.bbg_xiv-view").removeClass("active");
                var liGallery=select.find("li.bbg_xiv-view_gallery").addClass("active");
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
                    bbg_xiv.renderGallery(divGallery,"Gallery");
                    // update active in gallery tabs
                    container.find("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li").removeClass("active").find("a[data-view='"+view+"']").parent().addClass("active");
                    e.preventDefault();
                    return;
                }
                // setup headings
                jQuery("div#"+divGallery.id+"-heading").hide();
                var jqueryLoading=true;
                try{
                    // There is a very rare failure of the following
                    jQuery(divGallery).empty().append(jQuery.mobile.loading("show",{text:"Loading... please wait.",textVisible:true,textonly:false}));
                }catch(e){
                    console.log(e);
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
                if(bbg_xiv.bbg_xiv_wp_rest_api&&ids&&!parameters["orderby"]){
                    // for ids use the explicit order in ids
                    parameters["orderby"]="include";
                }
                var form=jqThis.parents("div.navbar-collapse").first().find("form[role='search']");
                function handleResponse(r){
                    if(jqueryLoading){
                        jQuery.mobile.loading("hide");
                        jQuery(divGallery).children().detach();
                    }
                    if(r){
                        galleries.images[view]=bbg_xiv.constructImages(divGallery);
                        galleries.view=view;
                        container.find("div#"+divGallery.id+"-alt_gallery_heading span.bbg_xiv-alt_gallery_heading").text(title);
                        bbg_xiv.renderGallery(divGallery,"Gallery");
                    }else{
                        jQuery(divGallery).empty().append('<h1 class="bbg_xiv-warning">'+bbg_xiv_lang["Nothing Found"]+'</h1>');
                    }
                    jQuery(divGallery.parentNode).find("nav.navbar form.bbg_xiv-search_form button").prop("disabled",false);
                };
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
                        success:function(c,r,o){
                        },
                        error:function(c,r,o){
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
            }
            e.preventDefault();
        });
        // wireup Galleries tabs 
        jQuery("div.bbg_xiv-gallery_tabs_container nav.navbar ul.nav-tabs li a[data-view^='gallery_']").click(function(e){
            var gallery=this.dataset.view;
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
                var searchLimit=parseInt(bbg_xiv.bbg_xiv_max_search_results);
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
                if(value){
                    // new search
                    query=value;
                    offset=0;
                    page=1;
                    // start new search history
                    bbg_xiv.search[divGallery.id]={history:[],index:-1,done:false};
                    // get count
                    if(!window.bbg_xiv.bbg_xiv_wp_rest_api){
                        var postData={
                            action:"bbg_xiv_search_media_count",
                            query:query,
                            _wpnonce:form.find("input[name='_wpnonce']").val(),
                            _wp_http_referer:form.find("input[name='_wp_http_referer']").val()
                        };
                        jQuery.post(bbg_xiv.ajaxurl,postData,function(r){
                            count=parseInt(r);
                        });
                    }
                }else if(typeof query==="undefined"){
                    e.preventDefault();
                    return;
                }
                // setup headings
                jQuery("div#"+divGallery.id+"-alt_gallery_heading").hide();
                var jqueryLoading=true;
                try{
                    // There is a very rare failure of the following
                    jQuery(divGallery).empty().append(jQuery.mobile.loading("show",{text:"Loading... please wait.",textVisible:true,textonly:false}));
                }catch(e){
                    console.log(e);
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
                        if(window.bbg_xiv.bbg_xiv_wp_rest_api){
                            var title=bbg_xiv_lang["Page"]+" "+(page-1)+" "+bbg_xiv_lang["of"]+" "+(pages!==Number.MAX_SAFE_INTEGER?pages:"?");
                        }else{
                            var title=bbg_xiv_lang["Images"]+" "+(prevOffset+1)+" "+bbg_xiv_lang["to"]+" "+(prevOffset+images.models.length)+" "+bbg_xiv_lang["of"]+" "
                                +(count!==Number.MAX_SAFE_INTEGER?count:"?");
                        }
                        heading.find("span.bbg_xiv-search_heading_second").text(title);
                        // maintain a history of all images returned by this search
                        search.history.push({images:images,title:title});
                        search.index=search.history.length-1;
                        bbg_xiv.renderGallery(divGallery,"Gallery");
                        heading.find("button.bbg_xiv-search_scroll_left").attr("disabled",search.index===0);
                    }else{
                        jQuery(divGallery).empty().append('<h1 class="bbg_xiv-warning">'+bbg_xiv_lang["Nothing Found"]+'</h1>');
                    }
                    var liSelectView=jQuery(divGallery.parentNode).find("nav.bbg_xiv-gallery_navbar ul.nav li.bbg_xiv-select_view");
                    var liFirst=liSelectView.find("ul.bbg_xiv-view_menu li.bbg_xiv-view").removeClass("active").filter(".bbg_xiv-view_gallery").addClass("active");
                    liSelectView.find("a.bbg_xiv-selected_view span").text(liFirst.text());
                    searchBtn.prop("disabled",false);
                };
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
                            page:page++,
                            per_page:searchLimit
                        },
                        success:function(c,r,o){
                            // set the page variable from the page query parameter of the next page url in the HTTP header field "Link"
                            var link=o.xhr.getResponseHeader("link");
                            if(link){
                                var matches=link.match(/(\?|&)page=(\d+)(&[^>]+>;|>;)\s+rel="next"/);
                                if(matches&&matches.length===4&&jQuery.isNumeric(matches[2])){
                                    page=parseInt(matches[2]);
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
                        error:function(c,r,o){
                            console.log("error:r=",r);
                            handleResponse(false);
                        }
                    });
                }else{
                    // old proprietary non REST way to load the Backbone image collection - does not require the WP REST API plugin
                    // get the next part of the multi-part search result
                    var postData={
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
                e.preventDefault();
            });
        });
        jQuery("button.bbg_xiv-home").click(function(e){
            jQuery(this).parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery")
                .find("nav.bbg_xiv-gallery_navbar ul.nav li.dropdown ul.bbg_xiv-view_menu li > a[data-view='gallery_home']").click();
            e.preventDefault();
        });
        jQuery("button.bbg_xiv-titles").click(function(e){
            var container=jQuery(this).parents("div.bbg_xiv-bootstrap.bbg_xiv-gallery").find("div.bbg_xiv-tiles_container");
            if(container.length){
                var figure=container.find("div.bbg_xiv-flex_item figure");
                var caption=figure.find("figcaption");
                var visible=!caption.is(":visible");
                caption.toggle(1000);
                if(container.hasClass("bbg_xiv-contain")){
                    // in tiles contain mode center image if title not displayed
                    if(visible){
                        figure.find("img").removeClass("bbg_xiv-vertical_center");
                    }else{
                        figure.find("img").addClass("bbg_xiv-vertical_center");
                    }
                }
            }
        });
        // wireup the handler for setting options
        jQuery("button.bbg_xiv-configure").click(function(e){
            divConfigure.find("input#bbg_xiv-carousel_delay").val(bbg_xiv.bbg_xiv_carousel_interval);
            divConfigure.find("input#bbg_xiv-min_image_width").val(bbg_xiv.bbg_xiv_flex_min_width);
            divConfigure.find("input#bbg_xiv-max_search_results").val(bbg_xiv.bbg_xiv_max_search_results);
            divConfigure.find("input#bbg_xiv-columns_in_dense_view").val(bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns);
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
        divConfigure.find("input[type='number']#bbg_xiv-max_search_results").change(function(e){
            // max seems to be broken so fix with javascript
            var jqThis=jQuery(this);
            var max=parseInt(jqThis.val());
            var attrMax=parseInt(jqThis.attr("max"));
            if(bbg_xiv.bbg_xiv_wp_rest_api&&attrMax>bbg_xiv.wpRestApiMaxPerPage){
                // WP REST API requires that per_page be between 1 and 100 inclusive
                attrMax=bbg_xiv.wpRestApiMaxPerPage;
            }
            if(max>attrMax){
                jqThis.val(attrMax);
            }
        });
        divConfigure.find("button.bbg_xiv-configure_close,button.bbg_xiv-cancel_options").click(function(e){
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
            bbg_xiv.bbg_xiv_max_search_results=divConfigure.find("input#bbg_xiv-max_search_results").val();
            bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=divConfigure.find("input#bbg_xiv-columns_in_dense_view").val();
            bbg_xiv.bbg_xiv_bandwidth=divConfigure.find("input[name='bbg_xiv-bandwidth']:checked").val();
            bbg_xiv.bbg_xiv_interface=divConfigure.find("input[name='bbg_xiv-interface']:checked").val();
            var cookie=JSON.stringify({
                bbg_xiv_carousel_interval:bbg_xiv.bbg_xiv_carousel_interval,
                bbg_xiv_flex_min_width:bbg_xiv.bbg_xiv_flex_min_width,
                bbg_xiv_max_search_results:bbg_xiv.bbg_xiv_max_search_results,
                bbg_xiv_flex_number_of_dense_view_columns:bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
                bbg_xiv_bandwidth:bbg_xiv.bbg_xiv_bandwidth,
                bbg_xiv_interface:bbg_xiv.bbg_xiv_interface
            });
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
            window.open(bbg_xiv.helpMVPUrl,"_blank");
            this.blur();
            e.preventDefault();
        });
        // wireup the handler for scrolling through search results
        jQuery("div.bbg_xiv-search_header button.bbg_xiv-search_scroll_left,div.bbg_xiv-search_header button.bbg_xiv-search_scroll_right").click(function(e){
            jqThis=jQuery(this);
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
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
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
            inner.find(".bbg_xiv-dense_title,.bbg_xiv-dense_caption").each(function(){
                var jqThis=jQuery(this);
                var color=jqThis.css("color");
                if(color!=="transparent"&&color!=="rgba(0, 0, 0, 0)"){   // TODO: find safer test for transparent
                    if(typeof bbg_xiv.titleColor==="undefined"){
                        bbg_xiv.titleColor=color;
                        bbg_xiv.titleShadow=jqThis.css("text-shadow");
                    }
                    jqThis.css("color","transparent");
                    jqThis.css("text-shadow","none");
                }else{
                    jqThis.css("color",bbg_xiv.titleColor);
                    jqThis.css("text-shadow",bbg_xiv.titleShadow);
                }
            });
        });
        jQuery(window).on("orientationchange",function(e){
            jQuery("div.bbg_xiv-gallery").each(function(){
                bbg_xiv.resetGallery(jQuery(this));
            });
        });
        if(!bbg_xiv.bbg_xiv_wp_rest_api){
            // if using the REST API cannot do resize here since the models may be asynchronously created
            jQuery(window).resize();
        }
    });   // jQuery(document).ready(function(){

    //cookie test code
    //window.alert("bbg_xiv_test="+bbg_xiv.getCookie("bbg_xiv_test"));
    //bbg_xiv.setCookie("bbg_xiv_test",window.prompt("bbg_xiv_test","null"));
}());

