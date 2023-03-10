// import Image from "next/image";

import Header from "../components/header";
import SecurityPicture from "../components/home_page_security_picture";

const Home = () => {
    return (
        <>
            <div className="home__header">
                <Header></Header>
            </div>
            <section>
                <h1 className="heading ">Home</h1>
                <div className="home__content">
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
                    <div className="home__image">
                        <SecurityPicture />
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
