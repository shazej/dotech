"use client";

import { Appointment } from '@/lib/api/contracts/types';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface AppointmentCalendarProps {
    appointments: Appointment[];
    onSelectEvent: (appointment: Appointment) => void;
}

export function AppointmentCalendar({ appointments, onSelectEvent }: AppointmentCalendarProps) {
    const [view, setView] = useState<View>('week');

    const events = appointments.map(apt => {
        const start = new Date(`${apt.date}T${apt.time}`); // Rough parsing, assumes ISO date and HH:mm
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration mock
        return {
            title: `${apt.status} - ${apt.id}`, // Should be customer name or service
            start,
            end,
            resource: apt,
        };
    });

    return (
        <div className="h-[600px] bg-white p-4 rounded-lg shadow-sm border">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={setView}
                onSelectEvent={(event) => onSelectEvent(event.resource)}
                style={{ height: '100%' }}
                eventPropGetter={(event) => {
                    let className = 'bg-blue-500';
                    if (event.resource.status === 'CONFIRMED') className = 'bg-green-500';
                    if (event.resource.status === 'PENDING') className = 'bg-yellow-500';
                    if (event.resource.status === 'REJECTED') className = 'bg-red-500';
                    return { className: `${className} text-white border-0 rounded px-2` };
                }}
            />
        </div>
    );
}
