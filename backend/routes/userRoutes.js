import express from "express";
import {
  authUser,
  registerUser,
  updateUserProfile,
  getAllProfiles,
  getProfileById
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/profile").post(protect, updateUserProfile);
router.route("/getAllProfile").get(protect, getAllProfiles);
router.route("/getProfileById").get(protect, getProfileById);

export default router;
