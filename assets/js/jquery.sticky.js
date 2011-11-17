/*
 * jQuery Sticky version 0.2
 * https://github.com/jordancooperman/sticky
 *
 * author: Jordan Cooperman
 * email: jordancooperman@gmail.com
 * twitter: @jordancooperman
 *
 * Copyright 2011, Jordan Cooperman
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($){

    var
    // keeps track of the height
    // of all sticky elements
    stickiesHeight = 0,

    // variables for cached values
    prefix = 'sticky',
    div = 'div';

    /* HELPER METHODS
    =========================== */

	// convience function for creating new jQuery objects
	// adapted from jquery.colorbox.js, jack@colorpowered.com
    function $tag( tag, id, css ) {
        var element = document.createElement(tag);

        if (id) {
            element.id = prefix + id;
        }

        if (css) {
            $(element).css(css);
        }

        return $(element);
    }

    // convenience function for wrapping elements
    function wrapElement( element, css ) {
        var $wrapper = $tag(div, '-wrapper', css);

        $(element).before($wrapper);
        $(element).appendTo($wrapper);
    }


    /* PUBLIC METHODS
    =========================== */

    var methods = {

        init: function( options ) {
            var self = this;

            return this.each(function(i) {
                var
                $this = $(this),
                data = $this.data('sticky'),
                sticky = {
                    offset: $this.offset().top,
                    height: $this.height(),
                    topCatch: 0
                },

                // default settings
                defaults = {
                    stickyCss: {
                        top: 0,
                        position: "fixed",
                        width: $this.width(),
                        bottom: 'auto',
                        zIndex: 1000
                    },
                    unstickyCss: {
                        position: "static"
                    },
                    absolute: false,
                    anchored: false,
                    anchoredTo: '.sticky-blockade',
                    inFlow: true,
                    fullWidth: false,
                };
                var settings = $.extend( true, {}, defaults, options );

                // if the plugin has not been initializated
                if ( ! data ) {

                    $this.data('sticky', {
                        target : $this,
                        sticky : sticky,
                        settings : settings
                    });
                }

                // set where our sticky elements will catch
                $this.data('sticky').sticky.topCatch = stickiesHeight;
                stickiesHeight += $this.data('sticky').sticky.height;

                // add wrapper with the height of our element
                // to prevent the page from jumping when we
                // fix the element's position
                if ( settings.inFlow == true ) {
                    wrapElement( this, {
                        height: $this.height()
                    });

                // add wrapper with same top position of our element
                // to keep a reference to the top offset
                // in case it changes
                } else if (  settings.absolute == true ) {
                    wrapElement( this, {
                        position: "absolute",
                        top: $this.css('top')
                    });
                    $this.css('top', '0');
                }

                // in case the page loads below
                // our topCatch, update once initialized
                methods.update.apply( self );
            });

        },
        update: function() {

            return this.each(function() {

                var $this = $(this),
                    data = $this.data('sticky'),
                    sticky = data.sticky,
                    settings = data.settings;

                // if a sticky element in the flow changes size
                // recalculate the offset of absolutely positioned sticky elements
                if ( $this.parent().offset().top != sticky.offset ) {
                    sticky.offset = $this.parent().offset().top;
                }

                // if we scroll to the topCatch of our sticky elements
                if ( sticky.offset - sticky.topCatch - settings.stickyCss.top <= $(document).scrollTop() ) {

                    $this.css( settings.stickyCss ).css( 'top', sticky.topCatch + settings.stickyCss.top );

                    if ( settings.fullWidth == true ) {
                        $this.css( "width", "100%" );
                    }

                    if ( settings.anchored == true && $this.height() + settings.stickyCss.top + sticky.topCatch + $(document).scrollTop() >= $(settings.anchoredTo).offset().top ) {
                        $this.addClass('anchored');
                        $this.parent().css({
                            height: "100%"
                        });
                        $this.css(settings.unstickyCss);
                        $this.css({
                            position: "absolute",
                            bottom: 15,
                            top: "auto",
                            zIndex: 999,
                        });

                    } else if (settings.anchored == true && $this.hasClass('anchored')) {
                        $this.removeClass('anchored');
                        $this.css(settings.stickyCss).css( 'top', sticky.topCatch + settings.stickyCss.top );
                        $this.parent().css({
                            height: "auto"
                        })

                    }

                } else {
                    $this.css( data.settings.unstickyCss );
                }

            })
        }
    };

    $.fn.sticky = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ))
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist on jQuery.sticky' );
        }
    }

})(jQuery);