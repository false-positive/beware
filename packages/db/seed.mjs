import { PrismaClient } from "@prisma/client";

/**
 * @type {import("@prisma/client").Account[]}
 */
const courses = [
    {
        id: "clf0znrxk0000uijgewvhccgd",
        name: "First Course",
        description: "First Course Description",
        createdAt: new Date(),
        image: "course1",
    },
];

/**
 * @type {import("@prisma/client").Question[]}
 */
const questions = [
    {
        id: "clf0zvqy60002uijgvfhergv8",
        order: 1,
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "First Question Instruction",
        answer: "First Question Answer",
    },
    {
        id: "clf0zvqy60002uijgvfhergv9",
        order: 2,
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "Second Question Instruction",
        answer: "Second Question Answer",
    },
    {
        id: "clf0zvqy60002uijgvfhergv1",
        order: 3,
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "Third Question Instruction",
        answer: "Third Question Answer",
    },
];

const prisma = new PrismaClient();

const main = async () => {
    await prisma.question.deleteMany();
    await prisma.course.deleteMany();
    await prisma.course.createMany({
        data: courses,
    });
    await prisma.question.createMany({
        data: questions,
    });
    console.log("Seeded database successfully");
};

main().finally(() => prisma.$disconnect());
