let holdTimer;

function openSettings() {
    document.getElementById("settingsModal").style.display = "block";
}

function closeSettings() {
    document.getElementById("settingsModal").style.display = "none";
}

function saveNumber() {
    const number = document.getElementById("phoneInput").value;
    localStorage.setItem("emergencyNumber", number);
    document.getElementById("phoneInput").value = "";
    closeSettings();
    alert("Number saved securely.");
}

function holdStart() {
    holdTimer = setTimeout(triggerSOS, 2000);
}

function holdEnd() {
    clearTimeout(holdTimer);
}

function triggerSOS() {

    const number = localStorage.getItem("emergencyNumber");
    if (!number) {
        alert("Set emergency number first.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const link = `https://maps.google.com/?q=${lat},${lon}`;
        const msg = `🚨 SOS! I need help. My location: ${link}`;

        document.getElementById("statusText").innerText = "SOS Sent";
        document.getElementById("statusDot").style.background = "#ef4444";

        if (navigator.vibrate) navigator.vibrate([300,100,300]);

        window.location.href =
            `sms:${number}?body=${encodeURIComponent(msg)}`;

    });
}
