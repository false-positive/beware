import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
    type NextPage,
} from "next";
import Link from "next/link";
import { getCsrfToken } from "next-auth/react";

import Title from "../components/title";

const Login: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ csrfToken }) => {
    return (
        <>
            <form
                className="login"
                method="post"
                action="/api/auth/signin/email"
            >
                <Link href="/" className="login__logo title">
                    <Title />
                </Link>
                <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                />

                <div className="login__email">
                    <label htmlFor="email">Log in</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                    />
                </div>
                <button className="login__submit">Continue</button>
            </form>
        </>
    );
};

export default Login;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const csrfToken = await getCsrfToken(context);
    return {
        props: { csrfToken },
    };
}
