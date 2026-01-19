import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="bg-white flex-grow flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Government Grants, <span className="text-blue-600">Simplified.</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Yojanasetu uses AI to match your business with the perfect government schemes.
                        Stop searching, start applying.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/schemes" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center gap-2">
                            Find Schemes <Search className="h-5 w-5" />
                        </Link>
                        <Link to="/login" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 font-bold rounded-full hover:bg-gray-50 transition">
                            Business Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="bg-gray-50 py-20 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Search className="h-8 w-8 text-blue-600" />}
                        title="Smart Discovery"
                        desc="Our AI scans thousands of schemes to find the ones that match your business profile."
                    />
                    <FeatureCard
                        icon={<Zap className="h-8 w-8 text-amber-500" />}
                        title="Instant Eligibility"
                        desc="Know immediately if you qualify. No more reading 50-page PDF documents."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-8 w-8 text-emerald-600" />}
                        title="Drafting Assistant"
                        desc="Let our AI write your proposal letters and organize your documents."
                    />
                </div>
            </section>
        </div>
    );
};

// Helper component for this page only
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;