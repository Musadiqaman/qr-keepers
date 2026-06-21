const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");



require("dotenv").config();
const connectDB = require("./config/db.js");

const isAlreadyLoggedIn=require("./middleware/isAlreadyLoggedIn.js")

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


app.get("/",isAlreadyLoggedIn, (req, res) => {
    res.render("home");
});



app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/profile", profileRoutes);



const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
