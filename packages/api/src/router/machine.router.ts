import { TRPCError } from "@trpc/server";
import invariant from "tiny-invariant";
import { z } from "zod";

import { prisma } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
            if (usrCourse === null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            if (usrCourse.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }
            if (usrCourse.machineId !== null) {
                // TODO: maybe delete here?? idk
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Machine already exists",
                });
            }
            // XXX: maybe don't need containerName??
            const containerName =
                user.id + "_" + usrCourse.course.name.replace(" ", "-");
            let container;

            // NOTE: must NOT end with a slash
            const basePath = `/${usrCourse.id}`;

            try {
                container = await ctx.docker.container.create({
                    Image: usrCourse.course.image,
                    name: containerName,
                    Env: [`SUBFOLDER=${basePath}/`],
                    Labels: {
                        [`traefik.http.routers.${containerName}.rule`]: `Path(\`${basePath}\`) || PathPrefix(\`${basePath}/\`)`,
                        [`traefik.http.routers.${containerName}.middlewares`]:
                            "auth",
                        [`traefik.http.services.${containerName}.loadbalancer.server.port`]:
                            "3000",
                    },
                });
                await ctx.docker.network.get("beware-traefik").connect({
                    Container: container.id,
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
                    machineId: container.id,
                },
            });
            return {
                url: `${
                    process.env.NEXT_PUBLIC_MACHINE_URL as string
                }:5000${basePath}`,
                courseId: usrCourse.courseId,
            };
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
            if (usrCourse.userId !== ctx.session.user.id) {
                throw new TRPCError({ code: "FORBIDDEN" });
            }
            if (usrCourse.machineId == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const container = ctx.docker.container.get(usrCourse.machineId);
            // XXX: maybe just kill here to make it faster?
            await container.stop();
            await container.delete();
            await ctx.prisma.userCourse.update({
                where: {
                    id: usrCourse.id,
                },
                data: {
                    machineId: null,
                },
            });
            return {
                courseId: usrCourse.courseId,
            };
        }),
});
