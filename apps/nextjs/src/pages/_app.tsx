import "../styles/main.scss";
import type { AppType } from "next/app";
import localFont from "next/font/local";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

const myFont = localFont({ src: "../../public/fonts/Colfax-Medium.ttf" });

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <main className={myFont.className}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </main>
    );
};

export default api.withTRPC(MyApp);
