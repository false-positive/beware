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
    },
];

/**
 * @type {import("@prisma/client").Question[]}
 */
const questions = [
    {
        id: "clf0zvqy60002uijgvfhergv8",
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "First Question Instruction",
        answer: "First Question Answer",
    },
];

const main = async () => {
    const prisma = new PrismaClient();
    try {
        await prisma.question.deleteMany();
        await prisma.course.deleteMany();
        await prisma.course.createMany({
            data: courses,
        });
        await prisma.question.createMany({
            data: questions,
        });
        console.log("Seeded database successfully");
    } finally {
        await prisma.$disconnect();
    }
};

main();