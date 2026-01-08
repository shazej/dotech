export interface BusinessHours {
    id: string;
    providerId: string;
    schedule: WeeklySchedule;
    exceptions: DateException[];
    createdAt: string;
    updatedAt: string;
}

export interface WeeklySchedule {
    [key: string]: DaySchedule; // 'monday', 'tuesday', etc.
}

export interface DaySchedule {
    isOpen: boolean;
    intervals: TimeInterval[];
}

export interface TimeInterval {
    start: string; // "09:00"
    end: string;   // "17:00"
}

export interface DateException {
    date: string; // ISO date string "2023-12-25"
    isClosed: boolean;
    reason?: string;
    intervals?: TimeInterval[]; // If open on exclusion (e.g. special hours)
}

export interface Appointment {
    id: string;
    customerId: string;
    providerId: string;
    serviceId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    date: string; // ISO date
    time: string; // "14:00"
    notes?: string;
    rejectionReason?: string;
    cancellationReason?: string;
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
    createdAt: string;
    updatedAt: string;
}
