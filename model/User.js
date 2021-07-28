const mongoose = require('mongoose');

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      unique: true,
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    phone: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    pincode: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    createdAt: {
      type: mongoose.Schema.Types.Date,
      required: true,
      default: Date.now(),
    },
    role: {
      type: String,
      default: 'USER',
      enum: ['USER', 'VLT', 'ORG'],
      immutable: true
    }
  })
);