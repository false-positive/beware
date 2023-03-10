import Link from "next/link";
import { useRouter } from "next/router";

import Header from "../../../components/header";

const Summary = () => {
    const router = useRouter();
    const id = useRouter().query.id as string;

    return (
        <main className="page-course-intro">
            <Header></Header>
            <div className="course-content">
                <h1 className="heading page-course-intro__title center-text">
                    Summary
                </h1>

                <p className="course-info__description">
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
                    href={`/home`}
                    className="page-course-intro__button btn"
                >
                    Finish!
                </Link>
            </div>
        </main>
    );
};

export default Summary;
