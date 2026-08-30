// Firebase Config (Apni Firebase Console Credentials Yahan Replace Karein

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCRR-rRl9wJjIKsKnDoObcExycvk2sL8EE",
    authDomain: "authentication-app-2e43f.firebaseapp.com",
    projectId: "authentication-app-2e43f",
    storageBucket: "authentication-app-2e43f.firebasestorage.app",
    messagingSenderId: "954638381968",
    appId: "1:954638381968:web:58bbef31cbe22ec7d43915",
    measurementId: "G-3L9Y356G13"
  };

// Initialize Firebase App
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 9 Service Options with Logos/Icons
const servicesData = [
    { name: "AC Repair", icon: "❄️" },
    { name: "Plumbing", icon: "🚰" },
    { name: "Electrical Work", icon: "⚡" },
    { name: "House Cleaning", icon: "🧹" },
    { name: "Pest Control", icon: "🐛" },
    { name: "Carpentry", icon: "🔨" },
    { name: "Painting", icon: "🎨" },
    { name: "Appliance Repair", icon: "🧺" },
    { name: "Home Gardening", icon: "🌱" }
];

// 9 Professional Provider Profiles with Real Names
const providersList = [
    { id: 1, name: "Ali Raza", profession: "AC Repair", rating: "4.9", bio: "Certified AC technician with 6+ years experience in installation and repairing." },
    { id: 2, name: "Ahmed Khan", profession: "Plumbing", rating: "4.8", bio: "Expert plumber specializing in leak fixes, pipe installations, and drainage systems." },
    { id: 3, name: "Usman Tariq", profession: "Electrical Work", rating: "4.7", bio: "Licensed electrician available for home wiring, repairs, and appliance setup." },
    { id: 4, name: "Saima Bibi", profession: "House Cleaning", rating: "4.9", bio: "Deep home cleaning and sanitization expert with high attention to detail." },
    { id: 5, name: "Bilal Sheikh", profession: "Pest Control", rating: "4.6", bio: "Safe and eco-friendly pest management expert for residential areas." },
    { id: 6, name: "Zubair Mahmood", profession: "Carpentry", rating: "4.8", bio: "Custom furniture maker and wood repair specialist with 10 years experience." },
    { id: 7, name: "Hamza Malik", profession: "Painting", rating: "4.7", bio: "Professional interior and exterior painter with top-quality finishing." },
    { id: 8, name: "Tariq Jameel", profession: "Appliance Repair", rating: "4.9", bio: "Fast repairs for washing machines, fridges, and microwave ovens." },
    { id: 9, name: "Rashid Ali", profession: "Home Gardening", rating: "4.8", bio: "Lawn care, landscape designing, and plant maintenance expert." }
];

// Render Dynamic Grid Data
document.addEventListener('DOMContentLoaded', () => {
    const servicesGrid = document.getElementById('servicesGrid');
    const serviceSelect = document.getElementById('serviceSelect');
    const providersGrid = document.getElementById('providersGrid');

    // Render 9 Services
    servicesData.forEach(service => {
        servicesGrid.innerHTML += `
            <div class="card">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.name}</h3>
                <p>Top quality ${service.name.toLowerCase()} services at affordable rates.</p>
            </div>`;
        
        serviceSelect.innerHTML += `<option value="${service.name}">${service.name}</option>`;
    });

    // Render 9 Providers
    providersList.forEach(provider => {
        providersGrid.innerHTML += `
            <div class="card">
                <div class="provider-avatar">👤</div>
                <h3>${provider.name}</h3>
                <p><strong>${provider.profession}</strong></p>
                <p style="color:#ffb400;">Rating: ⭐ ${provider.rating}</p>
                <button class="btn" style="margin-top:10px;" onclick="openProfile(${provider.id})">View Profile</button>
            </div>`;
    });
});

// Modal Dialog Helpers
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// Display Provider Profile Dynamic Popup
function openProfile(id) {
    const provider = providersList.find(p => p.id === id);
    const profileDetails = document.getElementById('profileDetails');
    profileDetails.innerHTML = `
        <h2>${provider.name}</h2>
        <p style="color:#00d1b2;"><strong>${provider.profession}</strong></p>
        <p><strong>Rating:</strong> ⭐ ${provider.rating}</p>
        <p style="margin: 10px 0;">${provider.bio}</p>
        <a href="#booking" onclick="closeModal('profileModal')" class="btn">Book Now</a>
    `;
    openModal('profileModal');
}

// User Sign Up Logic (Saves Role: Customer or Provider)
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPassword').value;
    const role = document.getElementById('accountType').value;

    auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            const userId = userCredential.user.uid;
            
            // Database Storage in Firestore
            return db.collection('users').doc(userId).set({
                name: name,
                email: email,
                role: role,
                createdAt: new Date()
            });
        })
        .then(() => {
            alert(`Account created successfully as a ${role}!`);
            closeModal('signupModal');
        })
        .catch(err => alert(err.message));
});

// User Login Logic
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            alert('Logged in successfully!');
            closeModal('loginModal');
        })
        .catch(err => alert(err.message));
});

// Firebase Auth Observer (Updates Navbar UI)
auth.onAuthStateChanged(user => {
    const authButtons = document.getElementById('authButtons');
    if (user) {
        authButtons.innerHTML = `<button onclick="auth.signOut()">Logout (${user.email})</button>`;
    } else {
        authButtons.innerHTML = `
            <button onclick="openModal('loginModal')">Login</button>
            <button onclick="openModal('signupModal')">Sign Up</button>`;
    }
});

// Booking Submission Logic (Firestore Storage)
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
        alert('Please login first to place a booking.');
        openModal('loginModal');
        return;
    }

    const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        service: document.getElementById('serviceSelect').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        createdAt: new Date()
    };

    db.collection('bookings').add(bookingData)
        .then(() => alert('Booking placed successfully!'))
        .catch(err => alert('Error: ' + err.message));
});
