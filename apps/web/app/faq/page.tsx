'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

const faqs = [
    {
        q: 'What is CreatorIQ?',
        a: 'CreatorIQ is a unified analytics dashboard for content creators. It brings together YouTube, Instagram, revenue tracking, tax calculations, and brand deal management into one platform designed for Indian creators.',
    },
    {
        q: 'Is CreatorIQ free to use?',
        a: 'Yes, CreatorIQ is currently free to use. We may introduce premium features in the future, but we will notify all users 30 days before any pricing changes.',
    },
    {
        q: 'What platforms does CreatorIQ support?',
        a: 'Currently, CreatorIQ supports YouTube and Instagram analytics. We plan to add support for LinkedIn, Twitter/X, and other platforms in the future.',
    },
    {
        q: 'How do I connect my YouTube account?',
        a: 'Go to your Dashboard and click "Connect YouTube". You will be redirected to Google to authorize CreatorIQ to read your channel analytics. We only request read-only access and will never post or modify anything on your channel.',
    },
    {
        q: 'How do I connect my Instagram account?',
        a: 'Go to your Dashboard and click "Connect Instagram". You need an Instagram Business or Creator account linked to a Facebook Page. You will be redirected to Facebook to authorize access.',
    },
    {
        q: 'What data does CreatorIQ access?',
        a: 'We only access read-only analytics data: subscriber/follower counts, video/post performance metrics, engagement rates, and estimated revenue. We never access your DMs, post on your behalf, or modify your account in any way.',
    },
    {
        q: 'How are my access tokens stored?',
        a: 'All platform access tokens are encrypted using AES-256-GCM encryption before being stored in our database. We follow industry-standard security practices to protect your data.',
    },
    {
        q: 'Can I disconnect my accounts?',
        a: 'Yes, you can disconnect YouTube or Instagram at any time from your Dashboard. When disconnected, we delete the stored access tokens immediately.',
    },
    {
        q: 'How do AI-Powered Insights work?',
        a: 'CreatorIQ uses GPT-5.2 to analyze your real platform data — subscribers, views, engagement rates, revenue, and audience demographics. The AI compares your metrics against industry benchmarks and generates personalized recommendations like optimal posting times, content strategy tips, audience growth tactics, and revenue optimization ideas. Insights are refreshed each time you visit your dashboard, so they always reflect your latest performance.',
    },
    {
        q: 'What AI model powers CreatorIQ?',
        a: 'We use GPT-5.2 as our primary AI model, with Llama 3.3 as a fallback for reliability. The AI is used for analytics insights, content recommendations, tax estimation guidance, and brand deal suggestions. All AI-generated content is clearly labeled, and we recommend verifying any financial advice with a professional.',
    },
    {
        q: 'How does the tax calculator work?',
        a: 'Our AI-powered tax calculator takes your revenue entries (YouTube AdSense, brand deals, sponsorships, etc.) and uses Indian tax rules to estimate your GST liability, TDS deductions, advance tax requirements, and net income. The AI also suggests tax-saving strategies specific to content creators, like Section 44ADA presumptive taxation and eligible deductions. This is for estimation only — always consult a qualified Chartered Accountant (CA) for official tax filings.',
    },
    {
        q: 'Is the tax calculation accurate?',
        a: 'Our calculations are based on the latest Indian tax rules and are updated regularly. The AI cross-checks rates and thresholds, but these are estimates for informational purposes only. Tax laws can change, and individual circumstances vary. Always verify with a CA before filing.',
    },
    {
        q: 'How do Brand Deals work on CreatorIQ?',
        a: 'The Brand Deals feature helps you manage your sponsorship pipeline end-to-end. You can track deals through stages (Lead, Negotiation, Contracted, In Progress, Completed, Paid) using a Kanban board. Add deal details like brand name, amount, deliverables, and deadlines. The AI analyzes your engagement metrics and audience demographics to suggest fair pricing for sponsorships and help you negotiate better rates.',
    },
    {
        q: 'How do I delete my account?',
        a: 'You can delete your account from Settings. When you delete your account, all your data (analytics, revenue entries, connected platforms) is permanently removed within 30 days.',
    },
    {
        q: 'How do I export my data?',
        a: 'You can export your revenue data as CSV from the Revenue page using the "Export CSV" button. PDF tax reports can be generated from the Tax Dashboard.',
    },
    {
        q: 'Who can I contact for support?',
        a: 'Email us at support@creatoriq.com for any questions or issues. We typically respond within 24 hours.',
    },
];

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <BarChart3 className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                CreatorIQ
                            </span>
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                                Login
                            </Link>
                            <Link href="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-600 mb-10">Everything you need to know about CreatorIQ.</p>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 group">
                            <summary className="px-6 py-5 cursor-pointer font-semibold text-gray-900 hover:text-blue-600 transition-colors list-none flex justify-between items-center">
                                {faq.q}
                                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Still have questions?</h2>
                    <p className="text-blue-700 mb-4">We're here to help. Reach out to our support team.</p>
                    <a href="mailto:support@creatoriq.com" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                        Contact Support
                    </a>
                </div>

                <div className="mt-8 flex gap-6 justify-center text-sm text-gray-500">
                    <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                </div>
            </div>
        </div>
    );
}
