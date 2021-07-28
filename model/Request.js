const mongoose = require('mongoose');

module.exports = mongoose.model(
  "Request",
  new mongoose.Schema({
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    requestedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    category: {
      type: [mongoose.Schema.Types.String],
      required: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    content: [{
      name: {
        type: mongoose.Schema.Types.String,
        required: true
      },
      qty: {
        type: mongoose.Schema.Types.String,
        default: "NA"
      }
    }],
    status: {
      type: mongoose.Schema.Types.String,
      require: true,
      default: "PENDING",
      enum: ['PENDING', 'DONE'],
    }
  })
);