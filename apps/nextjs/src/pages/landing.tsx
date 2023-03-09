import Link from "next/link";

const Landing = () => {
    return (
        <>
            <div className="topbar">
                <Link href="#">
                    <img src="#" alt="logo" className="topbar__logo" />
                </Link>
                <button className="topbar__login-btn">Log in</button>
            </div>
            <div className="name">
                <h1> False Positive</h1>
                <p className="name__description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quibusdam illo distinctio nam esse tempore. Ab magnam neque
                    enim repellendus, iste impedit quis odit, debitis vero
                    dignissimos aperiam animi, vel repudiandae!
                </p>
            </div>
        </>
    );
};

export default Landing;
