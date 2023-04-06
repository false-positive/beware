import "../styles/main.scss";
import "react-toastify/dist/ReactToastify.css";
import type { AppType } from "next/app";
import localFont from "next/font/local";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";

import { api } from "~/utils/api";

const myFont1 = localFont({ src: "../../public/fonts/Colfax-Medium.otf" });
const _myFont2 = localFont({ src: "../../public/fonts/Colfax-Light.otf" });

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <main className={`${myFont1.className}`}>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
            <ToastContainer />
            <ReactQueryDevtools />
        </main>
    );
};

export default api.withTRPC(MyApp);
