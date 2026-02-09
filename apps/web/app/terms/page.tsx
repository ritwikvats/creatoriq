'use client';

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
                <p className="text-sm text-gray-600 mb-8">Last updated: February 8, 2026</p>

                <div className="space-y-6 text-gray-700">
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using CreatorIQ ("the Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                        <p className="mb-4">CreatorIQ provides:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Analytics dashboard for YouTube and Instagram creators</li>
                            <li>Revenue tracking and tax calculation tools</li>
                            <li>Brand deal management</li>
                            <li>Content performance insights</li>
                            <li>Historical data tracking and reporting</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                        <p className="mb-4"><strong>Account Creation:</strong></p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You must provide accurate and complete information</li>
                            <li>You are responsible for maintaining account security</li>
                            <li>You must be at least 18 years old to use this service</li>
                            <li>One person or entity may maintain only one account</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Platform Integrations</h2>
                        <p className="mb-4">When connecting YouTube or Instagram:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You grant us permission to access your analytics data</li>
                            <li>We will not post content without your explicit permission</li>
                            <li>You can disconnect platforms at any time from Settings</li>
                            <li>You must comply with YouTube and Instagram's terms of service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
                        <p className="mb-4">You agree NOT to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Use the Service for any illegal purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Share your account credentials with others</li>
                            <li>Scrape or collect data from the Service using automated means</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Upload malicious code or viruses</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Tax & Financial Disclaimer</h2>
                        <p className="mb-4">
                            <strong>IMPORTANT:</strong> CreatorIQ provides tax calculations as estimates based on Indian tax laws.
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Tax calculations are for informational purposes only</li>
                            <li>We are not a tax advisory service</li>
                            <li>Always consult a certified CA for accurate tax filing</li>
                            <li>We are not responsible for any tax-related errors or penalties</li>
                            <li>You are solely responsible for your tax compliance</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Accuracy</h2>
                        <p>
                            While we strive for accuracy, analytics data may have delays or discrepancies compared to
                            platform native dashboards. Always verify critical numbers directly with YouTube/Instagram.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
                        <p className="mb-4">
                            CreatorIQ and its original content, features, and functionality are owned by CreatorIQ and
                            are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <p><strong>Your Content:</strong> You retain all rights to your content and data. By using the Service,
                            you grant us a license to display and process your data solely to provide our services.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                        <p className="mb-4">
                            To the fullest extent permitted by law, CreatorIQ shall not be liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Loss of revenue or data</li>
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Service interruptions or downtime</li>
                            <li>Third-party platform changes or outages</li>
                            <li>Tax calculation errors or penalties</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Service Availability</h2>
                        <p>
                            We strive for 99.9% uptime but do not guarantee uninterrupted access. We may perform
                            maintenance, updates, or experience downtime without liability.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
                        <p className="mb-4">We may terminate or suspend your account if:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You violate these Terms of Service</li>
                            <li>You engage in fraudulent or illegal activity</li>
                            <li>You fail to pay applicable fees (if any)</li>
                        </ul>
                        <p className="mt-4">You may terminate your account at any time from Settings → Delete Account.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Pricing & Payments</h2>
                        <p>
                            CreatorIQ is currently free to use. If we introduce paid features in the future, we will
                            notify you 30 days in advance. Continued use after notification constitutes acceptance of the new pricing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify you of significant changes
                            via email or in-app notification. Your continued use of the Service after changes constitutes
                            acceptance of the new terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Governing Law</h2>
                        <p>
                            These Terms shall be governed by the laws of India. Any disputes shall be subject to the
                            exclusive jurisdiction of courts in Bangalore, Karnataka.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
                        <p className="mb-2">For questions about these Terms:</p>
                        <ul className="space-y-1 ml-4">
                            <li><strong>Email:</strong> legal@creatoriq.com</li>
                            <li><strong>Support:</strong> support@creatoriq.com</li>
                        </ul>
                    </section>

                    <section className="mt-8 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            By using CreatorIQ, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
