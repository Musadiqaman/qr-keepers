const express = require("express");
const router = express.Router();

const Item = require("../models/Item");
const User = require("../models/User");
const isLoggedIn = require("../middleware/isLoggedIn");

// DASHBOARD
router.get("/dashboard", isLoggedIn, async (req, res) => {
    const itemCount = await Item.countDocuments({ owner: req.user.id });
    res.render("dashboard", { user: req.user, itemCount });
});

// GET add item page
router.get("/add", isLoggedIn, (req, res) => {
    res.render("addItem", { user: req.user, error: null });
});

// POST add item -> qrData (base64 png) comes from client already generated
router.post("/add", isLoggedIn, async (req, res) => {
    try {
        const { itemname, description, ownername, ownerPhone, qrData, qrText } = req.body;

        if (!itemname || !description || !ownername || !ownerPhone) {
            return res.render("addItem", { user: req.user, error: "All fields are required" });
        }

        const newItem = await Item.create({
            itemname,
            description,
            ownername,
            ownerPhone,
            owner: req.user.id,
            qrData,
            qrText
        });

        await User.findByIdAndUpdate(req.user.id, { $push: { items: newItem._id } });

        res.redirect("/items/all");
    } catch (err) {
        console.error(err);
        res.render("addItem", { user: req.user, error: "Something went wrong, try again" });
    }
});

// GET all items belonging to logged in user
router.get("/all", isLoggedIn, async (req, res) => {
    const items = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.render("allItems", { user: req.user, items });
});

// GET single item (used by QR scan -> verify page, public route, no login needed)
router.get("/verify/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).send("Item not found");
        }
        res.render("verifyItem", { item });
    } catch (err) {
        res.status(404).send("Item not found");
    }
});

// GET scan page (camera based scanner)
router.get("/scan", isLoggedIn, (req, res) => {
    res.render("scan", { user: req.user });
});

// DELETE item
router.post("/delete/:id", isLoggedIn, async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.user.id });
        if (!item) {
            return res.redirect("/items/all");
        }
        await Item.deleteOne({ _id: item._id });
        await User.findByIdAndUpdate(req.user.id, { $pull: { items: item._id } });
        res.redirect("/items/all");
    } catch (err) {
        console.error(err);
        res.redirect("/items/all");
    }
});

module.exports = router;
