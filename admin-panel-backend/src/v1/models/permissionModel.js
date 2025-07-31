import mongoose from "mongoose";
import { STATUSES } from "../../common/enumConstants.js";
const Schema = mongoose.Schema;

const permissionSchema = new Schema(
  {
    pid: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim:true},
    codename: { type: String, unique: true, required: true, trim:true },
    parentId: { type: Number, default: 0 },
    status: { type: Number, enum: Object.values(STATUSES), default: 1 }
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;

/*
db.permissions.insertMany([
  {
     pid: 1,
     name: 'Staff',
     codename: 'staff',
     parentId: 0,
     status: 1
   },
   {
     pid: 2,
     name: 'Add',
     codename: 'staff_add',
     parentId: 1,
     status: 1
   },
   {
     pid: 3,
     name: 'Edit',
     codename: 'staff_edit',
     parentId: 1,
     status: 1
   },
   {
     pid: 4,
     name: 'View',
     codename: 'staff_view',
     parentId: 1,
     status: 1
   },
   {
     pid: 5,
     name: 'Status',
     codename: 'staff_status',
     parentId: 1,
     status: 1
   },
   {
     pid: 6,
     name: 'Delete',
     codename: 'staff_delete',
     parentId: 1,
     status: 1
   }        
  
 ]);
 
 */