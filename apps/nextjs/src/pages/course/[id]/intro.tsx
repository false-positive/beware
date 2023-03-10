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
    console.log(course);
    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title">
                    {/* {course.name ? course.name : }\ */}
                    {course?.name}
                </h1>

                <p
                    className={`course-intro__description ${ColfaxLight.className}`}
                >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Dolorum dolor aperiam qui amet, aut repellendus sunt autem
                    sit praesentium beatae facilis quis atque optio nesciunt
                    quam modi
                    <br />
                    <br />
                    temporibus exercitationem nulla! <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                    <br />
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Rem autem delectus cupiditate itaque, magnam optio officia
                    enim error saepe perferendis fuga tenetur dolores cum
                    doloremque praesentium eum nesciunt, nostrum mollitia.
                </p>

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
