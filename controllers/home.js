const Review = require('../models/Review');

exports.list = async (req, res) => {
    console.log(req.session);
    try {
        const totalReviewers = await Review.find({}).count();
        const totalCountries = await Review.aggregate([
            { $group: { _id: "$country", total: { $sum: 1 } } },
            { $count: "total" }
        ])
        console.log(totalCountries)
        const reviewerCountSummaryRef = await Review.aggregate(
            [
                { $match: { Name: { $ne: null } } },
                {
                    $group: {
                        _id: "$Name",
                        total: { $sum: 1 }
                    }
                }]);

        const reviewerCountSummary = reviewerCountSummaryRef.map(t => ({ name: t._id, total: t.total }));
        res.render("index", { reviewerCountSummary: reviewerCountSummary, totalReviews: totalReviewers, totalReviews: reviewerCountSummary.length, totalCountries: totalCountries[0].total });

    } catch (e) {
        console.error(e); // Log the error object
        console.error(e.message); // Log the error message
        res.status(404).send({
            message: `error rendering page`,
        });
    }
}