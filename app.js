
/* =========================================================
   QUICKSERVE - SCRIPT.JS
   Firebase + Search + Booking + Provider + Reviews
========================================================= */

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
   YAHAN APNI FIREBASE CONFIG PASTE KAREIN
========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCRR-rRl9wJjIKsKnDoObcExycvk2sL8EE",
    authDomain: "authentication-app-2e43f.firebaseapp.com",
    projectId: "authentication-app-2e43f",
    storageBucket: "authentication-app-2e43f.firebasestorage.app",
    messagingSenderId: "954638381968",
    appId: "1:954638381968:web:58bbef31cbe22ec7d43915",
    measurementId: "G-3L9Y356G13"
  };

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


/* =========================================================
   10 SERVICES
========================================================= */

const services = [

  {
    id: "cleaning",
    name: "Home Cleaning",
    category: "Cleaning",
    icon: "🧹",
    description:
      "Professional home and room cleaning.",
    price: 2500
  },

  {
    id: "plumbing",
    name: "Plumbing",
    category: "Plumbing",
    icon: "🔧",
    description:
      "Professional plumbing repair and installation.",
    price: 1800
  },

  {
    id: "electrical",
    name: "Electrical Work",
    category: "Electrical",
    icon: "⚡",
    description:
      "Home electrical repair and wiring.",
    price: 2000
  },

  {
    id: "ac",
    name: "AC Repair",
    category: "AC Repair",
    icon: "❄️",
    description:
      "AC repair, maintenance and installation.",
    price: 2200
  },

  {
    id: "painting",
    name: "House Painting",
    category: "Painting",
    icon: "🎨",
    description:
      "Professional interior and exterior painting.",
    price: 5000
  },

  {
    id: "carpentry",
    name: "Carpentry",
    category: "Carpentry",
    icon: "🪚",
    description:
      "Furniture, doors and cabinet repair.",
    price: 3000
  },

  {
    id: "appliance",
    name: "Appliance Repair",
    category: "Appliance Repair",
    icon: "🔌",
    description:
      "Repair for home electrical appliances.",
    price: 2000
  },

  {
    id: "pest",
    name: "Pest Control",
    category: "Pest Control",
    icon: "🐜",
    description:
      "Professional pest control services.",
    price: 3000
  },

  {
    id: "carwash",
    name: "Car Wash",
    category: "Car Wash",
    icon: "🚗",
    description:
      "Professional car cleaning and washing.",
    price: 1200
  },

  {
    id: "moving",
    name: "Moving & Shifting",
    category: "Moving & Shifting",
    icon: "📦",
    description:
      "Safe home and office moving services.",
    price: 6000
  }

];


/* =========================================================
   10 PROVIDERS
========================================================= */

let providers = [

  {
    id: "provider1",
    name: "Ahmed Khan",
    service: "Home Cleaning",
    category: "Cleaning",
    location: "Gulshan-e-Iqbal",
    experience: "6 Years",
    price: 2500,
    rating: 4.9,
    reviews: 128,
    avatar: "👨‍🔧",
    about:
      "Experienced home cleaning professional."
  },

  {
    id: "provider2",
    name: "Usman Ali",
    service: "Plumbing",
    category: "Plumbing",
    location: "North Nazimabad",
    experience: "8 Years",
    price: 1800,
    rating: 4.8,
    reviews: 96,
    avatar: "🔧",
    about:
      "Reliable plumber for home repairs."
  },

  {
    id: "provider3",
    name: "Bilal Ahmed",
    service: "Electrical Work",
    category: "Electrical",
    location: "PECHS",
    experience: "7 Years",
    price: 2000,
    rating: 4.9,
    reviews: 143,
    avatar: "👷",
    about:
      "Professional electrician for home wiring."
  },

  {
    id: "provider4",
    name: "Hassan Raza",
    service: "AC Repair",
    category: "AC Repair",
    location: "DHA Karachi",
    experience: "9 Years",
    price: 2200,
    rating: 4.7,
    reviews: 84,
    avatar: "❄️",
    about:
      "AC technician with professional experience."
  },

  {
    id: "provider5",
    name: "Fahad Malik",
    service: "House Painting",
    category: "Painting",
    location: "Clifton",
    experience: "10 Years",
    price: 5000,
    rating: 4.8,
    reviews: 117,
    avatar: "🎨",
    about:
      "Interior and exterior painting expert."
  },

  {
    id: "provider6",
    name: "Saad Ahmed",
    service: "Carpentry",
    category: "Carpentry",
    location: "Johar",
    experience: "5 Years",
    price: 3000,
    rating: 4.8,
    reviews: 71,
    avatar: "🪚",
    about:
      "Furniture and woodwork specialist."
  },

  {
    id: "provider7",
    name: "Hamza Sheikh",
    service: "Appliance Repair",
    category: "Appliance Repair",
    location: "Bahadurabad",
    experience: "6 Years",
    price: 2000,
    rating: 4.7,
    reviews: 68,
    avatar: "🔌",
    about:
      "Home appliance repair specialist."
  },

  {
    id: "provider8",
    name: "Ali Raza",
    service: "Pest Control",
    category: "Pest Control",
    location: "Gulistan-e-Johar",
    experience: "7 Years",
    price: 3000,
    rating: 4.8,
    reviews: 89,
    avatar: "🐜",
    about:
      "Professional pest control specialist."
  },

  {
    id: "provider9",
    name: "Danish Ahmed",
    service: "Car Wash",
    category: "Car Wash",
    location: "Korangi",
    experience: "5 Years",
    price: 1200,
    rating: 4.6,
    reviews: 55,
    avatar: "🚗",
    about:
      "Professional car cleaning specialist."
  },

  {
    id: "provider10",
    name: "Zain Malik",
    service: "Moving & Shifting",
    category: "Moving & Shifting",
    location: "Nazimabad",
    experience: "8 Years",
    price: 6000,
    rating: 4.9,
    reviews: 101,
    avatar: "📦",
    about:
      "Safe and reliable moving service provider."
  }

];


