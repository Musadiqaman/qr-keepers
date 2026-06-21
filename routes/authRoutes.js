const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const isAlreadyLoggedIn = require("../middleware/isAlreadyLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");



// GET register page
router.get("/register", isAlreadyLoggedIn, (req, res) => {
    res.render("register", { error: null });
});



// POST register
router.post("/register", isAlreadyLoggedIn, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render("register", { error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("register", { error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect("/items/dashboard");
    } catch (err) {
        console.error(err);
        res.render("register", { error: "Something went wrong, try again" });
    }
});




// GET login page
router.get("/login", isAlreadyLoggedIn, (req, res) => {
    res.render("login", { error: null });
});




// POST login
router.post("/login", isAlreadyLoggedIn, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.render("login", { error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.redirect("/items/dashboard");
    } catch (err) {
        console.error(err);
        res.render("login", { error: "Something went wrong, try again" });
    }
});



// GET logout
router.get("/logout", isLoggedIn, (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
});





module.exports = router;
