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
    
    bbg_xiv.renderGallery=function(container,collection){
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
        container.append(galleryView.render().$el.find( "div.carousel.slide").css({position:"fixed",left:"0px",top:"0px",zIndex:"1000000"}));
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
            }else{
                bbg_xiv.renderGallery(jqGallery,images);
            }
            break;
        case "Carousel":
            bbg_xiv.renderCarousel(jqGallery,images,"bbg_xiv-carousel_"+gallery.id);
            jqGallery.find("button.bbg_xiv-carousel_close_btn").click(function(e){
                var gallery=jQuery(this).parents("div.bbg_xiv-gallery");
                gallery.find("nav.navbar ul.nav li").removeClass("active").first().addClass("active");
                bbg_xiv.renderGallery(gallery.find("div.bbg_xiv-gallery_envelope")[0],"Gallery");
                e.preventDefault();      
            });
            break;
        case "Tabs":
            bbg_xiv.renderTabs(jqGallery,images,"bbg_xiv-tabs_"+gallery.id);
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
}());

