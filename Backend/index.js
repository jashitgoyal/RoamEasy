import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import tourRoute from "./Routes/tours.js";
import userRoute from "./Routes/users.js";
import authRoute from "./Routes/auth.js";
import reviewRoute from "./Routes/reviews.js";
import bookingRoute from "./Routes/bookings.js";

dotenv.config();
const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: "https://roameasy-frontend.onrender.com", // Allow your frontend
  credentials: true,
};

mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    console.log("MongoDB connected failed");
  }
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/roameasy/auth", authRoute);
app.use("/roameasy/tours", tourRoute);
app.use("/roameasy/users", userRoute);
app.use("/roameasy/review", reviewRoute);
app.use("/roameasy/booking", bookingRoute);

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
