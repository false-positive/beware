import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
    all: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.course.findMany();
    }),
    byId: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const course = await ctx.prisma.course.findUnique({
                where: { id: input.id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    createdAt: true,
                    users: {
                        select: { id: true },
                        where: { userId: ctx.session.user.id },
                    },
                    questions: {
                        orderBy: {
                            order: "asc",
                        },
                        select: {
                            id: true,
                            instruction: true,
                            answer: true,
                            progresses: {
                                where: {
                                    userCourse: {
                                        userId: ctx.session.user.id,
                                    },
                                },
                                select: {
                                    id: true,
                                },
                            },
                        },
                    },
                },
            });
            if (course == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const transformedCourse = {
                ...course,
                questions: course.questions.map((q) => ({
                    ...q,
                    answer: q.progresses.length > 0 ? q.answer : null,
                })),
                hasEnrolled: course.users.length > 0,
            };
            return transformedCourse;
        }),

    enroll: protectedProcedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            const course = await ctx.prisma.course.findUnique({
                where: { id: input },
            });
            const user = ctx.session.user;
            if (course == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            const userCourse = await ctx.prisma.userCourse.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                },
            });
            return userCourse;
        }),
    answer: protectedProcedure
        .input(
            z.object({
                questionId: z.string(),
                answer: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const question = await ctx.prisma.question.findUnique({
                where: { id: input.questionId },
                select: {
                    courseId: true,
                    answer: true,
                    order: true,
                },
            });
            if (question == null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            const userCourse = await ctx.prisma.userCourse.findUnique({
                where: {
                    userId_courseId: {
                        userId: ctx.session.user.id,
                        courseId: question.courseId,
                    },
                },
                select: {
                    id: true,
                    progress: {
                        select: {
                            question: {
                                select: {
                                    order: true,
                                },
                            },
                        },
                    },
                },
            });
            if (userCourse == null) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "This should never happen",
                });
            }
            const questionOrders = userCourse.progress.map(
                (p) => p.question.order,
            );
            const lastQuestionOrder = Math.max(0, ...questionOrders);
            if (lastQuestionOrder !== question.order - 1) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You can't answer this question",
                });
            }
            const correct = question.answer === input.answer;
            if (correct) {
                await ctx.prisma.progress.create({
                    data: {
                        questionId: input.questionId,
                        userCourseId: userCourse.id,
                    },
                });
                return true;
            } else {
                return false;
            }
        }),
});
