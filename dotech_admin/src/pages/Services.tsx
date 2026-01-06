import { Plus } from 'lucide-react';

interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
}

const mockServices: Service[] = [
    { id: '1', name: 'Home Cleaning', category: 'Cleaning', price: 50 },
    { id: '2', name: 'AC Repair', category: 'Maintenance', price: 80 },
    { id: '3', name: 'Plumbing Check', category: 'Plumbing', price: 45 },
    { id: '4', name: 'Interior Painting', category: 'Painting', price: 120 },
];

const ServicesPage = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Service Management</h1>
                <button className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                    <Plus size={20} />
                    Add Service
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b" style={{ backgroundColor: '#f9fafb', borderBottomColor: 'var(--border)' }}>
                        <tr>
                            <th className="p-4 font-semibold text-sm text-gray-600">Service Name</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Base Price</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockServices.map((service) => (
                            <tr key={service.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderBottomColor: 'var(--border)' }}>
                                <td className="p-4 font-medium">{service.name}</td>
                                <td className="p-4">{service.category}</td>
                                <td className="p-4">${service.price}</td>
                                <td className="p-4">
                                    <button className="text-primary hover:text-indigo-800 text-sm font-semibold mr-4">Edit</button>
                                    <button className="text-red-500 hover:text-red-700 text-sm font-semibold" style={{ color: 'var(--danger)' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServicesPage;