/* =========================================================
   STATE
========================================================= */

let currentUser = null;

let currentUserData = null;

let selectedService = null;

let selectedProvider = null;


/* =========================================================
   DOM
========================================================= */

const serviceGrid =
  document.getElementById("serviceGrid");

const providerGrid =
  document.getElementById("providerGrid");

const searchInput =
  document.getElementById("searchInput");

const categoryFilter =
  document.getElementById("categoryFilter");

const searchBtn =
  document.getElementById("searchBtn");

const authModal =
  document.getElementById("authModal");

const bookingModal =
  document.getElementById("bookingModal");

const providerModal =
  document.getElementById("providerModal");

const authContent =
  document.getElementById("authContent");

const bookingContent =
  document.getElementById("bookingContent");

const providerContent =
  document.getElementById("providerContent");

const toast =
  document.getElementById("toast");

const mainContent =
  document.getElementById("mainContent");

const dashboardSection =
  document.getElementById("dashboardSection");

const userArea =
  document.getElementById("userArea");

const loginBtn =
  document.getElementById("loginBtn");

const signupBtn =
  document.getElementById("signupBtn");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderServices();

    renderProviders();

    setupEvents();

  }
);


/* =========================================================
   SERVICES
========================================================= */

function renderServices(list = services) {

  if (!serviceGrid) return;


  if (!list.length) {

    serviceGrid.innerHTML = `
      <div class="empty-state">
        No services found.
      </div>
    `;

    return;
  }


  serviceGrid.innerHTML =
    list.map(service => `

      <div class="service-card">

        <div class="service-icon">
          ${service.icon}
        </div>

        <h3>
          ${service.name}
        </h3>

        <p>
          ${service.description}
        </p>

        <div class="service-bottom">

          <span class="service-price">
            From PKR
            ${Number(service.price).toLocaleString()}
          </span>

          <button
            class="book-service-btn"
            data-service-id="${service.id}"
          >
            Book
          </button>

        </div>

      </div>

    `).join("");


  document
    .querySelectorAll(
      ".book-service-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const service =
            services.find(
              item =>
                item.id ===
                button.dataset.serviceId
            );

          openBookingModal(service);

        }
      );

    });

}


/* =========================================================
   PROVIDERS
========================================================= */

function renderProviders(
  list = providers
) {

  if (!providerGrid) return;


  if (!list.length) {

    providerGrid.innerHTML = `
      <div class="empty-state">
        No providers found.
      </div>
    `;

    return;
  }


  providerGrid.innerHTML =
    list.map(provider => `

      <div class="provider-card">

        <div class="provider-avatar">
          ${provider.avatar || "👨‍🔧"}
        </div>

        <h3>
          ${escapeHTML(provider.name)}
        </h3>

        <div class="provider-service">
          ${escapeHTML(provider.service)}
        </div>

        <div class="rating">
          ★★★★★
          <strong>
            ${provider.rating || 5}
          </strong>
          (${provider.reviews || 0})
        </div>

        <div class="provider-meta">

          <span>
            📍 ${escapeHTML(provider.location)}
          </span>

          <span>
            💼 ${escapeHTML(provider.experience)}
          </span>

          <span>
            💰 PKR
            ${Number(provider.price || 0).toLocaleString()}
          </span>

        </div>

        <button
          class="profile-btn"
          data-provider-id="${provider.id}"
        >
          View Profile
        </button>

      </div>

    `).join("");


  document
    .querySelectorAll(
      ".profile-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const provider =
            providers.find(
              item =>
                item.id ===
                button.dataset.providerId
            );

          openProviderModal(provider);

        }
      );

    });

}


/* =========================================================
   SEARCH
========================================================= */

