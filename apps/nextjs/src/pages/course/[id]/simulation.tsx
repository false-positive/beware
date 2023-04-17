import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import {
    SimulationFrame,
    useCreateMachine,
    useDeleteMachine,
    useMachineFrameActions,
} from "~/components/machine";
import Header from "../../../components/header";

const USER_PATIENCE_SECONDS = 10;

const MachineTakingTooLong: React.FC<{
    userCourseId: string;
    showAfterSeconds: number;
}> = ({ userCourseId, showAfterSeconds }) => {
    const [show, setShow] = useState(false);

    const { mutateAsync: createMachine } = useCreateMachine({ isReset: true });
    const { mutateAsync: deleteMachine } = useDeleteMachine();

    const handleResetMachine = async () => {
        await deleteMachine({ userCourseId });
        await createMachine({ userCourseId });
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true);
        }, showAfterSeconds * 1000);
        return () => clearTimeout(timeout);
    }, [showAfterSeconds]);

    if (!show) return null;
    return (
        <div>
            <p>Machine taking too long?</p>
            <button onClick={() => void handleResetMachine()}>
                reset machine
            </button>
        </div>
    );
};

const MachineBootingUp: React.FC<{
    userCourseId: string;
}> = ({ userCourseId }) => {
    return (
        <>
            <p>Machine is booting up...</p>
            <MachineTakingTooLong
                userCourseId={userCourseId}
                showAfterSeconds={USER_PATIENCE_SECONDS}
            />
        </>
    );
};

const MachineDisconnected: React.FC<{
    userCourseId: string;
}> = ({ userCourseId }) => {
    return (
        <>
            <p>Machine has disconnected. Reconnecting...</p>
            <MachineTakingTooLong
                userCourseId={userCourseId}
                showAfterSeconds={USER_PATIENCE_SECONDS}
            />
        </>
    );
};

const MachineButtons: React.FC<{
    userCourseId: string;
    reloadMachineFrame: () => void;
    fullscreenMachineFrame: () => void;
}> = ({
    userCourseId,
    // XXX: sucks how we have to pass these here :(
    reloadMachineFrame,
    fullscreenMachineFrame,
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
            <button onClick={reloadMachineFrame}>reload machine</button>
            <button onClick={fullscreenMachineFrame}>fullscreen mahcine</button>
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
    const {
        reloadMachineFrame,
        fullscreenMachineFrame,
        simulationFrameFrameRef,
    } = useMachineFrameActions();

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
                                ref={simulationFrameFrameRef}
                                machineUrl={course.user?.machineUrl}
                                userCourseId={course.user.id}
                                className="simulation__frame"
                                connectingComponent={
                                    <MachineBootingUp
                                        userCourseId={course.user.id}
                                    />
                                }
                                disconnectedComponent={
                                    <MachineDisconnected
                                        userCourseId={course.user.id}
                                    />
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
                        <MachineButtons
                            userCourseId={course.user.id}
                            reloadMachineFrame={reloadMachineFrame}
                            fullscreenMachineFrame={fullscreenMachineFrame}
                        />
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
