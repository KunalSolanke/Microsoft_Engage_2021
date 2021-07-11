var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
var indexRouter = require("./routes/index");

var app = express();
BASE_URL = process.env.BASE_URL || "project";

/* ===================== ADMIN SETUP ====================== */
const adminRouter = require("./admin");
let router = adminRouter();
app.use(`/${BASE_URL}/admin`, router);
const session = require("./middlewares/express-mongo-store");
//====================== SENTRY SETUP ===========================================

var Sentry = require("@sentry/node");
var Tracing = require("@sentry/tracing");
const SENTRY_URL = process.env.SENTRY_URL;
Sentry.init({
  dsn: SENTRY_URL,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(session.expressSession);
//cors sertup

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: [
    "x-auth-token",
    "set-cookie",
    "authorization",
    "content-type",
    "credentials",
    "cache-control",
  ],
};
app.use(cors(corsOption));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(`/static`, express.static(path.join(__dirname, "public")));
app.use("/api", express.static(__dirname + "/docs"));
app.use("/api", express.directory(__dirname + "/docs"));

/*========== ROUTING SETUP : DECLARE YOURS ROUTERS INSIDE INDEXROUTER =================================*/

app.use(`/`, indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(Sentry.Handlers.errorHandler());
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log(err);
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//===============================================================
module.exports = app;
