function scrollTo(clicked_link, nav_height) {
  var $ = window.jQuery;
  var element_class = clicked_link.attr('href').replace('#', '.');
  var scroll_to = 0;
  if(element_class != '.top-content') {
    element_class += '-container';
    scroll_to = $(element_class).offset().top - nav_height;
  }
  if($(window).scrollTop() != scroll_to) {
    $('html, body').stop().animate({scrollTop: scroll_to}, 1000);
  }
}

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/* Base URLs of the actual application */
var appUrl = "https://app.getredirects.com";
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    appUrl = "http://localhost:8000";
}

jQuery(document).ready(function() {
  var $ = window.jQuery;

  /*
      Navigation
  */
  $('a.scroll-link').on('click', function(e) {
    e.preventDefault();
    scrollTo($(this), 0);
  });

    /*
        Background slideshow
    */
    // $('.top-content').backstretch("assets/img/backgrounds/1.jpg");
    // $('.how-it-works-container').backstretch("assets/img/backgrounds/1.jpg");
    // $('.call-to-action-container').backstretch("assets/img/backgrounds/1.jpg");
    // $('.testimonials-container').backstretch("assets/img/backgrounds/1.jpg");

    // $('#top-navbar-1').on('shown.bs.collapse', function(){
    //  $('.top-content').backstretch("resize");
    // });
    // $('#top-navbar-1').on('hidden.bs.collapse', function(){
    //  $('.top-content').backstretch("resize");
    // });

    // $('a[data-toggle="tab"]').on('shown.bs.tab', function() {
    //  $('.testimonials-container').backstretch("resize");
    // });

    /*
        Wow
    */
  if (!isMobileDevice()) { // WOW doesn't work well on mobile
    new WOW().init();
  }

  /*
      Modals
  */
  $('.launch-modal').on('click', function(e){
    e.preventDefault();
    $( '#' + $(this).data('modal-id') ).modal();
  });

  /*
      Subscription form
  */
  $('.subscribe form').submit(function(e) {
      e.preventDefault();
      var postdata = $('.subscribe form').serialize();
      var $button = $('.subscribe button');
      var buttonOrigHtml = $button.html();

      $button.html('Signing up...');
      $button.attr("disabled", "disabled");

      // This uses GetRedirects App
      $.ajax({
          type: 'POST',
          url: appUrl + '/api/user/register',
          data: postdata,
          dataType: 'json',
          complete: function(response) {
              $('html, body').stop().animate({scrollTop: $('.subscribe').offset().top - 40}, 1000);
              $button.html(buttonOrigHtml);
              $button.removeAttr("disabled");

              // Error response
              if(response.status != 200) {
                  $('.success-message').hide();
                  $('.error-message').hide();

                  // Server-side validation error
                  if (typeof(response.responseJSON) != 'undefined') {
                      var err = response.responseJSON.contents;
                      var msg = err.toLowerCase().indexOf("already signed up") != -1
                              ? err + " Please <a href='" + appUrl + "/login'>log in</a>"
                              : err;

                      $('.error-message').html(msg);
                      ga('send', 'event', 'Signups', 'beta_signup_validation_error', 'Signup validation error');

                  // Some other server error
                  } else {
                      $('.error-message').html("Oops! A server error occured. Please try again.");
                      ga('send', 'event', 'Signups', 'beta_signup_server_error', 'Signup server error');
                  }

                  $('.error-message').fadeIn('fast', function(){
                    $('.subscribe form').addClass('animated shake').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass('animated shake');
                    });
                  });
              }
              // OK response
              else {
                  ga('send', 'event', 'Signups', 'beta_signup_complete', 'Signup complete');
                  fbq('track', 'CompleteRegistration');

                  $('.error-message').hide();
                  $('.success-message').hide();
                  $('.subscribe form').hide();
                  $('.success-message').html(response.responseJSON.contents);
                  $('.success-message').fadeIn('fast', function(){
                    // $('.top-content').backstretch("resize");
                  });
              }
          }
      });
  });

  /*
    Login link url
  */
  $('#login-link').attr('href', appUrl + '/login');

});


jQuery(window).load(function() {
  var $ = window.jQuery;

  /*
    Loader
  */
  // $(".loader-img").fadeOut();
  // $(".loader").delay(1000).fadeOut("slow");

  /*
    Hidden images
  */
  $(".modal-body img, .testimonial-image img").attr("style", "width: auto !important; height: auto !important;");

});
