require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const app = express();
const userRouter = require("./routes/users");
const documentRouter = require("./routes/documents");


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 3600000,
  },
});

app.use(sessionMiddleware);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "server started" });
});

app.use("/user", userRouter);
app.use("/doc", documentRouter);
try {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
} catch (err) {
  console.error("Error starting server:", err);
}

