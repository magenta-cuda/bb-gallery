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
                    items:imagesHtml
                }
            }
        } );
        galleryView.template=_.template(jQuery("script#bbg_xiv-template_flex_container").html(),null,bbg_xiv.templateOptions);
        container.empty();
        container.append(galleryView.render().$el.find("div.bbg_xiv-flex_container"));
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
            try{
                images.reset(JSON.parse(window.bbg_xiv[gallery.id+"-data"]));
                var width=Math.log(bbg_xiv.bbg_xiv_flex_min_width);
                var diff=Number.MAX_VALUE;
                var url;
                images.models.forEach(function(model){
                    var sizes=model.attributes.sizes;
                    Object.keys(sizes).forEach(function(size){
                        var image=sizes[size];
                        console.log("size=",size);
                        console.log("image.width=",image.width);
                        var d=Math.abs(Math.log(image.width)-width);
                        if(d<diff){
                            d=diff;
                            url=image.url;
                        }
                        console.log("image.url=",image.url);
                    });
                    model.attributes.bbg_xiv_thumbnail_url=url;
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
    
    bbg_xiv.setCookie=function(name,value,expires){
        var d=new Date();
        document.cookie=name+"="+value+"; expires="+d.setTime(d.getTime()+(expires*24*60*60*1000)+"; path=/");
    };

    bbg_xiv.getCookie=function(name){
        var cookie=document.cookie;
        cookie+=";"
        //console.log("getCookie():cookie=",cookie);
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

    jQuery("nav.bbg_xiv-gallery_navbar ul.nav li > a").click(function(e){
        var jqThis=jQuery(this);
        var gallery=jqThis.parents("div.bbg_xiv-gallery");
        gallery.find("nav.navbar ul.nav li").removeClass("active");
        jqThis.parent().addClass("active");
        bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],this.textContent.trim());
        e.preventDefault();
    });

    jQuery("div.bbg_xiv-gallery_envelope").each(function(){
        bbg_xiv.renderGallery(this,"Gallery");
    });
    
    bbg_xiv.calcBreakpoints();
    var minFlexWidthForCaption=window.bbg_xiv['bbg_xiv_flex_min_width_for_caption'];
    var minWidthForDenseView=window.bbg_xiv['bbg_xiv_flex_min_width_for_dense_view'];
    

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

    jQuery(document).ready(function(){
        // wireup the front end for setting options 
        jQuery("button.bbg_xiv-configure").click(function(e){
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
            bbg_xiv.bbg_xiv_carousel_interval=divConfigure.find("input#carousel-delay").val();
            bbg_xiv.bbg_xiv_flex_min_width=divConfigure.find("input#min-image-width").val();
            bbg_xiv.bbg_xiv_flex_number_of_dense_view_columns=divConfigure.find("input#columns-in-dense-view").val();
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

