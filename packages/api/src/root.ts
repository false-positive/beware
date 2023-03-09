import { courseRouter } from "./router/course.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    course: courseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
