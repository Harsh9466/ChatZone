const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routers
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const appRouter = require("./routes");
// Global Middlewares

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 40,
  windowMs: 60 * 1000,
  message: "Too many requests from this IP, please try again after a minute.",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Routes(Middlewares)
app.use("/api/v1", appRouter);
app.get("/", (req, res, next) => {
  res.send("Hello from Server!");
});
app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
