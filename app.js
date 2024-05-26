const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path= require("path")
const engine = require('ejs-mate');
const app = express();
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;

if (!dbUrl) {
  throw new Error("ATLASDB_URL is not set in environment variables");
}
if (!secret) {
  throw new Error("SECRET is not set in environment variables");
}

console.log("Database URL:", dbUrl);
console.log("Secret:", secret);

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("could not connect", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// console.log(path.join(__dirname, "views"));D:\project\views
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: secret,
  },
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
  next();
})



app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*", (req, res, next)=>{
   next(new ExpressError(404, "page not found")) ;
})

app.use((err, req, res, next)=> {
   let{StatusCode=500, message = "something went wrong"} = err;
      res.status(StatusCode).render("error.ejs", {message});
//    res.status(StatusCode).send(message);
})

app.listen(3000,()=>{
    console.log("my server is running  at 3000");
});
