import { Scheme } from "../models/schemes.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const getSchemes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = 10; 
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

export { getSchemes };