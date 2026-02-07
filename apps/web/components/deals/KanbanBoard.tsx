'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { Deal, DealStatus } from '@/types/deal';
import DealCard from './DealCard';
import { Plus, Loader2 } from 'lucide-react';

const COLUMNS: { id: DealStatus; title: string }[] = [
    { id: 'pitching', title: 'Pitching' },
    { id: 'negotiating', title: 'Negotiating' },
    { id: 'contract_sent', title: 'Contract Sent' },
    { id: 'closed_won', title: 'Closed Won' },
    { id: 'closed_lost', title: 'Closed Lost' },
];

interface KanbanBoardProps {
    initialDeals?: Deal[];
    userId: string;
}

export default function KanbanBoard({ initialDeals = [], userId }: KanbanBoardProps) {
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        setIsClient(true);
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const response = await fetch(`${API_URL}/deals/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setDeals(data);
            }
        } catch (error) {
            console.error('Failed to fetch deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as DealStatus;

        // Optimistic UI update
        const updatedDeals = deals.map(deal =>
            deal.id === draggableId ? { ...deal, status: newStatus } : deal
        );
        setDeals(updatedDeals);

        try {
            await fetch(`${API_URL}/deals/${draggableId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error('Failed to update deal status:', error);
            // Revert on error
            fetchDeals();
        }
    };

    const getDealsByStatus = (status: DealStatus) => {
        return deals.filter(deal => deal.status === status);
    };

    if (!isClient) return null;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="h-full overflow-x-auto pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 min-w-max h-full">
                    {COLUMNS.map(column => (
                        <div key={column.id} className="w-80 flex flex-col h-full rounded-xl bg-gray-50/50 border border-gray-100">
                            {/* Column Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-gray-700">{column.title}</h3>
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                        {getDealsByStatus(column.id).length}
                                    </span>
                                </div>
                                {column.id === 'pitching' && (
                                    <button className="text-gray-400 hover:text-primary-600 transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-3 transition-colors ${snapshot.isDraggingOver ? 'bg-primary-50/50' : ''
                                            }`}
                                    >
                                        {getDealsByStatus(column.id).map((deal, index) => (
                                            <DealCard key={deal.id} deal={deal} index={index} />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
