require("dotenv").config();
// credentials = require('./middi/credentials.js');
// const corsOptions = require('./config/corsOptions.js');
const express = require("express");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const app = express();
const path = require("path");

app.use(fileUpload());

app.use(express.json());

app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

////////////////////////////////////////////////////
/////////  routing will be here //////////

app.get("/test", async (req, res) => {
  res.status(200).json({ status: true, message: "Api is working awesome" });
});

const patient = require('./routings/patientRouting/patientRouting')

app.use("/",patient)

module.exports = app;
