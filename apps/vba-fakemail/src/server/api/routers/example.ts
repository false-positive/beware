import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
    login: publicProcedure
        .input(z.object({ password: z.string() }))
        .mutation(({ input }) => {
            return input.password === "Password123";
        }),
});
