const User = require("../../models/User");

exports.create = async (req, res) => {
  const reviewId = req.body.id;
  console.log(reviewId);
  if (!reviewId || !req.session.userID) {
    res.json({ result: 'error' });
  }
  try {
    await User.updateOne(
      { _id: req.session.userID },
      { $push: { saved_reviews: reviewId } }
    );
    res.json({ result: 'success' });
  } catch (e) {
    res.json({ result: 'could not create a favourite' });
  }
};