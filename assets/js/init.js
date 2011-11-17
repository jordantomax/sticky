$(function() {
  $('.sticky').sticky({
      stickyCss: {
          top: 10
      }
  });
  setInterval(function() {
      $('.sticky').sticky('update');
  }, 1000/30);
});