import { Link } from 'react-router-dom';
// FIX 1: Added 'Tag' to the import list
import { ArrowRight, Building2, UserCheck, Clock, Tag } from 'lucide-react';

const SchemeCard = ({ scheme, data }) => {
    // Safety check: ensure item exists
    const item = scheme || data || {};

    return (
        <div className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200 border-t-4 border-t-blue-700 transition-all duration-300 overflow-hidden relative">

            {/* 1. Header: Ministry & Status */}
            <div className="px-6 pt-5 flex justify-between items-start">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" />
                    {item.ministry || "Ministry of MSME"}
                </div>

                <div className="flex gap-2">
                    {/* Status Badge */}
                    <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${!item.deadline || item.deadline === 'Open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {!item.deadline || item.deadline === 'Open' ? (
                            <><span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" /> Active</>
                        ) : (
                            <><Clock className="h-3 w-3" /> Ends {new Date(item.deadline).toLocaleDateString()}</>
                        )}
                    </div>

                    {/* Category Tag */}
                    {item.category && (
                        <div className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Tag className="h-3 w-3" /> {item.category}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Main Content */}
            <div className="px-6 py-4 flex-grow flex flex-col">

                {/* Title - FIX 2: Use item.schemeName */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                    {item.schemeName}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                    {item.description}
                </p>

                {/* --- IMPROVED ELIGIBILITY SECTION --- */}
                <div className="mt-auto bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 relative overflow-hidden">
                    {/* Decorative Background Icon */}
                    <UserCheck className="absolute -right-2 -bottom-2 h-12 w-12 text-blue-100 opacity-50 rotate-12" />

                    <div className="relative z-10">
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <UserCheck className="h-3.5 w-3.5" /> Who can apply?
                        </p>
                        <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2">
                            {/* Uses eligibility field from DB */}
                            {item.eligibility || "Check details for eligibility criteria."}
                        </p>
                    </div>
                </div>

                {/* Tags (Minimalist Grey) */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {item.tags && item.tags.length > 0 && item.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600 uppercase tracking-wide"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 3. Footer Action */}
            <div className="p-6 pt-0">
                {/* Note: This links to an internal page. Ensure you have a route for /scheme/:id */}
                <Link
                    to={`/scheme/${item._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-100 font-bold py-3 rounded-xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group/btn"
                >
                    View Scheme Details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default SchemeCard;