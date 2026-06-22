const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET profile page
router.get("/", isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.render("profile", { user, success: null, error: null });
});

// POST change password
router.post("/change-password", isLoggedIn, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.render("profile", { user, success: null, error: "Current password is incorrect" });
        }

        if (newPassword !== confirmPassword) {
            return res.render("profile", { user, success: null, error: "New passwords do not match" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.render("profile", { user, success: "Password updated successfully", error: null });
    } catch (err) {
        console.error(err);
        const user = await User.findById(req.user.id);
        res.render("profile", { user, success: null, error: "Something went wrong" });
    }
});

module.exports = router;