function performSearch() {

  const text =
    searchInput.value
      .trim()
      .toLowerCase();


  const category =
    categoryFilter.value;


  const filteredProviders =
    providers.filter(provider => {

      const searchable =
        `${provider.name}
         ${provider.service}
         ${provider.category}
         ${provider.location}
         ${provider.experience}`
          .toLowerCase();


      const textMatch =
        !text ||
        searchable.includes(text);


      const categoryMatch =
        category === "all" ||
        provider.category === category;


      return textMatch &&
             categoryMatch;

    });


  const filteredServices =
    services.filter(service => {

      const searchable =
        `${service.name}
         ${service.category}
         ${service.description}`
          .toLowerCase();


      const textMatch =
        !text ||
        searchable.includes(text);


      const categoryMatch =
        category === "all" ||
        service.category === category;


      return textMatch &&
             categoryMatch;

    });


  renderProviders(
    filteredProviders
  );

  renderServices(
    filteredServices
  );


  document
    .getElementById("providers")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* =========================================================
   AUTH
========================================================= */

function openLoginModal() {

  authContent.innerHTML = `

    <span class="eyebrow">
      WELCOME BACK
    </span>

    <h2>
      Login
    </h2>

    <p class="modal-subtitle">
      Login to book services or manage your provider profile.
    </p>

    <form id="loginForm">

      <div class="form-group">

        <label>Email</label>

        <input
          id="loginEmail"
          class="form-control"
          type="email"
          placeholder="you@example.com"
          required
        >

      </div>

      <div class="form-group">

        <label>Password</label>

        <input
          id="loginPassword"
          class="form-control"
          type="password"
          placeholder="Password"
          required
        >

      </div>

      <button class="form-submit">
        Login
      </button>

    </form>

    <div class="switch-text">

      Don't have an account?

      <button id="switchSignup">
        Create Account
      </button>

    </div>

  `;


  showModal(authModal);


  document
    .getElementById("loginForm")
    .addEventListener(
      "submit",
      loginUser
    );


  document
    .getElementById("switchSignup")
    .addEventListener(
      "click",
      openSignupModal
    );

}


function openSignupModal() {

  authContent.innerHTML = `

    <span class="eyebrow">
      GET STARTED
    </span>

    <h2>
      Create Account
    </h2>

    <p class="modal-subtitle">
      Create one account and use it as a customer or provider.
    </p>

    <form id="signupForm">

      <div class="form-group">

        <label>
          Full Name
        </label>

        <input
          id="signupName"
          class="form-control"
          type="text"
          required
        >

      </div>

      <div class="form-group">

        <label>
          Email
        </label>

        <input
          id="signupEmail"
          class="form-control"
          type="email"
          required
        >

      </div>

      <div class="form-group">

        <label>
          Password
        </label>

        <input
          id="signupPassword"
          class="form-control"
          type="password"
          minlength="6"
          required
        >

      </div>

      <button class="form-submit">
        Create Account
      </button>

    </form>

    <div class="switch-text">

      Already have an account?

      <button id="switchLogin">
        Login
      </button>

    </div>

  `;


  showModal(authModal);


  document
    .getElementById("signupForm")
    .addEventListener(
      "submit",
      registerUser
    );


  document
    .getElementById("switchLogin")
    .addEventListener(
      "click",
      openLoginModal
    );

}


/* =========================================================
   REGISTER
========================================================= */

async function registerUser(event) {

  event.preventDefault();


  const name =
    document
      .getElementById("signupName")
      .value
      .trim();


  const email =
    document
      .getElementById("signupEmail")
      .value
      .trim();


  const password =
    document
      .getElementById("signupPassword")
      .value;


  try {

    const result =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );


    await setDoc(
      doc(
        db,
        "users",
        result.user.uid
      ),
      {

        uid:
          result.user.uid,

        name:
          name,

        email:
          email,

        role:
          "customer",

        isProvider:
          false,

        createdAt:
          serverTimestamp()

      }
    );


    closeModal(authModal);

    showToast(
      "Account created successfully!"
    );


  } catch (error) {

    showToast(
      firebaseError(error)
    );

  }

}


/* =========================================================
   LOGIN
========================================================= */

async function loginUser(event) {

  event.preventDefault();


  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();


  const password =
    document
      .getElementById("loginPassword")
      .value;


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    closeModal(authModal);

    showToast(
      "Login successful!"
    );


  } catch (error) {

    showToast(
      firebaseError(error)
    );

  }

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  async user => {

    currentUser = user;


    if (!user) {

      userArea
        ?.classList
        .add("hidden");

      loginBtn
        ?.classList
        .remove("hidden");

      signupBtn
        ?.classList
        .remove("hidden");

      return;

    }


    loginBtn
      ?.classList
      .add("hidden");

    signupBtn
      ?.classList
      .add("hidden");

    userArea
      ?.classList
      .remove("hidden");


    try {

      const snap =
        await getDoc(
          doc(
            db,
            "users",
            user.uid
          )
        );


      if (snap.exists()) {

        currentUserData =
          snap.data();

      }


    } catch (error) {

      console.error(error);

    }

  }
);


/* =========================================================
   BOOKING MODAL
========================================================= */

