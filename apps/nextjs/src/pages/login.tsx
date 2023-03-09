import Link from "next/link";

const Login = () => {
    return (
            <>
                <div className="login">
                    <Link href="#"><img src="#" alt="logo" className="logo" /></Link>
                    <div className="login__email">
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" placeholder="test@test.com" />
                    </div>
                    <button className="login__submit">Log in</button>
                </div>
            </>
    );
};

export default Login;
