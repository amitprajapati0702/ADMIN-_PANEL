import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById
} from "../controllers/userController.js";
import { authenticateBasicAuth, authenticateToken } from "../middleware/authAdmin.js";

const userRouter = express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]

userRouter.post('/createUser', authMiddlewares, createUser);
userRouter.post('/getAllUsers', authMiddlewares, getAllUsers);
userRouter.post('/getUserById', authMiddlewares, getUserById);

export default userRouter;
