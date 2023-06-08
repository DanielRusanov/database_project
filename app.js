require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const countriesModel = require("./models/Country");
const expressSession = require("express-session");
const User = require("./models/User");
const Review = require("./models/Review");

const reviewerController = require("./controllers/reviewer");
const reviewController = require("./controllers/review");
const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const reviewApiController = require("./controllers/api/review");
const savedReviewApiController = require("./controllers/api/savedReview");
const savedReviewController = require("./controllers/savedReview");

const app = express();
app.set("view engine", "ejs");


const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", homeController.list);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/create-reviewer", authMiddleware, (req, res) => {
  res.render("create-reviewer", { errors: {} });
});

app.post("/create-reviewer", reviewerController.create);

app.get("/reviewer", reviewerController.list);
app.get("/reviewer/delete/:id", reviewerController.delete);
app.get("/reviewer/update/:id", reviewerController.edit);
app.post("/reviewer/update/:id", reviewerController.update);



app.get("/create-review", reviewController.createView);
app.post("/create-review", reviewController.create);
app.get("/update-review/:id", reviewController.edit);

app.get("/search-review",(req,res) => {
  res.render('search-review', reviewApiController);
});

app.get("/saved-review", savedReviewController.list);

app.get("/api/search-review", reviewApiController.list);
app.post("/api/saved-review", savedReviewApiController.create);

app.get('/review', (req, res) => {
  const pageNumber = parseInt(req.query.page) || 1;
  const perPage = 80; // Number of items per page
  const skip = (pageNumber - 1) * perPage; // Calculate the number of items to skip

  // Fetch the data for the specified page number
  // For example, using a database query
  Review.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec()
    .then(review => {
      return Review.find({}).countDocuments().exec()
        .then(count => {
          const numberOfPages = Math.ceil(count / perPage);
          res.render("reviews", {
            reviews: review,
            numberOfPages: numberOfPages,
            currentPage: pageNumber,
            message: message
          });
        })
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      throw err;
    });
});

app.get("/reviews", reviewController.list);
app.get("/reviews/delete/:id", reviewController.delete);

app.get("/api/review", )

app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});

app.post("/join", userController.create);
app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);


app.listen(PORT, () => {
  console.log(
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});