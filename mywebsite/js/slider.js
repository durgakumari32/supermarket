/**
 * ==========================================================================
 * KUMARI SUPERMARKET - TESTIMONIAL & OFFER SLIDER
 * Vanilla JavaScript responsive carousel with touch/swipe support,
 * dots, autoplay, and keyboard navigation.
 * ==========================================================================
 */

class SupermarketSlider {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.testimonial-track') || this.container.querySelector('.slider-track');
    this.slides = Array.from(this.track?.children || []);
    if (!this.slides.length) return;

    this.prevBtn = document.querySelector(options.prevBtn || '.slider-prev');
    this.nextBtn = document.querySelector(options.nextBtn || '.slider-next');
    this.dotsContainer = document.querySelector(options.dotsContainer || '.slider-dots');

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoplayInterval = options.autoplayInterval || 5000;
    this.isAutoplay = options.autoplay !== false;
    this.timer = null;

    this.startX = 0;
    this.currentX = 0;
    this.isSwiping = false;

    this.init();
  }

  init() {
    this.createDots();
    this.updateSlider();

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.resetAutoplay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.resetAutoplay();
      });
    }

    // Touch events for mobile swiping
    this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    this.container.addEventListener('touchend', () => this.handleTouchEnd());

    // Mouse drag support
    this.container.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mouseup', () => this.handleMouseUp());

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    if (this.isAutoplay) {
      this.startAutoplay();
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    
    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetAutoplay();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateSlider() {
    if (!this.track) return;
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlider();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }

  startAutoplay() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), this.autoplayInterval);
  }

  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  resetAutoplay() {
    if (this.isAutoplay) {
      this.stopAutoplay();
      this.startAutoplay();
    }
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.isSwiping = true;
    this.stopAutoplay();
  }

  handleTouchMove(e) {
    if (!this.isSwiping) return;
    this.currentX = e.touches[0].clientX;
  }

  handleTouchEnd() {
    if (!this.isSwiping) return;
    const diff = this.startX - this.currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
    this.isSwiping = false;
    this.startAutoplay();
  }

  handleMouseDown(e) {
    this.startX = e.clientX;
    this.isSwiping = true;
    this.stopAutoplay();
  }

  handleMouseMove(e) {
    if (!this.isSwiping) return;
    this.currentX = e.clientX;
  }

  handleMouseUp() {
    if (!this.isSwiping) return;
    const diff = this.startX - this.currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
    this.isSwiping = false;
    this.startAutoplay();
  }
}

// Auto-initialize sliders on document load
document.addEventListener('DOMContentLoaded', () => {
  new SupermarketSlider('.testimonial-slider-container', {
    prevBtn: '.slider-prev',
    nextBtn: '.slider-next',
    dotsContainer: '.slider-dots',
    autoplayInterval: 6000
  });
});
