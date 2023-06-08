const Reviewer = require("../models/Reviewer");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const reviewers = await Reviewer.find({});
    res.render("reviewer", { reviewers: reviewers, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list Reviewers" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Reviewer.findByIdAndRemove(id);
    res.redirect("/reviewer");
  } catch (e) {
    res.status(404).send({
      message: `could not delete record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const reviewer = new Reviewer({ name: req.body.name, Steam: req.body.Steam });
    await reviewer.save();
    res.redirect('/reviewer/?message=reviewer has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-reviewer', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const reviewer = await Reviewer.findById(id);
    res.render('update-reviewer', { reviewer: reviewer, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find reviewer ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const reviewer = await Reviewer.updateOne({ _id: id }, req.body);
    res.redirect('/reviewer/?message=reviewer has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find reviewer ${id}.`,
    });
  }
};




