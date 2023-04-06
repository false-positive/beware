import { TRPCError } from "@trpc/server";
import invariant from "tiny-invariant";
import { z } from "zod";

import { prisma } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const generatePort = async () => {
    const ports = (
        await prisma.userCourse.findMany({
            select: {
                machinePort: true,
            },
        })
    ).map((x) => x.machinePort);
    let guess: number;
    while ((guess = Math.floor(Math.random() * 35000 + 30000))) {
        if (!ports.includes(guess)) {
            return guess;
        }
    }
    invariant(false, "unreachable code");
};

export const machineRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                userCourseId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const usrCourse = await prisma.userCourse.findUnique({
                where: {
                    id: input.userCourseId,
                },
                include: {
                    course: true,
                },
            });
            if (usrCourse == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            if (usrCourse.machinePort !== null) {
                invariant(
                    usrCourse.machineId !== null,
                    "machinePort is non-null, but machineId is, how did we get here...",
                );
                return usrCourse.machinePort;
            }
            const port = await generatePort();
            // XXX: maybe don't need containerName??
            const containerName =
                user.id + "_" + usrCourse.course.name.replace(" ", "-");
            let container;

            try {
                container = await ctx.docker.container.create({
                    Image: usrCourse.course.image,
                    name: containerName,
                    HostConfig: {
                        PortBindings: {
                            "3000/tcp": [
                                {
                                    HostPort: port.toString(),
                                },
                            ],
                        },
                        //AutoRemove: true,
                    },
                });
            } catch (e) {
                console.log(e);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
            await container.start();
            invariant(
                typeof container.id === "string",
                "the type definitions of node-docker-api suck",
            );
            await ctx.prisma.userCourse.update({
                where: {
                    id: usrCourse.id,
                },
                data: {
                    machinePort: port,
                    machineId: container.id,
                },
            });
            // FIXME: maybe return false or a token later on?
            return port;
        }),

    delete: protectedProcedure
        .input(
            z.object({
                userCourseId: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const usrCourse = await prisma.userCourse.findUnique({
                where: {
                    id: input.userCourseId,
                },
            });
            if (usrCourse == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            if (usrCourse.machineId == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const container = ctx.docker.container.get(usrCourse.machineId);
            await container.stop();
            await container.delete();
            await ctx.prisma.userCourse.update({
                where: {
                    id: usrCourse.id,
                },
                data: {
                    machinePort: null,
                    machineId: null,
                },
            });
            return true;
        }),
});
