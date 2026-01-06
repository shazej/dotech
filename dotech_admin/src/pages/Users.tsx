import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'provider' | 'admin';
    status: 'active' | 'pending' | 'banned';
}

const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@provider.com', role: 'provider', status: 'pending' },
    { id: '3', name: 'Admin User', email: 'admin@dotech.com', role: 'admin', status: 'active' },
    { id: '4', name: 'Bob Wilson', email: 'bob@example.com', role: 'customer', status: 'banned' },
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button className="bg-primary text-white px-4 py-2 rounded">
                    Add User
                </button>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6 flex gap-4" style={{ backgroundColor: 'var(--surface)' }}>
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ border: '1px solid var(--border)' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                    <Filter size={20} />
                    Filter
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b" style={{ backgroundColor: '#f9fafb', borderBottomColor: 'var(--border)' }}>
                        <tr>
                            <th className="p-4 font-semibold text-sm text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Email</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Role</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-sm text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50" style={{ borderBottomColor: 'var(--border)' }}>
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'active' ? 'bg-green-100 text-green-700' :
                                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'}`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-primary hover:text-indigo-800 text-sm font-semibold">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
