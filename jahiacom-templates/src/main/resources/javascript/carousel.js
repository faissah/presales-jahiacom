$('.responsive-slider').slick({
  dots: false,
  prevArrow:'<span class="slick-prev"></span>',
  nextArrow:'<span class="slick-next"></span>',
  infinite: true,
  speed: 650,
  slidesToShow: 1,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1199,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
});

