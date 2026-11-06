/**
 * ==========================================================================
 * KUMARI SUPERMARKET - LIVE SOCIAL PROOF & CUSTOMER ACTIVITY ENGINE
 * Displays real-time social proof notifications to build instant trust
 * and encourage new visitors to place orders.
 * ==========================================================================
 */

const recentCustomerActivities = [
  {
    name: "Mrs. Meenakshi S.",
    location: "Nagercoil",
    action: "ordered 25kg Monthly Household Grocery Pack",
    time: "2 minutes ago",
    icon: "fa-basket-shopping",
    color: "#10B981"
  },
  {
    name: "Sea Breeze Resort",
    location: "Kanyakumari Beach",
    action: "renewed daily 50L Fresh Dairy & Vegetable Contract",
    time: "7 minutes ago",
    icon: "fa-utensils",
    color: "#F59E0B"
  },
  {
    name: "Anand & Divya",
    location: "Marthandam",
    action: "booked 750-Guest Wedding Catering Provisioning (Saved ₹38,000)",
    time: "14 minutes ago",
    icon: "fa-champagne-glasses",
    color: "#EC4899"
  },
  {
    name: "Dr. K. Ravichandran",
    location: "Cape Road",
    action: "received 60-Min Express Fresh Fruit & Veggie Basket",
    time: "19 minutes ago",
    icon: "fa-apple-whole",
    color: "#10B981"
  },
  {
    name: "Apex Infotech HR",
    location: "Vadasery",
    action: "dispatched 120 Diwali Gourmet Dry Fruit Gift Boxes",
    time: "26 minutes ago",
    icon: "fa-gift",
    color: "#8B5CF6"
  },
  {
    name: "Kavitha R.",
    location: "Kottar",
    action: "applied coupon 'KUMARI15' & saved ₹450 on first order",
    time: "31 minutes ago",
    icon: "fa-tags",
    color: "#F59E0B"
  }
];

class SocialProofNotifier {
  constructor() {
    this.container = null;
    this.currentIndex = 0;
    this.timer = null;
    this.init();
  }

  init() {
    // Create container element
    this.container = document.createElement('div');
    this.container.className = 'sales-proof-toast';
    document.body.appendChild(this.container);

    // Initial delay of 4 seconds before first popup
    setTimeout(() => {
      this.showNextProof();
    }, 4000);
  }

  showNextProof() {
    const activity = recentCustomerActivities[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % recentCustomerActivities.length;

    this.container.innerHTML = `
      <div class="sales-proof-card">
        <button class="sales-proof-close" aria-label="Close notification">&times;</button>
        <div class="sales-proof-icon-box" style="background: ${activity.color}20; color: ${activity.color};">
          <i class="fa-solid ${activity.icon}"></i>
        </div>
        <div class="sales-proof-content">
          <div class="sales-proof-title">
            <strong>${activity.name}</strong> <span class="sales-proof-loc">• ${activity.location}</span>
          </div>
          <div class="sales-proof-action">${activity.action}</div>
          <div class="sales-proof-time"><i class="fa-regular fa-clock"></i> ${activity.time} <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Order</span></div>
        </div>
      </div>
    `;

    // Attach close button listener
    const closeBtn = this.container.querySelector('.sales-proof-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideProof();
      });
    }

    // Trigger reveal
    requestAnimationFrame(() => {
      this.container.classList.add('active');
    });

    // Hide after 6 seconds, then wait 9 seconds before showing next
    setTimeout(() => {
      this.hideProof();
      setTimeout(() => {
        this.showNextProof();
      }, 9000);
    }, 6000);
  }

  hideProof() {
    if (this.container) {
      this.container.classList.remove('active');
    }
  }
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new SocialProofNotifier();
  initInstantCallbackWidget();
});

/* --------------------------------------------------------------------------
   Instant 5-Minute Call Back Engine
   -------------------------------------------------------------------------- */
function initInstantCallbackWidget() {
  const callbackForms = document.querySelectorAll('.callback-form');
  callbackForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneInput = form.querySelector('input[type="tel"]');
      const phone = phoneInput?.value.trim() || '';

      if (/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
        if (window.showToast) {
          window.showToast(`🚀 Callback confirmed for +91 ${phone}! Our store manager is dialing your number right now.`, 'success');
        }
        form.reset();
      } else {
        if (window.showToast) {
          window.showToast('Please enter a valid 10-digit mobile number for immediate callback.', 'warning');
        }
      }
    });
  });
}
