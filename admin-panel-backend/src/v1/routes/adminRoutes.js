import express from "express";
import {
  createAdmin,
  getAdminById,
  getAllAdmin,
  loginAdmin,
  updateAdmin,
  updatePassword,
  resetPassword,
  updateAdminStatus,
  generateForgetPwdCode,
  verifyCode,
  softDeleteAdmin,
  forgetPassword,
  updateAdminProfile,
  updateStaffPassword,
  forceUpdatePassword,
  getAdminProfile
} from "../controllers/adminController.js";
import { authenticateBasicAuth, authenticateToken } from "../middleware/authAdmin.js";

const adminRouter = express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]

adminRouter.post("/addStaff", authMiddlewares, createAdmin);
adminRouter.post("/loginStaff", authenticateBasicAuth, loginAdmin);
adminRouter.put("/editStaff", authMiddlewares, updateAdmin);
adminRouter.post("/getAllStaff", authMiddlewares, getAllAdmin);
adminRouter.post("/getStaffById", authMiddlewares, getAdminById);
adminRouter.put("/updatePassword", authMiddlewares, updatePassword);
adminRouter.put("/forceUpdatePassword", authenticateBasicAuth, forceUpdatePassword);
adminRouter.put("/updateStaffPassword", authMiddlewares, updateStaffPassword);
adminRouter.put("/resetPassword", authMiddlewares, resetPassword);
adminRouter.post("/generateForgetPwdCode", authenticateBasicAuth, generateForgetPwdCode);
adminRouter.put("/verifyPwdCode", authenticateBasicAuth, verifyCode);
adminRouter.put("/forgetPassword", authenticateBasicAuth, forgetPassword)
adminRouter.put('/changeStaffStatus', authMiddlewares, updateAdminStatus)
adminRouter.put("/deleteStaff", authMiddlewares, softDeleteAdmin);
adminRouter.put('/updateAdminProfile', authMiddlewares, updateAdminProfile);
adminRouter.post('/getAdminProfile', authMiddlewares, getAdminProfile);

export default adminRouter;
