/*
 * jQuery Sticky version 0.1
 * https://github.com/jordancooperman/Sticky
 *
 * Copyright 2011, Jordan Cooperman
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {

  $.fn.sticky = function(options) {

    var defaults = {
      delay: 300,
      top: 20,
      buffer: 1000, // the distance beyond the element in question to act
      zIndex: 1000,
      left: "auto",
      position: "static",
      width: "",
      stackOrder: 1,
    };
    var options = $.extend(defaults, options);

    var stickyCss = {
      position: "fixed",
      top: defaults.top,
      left: defaults.left,
      zIndex: defaults.zIndex,
      width: defaults.width,
    }
    var unstickyCss = {
        position: defaults.position,
    }

    var didScroll = false;

    $(window).scroll(function() {
      didScroll = true;
    });


    return this.each(function() {
        var element = $(this),

            // get the sticky element
            sticky = $(element),

            // clone it
            clone = sticky.clone(),

            // ...and its width
            width = sticky.parent().width(),

            // ...and its distance from document top
            fromTop = sticky.offset().top,

            isVisible = false;

            clone.appendTo(sticky).css({width: width}).css(stickyCss).hide();

            if ( (fromTop + defaults.buffer <= $(document).scrollTop() + defaults.top) ) {
                if (isVisible == false) {
                    isVisible = true;
                    clone
                        .show();
                }

            }

        setInterval(function() {

            if (didScroll) {
                didScroll = false;
                if ( (fromTop + defaults.buffer <= $(document).scrollTop() + defaults.top) ) {
                    if (isVisible == false) {
                        isVisible = true;
                        clone.slideToggle("fast");
                    }
                }

                else {
                    if (isVisible == true) {

                        isVisible = false;
                        clone.slideToggle("fast");
                    }
                }
            }
            }, defaults.delay);
        });
  }
})(jQuery);