import { useState } from "react";
import { type InferGetServerSidePropsType, type NextPage } from "next";
import Head from "next/head";
import { faker } from "@faker-js/faker";
import shuffle from "lodash.shuffle";

import { Logo } from "~/components";

const MailPage: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ emails }) => {
    const [text, setText] = useState("");
    return (
        <>
            <Head>
                <title>ВБА Поща</title>
                <meta name="description" content="Влез във ВБА Поща" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center px-96">
                <div className="mb-4 flex flex-row items-center gap-3">
                    <Logo className="w-20 max-w-xs text-green-600" />
                    <span className="text-5xl font-bold">
                        <span className="text-green-600">ВБА</span> Поща
                    </span>
                </div>
                {!text ? (
                    <div className="container flex flex-col gap-1">
                        {emails.map((email, i) => (
                            <div
                                key={i}
                                onClick={() => setText(email.text)}
                                className={`flex cursor-pointer flex-row gap-5 rounded-sm bg-gray-100 p-3 ${
                                    email.isRead
                                        ? "font-bold text-green-600"
                                        : ""
                                }`}
                            >
                                <div className="w-56 overflow-hidden text-ellipsis">
                                    {email.from}
                                </div>
                                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {email.subject}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        onClick={() => setText("")}
                        className="container flex h-96 flex-col items-center justify-center gap-1 rounded-sm bg-gray-100 p-3 px-10 text-lg"
                    >
                        {text.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default MailPage;

export function getServerSideProps() {
    const emails = [
        ...Array.from({ length: 10 }).map(() => ({
            from: faker.internet.email(),
            subject: faker.lorem.sentence(),
            isRead: false,
            text: faker.lorem.paragraphs(),
        })),
        {
            from: "noreply@bgdaddy.false-positive.dev",
            subject: "You have reset your BGDaddy password.",
            isRead: true,
            text: `Hello, ico.sp6,
            
Your BGDaddy password was reset recently.
The new password is resetPassword123.

If you did not update your password, please contact us immediately at support@bgdaddy.false-positive.dev.`,
        },
        {
            from: "pesho@work.false-positive.dev",
            subject: "CONFIDENTIAL: The theme of the internal hackathon",
            isRead: true,
            text: `Hello everyone,

It is with great pleasure that I announce the theme of the internal hackathon: "Security".

I am sure that we will all have a great time and learn a lot from each other.

Please DO NOT share this information with anyone outside of the organization team.

Best regards,
Pesho`,
        },
    ];
    return {
        props: {
            emails: shuffle(emails),
        },
    };
}
