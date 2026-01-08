import AxiosMockAdapter from 'axios-mock-adapter';
import { AxiosInstance } from 'axios';
import { BusinessHours, Appointment } from './contracts/types';

export const setupMocks = (axiosInstance: AxiosInstance) => {
    const mock = new AxiosMockAdapter(axiosInstance, { delayResponse: 500 });

    console.log('⚠️ Mock Adapter Initialized');

    // --- Business Hours Mocks ---
    const mockBusinessHours: BusinessHours = {
        id: 'bh-1',
        providerId: 'p-1',
        schedule: {
            monday: { isOpen: true, intervals: [{ start: '09:00', end: '17:00' }] },
            tuesday: { isOpen: true, intervals: [{ start: '09:00', end: '17:00' }] },
            wednesday: { isOpen: true, intervals: [{ start: '09:00', end: '17:00' }] },
            thursday: { isOpen: true, intervals: [{ start: '09:00', end: '17:00' }] },
            friday: { isOpen: true, intervals: [{ start: '09:00', end: '12:00' }] },
            saturday: { isOpen: false, intervals: [] },
            sunday: { isOpen: false, intervals: [] },
        },
        exceptions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mock.onGet(/\/business-hours\/?.*/).reply(200, mockBusinessHours);
    mock.onPost(/\/business-hours\/?.*/).reply(200, mockBusinessHours);

    // --- Appointments Mocks ---
    const mockAppointments: Appointment[] = [
        {
            id: 'apt-1',
            customerId: 'c-1',
            providerId: 'p-1',
            serviceId: 's-1',
            status: 'PENDING',
            date: '2023-11-20',
            time: '10:00',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    mock.onGet(/\/appointments\/provider/).reply(200, mockAppointments);
    mock.onGet(/\/appointments/).reply(200, mockAppointments); // Customer

    // Pass through for un-mocked endpoints (optional, but good for hybrid)
    mock.onAny().passThrough();
};
