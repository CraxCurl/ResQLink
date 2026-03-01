let holdTimer;

function openSettings() {
    document.getElementById("sheet").classList.add("active");
}

function closeSettings() {
    document.getElementById("sheet").classList.remove("active");
}

function saveNumber() {
    const number = document.getElementById("phoneInput").value;
    localStorage.setItem("emergencyNumber", number);
    document.getElementById("phoneInput").value = "";
    closeSettings();
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
        const msg = `🚨 SOS! I need help. Location: ${link}`;

        document.getElementById("statusText").innerText = "SOS Sent";
        document.querySelector(".dot").style.background = "#ef4444";

        if (navigator.vibrate) navigator.vibrate([400,200,400]);

        window.location.href =
            `sms:${number}?body=${encodeURIComponent(msg)}`;

    });
}
