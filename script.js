function saveNumber() {
    const number = document.getElementById("phoneNumber").value;
    localStorage.setItem("emergencyNumber", number);
    alert("Emergency number saved!");
}

function triggerSOS() {

    const number = localStorage.getItem("emergencyNumber");
    if (!number) {
        alert("Save emergency number first!");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const mapLink = `https://www.google.com/maps?q=${lat},${lon}`;
        document.getElementById("mapFrame").src = mapLink;

        const message = `🚨 EMERGENCY! I need help. Live Location: ${mapLink}`;

        // vibration
        if (navigator.vibrate) navigator.vibrate([500,200,500]);

        // play alert sound
        new Audio("alert.mp3").play();

        // change status
        document.getElementById("sosStatus").innerText = "🚨 SOS SENT";

        // open SMS
        window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;

    }, () => {
        alert("Location permission denied!");
    });
}
