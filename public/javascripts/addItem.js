// ===========================================================
// QR GENERATION LOGIC (runs fully in browser, no install needed)
// ===========================================================
// Library used: qrcode.js (Kazuhiko Arase, MIT licensed)
// How it works:
//   1. We collect item + owner info from the form
//   2. We build a plain text string out of it (this is what the
//      QR code will "contain" when scanned)
//   3. qrcode(typeNumber, errorCorrectionLevel) creates an encoder.
//      typeNumber = 0 means "auto-detect the smallest QR version
//      that fits the data" - so we don't have to calculate it.
//   4. qr.addData(text) feeds the text into the encoder
//   5. qr.make() actually computes the QR matrix
//   6. qr.createDataURL(cellSize, margin) renders the matrix as a
//      base64 PNG/GIF data-url, e.g. "data:image/gif;base64,R0lGOD..."
//      -> THIS is the string we save into MongoDB (qrData field)
//      -> it can be put directly into an <img src="..."> anywhere,
//         downloaded as a file, or printed on a sticker
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateQrBtn");
    const saveBtn = document.getElementById("saveItemBtn");
    const previewWrap = document.getElementById("qrPreviewWrap");
    const previewDiv = document.getElementById("qrPreview");

    if (!generateBtn) return; // not on this page

    generateBtn.addEventListener("click", () => {
        const itemname = document.getElementById("itemname").value.trim();
        const description = document.getElementById("description").value.trim();
        const ownername = document.getElementById("ownername").value.trim();
        const ownerPhone = document.getElementById("ownerPhone").value.trim();

        if (!itemname || !description || !ownername || !ownerPhone) {
            alert("Please fill all fields before generating the QR code");
            return;
        }

        // the text that will be ENCODED inside the QR code
        const qrText =
            `ITEM: ${itemname}\n` +
            `DESC: ${description}\n` +
            `OWNER: ${ownername}\n` +
            `PHONE: ${ownerPhone}\n` +
            `Scanned via QR Keepers - please contact the owner.`;

        // 0 = auto type number, 'M' = medium error correction
        const qr = qrcode(0, "M");
        qr.addData(qrText);
        qr.make();

        // cellSize=6, margin=4 -> nice sized QR image
        const dataUrl = qr.createDataURL(6, 4);

        // show live preview to the user
        previewDiv.innerHTML = `<img src="${dataUrl}" alt="Generated QR Code">`;
        previewWrap.style.display = "block";

        // store both values in hidden inputs so they get submitted
        // along with the rest of the form to the backend
        document.getElementById("qrData").value = dataUrl;
        document.getElementById("qrText").value = qrText;

        // only allow saving once a QR has actually been generated
        saveBtn.disabled = false;
    });
});
