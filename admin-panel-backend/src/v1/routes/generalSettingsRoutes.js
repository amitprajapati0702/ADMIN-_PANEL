import express from "express";
import { getGeneralSettings, updateGeneralSettings } from "../controllers/generalSettingsController.js";
import { authenticateBasicAuth, authenticateToken } from "../middleware/authAdmin.js";


const generalSettingsRouter = express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]

generalSettingsRouter.post("/getGeneralSettings", authMiddlewares, getGeneralSettings);
generalSettingsRouter.put("/editGeneralSettings", authMiddlewares, updateGeneralSettings);

export default generalSettingsRouter;