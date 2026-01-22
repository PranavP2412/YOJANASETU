import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ["General", "SC", "ST", "OBC", "Minority"],
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    sector: {
        type: String,
        enum: ["Manufacturing", "Service", "Trading", "Agriculture"],
        required: true
    },
    stage: {
        type: String,
        enum: ["Idea/Prototype", "Startup", "Existing Business"],
        required: true
    },
    turnover: {
        type: Number,
        default: 0
    },
    needs: {
        type: [String],
        enum: ["Loan", "Subsidy", "Training", "Exhibition", "Certification", "Infrastructure", "Technology"],
        default: []
    }

}, {
    timestamps: true
});

export const UserInfo = mongoose.model("UserInfo", userInfoSchema);