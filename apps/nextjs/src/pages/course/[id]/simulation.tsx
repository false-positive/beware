import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Header from "../../../components/header";

const Simulation = () => {
    const id = useRouter().query.id as string;
    useSession({ required: true });
    const { data: course } = api.course.byId.useQuery({ id });
    const utils = api.useContext();
    const [error, setError] = useState(false);
    const { mutateAsync: checkAnswer, isLoading } =
        api.course.answer.useMutation({
            onSuccess: async (isCorrect) => {
                // refetch the course to get the updated answer
                await utils.course.byId.invalidate({ id });
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

    // const [isLoading, setIsLoading] = useState(false);

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
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        // setIsLoading(true);
                                        const data = new FormData(
                                            e.target as HTMLFormElement,
                                        );
                                        const answer = data.get("answer");
                                        if (answer === null) {
                                            return;
                                        }
                                        // console.log(question.id);
                                        await checkAnswer({
                                            questionId: question.id,
                                            answer: answer.toString(),
                                        });
                                        // setIsLoading(false);
                                    }}
                                >
                                    {question.answer ? (
                                        <input
                                            type="text"
                                            className={`question__input question__input--success`}
                                            // placeholder={question.answer}
                                            value={question.answer}
                                            readOnly
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            name="answer"
                                            className={`question__input ${
                                                index ==
                                                    course.lastAnsweredQuestionOrder &&
                                                error
                                                    ? "question__input--error"
                                                    : ""
                                            }`}
                                            // placeholder="VBA Bank"
                                        />
                                    )}
                                    <button
                                        className="question__submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading &&
                                        index ==
                                            course.lastAnsweredQuestionOrder
                                            ? "Checking..."
                                            : "Check"}
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

export default Simulation;
