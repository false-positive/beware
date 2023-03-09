// import Image from "next/image";

const Home = () => {
    return (
        <>
            <header className="header">
                <img src="#" alt="logo" className="header__logo" />
                <div className="header__profile">
                    <img
                        src="#"
                        alt="profile"
                        className="header__profile-img"
                    />
                    <p className="header__profile-name">John Doe</p>
                </div>
            </header>
            <main>
                <h1 className="heading ">Home</h1>
                <div className="course-cards">
                    <div className="course-card">
                        <h2 className="course-card__title">Title</h2>
                        <div className="progress-bar">
                            <div className="progress-bar__bar">
                                <div className="progress-bar__colored">
                                    &nbsp;
                                </div>
                            </div>
                            <p className="progress-bar__count">10%</p>
                        </div>
                    </div>
                    <div className="course-card">
                        <h2 className="course-card__title">Title</h2>
                        <div className="progress-bar">
                            <div className="progress-bar__bar">
                                <div className="progress-bar__colored">
                                    &nbsp;
                                </div>
                            </div>
                            <p className="progress-bar__count">20%</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Home;
