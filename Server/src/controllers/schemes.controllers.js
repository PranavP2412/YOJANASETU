import { Scheme } from "../models/schemes.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { UserInfo } from "../models/userInfo.models.js";


const getSchemes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = 12; 
    const skip = (page - 1) * limit; 
    const searchQuery = req.query.search || "";

    const filter = {};

    if (searchQuery) {
        filter.$or = [
            { schemeName: { $regex: searchQuery, $options: "i" } },
            { sector: { $regex: searchQuery, $options: "i" } },
            { schemeType: { $regex: searchQuery, $options: "i" } }
        ];
    }

    const [schemes, totalSchemes] = await Promise.all([
        Scheme.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Scheme.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalSchemes / limit);

    return res.status(200).json(
        new ApiResponse(200, {
            schemes,
            pagination: {
                totalSchemes,
                totalPages,
                currentPage: page,
                limit
            }
        }, "Schemes fetched successfully")
    );
});

const schemeDetail = asyncHandler(async (req, res) => {
    // Even in a POST request, we can read from URL params if the URL is /schemes/:id
    const _id = req.params.id; 
    const userId = req.user?._id;

    const scheme = await Scheme.findById(_id);

    if (!scheme) {
        throw new ApiError(404, "Scheme was not found!");
    }

    // Check if bookmarked (so the button shows the correct state)
    let isBookmarked = false;
    if (userId) {
        const userProfile = await UserInfo.findOne({ userId });
        if (userProfile && userProfile.bookmarks.includes(_id)) {
            isBookmarked = true;
        }
    }

    // Convert to object and append isBookmarked
    const responseData = {
        ...scheme.toObject(),
        isBookmarked
    };

    return res.status(200).json(
        new ApiResponse(200, responseData, "Scheme details fetched successfully!")
    );
})
const bookmarkScheme = asyncHandler(async (req, res) => {
    const { schemeId } = req.body; // Getting ID from body
    const userId = req.user._id;

    if (!schemeId) {
        throw new ApiError(400, "Scheme ID is required");
    }

    const userProfile = await UserInfo.findOne({ userId });

    if (!userProfile) {
        throw new ApiError(404, "User profile not found");
    }

    // Toggle the bookmark using the method we added to your Model
    const updatedBookmarks = await userProfile.toggleBookmark(schemeId);
    
    // Check state for the response message
    const isBookmarked = updatedBookmarks.includes(schemeId);

    return res.status(200).json(
        new ApiResponse(200, { bookmarks: updatedBookmarks, isBookmarked }, 
        isBookmarked ? "Added to bookmarks" : "Removed from bookmarks")
    );
});

export { getSchemes, schemeDetail,bookmarkScheme };