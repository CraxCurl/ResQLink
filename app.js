let bluetoothConnected = false;
let locationReady = false;
let holdInterval = null;
let holdProgress = 0;
let locationData = null;

const btDot = document.getElementById("btDot");
const gpsDot = document.getElementById("gpsDot");
const systemPanel = document.getElementById("systemPanel");
const holdBtn = document.getElementById("holdBtn");
const progressBar = document.getElementById("progressBar");
const lastAlert = document.getElementById("lastAlert");
const deliveryStatus = document.getElementById("deliveryStatus");

/* ---- Simulated Bluetooth Connection ---- */
setTimeout(() => {
  bluetoothConnected = true;
  btDot.classList.remove("red");
  btDot.classList.add("green");
}, 1500);

/* ---- GPS ---- */
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    locationReady = true;
    locationData = pos.coords;
    gpsDot.classList.remove("red");
    gpsDot.classList.add("green");
  });
}

/* ---- HOLD LOGIC ---- */
holdBtn.addEventListener("mousedown", startHold);
holdBtn.addEventListener("mouseup", cancelHold);
holdBtn.addEventListener("mouseleave", cancelHold);

holdBtn.addEventListener("touchstart", startHold);
holdBtn.addEventListener("touchend", cancelHold);

function startHold() {
  holdProgress = 0;

  holdInterval = setInterval(() => {
    holdProgress += 2;
    progressBar.style.width = holdProgress + "%";

    if (holdProgress >= 100) {
      clearInterval(holdInterval);
      triggerSOS();
    }
  }, 60); // 3 seconds
}

function cancelHold() {
  clearInterval(holdInterval);
  holdProgress = 0;
  progressBar.style.width = "0%";
}

/* ---- SOS ---- */
function triggerSOS() {

  systemPanel.classList.remove("armed");
  systemPanel.classList.add("alert");
  systemPanel.innerText = "SOS TRIGGERED – SENDING ALERT";

  const now = new Date().toLocaleString();
  lastAlert.innerText = now;
  deliveryStatus.innerText = "Sending...";

  if (!locationData) {
    deliveryStatus.innerText = "Location unavailable";
    return;
  }

  const mapLink = `https://maps.google.com/?q=${locationData.latitude},${locationData.longitude}`;
  const message = `🚨 SOS ALERT\nLocation: ${mapLink}`;

  const emergencyNumber = localStorage.getItem("guardianNumber") || "";

  if (emergencyNumber) {
    window.location.href =
      `sms:${emergencyNumber}?body=${encodeURIComponent(message)}`;
  }

  setTimeout(() => {
    deliveryStatus.innerText = "Alert sent successfully";
  }, 2000);
}
