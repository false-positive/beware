import Header from "../../components/header";

const CourseDetail = () => {
    return (
        <>
            <main className="page-course-detail">
                <Header></Header>
                <h1 className="heading center-text">Course Title</h1>
                <div className="course-info">
                    <div className="course-info__progress ">
                        <div className="pie">70%</div>
                    </div>
                    <p className="course-info__description">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Quibusdam illo distinctio nam esse tempore. Ab magnam
                        neque enim repellendus, iste impedit quis odit, debitis
                        vero dignissimos aperiam animi, vel repudiandae!
                    </p>
                </div>
                <div className="course-extra-details">
                    <div className="timeline">
                        <li>Question 1</li>
                        <li>Question 2</li>
                        <li>Question 3</li>
                        <li>Question 4</li>
                        <li>Question 5 </li>
                    </div>
                    <button className="course-extra-details__button btn">
                        Continue Course
                    </button>
                </div>
                &nbsp;
            </main>
        </>
    );
};

export default CourseDetail;
