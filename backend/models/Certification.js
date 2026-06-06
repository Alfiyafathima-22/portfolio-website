const mongoose = require("mongoose");

const certSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    image: { type: String, default: "" },
    link: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certSchema, "certificates");