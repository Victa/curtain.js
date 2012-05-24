/*
* Curtain.js - Create an unique page transitioning system
* ---
* Version: 1.4.1
* Copyright 2011, Victor Coulon (http://victorcoulon.fr)
* Released under the MIT Licence
*/

(function ( $, window, document, undefined ) {

    var pluginName = 'curtain',
        defaults = {
            scrollSpeed: 400,
            bodyHeight: 0,
            linksArray: [],
            mobile: false,
            scrollButtons: {},
            controls: null,
            curtainLinks: '.curtain-links',
            enableKeys: true,
            easing: 'swing'
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        var self = this;

        // Public attributes
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        this._ignoreHashChange = false;

        this.init();

        // Public Functions
        this.insert = function(content){
            if(Object.prototype.toString.call(content) !== '[object Object]') {
                throw new TypeError('Content must be an object');
            }
            content.goTo = (content.goTo === true) ? true : false;

            // append the content to list
            var newEl = $(document.createElement('li')).attr('id', (content.htmlId) ? content.htmlId : null)
                                .attr('class', (content.htmlClass) ? content.htmlClass : null)
                                .html( (content.html) ? content.html : null );
            $(self.element).append(newEl);


            // Append Content after an element OR at the end
            if(content.insertAfter && $(content.insertAfter).length) {
                $(self.element).find(content.insertAfter).after(newEl);
            } else {
                $(self.element).append(newEl);
            }


            // When the element is ready
            self.readyElement($(newEl), function(){
                // re(init) cache elements
                self.$element = $(self.element);
                self.$li = $(self.element).find('>li');

                // Mobile Fix
                if(self.options.mobile){
                    self.$li.css({position:'relative'});
                    self.$element.find('.fixed').css({position:'absolute'});
                }
                
                self.setLinks();

                // Set dimensions after loading images (or not)
                if($(newEl).find('img').length){
                    $(newEl).find('img').load(function(){
                        self.setDimensions();
                    });
                } else {
                    self.setDimensions();
                }

                // Scroll to the new element
                if(content.goTo === true){
                    var position = $(newEl).attr('data-position') || null;
                    self.scrollEl.animate({
                        scrollTop:position
                    }, self.options.scrollSpeed, self.options.easing);
                }
            });

        };
    }

    Plugin.prototype = {
        init: function () {
            var self = this;

            // Cache element
            this.$element = $(this.element);
            this.$li = $(this.element).find('>li');


            $.Android = (navigator.userAgent.match(/Android/i));
            $.iPhone = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)));
            $.iPad = ((navigator.userAgent.match(/iPad/i)));
            $.iOs4 = (/OS [1-4]_[0-9_]+ like Mac OS X/i.test(navigator.userAgent));


            if($.iPhone || $.iPad || $.Android){
                this.options.mobile = true;
                this.$li.css({position:'relative'});
                this.$element.find('.fixed').css({position:'absolute'});
            }
            

            if(this.options.mobile){
               this.scrollEl =  this.$element;
            } else if($.browser.mozilla || $.browser.msie) {
                this.scrollEl = $('html');
            } else {
                this.scrollEl = $('body');
            }

            if(self.options.controls){
                self.options.scrollButtons['up'] =  $(self.options.controls).find('[href="#up"]');
                self.options.scrollButtons['down'] =  $(self.options.controls).find('[href="#down"]');

                if(!$.iOs4 && ($.iPhone || $.iPad)){
                    self.$element.css({
                        position:'fixed',
                        top:0,
                        left:0,
                        right:0,
                        bottom:0,
                        '-webkit-overflow-scrolling':'touch',
                        overflow:'auto'
                    });
                    $(self.options.controls).css({position:'absolute'});
                }
            }



            // We'll check if our images are loaded
            var images = [],
                imagesLoaded = 0,
                loadAllImages = function loadAllImages(callback){
                    if(images.length === 0){
                        callback();
                        return false;
                    }
                    var img = new Image();
                    $(img).attr('src',images[imagesLoaded]).load(function(){
                    imagesLoaded++;
                    if(imagesLoaded == images.length)
                        callback();
                    else
                        loadAllImages(callback);
                    });
                };

            self.$element.find('img').each(function(i,el){
                images.push(el.src);
            });


            // When all image is loaded
            loadAllImages(function(){
                self.setDimensions();
                self.$li.eq(0).addClass('current');

                // Cache
                self.$current = self.$element.find('.current');
                self.$fixed = self.$current.find('.fixed');
                self.$step = self.$current.find('.step');
                self.currentP = parseInt(self.$current.attr('data-position'), 10);
                self.currentHeight = parseInt(self.$current.attr('data-height'), 10);

                if(!self.options.mobile){
                    if(self.$li.eq(1).length)
                        self.$li.eq(1).nextAll().css({display:'none'});
                }

                self.setEvents();
                self.setLinks();
                self.isHashIsOnList(location.hash.substring(1));
            });

        },
        // Events
        scrollToPosition: function (direction){
            var position = null,
                self = this;

            if($('html, body').is(':animated')){
                return false;
            }

            if(direction === 'up' || direction == 'down'){

                // Keyboard event
                var $current = this.$element.find('.current'),
                    $next = (direction === 'up') ? $current.prev() : $current.next();

                position = $next.attr('data-position') || null;

                // Step in the current panel ?
                if($current.find('.step').length){
                    if(!$current.find('.current-step').length)
                        $current.find('.step').eq(0).addClass('current-step');
                    var $nextStep = (direction === 'up') ? $current.find('.current-step').prev('.step') : $current.find('.current-step').next('.step');
                    if($nextStep.length) {
                        position = (this.options.mobile) ? $nextStep.position().top + parseInt($current.attr('data-position'), 10) : $nextStep.offset().top;
                    }
                }

                if(position){
                    self.scrollEl.animate({
                        scrollTop:position
                    }, this.options.scrollSpeed, this.options.easing);
                }

            } else if(direction === 'top'){
                self.scrollEl.animate({
                    scrollTop:0
                }, self.options.scrollSpeed, self.options.easing);
            } else if(direction === 'bottom'){
                self.scrollEl.animate({
                    scrollTop:self.options.bodyHeight
                }, self.options.scrollSpeed, self.options.easing);
            } else {
                position = $("#"+direction).attr('data-position') || null;
                if(position){
                    self.scrollEl.animate({
                        scrollTop:position
                    }, this.options.scrollSpeed, this.options.easing);
                }
            }
            
        },
        scrollEvent: function() {
            var self = this,
                docTop = $(document).scrollTop(),
                windowHeight = $(window).height();


            if(docTop < self.currentP && self.$current.index() > 0){
                // Scroll top
                self._ignoreHashChange = true;
                if(self.$current.prev().attr('id'))
                    self.setHash(self.$current.prev().attr('id'));
                 
       
                self.$current.removeClass('current').css({marginTop: 0})
                    .nextAll().css({display:'none'}).end()
                    .prev().addClass('current').css({display:'block'});
  
                // Cache
                self.$current = self.$element.find('.current');
                self.$fixed = self.$current.find('.fixed');
                self.$step = self.$current.find('.step');
                self.currentP = parseInt(self.$current.attr('data-position'), 10);
                self.currentHeight = parseInt(self.$current.attr('data-height'), 10);

            } else if(docTop < (self.currentP + self.$current.height())){
                // Animate the current pannel during the scroll
                var position = -(docTop-self.currentP);
                self.$current.css({marginTop:position});

                // If there is a fixed element in the current panel
                if(self.$fixed.length){
                    var dataTop = parseInt(self.$fixed.attr('data-top'), 10);
                    
                    if((docTop-self.currentP+windowHeight) >= self.currentHeight && self.$fixed.css('position') === 'fixed'){
        
                        self.$fixed.css({
                            position: 'absolute',
                            top: Math.abs(docTop-self.currentP + dataTop)
                        });
         

                    } else if((docTop-self.currentP+windowHeight) <= self.currentHeight && self.$fixed.css('position') === 'absolute'){
                        self.$fixed.css({
                            position: 'fixed',
                            top: dataTop
                        });
                    }

                    
                }

                
                // If there is a step element in the current panel
                if(self.$step.length){
                    $.each(self.$step, function(i,el){
                        if($(el).offset().top <= docTop+5 && ($(el).offset().top + $(el).outerHeight()) >= docTop+5){
                            if(!$(el).hasClass('current-step')){
                                self.$step.removeClass('current-step');
                                $(el).addClass('current-step');
                            }
                        }
                    });
                }

            } else {
                // Scroll bottom
                self._ignoreHashChange = true;
                if(self.$current.next().attr('id'))
                    self.setHash(self.$current.next().attr('id'));

                self.$current.removeClass('current')
                    .css({display:'none'})
                    .next().addClass('current').nextAll().css({display:'block'});

                // Cache
                self.$current = self.$element.find('.current');
                self.$fixed = self.$current.find('.fixed');
                self.$step = self.$current.find('.step');
                self.currentP = parseInt(self.$current.attr('data-position'), 10);
                self.currentHeight = parseInt(self.$current.attr('data-height'), 10);
            }


        },
        scrollMobileEvent: function() {
            var self = this;

            var docTop = self.$element.scrollTop(),
                $current = self.$element.find('.current'),
                $step = $current.find('.step'),
                currentP = parseInt($current.attr('data-position'), 10),
                currentHeight = parseInt($current.attr('data-height'), 10),
                windowHeight = $(window).height();

            if(docTop+10 < currentP && $current.index() > 0){
                $current.removeClass('current').prev().addClass('current');
            } else if(docTop+10 < (currentP + $current.height())){

                // If there is a step element in the current panel
                if($step.length){
                    $.each($step, function(i,el){
                        if(($(el).position().top+currentP) <= docTop && (($(el).position().top+currentP) + $(el).outerHeight()) >= docTop){
                            if(!$(el).hasClass('current-step')){
                                $step.removeClass('current-step');
                                $(el).addClass('current-step');
                            }
                        }
                    });
                }

            } else {
                $current.removeClass('current').next().addClass('current');
            }


        },
        // Setters
        setDimensions: function(){
            var windowHeight = $(window).height(),
                levelHeight = 0,
                cover = false,
                height = null;

            this.$li.each(function(index) {
                var $self = $(this);
                cover = $self.hasClass('cover');

                if(cover){
                    $self.css({height: windowHeight, zIndex: 999-index})
                        .attr('data-height',windowHeight)
                        .attr('data-position',levelHeight);
                    levelHeight += windowHeight;
                } else{
                    height = ($self.outerHeight() <= windowHeight) ? windowHeight : $self.outerHeight();
                    $self.css({minHeight: height, zIndex: 999-index})
                        .attr('data-height',height)
                        .attr('data-position',levelHeight);
                    levelHeight += height;
                }

                if($self.find('.fixed').length){
                    var top = $self.find('.fixed').css('top');
                    $self.find('.fixed').attr('data-top', top);
                }
            });
            if(!this.options.mobile)
                this.setBodyHeight();
        },
        setEvents: function() {
            var self = this;

            $(window).on('resize', function(){
                self.setDimensions();
            });

            if(self.options.mobile) {
                self.$element.on('scroll', function(){
                    self.scrollMobileEvent();
                });
            } else {
                $(window).on('scroll', function(){
                    self.scrollEvent();
                });
            }
            
            if(self.options.enableKeys) {
                $(document).on('keydown', function(e){
                    if(e.keyCode === 38 || e.keyCode === 37) {
                        self.scrollToPosition('up');
                        e.preventDefault();
                        return false;
                    }
                    if(e.keyCode === 40 || e.keyCode === 39){
                        self.scrollToPosition('down');
                        e.preventDefault();
                        return false;
                    }
                    // Home button
                    if(e.keyCode === 36){
                        self.scrollToPosition('top');
                        e.preventDefault();
                        return false;
                    }
                    // End button
                    if(e.keyCode === 35){
                        self.scrollToPosition('bottom');
                        e.preventDefault();
                        return false;
                    }
                });
            }

            if(self.options.scrollButtons){
                if(self.options.scrollButtons.up){
                    self.options.scrollButtons.up.on('click', function(e){
                        e.preventDefault();
                        self.scrollToPosition('up');
                    });
                }
                if(self.options.scrollButtons.down){
                    self.options.scrollButtons.down.on('click', function(e){
                        e.preventDefault();
                        self.scrollToPosition('down');
                    });
                }
            }

            if(self.options.curtainLinks){
                $(self.options.curtainLinks).on('click', function(e){
                    e.preventDefault();
                    var href = $(this).attr('href');
                    
                    if(!self.isHashIsOnList(href.substring(1)) && position)
                        return false;

                    var position = $(href).attr('data-position') || null;
                    if(position){
                        self.scrollEl.animate({
                            scrollTop:position
                        }, self.options.scrollSpeed, self.options.easing);
                    }
                    return false;
                });
            }

            if ("onhashchange" in window) {
                window.addEventListener("hashchange", function(){
                    if(self._ignoreHashChange === false){
                        self.isHashIsOnList(location.hash.substring(1));
                    }
                    self._ignoreHashChange = false;
                }, false);
            }
        },
        setBodyHeight: function(){
            var h = 0;
            this.$li.each(function() {
               h += $(this).height();
            });
            this.options.bodyHeight = h;
            $('body').height(h);
        },
        setLinks: function(){
            var self = this;
            this.$li.each(function() {
                var id = $(this).attr('id') || 0;
                self.options.linksArray.push(id);
            });
        },
        setHash: function(hash){
            if(history.pushState) {
                history.pushState(null, null, '#'+hash);
            }
            else {
                location.hash = hash;
            }
        },
        // Utils
        isHashIsOnList: function(hash){
            var self = this;
            $.each(self.options.linksArray, function(i,val){
                if(val === hash){
                    self.scrollToPosition(hash);
                    return false;
                }
            });
        },
        readyElement: function(el,callback){
          var interval = setInterval(function(){
            if(el.length){
              callback(el.length);
              clearInterval(interval);
            }
          },60);
        }
    };



    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };


})( jQuery, window, document );
