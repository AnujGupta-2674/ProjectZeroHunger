const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Donation = require("./models/schema.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js");
const { donationSchema } = require("./models/schema2.js");

const app = express();
const port = 8000;

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

//Views and Public
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

main().then(() => { console.log("Connected to Mongoose") })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/donation');
}

//Async Wrap
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => next(err));
    }
}

//Validate Function
const validateDonation = (req, res, next) => {
    let { error } = donationSchema.validate(req.body);
    if (!error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new (ExpressError(400, errMsg));
    } else {
        next();
    }
}
//All Routes
app.get("/", (req, res) => {
    res.send("I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
    const allDonators = await Donation.find({});
    res.render("index.ejs", { allDonators });
});

//Making Donation Route
app.get("/donation/new", (req, res) => {
    res.render("makeDonation.ejs");
});

app.post("/listings", validateDonation, wrapAsync(async (req, res) => {
    const newDonator = new Donation(req.body.Donation);
    await newDonator.save();
    res.redirect("/listings");
}));

//Our work in detail
app.get("/listings/show1", (req, res) => {
    res.render("show1.ejs");
});

app.get("/listings/show2", (req, res) => {
    res.render("show2.ejs");
});

app.get("/listings/show3", (req, res) => {
    res.render("show3.ejs");
});

//Page Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.render("error.ejs", { message });
});

//Listening
app.listen(port, () => {
    console.log(`App is listening on port:${port}`);
});