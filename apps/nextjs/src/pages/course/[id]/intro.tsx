import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { ColfaxLight } from "~/utils/fonts";
import Header from "../../../components/header";

const Intro = () => {
    // const myFont2 = localFont({ src: "../../public/fonts/Colfax-Light.otf" });
    const router = useRouter();
    const id = useRouter().query.id as string;
    useSession({ required: true });
    const { data: course } = api.course.byId.useQuery({ id });
    // console.log(course);

    if (!course) {
        return null;
    }

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title">
                    {/* {course.name ? course.name : }\ */}
                    {course.name}
                </h1>
                {course.description.split("\n").map((p, i) => (
                    <p
                        key={i}
                        className={`course-intro__description ${ColfaxLight.className}`}
                    >
                        {p}
                    </p>
                ))}
                <Link
                    href={`/course/${id}/simulation`}
                    className="page-course-intro__button btn"
                >
                    Continue
                </Link>
            </div>
        </main>
    );
};

export default Intro;
