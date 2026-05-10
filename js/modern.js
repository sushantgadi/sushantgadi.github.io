// ============================================
// Modern Portfolio JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initNavbar();
  initScrollAnimations();
  initFormHandling();
  initSmoothScroll();
});

// ============================================
// Navbar Toggle
// ============================================

function initNavbar() {
  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarMenu = document.getElementById('navbar-menu');
  const navbarLinks = document.querySelectorAll('.navbar-link');

  if (!navbarToggle) return;

  // Toggle menu
  navbarToggle.addEventListener('click', function() {
    navbarMenu.classList.toggle('active');
  });

  // Close menu when link is clicked
  navbarLinks.forEach(link => {
    link.addEventListener('click', function() {
      navbarMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
      navbarMenu.classList.remove('active');
    }
  });

  // Update active link based on scroll position
  window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-link');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary-color)';
    }
  });
}

// ============================================
// Scroll Animations
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.section, .about-card, .experience-item, .education-item, .project-card');
  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// Form Handling
// ============================================

function initFormHandling() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    // Validate form
    if (!name || !email || !message) {
      showFormMessage('Please fill in all fields', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFormMessage('Please enter a valid email', 'error');
      return;
    }

    // Send email via mailto (fallback)
    const mailtoLink = `mailto:sushantgadi@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}\n\nReply to: ${encodeURIComponent(email)}`;
    
    // Show success message
    showFormMessage('Thanks! I\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();

    // Optional: Open email client (commented out to not force user action)
    // window.location.href = mailtoLink;
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormMessage(message, type) {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = `form-message-${type}`;
  messageEl.textContent = message;
  messageEl.style.cssText = `
    padding: 12px 16px;
    border-radius: 8px;
    margin-top: 1rem;
    font-weight: 500;
    animation: fadeInUp 0.3s ease;
    ${type === 'success' ? 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid #10b981;' : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444;'}
  `;

  const existingMessage = document.querySelector('[class*="form-message-"]');
  if (existingMessage) {
    existingMessage.remove();
  }

  document.getElementById('contact-form').appendChild(messageEl);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageEl.style.animation = 'fadeInUp 0.3s ease reverse';
    setTimeout(() => messageEl.remove(), 300);
  }, 5000);
}

// ============================================
// Add some additional features
// ============================================

// Navbar scroll effect
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// Counter animation for stats
function animateCounter(el, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + '+';
  }, 16);
}

// Observe stat numbers for animation
const statObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      const number = parseInt(entry.target.textContent);
      if (!isNaN(number)) {
        animateCounter(entry.target, number);
        entry.target.classList.add('animated');
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  statObserver.observe(el);
});

// ============================================
// Accessibility improvements
// ============================================

// Add focus styles for keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-nav');
});

// ============================================
// Performance optimization
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log('Modern Portfolio loaded successfully!');
