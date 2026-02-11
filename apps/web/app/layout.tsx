import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import { PostHogProvider } from '../providers/posthog-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CreatorIQ - Cross-Platform Analytics for Creators",
    description: "Unified dashboard for YouTube, Instagram, LinkedIn & X creators to track performance, revenue, and brand deals—all in one place.",
    keywords: ["creator analytics", "YouTube analytics", "Instagram insights", "revenue tracking", "creator tools"],
    icons: {
        icon: '/icon.svg',
    },
    verification: {
        google: "RxvQ-Xcu17QPHeV0t2s2W_IzuIPxPJvN6kzNZnsF5jo",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Suspense fallback={null}>
                    <PostHogProvider>
                        {children}
                    </PostHogProvider>
                </Suspense>
                <GoogleAnalytics gaId="G-XXXXXXXXXX" />
            </body>
        </html>
    );
}
