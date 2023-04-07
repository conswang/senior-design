// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Donghua, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResData = {
  results: Donghua[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData | { error: string }>
) {
  if (req.method !== "GET") {
    res.status(400).json({ error: "unaccepted request method, use GET" });
    return;
  }

  if (typeof req.query.q !== "string") {
    res.status(400).json({ error: "invalid query format" });
    return;
  }

  const searchString: string = req.query.q;

  const prisma = new PrismaClient();
  const results = await prisma.donghua.findMany({
    where: {
      OR: [
        {
          titleEnglish: {
            contains: searchString,
          },
        },
        {
          titleChinese: {
            contains: searchString,
          },
        },
        {
          summaryEnglish: {
            contains: searchString,
          },
        },
        {
          summaryChinese: {
            contains: searchString,
          },
        },
      ],
    },
  });

  res.status(200).json({ results });
}
