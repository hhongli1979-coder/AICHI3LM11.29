/* swiper js */
var rentalContentSlider = new Swiper(".rental-content-slider", {
    loop: true,
    freeMode: true,
    watchSlidesProgress: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
});
var rentalImagesSlider = new Swiper(".rental-images-slider", {
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    spaceBetween: 10,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    thumbs: {
        swiper: rentalContentSlider,
    },
});

var faceCalculationSlider = new Swiper(".face-calculation-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});