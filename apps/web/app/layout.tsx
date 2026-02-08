import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "CreatorIQ - Cross-Platform Analytics for Creators",
    description: "Unified dashboard for YouTube, Instagram, LinkedIn & X creators to track performance, revenue, and brand deals—all in one place.",
    keywords: ["creator analytics", "YouTube analytics", "Instagram insights", "revenue tracking", "creator tools"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <GoogleAnalytics gaId="G-XXXXXXXXXX" />
            </body>
        </html>
    );
}
