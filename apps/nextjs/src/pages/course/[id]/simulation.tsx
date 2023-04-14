import { useState, type ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { useCreateMachine, useDeleteMachine } from "~/components/machine";
import Header from "../../../components/header";

const checkMachineConnection = (machineUrl: string) =>
    new Promise<boolean>((resolve) => {
        const img = new Image();
        img.src = `${machineUrl}/css/fullscreen.svg?${Date.now()}`;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });

const SimulationFrame: React.FC<{
    machineUrl: string;
    className?: string;
    connectingComponent: ReactElement;
    disconnectedComponent: ReactElement;
}> = ({
    machineUrl,
    className,
    connectingComponent,
    disconnectedComponent,
}) => {
    const [machineHasConnected, setMachineHasConnected] = useState(false);
    const { data: isConnected } = useQuery({
        queryKey: ["isMachineWebConnected", machineUrl],
        queryFn: () => checkMachineConnection(machineUrl),
        initialData: false,
        onSuccess(isConnected) {
            if (isConnected && !machineHasConnected) {
                setMachineHasConnected(true);
            }
        },
        refetchInterval(isAvailable) {
            return !isAvailable ? 1000 : 1000 * 60;
        },
        cacheTime: 0,
        // TODO: *only* if machine disconnects, invalidate the `byId` query, because the url might have changed
    });

    if (!isConnected) {
        return machineHasConnected
            ? disconnectedComponent
            : connectingComponent;
    }
    return (
        <iframe
            src={machineUrl}
            allowFullScreen={true}
            className={className}
        ></iframe>
    );
};

const MachineButtons: React.FC<{ userCourseId: string }> = ({
    userCourseId,
}) => {
    const { mutate: deleteMachine, mutateAsync: deleteMachineAsync } =
        useDeleteMachine();
    const { mutate: createMachine } = useCreateMachine();

    const handleResetMachine = async () => {
        await deleteMachineAsync({ userCourseId });
        createMachine({ userCourseId });
    };

    return (
        <>
            <button onClick={() => deleteMachine({ userCourseId })}>
                destroy machine
            </button>
            <button onClick={() => void handleResetMachine()}>
                reset machine
            </button>
        </>
    );
};

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
            onError: () => {
                setError(true);
            },
        });
    const { mutate: createMachine } = useCreateMachine();

    const handleCreateMachine = () => {
        if (!course) return;
        if (!course.user) {
            alert("oops, u have to enroll first");
            return;
        }
        createMachine({ userCourseId: course.user.id });
    };

    if (!course) {
        return null;
    }

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
                                    index ===
                                        course.lastAnsweredQuestionOrder &&
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
                                    onSubmit={(e) =>
                                        void (async () => {
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
                                        })()
                                    }
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
                        {course.user?.machineUrl ? (
                            <SimulationFrame
                                machineUrl={course.user?.machineUrl}
                                className="simulation__frame"
                                // TODO: extract these into components
                                // TODO: add a retry button, which recreates the machine, but only shows after a delay
                                connectingComponent={
                                    <p>Machine is booting up...</p>
                                }
                                disconnectedComponent={
                                    <p>
                                        Machine has disconnected.
                                        Reconnecting...
                                    </p>
                                }
                            />
                        ) : (
                            <button onClick={handleCreateMachine}>
                                create machine
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    {!!course?.user && (
                        <MachineButtons userCourseId={course.user.id} />
                    )}
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
