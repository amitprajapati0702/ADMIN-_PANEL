import mongoose from 'mongoose';
import { APPROVAL_STATUS, GENDER_TYPES, STATUSES, YES_NO_TYPE } from '../../common/enumConstants.js';

const pancardSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    number: { type: String, trim: true },
    imageFront: { type: String, trim: true },
    pdf: { type: String, trim: true },
    dob: { type: Date },
    isPdf: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isManual: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isDone: { type: Number, enum: Object.values(YES_NO_TYPE) }
}, { _id: false });

const bankInfoSchema = new mongoose.Schema({
    bankName: { type: String, trim: true },
    accountName: { type: String, trim: true },
    accountNo: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    branchName: { type: String, trim: true },
    image: { type: String, trim: true },
    pdf: { type: String, trim: true },
    isPdf: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isManual: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isDone: { type: Number, enum: Object.values(YES_NO_TYPE) }
}, { _id: false });

const aadhaarSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    number: { type: String, trim: true },
    parentName: { type: String, trim: true },
    imageFront: { type: String, trim: true },
    imageBack: { type: String, trim: true },
    pdf: {  type: String, trim: true },
    isPdf: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isManual: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
    isDone: { type: Number, enum: Object.values(YES_NO_TYPE) }
}, { _id: false });
const UserSchema = new mongoose.Schema({
    username: { type: String, required: false, default: "", trim: true },
    image: { type: String, required: false, trim: true, default: "" },
    email: { type: String, lowercase: true , required: false, default: "", trim: true },
    phone: { type: String, required: true, trim: true },
    dob: { type: Date, required: false, default: null },
    gender: { type: String, enum: Object.values(GENDER_TYPES), required: false, trim: true, default: "male" },
    mobileToken: { type: String },
    mkey: { type: String, required: false, trim: true, default: "" },
    msalt: { type: String, required: false, trim: true, default: "" },
    otpData: {
        otp: { type: String, required: false },
        isActive: { type: Number, enum: Object.values(STATUSES), default: 0 },
        otpExpiresAt: { type: Date, default: null, required: false },
        isEmail: { type: Number, enum: Object.values(STATUSES), default: 0 }
    },
    referralCode: { type: String, required: true, trim: true, default: "" },
    usersReferralCode: { type: String, trim: true, default: "" },
    gradeLevel:{
        gradelevelId: { type: Number, required: false, default: 0 },
        isClaimed:{ type: Number, required: false, default: 0 },
        upgradeDateTime:{ type: Date,required:false},
        upgradeCondition:{ type: Date, required:false},
        validUpto:{ type: Date,required:false},
    },
    bonusEarned : { type: Number, required: true, default: 0 },
    spinRuns:{ type : Number, required: false, default: 0},
    addressInfo: { type: String, required: false, trim: true, default: "" },
    country: { type: String, required: false, trim: true, default: "" },
    state: { type: String, required: false, trim: true, default: "" },
    city: { type: String, required: false, trim: true, default: "" },
    pincode: { type: Number, required: false, trim: true, default: 0 },
    aadharInfo: { type: aadhaarSchema },
    pancardInfo: { type: pancardSchema },
    bankInfo: { type: bankInfoSchema },
    verifyAadhar: {
        isVerified: { type: Number, enum: Object.values(APPROVAL_STATUS), required: true, default: 0 },
        reason: { type: String, trim: true }
    },
    verifyPhone: { type: Number, enum: Object.values(YES_NO_TYPE), required: true, default: 0 },
    verifyEmail: {
        isVerified: { type: Number, enum: Object.values(APPROVAL_STATUS), required: false, default: 0 },
        reason: { type: String, trim: true },
        isManual: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
        isDone: { type: Number, enum: Object.values(YES_NO_TYPE) }
    },
    verifyPan: {
        isVerified: { type: Number, enum: Object.values(APPROVAL_STATUS), required: true, default: 0 },
        reason: { type: String, trim: true }
    },
    verifyBankInfo: {
        isVerified: { type: Number, enum: Object.values(APPROVAL_STATUS), required: true, default: 0 },
        reason: { type: String, trim: true }
    },
    is2FA: { type: Number, enum: Object.values(YES_NO_TYPE), required: false },
    password: { type: String, trim: true },
    noOfWrongAttempts: { type: Number },
    forcePwdChangeFlag: { type: Number, enum: Object.values(YES_NO_TYPE), required: true, default: 0 },
    isBlocked: {
        blockWithdrawal: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
        blockUser: { type: Number, enum: Object.values(YES_NO_TYPE), default: 0 },
        reason: { type: String, trim: true }
    },
    allowAddressUpdate: { type: Number, enum: Object.values(YES_NO_TYPE), default: 1 },
    status: { type: Number, enum: Object.values(STATUSES), default: 1, required: true },
    isFirstDeposit: { type: Number, enum: Object.values(YES_NO_TYPE), required: true, default: 0 },
    lastLoggedIn: { type: Date, required: false, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
    deletedAt: { type: Date, default: null, required: false },
}, { timestamps: true },
);

//adding indexes on model
UserSchema.index({ phone: 1 }, { background: true });
UserSchema.index({ username: 1 }, { background: true });
UserSchema.index({ email: 1 }, { background: true });
UserSchema.index({ gender: 1 }, { gender: true });

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
