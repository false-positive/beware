import { type NextApiRequest, type NextApiResponse } from "next";

import { getServerSession } from "@acme/auth";
import { prisma } from "@acme/db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getServerSession({ req, res });
    if (!session) {
        res.status(403).end();
        return;
    }

    const uriHeader = req.headers["x-forwarded-uri"];
    if (typeof uriHeader !== "string") {
        res.status(403).end();
        return;
    }
    // Get the userCourseId from the X-Forwarded-Uri header
    // It looks like this: /:userCourseId/..., but the leading slash may or may not be there
    // so we need to strip it off
    const userCourseId = uriHeader.replace(/^\/?/, "").split("/")[0];
    if (!userCourseId) {
        res.status(403).end();
        return;
    }

    const userCourse = await prisma.userCourse.findUnique({
        where: {
            id: userCourseId,
        },
        select: {
            userId: true,
        },
    });
    if (userCourse && userCourse.userId === session.user.id) {
        res.status(200).end();
        return;
    }

    res.status(403).end();
}
