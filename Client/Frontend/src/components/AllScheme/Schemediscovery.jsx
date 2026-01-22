import { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import SchemeCard from "../schemes/SchemeCard";

const SchemeDiscovery = () => {
    // 1. We use the static data immediately (no loading state needed for static data)
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // --- 15 REAL SCHEMES DATA (Static Database) ---
    const schemesData = [
        {
            _id: 1,
            title: "Prime Minister's Employment Generation Programme (PMEGP)",
            ministry: "Ministry of MSME",
            description: "Credit-linked subsidy scheme for setting up new micro-enterprises in non-farm sector.",
            tags: ["Subsidy", "Manufacturing", "Service"],
            benefit: "Up to 35% Subsidy",
            category: "Manufacturing",
            deadline: "Open"
        },
        {
            _id: 2,
            title: "CGTMSE Scheme",
            ministry: "Ministry of MSME",
            description: "Collateral-free credit to the Micro and Small Enterprise sector.",
            tags: ["Loan", "No Collateral", "Guarantee"],
            benefit: "Cover up to ₹5 Crore",
            category: "Finance",
            deadline: "Open"
        },
        {
            _id: 3,
            title: "Pradhan Mantri Mudra Yojana (PMMY)",
            ministry: "Ministry of Finance",
            description: "Loans up to 10 Lakhs to non-corporate, non-farm small/micro enterprises.",
            tags: ["Loan", "Small Business"],
            benefit: "Loans up to ₹10 Lakhs",
            category: "Finance",
            deadline: "2025-12-31"
        },
        {
            _id: 4,
            title: "Stand-Up India Scheme",
            ministry: "Ministry of Finance",
            description: "Bank loans between 10 lakh and 1 Crore to SC/ST or Women borrowers.",
            tags: ["Loan", "SC/ST", "Women"],
            benefit: "Loans from ₹10L - ₹1 Cr",
            category: "Social Welfare",
            deadline: "Open"
        },
        {
            _id: 5,
            title: "PM Formalisation of Micro Food Processing (PMFME)",
            ministry: "Ministry of Food Processing",
            description: "Support for upgradation of micro food processing enterprises.",
            tags: ["Subsidy", "Food Processing"],
            benefit: "35% Credit Linked Subsidy",
            category: "Agriculture",
            deadline: "2025-03-31"
        },
        {
            _id: 6,
            title: "MSME Sustainable (ZED) Certification",
            ministry: "Ministry of MSME",
            description: "Encouraging MSMEs to adopt Zero Defect Zero Effect practices.",
            tags: ["Certification", "Quality"],
            benefit: "80% Subsidy on Cert.",
            category: "Manufacturing",
            deadline: "Open"
        },
        {
            _id: 7,
            title: "Market Development Assistance (MDA)",
            ministry: "Ministry of Commerce",
            description: "Financial assistance for exporters for export promotion activities.",
            tags: ["Export", "Marketing"],
            benefit: "Financial Assistance",
            category: "Trade",
            deadline: "Yearly"
        },
        {
            _id: 8,
            title: "Startup India Seed Fund Scheme",
            ministry: "DPIIT",
            description: "Financial assistance to startups for proof of concept and prototypes.",
            tags: ["Startup", "Seed Funding"],
            benefit: "Up to ₹20 Lakhs Grant",
            category: "Startup",
            deadline: "Open"
        },
        {
            _id: 9,
            title: "Production Linked Incentive (PLI)",
            ministry: "Multiple Ministries",
            description: "Incentives to companies for enhancing their domestic manufacturing.",
            tags: ["Incentive", "Manufacturing"],
            benefit: "4-6% Incentive on Sales",
            category: "Manufacturing",
            deadline: "Varies"
        },
        {
            _id: 10,
            title: "Skill India - PMKVY 4.0",
            ministry: "Skill Development",
            description: "Skill certification scheme to enable Indian youth to take up training.",
            tags: ["Training", "Skill"],
            benefit: "Free Certification",
            category: "Education",
            deadline: "Open"
        },
        {
            _id: 11,
            title: "Agri-Clinics & Agri-Business Centres",
            ministry: "Ministry of Agriculture",
            description: "Supplementary extension services to farmers and employment.",
            tags: ["Agriculture", "Self-employment"],
            benefit: "36-44% Subsidy",
            category: "Agriculture",
            deadline: "Open"
        },
        {
            _id: 12,
            title: "TREAD Scheme for Women",
            ministry: "Ministry of MSME",
            description: "Trade Related Entrepreneurship Assistance and Development for women.",
            tags: ["Women", "NGO"],
            benefit: "Govt Grant up to 30%",
            category: "Social Welfare",
            deadline: "Open"
        },
        {
            _id: 13,
            title: "CLCSS for Technology Upgradation",
            ministry: "Ministry of MSME",
            description: "Facilitates technology upgradation in MSEs by providing capital subsidy.",
            tags: ["Technology", "Upgrade"],
            benefit: "15% Capital Subsidy",
            category: "Manufacturing",
            deadline: "2025-09-30"
        },
        {
            _id: 14,
            title: "SFURTI Scheme",
            ministry: "Ministry of MSME",
            description: "Regeneration of Traditional Industries to organize artisans.",
            tags: ["Traditional", "Artisans"],
            benefit: "Up to ₹5 Crore Support",
            category: "Rural Dev",
            deadline: "Open"
        },
        {
            _id: 15,
            title: "ASPIRE Scheme",
            ministry: "Ministry of MSME",
            description: "Promotion of Innovation, Rural Industries and Entrepreneurship.",
            tags: ["Innovation", "Rural"],
            benefit: "Incubator Support",
            category: "Startup",
            deadline: "Open"
        }
    ];

    // Filter Logic
    const filteredSchemes = schemesData.filter(scheme => {
        const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "All" || scheme.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header (Kept exactly as you designed) */}
            <div className="bg-blue-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Government Schemes</h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Search through our verified database of grants, loans, and subsidies.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-2xl mx-auto relative flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for 'Solar', 'Women', or 'Subsidy'..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none"
                            />
                            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                        </div>

                        {/* Added Category Dropdown next to search for better UX */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full md:w-48 px-4 py-4 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 outline-none bg-white cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Finance">Finance</option>
                            <option value="Agriculture">Agriculture</option>
                            <option value="Startup">Startup</option>
                            <option value="Social Welfare">Social Welfare</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-4 -mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {filteredSchemes.length} Schemes Found
                        </h2>
                        {/* Visual Filter Indicator */}
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Filter className="h-4 w-4" />
                            <span>Showing: {filterCategory}</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchemes.length > 0 ? (
                            filteredSchemes.map((scheme) => (
                                /* IMPORTANT: We pass 'data' props if your card expects 'data', 
                                   or 'scheme' if it expects 'scheme'. I'll pass both to be safe. */
                                <SchemeCard key={scheme._id} scheme={scheme} data={scheme} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-lg">No schemes found matching your criteria.</p>
                                <button
                                    onClick={() => { setSearchTerm(""); setFilterCategory("All"); }}
                                    className="mt-4 text-blue-600 font-bold hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeDiscovery;