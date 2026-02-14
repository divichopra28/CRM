const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema({
  note: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "converted"],
      default: "new",
    },
    followUps: [followUpSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
