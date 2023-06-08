const User = require("../models/User");

exports.list = async (req, res) => {
  try {
    const userRef = await User.findOne({ _id: req.session.userID }).populate('saved_reviews');
    res.render('saved-reviews', { reviews: userRef.saved_reviews });
  } catch (e) {
    console.log(e);
    res.json({ result: 'could not find favourites' });
  }
};