import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Header from "../../../components/header";

const Intro = () => {
    const id = useRouter().query.id as string;
    useSession({ required: true });
    const { data: course } = api.course.byId.useQuery({ id });
    const utils = api.useContext();
    const [error, setError] = useState(false);
    const { mutate: checkAnswer, isLoading } = api.course.answer.useMutation({
        onSuccess: (isCorrect) => {
            // refetch the course to get the updated answer
            void utils.course.byId.invalidate({ id });
            if (!isCorrect) {
                setError(true);
            } else {
                setError(false);
            }
        },
        onError: (err) => {
            setError(true);
        },
    });

    if (course == null) {
        return null;
    }

    console.log(error);

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title">
                    {course?.name}
                </h1>
                <div className="simulation">
                    <div className="simulation__tasks">
                        <h2>Tasks</h2>
                        {course.questions.map((question, index) => (
                            <div
                                className={`question ${
                                    index == course.lastAnsweredQuestionOrder &&
                                    !isLoading
                                        ? "question--active"
                                        : ""
                                }`}
                                key={question.id}
                            >
                                {/* <p className="question__feedback question__feedback--error question__feedback--invisible">
                                    Wrong answer. Please try again.
                                </p> */}
                                <p className="question__text">
                                    {index + 1}. {question.instruction}
                                </p>
                                <form
                                    action="#"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const data = new FormData(
                                            e.target as HTMLFormElement,
                                        );
                                        const answer = data.get("answer");
                                        if (answer === null) {
                                            return;
                                        }
                                        // console.log(question.id);
                                        checkAnswer({
                                            questionId: question.id,
                                            answer: answer.toString(),
                                        });
                                    }}
                                >
                                    {question.answer ? (
                                        <input
                                            type="text"
                                            className="question__input"
                                            // placeholder={question.answer}
                                            value={question.answer}
                                            readOnly
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="answer"
                                            className="question__input"
                                            placeholder="VBA Bank"
                                        />
                                    )}
                                    <button
                                        className="question__submit"
                                        disabled={isLoading}
                                    >
                                        Check
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                    <div className="simulation__display">
                        <iframe
                            src={`http://${process.env.NEXT_PUBLIC_DOCKER_HOST}:${course?.user?.machinePort}`}
                            allowFullScreen={true}
                            className="simulation__frame"
                        ></iframe>
                    </div>
                </div>
                {course.lastAnsweredQuestionOrder ===
                    course.questions.length && (
                    <Link
                        href={`/course/${id}/summary`}
                        className="page-course-intro__button btn"
                    >
                        Continue
                    </Link>
                )}
            </div>
        </main>
    );
};

export default Intro;
