// 🔥 YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  databaseURL: "YOUR_DB_URL"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

setTimeout(()=>{
  loading.classList.remove("active");
  auth.classList.add("active");
},2500);

// REGISTER
async function register(){
  const emailVal=email.value;
  const passVal=password.value;
  const guardianVal=guardian.value;

  const userCred=await auth.createUserWithEmailAndPassword(emailVal,passVal);

  await db.collection("users").doc(userCred.user.uid).set({
    guardian:guardianVal
  });

  alert("Registered");
}

// LOGIN
async function login(){
  await auth.signInWithEmailAndPassword(email.value,password.value);
  authScreenOff();
}

function authScreenOff(){
  auth.classList.remove("active");
  dashboard.classList.add("active");
  initLocation();
  listenESP32();
}

// LOCATION
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

// LISTEN ESP32 TRIGGER
function listenESP32(){
  const uid=auth.currentUser.uid;
  rtdb.ref("sos/"+uid).on("value",snapshot=>{
    if(snapshot.val()==="TRIGGER"){
      sendSOS();
    }
  });
}

// SEND SOS
async function manualSOS(){
  sendSOS();
}

async function sendSOS(){
  const uid=auth.currentUser.uid;
  const userDoc=await db.collection("users").doc(uid).get();
  const guardian=userDoc.data().guardian;

  const mapLink=`https://www.google.com/maps?q=${currentLat},${currentLng}`;

  await fetch("https://YOUR_CLOUD_FUNCTION_URL",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      guardian:guardian,
      location:mapLink
    })
  });

  alert("SOS Sent Successfully");
}
