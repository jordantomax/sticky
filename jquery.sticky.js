/*
* jQuery Sticky is in ALPHA, version 1.0
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

(function( $ ){

    var
    defaults = {
        absolute: false,

		// if set true, the sticky element will
		// stop at a selector assigned to anchoredTo
        anchored: false,

		// stop the sticky element at this selector
        anchoredTo: '.anchoredTo',

		// callback for when sticky element 
		// enters and leaves anchored area 
		// the value of 'this' is the sticky element
		anchorOn: false,
		anchorOff: false,

		// ...and when anchor becomes visible and invisible
		anchorVisible: false,
		anchorInvisible: false,

        inFlow: true,
		relativeToOtherStickies: true,
        fullWidth: false,
        delay: 10,

		// how far from the top of the viewport to stick.
		// if relativeToOtherStickies is set to true,
		// we will add the height of all sticky elements above
		fromTop: 10 
    },

    // keeps track of the height
    // of all sticky elements on the page
    relativeStickiesHeight = 0,

    // cached values
    sticky = 'sticky',
    prefix = 'sticky',
    div = 'div',
	$this,
	$wrapper,
	distanceToAnchor,
	anchorOffset,
	windowOffset;
	


    /////////////////////////////////

    // HELPER METHODS

    //////////////////////////////////

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


    /////////////////////////////////

    // APPLICATION METHODS

    //////////////////////////////////
	
    // the main update function 
    function update() {

        var
		self = this,
        data = $.data(this, sticky),
        settings = data._settings,
        didScroll = false,
		didResize = false;

		// save the offset of the anchor for later use
		if (settings.anchored && $(settings.anchoredTo).length) anchorOffset = $(settings.anchoredTo).offset().top;

        // avoid attaching events directly to the window
        $(window).scroll(function() {
            didScroll = true;
        });

		$(window).resize(function() {
			didResize = true;
		})

		// if the browser loads viewport below topCatch, we'll be ready
        checkConditions.call(self, data, settings);

		// check where we're at
        setInterval(function() {
            if ( didScroll || didResize) {
                didScroll = false;
				didResize = false;

                checkConditions.call(self, data, settings);
            }


        }, settings.delay);
    }

	// no variable assignment here,
	// we're inside a timer loop for god's sake!
	function checkConditions(data, settings) {

        $this = $(this),
        $wrapper = $this.parent();

		// if a sticky element in the flow changes size
		// recalculate the offset of absolutely positioned sticky elements
		if ( $wrapper.offset().top != data._offset ) {
			data._offset = $wrapper.offset().top;
		}

		// if we scroll to the topCatch of our sticky elements
		if ( data._offset - data._topCatch - settings.fromTop <= $(document).scrollTop() ) {
			console.log(this);

			if (!data._isAnchored) {
				$this.addClass('s-fixed');
				$this.css( 'top', data._topCatch + settings.fromTop );
			}

			// if our sticky element takes up the full width of the window
			if ( settings.fullWidth === true ) {
				$this.css( "width", "100%" );
			}


		} else {
			$this.removeClass('s-fixed');
		}

		// if our sticky anchor settings is true
		if ( settings.anchored === true ) {

			distanceToAnchor = $this.height() + settings.fromTop + data._topCatch + $(document).scrollTop();
			windowOffset = $(document).scrollTop() + $(window).height();

			// ...anchor us!
			if (!data._isAnchored && distanceToAnchor >= anchorOffset) {
				data._isAnchored = true;
				$this.addClass('s-anchored').css('top', 'auto');

				// provide a callback for when we anchor
				if (typeof settings.anchorOn === 'function') settings.anchorOn.call(this);
			} 

			// ...and we go above anchor
			// ...unanchor!
			else if (data._isAnchored && distanceToAnchor <= anchorOffset){
				data._isAnchored = false;
				$this.removeClass('s-anchored');
				$this.css( 'top', data._topCatch + settings.fromTop );

				// provide a callback for when we unanchor
				if (typeof settings.anchorOff === 'function') settings.anchorOff.call(this);
			}

			// anchor is visible
			if (!data._anchorIsVisible && windowOffset >= anchorOffset) {
				data._anchorIsVisible = true;

				// provide a callback for when anchor is visible
				if (typeof settings.anchorVisible === 'function') settings.anchorVisible.call(this);
			}

			// ...and when it becomes invisible 
			else if (data._anchorIsVisible && windowOffset <= anchorOffset) {
				data._anchorIsVisible = false;

				// provide a callback for when anchor is invisible
				if (typeof settings.anchorInvisible === 'function') settings.anchorInvisible.call(this);
			}

		}
	}

    /////////////////////////////////

    // PUBLIC METHODS

    //////////////////////////////////


    var methods = {

        init: function( options ) {

            var settings = $.extend( true, {}, defaults, options );

            return this.each(function(i) {

				// save some vital information about our sticky element
                var
                $this = $(this),
                data = $.data(this, sticky, {
					_settings: settings,    
					_offset: $this.offset().top,
					_height: $this.height(),
					_width: $this.width(),
					_float: $this.css('float'),
					_topCatch: 0,
					_isAnchored: false,
					_anchorIsVisible: false
                });

				// if our sticky element will sit below other sticky elements
				if (settings.relativeToOtherStickies) {
					// set where our sticky elements will catch
					data._topCatch = relativeStickiesHeight;

					// save the total height of all sticky elements on the page
					// ...in order to position them relative to one another
					relativeStickiesHeight +=  data._height;
				}

                // add wrapper with the height of our element
                // to prevent the page from jumping when we
                // fix the element's position
                if ( settings.inFlow === true ) {
                    wrapElement( this, {
                        height: data._height,
						width: data._width,
						float: data._float
                    });

				// if we're positioned absolutely
                // ...add wrapper with same top position of our element
                // ...to keep a reference to the top offset
                } else if ( settings.absolute === true ) {
                    wrapElement( this, {
						position: "absolute",
						top: $this.css('top')
                    });
                    
                    $this.css('top', '0');
                }

                update.apply( this );
            });
        }
    };

    $.fn.sticky = function( method ) {

        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
        return $.error( 'Method ' + method + ' does not exist on jQuery.sticky' );
        }
    };

})(jQuery);

