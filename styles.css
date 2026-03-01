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

const screens = document.querySelectorAll(".screen");

function showScreen(id){
  screens.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

setTimeout(()=>showScreen("loginScreen"),2500);

goRegister.onclick=()=>showScreen("registerScreen");
goLogin.onclick=()=>showScreen("loginScreen");

window.closeModal=()=>popupModal.style.display="none";

function showModal(msg){
  popupMessage.innerText=msg;
  popupModal.style.display="flex";
}

registerBtn.onclick=async()=>{
  try{
    const userCred=await createUserWithEmailAndPassword(auth,regEmail.value,regPassword.value);

    await setDoc(doc(db,"users",userCred.user.uid),{
      name:regName.value,
      guardian:regGuardian.value
    });

    showModal("Registration successful.");
    showScreen("loginScreen");

  }catch(err){
    if(err.code==="auth/email-already-in-use"){
      showModal("Email already in use.");
    }else{
      showModal(err.message);
    }
  }
};

loginBtn.onclick=async()=>{
  loginError.innerText="";
  try{
    const userCred=await signInWithEmailAndPassword(auth,loginEmail.value,loginPassword.value);
    const snap=await getDoc(doc(db,"users",userCred.user.uid));
    greeting.innerText="Welcome, "+snap.data().name;
    showScreen("dashboard");
    initLocation();
  }catch(err){
    if(err.code==="auth/wrong-password"){
      loginError.innerText="Invalid password";
    }else{
      loginError.innerText=err.message;
    }
  }
};

function initLocation(){
  navigator.geolocation.getCurrentPosition(
    pos=>{
      window.lat=pos.coords.latitude;
      window.lng=pos.coords.longitude;
      locationStatus.innerText="Location Ready";
    },
    ()=>locationStatus.innerText="Permission Denied",
    {enableHighAccuracy:true}
  );
}

sosBtn.onclick=async()=>{
  const user=auth.currentUser;
  const snap=await getDoc(doc(db,"users",user.uid));
  const guardian=snap.data().guardian;
  const link=`https://www.google.com/maps?q=${lat},${lng}`;
  window.location.href=`sms:${guardian}?body=${encodeURIComponent("🚨 EMERGENCY ALERT\n"+link)}`;
};
