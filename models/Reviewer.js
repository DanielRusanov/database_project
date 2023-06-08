const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewerSchema = new Schema(
  {
    Steam: String,
    reviews: { type: Number, default: 0 },
    name: { type: String, required: [true, 'Name is required'], minlength: [3, "Name must be 4 letters long"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reviewer", reviewerSchema);
