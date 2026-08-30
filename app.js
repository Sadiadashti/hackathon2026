import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
  signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
  getDatabase, ref, set, get, child, push, update, onValue 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

// =================================================================
// 1. FIREBASE CONFIGURATION (ENTER YOUR KEYS HERE)
// =================================================================
const firebaseConfig = {
    apiKey: "AIzaSyDoHO8VUnSRJP_ztjc2Mw5QHkMa3bzmmOw",
    authDomain: "booking-website-e2d8a.firebaseapp.com",
    projectId: "booking-website-e2d8a",
    storageBucket: "booking-website-e2d8a.firebasestorage.app",
    messagingSenderId: "407905336286",
    appId: "1:407905336286:web:356c5dfe7609ba86a53b4f",
    measurementId: "G-PVRJEYW286"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Application State Variables
let currentUser = null;
let currentUserProfile = null;
let cachedProviders = [];
let activeSelectedProvider = null;

// Initial Fallback Seed Data (Evaluator Initializer)
const DEMO_PROVIDERS = [
  { full_name: "Hamza Ali", role: "provider", category: "Plumbing", location: "Gulshan", experience_years: 5, hourly_rate: 30 },
  { full_name: "Ayesha Noor", role: "provider", category: "Cleaning", location: "Clifton", experience_years: 3, hourly_rate: 20 },
  { full_name: "Kashif Electric", role: "provider", category: "Electrical", location: "PECHS", experience_years: 7, hourly_rate: 40 },
  { full_name: "Tariq Crafts", role: "provider", category: "Carpentry", location: "DHA", experience_years: 9, hourly_rate: 35 },
  { full_name: "Farhan HVAC", role: "provider", category: "AC Repair", location: "Nazimabad", experience_years: 4, hourly_rate: 45 },
  { full_name: "Salman Coatings", role: "provider", category: "Painting", location: "Saddar", experience_years: 6, hourly_rate: 25 }
];

// =================================================================
// 2. ROUTER & UTILITIES
// =================================================================
window.router = function(pageId) {
  document.querySelectorAll('.page-view').forEach(e => e.classList.add('hidden'));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.remove('hidden');

  if (pageId === 'home') loadProviders();
  if (pageId === 'dashboard') initDashboard();
  if (window.lucide) lucide.createIcons();
};

window.toggleProviderInputs = function() {
  const role = document.getElementById('signup-role').value;
  document.getElementById('provider-extra-inputs').classList.toggle('hidden', role !== 'provider');
};

function notify(msg, err = false) {
  const box = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${err ? 'toast-error' : 'toast-success'}`;
  toast.innerText = msg;
  box.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// =================================================================
// 3. AUTHENTICATION CONTROLLER
// =================================================================
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  const navGuest = document.getElementById('nav-guest');
  const navUser = document.getElementById('nav-user');
  const badge = document.getElementById('nav-user-role');

  if (user) {
    const snap = await get(child(ref(db), `users/${user.uid}`));
    if (snap.exists()) {
      currentUserProfile = snap.val();
      navGuest.classList.add('hidden');
      navUser.classList.remove('hidden');
      badge.innerText = currentUserProfile.role;
    }
  } else {
    currentUserProfile = null;
    navGuest.classList.remove('hidden');
    navUser.classList.add('hidden');
  }
  if (window.lucide) lucide.createIcons();
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const payload = {
      uid: cred.user.uid,
      full_name: name,
      email,
      role
    };

    if (role === 'provider') {
      payload.category = document.getElementById('signup-category').value;
      payload.location = document.getElementById('signup-location').value || 'Central';
      payload.experience_years = Number(document.getElementById('signup-experience').value);
      payload.hourly_rate = Number(document.getElementById('signup-rate').value);
    }

    await set(ref(db, `users/${cred.user.uid}`), payload);
    notify("Registration successful!");
    router('home');
  } catch (err) {
    notify(err.message, true);
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(
      auth, 
      document.getElementById('login-email').value, 
      document.getElementById('login-password').value
    );
    notify("Signed in successfully!");
    router('home');
  } catch (err) {
    notify("Invalid credentials.", true);
  }
});

document.getElementById('btn-logout').addEventListener('click', () => {
  signOut(auth);
  notify("Logged out");
  router('home');
});

// =================================================================
// 4. BROWSE & REALTIME FETCH PROVIDERS
// =================================================================
async function loadProviders() {
  const grid = document.getElementById('providers-grid');
  grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">Loading providers list...</p>`;

  const usersRef = ref(db, 'users');
  onValue(usersRef, (snapshot) => {
    cachedProviders = [];
    if (snapshot.exists()) {
      const data = snapshot.val();
      Object.keys(data).forEach(uid => {
        if (data[uid].role === 'provider') {
          cachedProviders.push({ id: uid, ...data[uid] });
        }
      });
    }

    // Auto seed database if empty
    if (cachedProviders.length === 0) {
      DEMO_PROVIDERS.forEach(p => {
        const newRef = push(ref(db, 'users'));
        set(newRef, { ...p, uid: newRef.key });
      });
    }

    renderProviders(cachedProviders);
  });
}

function renderProviders(list) {
  const grid = document.getElementById('providers-grid');
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted);">No service providers found.</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <div>
            <h3 class="card-title">${p.full_name}</h3>
            <span class="cat-pill">${p.category}</span>
          </div>
          <span class="card-price">$${p.hourly_rate}<small style="font-size: 0.7rem; color: var(--text-muted)">/hr</small></span>
        </div>
        <div class="card-meta" style="margin-top: 12px;">
          <p>📍 ${p.location || 'Local'}</p>
          <p>⭐ ${p.experience_years || 1}+ Years Experience</p>
        </div>
      </div>
      <button onclick="openProviderDetails('${p.id}')" class="btn btn-primary btn-full">
        View Profile & Book
      </button>
    `;
    grid.appendChild(card);
  });
}

document.getElementById('search-input').addEventListener('input', applyFilters);
document.getElementById('category-filter').addEventListener('change', applyFilters);

function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;

  const filtered = cachedProviders.filter(p => {
    const matchCat = cat === 'All' || p.category === cat;
    const matchSearch = p.full_name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  renderProviders(filtered);
}

// =================================================================
// 5. PROVIDER DETAILS & BOOKINGS ENGINE
// =================================================================
window.openProviderDetails = async function(pId) {
  activeSelectedProvider = cachedProviders.find(p => p.id === pId);
  if (!activeSelectedProvider) return;

  document.getElementById('detail-avatar').innerText = activeSelectedProvider.full_name.charAt(0);
  document.getElementById('detail-name').innerText = activeSelectedProvider.full_name;
  document.getElementById('detail-category').innerText = activeSelectedProvider.category;
  document.getElementById('detail-location').innerText = activeSelectedProvider.location || 'Local';
  document.getElementById('detail-experience').innerText = `${activeSelectedProvider.experience_years} Years`;
  document.getElementById('detail-rate').innerText = `$${activeSelectedProvider.hourly_rate}/hr`;
  document.getElementById('book-category').value = activeSelectedProvider.category;

  // Realtime Ratings Sync
  const revRef = ref(db, 'reviews');
  onValue(revRef, (snap) => {
    const revContainer = document.getElementById('detail-reviews-list');
    revContainer.innerHTML = '';
    
    let found = false;
    if (snap.exists()) {
      const allRev = snap.val();
      Object.keys(allRev).forEach(k => {
        if (allRev[k].provider_id === pId) {
          found = true;
          revContainer.innerHTML += `
            <div style="background: var(--bg-main); padding: 10px; border-radius: 8px; margin-bottom: 8px; font-size: 0.8rem;">
              <div style="color: var(--warning); font-weight: bold;">★ ${allRev[k].rating}/5</div>
              <p style="color: var(--text-dark); margin-top: 4px;">${allRev[k].comment}</p>
            </div>
          `;
        }
      });
    }
    if (!found) revContainer.innerHTML = `<p style="font-size: 0.8rem; color: var(--text-muted);">No reviews submitted yet.</p>`;
  });

  router('provider-details');
};

document.getElementById('booking-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!currentUser) {
    notify("Login required to submit booking.", true);
    return router('login');
  }

  if (currentUserProfile.role === 'provider') {
    notify("Service Providers cannot request bookings.", true);
    return;
  }

  const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000);
  const payload = {
    booking_id: bookingId,
    customer_id: currentUser.uid,
    customer_name: currentUserProfile.full_name,
    provider_id: activeSelectedProvider.id,
    provider_name: activeSelectedProvider.full_name,
    service_category: activeSelectedProvider.category,
    location: document.getElementById('book-location').value,
    booking_date: document.getElementById('book-date').value,
    booking_time: document.getElementById('book-time').value,
    description: document.getElementById('book-description').value,
    status: 'Pending'
  };

  try {
    await set(ref(db, `bookings/${bookingId}`), payload);
    notify(`Booking Created! ID: ${bookingId}`);
    document.getElementById('booking-form').reset();
    router('dashboard');
  } catch (err) {
    notify("Error saving booking data.", true);
  }
});

// =================================================================
// 6. DASHBOARDS & WORKFLOW STATE MACHINE
// =================================================================
function initDashboard() {
  if (!currentUser) return router('login');

  const custPanel = document.getElementById('dashboard-customer-panel');
  const provPanel = document.getElementById('dashboard-provider-panel');

  if (currentUserProfile.role === 'customer') {
    custPanel.classList.remove('hidden');
    provPanel.classList.add('hidden');
    listenCustomerBookings();
  } else {
    provPanel.classList.remove('hidden');
    custPanel.classList.add('hidden');
    listenProviderBookings();
  }
}

function listenCustomerBookings() {
  onValue(ref(db, 'bookings'), (snap) => {
    const box = document.getElementById('customer-bookings-container');
    box.innerHTML = '';

    if (!snap.exists()) {
      box.innerHTML = `<p style="color: var(--text-muted);">No current bookings found.</p>`;
      return;
    }

    const data = snap.val();
    Object.keys(data).forEach(id => {
      const b = data[id];
      if (b.customer_id === currentUser.uid) {
        
        const card = document.createElement('div');
        card.className = "booking-item";
        card.innerHTML = `
          <div class="booking-top">
            <div>
              <span class="booking-id">ID: ${b.booking_id}</span>
              <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">${b.service_category} - ${b.provider_name}</h3>
            </div>
            <span class="status-pill status-${b.status.replace(' ', '-')}">${b.status}</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">📅 Date: ${b.booking_date} | Time: ${b.booking_time}</p>
          <div class="booking-desc">${b.description}</div>
          <div id="review-slot-${b.booking_id}"></div>
        `;
        box.appendChild(card);

        // Business Rule: Review unlocked only on Completed Status
        if (b.status === 'Completed') {
          renderReviewActionSlot(b.booking_id, b.provider_id);
        }
      }
    });
  });
}

async function renderReviewActionSlot(bookingId, providerId) {
  const slot = document.getElementById(`review-slot-${bookingId}`);
  const revSnap = await get(child(ref(db), `reviews/${bookingId}`));

  if (revSnap.exists()) {
    slot.innerHTML = `<span style="font-size: 0.8rem; color: var(--success); font-weight: 800;">✔ Review Submitted</span>`;
  } else {
    slot.innerHTML = `
      <button onclick="openReviewModal('${bookingId}', '${providerId}')" class="btn btn-primary" style="background: var(--warning); font-size: 0.75rem; margin-top: 8px;">
        ★ Leave Rating Review
      </button>
    `;
  }
}

function listenProviderBookings() {
  onValue(ref(db, 'bookings'), (snap) => {
    const box = document.getElementById('provider-bookings-container');
    box.innerHTML = '';

    if (!snap.exists()) {
      box.innerHTML = `<p style="color: var(--text-muted);">No requests assigned.</p>`;
      return;
    }

    const data = snap.val();
    Object.keys(data).forEach(id => {
      const b = data[id];
      if (b.provider_id === currentUser.uid) {
        const card = document.createElement('div');
        card.className = "booking-item";
        card.innerHTML = `
          <div class="booking-top">
            <div>
              <span class="booking-id">ID: ${b.booking_id}</span>
              <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 2px;">Client: ${b.customer_name}</h3>
            </div>
            <span class="status-pill status-${b.status.replace(' ', '-')}">${b.status}</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">📍 ${b.location}</p>
          <p style="font-size: 0.8rem; color: var(--text-muted);">📅 ${b.booking_date} @ ${b.booking_time}</p>
          <div class="booking-desc">${b.description}</div>
          
          <!-- State Transition Action Buttons -->
          <div class="action-row">
            ${b.status === 'Pending' ? `
              <button onclick="changeStatus('${b.booking_id}', 'Accepted')" class="btn btn-primary" style="background: var(--success); font-size: 0.75rem;">Accept Request</button>
              <button onclick="changeStatus('${b.booking_id}', 'Rejected')" class="btn btn-danger" style="font-size: 0.75rem;">Reject</button>
            ` : ''}

            ${b.status === 'Accepted' ? `
              <button onclick="changeStatus('${b.booking_id}', 'In Progress')" class="btn btn-primary" style="font-size: 0.75rem;">Set In Progress</button>
            ` : ''}

            ${b.status === 'In Progress' ? `
              <button onclick="changeStatus('${b.booking_id}', 'Completed')" class="btn btn-primary" style="background: var(--success); font-size: 0.75rem;">Mark Completed</button>
            ` : ''}
          </div>
        `;
        box.appendChild(card);
      }
    });
  });
}

window.changeStatus = async function(bookingId, statusVal) {
  try {
    await update(ref(db, `bookings/${bookingId}`), { status: statusVal });
    notify(`Status changed to ${statusVal}`);
  } catch (err) {
    notify("Failed to change status", true);
  }
};

// =================================================================
// 7. REVIEWS & MODALS CONTROLLER
// =================================================================
window.openReviewModal = function(bId, pId) {
  document.getElementById('review-booking-id').value = bId;
  document.getElementById('review-provider-id').value = pId;
  document.getElementById('review-modal').classList.remove('hidden');
};

window.closeReviewModal = function() {
  document.getElementById('review-modal').classList.add('hidden');
  document.getElementById('review-form').reset();
};

document.getElementById('review-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const bId = document.getElementById('review-booking-id').value;
  const pId = document.getElementById('review-provider-id').value;
  const rating = Number(document.getElementById('review-rating').value);
  const comment = document.getElementById('review-comment').value;

  try {
    await set(ref(db, `reviews/${bId}`), {
      booking_id: bId,
      provider_id: pId,
      customer_id: currentUser.uid,
      rating,
      comment
    });
    notify("Review submitted successfully!");
    closeReviewModal();
  } catch (err) {
    notify("Failed to submit review.", true);
  }
});

// App Entry Point
router('home');