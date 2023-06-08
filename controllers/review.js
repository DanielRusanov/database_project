const Review = require("../models/Review");
const Country = require("../models/Country");
const Reviewer = require("../models/Reviewer");
const Genre = require("../models/Genre");
const Developer = require("../models/Developer");
const bodyParser = require("body-parser");
const { findById } = require("../models/Country");


exports.list = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const message = req.query.message;


  try {
    const review = await Review.find({}).skip((perPage * page) - perPage).limit(limit);
    const count = await Review.find({}).count();
    const numberOfPages = Math.ceil(count / perPage);

    res.render("reviews", {
      reviews: review,
      numberOfPages: numberOfPages,
      currentPage: page,
      message: message
    });
  } catch (e) {
    res.status(404).send({ message: "could not list reviews" });
  }
};

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const countries = await Country.find({});
    const reviewers = await Reviewer.find({});
    const genres = await Genre.find({});
    const review = await Review.findById(id);
    if (!review) throw Error('cant find review');
    res.render('update-review', {
      genres: genres,
      review: review,
      countries: countries,
      reviewer: reviewers, 
      id: id,
      errors: {}
    });
  } catch (e) {
    console.log(e)
    if (e.errors) {
      res.render('create-review', { errors: e.errors })
      return;
    }
    res.status(404).send({
      message: `could find reviewer ${id}`,
    });
  }
};

exports.create = async (req, res) => {
  try {
    const reviewer = await Reviewer.findById(req.body.reviewer_id); // Change variable name to "reviewer" instead of "Reviewer"
    await Review.create({
      title: req.body.title,
      Name: reviewer.name, // Use the "reviewer" variable instead of "Reviewer"
      Steam_username: reviewer.Steam_username, // Use the "reviewer" variable instead of "Reviewer"
      rating: parseInt(req.body.rating),
      reviewer_id: req.body.reviewer_id,
      genres: req.body.genres
    });

    res.redirect('/reviews/?message=A review has been created'); // Update the success message
  } catch (e) {
    if (e.errors) {
      res.render('create-review', { errors: e.errors });
      return;
    }
    return res.status(400).send({
      message: JSON.stringify(e), // Convert the error to a JSON string
    });
  }
}

exports.createView = async (req, res) => {
  try {
    const countries = await Country.find({});
    const reviewers = await Reviewer.find({});
    const genres = await Genre.find({});
    const review = {}; // Create an empty object for the review
    res.render("create-review", {
      countries: countries,
      reviewer: reviewers,
      genre: genres,
      review: review, // Pass the review object to the template
      errors: {}
    });

  } catch (e) {
    res.status(404).send({
      message: `Could not generate create data`,
    });
  }
}
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    await Review.findByIdAndRemove(id);
    res.redirect("/reviews");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};

