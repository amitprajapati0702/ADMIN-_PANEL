import mongoose from 'mongoose';
import { STATUSES } from '../../common/enumConstants.js';

const GeneralSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, trim: true },
  value: { type: mongoose.Mixed, trim: true },
  status: { type: Number, enum: Object.values(STATUSES), default: 1 },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false }
}, { timestamps: true },
);

//adding indexes on model
GeneralSettingsSchema.index({ key: 1 }, { background: true });

const GeneralSettings = mongoose.model('GeneralSettings', GeneralSettingsSchema);

export default GeneralSettings;
/*
db.generalsettings.insertMany([
  {
     key: "frontBgImage",
     value: "",
     status:1
   },
   {
     key: "allowJoinEmail",
     value: "",
     status:1
   },
    {
     key: "prizeDistributionCron",
     value: "",
     status:1
   },
   {
     key: "minDepositeAmt",
     value: "",
     status:1
   },
    {
     key: "maxDepositeAmt",
     value: "",
     status:1
   },
    {
     key: "minWithdrawalAmt",
     value: "",
     status:1
   },
    {
     key: "maxWithdrawalAmt",
     value: "",
     status:1
   },
    {
     key: "referralsMultiplier",
     value: "",
     status:1
   },
   {
     key: "directDepositeMultiplier",
     value: "",
     status:1
   },
    {
     key: "dealPromosMultiplier",
     value: "",
     status:1
   },
    {
     key: "claimBonusMultiplier",
     value: "",
     status:1
   },
]
 */