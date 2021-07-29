const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const admin = require("firebase-admin");
const logger = require("morgan")
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const graphRoutes = require('./routes/graphRoutes');


//---------------
// configs
//---------------

const serviceAccount = require("./admin.json");

const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders:['Content-Type', 'Authorization']
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://proj1-913e5.firebaseio.com",
});

const app = express();

//---------------
// middleware
//---------------

app.use(logger("dev"));
app.use(express.static('public'));
app.use(express.json());



app.use(cors(corsOption));

//--------------------
// database connection
//--------------------

const dbURI = 'mongodb+srv://su:94mdGskpeFDGDRom@cluster0.dhgrl.mongodb.net/db2?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => { console.log("Connected to DB") })
  .catch((err) => console.log(err));


//-----------------
// Routes
//-----------------

app.use(graphRoutes);
app.use(authRoutes);


const port = process.env.PORT || 1337;

app.listen(port);