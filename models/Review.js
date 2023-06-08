const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewsSchema = new Schema(
  {
    rating: Number,
    title: String,
    description: String,
    Name: String,
    Steam_username: String,
    price: Number,
    publisher: String,
    developer: String,
    country: String,

    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    developer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Developer",
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reviewer",
    },
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  },
  { timestamps: true }
);

reviewsSchema.index({'$**': 'text'});
module.exports = mongoose.model("Review", reviewsSchema);
