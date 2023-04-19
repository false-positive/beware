// import Image from "next/image";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Header from "../components/header";
import SecurityPicture from "../components/home_page_security_picture";

const Home = () => {
    useSession({ required: true });
    const { data: courses } = api.course.all.useQuery();

    return (
        <>
            <div className="home__header">
                <Header></Header>
            </div>
            <section>
                <h1 className="heading ">Home</h1>
                <div className="home__content">
                    <div className="course-cards">
                        {courses?.map((course) => (
                            <Link
                                href={`/course/${course.id}`}
                                key={course.id}
                                className="course-card"
                            >
                                <h2 className="course-card__title">
                                    {course.name}
                                </h2>
                                <div className="progress-bar">
                                    <div className="progress-bar__bar">
                                        <div
                                            className="progress-bar__colored"
                                            style={{
                                                width: `${course.progressPct}%`,
                                            }}
                                        >
                                            &nbsp;
                                        </div>
                                    </div>
                                    <p className="progress-bar__count">
                                        {course.progressPct}%
                                    </p>
                                </div>
                            </Link>
                        ))}
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
