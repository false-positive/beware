import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Header from "../../../components/header";

const Intro = () => {
    const router = useRouter();
    const id = useRouter().query.id as string;
    useSession({ required: true });

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title">
                    Course Title
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
                        {/* <iframe src="www.google.com" frameborder="0"></iframe> */}
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
                        <h1>Test</h1>
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
