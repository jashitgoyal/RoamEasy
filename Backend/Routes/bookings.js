import express from "express";
import {
  createBooking,
  getAllBooking,
  getBooking,
  getstripeasync,
  sendBookingDetails,
} from "../Controllers/bookingController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../Utils/verifyToken.js";

const router = express.Router();

router.post("/", createBooking);
router.post("/send-mail", sendBookingDetails);
router.post("/payment-intent", getstripeasync);
router.get("/:id", verifyToken, verifyUser, getBooking);
router.get("/", verifyAdmin, getAllBooking);

export default router;
