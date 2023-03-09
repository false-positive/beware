// import Image from "next/image";

import { api } from "~/utils/api";

const Home = () => {
    const { data: courses } = api.course.all.useQuery();

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
                    {courses?.map((course) => (
                        <div key={course.id} className="course-card">
                            <h2 className="course-card__title">
                                {course.name}
                            </h2>
                            <div className="progress-bar">
                                <div className="progress-bar__bar">
                                    <div
                                        className="progress-bar__colored"
                                        style={{
                                            width: `${30}%`,
                                        }}
                                    >
                                        &nbsp;
                                    </div>
                                </div>
                                <p className="progress-bar__count">{30}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Home;
