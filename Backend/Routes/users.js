import express from "express";
import {
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../Controllers/userController.js";

import { verifyAdmin, verifyUser } from "../Utils/verifyToken.js";

const router = express.Router();
router.put("/:id", verifyUser, updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getSingleUser);
router.get("/", verifyAdmin, getAllUser);

export default router;
