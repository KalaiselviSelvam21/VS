/* ============================================
   VENUS STUDIO — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // 2. Navbar Scrolled State
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Hero Particles Generation
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 8}s`;
      particle.style.animationDuration = `${6 + Math.random() * 6}s`;
      particlesContainer.appendChild(particle);
    }
  }

  // 4. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // 5. Portfolio Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 6. Testimonial Slider Controls
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (track && prevBtn && nextBtn) {
    const scrollAmount = 380;

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    // Auto-scroll every 5 seconds
    let autoScrollInterval = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 5000);

    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('mouseleave', () => {
      autoScrollInterval = setInterval(() => {
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 5000);
    });
  }

  // 7. Booking / Inquiry Form with WhatsApp Bridge
  const setupFormBridge = (formId, successId, titlePrefix) => {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = (form.querySelector('[name="name"]') || {}).value || '';
        const phone = (form.querySelector('[name="phone"]') || {}).value || '';
        const service = (form.querySelector('[name="service"]') || {}).value || '';
        const date = (form.querySelector('[name="date"]') || {}).value || '';
        const quantity = (form.querySelector('[name="quantity"]') || {}).value || '';
        const message = (form.querySelector('[name="message"]') || {}).value || '';

        // Build formatted WhatsApp message
        let waMessage = `*${titlePrefix} - Venus Studio*%0A%0A`;
        if (name) waMessage += `*Name:* ${encodeURIComponent(name.trim())}%0A`;
        if (phone) waMessage += `*Phone:* ${encodeURIComponent(phone.trim())}%0A`;
        if (service) waMessage += `*Service/Category:* ${encodeURIComponent(service)}%0A`;
        if (quantity) waMessage += `*Quantity:* ${encodeURIComponent(quantity.trim())}%0A`;
        if (date) waMessage += `*Target Date:* ${encodeURIComponent(date)}%0A`;
        if (message) waMessage += `*Details:* ${encodeURIComponent(message.trim())}%0A`;

        // Show success state
        form.style.display = 'none';
        if (success) {
          success.classList.add('show');
        }

        // Direct to WhatsApp after a brief delay
        setTimeout(() => {
          window.open(`https://wa.me/919092028536?text=${waMessage}`, '_blank');
        }, 800);
      });
    }
  };

  setupFormBridge('quoteForm', 'formSuccess', 'New Service Inquiry');
  setupFormBridge('contactForm', 'contactSuccess', 'New Contact Booking');
  setupFormBridge('bulkQuoteForm', 'bulkSuccess', 'Bulk Order Inquiry');

  // 8. Portfolio Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.gallery-grid .gallery-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category || (itemCat && itemCat.includes(category))) {
            item.classList.remove('hidden');
            item.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // 9. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other active items
      document.querySelectorAll('.faq-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active', !isActive);
    });
  });

  // 10. URL Query Param Pre-Selection for Service Dropdown
  const urlParams = new URLSearchParams(window.location.search);
  const selectedServiceParam = urlParams.get('service');
  if (selectedServiceParam) {
    const serviceSelect = document.getElementById('contactService') || document.getElementById('service');
    if (serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].value.toLowerCase().includes(selectedServiceParam.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // 11. Founder Page Language Switcher (Tamil / English)
  const langBtns = document.querySelectorAll('.lang-btn');
  if (langBtns.length > 0) {
    const setLanguage = (lang) => {
      document.body.classList.remove('lang-ta', 'lang-en');
      document.body.classList.add('lang-' + lang);

      langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      if (lang === 'ta') {
        document.title = "SENTHIL (செந்தில்) – நிறுவனர் & வழிகாட்டி | VENUS STUDIO";
      } else {
        document.title = "SENTHIL – Founder & Creative Photographer | VENUS STUDIO";
      }

      try {
        localStorage.setItem('venus_founder_lang', lang);
      } catch (err) {
        // localStorage fallback
      }
    };

    // Load stored language or default to Tamil ('ta')
    let currentLang = 'ta';
    try {
      currentLang = localStorage.getItem('venus_founder_lang') || 'ta';
    } catch (e) {
      currentLang = 'ta';
    }
    setLanguage(currentLang);

    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });
  }

  // 12. Black & White Theme Switcher (Dark / Light)
  const themeToggleBtn = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('title', theme === 'light' ? 'Switch to Black (Dark) Theme' : 'Switch to White (Light) Theme');
      themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to Black (Dark) Theme' : 'Switch to White (Light) Theme');
    }
    try {
      localStorage.setItem('venus_theme', theme);
    } catch (e) {
      // localStorage fallback
    }
  };

  // Initialize theme from localStorage or default to dark
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('venus_theme') || 'dark';
  } catch (e) {
    savedTheme = 'dark';
  }
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }
});



