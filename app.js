/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 REPLACE WITH YOUR FIREBASE CONFIG */
/*const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);*/

/* Screens */
const loadingScreen = document.getElementById("loadingScreen");
const authScreen = document.getElementById("authScreen");
const dashboard = document.getElementById("dashboard");

/* Loading Transition */
setTimeout(()=>{
  loadingScreen.classList.remove("active");
  authScreen.classList.add("active");
},2000);

/* REGISTER */
document.getElementById("registerBtn").addEventListener("click", async ()=>{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const guardian = document.getElementById("guardian").value;

  try{
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db,"users",userCred.user.uid),{
      guardian:guardian
    });
    alert("Registered Successfully");
  }catch(err){
    alert(err.message);
  }
});

/* LOGIN */
document.getElementById("loginBtn").addEventListener("click", async ()=>{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try{
    await signInWithEmailAndPassword(auth,email,password);
    authScreen.classList.remove("active");
    dashboard.classList.add("active");
    initLocation();
  }catch(err){
    alert(err.message);
  }
});

/* LOCATION */
function initLocation(){
  navigator.geolocation.getCurrentPosition(
    pos=>{
      window.currentLat = pos.coords.latitude;
      window.currentLng = pos.coords.longitude;
      document.getElementById("locationStatus").innerText="Location Ready";
    },
    err=>{
      document.getElementById("locationStatus").innerText="Location Permission Denied";
    },
    {enableHighAccuracy:true}
  );
}

/* SOS */
document.getElementById("sosBtn").addEventListener("click", async ()=>{
  const user = auth.currentUser;
  if(!user){ alert("Not logged in"); return; }

  const docSnap = await getDoc(doc(db,"users",user.uid));
  const guardian = docSnap.data().guardian;

  const mapLink = `https://www.google.com/maps?q=${currentLat},${currentLng}`;

  window.location.href =
    `sms:${guardian}?body=${encodeURIComponent("🚨 EMERGENCY ALERT\n"+mapLink)}`;
});
