"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBusinessHours, updateBusinessHours } from '@/lib/api/businessHours';
import { BusinessHours, WeeklySchedule, DaySchedule, TimeInterval } from '@/lib/api/contracts/types';
import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function BusinessHoursPage() {
    const queryClient = useQueryClient();
    const { data: businessHours, isLoading } = useQuery({
        queryKey: ['business-hours'],
        queryFn: getBusinessHours,
    });

    const [schedule, setSchedule] = useState<WeeklySchedule | null>(null);

    useEffect(() => {
        if (businessHours) {
            setSchedule(businessHours.schedule);
        }
    }, [businessHours]);

    const mutation = useMutation({
        mutationFn: updateBusinessHours,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['business-hours'] });
            alert('Schedule updated successfully!');
        },
        onError: () => {
            alert('Failed to update schedule.');
        }
    });

    if (isLoading || !schedule) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    const handleDayToggle = (day: string) => {
        setSchedule(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [day]: { ...prev[day], isOpen: !prev[day].isOpen }
            };
        });
    };

    const addInterval = (day: string) => {
        setSchedule(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    intervals: [...prev[day].intervals, { start: '09:00', end: '17:00' }]
                }
            };
        });
    };

    const removeInterval = (day: string, index: number) => {
        setSchedule(prev => {
            if (!prev) return null;
            const newIntervals = [...prev[day].intervals];
            newIntervals.splice(index, 1);
            return {
                ...prev,
                [day]: { ...prev[day], intervals: newIntervals }
            };
        });
    };

    const updateInterval = (day: string, index: number, field: keyof TimeInterval, value: string) => {
        setSchedule(prev => {
            if (!prev) return null;
            const newIntervals = [...prev[day].intervals];
            newIntervals[index] = { ...newIntervals[index], [field]: value };
            return {
                ...prev,
                [day]: { ...prev[day], intervals: newIntervals }
            };
        });
    };

    const handleSave = () => {
        if (businessHours && schedule) {
            mutation.mutate({ ...businessHours, schedule });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Business Hours</h1>
                <button
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-lg shadow border border-gray-100">
                {DAYS.map(day => (
                    <div key={day} className="border-b last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-4">
                            <div className="w-32 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={schedule[day]?.isOpen ?? false}
                                        onChange={() => handleDayToggle(day)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="capitalize font-medium">{day}</span>
                                </label>
                            </div>

                            <div className="flex-1 space-y-2">
                                {!schedule[day]?.isOpen ? (
                                    <div className="text-gray-400 italic pt-2">Closed</div>
                                ) : (
                                    <>
                                        {schedule[day].intervals.map((interval, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={interval.start}
                                                    onChange={(e) => updateInterval(day, idx, 'start', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                />
                                                <span className="text-gray-500">-</span>
                                                <input
                                                    type="time"
                                                    value={interval.end}
                                                    onChange={(e) => updateInterval(day, idx, 'end', e.target.value)}
                                                    className="border rounded px-2 py-1 text-sm"
                                                />
                                                <button
                                                    onClick={() => removeInterval(day, idx)}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => addInterval(day)}
                                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add Interval
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
