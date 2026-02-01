import { Github, Linkedin, Mail, Globe, Code2, Database } from 'lucide-react';

// You don't need to import images if they are in the 'public' folder
const AboutPage = () => {

    const teamMembers = [
        {
            id: 1,
            name: "Pranav Patil",
            role: "Full Stack Developer",
            bio: "Passionate about building scalable web applications and solving real-world problems with code.",
            // FIX 1: Use the string path (Ensure Pranav.jpg is in the 'public' folder)
            image: "/Pranav.jpeg",
            links: {
                github: "https://github.com/PranavPW2412",
                linkedin: "https://www.linkedin.com/in/pranav-patil-3106ab1b1/",
                email: "mailto:pranavpatil24126@email.com",
                portfolio: "https://yourportfolio.com"
            }
        },
        {
            id: 2,
            name: "Krish Ahirkar",
            role: "Full stack Developer",
            bio: "Creative developer focused on crafting beautiful user experiences and intuitive interfaces.",
            image: "/Krish_.jpeg",
            links: {
                github: "https://github.com/krishahirkar",
                linkedin: "https://www.linkedin.com/in/krish-ahirkar-a62b8a334/",
                // FIX 2: Added 'mailto:' so the button actually opens email
                email: "mailto:krishahirkar@email.com",
                portfolio: "https://friendportfolio.com"
            }
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">

            {/* Header Section */}
            <div className="bg-blue-900 py-20 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                    Meet the Builders
                </h1>
                <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                    The minds behind Yojanasetu, dedicated to bridging the gap between businesses and government opportunities.
                </p>
            </div>

            {/* Team Grid */}
            <div className="max-w-6xl mx-auto px-6 -mt-16 pb-20">
                <div className="grid md:grid-cols-2 gap-8 justify-center">

                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col md:flex-row"
                        >
                            {/* Image Section */}
                            <div className="md:w-2/5 bg-blue-50 flex items-center justify-center p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-blue-600/5 opacity-50 blur-xl rounded-full scale-150"></div>
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md relative z-10 object-cover"
                                    // Optional: Add fallback if image fails to load
                                    onError={(e) => { e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + member.name }}
                                />
                            </div>

                            {/* Info Section */}
                            <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                <div className="mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                                    <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide flex items-center gap-2 mt-1">
                                        <Code2 className="h-4 w-4" /> {member.role}
                                    </p>
                                </div>

                                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                                    {member.bio}
                                </p>

                                {/* Social Links */}
                                <div className="flex items-center gap-3">
                                    <SocialLink href={member.links.github} icon={<Github className="h-5 w-5" />} />
                                    <SocialLink href={member.links.linkedin} icon={<Linkedin className="h-5 w-5" />} />
                                    <SocialLink href={member.links.email} icon={<Mail className="h-5 w-5" />} />
                                    <SocialLink href={member.links.portfolio} icon={<Globe className="h-5 w-5" />} />
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                    We built Yojanasetu to solve a simple problem: <span className="text-blue-600 font-semibold">Government schemes are hard to find.</span>
                    Our goal is to use technology to make these resources accessible to every Indian entrepreneur,
                    simplifying the complex landscape of grants and subsidies.
                </p>
            </div>

        </div>
    );
};

// Helper Component for Social Icons
const SocialLink = ({ href, icon }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 border border-gray-200 hover:border-blue-600"
    >
        {icon}
    </a>
);

export default AboutPage;