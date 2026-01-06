import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50" style={{ backgroundColor: 'var(--background)' }}>
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow" style={{ backgroundColor: 'var(--surface)' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
