(function ($) {
  "use strict";

  // Initialize Preloader
  function initPreloader() {
    $(document).ready(function () {
      
      $('body').addClass('preloader-site');
    });
    $(window).on('load', function () {
     
      $('.preloader').fadeOut();
      $('body').removeClass('preloader-site');
    });
  }

  // Initialize Chocolat Lightbox
  function initChocolat() {
    
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    });
  }

  // Initialize Isotope
  function initIsotope() {
    
    var $container = $('.isotope-container').isotope({
      itemSelector: '.item',
      layoutMode: 'masonry',
    });

    $('.filter-button').click(function () {
      var filterValue = $(this).attr('data-filter');
      
      $container.isotope({ filter: filterValue === '*' ? '*' : filterValue });
      $('.filter-button').removeClass('active');
      $(this).addClass('active');
    });
  }

  // Initialize Video Modal
  function initVideoModal() {
    
    var $videoSrc;
    $('.play-btn').click(function () {
      $videoSrc = $(this).data("src");
      
    });

    $('#myModal').on('shown.bs.modal', function () {
      
      $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    });

    $('#myModal').on('hide.bs.modal', function () {
      
      $("#video").attr('src', $videoSrc);
    });
  }

  // Initialize Swiper Sliders
  function initSwiper() {
    
    new Swiper(".slider", { effect: "fade" });

    new Swiper(".room-swiper", {
      slidesPerView: 3,
      spaceBetween: 20,
      pagination: { el: ".room-pagination", clickable: true },
      breakpoints: {
        0: { slidesPerView: 1 },
        1024: { slidesPerView: 2 },
        1280: { slidesPerView: 3 },
      },
    });

    new Swiper(".gallery-swiper", {
      effect: "fade",
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: ".main-slider-button-next", prevEl: ".main-slider-button-prev" },
    });

    var thumbSlider = new Swiper(".product-thumbnail-slider", {
      autoplay: true,
      loop: true,
      spaceBetween: 8,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper(".product-large-slider", {
      autoplay: true,
      loop: true,
      spaceBetween: 10,
      effect: 'fade',
      thumbs: { swiper: thumbSlider },
    });
  }

  // Initialize AOS
  function initAOS() {
    
    AOS.init({ duration: 1000, once: true });
  }

  // Initialize DateTimePicker
  
  

  // Document Ready
  $(document).ready(function () {
    
    
    initPreloader();
    initChocolat();
    initIsotope();
    initVideoModal();
    initSwiper();
    initAOS();
  
  });
  
})(jQuery);

// Update Content Based on Language Data
function updateContent(langData) {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    if (langData[key]) {
      element.innerHTML = langData[key];
    } else {
      console.warn(`Missing translation for key: ${key}`);
    }
  });
}


// Set Language Preference
function setLanguagePreference(lang) {
  sessionStorage.removeItem('language'); 
  sessionStorage.removeItem('languageTimestamp');
  sessionStorage.setItem('language', lang);
  sessionStorage.setItem('languageTimestamp', Date.now());
}

// Fetch Language Data
async function fetchLanguageData(lang) {
  
  const response = await fetch(`languages/${lang}.json`);
  return response.json();
}

// Change Language
async function changeLanguage(lang) {
  
  setLanguagePreference(lang);
  const currentPath = sessionStorage.getItem('currentPage');
  
  if (currentPath && window.location.href !== currentPath) {
    
    window.location.href = currentPath;
  } else {
   
    const langData = await fetchLanguageData(lang);
    updateContent(langData);
  }
}

// Toggle Arabic Stylesheet
function toggleArabicStylesheet(lang) {
  
  const head = document.querySelector('head');
  const link = document.querySelector('#styles-link');

  if (link) {
    head.removeChild(link);
  } else if (lang === 'cn') {
    const newLink = document.createElement('link');
    newLink.id = 'styles-link';
    newLink.rel = 'stylesheet';
    //newLink.href = './assets/css/style-ar.css';
    head.appendChild(newLink);
  }
}

// DOM Content Loaded
window.addEventListener('DOMContentLoaded', async () => {
  
  const languageTimestamp = sessionStorage.getItem('languageTimestamp');
  const currentTime = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const userPreferredLanguage = sessionStorage.getItem('language') || 'cn';
  
  const langData = await fetchLanguageData(userPreferredLanguage);
  
  updateContent(langData);
  toggleArabicStylesheet(userPreferredLanguage); 
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.placeholder = userPreferredLanguage === 'cn' ? '搜索...' : 'Search...';
  }
  var logo = document.getElementById('logo-infinytrading');
  var logo_footer = document.getElementById('logo-footer');
 
  if(userPreferredLanguage=='cn'){
    logo.src = 'images/infiny_trading-logo (1).png';
    logo_footer.src ='images/infiny_trading-logo (1).png';
    // Remove the class if it exists 
    logo.classList.remove('double-size'); 
    logo_footer.classList.remove('double-size');
  }else{
  
  logo.src = 'images/infiny_trading-logo_en.png';
  logo_footer.src = 'images/infiny_trading-logo_en.png';
  logo.classList.add('double-size'); 
  logo_footer.classList.add('double-size'); 
  }
  // Redirect to the correct page if necessary
  const currentPath = sessionStorage.getItem('currentPage');
  if (currentPath && window.location.href !== currentPath) {
    
     window.location.href = currentPath || "https://uat.infinytrading.com/index.html";
  }
});

// Update session storage when navigation links are clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    let href = this.getAttribute('href');
    

    // Remove leading './' from href if present
    const sanitizedHref = href.replace(/^\.\//, '');
    const fullPath = "https://uat.infinytrading.com/" + sanitizedHref;
    sessionStorage.setItem('currentPage', fullPath);
  });
});
document.querySelectorAll('.mobile-nav-item').forEach(link => {
  link.addEventListener('click', function () {
    let href = this.getAttribute('href');
    

    // Remove leading './' from href if present
    const sanitizedHref = href.replace(/^\.\//, '');
    const fullPath = "https://uat.infinytrading.com/" + sanitizedHref;
    sessionStorage.setItem('currentPage', fullPath);
  });
});

function mobileClickNav() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
    x.style.position = "fixed";
    x.style.top = "5%";
    x.style.width = "100%";
    x.style.zIndex = "1000";
    x.style.backgroundColor = "rgb(203,27,69)";
  }
}

function hideiframeelement() {
  var iframe = document.getElementById("myiframe");
  if (!iframe) {
      console.error("Iframe not found!");
      return;
  }
  var element = iframe.contentWindow?.document?.getElementById('top-bar');
  if (!element) {
      console.error("Element inside iframe not found!");
  }
}

document.getElementById("myiframe").addEventListener("load", function () {
  hideiframeelement();
});



