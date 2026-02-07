'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-gray-50 min-h-screen relative overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="absolute top-4 right-4 text-dark-400 p-2" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </div>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <BarChart3 className="w-7 h-7 text-primary-600" />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                            CreatorIQ
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-dark-600 hover:bg-gray-50 rounded-lg"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
