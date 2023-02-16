'use strict';
import * as baseFunction from './modules/functions.js';
import AOS from 'aos';
import IMask from 'imask';

// Проверка поддержки webP
baseFunction.testWebP();


// // Инит и опции библиотеки анимаций
AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: 'load', // name of the event dispatched on the document, that AOS should initialize on
    initClassName: 'aos-init', // class applied after initialization
    animatedClassName: 'aos-animate', // class applied on animation
    useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: false, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: 25, // offset (in px) from the original trigger point
    delay: 100, // values from 0 to 3000, with step 50ms
    duration: 1200, // values from 0 to 3000, with step 50ms
    easing: 'ease', // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});

//логика работы меню бургер
document.body.addEventListener('click', (e) => {
    const target = e.target;
    // Работа мобильно меню
    if (target.hasAttribute('data-burger-menu') || target.classList.contains('mobile-menu__close')) {
        document.querySelector('[data-header-menu]').classList.toggle('active');
    }


    // Закрытие модально окна с успешной от правкой формы
    if ((target.closest('.form-sucsess') && !target.closest('.form-sucsess__content')) || target.hasAttribute('data-close-form-sucsess')) {
        document.querySelector('.form-sucsess').classList.remove('show');
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


const scrollTrigger = document.querySelector('.main-screen__scroll-trigger');
const flyingHeader = document.querySelector('.fixed-header');
const dataReverseTriger = document.querySelector('[data-reverse-triger]');

var scrollPos = 0;
let sctollDirection = 1;
$(window).scroll(function () {
    var st = $(this).scrollTop();
    if (st > scrollPos) {
        sctollDirection = 1;
    } else {
        sctollDirection = -1;
    }
    scrollPos = st;
});

if (scrollTrigger) {
    let trigerCounter = 0

    function scrollToMedia() {
        if (window.innerWidth < 1360) return;
        let dataTrigerValue = dataReverseTriger.getBoundingClientRect().top - flyingHeader.clientHeight;
        console.log(window.scrollY < 10, trigerCounter == 0, dataTrigerValue > 0, sctollDirection > 0);
        if (window.scrollY < 10 && trigerCounter == 0 && dataTrigerValue > 0 && sctollDirection > 0) {
            trigerCounter = 1;
            document.body.classList.add('no-click');
            lockScroll(document.querySelector('body'));
            $('html, body').animate({
                scrollTop: dataTrigerValue,
            }, 600, 'swing', function () {
                trigerCounter = 0;
                unlockScroll(document.querySelector('body'));
                document.body.classList.remove('no-click');
            });
        }
    }

    window.addEventListener("scroll", scrollToMedia);
    document.querySelector('.scroll-helper').addEventListener('click', () => {
        sctollDirection = 1;
        scrollToMedia()
    })

}


function validateEmail(email) {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


//Валидация формы для возможности нажать Отправить
document.querySelectorAll('.inner-form').forEach(form => {
    const formBtn = form.querySelector('.inner-form__btn');
    formBtn.setAttribute('disabled', true);
    const innerFormInput = form.querySelector('.inner-form__input');
    const formAgreeCheckbox = form.querySelector('.form__agree-checkbox');

    innerFormInput.addEventListener('input', (e) => {
        if (validateEmail(e.target.value) && formAgreeCheckbox.checked) {
            formBtn.removeAttribute('disabled');
        }
        else {
            formBtn.setAttribute('disabled', true);
        }
    });

    formAgreeCheckbox.addEventListener('change', (e) => {
        if (e.target.checked && validateEmail(innerFormInput.value.trim())) {
            formBtn.removeAttribute('disabled');
        } else {
            formBtn.setAttribute('disabled', true);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateEmail(innerFormInput.value.trim()) && formAgreeCheckbox.checked) {
            // тут отправка на сервер формы
            form.querySelector('.form-sucsess').classList.add('show');
            form.reset();
            formBtn.setAttribute('disabled', true);
        }
    });
});


// Валидацця опроса для возжность нажать кнопку Пройти опрос
document.querySelectorAll('.survey').forEach(survey => {
    const surveyVariants = survey.querySelectorAll('.survey__input');
    const submitBtn = survey.querySelector('.survey__btn');
    surveyVariants.forEach(variant => {
        variant.addEventListener('change', (e) => {
            submitBtn.removeAttribute('disabled');
        });
    });
});





(function () {
    let move = (item, parent, parentOriginal, width) => {
        if ($(window).width() <= width) {
            if (!item.hasClass('done')) {
                item.appendTo(parent);
                item.addClass('done');
            }
        } else {
            if (item.hasClass('done')) {
                item.appendTo(parentOriginal);
                item.removeClass('done');
            }
        }
    };


    const block_item = $('#main-page-form');
    const block_parent = $('#mobile-form-parent');
    const block_parentOriginal = $('#pc-form-parent');

    move(block_item, block_parent, block_parentOriginal, 1200);

    $(window).resize(function () {
        move(block_item, block_parent, block_parentOriginal, 1200);
    });
})();




