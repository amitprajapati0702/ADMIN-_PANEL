import express from "express";
import { createBanner, getAllBanner, updateBanner, getBannerById, updateBannerStatus, softDeleteBanner} from "../controllers/bannerController.js";
 import {authenticateBasicAuth, authenticateToken} from "../middleware/authAdmin.js";


const bannerRouter =  express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]


bannerRouter.post("/addBanner", authMiddlewares, createBanner);
bannerRouter.post("/getAllBanner", authMiddlewares, getAllBanner);
bannerRouter.post("/getBannerById", authMiddlewares, getBannerById);
bannerRouter.put("/editBanner", authMiddlewares, updateBanner);
bannerRouter.put("/changeBannerStatus", authMiddlewares, updateBannerStatus);
bannerRouter.put("/deleteBanner", authMiddlewares, softDeleteBanner);

export default bannerRouter;
