import { useSession } from "next-auth/react";

import Header from "../../../components/header";

const Intro = () => {
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
                <button className="page-course-intro__button btn">
                    Continue
                </button>
            </div>
        </main>
    );
};

export default Intro;
