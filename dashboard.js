let countdown;
let timeLeft = 5;

function startCountdown() {

    document.getElementById("countdownBox").style.display = "block";
    timeLeft = 5;
    document.getElementById("timer").innerText = timeLeft;

    countdown = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            sendSOS();
        }
    }, 1000);
}

function cancelSOS() {
    clearInterval(countdown);
    document.getElementById("countdownBox").style.display = "none";
}

function sendSOS() {

    const number = localStorage.getItem("emergencyNumber");

    if (!number) {
        alert("No emergency number saved.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const link = `https://maps.google.com/?q=${lat},${lon}`;
        const msg = `🚨 SOS! I need help. Location: ${link}`;

        window.location.href =
            `sms:${number}?body=${encodeURIComponent(msg)}`;

    });
}

function logout() {
    window.location.href = "index.html";
}
