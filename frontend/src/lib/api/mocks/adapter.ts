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

    // --- Providers Mocks ---
    const mockProviders = [
        {
            id: 'p-1',
            name: 'John Doe',
            category: 'Plumber',
            rating: 4.8,
            reviewCount: 120,
            hourlyRate: 50,
            location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY', city: 'New York' },
            tags: ['Emergency', 'Residential'],
            isVerified: true,
            bio: 'Expert plumber with 10 years experience.',
            distance: 2.5,
        },
        {
            id: 'p-2',
            name: 'Jane Smith',
            category: 'Electrician',
            rating: 4.9,
            reviewCount: 85,
            hourlyRate: 75,
            location: { lat: 40.7282, lng: -73.7949, address: 'Queens, NY', city: 'Queens' },
            tags: ['Commercial', 'Certified'],
            isVerified: true,
            bio: 'Reliable electrician for all your needs.',
            distance: 5.1,
        }
    ];

    mock.onGet(/\/providers\/featured/).reply(200, mockProviders);
    mock.onGet(/\/providers\/.+/).reply(200, mockProviders[0]);
    mock.onGet(/\/providers/).reply((config) => {
        // Basic filtering mock
        const params = config.params;
        let filtered = mockProviders;
        if (params?.query) {
            filtered = filtered.filter(p => p.name.toLowerCase().includes(params.query.toLowerCase()));
        }
        return [200, { data: filtered, total: filtered.length }];
    });

    // Pass through for un-mocked endpoints (optional, but good for hybrid)
    mock.onAny().passThrough();
};
