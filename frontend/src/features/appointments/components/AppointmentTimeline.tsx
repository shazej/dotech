import { Appointment } from '@/lib/api/contracts/types';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';

interface TimelineProps {
    status: Appointment['status'];
    createdAt: string;
    updatedAt: string;
}

export function AppointmentTimeline({ status, createdAt, updatedAt }: TimelineProps) {
    // Mock timeline steps based on current status
    // Ideally, backend provides full history logs.

    const steps = [
        { label: 'Requested', date: createdAt, completed: true, icon: Clock },
        { label: 'Confirmed', date: status === 'ACCEPTED' || status === 'COMPLETED' ? updatedAt : null, completed: status === 'ACCEPTED' || status === 'COMPLETED', icon: CheckCircle2 },
        { label: 'Completed', date: status === 'COMPLETED' ? updatedAt : null, completed: status === 'COMPLETED', icon: CheckCircle2 },
    ];

    if (status === 'REJECTED') {
        steps[1] = { label: 'Rejected', date: updatedAt, completed: true, icon: XCircle };
    } else if (status === 'CANCELLED') {
        steps.push({ label: 'Cancelled', date: updatedAt, completed: true, icon: XCircle });
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Timeline</h3>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-2">
                {steps.map((step, idx) => (
                    <div key={idx} className={`relative pl-6 ${!step.completed ? 'opacity-50' : ''}`}>
                        <span className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${step.completed ? 'bg-blue-600' : 'bg-gray-300'}`} />
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{step.label}</span>
                            {step.date && <span className="text-xs text-gray-500">{new Date(step.date).toLocaleDateString()}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
