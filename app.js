import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


// 🔹 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAQU7n-P6lirLhXhyLuOm9JL-dnIf-j-2U",
  authDomain: "resqlink-73b57.firebaseapp.com",
  projectId: "resqlink-73b57",
  storageBucket: "resqlink-73b57.firebasestorage.app",
  messagingSenderId: "1089979527311",
  appId: "1:1089979527311:web:978de63a5d76348d7440fa"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// 🔹 SCREEN CONTROL
const screens = document.querySelectorAll(".screen");

function show(screenId) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

// loading → login
setTimeout(() => show("login"), 2000);


// 🔹 NAVIGATION
goRegister.onclick = () => show("register");
goLogin.onclick = () => show("login");


// 🔹 REGISTER
registerBtn.onclick = async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      regEmail.value.trim(),
      regPassword.value.trim()
    );

    await setDoc(doc(db, "users", userCred.user.uid), {
      name: regName.value.trim(),
      guardian: regGuardian.value.trim()
    });

    alert("✔ Registration Completed Successfully");
    show("login");

  } catch (error) {
    alert("Registration Error: " + error.code);
  }
};


// 🔹 LOGIN
loginBtn.onclick = async () => {
  loginError.innerText = "";

  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmail.value.trim(),
      loginPassword.value.trim()
    );
  } catch (error) {
    console.log(error);

    if (error.code === "auth/wrong-password") {
      loginError.innerText = "Invalid password";
    } 
    else if (error.code === "auth/user-not-found") {
      loginError.innerText = "User not found";
    }
    else if (error.code === "auth/invalid-credential") {
      loginError.innerText = "Invalid email or password";
    }
    else {
      loginError.innerText = error.code;
    }
  }
};


// 🔹 AUTH STATE LISTENER (VERY IMPORTANT FIX)
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("User data missing in Firestore.");
      return;
    }

    const userData = userDoc.data();
    greeting.innerText = "Welcome, " + userData.name;

    show("dashboard");
    initLocation();

  } catch (error) {
    alert("Firestore Read Error: " + error.message);
  }
});


// 🔹 LOGOUT
logoutBtn.onclick = async () => {
  await signOut(auth);
  show("login");
};


// 🔹 LOCATION
function initLocation() {
  if (!navigator.geolocation) {
    locationStatus.innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      window.lat = pos.coords.latitude;
      window.lng = pos.coords.longitude;

      locationStatus.innerText = "Location Ready";

      mapFrame.src =
        `https://maps.google.com/maps?q=${window.lat},${window.lng}&z=15&output=embed`;

    },
    (err) => {
      locationStatus.innerText = "Location Permission Denied";
    },
    { enableHighAccuracy: true }
  );
}


// 🔹 SOS BUTTON (ANDROID SAFE FORMAT)
sosBtn.onclick = async () => {

  const user = auth.currentUser;
  if (!user) {
    alert("User not authenticated");
    return;
  }

  if (!window.lat || !window.lng) {
    alert("Location not ready yet");
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
      alert("Guardian number not found");
      return;
    }

    const guardian = snap.data().guardian.trim();

    const message =
      `🚨 EMERGENCY ALERT\n` +
      `Live Location:\n` +
      `https://www.google.com/maps?q=${window.lat},${window.lng}`;

    // Android compatible SMS format
    const smsURL =
      `sms:${guardian}?body=${encodeURIComponent(message)}`;

    window.location.href = smsURL;

    addActivity("SOS Sent");

  } catch (error) {
    alert("SOS Error: " + error.message);
  }
};


// 🔹 ACTIVITY LOG
function addActivity(text) {
  const li = document.createElement("li");
  li.innerText =
    new Date().toLocaleTimeString() + " - " + text;
  activityList.prepend(li);
}


// 🔹 BLUETOOTH CONNECT
bluetoothBtn.onclick = async () => {
  if (!navigator.bluetooth) {
    alert("Web Bluetooth not supported in this browser.");
    return;
  }

  try {
    await navigator.bluetooth.requestDevice({
      acceptAllDevices: true
    });

    connectionDot.classList.add("connected");
    connectionText.innerText = "Stick Connected";
    addActivity("Bluetooth Connected");

  } catch (error) {
    console.log(error);
  }
};
