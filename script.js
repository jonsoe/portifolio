/**
 * Main JavaScript File
 * Handles Theme Toggling, Mobile Navigation, Counters Animation, and Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================
  // Theme Toggle (Dark / Light Mode)
  // =========================================
  const themeToggle = document.getElementById('theme-toggle');
  const preferDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && preferDark.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let targetTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
  });

  // Listen for system theme changes if no local override
  preferDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });


  // =========================================
  // Mobile Navigation (Hamburger)
  // =========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // =========================================
  // Animated Counters
  // =========================================
  const counters = document.querySelectorAll('.counter');
  let hasAnimated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // ms
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          setTimeout(updateCounter, 16);
        } else {
          counter.innerText = target;
        }
      };

      updateCounter();
    });
  };

  // Intersection Observer for counters
  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && !hasAnimated) {
      animateCounters();
      hasAnimated = true;
    }
  }, observerOptions);

  const counterSection = document.querySelector('.counters-wrapper');
  if (counterSection) {
    counterObserver.observe(counterSection);
  }


  // =========================================
  // Contact Form Validation
  // =========================================
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const formSuccess = document.getElementById('form-success');

  const isValidEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Reset messages
    nameError.innerText = '';
    emailError.innerText = '';
    messageError.innerText = '';
    formSuccess.style.display = 'none';

    // Validate Name
    if (nameInput.value.trim() === '') {
      nameError.innerText = 'Name is required';
      isFormValid = false;
    }

    // Validate Email
    if (emailInput.value.trim() === '') {
      emailError.innerText = 'Email is required';
      isFormValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      emailError.innerText = 'Please enter a valid email address';
      isFormValid = false;
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
      messageError.innerText = 'Message is required';
      isFormValid = false;
    }

    // Submit Logic
    if (isFormValid) {
      const submitBtn = form.querySelector('.submit-btn');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
      
      // Native form submission to allow FormSubmit's activation page to show
      form.submit();
      
      // Reset button and show message after a short delay
      setTimeout(() => {
        submitBtn.innerHTML = originalBtnText;
        formSuccess.style.display = 'block';
        formSuccess.style.color = 'var(--success-color)';
        formSuccess.innerText = 'Check the newly opened tab to complete the process!';
        form.reset();
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 8000);
      }, 1500);
    }
  });


  // =========================================
  // Dynamic Year in Footer
  // =========================================
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.innerText = new Date().getFullYear();
  }

  // =========================================
  // Scroll Reveal Animations
  // =========================================
  const reveals = document.querySelectorAll('.reveal');
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver((entries, browserObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        browserObserver.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, revealOptions);

  reveals.forEach(reveal => {
    revealOnScroll.observe(reveal);
  });
});
