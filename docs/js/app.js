"use strict";

function testWebP() {
  return new Promise((res) => {
    const webP = new Image();
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    webP.onload = webP.onerror = () => {
      res(webP.height === 2);
    };
  }).then((hasWebP) => {
    let className = hasWebP === true ? "webp" : "no-webp";
    document.documentElement.classList.add(className);
  });
}
testWebP();


Fancybox.bind("[data-fancybox]", {
  hideScrollbar: false,
});
// // Инит и опции библиотеки анимаций
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: "load", // name of the event dispatched on the document, that AOS should initialize on
  initClassName: "aos-init", // class applied after initialization
  animatedClassName: "aos-animate", // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 25, // offset (in px) from the original trigger point
  delay: 100, // values from 0 to 3000, with step 50ms
  duration: 1200, // values from 0 to 3000, with step 50ms
  easing: "ease", // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
});

//Отработка кликов по дукументу
document.body.addEventListener("click", (e) => {
  const target = e.target;
  // Работа мобильно меню
  if (
    target.hasAttribute("data-burger-menu") ||
    target.classList.contains("mobile-menu__close")
  ) {
    document.querySelector("[data-header-menu]").classList.toggle("active");
  }
  // Закрытие модально окна с успешной от правкой формы
  if (
    (target.closest(".form-sucsess") &&
      !target.closest(".form-sucsess__content")) ||
    target.closest("[data-close-form-sucsess]")
  ) {
    document.querySelector(".form-sucsess").classList.remove("show");
  }
  // закртыие модального окна регистрации / авторизации
  if (
    target.closest(".modal-template__close") ||
    (target.closest(".modal-template") &&
      !target.closest(".modal-template__content"))
  ) {
    const openedForm = target.closest(".modal-template.show");
    if (openedForm) openedForm.classList.remove("show");
  }

  // Открытие модального окна регистрации / авторизации
  if (target.closest("[data-open-modal]")) {
    e.preventDefault();
    const modalId = target
      .closest("[data-open-modal]")
      .getAttribute("data-open-modal");
    const openedModal = document.querySelector(".modal-template.show");
    if (openedModal) openedModal.classList.remove("show");
    const targetModal = document.querySelector(
      `[data-modal-type="${modalId}"]`
    );
    if (targetModal) targetModal.classList.add("show");
  }
});

const mainSliderComponent = new Swiper(".main-slider__component", {
  slidesPerView: 1,
  speed: 1100,
  autoplay: {
    delay: 5000,
  },
  loop: true,
  effect: "fade",
  fadeEffect: {
    crossFade: true,
  },
  pagination: {
    el: ".swiper-pagination",
    type: "bullets",
    clickable: true,
  },
});



const thumbSlider = new Swiper(".product-thumbs-slider", {
  spaceBetween: 10,
  slidesPerView: 4,
  watchSlidesProgress: true,
  breakpoints: {
    576: {
      spaceBetween: 15
    },
  }
});

const productSlider = new Swiper(".product-slider", {
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: thumbSlider,
  },
});

// Функция для работы фикс меню
(function () {
  const staticHeader = document.querySelector(".header");
  const flyingHeader = document.querySelector(".fixed-header");
  const checkScroll = () => {
    const windowScroll = window.scrollY;
    if (windowScroll > staticHeader.clientHeight) {
      flyingHeader.classList.add("fixed");
    } else {
      flyingHeader.classList.remove("fixed");
    }
  };
  checkScroll();
  window.addEventListener("scroll", checkScroll);
})();

