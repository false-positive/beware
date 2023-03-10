import { type CSSProperties } from "react";
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
    const { mutateAsync: enroll } = api.course.enroll.useMutation({
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

    const { mutateAsync: join } = api.machine.create.useMutation({
        onSuccess: () => {
            // refetch the course to get the updated machinePort
            void utils.course.byId.invalidate({ id });
        },
    });

    const joinCourse = async () => {
        const userCourse = await enroll(id);
        // console.log(userCourse);
        await join(userCourse.id);
    };

    if (!course) {
        return null;
    }

    return (
        <>
            <main className="page-course-detail">
                <Header></Header>
                <h1 className="heading center-text">{course.name}</h1>
                <div className="course-info">
                    <div className="course-info__progress ">
                        {!course.hasEnrolled ? (
                            <div className="course__cta">
                                <Link
                                    href={router.asPath + "/intro"}
                                    className="course__cta-btn"
                                    onClick={() => void joinCourse()}
                                >
                                    Join Now!
                                </Link>
                            </div>
                        ) : (
                            <div
                                className="pie"
                                style={
                                    {
                                        "--p": course.progressPct,
                                    } as CSSProperties
                                }
                            >
                                {course.progressPct}%
                            </div>
                        )}
                    </div>
                    <p className="course-info__description">
                        {course.description.split("\n").map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </p>
                </div>

                {course.hasEnrolled && (
                    <div className="course-extra-details">
                        <div className="timeline">
                            <li>Question 1</li>
                            <li>Question 2</li>
                            <li>Question 3</li>
                            <li>Question 4</li>
                            <li>Question 5 </li>
                        </div>
                        <Link
                            href={router.asPath + "/simulation"}
                            className="course-extra-details__button btn"
                        >
                            Continue Course
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
};

export default CourseDetail;
