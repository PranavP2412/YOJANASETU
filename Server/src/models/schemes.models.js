import mongoose, { Schema } from "mongoose";

const schemeSchema = new Schema({
    schemeName: {
        type: String,
        required: true,
        unique: true, // Prevents duplicate schemes
        trim: true
    },
    ministry: {
        type: String,
        default: "Ministry of MSME",
        trim: true
    },
    category: {
        type: String, // e.g., "Credit", "Infrastructure", "Technology"
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
        type: [String], // Array of strings for easy searching (e.g. ["Loan", "Startup"])
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

// Indexing for faster search performance
schemeSchema.index({ schemeName: 'text', description: 'text', tags: 'text' });

export const Scheme = mongoose.model("Scheme", schemeSchema);