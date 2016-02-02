// Backbone.js Model View Presenter for the 'gallery' shortcode

(function(){
    var bbg_xiv=window.bbg_xiv=window.bbg_xiv||{};
    // use WordPress templating syntax; see .../wp-includes/js/wp-util.js
    bbg_xiv.templateOptions={
        evaluate:    /<#([\s\S]+?)#>/g,
        interpolate: /\{\{\{([\s\S]+?)\}\}\}/g,
        escape:      /\{\{([^\}]+?)\}\}(?!\})/g,
        variable:    'data'
    };
    
    bbg_xiv.images={};
    
    bbg_xiv.Image=Backbone.Model.extend({idAttribute:"ID"});
    
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
        } );
        var galleryView=new bbg_xiv.GalleryView({
            model:{
                attributes:{
                    id:collection.id,
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_flex_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-flex_container"));
        if(bbg_xiv.interface==="touch"){
            container.find("div.bbg_xiv-flex_container div.bbg_xiv-flex_item div.bbg_xiv-dense_full_btn").css({color:"gray",borderColor:"gray"});
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
    
    bbg_xiv.renderGallery=function(gallery,view){
        var jqGallery=jQuery(gallery);
        var images=bbg_xiv.images[gallery.id];
        if(!images){
            images=bbg_xiv.images[gallery.id]=new bbg_xiv.Images();
            images.id=gallery.id;
            try{
                images.reset(JSON.parse(window.bbg_xiv[gallery.id+"-data"]));
                // find closest match for thumbnail, small, medium and large
                var widths=[Math.log(bbg_xiv.bbg_xiv_flex_min_width),Math.log(768),Math.log(992),Math.log(1200)];
                images.models.forEach(function(model){
                    var diffs=[Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE];
                    var urls=[];
                    var attributes=model.attributes;
                    var sizes=attributes.sizes;
                    sizes.full={url:attributes.url,width:attributes.width,height:attributes.height};
                    Object.keys(sizes).forEach(function(size){
                        var image=sizes[size];
                        widths.forEach(function(width,i){
                            var diff=Math.abs(Math.log(image.width)-width);
                            if(diff<diffs[i]){
                                diffs[i]=diff;
                                urls[i]=image.url;
                            }
                        });
                    });
                    model.attributes.bbg_xiv_thumbnail_url=urls[0];
                    model.attributes.bbg_xiv_small_url=urls[1];
                    model.attributes.bbg_xiv_medium_url=urls[2];
                    model.attributes.bbg_xiv_large_url=urls[3];
                    console.log("model.attributes=",model.attributes);
                });
            }catch(e){
                console.log("reset(JSON.parse()) failed:",e);
            }
        }
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
            var fullLarge=inner.find("source[media='(min-width:1200px)']");
            var fullMedium=inner.find("source[media='(min-width:992px)']");
            var fullSmall=inner.find("source[media='(max-width:991px)']");
            var fullTitle=inner.find("h1.bbg_xiv-dense_title");
            var fullTitleColor=fullTitle.css("color");
            var fullTitleShadow=fullTitle.css("text-shadow");
            var fullCaption=inner.find("h1.bbg_xiv-dense_caption");
            var fullCaptionColor=fullCaption.css("color");
            var fullCaptionShadow=fullCaption.css("text-shadow");
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
            // force hover effects on touchscreen
            if(bbg_xiv.interface==="touch"){
                fullTitle.css({color:fullTitleColor,textShadow:fullTitleShadow});
                fullCaption.css({color:fullCaptionColor,textShadow:fullCaptionShadow});
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
                fullLarge[0].srcset=img.src;
                fullMedium[0].srcset=img.src;
                fullSmall[0].srcset=img.src;
                // try and replace img src with better match 
                try{
                    var imageId=img.dataset.bbg_xivImageId;
                    if(imageId){
                        var galleryId=jQuery(img).parents("div[data-bbg_xiv-gallery-id]")[0].dataset.bbg_xivGalleryId;
                        if(galleryId){
                            var urls=bbg_xiv.getImageUrl(bbg_xiv.images[galleryId].get(imageId).attributes);
                            console.log("urls=",urls);
                            fullImg[0].src=urls.src;
                            fullLarge[0].srcset=urls.large;
                            fullMedium[0].srcset=urls.medium;
                            fullSmall[0].srcset=urls.small;
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
        switch(view){
        case "Gallery":
            if(Modernizr.flexbox&&Modernizr.flexwrap&&!window.bbg_xiv['bbg_xiv_disable_flexbox']){
                bbg_xiv.renderFlex(jqGallery,images);
                constructOverlay();
            }else{
                bbg_xiv.renderBootstrapGallery(jqGallery,images);
            }
            jQuery(window).resize();
            break;
        case "Carousel":
            var overflow=jQuery("html").css("overflow-y");
            jQuery("html").css("overflow-y","hidden");
            var carouselId="bbg_xiv-carousel_"+gallery.id;
            bbg_xiv.renderCarousel(jqGallery,images,carouselId);
            jqGallery.find("button.bbg_xiv-carousel_close_btn").click(function(e){
                // restore "Gallery View"
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                jQuery(window).resize();
                jQuery("html").css("overflow-y",overflow);
                e.preventDefault();      
            });
            jQuery("#"+carouselId).carousel({interval:bbg_xiv.bbg_xiv_carousel_interval});
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
            // Hide the expand glyph if not needed.
            jqGallery.find("nav.navbar div.navbar-collapse ul.nav").each(function(e){
                if(jQuery(this).height()-3<=jQuery(this.parentNode).height()){
                    jqGallery.find("nav.navbar span.glyphicon").hide();
                    jQuery(this.parentNode).addClass("bbg_xiv-hide_scroll");
                }
            });
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
                            var parent=jQuery(img.parentNode.parentNode);
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
                jQuery(window).scrollTop(jqGallery.offset().top-40);
            });
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
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                jQuery(window).resize();
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
    
    bbg_xiv.getThumbnailUrl=function(data){
        console.log("bbg_xiv.getThumbnailUrl():data=",data);
        return {src:data.url,thumbnail:data.bbg_xiv_thumbnail_url,small:data.bbg_xiv_small_url,medium:data.bbg_xiv_medium_url,large:data.bbg_xiv_large_url};
    };
    
    bbg_xiv.getImageUrl=function(data){
        console.log("bbg_xiv.getImageUrl():data=",data);
        return {src:data.url,thumbnail:data.bbg_xiv_thumbnail_url,small:data.bbg_xiv_small_url,medium:data.bbg_xiv_medium_url,large:data.bbg_xiv_large_url};
    };
    
    bbg_xiv.setCookie=function(name,value,expires){
        var d=new Date();
        document.cookie=name+"="+value+"; expires="+d.setTime(d.getTime()+(expires*24*60*60*1000)+"; path=/");
    };

    bbg_xiv.getCookie=function(name){
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
    };

    bbg_xiv.calcBreakpoints=function(){
        var minFlexWidth=window.bbg_xiv['bbg_xiv_flex_min_width'];
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

    bbg_xiv.bbg_xiv_bandwidth="auto";
    bbg_xiv.bbg_xiv_interface="auto";
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
    }
    // compute bandwidth if bandwidth is auto
    if(bbg_xiv.bbg_xiv_bandwidth==="auto"){
        if(Modernizr.lowbandwidth){
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
    bbg_xiv.calcBreakpoints();
    var minFlexWidthForCaption=window.bbg_xiv['bbg_xiv_flex_min_width_for_caption'];
    var minWidthForDenseView=window.bbg_xiv['bbg_xiv_flex_min_width_for_dense_view'];
    
    jQuery("nav.bbg_xiv-gallery_navbar ul.nav li > a").click(function(e){
        var jqThis=jQuery(this);
        var gallery=jqThis.parents("div.bbg_xiv-gallery");
        gallery.find("nav.navbar ul.nav li").removeClass("active");
        jqThis.parent().addClass("active");
        bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],this.textContent.trim());
        e.preventDefault();
    });

    jQuery(window).resize(function(){
        var breakpoints=bbg_xiv.breakpoints;
        jQuery("div.bbg_xiv-flex_container, div.bbg_xiv-gallery_container").each(function(){
            var jqThis=jQuery(this);
            var width=jqThis.width();
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
            };
        });
        if(jQuery(window).width()>=minWidthForDenseView){
            jQuery(".bbg_xiv-large_viewport_only").show();
        }else{
            jQuery(".bbg_xiv-large_viewport_only").hide();
        }  
    });

    jQuery("div.bbg_xiv-gallery_envelope").each(function(){
        bbg_xiv.renderGallery(this,"Gallery");
    });

    jQuery(document).ready(function(){
        // wireup the front end for setting options 
        jQuery("button.bbg_xiv-configure").click(function(e){
            divConfigure.find("input#bbg_xiv-carousel_delay").val(bbg_xiv.bbg_xiv_carousel_interval);
            divConfigure.find("input#bbg_xiv-min_image_width").val(bbg_xiv.bbg_xiv_flex_min_width);
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
        });
        var divConfigure=jQuery(".bbg_xiv-configure_inner");
        divConfigure.find("button.bbg_xiv-configure_close").click(function(e){
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
        });
        divConfigure.find("button.bbg_xiv-save_options").click(function(e){
            // save the options
            bbg_xiv.bbg_xiv_carousel_interval=divConfigure.find("input#bbg_xiv-carousel_delay").val();
            bbg_xiv.bbg_xiv_flex_min_width=divConfigure.find("input#bbg_xiv-min_image_width").val();
            bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=divConfigure.find("input#bbg_xiv-columns_in_dense_view").val();
            bbg_xiv.bbg_xiv_bandwidth=divConfigure.find("input[name='bbg_xiv-bandwidth']:checked").val();
            bbg_xiv.bbg_xiv_interface=divConfigure.find("input[name='bbg_xiv-interface']:checked").val();
            var cookie=JSON.stringify({
                bbg_xiv_carousel_interval:bbg_xiv.bbg_xiv_carousel_interval,
                bbg_xiv_flex_min_width:bbg_xiv.bbg_xiv_flex_min_width,
                bbg_xiv_flex_number_of_dense_view_columns:bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns,
                bbg_xiv_bandwidth:bbg_xiv.bbg_xiv_bandwidth,
                bbg_xiv_interface:bbg_xiv.bbg_xiv_interface
            });
            bbg_xiv.setCookie("bbg_xiv",cookie,30);
            bbg_xiv.calcBreakpoints();
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            var outer=gallery.find("div.bbg_xiv-configure_outer");
            outer.hide();
            var inner=gallery.find("div.bbg_xiv-configure_inner");
            inner.hide();
            var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
            gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
            bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
            jQuery(window).resize();
            e.preventDefault();
        });
        jQuery(window).resize();
    });

    //cookie test code
    //window.alert("bbg_xiv_test="+bbg_xiv.getCookie("bbg_xiv_test"));
    //bbg_xiv.setCookie("bbg_xiv_test",window.prompt("bbg_xiv_test","null"));
}());

