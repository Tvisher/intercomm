'use strict';
import * as baseFunction from './modules/functions.js';
// import AOS from 'aos';
import IMask from 'imask';

// Проверка поддержки webP
baseFunction.testWebP();


// // Инит и опции библиотеки анимаций
// AOS.init({
//     // Global settings:
//     disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
//     startEvent: 'load', // name of the event dispatched on the document, that AOS should initialize on
//     initClassName: 'aos-init', // class applied after initialization
//     animatedClassName: 'aos-animate', // class applied on animation
//     useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
//     disableMutationObserver: false, // disables automatic mutations' detections (advanced)
//     debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
//     throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
//     // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
//     offset: 25, // offset (in px) from the original trigger point
//     delay: 100, // values from 0 to 3000, with step 50ms
//     duration: 1200, // values from 0 to 3000, with step 50ms
//     easing: 'ease', // default easing for AOS animations
//     once: false, // whether animation should happen only once - while scrolling down
//     mirror: false, // whether elements should animate out while scrolling past them
//     anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
// });

//логика работы меню бургер
document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.hasAttribute('data-burger-menu') || target.classList.contains('mobile-menu__close')) {
        document.querySelector('[data-header-menu]').classList.toggle('active');
    }
});

// Маска на номера телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    const mask = IMask(input, {
        mask: '+{7}(000) 000-00-00'
    });
});


const mainSliderComponent = new Swiper('.main-slider__component', {
    slidesPerView: 1,
    speed: 1100,
    autoplay: {
        delay: 5000,
    },
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
});

// Функция для работы фикс меню
(function () {
    const staticHeader = document.querySelector('.header');
    const flyingHeader = document.querySelector('.fixed-header');
    const checkScroll = () => {

        const windowScroll = window.scrollY;
        if (windowScroll > staticHeader.clientHeight) {
            flyingHeader.classList.add('fixed');
        } else {
            flyingHeader.classList.remove('fixed');
        }
    }
    checkScroll();
    window.addEventListener('scroll', checkScroll);
})();


(function () {
    const scrollTrigger = document.querySelector('.main-screen__scroll-trigger');
    const flyingHeader = document.querySelector('.fixed-header');
    const dataReverseTriger = document.querySelector('[data-reverse-triger]');

    var scrollPos = 0;
    let sctollDirection;
    $(window).scroll(function () {
        var st = $(this).scrollTop();
        if (st > scrollPos) {
            sctollDirection = 1;
        } else {
            sctollDirection = -1;
        }
        scrollPos = st;
    });


    function lockScroll(elem) {
        if (elem.addEventListener) {
            elem.addEventListener("DOMMouseScroll", elem.onmousewheel = function (e) {
                e.preventDefault();
            }, false);
        } else {
            elem.onmousewheel = function (e) {
                window.event.returnValue = false;
            }
        }
    }

    function unlockScroll(elem) {
        if (elem.removeEventListener) {
            elem.removeEventListener("DOMMouseScroll", elem.onmousewheel, false);
            elem.onmousewheel = null;
        } else {
            elem.onmousewheel = null;
        }
    }


    if (scrollTrigger) {
        let trigerCounter = 0
        window.addEventListener("scroll", (e) => {
            if (window.innerWidth < 1360) return;

            let dataTrigerValue = dataReverseTriger.getBoundingClientRect().top - flyingHeader.clientHeight;
            if (window.scrollY < 10 && trigerCounter == 0 && dataTrigerValue > 0 && sctollDirection > 0) {
                console.log('Прокрутка к Медиа');
                trigerCounter = 1;
                document.body.classList.add('no-click');
                lockScroll(document.querySelector('body'));
                $('html, body').animate({
                    scrollTop: dataTrigerValue
                }, 2000, function () {
                    trigerCounter = 0;
                    console.log("Animation complete");
                    unlockScroll(document.querySelector('body'));
                    document.body.classList.remove('no-click');
                });
            }

            // if (sctollDirection < 0 && dataTrigerValue > 0) {
            //     console.log('Прокрутка к началу');
            //     $('html, body').animate({
            //         scrollTop: 0
            //     }, 2000, function () {
            //         console.log("Animation complete");
            //     });
            // }
        })
    }
})()

