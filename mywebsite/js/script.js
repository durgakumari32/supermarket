/**
 * ==========================================================================
 * KUMARI SUPERMARKET - MAIN APP SCRIPT
 * Handles Sticky Navbar, Mobile Drawer, Active Links, Scroll-to-Top,
 * Scroll Reveal Animations, Toast Engine, and Quote Modal.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileNav();
  initActiveLinks();
  initScrollReveal();
  initScrollTop();
  initRippleEffect();
  initQuoteModal();
  initNewsletter();
});

/* --------------------------------------------------------------------------
   1. Sticky Header & Shadow on Scroll
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay = document.querySelector('.nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav || !overlay) return;

  const openDrawer = () => {
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Active Link Highlighting
   -------------------------------------------------------------------------- */
function initActiveLinks() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Reveal Animations (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Scroll to Top Button
   -------------------------------------------------------------------------- */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.btn-scroll-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   6. Ripple Click Effect
   -------------------------------------------------------------------------- */
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
    });
  });
}

/* --------------------------------------------------------------------------
   7. Quick Quote & Inquiry Modal
   -------------------------------------------------------------------------- */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('.modal-close, .btn-modal-cancel');
  const quoteTriggers = document.querySelectorAll('[data-open-quote]');
  const serviceInput = modal.querySelector('#modalServiceSelect');
  const quoteForm = modal.querySelector('#modalQuoteForm');

  quoteTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'General Inquiry';
      if (serviceInput) {
        serviceInput.value = serviceName;
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector('#modalName')?.value || '';
      const phone = quoteForm.querySelector('#modalPhone')?.value || '';
      const service = serviceInput?.value || 'General Inquiry';

      if (!name || !phone) {
        showToast('Please fill in your name and phone number.', 'warning');
        return;
      }

      showToast(`Thank you, ${name}! Your request for "${service}" has been received. Our team will call you within 15 minutes.`, 'success');
      quoteForm.reset();
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   8. Global Toast Notification System
   -------------------------------------------------------------------------- */
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-check" style="color:var(--success)"></i>';
  if (type === 'warning') iconHtml = '<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i>';
  if (type === 'error') iconHtml = '<i class="fa-solid fa-circle-xmark" style="color:var(--danger)"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
};

/* --------------------------------------------------------------------------
   9. Newsletter Subscription
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast('Thank you for subscribing to Kumari Supermarket weekly deals!', 'success');
        emailInput.value = '';
      } else {
        showToast('Please enter a valid email address.', 'warning');
      }
    });
  });
}
