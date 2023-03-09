import { useRouter } from "next/router";

import { api } from "~/utils/api";

const AnswerForm: React.FC<{ questionId: string; courseId: string }> = ({
    questionId,
    courseId,
}) => {
    const utils = api.useContext();
    const { mutate: checkAnswer } = api.course.answer.useMutation({
        onSuccess: () => {
            // refetch the course to get the updated answer
            void utils.course.byId.invalidate({ id: courseId });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target as HTMLFormElement);
                const answer = data.get("answer") as string;
                checkAnswer({
                    questionId,
                    answer,
                });
            }}
        >
            <input type="text" />
            <button>check</button>
        </form>
    );
};

export default function CoursePage() {
    // get the course id from the url
    const id = useRouter().query.id as string;
    const { data: course } = api.course.byId.useQuery({ id });

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{course.name}</h1>
            <p>{course.description}</p>

            <h2>Questions</h2>
            <ul>
                {course.questions.map((question) => (
                    <li key={question.id}>
                        <h3>{question.instruction}</h3>
                        {question.answer !== null ? (
                            <p>{question.answer}</p>
                        ) : (
                            <AnswerForm
                                courseId={course.id}
                                questionId={question.id}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
