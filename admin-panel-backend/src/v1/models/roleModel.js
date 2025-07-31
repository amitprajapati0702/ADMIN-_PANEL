import mongoose from "mongoose";
import { STATUSES } from "../../common/enumConstants.js";
const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim:true },
    description: { type: String, trim:true },
    access: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    status: { type: Number, enum: Object.values(STATUSES), default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: false },
    deletedAt: { type: Date, default: null, required: false },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
