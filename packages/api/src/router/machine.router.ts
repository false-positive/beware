import { TRPCError } from "@trpc/server";
import { string, z } from "zod";

import { prisma } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const generatePort = async () => {
    const ports = (await prisma.userCourse.findMany({
        select: {
            machinePort: true,
        },
    })).map((x) => x.machinePort);
    let guess = 0;
    while(guess = Math.floor(Math.random() * 35000 + 30000)) {
        if(!ports.includes(guess)) {
            return guess;
        }
    }
}

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
                    course: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            if (usrCourse == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            const container = await ctx.docker.container.create({
                Image: "linuxserver/webtop",
                name:
                    user.name +
                    "_" +
                    usrCourse.course.name.replaceAll(" ", "-"),
                HostConfig: {
                    PortBindings: {
                        "3000/tcp": [
                            {
                                HostPort: (await generatePort())?.toString(),
                            },
                        ],
                    },
                },
            });
            await container.start();
            await ctx.prisma.userCourse.update({
                where: {
                    id: usrCourse.id,
                },
                data: {
                    machineId: container.id || "",
                },
            });
            return 5000;
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
            await container.kill();
            await container.delete();
            await ctx.prisma.userCourse.update({
                where: {
                    id: input,
                },
                data: {
                    machineId: "",
                },
            });
        }),
});
