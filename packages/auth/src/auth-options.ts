import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { Docker } from "node-docker-api";
import invariant from "tiny-invariant";

import { prisma } from "@acme/db";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const cookieNamespace = "beware";

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
    callbacks: {
        session({ session, user }) {
            if (session.user) {
                session.user.id = user.id;
                // session.user.role = user.role; <-- put other properties on the session here
            }
            return session;
        },
    },
    events: {
        signOut: ({ session }) => {
            void (async function () {
                // FIXME: type of session is wrong
                const userId = (
                    session as unknown as {
                        userId: string;
                    }
                ).userId;
                console.log("LOG OUT", userId);
                const userCourses = await prisma.userCourse.findMany({
                    where: {
                        userId: userId,
                        machineId: { not: null },
                    },
                    select: {
                        machineId: true,
                    },
                });
                const containerIds = userCourses.map((uc) => {
                    invariant(
                        uc.machineId !== null,
                        "machineId should not be null, probs bad db query",
                    );
                    return uc.machineId;
                });
                const docker = new Docker({
                    host: process.env.DOCKER_HOST,
                    port: 2375,
                });
                // for (const containerId of containerIds) {
                //     const container = docker.container.get(containerId);
                //     await container.stop();
                // }
                await Promise.all(
                    containerIds.map((containerId) => {
                        const container = docker.container.get(containerId);
                        return container.stop();
                    }),
                );
                console.log("stopped containers", containerIds);
            })();
        },
    },
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
        newUser: "/home",
        // TODO: add verifyRequest and maybe signOut
    },
    cookies:
        // TODO: make it not so rushed
        process.env.NODE_ENV !== "production"
            ? undefined
            : {
                  sessionToken: {
                      name: `__${cookieNamespace}-Secure-next-auth.session-token`,
                      options: {
                          httpOnly: true,
                          sameSite: "lax",
                          path: "/",
                          secure: true,
                          domain: "false-positive.dev",
                      },
                  },
                  callbackUrl: {
                      name: `__${cookieNamespace}-Secure-next-auth.callback-url`,
                      options: {
                          sameSite: "lax",
                          path: "/",
                          secure: true,
                      },
                  },
                  csrfToken: {
                      name: `__${cookieNamespace}-Host-next-auth.csrf-token`,
                      options: {
                          httpOnly: true,
                          sameSite: "lax",
                          path: "/",
                          secure: true,
                      },
                  },
                  pkceCodeVerifier: {
                      name: `${cookiePrefix}-${cookieNamespace}-next-auth.pkce.code_verifier`,
                      options: {
                          httpOnly: true,
                          sameSite: "lax",
                          path: "/",
                          secure: useSecureCookies,
                          maxAge: 900,
                      },
                  },
                  state: {
                      name: `${cookiePrefix}-${cookieNamespace}-next-auth.state`,
                      options: {
                          httpOnly: true,
                          sameSite: "lax",
                          path: "/",
                          secure: useSecureCookies,
                          maxAge: 900,
                      },
                  },
                  nonce: {
                      name: `${cookiePrefix}next-auth.nonce`,
                      options: {
                          httpOnly: true,
                          sameSite: "lax",
                          path: "/",
                          secure: useSecureCookies,
                      },
                  },
              },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID as string,
            clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
        }),
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
        }),
        /**
         * ...add more providers here
         *
         * Most other providers require a bit more work than the Discord provider.
         * For example, the GitHub provider requires you to add the
         * `refresh_token_expires_in` field to the Account model. Refer to the
         * NextAuth.js docs for the provider you want to use. Example:
         * @see https://next-auth.js.org/providers/github
         **/
    ],
};
