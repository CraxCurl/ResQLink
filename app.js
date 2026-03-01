let device;
let characteristic;

function register() {
  const user = {
    name: fullName.value,
    email: email.value,
    password: password.value,
    guardian: guardianPhone.value
  };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Registered Successfully");
}

function login() {
  const stored = JSON.parse(localStorage.getItem("user"));
  if (!stored) return alert("Register first");

  if (stored.email === email.value && stored.password === password.value) {
    showDashboard();
  } else {
    alert("Invalid Credentials");
  }
}

function showDashboard() {
  authScreen.classList.remove("active");
  dashboard.classList.add("active");
}

function openProfile() {
  dashboard.classList.remove("active");
  profileScreen.classList.add("active");

  const user = JSON.parse(localStorage.getItem("user"));
  profileName.innerText = user.name;
  profileEmail.innerText = user.email;
}

function goDashboard() {
  profileScreen.classList.remove("active");
  dashboard.classList.add("active");
}

function updateGuardian() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (confirmPassword.value !== user.password) {
    return alert("Incorrect Password");
  }

  user.guardian = newGuardian.value;
  localStorage.setItem("user", JSON.stringify(user));
  alert("Guardian Updated");
}

async function connectESP32() {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service']
    });

    const server = await device.gatt.connect();
    document.getElementById("connectionLight").classList.add("connected");
    document.getElementById("connectionText").innerText = "Stick Connected";

    device.addEventListener('gattserverdisconnected', () => {
      document.getElementById("connectionLight").classList.remove("connected");
      document.getElementById("connectionText").innerText = "Stick Not Connected";
    });

    listenForSOS();

  } catch (error) {
    alert("Connection Failed");
  }
}

function listenForSOS() {
  // Replace with your real ESP32 characteristic UUID
  console.log("Listening for SOS...");
}

function sendSOS() {
  const user = JSON.parse(localStorage.getItem("user"));
  const message = "🚨 SOS ALERT! Please help immediately.";
  window.location.href =
    `sms:${user.guardian}?body=${encodeURIComponent(message)}`;
}
