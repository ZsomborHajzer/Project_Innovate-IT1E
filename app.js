
//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();
const fs = require('fs');
const path = require('path');


// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB connected!")).catch(err => console.log('DB Connection Error', err));

// middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentrials: true }));
app.use(bodyParser.json());


//error handeling
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
})

// routes
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

const authRoutes = require('./routes/auth.js');
app.use("/auth", authRoutes);

const homePageRoutes = require("./routes/homePage.js");
app.use("/homep age", homePageRoutes);

const flashcardsRouter = require("./routes/flashcards.js");
app.use("/flashcards", flashcardsRouter);

const profilePageRouter = require("./routes/profile.js");
const { Router } = require("express");
app.use("/profile", profilePageRouter);

const testingRouter = require("./routes/testing.js");
app.use("/testing", testingRouter);



app.get('*', (req, res) => {
    res.status('404').send('Error Page 404', 404);
});

//port
const port = process.env.PORT || 8081;

// listener
const server = app.listen(port, () => console.log(`server is running on port ${port}`));