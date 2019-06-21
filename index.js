const expressEdge = require("express-edge");
const auth = require("./middlewares/auth");
const redirectIfAuthenticated = require("./middlewares/redirectIfAuthenticated");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const connectFlash = require("connect-flash");
const edge = require("edge.js");

const createPostController = require("./controllers/createPost");
const homePageController = require("./controllers/homePage");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const createUserController = require("./controllers/createUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

const app = new express();
const mongoStore = connectMongo(expressSession);

mongoose
  .connect("mongodb://localhost:27017/express-blog", { useNewUrlParser: true })
  .then(() => console.log("You are now connected to Mongo!"))
  .catch(err => console.error("Something went wrong", err));

app.use(connectFlash());
app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  expressSession({
    secret: "secret"
  })
);
app.use(
  expressSession({
    secret: "secret",
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);
app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

app.set("views", `${__dirname}/views`);

app.get("/login", redirectIfAuthenticated, loginController);
app.get("/register", redirectIfAuthenticated, createUserController);
app.get("/new", auth, createPostController);
app.get("/", homePageController);
app.get("/:id", getPostController);
app.post("/store", storePostController);
app.post("/register", redirectIfAuthenticated, storeUserController);
app.post("/login", redirectIfAuthenticated, loginUserController);
app.get("/logout", redirectIfAuthenticated, logoutController);

app.listen(4000, () => console.log(`App working on port ${4000}`));
