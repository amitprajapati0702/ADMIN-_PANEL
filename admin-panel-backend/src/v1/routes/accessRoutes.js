import express from "express";
import {
  createRole,
  getAllPermissions,
  getAllRoles,
  updateRole,
  updateRoleStatus,
  createPermission,
  getRoleById,
  softDeleteRole,
  softDeletePermission,
} from "../controllers/accessController.js";
 import {authenticateBasicAuth, authenticateToken} from "../middleware/authAdmin.js";


const accessRouter =  express.Router();
const authMiddlewares = [authenticateBasicAuth, authenticateToken]

accessRouter.post("/addRole", authMiddlewares, createRole);
accessRouter.post("/getAllRoles", authMiddlewares, getAllRoles);
accessRouter.post("/getRoleById", authMiddlewares, getRoleById);
accessRouter.put("/deleteRole", authMiddlewares, softDeleteRole);

accessRouter.post("/addPermission", authMiddlewares, createPermission);
accessRouter.get("/getAllPermissions", authMiddlewares, getAllPermissions);
accessRouter.put("/deletePermission", authMiddlewares, softDeletePermission);
accessRouter.put("/editRole", authMiddlewares, updateRole);
accessRouter.put("/changeRoleStatus", authMiddlewares, updateRoleStatus);

export default accessRouter;
