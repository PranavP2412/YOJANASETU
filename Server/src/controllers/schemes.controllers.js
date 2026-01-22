import { Scheme } from "../models/schemes.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getSchemes = asyncHandler(async (req, res) => {
    // 1. Pagination Setup
    const page = parseInt(req.query.page) || 1;  
    const limit = 10; // Strictly 10 items per page
    const skip = (page - 1) * limit; 

    // 2. Fetch Data (No filters, just get everything sorted by newest)
    const [schemes, totalSchemes] = await Promise.all([
        Scheme.find({}) // Empty object {} means "Find All"
            .sort({ createdAt: -1 }) // Newest uploaded first
            .skip(skip)
            .limit(limit),
        Scheme.countDocuments({}) // Count all documents in collection
    ]);

    // 3. Calculate Total Pages
    const totalPages = Math.ceil(totalSchemes / limit);

    // 4. Send Response
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

export { getSchemes };