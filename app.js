const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model('Article', articleSchema);






///////////////Requests Targettimg all Articles/////////////////////////
app.route("/articles")

  .get((req, res) => {
    Article.find({}, (err, articlesFound) => {
      if (err) {
        res.send(err);
      } else {
        res.send(articlesFound).status(200);
      }
    })
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("Succefully added a new article");
      } else {
        res.send(err)
      }
    })
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Succefully deleted all articles.");
      } else {
        res.send(err)
      }
    });
  })
///////////////Requests Targettimg specifics Articles/////////////////////////

app.route("/articles/:articleTitle").get((req, res) => {
  Article.findOne({
    title: req.params.articleTitle
  }, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      if (article) {
        res.send(article);
      } else {
        res.send("Article not found!")
      }
    }
  });
}).put((req, res) => {
  Article.update({
    title: req.params.articleTitle
  }, {
    title: req.body.title,
    content: req.body.content
  }, {
    new: true
  }, (err) => {
    if (!err) {
      res.send("Successfully update article.")
    }
  });
}).patch((req, res) => {


  //collection.findAndModify(criteria[, sort[, update[, options]]], callback)

  Article.findOneAndUpdate({
    title: req.params.articleTitle
  }, {
    $set: req.body
  }, (err) => {
    if (!err) {
      res.send("Successfully update article.")
    } else {
      res.send(err)
    }
  });
}).delete((req, res) => {
  Article.deleteOne({
    title: req.params.articleTitle
  }).then(() => {
    console.log("Successfully deleted!");
  }).catch((err) => {
    console.log(err);
  })
})



app.listen(PORT, () => {
  console.log("Server started on port: " + PORT);
});
