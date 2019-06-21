const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");

const app = new express();

mongoose
  .connect("mongodb://localhost:27017/express-blog", { useNewUrlParser: true })
  .then(() => console.log("You are now connected to Mongo!"))
  .catch(err => console.error("Something went wrong", err));

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.set("views", `${__dirname}/views`);

app.get("/new", createPostController);
app.get("/", homePageController);
app.get("/:id", getPostController);
app.post("/store", storePostController);

app.listen(4000, () => console.log(`App working on port ${4000}`));
