export default function DashboardLayout({ children }) {

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
            </header>
            <main className="dashboard-content">
                {children}
            </main>
        </div>
    );
}