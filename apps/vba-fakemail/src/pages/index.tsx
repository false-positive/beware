import * as React from "react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { Logo } from "~/components";

function toBase64(str: string) {
    return Buffer.from(str).toString("base64");
}

const Home: NextPage = () => {
    const [password, setPassword] = React.useState("");
    const [passwordError, setPasswordError] = React.useState("");
    const router = useRouter();
    const { mutate: login } = api.example.login.useMutation({
        onSuccess: (isCorrect) => {
            if (isCorrect) {
                setPasswordError("");
                void router.push("/mail?nothing=" + toBase64(password));
            } else {
                setPasswordError("Грешна парола");
            }
        },
    });

    return (
        <>
            <Head>
                <title>Вход във ВБА Поща</title>
                <meta name="description" content="Влез във ВБА Поща" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <Logo className="w-1/2 max-w-xs rotate-180 text-green-600" />
                    <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl">
                        Вход във <span className="text-green-600">ВБА</span>{" "}
                        Поща
                    </h1>
                    <form
                        className="grid grid-cols-1 gap-4 md:gap-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            login({ password });
                        }}
                    >
                        <input
                            value={"denis@vba.false-positive.dev"}
                            className="border-2 border-gray-300 p-3 outline-green-600"
                            type="email"
                            readOnly
                        />
                        <div className="flex flex-col">
                            <p className="font-bold text-red-600">
                                {passwordError}
                            </p>
                            <input
                                value={password}
                                type="password"
                                className="border-2 border-gray-300 p-3 outline-green-600"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button className="bg-green-600 p-3 text-lg font-bold text-white transition-colors hover:bg-green-500">
                            Вход
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Home;
