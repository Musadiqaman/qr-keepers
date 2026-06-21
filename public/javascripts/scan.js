// ===========================================================
// CAMERA QR SCANNING LOGIC
// ===========================================================
// Library used: jsQR (pure JS, decodes QR codes from raw pixel data)
// How it works:
//   1. getUserMedia() asks the browser for camera access and
//      streams live video into a hidden <video> element
//   2. On every animation frame, we draw the current video frame
//      onto a <canvas> (this is just so we can read pixel data,
//      the canvas is never shown to the user)
//   3. canvas.getImageData() gives us the raw RGBA pixel array
//   4. jsQR(pixels, width, height) scans those pixels and, if a
//      QR pattern is found, returns { data: "decoded text", ... }
//   5. We stop scanning and show the decoded text on screen
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("scanVideo");
    const canvas = document.getElementById("scanCanvas");
    const statusEl = document.getElementById("scanStatus");
    const resultBox = document.getElementById("scanResultBox");
    const resultText = document.getElementById("scanResultText");
    const scanAgainBtn = document.getElementById("scanAgainBtn");

    if (!video) return; // not on this page

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let scanning = true;
    let stream = null;

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" } // prefer back camera on phones
            });
            video.srcObject = stream;
            video.setAttribute("playsinline", true);
            await video.play();
            statusEl.textContent = "Point the camera at a QR code...";
            scanning = true;
            requestAnimationFrame(tick);
        } catch (err) {
            statusEl.textContent = "Camera access denied or unavailable: " + err.message;
        }
    }

    function tick() {
        if (!scanning) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
            });

            if (code) {
                scanning = false;
                resultText.textContent = code.data;
                resultBox.style.display = "block";
                statusEl.textContent = "QR code detected ✅";
                stopCamera();
                return;
            }
        }
        requestAnimationFrame(tick);
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    scanAgainBtn.addEventListener("click", () => {
        resultBox.style.display = "none";
        statusEl.textContent = "Starting camera...";
        startCamera();
    });

    startCamera();
});
