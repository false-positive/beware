import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Title from "../components/title";

const Landing = () => {
    const router = useRouter();
    const utils = api.useContext();
    const { status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            void utils.course.all.prefetch();
            void router.push("/home");
        }
    }, [status, router, utils]);

    return (
        <>
            <div className="topbar">
                <Link href="/login">
                    <button className="topbar__login-btn">Log in</button>
                </Link>
            </div>
            <div className="name">
                <h1>
                    <Title></Title>
                </h1>

                <p className="name__description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quibusdam illo distinctio nam esse tempore. Ab magnam neque
                    enim repellendus, iste impedit quis odit, debitis vero
                    dignissimos aperiam animi, vel repudiandae!
                </p>

                <Link href="/login">
                    <button className="name__cta">Get Started Now!</button>
                </Link>
            </div>
        </>
    );
};

export default Landing;
