import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Zap, Sparkles, TrendingUp } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
            <section className="relative pt-20 pb-32 lg:pt-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-gradient-to-b from-blue-50 via-sky-50 to-white rounded-b-[50%] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 text-sm font-semibold mb-8 animate-fade-in-up">
                        <Sparkles className="h-4 w-4 text-sky-400 fill-sky-400" />
                        <span>AI-Powered Grant Matching</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                        Find Government Funding, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600">
                            Without the Headache.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
                        Yojanasetu is your smart bridge to government schemes. We scan 1500+ grants to find the ones
                        you actually qualify for—instantly.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/schemes"
                            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Explore Schemes <ArrowRight className="h-5 w-5" />
                        </Link>

                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl shadow-md border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 flex items-center justify-center"
                        >
                            Login Account
                        </Link>
                    </div>
                    <div className="mt-16 mx-auto max-w-4xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl shadow-blue-900/5 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatItem value="100+" label="Active Schemes" />
                        <StatItem value="₹15Cr" label="Grants Unlocked" />
                        <StatItem value="100%" label="Free to Search" />
                        <StatItem value="24/7" label="AI Support" />
                    </div>
                </div>
            </section>
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900">Why Yojanasetu?</h2>
                        <p className="text-slate-500 mt-2 text-lg">We turn complex government documents into simple opportunities.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Search className="h-6 w-6 text-white" />}
                            title="Smart Discovery"
                            desc="Stop scrolling. Our engine filters out irrelevant schemes so you only see what fits your business."
                        />
                        <FeatureCard
                            icon={<Zap className="h-6 w-6 text-white" />}
                            title="Instant Eligibility"
                            desc="We decode the fine print. See your eligibility status in plain English before you apply."
                        />
                        <FeatureCard
                            icon={<TrendingUp className="h-6 w-6 text-white" />}
                            title="Higher Success Rate"
                            desc="Our drafting tools help you write error-free proposals that get approved faster."
                        />
                    </div>
                </div>
            </section>
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-blue-600 rounded-[2.5rem] p-12 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/3 translate-y-1/3 blur-2xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to grow your business?</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                            Join thousands of Indian entrepreneurs who found funding through Yojanasetu today.
                        </p>
                        <Link
                            to="/register"
                            className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                            Get Started for Free
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};


const StatItem = ({ value, label }) => (
    <div className="text-center">
        <p className="text-3xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-cyan-500">
            {value}
        </p>
        <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wide">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 border border-slate-100">
        <div className="inline-block bg-blue-600 p-3 rounded-lg mb-6 shadow-lg shadow-blue-500/30 transform group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;