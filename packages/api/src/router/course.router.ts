import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.course.findMany();
    }),
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            const course = ctx.prisma.course.findUnique({
                where: { id: input.id },
            });
            if (course == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            return course;
        }),
});
