'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                        <div className="flex gap-4 text-sm">
                            <Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link>
                            <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
                            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Login</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last updated: February 12, 2026</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">CreatorIQ collects and processes the following information:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Account Information:</strong> Email address, name, and authentication credentials</li>
                            <li><strong>Platform Data:</strong> Analytics from connected YouTube and Instagram accounts</li>
                            <li><strong>Financial Data:</strong> Revenue entries, tax calculations (stored locally)</li>
                            <li><strong>Usage Data:</strong> How you interact with our platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use your information to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide analytics and insights about your content performance</li>
                            <li>Calculate tax liabilities and financial summaries</li>
                            <li>Track brand deals and revenue</li>
                            <li>Improve our services and user experience</li>
                            <li>Send important updates about your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage & Security</h2>
                        <p className="mb-4">
                            Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit.
                            OAuth access tokens for YouTube and Instagram are encrypted before storage.
                        </p>
                        <p>We implement industry-standard security measures including:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>HTTPS encryption for all communications</li>
                            <li>Encrypted database storage</li>
                            <li>Regular security audits</li>
                            <li>Limited access controls</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Instagram & Facebook Data</h2>
                        <p className="mb-4">
                            When you connect your Instagram Business or Creator account via Facebook Login, we access the following data through the Instagram Graph API:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Profile Information:</strong> Username, profile picture, biography, follower count, following count, and media count</li>
                            <li><strong>Media Data:</strong> Recent posts including images, captions, like counts, comment counts, and timestamps</li>
                            <li><strong>Account Insights:</strong> Follower demographics (age, gender, country, city), account reach, impressions, and profile views</li>
                        </ul>
                        <p className="mt-4 font-semibold">How we use Instagram data:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>Display your analytics on your private dashboard</li>
                            <li>Calculate engagement rates and growth trends</li>
                            <li>Generate AI-powered content and growth recommendations</li>
                            <li>Build historical performance snapshots (daily)</li>
                        </ul>
                        <p className="mt-4 font-semibold">What we do NOT do with Instagram data:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                            <li>We do NOT sell, rent, or share your Instagram data with any third parties</li>
                            <li>We do NOT use your data for advertising or profiling</li>
                            <li>We do NOT transfer your data to data brokers</li>
                            <li>We do NOT store Instagram data beyond what is needed for analytics</li>
                        </ul>
                        <p className="mt-4">
                            When you disconnect Instagram from CreatorIQ, all associated Instagram data (profile, media, insights) is permanently deleted from our servers within 24 hours. You can disconnect at any time from your Dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Third-Party Services</h2>
                        <p className="mb-4">We integrate with the following services, each governed by their own privacy policies:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Google (YouTube):</strong> To fetch your channel analytics via YouTube Data API and YouTube Analytics API. Subject to <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
                            <li><strong>Meta (Instagram/Facebook):</strong> To fetch your Instagram Business account data via Instagram Graph API. Subject to <a href="https://www.facebook.com/privacy/policy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a>.</li>
                            <li><strong>Supabase:</strong> For authentication and database storage</li>
                        </ul>
                        <p className="mt-4">
                            We only request the minimum permissions needed to provide our services. We comply with the <a href="https://developers.facebook.com/terms/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Meta Platform Terms</a> and <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google API Services User Data Policy</a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights (GDPR & Indian Data Protection)</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Access:</strong> Request a copy of your data</li>
                            <li><strong>Rectification:</strong> Correct inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your account and data</li>
                            <li><strong>Data Portability:</strong> Export your data in CSV/JSON format</li>
                            <li><strong>Withdraw Consent:</strong> Disconnect platforms at any time</li>
                        </ul>
                        <p className="mt-4">
                            To exercise these rights, visit Settings → Data & Privacy or contact us at privacy@creatoriq.in
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention & Deletion</h2>
                        <p className="mb-4">
                            We retain your data as long as your account is active. When you delete your account,
                            we permanently delete all your data within 30 days, except where required by law to retain it longer.
                        </p>
                        <p className="mb-4">
                            <strong>Platform data deletion:</strong> When you disconnect a platform (YouTube or Instagram), all data from that platform is deleted from our servers within 24 hours.
                        </p>
                        <p>
                            <strong>Facebook Data Deletion:</strong> You can request deletion of your data by visiting Settings in your CreatorIQ dashboard and clicking "Delete Account", or by emailing <strong>privacy@creatoriq.in</strong>. You may also request data deletion directly from your Facebook Settings under "Apps and Websites". We process all deletion requests within 24 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies & Tracking</h2>
                        <p>
                            We use essential cookies for authentication and session management. We do not use
                            third-party tracking cookies or sell your data to advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Age Restriction</h2>
                        <p>
                            CreatorIQ is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal data, we will delete it immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of significant
                            changes via email or in-app notification. Continued use of CreatorIQ after changes
                            constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                        <p className="mb-2">If you have questions about this privacy policy or want to exercise your data rights:</p>
                        <ul className="space-y-1 ml-4">
                            <li><strong>Email:</strong> privacy@creatoriq.in</li>
                            <li><strong>Website:</strong> https://creatoriq.in</li>
                            <li><strong>Address:</strong> CreatorIQ, Bangalore, Karnataka, India</li>
                        </ul>
                    </section>

                    <section className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            By using CreatorIQ, you agree to this Privacy Policy. If you do not agree,
                            please do not use our services.
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 flex gap-6">
                    <Link href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                    <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link>
                </div>
            </div>
            </div>
        </div>
    );
}
