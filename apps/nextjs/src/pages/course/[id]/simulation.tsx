import Header from "../../../components/header";

const Intro = () => {
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
                        <p>1. Question 1</p>
                        <form action="#">
                            <input type="text" />
                            <button>Check</button>
                        </form>
                        <button className="simulation__next-btn">Next</button>
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
