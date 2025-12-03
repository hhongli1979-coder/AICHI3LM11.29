/*=====================
    Header Sticky js
==========================*/
$(window).scroll(function () {
    if ($(this).scrollTop() > 120) {
        $('header').addClass('fixed');
    } else {
        $('header').removeClass('fixed');
    }
});


/*=====================
    home Contain opacity js
==========================*/
$(document).ready(function () {
    function updateStyles() {
        var scrollTop = $(window).scrollTop();
        var opacity = 1 - scrollTop / 200;

        $(".home-contain").css('opacity', opacity);

        if (opacity <= 0) {
            $(".home-contain").css('z-index', -1);
        } else {
            $(".home-contain").css('z-index', 0);
        }
    }

    // Update styles on page load
    updateStyles();

    // Update styles on scroll
    $(window).scroll(function () {
        updateStyles();
    });

    $('.spinner-btn').click(function(event){
        event.preventDefault();

        $('.invalid-feedback').removeClass('d-block');
        if ($(this).parents('form').valid()) {
            $(this).prop('disabled', true);
            $(this).append('<span class="spinner-border spinner-border-sm ms-2 spinner_loader"></span>');
            const form = $(this).parents('form');
            form.submit();
        }
    });

    // Toggle Password
    $('.toggle-password').on('click', function () {
        var input = $(this).closest('.position-relative').find('input');
        var span = $(this).closest('.toggle-password').find('span');

        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            $(this).removeClass('ri-eye-line').addClass('ri-eye-off-line');
            if (span && span.length > 0) {
                span.html(' Hide');
            }
        } else {
            input.attr('type', 'password');
            $(this).removeClass('ri-eye-off-line').addClass('ri-eye-line');
            if (span && span.length > 0) {
                span.html(' Show');
            }
        }
    });
});


/*=====================
    Counter js
==========================*/

document.addEventListener('DOMContentLoaded', function () {
    if ("IntersectionObserver" in window) {
        let counterObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let counter = entry.target;

                    // Clean the text and parse as float to support decimals
                    let textValue = counter.getAttribute('data-target') || counter.innerText.trim().replace(/[^0-9.]/g, '');
                    let target = textValue ? parseFloat(textValue) : 0;
                    if (isNaN(target)) target = 0;

                    let step = target / 200;
                    let current = 0;

                    let timer = setInterval(function () {
                        current += step;
                        counter.innerText = current.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });

                        if (current >= target) {
                            clearInterval(timer);
                            counter.innerText = target.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
                        }
                    }, 10);

                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the element is visible

        let counters = document.querySelectorAll(".counter");
        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }
});


/*=====================
    sidebar js
==========================*/
const filterButton = document.querySelector(".navbar-toggler");
const filterSideBar = document.querySelector(".header-middle");
const filterOverlay = document.querySelector(".overlay");
const closeBtns = document.querySelectorAll(".close-menu"); // Select all close buttons

// Add class to the element
filterButton.addEventListener("click", function () {
    filterSideBar.classList.add("show");
    filterOverlay.classList.add("show");
});

// Loop through each close button and add event listener
closeBtns.forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
        filterSideBar.classList.remove("show");
        filterOverlay.classList.remove("show");
    });
});

filterOverlay.addEventListener("click", function () {
    filterSideBar.classList.remove("show");
    filterOverlay.classList.remove("show");
});


// document.addEventListener("DOMContentLoaded", function () {
//     var lastScrollTop = 0;
//     var header = document.querySelector("header");
//     var headerHeight = header.offsetHeight;

//     window.addEventListener("scroll", function () {
//         var windowTop = window.scrollY;

//         if (windowTop >= headerHeight) {
//             header.classList.add("nav-down");
//         } else {
//             header.classList.remove("nav-down");
//             header.classList.remove("nav-up");
//         }

//         if (header.classList.contains("nav-down")) {
//             if (windowTop < lastScrollTop) {
//                 header.classList.add("nav-up");
//             } else {
//                 header.classList.remove("nav-up");
//             }
//         }

//         lastScrollTop = windowTop;
//         // document.getElementById("windowtop").textContent = "scrollTop: " + windowTop;
//     });
// });


$(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
        $('header').addClass('active')
    } else {
        $('header').removeClass('active')
    }
});

/*=====================
   Header scrollspy js
==========================*/
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", navHighlighter);

function navHighlighter() {

    // Get current scroll position
    let scrollY = window.pageYOffset;

    // Now we loop through sections to get height, top and ID values for each
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute("id");

        if (
            scrollY > sectionTop &&
            scrollY <= sectionTop + sectionHeight
        ) {
            document.querySelector(".nav-item a[href*=" + sectionId + "]").classList.add("active");
        } else {
            document.querySelector(".nav-item a[href*=" + sectionId + "]").classList.remove("active");
        }

    });
}
