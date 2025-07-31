import express from 'express';
import { authenticateBasicAuth, authenticateToken } from "../middleware/authAdmin.js";

const dashboardRouter = express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]

export default dashboardRouter;