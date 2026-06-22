require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");


const isAlreadyLoggedIn =require("./middleware/isAlreadyLoggedIn")

const app = express();
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoutes.js");
const itemRoutes = require("./routes/itemRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js");

connectDB();

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// home route
app.get("/",isAlreadyLoggedIn, (req, res) => {
    res.render("home");
});

// routes
app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/profile", profileRoutes);

const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
