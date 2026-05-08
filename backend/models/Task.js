const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    inputText: {
      type: String,
      required: true
    },

    operation: {
      type: String,
      enum: ["uppercase", "lowercase", "reverse", "wordcount", "sentiment"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "running", "success", "failed"],
      default: "pending"
    },

    result: {
      type: String,
      default: ""
    },

    logs: {
      type: [String],
      default: []
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);