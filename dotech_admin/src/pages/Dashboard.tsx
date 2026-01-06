import { Users, BookOpen, DollarSign, Activity } from 'lucide-react';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard icon={<Users />} label="Total Users" value="1,234" color="blue" />
                <StatCard icon={<BookOpen />} label="Active Bookings" value="56" color="indigo" />
                <StatCard icon={<DollarSign />} label="Revenue" value="$45,678" color="green" />
                <StatCard icon={<Activity />} label="Growth" value="+12%" color="purple" />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow" style={{ backgroundColor: 'var(--surface)' }}>
                    <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b pb-2">
                                <span>New booking request #10{i}</span>
                                <span className="text-sm text-gray-500">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded shadow" style={{ backgroundColor: 'var(--surface)' }}>
                    <h3 className="text-lg font-bold mb-4">Pending Approvals</h3>
                    <p className="text-gray-500">No pending provider approvals.</p>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => {
    return (
        <div className="bg-white p-6 rounded shadow flex items-center" style={{ backgroundColor: 'var(--surface)' }}>
            <div className={`p-3 rounded-full mr-4 bg-${color}-100 text-${color}-600`} style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                {/* Simplified color logic for demo */}
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

export default Dashboard;
