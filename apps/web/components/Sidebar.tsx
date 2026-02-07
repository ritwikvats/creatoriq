'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, DollarSign, FileText, Settings, Youtube, Instagram, LogOut, Briefcase } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const navigation = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: Briefcase, label: 'Brand Deals', href: '/deals' },
        { icon: Youtube, label: 'YouTube', href: '/youtube' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Revenue', href: '/dashboard/revenue', icon: DollarSign },
        { name: 'Tax Reports', href: '/dashboard/tax', icon: FileText },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    const platforms = [
        { name: 'YouTube', icon: Youtube, connected: true },
        { name: 'Instagram', icon: Instagram, connected: false },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col">
            {/* Logo */}
            <div className="mb-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-primary-600" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                        CreatorIQ
                    </span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Main Menu
                </p>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary-50 text-primary-700 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label || item.name}
                        </Link>
                    );
                })}

                {/* Connected Platforms */}
                <div className="pt-8">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Platforms
                    </p>
                    {platforms.map((platform) => (
                        <div
                            key={platform.name}
                            className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <platform.icon className="w-5 h-5" />
                                <span>{platform.name}</span>
                            </div>
                            <div
                                className={`w-2 h-2 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                title={platform.connected ? 'Connected' : 'Not connected'}
                            />
                        </div>
                    ))}
                </div>
            </nav>

            {/* User Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-700">RV</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">Ritwik Vats</p>
                        <p className="text-xs text-gray-500">creator@example.com</p>
                    </div>
                </div>
                <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </Link>
            </div>
        </div>
    );
}
