import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Header from "../../../components/header";

const Intro = () => {
    const id = useRouter().query.id as string;
    useSession({ required: true });
    const { data: course } = api.course.byId.useQuery({ id });

    if (course == null) {
        return null;
    }

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title">
                    {course.name}
                </h1>
                <div className="simulation">
                    <div className="simulation__tasks">
                        <h2>Tasks</h2>
                        <div className="question">
                            <p>1. Question 1</p>
                            <form action="#">
                                <input type="text" />
                                <button>Check</button>
                            </form>
                        </div>
                        <div className="question">
                            <p>1. Question 1</p>
                            <form action="#">
                                <input type="text" />
                                <button>Check</button>
                            </form>
                        </div>
                        <div className="question">
                            <p>1. Question 1</p>
                            <form action="#">
                                <input type="text" />
                                <button>Check</button>
                            </form>
                        </div>
                        <div className="question">
                            <p>1. Question 1</p>
                            <form action="#">
                                <input type="text" />
                                <button>Check</button>
                            </form>
                        </div>
                    </div>
                    <div className="simulation__display">
                        <iframe
                            src="https://example.com"
                            allowFullScreen={true}
                            className="simulation__frame"
                        ></iframe>
                    </div>
                </div>
                <Link
                    href={`/course/${id}/summary`}
                    className="page-course-intro__button btn"
                >
                    Continue
                </Link>
            </div>
        </main>
    );
};

export default Intro;
