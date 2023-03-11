import { TRPCError } from "@trpc/server";
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
    let guess = 0;
    while ((guess = Math.floor(Math.random() * 35000 + 30000))) {
        if (!ports.includes(guess)) {
            return guess;
        }
    }
};

export const machineRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user;
            const usrCourse = await prisma.userCourse.findUnique({
                where: {
                    id: input,
                },
                include: {
                    course: true,
                },
            });
            if (usrCourse == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            const port = await generatePort();
            const containerName =
                user.id + "_" + usrCourse.course.name.replace(" ", "-");
            let container,
                binds = [];

            if (usrCourse.course.image == "course2") {
                console.log("course2");
                binds = ["/home/kala/courseTwo:/config"];
            }
            try {
                container = await ctx.docker.container.create({
                    Image: usrCourse.course.image,
                    name: containerName,
                    HostConfig: {
                        PortBindings: {
                            "3000/tcp": [
                                {
                                    HostPort: port?.toString(),
                                },
                            ],
                        },
                        Binds: binds,
                        //AutoRemove: true,
                    },
                });
            } catch (e) {
                console.log(e);
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
            }
            await container.start();
            await ctx.prisma.userCourse.update({
                where: {
                    id: usrCourse.id,
                },
                data: {
                    machinePort: port,
                    machineId: container.id || "",
                },
            });
            return port;
        }),

    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const usrCourse = await prisma.userCourse.findUnique({
                where: {
                    id: input,
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
                    id: input,
                },
                data: {
                    machinePort: null,
                    machineId: null,
                },
            });
            return true;
        }),
});
