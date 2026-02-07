'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { createClient } from '@/lib/supabase';
import { User, Shield, Bell, Globe, Trash2, Youtube, Instagram, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        niche: 'Lifestyle & Tech',
    });

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setProfile({
                    full_name: user.user_metadata?.full_name || 'Ritwik Vats',
                    email: user.email || '',
                    niche: user.user_metadata?.niche || 'Lifestyle & Tech',
                });
            }
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    const handleSave = async () => {
        setSaving(true);
        // Simulate update
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-12 flex justify-center">
                    <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-dark-800">Settings</h1>
                    <p className="text-dark-600">Manage your account and platform preferences</p>
                </div>

                <div className="space-y-8">
                    {/* Profile Section */}
                    <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <User className="w-5 h-5 text-primary-600" />
                            <h2 className="text-xl font-bold text-dark-800">Profile Information</h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-dark-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-dark-700">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-dark-700">Content Niche</label>
                                    <input
                                        type="text"
                                        value={profile.niche}
                                        onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {success ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                                            {success ? 'Saved!' : 'Save Changes'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Platforms Section */}
                    <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <Globe className="w-5 h-5 text-primary-600" />
                            <h2 className="text-xl font-bold text-dark-800">Connected Platforms</h2>
                        </div>
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <Youtube className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark-800 text-lg">YouTube</h3>
                                        <p className="text-sm text-green-600 font-medium">Connected as @RitwikVats</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors border border-red-100">
                                    Disconnect
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                                <div className="flex items-center gap-4 text-gray-400">
                                    <div className="p-3 bg-gray-100 rounded-lg">
                                        <Instagram className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-500 text-lg">Instagram</h3>
                                        <p className="text-sm">Not connected</p>
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
                                    Connect
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-white rounded-2xl shadow-md border border-red-100 overflow-hidden">
                        <div className="p-6 border-b border-red-50 bg-red-50/30 flex items-center gap-3">
                            <Shield className="w-5 h-5 text-red-600" />
                            <h2 className="text-xl font-bold text-red-800">Danger Zone</h2>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-md">
                                    <h3 className="font-bold text-dark-800">Delete Account</h3>
                                    <p className="text-sm text-dark-500 mt-1">
                                        Once you delete your account, all your analytics history and connected tokens will be permanently removed.
                                    </p>
                                </div>
                                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm">
                                    <Trash2 className="w-5 h-5" />
                                    Delete My Account
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
}
