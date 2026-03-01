import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

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

/* Screens */
const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const registerScreen = document.getElementById("registerScreen");
const dashboard = document.getElementById("dashboard");

/* Loading Transition */
setTimeout(()=>{
  loadingScreen.classList.remove("active");
  loginScreen.classList.add("active");
},2500);

/* Switch Pages */
document.getElementById("goRegister").onclick=()=>{
  loginScreen.classList.remove("active");
  registerScreen.classList.add("active");
};

document.getElementById("goLogin").onclick=()=>{
  registerScreen.classList.remove("active");
  loginScreen.classList.add("active");
};

/* REGISTER */
document.getElementById("registerBtn").addEventListener("click",async()=>{
  const name=regName.value;
  const email=regEmail.value;
  const password=regPassword.value;
  const guardian=regGuardian.value;

  try{
    const userCred=await createUserWithEmailAndPassword(auth,email,password);

    await setDoc(doc(db,"users",userCred.user.uid),{
      name:name,
      guardian:guardian
    });

    alert("Registered Successfully");
    registerScreen.classList.remove("active");
    loginScreen.classList.add("active");

  }catch(err){
    alert(err.message);
  }
});

/* LOGIN */
document.getElementById("loginBtn").addEventListener("click",async()=>{
  const email=loginEmail.value;
  const password=loginPassword.value;

  try{
    const userCred=await signInWithEmailAndPassword(auth,email,password);
    const docSnap=await getDoc(doc(db,"users",userCred.user.uid));
    const userData=docSnap.data();

    loginScreen.classList.remove("active");
    dashboard.classList.add("active");

    greeting.innerText="Welcome, "+userData.name;

    initLocation();

  }catch(err){
    alert(err.message);
  }
});

/* LOCATION */
function initLocation(){
  navigator.geolocation.getCurrentPosition(
    pos=>{
      window.currentLat=pos.coords.latitude;
      window.currentLng=pos.coords.longitude;
      locationStatus.innerText="Location Ready";
    },
    err=>{
      locationStatus.innerText="Location Permission Denied";
    },
    {enableHighAccuracy:true}
  );
}

/* SOS */
document.getElementById("sosBtn").addEventListener("click",async()=>{
  const user=auth.currentUser;
  if(!user){alert("Not logged in");return;}

  const docSnap=await getDoc(doc(db,"users",user.uid));
  const guardian=docSnap.data().guardian;

  const mapLink=`https://www.google.com/maps?q=${currentLat},${currentLng}`;

  window.location.href=
    `sms:${guardian}?body=${encodeURIComponent("🚨 EMERGENCY ALERT\n"+mapLink)}`;
});
