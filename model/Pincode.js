const mongoose = require('mongoose');

module.exports = mongoose.model(
  "Pincode",
  new mongoose.Schema({
    officeName: {
      type: mongoose.Schema.Types.String,

    },
    pincode: {
      type: mongoose.Schema.Types.Number,

    },
    taluk: {
      type: mongoose.Schema.Types.String,

    },
    districtName: {
      type: mongoose.Schema.Types.String,

    },
    stateName: {
      type: mongoose.Schema.Types.String,

    }
  }),
  "pincode"
);