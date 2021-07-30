const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: String,
    body: String,
    vote: {
      up: Number,
      down: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;