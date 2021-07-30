const express = require("express");
const Book = require("../models/books");

const router = express.Router();

function validatePost(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({
      error: "Request body must contain a title property",
    });
    return;
  }
  if (!req.body.body) {
    res.status(400).json({
      error: "Request body must contain a body property",
    });
    return;
  }
  if (!req.body.isread) {
    res.status(400).json({
      error: "Request body must contain a isread property",
    });
  }

  next();
}

router.get("/", (req, res) => {
  Book.find()
    .then((books) => {
      res.send(books);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    });
});

router.post("/", validatePost, (req, res) => {
  Book.create(req.body)
    .then((newBook) => {
      res.status(201).send(newBook);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Book.findById(id)
    .then((book) => {
      res.send(book);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Book.findByIdAndDelete(id)
    .then(() => {
      console.log("deleted succesfully");
      res.status(204).end();
    })
    .catch((error) => {
      res.send(error);
    });
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const change = req.body;

  Book.findByIdAndUpdate(id, change, { new: true })
    .then((updatedBook) => {
      res.send(updatedBook);
    })
    .catch((error) => {
      console.error(error);
      res.status(500);
    });
});

module.exports = router;
