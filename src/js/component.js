
(function($){
    $.fn.viewportChecker = function(useroptions){
        // Define options and extend with user
        var options = {
            classToAdd: 'visible',
            classToRemove : 'invisible',
            classToAddForFullView : 'full-visible',
            removeClassAfterAnimation: false,
            offset: 100,
            repeat: false,
            invertBottomOffset: true,
            callbackFunction: function(elem, action){},
            scrollHorizontal: false,
            scrollBox: window
        };
        $.extend(options, useroptions);

        // Cache the given element and height of the browser
        var $elem = this,
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()},
            scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1 || navigator.userAgent.toLowerCase().indexOf('windows phone') != -1) ? 'body' : 'html');

        /*
         * Main method that checks the elements and adds or removes the class(es)
         */
        this.checkElements = function(){
            var viewportStart, viewportEnd;

            // Set some vars to check with
            if (!options.scrollHorizontal){
                viewportStart = $(scrollElem).scrollTop();
                viewportEnd = (viewportStart + boxSize.height);
            }
            else{
                viewportStart = $(scrollElem).scrollLeft();
                viewportEnd = (viewportStart + boxSize.width);
            }

            // Loop through all given dom elements
            $elem.each(function(){
                var $obj = $(this),
                    objOptions = {},
                    attrOptions = {};

                //  Get any individual attribution data
                if ($obj.data('vp-add-class'))
                    attrOptions.classToAdd = $obj.data('vp-add-class');
                if ($obj.data('vp-remove-class'))
                    attrOptions.classToRemove = $obj.data('vp-remove-class');
                if ($obj.data('vp-add-class-full-view'))
                    attrOptions.classToAddForFullView = $obj.data('vp-add-class-full-view');
                if ($obj.data('vp-keep-add-class'))
                    attrOptions.removeClassAfterAnimation = $obj.data('vp-remove-after-animation');
                if ($obj.data('vp-offset'))
                    attrOptions.offset = $obj.data('vp-offset');
                if ($obj.data('vp-repeat'))
                    attrOptions.repeat = $obj.data('vp-repeat');
                if ($obj.data('vp-scrollHorizontal'))
                    attrOptions.scrollHorizontal = $obj.data('vp-scrollHorizontal');
                if ($obj.data('vp-invertBottomOffset'))
                    attrOptions.scrollHorizontal = $obj.data('vp-invertBottomOffset');

                // Extend objOptions with data attributes and default options
                $.extend(objOptions, options);
                $.extend(objOptions, attrOptions);

                // If class already exists; quit
                if ($obj.data('vp-animated') && !objOptions.repeat){
                    return;
                }

                // Check if the offset is percentage based
                if (String(objOptions.offset).indexOf("%") > 0)
                    objOptions.offset = (parseInt(objOptions.offset) / 100) * boxSize.height;

                // Get the raw start and end positions
                var rawStart = (!objOptions.scrollHorizontal) ? $obj.offset().top : $obj.offset().left,
                    rawEnd = (!objOptions.scrollHorizontal) ? rawStart + $obj.height() : rawStart + $obj.width();

                // Add the defined offset
                var elemStart = Math.round( rawStart ) + objOptions.offset,
                    elemEnd = (!objOptions.scrollHorizontal) ? elemStart + $obj.height() : elemStart + $obj.width();

                if (objOptions.invertBottomOffset)
                    elemEnd -= (objOptions.offset * 2);

                // Add class if in viewport
                if ((elemStart < viewportEnd) && (elemEnd > viewportStart)){

                    // Remove class
                    $obj.removeClass(objOptions.classToRemove);
                    $obj.addClass(objOptions.classToAdd);

                    // Do the callback function. Callback wil send the jQuery object as parameter
                    objOptions.callbackFunction($obj, "add");

                    // Check if full element is in view
                    if (rawEnd <= viewportEnd && rawStart >= viewportStart)
                        $obj.addClass(objOptions.classToAddForFullView);
                    else
                        $obj.removeClass(objOptions.classToAddForFullView);

                    // Set element as already animated
                    $obj.data('vp-animated', true);

                    if (objOptions.removeClassAfterAnimation) {
                        $obj.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $obj.removeClass(objOptions.classToAdd);
                        });
                    }

                // Remove class if not in viewport and repeat is true
                } else if ($obj.hasClass(objOptions.classToAdd) && (objOptions.repeat)){
                    $obj.removeClass(objOptions.classToAdd + " " + objOptions.classToAddForFullView);

                    // Do the callback function.
                    objOptions.callbackFunction($obj, "remove");

                    // Remove already-animated-flag
                    $obj.data('vp-animated', false);
                }
            });

        };

        /**
         * Binding the correct event listener is still a tricky thing.
         * People have expierenced sloppy scrolling when both scroll and touch
         * events are added, but to make sure devices with both scroll and touch
         * are handles too we always have to add the window.scroll event
         *
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/25
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/27
         */

        // Select the correct events
        if( 'ontouchstart' in window || 'onmsgesturechange' in window ){
            // Device with touchscreen
            $(document).bind("touchmove MSPointerMove pointermove", this.checkElements);
        }

        // Always load on window load
        $(options.scrollBox).bind("load scroll", this.checkElements);

        // On resize change the height var
        $(window).resize(function(e){
            boxSize = {height: $(options.scrollBox).height(), width: $(options.scrollBox).width()};
            $elem.checkElements();
        });

        // trigger inital check if elements already visible
        this.checkElements();

        // Default jquery plugin behaviour
        return this;
    };
  
  
})(jQuery);

