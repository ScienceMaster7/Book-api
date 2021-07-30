const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Book = require("./models/books");
const booksRouter = require("./routes/book");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(cors());
app.use(express.json());

function currentTime() {
  return Date.now();
}
app.use((req, res, next) => {
  console.log("Current Time: " + currentTime());
  console.log("URL: " + req.url);
  console.log("Method: " + req.method);
  next();
});

app.get("/", (req, res) => {
  res.json({
    "/books": "read and create new articles",
    "/books/:id": "read, update and delete an individual article",
  });
});

app.use("/books", booksRouter);

/*
  We have to start the server. We make it listen on the port 4000

*/
mongoose
  .connect("mongodb://localhost:27017/books-api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("conected to Mongo");
    app.listen(4000, () => {
      console.log("Listening on http://localhost:4000");
    });
  })
  .catch((error) => {
    console.error(error);
  });
