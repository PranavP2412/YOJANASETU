import { Calendar, CheckCircle, ArrowRight, Building2 } from 'lucide-react';

const SchemeCard = ({ scheme }) => {
    return (
        <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {scheme.ministry || "Ministry of MSME"}
                </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {scheme.title}
            </h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                {scheme.description}
            </p>

            {/* The Hook (Green Box) */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-emerald-800">
                        {scheme.simplifiedDescription || "Benefits include financial assistance and subsidies."}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : "Ongoing"}
                </div>
                <a
                    href={scheme.applicationUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm font-semibold flex items-center hover:gap-2 transition-all"
                >
                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                </a>
            </div>
        </div>
    );
};

export default SchemeCard;