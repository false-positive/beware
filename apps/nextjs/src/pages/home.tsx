// import Image from "next/image";
import Header from "../components/header";

const Home = () => {
    return (
        <>
            <div className="home__header">
                <Header></Header>
            </div>
            <section>
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
            </section>
        </>
    );
};

export default Home;
