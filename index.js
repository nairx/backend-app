import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { authenticateAdmin,authenticateUser } from "./middleware/auth.js";
import dbConnect from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import storeRouter from "./routes/storeRoute.js";
import homeRouter from "./routes/homeRoute.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import seedAdmin from "./config/seedAdmin.js";

const app = express();
app.use(cors());
dotenv.config();
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "views");
app.set("layout", "layout");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/auth", authRouter);
app.use("/store", storeRouter);
app.use("/orders",authenticateUser,orderRouter)
app.use("/", authenticateAdmin, homeRouter);
app.use("/products", authenticateAdmin, productRouter);
app.use("/users", authenticateAdmin, userRouter);


const startServer = async () => {
  await dbConnect();
  await seedAdmin();
  app.listen(5000, () => {
    console.log("Server Started");
  });
};

startServer();
