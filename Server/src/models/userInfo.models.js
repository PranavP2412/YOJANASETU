import mongoose, { Schema } from "mongoose";
import { User } from "./user.models.js";


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
    },
    bookmarks:{
        type: [String],
        default:[]
    },
    recommended:[{
        schemeId: {
            type: Schema.Types.ObjectId,
            ref: "Scheme"
        },
        matchScore: Number,
        reason: String
    }]

}, {
    timestamps: true
});

userInfoSchema.methods.toggleBookmark = async function (schemeId) {
    const idStr = schemeId.toString();
    if (this.bookmarks.includes(idStr)) {
        this.bookmarks = this.bookmarks.filter(id => id !== idStr);
    } else {
        this.bookmarks.push(idStr);
    }

    await this.save();
    
    return this.bookmarks;
};

userInfoSchema.methods.findFeasibleSchemes = async function () {
    const Scheme = mongoose.model("Scheme");

    // We want to find schemes that mention the User's Sector or Needs.
    const searchKeywords = [
        this.sector,      
        this.stage,           
        ...(this.needs || [])
    ].filter(Boolean);

    const regexQueries = searchKeywords.map(keyword => ({
        $or: [
            { tags: { $regex: keyword, $options: "i" } },
            { schemeName: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }, 
            { category: { $regex: keyword, $options: "i" } }    
        ]
    }));

    const query = {
        isActive: true,
        $or: [
            ...regexQueries, 
            { tags: "General" },
            { category: "All" }
        ]
    };

    const candidates = await Scheme.find(query)
        .select('_id schemeName description benefits eligibility tags ministry category')
        .limit(60); 

    if (candidates.length < 5) {
        console.log("Not enough keyword matches, fetching generic active schemes...");
        const genericSchemes = await Scheme.find({ isActive: true })
            .select('_id schemeName description benefits eligibility tags ministry category')
            .limit(30);
        return genericSchemes;
    }

    return candidates;
};

userInfoSchema.methods.recommend = async function (pleaseRecommendFunction) {
    const user = await User.findById(this.userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isRecommended && this.recommended && this.recommended.length > 0) {
        console.log("Returning cached recommendations...");
        return this.recommended;
    }

    console.log("Generating new recommendations with GenAI...");

    const candidates = await this.findFeasibleSchemes();

    if (candidates.length === 0) {
        return [];
    }

    const aiResults = await pleaseRecommendFunction({
        userProfile: {
            turnover: this.turnover,
            needs: this.needs,
            stage: this.stage,
            sector: this.sector,
            gender: this.gender,
            category: this.category
        },
        schemes: candidates
    });

    this.recommended = aiResults; 
    await this.save();

    user.isRecommended = true;
    await user.save({ validateBeforeSave: false });

    return this.recommended;
}


export const UserInfo = mongoose.model("UserInfo", userInfoSchema);