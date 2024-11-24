import env from "dotenv";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import methodOverride from 'method-override';
import router from "./server/routes/index.js";
import drouter from "./server/routes/dashbord.js";
import authrouter from "./server/routes/auth.js";
import { connectDB } from "./server/config/db.js";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import cors from 'cors'
const app = express();
const port = 3000 || process.env.PORT;

env.config();
app.use(cors());
app.use(
  session({
    secret: "topsecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
    cookie: {
       maxAge: 10000*60*60*24,
       },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

// connect mongo data base
connectDB();

// static files
app.use(express.static("public"));

app.use(expressEjsLayouts);

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// routes

app.use(router);
app.use(drouter);
app.use(authrouter);

app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`the server is running on ${port}`);
});
