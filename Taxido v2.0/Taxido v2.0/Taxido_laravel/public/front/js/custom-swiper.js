var blogSwiper = new Swiper(".blog-swiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    },
});

var commentSlider = new Swiper(".comment-slider", {
    slidesPerView: 4,
    loop: false,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        575: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1400: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    },
});

var screenContent = new Swiper(".screen-content-slider", {
    loop: true,
    spaceBetween: 50,
    slidesPerView: 4,
    direction: "vertical",
    freeMode: true,
    autoplay: true,
    watchSlidesProgress: true,
    centeredSlides: true,
    slideToClickedSlide: false,
    allowTouchMove: false,
    navigation: false,
    breakpoints: {
        0: {
            slidesPerView: 1,
            direction: "horizontal",
        },
        380: {
            slidesPerView: 1.3,
            direction: "horizontal",
        },
        576: {
            slidesPerView: 1.8,
            direction: "horizontal",
        },
        992: {
            slidesPerView: 4,
            direction: "vertical",
        },
    },
});

var screenImage = new Swiper(".screen-image-slider", {
    loop: true,
    spaceBetween: 10,
    autoplay: true,
    slideToClickedSlide: false,
    allowTouchMove: false,
    navigation: false,
});

var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 15,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 2,
        },
        550: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 4,
        },
    },
});