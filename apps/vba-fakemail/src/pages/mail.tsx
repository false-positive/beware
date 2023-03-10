import Head from "next/head";
import { useRouter } from "next/router";

import { Logo } from "~/components";

function fromBase64(str: string) {
    return Buffer.from(str, "base64").toString("ascii");
}

export default function MailPage() {
    const nothing = useRouter().query.nothing;
    const password = fromBase64(typeof nothing === "string" ? nothing : "");

    return (
        <>
            <Head>
                <title>ВБА Поща</title>
                <meta name="description" content="Влез във ВБА Поща" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <Logo className="w-1/2 max-w-xs rotate-180 text-green-600" />
                    <h1 className="text-center text-5xl font-bold tracking-tight sm:text-6xl">
                        ВБА Поща
                    </h1>
                    <p className="text-lg">Паролата е: {password}</p>
                </div>
            </main>
        </>
    );
}
