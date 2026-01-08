import { Appointment } from '@/lib/api/contracts/types';
import { Clock, Calendar as CalendarIcon, MapPin, User } from 'lucide-react';

interface AppointmentListProps {
    appointments: Appointment[];
    onSelectEvent: (appointment: Appointment) => void;
}

export function AppointmentList({ appointments, onSelectEvent }: AppointmentListProps) {
    if (appointments.length === 0) {
        return <div className="p-8 text-center text-gray-500">No appointments found.</div>;
    }

    return (
        <div className="space-y-4">
            {appointments.map((apt) => (
                <div
                    key={apt.id}
                    onClick={() => onSelectEvent(apt)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
                >
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{apt.date}</span>
                                <Clock className="w-4 h-4 ml-2" />
                                <span>{apt.time}</span>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>Customer #{apt.customerId}</span>
                            </div>
                            {apt.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{apt.location.address}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                ${apt.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                ${apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${apt.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                ${apt.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' : ''}
                ${apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : ''}
              `}>
                                {apt.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