$(document).ready(function ($) {

  var anchor = location.hash.replace(/\?$/);
  anchor = anchor.replace('#', '');
  if(anchor) {
    $('.tab_course-menu li').removeClass('active');
    $('.tab_course-item').removeClass('active');
    $('#'+anchor).addClass('active');
    $('.tab_course-menu li[data-course='+anchor+']').addClass('active');
  };
  
  
  
  var viewportWidth = $(window).width();
  if (viewportWidth > 1200) {
    setInterval(function () {
       $('.glitch_wrap').toggleClass("animated");
    }, 2000);
  };

  $('.tab_course').viewportChecker({
      classToAdd: 'visible',
      offset: "35%",
      repeat: true,
      callbackFunction: function(elem, action){
        if (action == 'add') {
          $('.tab_course-nav').addClass('fixed');
        } else {
          $('.tab_course-nav').removeClass('fixed');
        }
      }
  });

  $('.tab_course-menu li').click(function(){
    $('.tab_course-menu li').removeClass('active');
    $(this).addClass('active');
    $('.tab_course-item').removeClass('active');
    $('.tab_course-link').removeClass('active');
    
    $('.tab_course-link[data-course='+$(this).data('course')+']').addClass('active');
    $('#'+ $(this).data('course')).addClass('active');
     var destination = $('#'+ $(this).data('course')).offset().top - 100;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.tab_course-link').click(function(){
     $('.tab_course-link').removeClass('active');
    $('.tab_course-item').removeClass('active');
    $('.tab_course-menu li').removeClass('active');
    $(this).addClass('active');
    $('.tab_course-menu li[data-course='+$(this).data('course')+']').addClass('active');
    $('#'+ $(this).data('course')).addClass('active');
     var destination = $('#'+ $(this).data('course')).offset().top - 100;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  
  $('.drop li').click(function(){
    $(this).toggleClass('active');
    $(this).find('p').slideToggle(200);
  })
  
});

$(window).scroll(function () {
  return $('.nav').toggleClass("fixed", $(window).scrollTop() > 0);
});
$(document).ready(function () {
  $('.concept-link').click(function () {
    var destination = $(".concept").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.structure-link').click(function () {
    var destination = $(".structure").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.program-link').click(function () {
    var destination = $(".program").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.reviews-link').click(function () {
    var destination = $(".reviews").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });
  $('.fecore-link').click(function () {
    var destination = $(".fecore").offset().top - 0;
    $("body,html").animate({
      scrollTop: destination
    }, 500);
  });


  $('.reviews-carousel').owlCarousel({
    loop: true,
    margin: 57,
    nav: false,
    navText: false,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 3
      }
    }
  });
  $('.more-btn').click(function () {
    $(this).parent().find('.more').slideToggle(400);
  });
  $("input[name='phone']").mask("+38(099) 999 99 99");
  $('.enrollment-form input').click(function () {
    $('label').removeClass('active');
    $(this).parent().addClass('active');
  });
  $('.enrollment-form select').click(function () {
    $('label').removeClass('active');
    $(this).parent().addClass('active');
  });
  $('.modal-btn').click(function (e) {
    e.preventDefault;
    $('input[name="registrationType"]').val('default_registration');
    $('.number_of_button').val($(this).attr('id') + " " + $(this).text());
    $('#modal_4 .modal-head h4').text('[' + $(this).text() + ']');
    $('#modal_4 .registration-btn').text($(this).text());
    $('#' + $(this).data('modal')).show('1000');
    $('#' + $(this).data('modal')).animate({
      opacity: 1,
    });
    $('body').addClass('overl-h');
    $('.overlay').show('1000');
  });
  $('.overlay, .popup__close').click(function () {
    $('body').removeClass('overl-h');
    $('.modal').hide('1000');
    $('.overlay').hide('1000');
    $('.modal').animate({
      opacity: 0,
    });
  });

  $('.online').click(function(){
     $('input[name="registrationType"]').val('online');
     $('input[name="lead_price"]').val($(this).parents('.price-col').find('.summ h4 span').text());
  });
  
  $('.offline').click(function(){
     $('input[name="registrationType"]').val('offline');
     $('input[name="lead_price"]').val($(this).parents('.price-col').find('.summ h4 span').text());
  });
  
  $('.mob-btn').click(function () {
    $('.menu').slideToggle();
    $('.nav').toggleClass('bg');
  });
  if ($(window).width() < 1200) {
    $('.menu li').click(function () {
      $('.menu').hide();
    });
  }
  $('.course-btn').click(function () {
    $('.tab_course-menu').slideToggle();
  });
  if ($(window).width() < 1200) {
    $('.tab_course-menu li').click(function () {
      $('.tab_course-menu').hide();
    });
  }

  
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
            vars[key] = value;
        });
        return vars;
    }
    $('input[name="utm_source"]').val(getUrlVars()["utm_source"]);
    $('input[name="utm_campaign"]').val(getUrlVars()["utm_campaign"]);
    $('input[name="utm_medium"]').val(getUrlVars()["utm_medium"]);
    $('input[name="utm_term"]').val(getUrlVars()["utm_term"]);
    $('input[name="utm_content"]').val(getUrlVars()["utm_content"]);
    $('input[name="click_id"]').val(getUrlVars()["aff_sub"]);
    $('input[name="affiliate_id"]').val(getUrlVars()["aff_id"]);
    $('.lead_price').val($('.summ h4 span.default').text());
    $('input[name="page_url"]').val(window.location.hostname);
    $('input[name="ref"]').val(document.referrer);

    $.get("https://ipinfo.io", function(response) {
        $('input[name="ip_address"]').val(response.ip);
        $('input[name="city"]').val(response.city);
/*        if (response.city != 'Kiev') {
          $('.nokiev').hide();
          $('.structure .row').addClass('align-items-center')
          console.log(response.city);
        }*/
    }, "jsonp");





  function showModal(id) {
    $('#' + id).show('1000');
    $('#' + id).animate({
      opacity: 1,
    });
    $('body').addClass('overl-h');
    $('.overlay').show('1000');
  }

  var heightPage = $(document).height()/2;

  $(window).scroll(function() {
    if ($(window).scrollTop() > heightPage) {
      showModal('modal_5');
      heightPage = $(document).height();
    }
  });
/*    $(window).on('beforeunload', function(){
      showModal('modal_6');
      return "Вы точно решили покинуть наш сайт?";
     });*/


    var url = window.location.search;
   

    function readCookie(name) {
        var n = name + "=";
        var cookie = document.cookie.split(';');
        for (var i = 0; i < cookie.length; i++) {
            var c = cookie[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(n) == 0) {
                return c.substring(n.length, c.length);
            }
        }
        return null;
    }
    setTimeout(function() {
        $('.gclid_field').val(readCookie('gclid'));
    }, 3000);
  $('#binct1').parent().attr('href', 'tel:'+$('#binct1').text());
  $('#binct2').parent().attr('href', 'tel:'+$('#binct2').text());


});