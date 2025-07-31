import mongoose from "mongoose";
import { BANNER_TYPES, STATUSES, LOBBY_BANNER_TYPES, LOBBY_GAME_TYPES } from "../../common/enumConstants.js";

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    targetLink: { type: String, required: false, trim: true },
    image: { type: String, required: true, trim: true }, //we will upload on AWS S3
    type: { type: String, enum: Object.values(BANNER_TYPES), required: true },
    status: { type: Number, enum: Object.values(STATUSES), default: 1, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: false },
    deletedAt: { type: Date, default: null, required: false },
  },
  { timestamps: true }
);

const BannerModel = mongoose.model("Banner", BannerSchema);

export default BannerModel;
