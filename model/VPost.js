const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
    default: Date.now(),
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
    detail: {
      type: mongoose.Schema.Types.String,
      required: true
    },
    qty: {
      type: mongoose.Schema.Types.String,
      default: "NA"
    }
  }]
})

module.exports = mongoose.model.Post || mongoose.model("VPost", postSchema)


