'use strict';


 function testWebP() {
    return new Promise(res => {
        const webP = new Image();
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        webP.onload = webP.onerror = () => {
            res(webP.height === 2);
        };
    }).then(hasWebP => {
        let className = hasWebP === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
};
testWebP();


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
    once: false, // whether animation should happen only once - while scrolling down
    mirror: false, // whether elements should animate out while scrolling past them
    anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});

//Отработка кликов по дукументу
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
        clickable:true,
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



// Блокировка скролла мыши
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
// Отключение блокировки скролла мыши
function unlockScroll(elem) {
    if (elem.removeEventListener) {
        elem.removeEventListener("DOMMouseScroll", elem.onmousewheel, false);
        elem.onmousewheel = null;
    } else {
        elem.onmousewheel = null;
    }
}


const scrollTrigger = document.querySelector('.main-screen__scroll-trigger');
if (scrollTrigger) {
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
    let trigerCounter = 0

    // Функция прокрутки к секции медиа
    function scrollToMedia() {
        if (window.innerWidth < 1360) return;
        let dataTrigerValue = dataReverseTriger.getBoundingClientRect().top - flyingHeader.clientHeight;
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
    });
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


// Динамический адаптив на главной странице
(function () {
    let move = (item, parent, parentOriginal, width) => {
        if (!item || !parent || !parentOriginal) {
            return;
        }
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

    const formItem = $('#main-page-form');
    const formItem_mobileParent = $('#mobile-form-parent');
    const formItem_parentOriginal = $('#pc-form-parent');

    const navSidebar = $('#nav-sidebar');
    const navSidebar_mobileParent = $('#mobile-nav-sidebar-parent');
    const navSidebar_parentOriginal = $('#pc-nav-sidebar-parent');


    move(formItem, formItem_mobileParent, formItem_parentOriginal, 1200);
    move(navSidebar, navSidebar_mobileParent, navSidebar_parentOriginal, 1200);
    $(window).resize(function () {
        move(formItem, formItem_mobileParent, formItem_parentOriginal, 1200);
        move(navSidebar, navSidebar_mobileParent, navSidebar_parentOriginal, 1200);
    });
})();




const mobileSearchBtns = document.querySelectorAll('.mobile-search-btn');
mobileSearchBtns.forEach(mobileSearchBtn => {
    mobileSearchBtn.addEventListener('click', (e) => {
        const searchField = mobileSearchBtn.parentNode.querySelector('.search-field__input');
        if (searchField) searchField.focus();
    })
});


$(document).on('click', '.sidebar-item__arrow', function (e) {
    $(this).parent().toggleClass('toggle-open');
    $(this).parent().next().slideToggle(() => { $(this).toggleClass('toggle-open'); })
})








