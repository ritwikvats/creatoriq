'use client';

import { Deal } from '@/types/deal';
import { Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Calendar, DollarSign, Mail } from 'lucide-react';

interface DealCardProps {
    deal: Deal;
    index: number;
}

export default function DealCard({ deal, index }: DealCardProps) {
    return (
        <Draggable draggableId={deal.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3 hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary-500 rotate-2' : ''
                        }`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-800">{deal.brand_name}</h4>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {deal.amount && (
                            <div className="flex items-center text-sm text-gray-600">
                                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-green-600" />
                                <span className="font-medium text-green-700">
                                    {new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: deal.currency
                                    }).format(deal.amount)}
                                </span>
                            </div>
                        )}

                        {deal.next_action_date && (
                            <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit">
                                <Calendar className="w-3 h-3 mr-1.5" />
                                <span>Action: {new Date(deal.next_action_date).toLocaleDateString()}</span>
                            </div>
                        )}

                        {deal.contact_email && (
                            <div className="flex items-center text-xs text-gray-500">
                                <Mail className="w-3 h-3 mr-1.5" />
                                <span className="truncate max-w-[150px]">{deal.contact_email}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
}
