$(document).ready(function(){


  $(".toggle").on('click',function(){
    $(this).toggleClass("open");
  });
  $(".products-scrolling.scrolling-menu").on('click',function(){
    $(this).toggleClass("open");
    $(".products-scrolling.scrolling-menu .sub-menu ul").toggleClass("open");
  });
  $(".services-scrolling.scrolling-menu").on('click',function(){
    $(this).toggleClass("open");
    $(".services-scrolling.scrolling-menu .sub-menu ul").toggleClass("open");
  });
  $(".about-scrolling.scrolling-menu").on('click',function(){
    $(this).toggleClass("open");
    $(".about-scrolling.scrolling-menu .sub-menu ul").toggleClass("open");
  });
  $(".about-scrolling.scrolling-menu").on('click',function(){
    $(this).toggleClass("open");
    $(".about-scrolling.scrolling-menu .sub-menu ul").toggleClass("open");
  });
  $(".show.more-customers").on('click',function(){
    $(this).removeClass("active");
    $("show.less-customers").addClass("active");
  });
  $(".show.less-customers").on('click',function(){
    $(this).removeClass("active");
    $("show.more-customers").addClass("active");
  });
  $(".tabs li:first-child").on('click',function(){
    $(this).addClass("open");
    $(".tabs li:last-child").removeClass("active");
  });
  $(".tabs li:last-child").on('click',function(){
    $(this).addClass("open");
    $(".tabs li:first-child").removeClass("active");
  });

  $(".four-tabs li:first-child").on('click',function(){
    $(this).addClass("open");
    $(".four-tabs li:last-child").removeClass("active");
    $(".four-tabs li:nth-child(2)").removeClass("active");
    $(".four-tabs li:nth-child(3)").removeClass("active");
  });
  $(".four-tabs li:last-child").on('click',function(){
    $(this).addClass("open");
    $(".four-tabs li:first-child").removeClass("active");
    $(".four-tabs li:nth-child(2)").removeClass("active");
    $(".four-tabs li:nth-child(3)").removeClass("active");
  });
  $(".four-tabs li:nth-child(2)").on('click',function(){
    $(this).addClass("open");
    $(".four-tabs li:first-child").removeClass("active");
    $(".four-tabs li:last-child").removeClass("active");
    $(".four-tabs li:nth-child(3)").removeClass("active");
  });
  $(".four-tabs li:nth-child(3)").on('click',function(){
    $(this).addClass("open");
    $(".four-tabs li:first-child").removeClass("active");
    $(".four-tabs li:last-child").removeClass("active");
    $(".four-tabs li:nth-child(2)").removeClass("active");
  });
  $(".three-tabs li:first-child").on('click',function(){
    $(this).addClass("open");
    $(".three-tabs li:last-child").removeClass("active");
    $(".three-tabs li:nth-child(2)").removeClass("active");
  });
  $(".three-tabs li:last-child").on('click',function(){
    $(this).addClass("open");
    $(".three-tabs li:first-child").removeClass("active");
    $(".three-tabs li:nth-child(2)").removeClass("active");
  });
  $(".three-tabs li:nth-child(2)").on('click',function(){
    $(this).addClass("open");
    $(".three-tabs li:first-child").removeClass("active");
    $(".three-tabs li:last-child").removeClass("active");
  });

  if (location.hash !== '') $('a[href="' + location.hash + '"]').tab('show');
  return $('a[data-toggle="tab"]').on('shown', function (e) {
    return location.hash = $(e.target).attr('href').substr(1);
  });
  $('a[href^="http://"]').attr('target','_blank');
  $('a[href^="https://"]').attr('target','_blank');

  $(".jumbotron.fullscreen").css({ height: $(window).height() + "px" });
  $(window).on("resize", function() {
    $(".jumbotron.fullscreen").css({ height: $(window).height() + "px" });
  });

});
