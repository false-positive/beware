const Dashboard = () => {
    return (
        <>
            <header className="header">Header</header>
            <main>
                <h1>Dashboard</h1>
                <div className="course-card">
                    <h2 className="course-card__title">Title</h2>
                    <div className="progress-bar">
                        <div className="progress-bar__bar"></div>
                        <p className="progress-bar__count">10%</p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
