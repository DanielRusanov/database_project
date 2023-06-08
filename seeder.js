const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI } = process.env;


/**
 * constants
 */
const client = new MongoClient(MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("reviews").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your games!!").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "games.json"), "utf8");
    await db.collection("reviews").insertMany(JSON.parse(data));

    

    const gameReviewersRef = await db.collection("reviews").aggregate([
      { $match: { Name: { $ne: null } } },
      {
        $group: {
          _id: "$Name",
          steam: { $first: "$Steam_username" },
          reviews: { $sum: 1 },
        },

      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          Steam: '$Steam',
          reviews: '$reviews'
        },
      },
    ]);
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const gameReviewers = await gameReviewersRef.toArray();
    await db.collection("reviews").insertMany(gameReviewers);



    const updatedGameReviewersRef = db.collection("reviewers").find({});
    const updatedGameReviewers = await updatedGameReviewersRef.toArray();
    updatedGameReviewers.forEach(async ({ _id, name }) => {
      await db.collection("reviews").updateMany({ Name: name }, [
        {
          $set: {
            reviewer_id: _id,
            genres: ["$genre_1", "$genre_2"],
            rating: { $toInt: "$rating" },
          },
        },
      ]);
    });

    /**
     * we can get rid of region_1/2 off our root document, since we've
     * placed them in an array
     */
    await db
      .collection("reviews")
      .updateMany({}, { $unset: { genre_1: "", genre_2: "" } });

    /**
     * Finally, we remove nulls regions from our collection of arrays
     * */
    await db
    .collection("reviews")
    .updateMany({}, { $unset: { genre_1: "", genre_2: " " } });

  /**
   * Finally, we remove nulls regions from our collection of arrays
   * */
  await db
    .collection("reviews")
    .updateMany({ genres: { $all: [null] } }, [
      { $set: { genres: [{ $arrayElemAt: ["$genres", 0] }] } },
    ])


  db.collection("reviews").aggregate([
    { $group: { _id: "$publisher" } },
    { $project: { name: "$_id", "_id": 0 } },
    { $out: "publishers" }
  ]).toArray();

  db.collection("reviews").aggregate([
    { $group: { _id: "$country" } },
    { $project: { name: "$_id", "_id": 0 } },
    { $out: "countries" }
  ]).toArray()



  await db.collection("reviews").aggregate([
    { $group: { _id: "$developer" } },
    { $project: { name: "$_id", "_id": 0 } },
    { $out: "developers" }
  ]).toArray()

    await db.collection("reviews").aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres" } },
      { $project: { name: '$_id', _id: 0 } },
      { $out: "genres" }
    ]).toArray();


    await db.collection("reviews").aggregate([
      { $unwind: "$genres" },
      { $group: { _id: "$genres" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "genres" }
    ]).toArray()



    load.stop();
    console.info(
      `Games imported!`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
