var sliderOne = new Swiper(".user-slider", {
  slidesPerView: 5,
  spaceBetween: 15,
  freeMode: true,
  loop: true,

  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    767: {
      slidesPerView: 3,
    },
    991: {
      slidesPerView: 4,
    },
    1199: {
      slidesPerView: 5,
    },

  },

  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
});
var sliderTwo = new Swiper(".driver-slider", {
  slidesPerView: 4.5,
  spaceBetween: 15,
  freeMode: true,
  loop: true,

  breakpoints: {
    0: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    767: {
      slidesPerView: 3,
    },
    991: {
      slidesPerView: 4,
    },
    1199: {
      slidesPerView: 5,
    },
  },


  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
});