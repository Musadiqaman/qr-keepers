

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateQrBtn");
    const saveBtn = document.getElementById("saveItemBtn");
    const previewWrap = document.getElementById("qrPreviewWrap");
    const previewDiv = document.getElementById("qrPreview");

    if (!generateBtn) return; 

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

      
        const qr = qrcode(0, "M");
        qr.addData(qrText);
        qr.make();

    
        const dataUrl = qr.createDataURL(6, 4);

       
        previewDiv.innerHTML = `<img src="${dataUrl}" alt="Generated QR Code">`;
        previewWrap.style.display = "block";

    
        document.getElementById("qrData").value = dataUrl;
        document.getElementById("qrText").value = qrText;

        // only allow saving once a QR has actually been generated
        saveBtn.disabled = false;
    });
});
