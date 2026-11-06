/**
 * ==========================================================================
 * KUMARI SUPERMARKET - CONTACT & QUOTE CALCULATOR MODULE
 * Form Validation, WhatsApp Message Builder, Bulk Quote Generator,
 * Deal Countdown Timer, and Copy Coupon System.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initQuoteCalculator();
  initCountdownTimer();
  initCouponCopy();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
   1. Contact Form Live Validation & Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('mainContactForm');
  if (!contactForm) return;

  const nameInput = contactForm.querySelector('#contactName');
  const emailInput = contactForm.querySelector('#contactEmail');
  const phoneInput = contactForm.querySelector('#contactPhone');
  const messageInput = contactForm.querySelector('#contactMessage');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    // 10 digits Indian phone number format
    return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
  };

  const setFieldError = (input, isValid, message) => {
    const errorMsgEl = input.parentElement.querySelector('.form-error-msg');
    if (!isValid) {
      input.classList.add('error');
      if (errorMsgEl) errorMsgEl.textContent = message;
    } else {
      input.classList.remove('error');
    }
  };

  // Real-time blur validation
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      setFieldError(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      setFieldError(emailInput, validateEmail(emailInput.value.trim()), 'Please enter a valid email address.');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      setFieldError(phoneInput, validatePhone(phoneInput.value.trim()), 'Please enter a valid 10-digit mobile number.');
    });
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = nameInput ? nameInput.value.trim().length >= 2 : true;
    const isEmailValid = emailInput ? validateEmail(emailInput.value.trim()) : true;
    const isPhoneValid = phoneInput ? validatePhone(phoneInput.value.trim()) : true;
    const isMsgValid = messageInput ? messageInput.value.trim().length >= 5 : true;

    if (nameInput) setFieldError(nameInput, isNameValid, 'Please enter your full name.');
    if (emailInput) setFieldError(emailInput, isEmailValid, 'Please enter a valid email address.');
    if (phoneInput) setFieldError(phoneInput, isPhoneValid, 'Please enter a valid 10-digit mobile number.');
    if (messageInput) setFieldError(messageInput, isMsgValid, 'Please write a brief message.');

    if (isNameValid && isEmailValid && isPhoneValid && isMsgValid) {
      if (window.showToast) {
        window.showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully. We will contact you shortly.`, 'success');
      }
      contactForm.reset();
    } else {
      if (window.showToast) {
        window.showToast('Please correct the errors in the form before submitting.', 'warning');
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Bulk Order & Service Quote Generator
   -------------------------------------------------------------------------- */
function initQuoteCalculator() {
  const quoteForm = document.getElementById('bulkQuoteForm');
  if (!quoteForm) return;

  const serviceSelect = quoteForm.querySelector('#quoteService');
  const volumeInput = quoteForm.querySelector('#quoteVolume');
  const frequencySelect = quoteForm.querySelector('#quoteFrequency');
  const estimatedDisplay = quoteForm.querySelector('#estimateValue');
  const discountDisplay = quoteForm.querySelector('#discountValue');
  const whatsappQuoteBtn = quoteForm.querySelector('#btnWhatsAppQuote');

  const calculateEstimate = () => {
    const service = serviceSelect?.value || 'delivery';
    const volume = parseInt(volumeInput?.value, 10) || 100;
    const frequency = frequencySelect?.value || 'one-time';

    let baseRatePerUnit = 250; // approximate value index
    let discountPct = 0;

    if (service === 'bulk') baseRatePerUnit = 180;
    if (service === 'wedding') baseRatePerUnit = 320;
    if (service === 'horeca') baseRatePerUnit = 220;
    if (service === 'corporate') baseRatePerUnit = 450;
    if (service === 'hampers') baseRatePerUnit = 600;

    if (volume >= 500) discountPct += 15;
    else if (volume >= 250) discountPct += 10;
    else if (volume >= 100) discountPct += 5;

    if (frequency === 'monthly' || frequency === 'weekly') {
      discountPct += 5;
    }

    const subtotal = volume * baseRatePerUnit;
    const savings = Math.round((subtotal * discountPct) / 100);
    const finalEstimate = subtotal - savings;

    if (estimatedDisplay) {
      estimatedDisplay.textContent = `₹${finalEstimate.toLocaleString('en-IN')}`;
    }
    if (discountDisplay) {
      discountDisplay.textContent = `${discountPct}% Bulk Savings Included`;
    }

    return { service, volume, frequency, finalEstimate, discountPct };
  };

  [serviceSelect, volumeInput, frequencySelect].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateEstimate);
      input.addEventListener('change', calculateEstimate);
    }
  });

  // Calculate initially
  calculateEstimate();

  if (whatsappQuoteBtn) {
    whatsappQuoteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const { service, volume, frequency, finalEstimate, discountPct } = calculateEstimate();
      const name = quoteForm.querySelector('#quoteClientName')?.value.trim() || 'Valued Customer';
      const location = quoteForm.querySelector('#quoteLocation')?.value.trim() || 'Kanyakumari / Local';

      const whatsappText = encodeURIComponent(
        `*New Supermarket Service Quote Request - Kumari Supermarket*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📍 *Location:* ${location}\n` +
        `🛒 *Service Required:* ${service.toUpperCase()}\n` +
        `📦 *Estimated Quantity/People:* ${volume}\n` +
        `🔄 *Frequency:* ${frequency}\n` +
        `💰 *Estimated Value:* ₹${finalEstimate.toLocaleString('en-IN')} (${discountPct}% discount applied)\n\n` +
        `_Please get back to me with the complete price proposal._`
      );

      const whatsappUrl = `https://wa.me/919876543210?text=${whatsappText}`;
      window.open(whatsappUrl, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   3. Live Deal Countdown Timer (Weekend Harvest & Festive Sale)
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const timerContainer = document.querySelector('.countdown-timer');
  if (!timerContainer) return;

  // Set target date 4 days ahead dynamically
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);
  targetDate.setHours(23, 59, 59, 0);

  const daysEl = timerContainer.querySelector('#days');
  const hoursEl = timerContainer.querySelector('#hours');
  const minsEl = timerContainer.querySelector('#mins');
  const secsEl = timerContainer.querySelector('#secs');

  const updateTimer = () => {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
      timerContainer.innerHTML = '<p style="color:white;font-weight:700;">Offer Refreshed! Check today\'s flash deals.</p>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   4. Copy-to-Clipboard Coupon Code System
   -------------------------------------------------------------------------- */
function initCouponCopy() {
  const couponBoxes = document.querySelectorAll('.coupon-code-box');

  couponBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const code = box.getAttribute('data-code') || box.textContent.trim();
      navigator.clipboard.writeText(code).then(() => {
        if (window.showToast) {
          window.showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
        }
      }).catch(() => {
        if (window.showToast) {
          window.showToast(`Coupon: ${code}`, 'info');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. FAQ Accordion Expand & Collapse
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
