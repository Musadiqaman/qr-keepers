document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateQrBtn");
    const saveBtn     = document.getElementById("saveItemBtn");
    const previewWrap = document.getElementById("qrPreviewWrap");
    const previewDiv  = document.getElementById("qrPreview");

    if (!generateBtn) return;

    generateBtn.addEventListener("click", () => {
        const itemname    = document.getElementById("itemname").value.trim();
        const description = document.getElementById("description").value.trim();
        const ownername   = document.getElementById("ownername").value.trim();
        const ownerPhone  = document.getElementById("ownerPhone").value.trim();

        if (!itemname || !description || !ownername || !ownerPhone) {
            alert("Please fill all fields before generating the QR code");
            return;
        }

        const qrText =
            `ITEM: ${itemname}\nDESC: ${description}\nOWNER: ${ownername}\nPHONE: ${ownerPhone}`;

        const qr = qrcode(0, "M");
        qr.addData(qrText);
        qr.make();
        // cellSize=6 = scannable QR, margin=2
        const rawDataUrl = qr.createDataURL(6, 2);

        const img = new Image();
        img.onload = () => {
            const QR   = img.width;   // ~300px
            const PAD  = 16;
            const TXT  = 28;          // height reserved for text row

            const canvas = document.createElement("canvas");
            canvas.width  = QR + PAD * 2;
            canvas.height = QR + PAD + TXT;
            const ctx = canvas.getContext("2d");

            // white bg
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // QR image
            ctx.drawImage(img, PAD, PAD / 2, QR, QR);

            // caption — 13px, centred, always fits within canvas width
            ctx.fillStyle = "#222222";
            ctx.font = "bold 13px Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
                "Found this? scan to return.Please!",
                canvas.width / 2,
                QR + PAD / 2 + TXT / 2
            );

            const finalDataUrl = canvas.toDataURL("image/png");

            previewDiv.innerHTML = `<img src="${finalDataUrl}" alt="QR Code" style="max-width:220px;">`;
            previewWrap.style.display = "block";

            const downloadBtn = document.getElementById("downloadQrBtn");
            downloadBtn.href     = finalDataUrl;
            downloadBtn.download = `${itemname.replace(/\s+/g, "-")}-qr.png`;

            document.getElementById("qrData").value = finalDataUrl;
            document.getElementById("qrText").value = qrText;
            saveBtn.disabled = false;
        };
        img.src = rawDataUrl;
    });
});