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
                    Beware is a web platform, which puts its users in the shoes
                    of a hacker, who managed to get inside someone's computer.
                    Their goal is to complete a series of tasks and collect data
                    from the unlocked device.
                </p>

                <Link href="/login">
                    <button className="name__cta">Get Started Now!</button>
                </Link>
            </div>
        </>
    );
};

export default Landing;
