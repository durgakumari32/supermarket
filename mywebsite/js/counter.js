/**
 * ==========================================================================
 * KUMARI SUPERMARKET - ANIMATED NUMBER COUNTER
 * Uses IntersectionObserver & requestAnimationFrame for smooth numeric counting.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const counterElements = document.querySelectorAll('.stat-number');
  if (!counterElements.length) return;

  const easeOutQuad = (t) => t * (2 - t);

  const startCounting = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutQuad(progress);
      const currentCount = Math.floor(easeProgress * target);

      counter.textContent = currentCount.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(counter => observer.observe(counter));
}
