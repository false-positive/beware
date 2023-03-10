import Link from "next/link";

import Title from "../components/title";

const Login = () => {
    return (
        <>
            <div className="login">
                <Link href="/" className="login__logo title">
                    <Title></Title>
                </Link>
                <div className="login__email">
                    <label htmlFor="email">Log in</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                    />
                </div>
                <Link href="/home">
                    <button className="login__submit">Continue</button>
                </Link>
            </div>
        </>
    );
};

export default Login;
