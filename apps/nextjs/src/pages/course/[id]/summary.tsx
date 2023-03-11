import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { ColfaxLight } from "~/utils/fonts";
import Header from "../../../components/header";

const Summary = () => {
    const id = useRouter().query.id as string;
    useSession({ required: true });

    const { data: course } = api.course.byId.useQuery({ id });

    if (course === undefined) {
        return null;
    }

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title center-text">
                    Summary
                </h1>

                {course.description.split("\n").map((p, i) => (
                    <p
                        key={i}
                        className={`course-info__description ${ColfaxLight.className}`}
                    >
                        {p}
                    </p>
                ))}

                <Link href={`/home`} className="page-course-intro__button btn">
                    Finish!
                </Link>
            </div>
        </main>
    );
};

export default Summary;
