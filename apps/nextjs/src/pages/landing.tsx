import Image from "next/image";
import Link from "next/link";

import Title from "../components/title";

const Landing = () => {
    return (
        <>
            <div className="topbar">
                <Link href="#" className="topbar__logo">
                    <Title></Title>
                    {/* <img src="#" alt="logo" className="topbar__logo" /> */}
                </Link>
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
