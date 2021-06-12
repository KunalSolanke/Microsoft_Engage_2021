var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
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
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(`/${BASE_URL}`, express.static(path.join(__dirname, "public")));

/*========== ROUTING SETUP : DECLARE YOURS ROUTERS INSIDE INDEXROUTER =================================*/

app.get("/", (req, res) => res.redirect(`/${BASE_URL}`));
app.use(`/${BASE_URL}`, indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(Sentry.Handlers.errorHandler());
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