// Блокировка скролла мыши
function lockScroll(elem) {
  if (elem.addEventListener) {
    elem.addEventListener(
      "DOMMouseScroll",
      (elem.onmousewheel = function (e) {
        e.preventDefault();
      }),
      false
    );
  } else {
    elem.onmousewheel = function (e) {
      window.event.returnValue = false;
    };
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

const scrollHelper = document.querySelector(".scroll-helper");
const scrollTrigger = document.querySelector(".main-screen__scroll-trigger");
const dataReverseTriger = document.querySelector("[data-reverse-triger]");
if (scrollTrigger) {
  const flyingHeader = document.querySelector(".fixed-header");
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
  let trigerCounter = 0;

  // Функция прокрутки к секции медиа
  function scrollToMedia() {
    if (window.innerWidth < 1360 || window.innerHeight < 680) return;
    let dataTrigerValue =
      dataReverseTriger.getBoundingClientRect().top - flyingHeader.clientHeight;
    if (
      window.scrollY < 10 &&
      trigerCounter == 0 &&
      dataTrigerValue > 0 &&
      sctollDirection > 0
    ) {
      trigerCounter = 1;

      document.body.classList.add("no-click");
      lockScroll(document.querySelector("body"));
      $("html, body").animate(
        {
          scrollTop: dataTrigerValue,
        },
        600,
        "swing",
        function () {
          trigerCounter = 0;
          unlockScroll(document.querySelector("body"));
          document.body.classList.remove("no-click");
        }
      );
    }
  }

  window.addEventListener("scroll", scrollToMedia);
  window.addEventListener("scroll", (e) => {
    if (window.scrollY > 10) {
      scrollHelper.classList.add("hide");
    } else {
      scrollHelper.classList.remove("hide");
    }
  });
  scrollHelper.addEventListener("click", () => {
    sctollDirection = 1;
    scrollToMedia();
  });
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//Валидация формы для возможности нажать Отправить
document.querySelectorAll(".inner-form").forEach((form) => {
  const formInput = form.querySelector('.inner-form__input');
  const formAgreeCheckbox = form.querySelector(".form__agree-checkbox");
  formInput.addEventListener("input", (e) => {
    if (validateEmail(e.target.value)) {
      formInput.classList.remove('err');
    } else {
      formInput.classList.add('err');
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      validateEmail(formInput.value.trim()) &&
      formAgreeCheckbox.checked
    ) {
      // тут отправка на сервер формы
      $.ajax({ // инициaлизируeм ajax зaпрoс
        type: 'POST', // oтпрaвляeм в POST фoрмaтe, мoжнo GET
        url: '/ajax/subscribe.php', // путь дo oбрaбoтчикa, у нaс oн лeжит в тoй жe пaпкe
        dataType: 'html', // oтвeт ждeм в json фoрмaтe
        data: {
          email: formInput.value
        }, // дaнныe для oтпрaвки
        success: function (data) { // сoбытиe пoслe удaчнoгo oбрaщeния к сeрвeру и пoлучeния oтвeтa
          form.querySelector(".form-sucsess").classList.add("show");
          form.reset();
        },
        error: function (xhr, ajaxOptions, thrownError) { // в случae нeудaчнoгo зaвeршeния зaпрoсa к сeрвeру
          alert(xhr.status); // пoкaжeм oтвeт сeрвeрa
          alert(thrownError); // и тeкст oшибки
        },
      });
    }
  });
});

// Форма на  страницe контактов
const contanctsForm = document.querySelector('#contacts-form');
if (contanctsForm) {
  const formPhone = contanctsForm.querySelector('input[name="phone"]');
  const formEmail = contanctsForm.querySelector('input[name="email"]');
  const formMessage = contanctsForm.querySelector('textarea[name="message"]');
  const formAgreeCheckbox = contanctsForm.querySelector(".form__agree-checkbox");
  const phoneReg = /^[\d\+][\d\(\)\ -]{4,14}\d$/;

  formEmail.addEventListener("input", (e) => {
    if (validateEmail(e.target.value)) {
      formEmail.classList.remove('err');
    } else {
      formEmail.classList.add('err');
    }
  });

  formPhone.addEventListener("input", (e) => {
    const phoneValue = e.target.value.trim().replace(/[^+\d]/g, '');
    const valid = phoneReg.test(phoneValue);
    if (!valid || phoneValue.length < 11) {
      formPhone.classList.add('err');
    } else {
      formPhone.classList.remove('err');
    }
  });


  contanctsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formPhoneValue = formPhone.value.trim().replace(/[^+\d]/g, '');
    const valid = phoneReg.test(formPhoneValue);

    if (!valid || formPhoneValue.trim().length < 1) {
      formPhone.classList.add('err');
    } else {
      formPhone.classList.remove('err');
    }

    if (!validateEmail(formEmail.value) || formEmail.value.trim().length < 11) {
      formEmail.classList.add('err');
    } else {
      formEmail.classList.remove('err');
    }
    const formErrors = contanctsForm.querySelectorAll('.err');

    if (formErrors.length < 1 && formAgreeCheckbox.checked) {
      const formData = {
        formMessage: formMessage.value.trim(),
        formPhone: formPhoneValue,
        formEmail: formEmail.value.trim(),
      }
      // Отправка данных на сервак
      $.ajax({ // инициaлизируeм ajax зaпрoс
        type: 'POST', // oтпрaвляeм в POST фoрмaтe, мoжнo GET
        url: '/ajax/subscribe.php', // путь дo oбрaбoтчикa, у нaс oн лeжит в тoй жe пaпкe
        dataType: 'html', // oтвeт ждeм в json фoрмaтe
        data: {
          email: formData
        }, // дaнныe для oтпрaвки
        success: function (data) { // сoбытиe пoслe удaчнoгo oбрaщeния к сeрвeру и пoлучeния oтвeтa
          contanctsForm.querySelector(".form-sucsess").classList.add("show");
          contanctsForm.reset();
        },
        error: function (xhr, ajaxOptions, thrownError) { // в случae нeудaчнoгo зaвeршeния зaпрoсa к сeрвeру
          alert(xhr.status); // пoкaжeм oтвeт сeрвeрa
          alert(thrownError); // и тeкст oшибки
        },
      });
    }

  });
}



// Валидацця опроса для возжность нажать кнопку Пройти опрос
document.querySelectorAll(".survey").forEach((survey) => {
  const surveyVariants = survey.querySelectorAll(".survey__input");
  const submitBtn = survey.querySelector(".survey__btn");
  surveyVariants.forEach((variant) => {
    variant.addEventListener("change", (e) => {
      submitBtn.removeAttribute("disabled");
    });
  });
});


function scrollbarWidth() {
  var documentWidth = parseInt(document.documentElement.clientWidth);
  var windowsWidth = parseInt(window.innerWidth);
  var scrollbarWidth = windowsWidth - documentWidth;
  return scrollbarWidth;
}
// Динамический адаптив на главной странице
(function () {
  let move = (item, parent, parentOriginal, width) => {
    if (!item || !parent || !parentOriginal) {
      return;
    }

    if ($(window).width() <= (width - scrollbarWidth())) {
      if (!item.hasClass("done")) {
        item.appendTo(parent);
        item.addClass("done");
      }
    } else {
      if (item.hasClass("done")) {
        item.appendTo(parentOriginal);
        item.removeClass("done");
      }
    }
  };

  const formItem = $("#main-page-form");
  const formItem_mobileParent = $("#mobile-form-parent");
  const formItem_parentOriginal = $("#pc-form-parent");

  const navSidebar = $("#nav-sidebar");
  const navSidebar_mobileParent = $("#mobile-nav-sidebar-parent");
  const navSidebar_parentOriginal = $("#pc-nav-sidebar-parent");

  move(formItem, formItem_mobileParent, formItem_parentOriginal, 1200);
  move(navSidebar, navSidebar_mobileParent, navSidebar_parentOriginal, 1200);
  $(window).resize(function () {
    move(formItem, formItem_mobileParent, formItem_parentOriginal, 1200);
    move(navSidebar, navSidebar_mobileParent, navSidebar_parentOriginal, 1200);
  });
})();

const mobileSearchBtns = document.querySelectorAll(".mobile-search-btn");
mobileSearchBtns.forEach((mobileSearchBtn) => {
  mobileSearchBtn.addEventListener("click", (e) => {
    const searchField = mobileSearchBtn.parentNode.querySelector(
      ".search-field__input"
    );
    if (searchField) searchField.focus();
  });
});

$(document).on("click", ".sidebar-item__arrow", function (e) {
  $(this).parent().toggleClass("toggle-open");
  $(this)
    .parent()
    .next()
    .slideToggle(() => {
      $(this).toggleClass("toggle-open");
    });
});









// Галерея статьи
const articleGaleryes = document.querySelectorAll('.article-galery');
if (articleGaleryes.length > 0) {
  articleGaleryes.forEach(galery => {
    const mainGalSlider = galery.querySelector(".galery-thumbs-slider");
    const thumbGalSlider = galery.querySelector(".galery-slider");

    const galeryThumbsSlider = new Swiper(mainGalSlider, {
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      watchSlidesProgress: true,
    });
    const galerySlider = new Swiper(thumbGalSlider, {
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
      thumbs: {
        swiper: galeryThumbsSlider,
      },
    });
  });
}



$(document).on('click', '[data-toggle-element]', function (e) {
  $(this).toggleClass('toggle-open');
  $(this).next().slideToggle("slow");
})





// Логика работы поиска
const searchFields = document.querySelectorAll('.search-field__input');
searchFields.forEach(searchField => {
  const searchResultsWrapper = searchField.closest('.search-form').querySelector('.search-form__res');
  const searchResult = searchResultsWrapper.querySelector('.search-form__ajax-res');
  const resultCount = searchResultsWrapper.querySelector('.search-form__res-count');
  let searchTimeout = null;
  //Запрос за данными
  function search(query) {
    // Куда стучим, + передаём параметр q т.е query
    // const url = '/search?q=' + encodeURIComponent(query);
    const url = '../searchres.php';
    fetch(url)
      .then(response => response.text())
      .then(data => {
        searchResult.innerHTML = '';
        searchResult.innerHTML = data;
        const resCount = searchResult.querySelectorAll('a').length
        resultCount.innerHTML = `Результатов найдено: ${resCount}`;
      })
      .catch(error => console.log('Ошибка выполнения запроса поиска: ', error));
  }

  searchField.addEventListener('input', function () {
    const query = searchField.value;
    clearTimeout(searchTimeout);
    if (query.length > 2) {
      searchTimeout = setTimeout(() => {
        search(query)
        searchResultsWrapper.classList.add('show');
      }, 300);
    } else {
      searchResultsWrapper.classList.remove('show');
      searchResult.innerHTML = '';
    }
  });
});
document.addEventListener('click', (e) => {
  const taeget = e.target;
  const openSearch = document.querySelector('.search-form__res.show')
  if (openSearch && !taeget.closest('.search-form__res.show')) {
    openSearch.classList.remove('show');
  }
});