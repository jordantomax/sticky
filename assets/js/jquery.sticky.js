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
      delay: 25,
    };
    var options = $.extend(defaults, options);


    var didScroll = false;

    $(window).scroll(function() {
      didScroll = true;
    });

    return this.each(function() {
      var element = $(this);

      // get the sticky element
      var sticky = $(element);

      // ...and it's distance from document top
      var fromTop = sticky.offset().top;

      setInterval(function() {
        if (didScroll) {
          didScroll = false;
          if (fromTop <= $(document).scrollTop()) {

          }
          else {
          }
        }
      }, defaults.delay);
    });
  }
})(jQuery);