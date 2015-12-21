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
                imagesHtml+='<div class="clearfix visible-lg-block"></div>';
            }
            if(index%3===2){
                imagesHtml+='<div class="clearfix visible-md-block"></div>';
            }
            if(index%2===1){
                imagesHtml+='<div class="clearfix visible-sm-block"></div>';
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
            }catch(e){
                console.log("reset(JSON.parse()) failed:",e);
            }
        }
        switch(view){
        case "Gallery":
            if(Modernizr.flexbox&&Modernizr.flexwrap){
                bbg_xiv.renderFlex(jqGallery,images);
                jQuery(window).resize();
            }else{
                bbg_xiv.renderBootstrapGallery(jqGallery,images);
            }
            break;
        case "Carousel":
            bbg_xiv.renderCarousel(jqGallery,images,"bbg_xiv-carousel_"+gallery.id);
            jqGallery.find("button.bbg_xiv-carousel_close_btn").click(function(e){
                // restore "Gallery View"
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                jQuery(window).resize();
                e.preventDefault();      
            });
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
            jqGallery.find("nav.navbar ul.nav li a").click(function(e){
                jQuery(window).scrollTop(jqGallery.offset().top-40);
            });
            break;
        case "Dense":
            bbg_xiv.renderDense(jqGallery,images,"bbg_xiv-dense_"+gallery.id,"title");
            var normal=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-normal_color").css("background-color");
            var highlight=jQuery("div.bbg_xiv-dense_container button#bbg_xiv-highlight_color").css("background-color");
            jqGallery.find("div.bbg_xiv-dense_titles ul li").hover(
                function(e){
                    // highlight matching image
                    jQuery(this).css({"background-color":highlight});
                    jQuery("div#"+this.id.replace("title","image")).css({"border-color":highlight});
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
            jqGallery.find("button.bbg_xiv-dense_close_btn").click(function(e){
                // restore "Gallery View"
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                jQuery(window).resize();
                e.preventDefault();      
            });
            break;
        // TODO: Add entry for new views here
        case "Table":
            bbg_xiv.renderTable(jqGallery,images);
            break;
        default:
            break;
        }
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
    
    var minFlexWidth=window.bbg_xiv['bbg_xiv_flex_min_width'];
    var minFlexWidthForCaption=window.bbg_xiv['bbg_xiv_flex_min_width_for_caption'];
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
    jQuery(window).resize(function(){
        var breakpoints=bbg_xiv.breakpoints;
        jQuery("div.bbg_xiv-flex_container").each(function(){
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
        if(jQuery(window).width()>=1280){
            jQuery(".bbg_xiv-large_viewport_only").show();
        }else{
            jQuery(".bbg_xiv-large_viewport_only").hide();
        }  
    });
    jQuery(document).ready(function(){
        jQuery(window).resize();
    });
}());

