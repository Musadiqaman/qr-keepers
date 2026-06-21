const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    itemname: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ownername: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // base64 PNG data-url of the generated QR code (saved at creation time)
    qrData: {
        type: String
    },
    // the raw text/url that is encoded inside the QR (e.g. item-verify link)
    qrText: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
