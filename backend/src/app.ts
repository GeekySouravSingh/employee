import express from "express";
import "express-async-errors";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import routes from "./routes";
import { NotFound } from "./errors/not-found";
import { connectDB } from "./db";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const JWT_COOKIE_EXPIRES_IN = Number(process.env.JWT_COOKIE_EXPIRES_IN);

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(morgan("tiny"));
app.use(
  cookieSession({
    signed: false,
    secure: false,
    maxAge: JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  })
);

app.use(routes);

app.all("*", () => {
  throw new NotFound();
});

app.use(errorHandler);

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(String(PORT), () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
