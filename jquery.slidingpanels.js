/*  jQuery : sliding panels
    Inspired by http://editsquarterly.com/

    Author : Victor Coulon (http://victorcoulon.fr)

    Licence MIT
*/

(function ( $, window, document, undefined ) {

    var pluginName = 'slidingpanels',
        defaults = {
            bodyHeight: 0,
            scrollSpeed: 400,
            linksArray: [],
            mobile: false
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this;
        $.MobileWebkit = ($('body').hasClass('webkit-mobile') || (navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i)));
        $.MobileDevice = ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/Android/i)));
        $.Tablet = ((navigator.userAgent.match(/iPad/i)));

        if($.MobileDevice || $.Tablet || $.MobileWebkit){
            this.options.mobile = true;
            $(this.element).find('>li').css({position:'relative'});
        }
        $(window).load(function(){
            // When all image is loaded
            self.setDimensions();
            self.setEvents();
            self.setLinks();
            self.isHashIsOnList(location.hash.substring(1));
        });
        
    };

    // Events
    Plugin.prototype.scrollToPosition = function (direction){
        var position = null;

        if($('html, body').is(':animated')){
            return false;
        }

        if(direction === 'up' || direction == 'down'){
            var $current = $(this.element).find('.current'),
                $next = (direction === 'up') ? $current.prev() : $current.next();

            position = $next.attr('data-position') || null;

            if(position){
                $('html, body').animate({
                    scrollTop:position
                }, this.options.scrollSpeed);
            }
        } else{
            position = $("#"+direction).attr('data-position') || null;
            if(position){
                $('html, body').animate({
                    scrollTop:position
                }, this.options.scrollSpeed);
            }
        }
        return false;
    };

    

    Plugin.prototype.scrollEvent = function() {
        var docTop = $(document).scrollTop(),
            $current = $(this.element).find('.current'),
            $fixed = $current.find('.fixed'),
            currentP = parseInt($current.attr('data-position'), 10),
            currentHeight = parseInt($current.attr('data-height'), 10),
            windowHeight = $(window).height();

        if(docTop < currentP && $current.index() > 0){
            $current.removeClass('current').css({marginTop: 0})
                    .nextAll().css({display:'none'}).end()
                    .prev().addClass('current').css({display:'block'});
        } else if(docTop < (currentP + $current.height())){
            $current.css({marginTop:-(docTop-currentP)});

            if($fixed.length){
                var dataTop = parseInt($fixed.attr('data-top'), 10);
                if((docTop-currentP+windowHeight) >= currentHeight && $fixed.css('position') === 'fixed'){
                    console.log($fixed.css('position'));
                    var newTop = docTop-currentP + dataTop;
                    $fixed.css({
                        position: 'absolute',
                        top: Math.abs(newTop)
                    });
                } else if((docTop-currentP+windowHeight) <= currentHeight && $fixed.css('position') === 'absolute'){
                    $fixed.css({
                        position: 'fixed',
                        top: dataTop
                    });
                }
            }

        } else {
            $current.removeClass('current')
                    .css({display:'none'})
                    .next().addClass('current').nextAll().css({display:'block'});
        }
    };
    
    // Setters
    Plugin.prototype.setDimensions = function(){
        var windowHeight = $(window).height(),
            levelHeight = 0,
            cover = false;

        $(this.element).find('>li').each(function(index) {
            var $self = $(this);
            cover = $self.hasClass('cover');

            if(cover){
                $self.css({height: windowHeight, zIndex: 999-index})
                    .attr('data-height',windowHeight)
                    .attr('data-position',levelHeight);
                levelHeight += windowHeight;
            } else{
                var height = ($self.outerHeight() <= windowHeight) ? windowHeight : $self.outerHeight();
                $self.css({minHeight: height, zIndex: 999-index})
                    .attr('data-height',height)
                    .attr('data-position',levelHeight);
                levelHeight += height;
            }

            if($self.find('.fixed').length){
                var top = $self.find('.fixed').css('top');
                $self.find('.fixed').attr('data-top', top);
            }

            if(index===0) {
                $self.addClass('current');
                $self.next().nextAll().css({display:'none'});
            }

        });

        this.setBodyHeight();
    };

    Plugin.prototype.setEvents = function() {
        var self = this;
        $(window).resize(function(){
            self.setDimensions();
        });
        $(document).scroll(function(){
            if(!self.options.mobile)
                self.scrollEvent();
        });
        $(document).keydown(function(e){
            if(e.keyCode === 38 || e.keyCode === 37) {
               self.scrollToPosition('up');
            }
            if(e.keyCode === 40 || e.keyCode === 39){
                self.scrollToPosition('down');
            }
        });
        if ("onhashchange" in window) {
            window.addEventListener("hashchange", function(){
                self.isHashIsOnList(location.hash.substring(1));
            }, false);
        }
    };

    Plugin.prototype.setBodyHeight = function(){
        var h = 0;
        $(this.element).find('>li').each(function() {
           h += $(this).height();
        });
        this.options.bodyHeight = h;
        $('body').height(h);
    };

    Plugin.prototype.setLinks = function(){
        var self = this;
        $(this.element).find('>li').each(function() {
            var id = $(this).attr('id') || 0;
            self.options.linksArray.push(id);
        });
    };

    Plugin.prototype.setHash = function(hash){
        window.location.hash = hash;
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    };

    // Utils
    Plugin.prototype.isHashIsOnList = function(hash){
        var self = this;
        $.each(self.options.linksArray, function(i,val){
            if(val === hash){
                self.scrollToPosition(hash);
                return false;
            }
        });
    };


})( jQuery, window, document );
