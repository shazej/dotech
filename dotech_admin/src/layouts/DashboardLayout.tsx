import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Wrench, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100" style={{ backgroundColor: 'var(--background)' }}>
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md" style={{ backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary" style={{ color: 'var(--primary)' }}>Dotech Admin</h1>
                </div>
                <nav className="mt-6">
                    <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem to="/users" icon={<Users size={20} />} label="Users" />
                    <NavItem to="/services" icon={<Wrench size={20} />} label="Services" />
                </nav>
                <div className="p-6 mt-auto border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 rounded hover:bg-red-50"
                        style={{ color: 'var(--danger)' }}
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold" style={{ backgroundColor: '#e0e7ff', color: 'var(--primary)' }}>
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                }`
            }
            style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                backgroundColor: isActive ? '#e0e7ff' : 'transparent',
            })}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </NavLink>
    );
};

export default DashboardLayout;
