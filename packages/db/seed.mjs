import { PrismaClient } from "@prisma/client";

/**
 * @type {import("@prisma/client").Account[]}
 */
const courses = [
    {
        id: "clf0znrxk0000uijgewvhccgd",
        name: "Plain Text",
        description: `You have come across an unlocked laptop.
You take a look at it and notice some pretty interesting desktop icons.
So you take a closer look at them. How much information can you gather from these files?`,
        createdAt: new Date(),
        summary: `You have to observe the files and find confidential information.
Information such as passwords, usernames, credit card numbers, etc.
You can use any tool you want to find the information and it could be anywhere in your PC.`,
        intro: `You have come across an unlocked laptop.
You take a look at it and notice some pretty interesting desktop icons.
So you take a closer look at them. How much information can you gather from these files?`,
        image: "course1",
    },
    {
        id: "clf0znrxk0000uijgewvhccgf",
        name: "Web Browser",
        description: `You know that people predominantly use their laptops to browse the internet.
Just like any other machine, the laptop has browsers.
You remember the password you saw earlier.
You decide to open them up. How much information can you gather from these browsers?`,
        createdAt: new Date(),
        intro: `You know that people predominantly use their laptops to browse the internet.
Just like any other machine, the laptop has browsers. You decide to open them up
How much information can you gather from these browsers?`,
        summary: `You have to observe the browsers and find confidential information.
Information such as passwords, usernames, credit card numbers, etc.
You can use any tool you want to find the information and it could be anywhere in your PC.`,
        image: "course2",
    },
];

/**
 * @type {import("@prisma/client").Question[]}
 */
const questions = [
    {
        id: "clf0zvqy60002uijgvfhergv9",
        order: 1,
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "What is the password for the email?",
        answer: "parola123",
    },
    {
        id: "clf0zvqy60032uijgvfhergva",
        order: 2,
        courseId: "clf0znrxk0000uijgewvhccgd",
        instruction: "How many customers were affected by a data breach?",
        answer: "16800",
    },

    {
        id: "clf0zvqy60002uijgvfhergva",
        order: 1,
        courseId: "clf0znrxk0000uijgewvhccgf",
        instruction: "What's the reset password for BGDaddy?",
        answer: "resetPassword123",
    },
    {
        id: "clf0zvqy60002uijgvfhergvc",
        order: 2,
        courseId: "clf0znrxk0000uijgewvhccgf",
        instruction: "What's the theme of the intercorporate hackathon?",
        answer: "Security",
    },
];

const prisma = new PrismaClient();

const main = async () => {
    console.log("seed");
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
