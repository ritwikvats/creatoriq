import Link from "next/link";
import { BarChart3, TrendingUp, DollarSign, FileText, Youtube, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="border-b border-dark-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-8 h-8 text-primary-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                CreatorIQ
                            </span>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-dark-700 hover:text-dark-900 font-medium transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-primary-500/50 transition-all"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="text-center animate-fade-in">
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
                        All Your Creator Analytics
                        <br />
                        In One Place
                    </h1>
                    <p className="text-xl lg:text-2xl text-dark-600 mb-12 max-w-3xl mx-auto">
                        Stop switching between platforms. Track YouTube, Instagram, LinkedIn & X analytics, revenue, and brand deals—all in one unified dashboard.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all transform hover:scale-105"
                        >
                            Start Free Trial
                        </Link>
                        <Link
                            href="#features"
                            className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-all"
                        >
                            See Features
                        </Link>
                    </div>

                    {/* Platform Icons */}
                    <div className="mt-16 flex gap-8 justify-center items-center opacity-60">
                        <Youtube className="w-10 h-10" />
                        <Instagram className="w-10 h-10" />
                        <Linkedin className="w-10 h-10" />
                        <Twitter className="w-10 h-10" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-dark-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Everything You Need to Grow
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <BarChart3 className="w-12 h-12 text-primary-600" />,
                                title: "Unified Dashboard",
                                description: "All platforms in one view. Compare performance across YouTube, Instagram, and more.",
                            },
                            {
                                icon: <TrendingUp className="w-12 h-12 text-primary-600" />,
                                title: "Unlimited History",
                                description: "No 90-day limit. Keep all your analytics data forever and track long-term trends.",
                            },
                            {
                                icon: <DollarSign className="w-12 h-12 text-primary-600" />,
                                title: "Revenue Tracking",
                                description: "Track AdSense, brand deals, and affiliates. See your total monthly income across all sources.",
                            },
                            {
                                icon: <FileText className="w-12 h-12 text-primary-600" />,
                                title: "India Tax Tools",
                                description: "Auto-generate Form 26AS, GST calculations, and TDS tracking for hassle-free tax filing.",
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-dark-100"
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-dark-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Simplify Your Creator Business?
                    </h2>
                    <p className="text-xl text-dark-600 mb-8">
                        Join thousands of creators who save 10+ hours per month with CreatorIQ.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-primary-500/50 transition-all transform hover:scale-105"
                    >
                        Start Your Free Trial
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-dark-200 bg-dark-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-dark-600">
                    <p>© 2026 CreatorIQ. Built with conviction 🚀</p>
                </div>
            </footer>
        </div>
    );
}
