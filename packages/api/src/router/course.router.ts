import { TRPCError } from "@trpc/server";
import invariant from "tiny-invariant";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
    all: protectedProcedure.query(async ({ ctx }) => {
        const courses = await ctx.prisma.course.findMany({
            include: {
                users: {
                    select: {
                        _count: { select: { progress: true } },
                    },
                    where: {
                        userId: ctx.session.user.id,
                    },
                },
                _count: { select: { questions: true } },
            },
        });
        const updatedCourses = courses.map((c) => ({
            ...c,
            progressPct: Math.round(
                ((c.users[0]?._count.progress || 0) / c._count.questions) * 100,
            ),
        }));
        return updatedCourses;
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
                    summary: true,
                    intro: true,
                    createdAt: true,
                    users: {
                        select: {
                            id: true,
                            userId: true,
                            _count: { select: { progress: true } },
                            machineId: true,
                        },
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
                            order: true,
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
            if (course === null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            const { users, ...rest } = course;

            const user = users.find((u) => u.userId === ctx.session.user.id);
            const transformedUser = user && {
                id: user.id,
                userId: user.userId,
                _count: user._count,
                machineUrl:
                    user.machineId &&
                    `http://${
                        process.env.NEXT_PUBLIC_DOCKER_HOST as string
                    }:5000/${user.id}`,
            };

            const transformedCourse = {
                ...rest,
                questions: course.questions.map((q) => ({
                    ...q,
                    answer: q.progresses.length > 0 ? q.answer : null,
                })),
                hasEnrolled: course.users.length > 0,
                user: transformedUser,
                progressPct:
                    course.questions.length > 0
                        ? Math.round(
                              ((user?._count.progress || 0) /
                                  course.questions.length) *
                                  100,
                          )
                        : 0,
                lastAnsweredQuestionOrder: Math.max(
                    0,
                    ...course.questions
                        .filter((q) => q.progresses.length)
                        .map((q) => q.order),
                ),
            };
            return transformedCourse;
        }),

    enroll: protectedProcedure
        .input(z.string()) // FIXME: make this an object for clarity
        .mutation(async ({ ctx, input }) => {
            const course = await ctx.prisma.course.findUnique({
                where: { id: input },
            });
            const user = ctx.session.user;
            if (course === null) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }
            const userCourse = await ctx.prisma.userCourse.create({
                data: {
                    userId: user.id,
                    courseId: course.id,
                },
            });
            // FIXME: do we even need a return here??
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
            if (question === null) {
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
            invariant(
                userCourse !== null,
                "userCourse should never be null here",
            );
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
