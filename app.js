//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
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

// routes
const indexRoutes = require('./routes/index');
app.use("/", indexRoutes);

const signUpRoutes = require('./routes/signUp.js');
app.use("/signup", signUpRoutes);

const homePageRoutes = require("./routes/homePage.js");
app.use("/homepage", homePageRoutes);

app.get('*', function (req, res) {
    res.status('404').send('Error Page 404', 404);
});

//port
const port = process.env.PORT || 8080;

// listener
const server = app.listen(port, () => console.log(`server is running on port ${port}`));