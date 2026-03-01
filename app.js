let device;

function showToast(msg){
  const t=document.createElement("div");
  t.className="toast";
  t.innerText=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}

function registerUser(){
  const user={
    name:name.value,
    email:email.value,
    password:password.value,
    guardian:guardian.value
  };
  localStorage.setItem("user",JSON.stringify(user));
  showToast("Registered Successfully");
}

function loginUser(){
  const stored=JSON.parse(localStorage.getItem("user"));
  if(!stored){showToast("Register first");return;}
  if(stored.email===email.value && stored.password===password.value){
    auth.classList.remove("active");
    dashboard.classList.add("active");
    guardianDisplay.innerText="+91 ******"+stored.guardian.slice(-4);
  }else{
    showToast("Invalid Credentials");
  }
}

function openProfile(){
  dashboard.classList.remove("active");
  profile.classList.add("active");
}

function backDashboard(){
  profile.classList.remove("active");
  dashboard.classList.add("active");
}

function updateGuardian(){
  const user=JSON.parse(localStorage.getItem("user"));
  if(confirmPass.value!==user.password){
    showToast("Wrong Password");
    return;
  }
  user.guardian=newGuardian.value;
  localStorage.setItem("user",JSON.stringify(user));
  showToast("Guardian Updated");
  backDashboard();
}

async function connectDevice(){
  try{
    device=await navigator.bluetooth.requestDevice({acceptAllDevices:true});
    await device.gatt.connect();
    statusLight.classList.add("connected");
    statusTitle.innerText="Stick Connected";
    showToast("Stick Connected Successfully");

    device.addEventListener("gattserverdisconnected",()=>{
      statusLight.classList.remove("connected");
      statusTitle.innerText="Stick Not Connected";
    });

  }catch(e){
    showToast("Connection Failed");
  }
}

function manualSOS(){
  const user=JSON.parse(localStorage.getItem("user"));
  lastAlert.innerText=new Date().toLocaleString();
  const item=document.createElement("div");
  item.className="activity-item";
  item.innerText="🚨 SOS Triggered - "+new Date().toLocaleTimeString();
  activityList.prepend(item);

  window.location.href=`sms:${user.guardian}?body=🚨 SOS ALERT`;
}
