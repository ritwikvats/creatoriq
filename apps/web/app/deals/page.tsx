'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import KanbanBoard from '@/components/deals/KanbanBoard';
import CreateDealModal from '@/components/deals/CreateDealModal';
import { createClient } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DealsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Used to trigger board refresh
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
            }
            setLoading(false);
        };
        getUser();
    }, [router, supabase]);

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-64px)] flex flex-col p-6 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Brand Deals</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage your sponsorships and partnerships</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        New Deal
                    </button>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-hidden">
                    {user && <KanbanBoard key={refreshKey} userId={user.id} />}
                </div>

                {/* Create Deal Modal */}
                {user && (
                    <CreateDealModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onCreated={() => setRefreshKey(prev => prev + 1)}
                        userId={user.id}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}
