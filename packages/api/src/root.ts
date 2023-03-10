import { courseRouter } from "./router/course.router";
import { machineRouter } from "./router/machine.router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    course: courseRouter,
    machine: machineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
