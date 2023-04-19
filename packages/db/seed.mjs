import { PrismaClient } from "@prisma/client";

/**
 * @type {import("@prisma/client").Account[]}
 */
const courses = [
    {
        id: "alf0znrxk0000uijgewvtgdsa",
        name: "Cybersecurity 101",
        description: `Welcome to cybersec 101, are you ready to begin your journey?`,
        createdAt: new Date(),
        summary: `You have to observe the files and find confidential information.
Information such as passwords, usernames, credit card numbers, etc.
You can use any tool you want to find the information and it could be anywhere in your PC.`,
        intro: `Your curiousity has peaked over the barrier of entry into the world of cybersecurity. Your journey begins here.`,
        image: "demo_course",
    },
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
        name: "Connections, connections everywhere...",
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
        image: "course1",
    },
    {
        id: "clf0znrxk0000uijgewvtye3d",
        name: "The cookie jar",
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
        image: "course1",
    },
    {
        id: "clf0znrxk0000uijgewv78904",
        name: "Grandma's toolbars",
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
        image: "course1",
    },
];

/**
 * @type {import("@prisma/client").Question[]}
 */
const questions = [
    {
        id: "clf0zvqy60002uijgvfhergv9",
        order: 1,
        courseId: "alf0znrxk0000uijgewvtgdsa",
        instruction:
            "Someone has conviniently left notes on their desktop. See if it has anything to do with their recently open email. \n What is the email password?",
        answer: "parola123",
    },
    {
        id: "clf0zvqy60032uijgvfhergva",
        order: 2,
        courseId: "alf0znrxk0000uijgewvtgdsa",
        instruction:
            "Well, its quite convinient isn't it. Someone has been having conversations about the hackathon, which is yet unnanounced. Open the email and see what you can gather. \n What is the theme?",
        answer: "Security",
    },
    {
        id: "clf0zvqy60032uijgvfhergv8",
        order: 3,
        courseId: "alf0znrxk0000uijgewvtgdsa",
        instruction:
            "And it seems that this email not only holds sensitive data, but there seem to be other accounts associated with it. See if you can acquire their BGDaddy password. \n What is the password?",
        answer: "resetPassword123",
    },
    {
        id: "clf0zvqy60002uijgvfhergvb",
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
    {
        id: "clf0znrxk0000uijgewvhccge",
        order: 1,
        courseId: "clf0znrxk0000uijgewvtye3d",
        instruction: "What's the theme of the intercorporate hackathon?",
        answer: "Security",
    },
    {
        id: "clf0zvqy60002uijgvfhergvf",
        order: 1,
        courseId: "clf0znrxk0000uijgewv78904",
        instruction: "What's the theme of the intercorporate hackathon?",
        answer: "Security",
    },
    {
        id: "clf0zvqy60002uijgvfhergvz",
        order: 1,
        courseId: "clf0znrxk0000uijgewvhccgd",
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
