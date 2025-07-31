import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;
import bcrypt from "bcrypt";
import { STATUSES, YES_NO_TYPE } from "../../common/enumConstants.js";

const adminSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    nickName: { type: String, required: false, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    countryId: { type: Number, default: null, required: false },
    phone: { type: String, required: true, trim: true },
    password: { type: String, set: (val) => bcrypt.hashSync(val, 10), required: true },
    address: { type: String, required: false },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    isHead: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0, required: false },
    onLeave: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0, required: false },
    loginAllowed: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1, required: false },
    status: { type: Number, enum: Object.values(STATUSES), default: 1 },
    smsNotification: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1, required: false },
    emailNotification: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1, required: false },
    whatsappNotification: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1, required: false },
    forcePwdChangeFlag: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1, required: false },
    forgetPassword: {
      code: { type: String, required: false },
      isActive: { type: Number, enum: Object.values(STATUSES), default: 0 },
      isCodeVerified: { type: Number, enum: Object.values(STATUSES), default: 0 },
      otpExpiresAt: { type: Date, default: null, required: false }
    },
    pwdExpiryDate: { type: Date, default: null, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: false },
    deletedAt: { type: Date, default: null, required: false },
  },
  { timestamps: true }
);

adminSchema.methods.generateJWT = function (extraFields = {}) {
  let payload = {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    roleId: this.roleId._id,
  };

  Object.assign(payload, extraFields);
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4d" });
  return token;
};

adminSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//adding indexes on model
adminSchema.index({ email: 1 }, { background: true });
adminSchema.index({ status: 1 }, { background: true });
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
