export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
                <p className="text-sm text-gray-600 mb-8">Last updated: February 8, 2026</p>

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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Services</h2>
                        <p className="mb-4">We integrate with:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Google (YouTube):</strong> To fetch your channel analytics</li>
                            <li><strong>Meta (Instagram):</strong> To fetch your Instagram Business account data</li>
                            <li><strong>Supabase:</strong> For authentication and data storage</li>
                        </ul>
                        <p className="mt-4">
                            These services have their own privacy policies. We only request the minimum permissions needed
                            to provide our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights (GDPR & Indian Data Protection)</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Access:</strong> Request a copy of your data</li>
                            <li><strong>Rectification:</strong> Correct inaccurate data</li>
                            <li><strong>Erasure:</strong> Request deletion of your account and data</li>
                            <li><strong>Data Portability:</strong> Export your data in CSV/JSON format</li>
                            <li><strong>Withdraw Consent:</strong> Disconnect platforms at any time</li>
                        </ul>
                        <p className="mt-4">
                            To exercise these rights, visit Settings → Data & Privacy or contact us at privacy@creatoriq.com
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
                        <p>
                            We retain your data as long as your account is active. When you delete your account,
                            we permanently delete all your data within 30 days, except where required by law to retain it longer.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
                        <p>
                            We use essential cookies for authentication and session management. We do not use
                            third-party tracking cookies or sell your data to advertisers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy from time to time. We will notify you of significant
                            changes via email or in-app notification. Continued use of CreatorIQ after changes
                            constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
                        <p className="mb-2">If you have questions about this privacy policy:</p>
                        <ul className="space-y-1 ml-4">
                            <li><strong>Email:</strong> privacy@creatoriq.com</li>
                            <li><strong>Address:</strong> CreatorIQ, Bangalore, India</li>
                        </ul>
                    </section>

                    <section className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            By using CreatorIQ, you agree to this Privacy Policy. If you do not agree,
                            please do not use our services.
                        </p>
                    </section>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <a href="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</a>
                </div>
            </div>
        </div>
    );
}
