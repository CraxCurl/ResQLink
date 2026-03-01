/* ==============================
   ResQLink - app.js
   Firebase v12.10.0 Integrated
================================ */

/* 🔥 Firebase Imports */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* 🔥 Your Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyAQU7n-P6lirLhXhyLuOm9JL-dnIf-j-2U",
  authDomain: "resqlink-73b57.firebaseapp.com",
  projectId: "resqlink-73b57",
  storageBucket: "resqlink-73b57.firebasestorage.app",
  messagingSenderId: "1089979527311",
  appId: "1:1089979527311:web:978de63a5d76348d7440fa",
  measurementId: "G-JVHWVP44H4"
};

/* 🔥 Initialize Firebase */
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

/* ==============================
   Screen Elements
================================ */
const loadingScreen = document.getElementById("loadingScreen");
const authScreen = document.getElementById("authScreen");
const dashboard = document.getElementById("dashboard");

/* ==============================
   Loading Transition
================================ */
setTimeout(() => {
  loadingScreen.classList.remove("active");
  authScreen.classList.add("active");
}, 2500);

/* ==============================
   REGISTER
================================ */
document.getElementById("registerBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const guardian = document.getElementById("guardian").value;

  if (!email || !password || !guardian) {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", userCred.user.uid), {
      guardian: guardian,
      createdAt: new Date()
    });

    alert("Registered Successfully");
  } catch (error) {
    alert(error.message);
  }
});

/* ==============================
   LOGIN
================================ */
document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    authScreen.classList.remove("active");
    dashboard.classList.add("active");

    initLocation();

  } catch (error) {
    alert(error.message);
  }
});

/* ==============================
   High Accuracy GPS
================================ */
function initLocation() {

  if (!navigator.geolocation) {
    document.getElementById("locationStatus").innerText = "Geolocation Not Supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      window.currentLat = position.coords.latitude;
      window.currentLng = position.coords.longitude;

      document.getElementById("locationStatus").innerText = "Location Ready";
    },
    (error) => {
      document.getElementById("locationStatus").innerText = "Location Permission Denied";
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

/* ==============================
   MANUAL SOS
================================ */
document.getElementById("sosBtn").addEventListener("click", async () => {

  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in");
    return;
  }

  if (!window.currentLat || !window.currentLng) {
    alert("Location not ready yet");
    return;
  }

  try {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    const guardian = docSnap.data().guardian;

    const mapLink = `https://www.google.com/maps?q=${currentLat},${currentLng}`;

    const message = `🚨 EMERGENCY ALERT\nUser needs help.\nLive Location:\n${mapLink}`;

    window.location.href =
      `sms:${guardian}?body=${encodeURIComponent(message)}`;

  } catch (error) {
    alert("Failed to send SOS");
  }
});
