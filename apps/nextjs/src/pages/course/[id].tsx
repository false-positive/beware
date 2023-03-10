import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Header from "../../components/header";

const CourseDetail = () => {
    useSession({ required: true });
    const router = useRouter();
    const id = router.query.id as string;
    const utils = api.useContext();
    const { data: course } = api.course.byId.useQuery({ id });
    const { mutate: enroll } = api.course.enroll.useMutation({
        onSuccess: () => {
            // refetch the course to get the updated hasEnrolled
            void utils.course.byId.invalidate({ id });
        },
    });
    const { mutate: leave } = api.machine.delete.useMutation({
        onSuccess: () => {
            // refetch the course to get the updated machinePort
            void utils.course.byId.invalidate({ id });
        },
    });
    const { mutate: join } = api.machine.create.useMutation({
        onSuccess: () => {
            // refetch the course to get the updated machinePort
            void utils.course.byId.invalidate({ id });
        },
    });

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

                {true ? (
                    <div className="course__cta">
                        <Link
                            href={router.asPath + "/intro"}
                            className="course__cta-btn"
                            onClick={() => enroll(course.id)}
                        >
                            Join Now!
                        </Link>
                    </div>
                ) : (
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
                )}
            </main>
        </>
    );
};

export default CourseDetail;
