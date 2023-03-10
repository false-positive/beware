import Link from "next/link";

const Login = () => {
    return (
        <>
            <div className="login">
                <Link href="#">
                    <img src="#" alt="logo" className="logo" />
                </Link>
                <div className="login__email">
                    <label htmlFor="email">Log in to Beware</label>
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
