/**
 * ==========================================================================
 * KUMARI SUPERMARKET - GALLERY & LIGHTBOX MODULE
 * Handles Category Filtering and Interactive Lightbox Modal.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

/* --------------------------------------------------------------------------
   1. Dynamic Category Filtering
   -------------------------------------------------------------------------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            if (item.style.opacity === '0') {
              item.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   2. Lightbox Modal with Zoom & Navigation
   -------------------------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('galleryLightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !galleryItems.length) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentGalleryList = [];
  let currentIndex = 0;

  const updateGalleryList = () => {
    // Get visible items only
    currentGalleryList = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  };

  const showLightboxImage = (index) => {
    if (index < 0) index = currentGalleryList.length - 1;
    if (index >= currentGalleryList.length) index = 0;
    currentIndex = index;

    const item = currentGalleryList[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('h4')?.textContent || '';
    const desc = item.querySelector('p')?.textContent || '';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
    }

    if (lightboxCaption) {
      lightboxCaption.innerHTML = `<strong>${title}</strong><br><small style="color:rgba(255,255,255,0.7)">${desc}</small>`;
    }
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateGalleryList();
      currentIndex = currentGalleryList.indexOf(item);
      if (currentIndex === -1) currentIndex = 0;

      showLightboxImage(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightboxImage(currentIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightboxImage(currentIndex + 1);
  });
}
