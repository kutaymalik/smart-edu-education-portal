import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import methodOverride from "method-override";

import { pageRoute } from "./routes/pageRoute.js";
import { courseRoute } from "./routes/courseRoute.js";
import { categoryRoute } from "./routes/categoryRoute.js";
import { userRoute } from "./routes/userRoute.js";

const app = express();

// Connect DB
await mongoose.connect("mongodb://127.0.0.1/smartedu-db").then(() => {
  console.log("DB connected succesfully.");
});

// Template Engine
app.set("view engine", "ejs");

// Global Variable
global.userIN = null;

// MIDDLEWARE
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1/smartedu-db",
    }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

const port = 3000;

// Routers
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`App started on ${port} port`);
});