function openBookingModal(
  service,
  provider = null
) {

  if (!currentUser) {

    showToast(
      "Please login first."
    );

    openLoginModal();

    return;

  }


  selectedService = service;

  selectedProvider = provider;


  const availableProviders =
    providers.filter(
      item =>
        item.category ===
        service.category
    );


  bookingContent.innerHTML = `

    <span class="eyebrow">
      BOOK SERVICE
    </span>

    <h2>
      ${service.name}
    </h2>

    <p class="modal-subtitle">
      Select your provider and booking details.
    </p>

    <form id="bookingForm">

      <div class="form-group">

        <label>
          Provider
        </label>

        <select
          id="bookingProvider"
          class="form-control"
          required
        >

          <option value="">
            Select Provider
          </option>

          ${availableProviders
            .map(
              p => `

                <option
                  value="${p.id}"
                  ${
                    provider &&
                    provider.id === p.id
                      ? "selected"
                      : ""
                  }
                >
                  ${escapeHTML(p.name)}
                  — ${escapeHTML(p.location)}
                </option>

              `
            )
            .join("")}

        </select>

      </div>


      <div class="form-group">

        <label>
          Date
        </label>

        <input
          id="bookingDate"
          class="form-control"
          type="date"
          required
        >

      </div>


      <div class="form-group">

        <label>
          Time
        </label>

        <input
          id="bookingTime"
          class="form-control"
          type="time"
          required
        >

      </div>


      <div class="form-group">

        <label>
          Location
        </label>

        <input
          id="bookingLocation"
          class="form-control"
          type="text"
          placeholder="Your complete address"
          required
        >

      </div>


      <div class="form-group">

        <label>
          Description
        </label>

        <textarea
          id="bookingDescription"
          class="form-control"
          rows="4"
          placeholder="Describe your work..."
          required
        ></textarea>

      </div>


      <button class="form-submit">
        Confirm Booking
      </button>

    </form>

  `;


  showModal(bookingModal);


  document
    .getElementById("bookingForm")
    .addEventListener(
      "submit",
      submitBooking
    );

}


/* =========================================================
   SUBMIT BOOKING
========================================================= */

async function submitBooking(event) {

  event.preventDefault();


  const providerId =
    document
      .getElementById(
        "bookingProvider"
      )
      .value;


  const provider =
    providers.find(
      item =>
        item.id === providerId
    );


  if (!provider) {

    showToast(
      "Please select a provider."
    );

    return;

  }


  const date =
    document
      .getElementById(
        "bookingDate"
      )
      .value;


  const time =
    document
      .getElementById(
        "bookingTime"
      )
      .value;


  const location =
    document
      .getElementById(
        "bookingLocation"
      )
      .value
      .trim();


  const description =
    document
      .getElementById(
        "bookingDescription"
      )
      .value
      .trim();


  const bookingId =
    "QS-" +
    Date.now()
      .toString()
      .slice(-9);


  try {

    await addDoc(
      collection(
        db,
        "bookings"
      ),
      {

        bookingId,

        customerId:
          currentUser.uid,

        customerName:
          currentUserData?.name ||
          currentUser.email,

        customerEmail:
          currentUser.email,

        providerId:
          provider.id,

        providerName:
          provider.name,

        service:
          selectedService.name,

        category:
          selectedService.category,

        date,

        time,

        location,

        description,

        price:
          provider.price,

        status:
          "Pending",

        createdAt:
          serverTimestamp()

      }
    );


    closeModal(bookingModal);


    showToast(
      `Booking ${bookingId} created!`
    );


    openDashboard(
      "customer"
    );


  } catch (error) {

    console.error(error);

    showToast(
      "Booking failed."
    );

  }

}


/* =========================================================
   PROVIDER PROFILE MODAL
========================================================= */

function openProviderModal(
  provider
) {

  selectedProvider = provider;


  providerContent.innerHTML = `

    <div class="provider-profile-header">

      <div class="big-provider-avatar">
        ${provider.avatar || "👨‍🔧"}
      </div>

      <div>

        <h2>
          ${escapeHTML(provider.name)}
        </h2>

        <p class="modal-subtitle">
          ${escapeHTML(provider.service)}
        </p>

      </div>

    </div>


    <div class="provider-stats">

      <div class="provider-stat">

        <strong>
          ${provider.rating || 5}
        </strong>

        <small>
          Rating
        </small>

      </div>

      <div class="provider-stat">

        <strong>
          ${escapeHTML(provider.experience)}
        </strong>

        <small>
          Experience
        </small>

      </div>

      <div class="provider-stat">

        <strong>
          ${provider.reviews || 0}
        </strong>

        <small>
          Reviews
        </small>

      </div>

    </div>


    <div class="detail-list">

      <div>
        📍 Location:
        <strong>
          ${escapeHTML(provider.location)}
        </strong>
      </div>

      <div>
        🛠️ Service:
        <strong>
          ${escapeHTML(provider.service)}
        </strong>
      </div>

      <div>
        💰 Price:
        <strong>
          PKR
          ${Number(provider.price).toLocaleString()}
        </strong>
      </div>

      <div>
        ℹ️ About:
        <strong>
          ${escapeHTML(provider.about || "")}
        </strong>
      </div>

    </div>


    <button
      id="bookThisProvider"
      class="form-submit"
      style="margin-top:20px"
    >
      Book This Provider
    </button>

  `;


  showModal(providerModal);


  document
    .getElementById(
      "bookThisProvider"
    )
    .addEventListener(
      "click",
      () => {

        closeModal(
          providerModal
        );


        const service =
          services.find(
            item =>
              item.category ===
              provider.category
          );


        openBookingModal(
          service,
          provider
        );

      }
    );

}


