// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SearchFilter } from "@/types";
import { Donghua, Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResData = {
  results: Donghua[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData | { error: string }>
) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "unaccepted request method, use POST" });
    return;
  }

  const filter: SearchFilter = JSON.parse(req.body);

  const queryFilter = filter.query
    ? {
        OR: [
          {
            titleEnglish: {
              contains: filter.query,
            },
          },
          {
            titleChinese: {
              contains: filter.query,
            },
          },
          {
            summaryEnglish: {
              contains: filter.query,
            },
          },
          {
            summaryChinese: {
              contains: filter.query,
            },
          },
        ],
      }
    : {};

  const startDateFilter = filter.startDate ? {
    startDate: {
      gte: filter.startDate
    }
  }: {};

  const endDateFilter = filter.endDate ? {
    endDate: {
      lte: filter.endDate
    }
  }: {}

  const nsfwFilter = filter.includeNsfw
    ? {}
    : {
        nsfw: false,
      };

  const prisma = new PrismaClient();
  const results = await prisma.donghua.findMany({
    where: {
      AND: [queryFilter, nsfwFilter, startDateFilter, endDateFilter],
    },
    skip: 0,
    take: 10,
  });

  res.status(200).json({ results });
}
