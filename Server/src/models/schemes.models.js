import mongoose, { Schema } from "mongoose";

const schemeSchema = new Schema({
    schemeName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ministry: {
        type: String,
        default: "Ministry of MSME",
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    benefits: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    applicationLink: {
        type: String,
        default: "https://www.msme.gov.in/"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

schemeSchema.index({ schemeName: 'text', description: 'text', tags: 'text' });

export const Scheme = mongoose.model("Scheme", schemeSchema);