/* =========================================================
   DASHBOARD
========================================================= */

async function openDashboard(
  type = "customer"
) {

  if (!currentUser) {

    openLoginModal();

    return;

  }


  mainContent
    .classList
    .add("hidden");


  dashboardSection
    .classList
    .remove("hidden");


  const customerTab =
    document.getElementById(
      "customerTab"
    );

  const providerTab =
    document.getElementById(
      "providerTab"
    );

  const profileTab =
    document.getElementById(
      "profileTab"
    );


  const customerDashboard =
    document.getElementById(
      "customerDashboard"
    );

  const providerDashboard =
    document.getElementById(
      "providerDashboard"
    );

  const profileDashboard =
    document.getElementById(
      "profileDashboard"
    );


  customerDashboard
    .classList
    .add("hidden");

  providerDashboard
    .classList
    .add("hidden");

  profileDashboard
    .classList
    .add("hidden");


  customerTab
    .classList
    .remove("active");

  providerTab
    .classList
    .remove("active");

  profileTab
    .classList
    .remove("active");


  if (type === "provider") {

    providerTab
      .classList
      .add("active");

    providerDashboard
      .classList
      .remove("hidden");

    await loadProviderBookings();

  }

  else if (type === "profile") {

    profileTab
      .classList
      .add("active");

    profileDashboard
      .classList
      .remove("hidden");

    await loadProviderProfile();

  }

  else {

    customerTab
      .classList
      .add("active");

    customerDashboard
      .classList
      .remove("hidden");

    await loadCustomerBookings();

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   CUSTOMER BOOKINGS
========================================================= */

async function loadCustomerBookings() {

  const container =
    document.getElementById(
      "customerBookings"
    );


  container.innerHTML = `
    <div class="empty-state">
      Loading bookings...
    </div>
  `;


  try {

    const q =
      query(
        collection(
          db,
          "bookings"
        ),
        where(
          "customerId",
          "==",
          currentUser.uid
        )
      );


    const snapshot =
      await getDocs(q);


    if (snapshot.empty) {

      container.innerHTML = `
        <div class="empty-state">
          <h3>No bookings yet</h3>
          <p>
            Your bookings will appear here.
          </p>
        </div>
      `;

      return;

    }


    const bookings =
      snapshot.docs.map(
        item => ({
          id:
            item.id,
          ...item.data()
        })
      );


    container.innerHTML =
      bookings
        .map(
          booking =>
            customerBookingCard(
              booking
            )
        )
        .join("");


    document
      .querySelectorAll(
        ".review-btn"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            openReviewModal(
              button.dataset.id
            );

          }
        );

      });


  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <div class="empty-state">
        Unable to load bookings.
      </div>
    `;

  }

}


/* =========================================================
   CUSTOMER BOOKING CARD
========================================================= */

function customerBookingCard(
  booking
) {

  const status =
    String(
      booking.status
    )
    .toLowerCase()
    .replaceAll(
      " ",
      "-"
    );


  return `

    <div class="booking-item">

      <div style="
        display:flex;
        justify-content:space-between;
        gap:15px;
        flex-wrap:wrap;
      ">

        <div>

          <h3>
            ${escapeHTML(
              booking.service
            )}
          </h3>

          <div class="booking-meta">

            <span>
              ID:
              ${escapeHTML(
                booking.bookingId
              )}
            </span>

            <span>
              Provider:
              ${escapeHTML(
                booking.providerName
              )}
            </span>

          </div>

        </div>

        <span class="status ${status}">
          ${escapeHTML(
            booking.status
          )}
        </span>

      </div>


      <div class="booking-meta">

        <span>
          📅 ${escapeHTML(booking.date)}
        </span>

        <span>
          ⏰ ${escapeHTML(booking.time)}
        </span>

        <span>
          📍 ${escapeHTML(booking.location)}
        </span>

      </div>


      <p class="booking-description">
        ${escapeHTML(
          booking.description
        )}
      </p>


      <strong>
        PKR
        ${Number(
          booking.price || 0
        ).toLocaleString()}
      </strong>


      ${
        booking.status ===
        "Completed"
          ? `

            <div class="booking-actions">

              <button
                class="booking-action review-btn"
                data-id="${booking.id}"
              >
                ⭐ Leave Review
              </button>

            </div>

          `
          : ""
      }

    </div>

  `;

}


/* =========================================================
   PROVIDER BOOKINGS
========================================================= */

async function loadProviderBookings() {

  const container =
    document.getElementById(
      "providerBookings"
    );


  container.innerHTML = `
    <div class="empty-state">
      Loading jobs...
    </div>
  `;


  try {

    const q =
      query(
        collection(
          db,
          "bookings"
        ),
        where(
          "providerId",
          "==",
          currentUser.uid
        )
      );


    const snapshot =
      await getDocs(q);


    if (snapshot.empty) {

      container.innerHTML = `
        <div class="empty-state">
          <h3>No incoming bookings</h3>
          <p>
            Customer requests will appear here.
          </p>
        </div>
      `;

      return;

    }


    const bookings =
      snapshot.docs.map(
        item => ({
          id:
            item.id,
          ...item.data()
        })
      );


    container.innerHTML =
      bookings
        .map(
          booking =>
            providerBookingCard(
              booking
            )
        )
        .join("");


    document
      .querySelectorAll(
        "[data-booking-action]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          async () => {

            await changeBookingStatus(
              button.dataset.id,
              button.dataset.bookingAction
            );

          }
        );

      });


  } catch (error) {

    console.error(error);

    container.innerHTML = `
      <div class="empty-state">
        Unable to load jobs.
      </div>
    `;

  }

}


/* =========================================================
   PROVIDER BOOKING CARD
========================================================= */

function providerBookingCard(
  booking
) {

  const status =
    String(
      booking.status
    )
    .toLowerCase()
    .replaceAll(
      " ",
      "-"
    );


  let buttons = "";


  if (
    booking.status ===
    "Pending"
  ) {

    buttons = `

      <button
        class="booking-action accept-btn"
        data-id="${booking.id}"
        data-booking-action="Accepted"
      >
        ✓ Accept
      </button>

      <button
        class="booking-action reject-btn"
        data-id="${booking.id}"
        data-booking-action="Rejected"
      >
        ✕ Reject
      </button>

    `;

  }


  if (
    booking.status ===
    "Accepted"
  ) {

    buttons = `

      <button
        class="booking-action progress-btn"
        data-id="${booking.id}"
        data-booking-action="In Progress"
      >
        Start Job
      </button>

    `;

  }


  if (
    booking.status ===
    "In Progress"
  ) {

    buttons = `

      <button
        class="booking-action complete-btn"
        data-id="${booking.id}"
        data-booking-action="Completed"
      >
        Mark Completed
      </button>

    `;

  }


  return `

    <div class="booking-item">

      <div style="
        display:flex;
        justify-content:space-between;
        gap:15px;
        flex-wrap:wrap;
      ">

        <div>

          <h3>
            ${escapeHTML(
              booking.service
            )}
          </h3>

          <div class="booking-meta">

            <span>
              ID:
              ${escapeHTML(
                booking.bookingId
              )}
            </span>

            <span>
              Customer:
              ${escapeHTML(
                booking.customerName ||
                booking.customerEmail
              )}
            </span>

          </div>

        </div>

        <span class="status ${status}">
          ${escapeHTML(
            booking.status
          )}
        </span>

      </div>


      <div class="booking-meta">

        <span>
          📅 ${escapeHTML(booking.date)}
        </span>

        <span>
          ⏰ ${escapeHTML(booking.time)}
        </span>

        <span>
          📍 ${escapeHTML(booking.location)}
        </span>

      </div>


      <p class="booking-description">
        ${escapeHTML(
          booking.description
        )}
      </p>


      <strong>
        PKR
        ${Number(
          booking.price || 0
        ).toLocaleString()}
      </strong>


      <div class="booking-actions">
        ${buttons}
      </div>

    </div>

  `;

}


/* =========================================================
   CHANGE STATUS
========================================================= */

async function changeBookingStatus(
  bookingId,
  status
) {

  try {

    await updateDoc(
      doc(
        db,
        "bookings",
        bookingId
      ),
      {

        status,

        updatedAt:
          serverTimestamp()

      }
    );


    showToast(
      `Booking ${status}`
    );


    await loadProviderBookings();


  } catch (error) {

    console.error(error);

    showToast(
      "Unable to update booking."
    );

  }

}


/* =========================================================
   PROVIDER PROFILE
========================================================= */

async function loadProviderProfile() {

  if (!currentUser) return;


  try {

    const snap =
      await getDoc(
        doc(
          db,
          "providers",
          currentUser.uid
        )
      );


    if (!snap.exists()) {

      return;

    }


    const data =
      snap.data();


    document.getElementById(
      "providerName"
    ).value =
      data.name || "";


    document.getElementById(
      "providerService"
    ).value =
      data.service || "";


    document.getElementById(
      "providerLocation"
    ).value =
      data.location || "";


    document.getElementById(
      "providerExperience"
    ).value =
      data.experience || "";


    document.getElementById(
      "providerPrice"
    ).value =
      data.price || "";


    document.getElementById(
      "providerAvatar"
    ).value =
      data.avatar || "👨‍🔧";


    document.getElementById(
      "providerAbout"
    ).value =
      data.about || "";


  } catch (error) {

    console.error(error);

  }

}


/* =========================================================
   SAVE PROVIDER PROFILE
========================================================= */

async function saveProviderProfile(
  event
) {

  event.preventDefault();


  if (!currentUser) {

    openLoginModal();

    return;

  }


  const name =
    document.getElementById(
      "providerName"
    ).value.trim();


  const service =
    document.getElementById(
      "providerService"
    ).value;


  const location =
    document.getElementById(
      "providerLocation"
    ).value.trim();


  const experience =
    document.getElementById(
      "providerExperience"
    ).value.trim();


  const price =
    Number(
      document.getElementById(
        "providerPrice"
      ).value
    );


  const avatar =
    document.getElementById(
      "providerAvatar"
    ).value.trim();


  const about =
    document.getElementById(
      "providerAbout"
    ).value.trim();


  const serviceData =
    services.find(
      item =>
        item.name ===
        service
    );


  const profile = {

    uid:
      currentUser.uid,

    name,

    email:
      currentUser.email,

    service,

    category:
      serviceData?.category ||
      service,

    location,

    experience,

    price,

    avatar,

    about,

    rating:
      5,

    reviews:
      0,

    updatedAt:
      serverTimestamp()

  };


  try {

    await setDoc(
      doc(
        db,
        "providers",
        currentUser.uid
      ),
      profile
    );


    currentUserData = {

      ...currentUserData,

      isProvider:
        true,

      role:
        "provider"

    };


    await setDoc(
      doc(
        db,
        "users",
        currentUser.uid
      ),
      currentUserData,
      {
        merge: true
      }
    );


    await loadFirebaseProviders();


    showToast(
      "Provider profile saved!"
    );


    renderProviders(
      providers
    );


  } catch (error) {

    console.error(error);

    showToast(
      "Could not save provider profile."
    );

  }

}


/* =========================================================
   LOAD USER CREATED PROVIDERS
========================================================= */

async function loadFirebaseProviders() {

  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "providers"
        )
      );


    const firebaseProviders =
      snapshot.docs.map(
        item => ({
          id:
            item.id,
          ...item.data()
        })
      );


    const staticProviders =
      providers.filter(
        provider =>
          !firebaseProviders.some(
            fp =>
              fp.id ===
              provider.id
          )
      );


    providers = [

      ...staticProviders,

      ...firebaseProviders

    ];


    renderProviders(
      providers
    );


  } catch (error) {

    console.error(error);

  }

}


/* =========================================================
   REVIEWS
========================================================= */

function openReviewModal(
  bookingId
) {

  bookingContent.innerHTML = `

    <span class="eyebrow">
      YOUR FEEDBACK
    </span>

    <h2>
      Leave a Review
    </h2>

    <p class="modal-subtitle">
      Rate your experience with this provider.
    </p>

    <form id="reviewForm">

      <div class="form-group">

        <label>
          Rating
        </label>

        <select
          id="reviewRating"
          class="form-control"
          required
        >

          <option value="5">
            ★★★★★ — Excellent
          </option>

          <option value="4">
            ★★★★☆ — Very Good
          </option>

          <option value="3">
            ★★★☆☆ — Good
          </option>

          <option value="2">
            ★★☆☆☆ — Fair
          </option>

          <option value="1">
            ★☆☆☆☆ — Poor
          </option>

        </select>

      </div>


      <div class="form-group">

        <label>
          Review
        </label>

        <textarea
          id="reviewText"
          class="form-control"
          rows="5"
          placeholder="Write your review..."
          required
        ></textarea>

      </div>


      <button class="form-submit">
        Submit Review
      </button>

    </form>

  `;


  showModal(
    bookingModal
  );


  document
    .getElementById(
      "reviewForm"
    )
    .addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const rating =
          Number(
            document
              .getElementById(
                "reviewRating"
              )
              .value
          );


        const review =
          document
            .getElementById(
              "reviewText"
            )
            .value
            .trim();


        try {

          const bookingSnap =
            await getDoc(
              doc(
                db,
                "bookings",
                bookingId
              )
            );


          const booking =
            bookingSnap.exists()
              ? bookingSnap.data()
              : null;


          await addDoc(
            collection(
              db,
              "reviews"
            ),
            {

              bookingId,

              customerId:
                currentUser.uid,

              providerId:
                booking?.providerId ||
                "",

              providerName:
                booking?.providerName ||
                "",

              rating,

              review,

              createdAt:
                serverTimestamp()

            }
          );


          closeModal(
            bookingModal
          );


          showToast(
            "Review submitted successfully!"
          );


        } catch (error) {

          console.error(error);

          showToast(
            "Review could not be submitted."
          );

        }

      }
    );

}


/* =========================================================
   MODAL
========================================================= */

function showModal(modal) {

  modal?.classList.add(
    "show"
  );

  document.body.classList.add(
    "modal-open"
  );

}


function closeModal(modal) {

  modal?.classList.remove(
    "show"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimeout;


function showToast(message) {

  if (!toast) return;


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimeout
  );


  toastTimeout =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      3500
    );

}


/* =========================================================
   EVENTS
========================================================= */

function setupEvents() {

  loginBtn?.addEventListener(
    "click",
    openLoginModal
  );


  signupBtn?.addEventListener(
    "click",
    openSignupModal
  );


  document
    .getElementById(
      "logoutBtn"
    )
    ?.addEventListener(
      "click",
      async () => {

        await signOut(
          auth
        );

        showToast(
          "Logged out."
        );

        showHome();

      }
    );


  document
    .getElementById(
      "dashboardBtn"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "customer"
        )
    );


  document
    .getElementById(
      "exploreBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        document
          .getElementById(
            "services"
          )
          .scrollIntoView({
            behavior:
              "smooth"
          });

      }
    );


  document
    .getElementById(
      "becomeProviderBtn"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "profile"
        )
    );


  document
    .getElementById(
      "contactBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        document
          .getElementById(
            "providers"
          )
          .scrollIntoView({
            behavior:
              "smooth"
          });

      }
    );


  searchBtn?.addEventListener(
    "click",
    performSearch
  );


  searchInput?.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        performSearch();

      }

    }
  );


  searchInput?.addEventListener(
    "input",
    performSearch
  );


  categoryFilter?.addEventListener(
    "change",
    performSearch
  );


  document
    .getElementById(
      "viewAllServices"
    )
    ?.addEventListener(
      "click",
      () => {

        searchInput.value = "";

        categoryFilter.value =
          "all";

        renderServices(
          services
        );

        renderProviders(
          providers
        );

      }
    );


  document
    .getElementById(
      "customerTab"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "customer"
        )
    );


  document
    .getElementById(
      "providerTab"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "provider"
        )
    );


  document
    .getElementById(
      "profileTab"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "profile"
        )
    );


  document
    .getElementById(
      "backHomeBtn"
    )
    ?.addEventListener(
      "click",
      showHome
    );


  document
    .getElementById(
      "providerProfileForm"
    )
    ?.addEventListener(
      "submit",
      saveProviderProfile
    );


  document
    .getElementById(
      "authClose"
    )
    ?.addEventListener(
      "click",
      () =>
        closeModal(
          authModal
        )
    );


  document
    .getElementById(
      "bookingClose"
    )
    ?.addEventListener(
      "click",
      () =>
        closeModal(
          bookingModal
        )
    );


  document
    .getElementById(
      "providerClose"
    )
    ?.addEventListener(
      "click",
      () =>
        closeModal(
          providerModal
        )
    );


  [
    authModal,
    bookingModal,
    providerModal
  ].forEach(modal => {

    modal?.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeModal(
            modal
          );

        }

      }
    );

  });


  document
    .getElementById(
      "footerLogin"
    )
    ?.addEventListener(
      "click",
      openLoginModal
    );


  document
    .getElementById(
      "footerSignup"
    )
    ?.addEventListener(
      "click",
      openSignupModal
    );


  document
    .getElementById(
      "footerDashboard"
    )
    ?.addEventListener(
      "click",
      () =>
        openDashboard(
          "customer"
        )
    );


  document
    .getElementById(
      "menuBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        const menu =
          document.getElementById(
            "mobileMenu"
          );


        if (
          menu.style.display ===
          "block"
        ) {

          menu.style.display =
            "none";

        } else {

          menu.style.display =
            "block";

        }

      }
    );


  document
    .getElementById(
      "mobileLogin"
    )
    ?.addEventListener(
      "click",
      () => {

        document.getElementById(
          "mobileMenu"
        ).style.display =
          "none";

        openLoginModal();

      }
    );


  document
    .getElementById(
      "mobileSignup"
    )
    ?.addEventListener(
      "click",
      () => {

        document.getElementById(
          "mobileMenu"
        ).style.display =
          "none";

        openSignupModal();

      }
    );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeModal(
          authModal
        );

        closeModal(
          bookingModal
        );

        closeModal(
          providerModal
        );

      }

    }
  );


  loadFirebaseProviders();

}


/* =========================================================
   HOME
========================================================= */

function showHome() {

  dashboardSection
    .classList
    .add("hidden");


  mainContent
    .classList
    .remove("hidden");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   ERROR
========================================================= */

function firebaseError(error) {

  const code =
    error?.code || "";


  const errors = {

    "auth/email-already-in-use":
      "Email already registered.",

    "auth/invalid-email":
      "Invalid email address.",

    "auth/weak-password":
      "Password must be at least 6 characters.",

    "auth/invalid-credential":
      "Incorrect email or password.",

    "auth/user-not-found":
      "User not found.",

    "auth/wrong-password":
      "Incorrect password."

  };


  return (
    errors[code] ||
    "Something went wrong. Please try again."
  );

}


/* =========================================================
   SECURITY HELPER
========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}

