const express = require("express");
const db = require("./lib/db");
const cors = require("cors");
const mongoose = require("mongoose");
const Article = require("./models/articles");

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

app.get("/articles", (req, res) => {
  db.findAll().then((posts) => {
    res.json({
      posts,
    });
  });
});

app.post("/articles", (req, res) => {
  Article.create(req.body)
    .then((newArticle) => {
      res.status(201).send(newArticle);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/articles/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400);
    console.log(req.params.id + "is not a number");
    process.exit;
  }
  db.findById(req.params.id).then((post) => {
    if (post) {
      res.json({
        post,
      });
    } else {
      res.json({
        "not found": "no post with this id",
      });
    }
  });
});

app.delete("/articles/:id", (req, res) => {
  db.deleteById(req.params.id)
    .then(() => {
      console.log("deleted succesfully");
    })
    .catch((error) => {
      res.send(error);
    });
});

app.patch("/articles/:id", (req, res) => {
  const id = req.params.id;
  const change = req.body;

  if (Object.keys(change).length === 0) {
    res.status(400);
    res.send("You need to provide what you want to change");
  } else {
    db.updateById(id, change).then((updatedPost) => {
      if (updatedPost) {
        res.json(updatedPost);
      } else {
        res.status(404);
        res.send("didnt found post");
      }
    });
  }
});

/*
  We have to start the server. We make it listen on the port 4000

*/
mongoose
  .connect("mongodb://localhost:27017/articles-api", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
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
