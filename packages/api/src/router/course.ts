import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return [];
    }),
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return {};
        }),
    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                content: z.string().min(1),
            }),
        )
        .mutation(({ ctx, input }) => {
            return {};
        }),
    delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
        return {};
    }),
});
