// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SearchFilter, SortBy } from "@/types";
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

  const startDateFilter = filter.startDate
    ? {
        startDate: {
          gte: filter.startDate,
        },
      }
    : {};

  const endDateFilter = filter.endDate
    ? {
        endDate: {
          lte: filter.endDate,
        },
      }
    : {};

  const episodeFilter = filter.numEpisodes
    ? {
        numEpisodes: {
          ...(filter.numEpisodes.min && { gte: filter.numEpisodes.min }),
          ...(filter.numEpisodes.max && { lte: filter.numEpisodes.max }),
        },
      }
    : {};

  const scoreFilter = filter.score
    ? {
        bangumiScore: {
          ...(filter.score.min && { gte: filter.score.min }),
          ...(filter.score.max && { lte: filter.score.max }),
        },
      }
    : {};

  const nsfwFilter = filter.includeNsfw
    ? {}
    : {
        nsfw: false,
      };

  const platformFilter = filter.includePlatforms
    ? {
        platform: {
          in: filter.includePlatforms,
        },
      }
    : {};

  let orderByFilter = {};

  switch (filter.sortBy) {
    case SortBy.SCORE:
      orderByFilter = { orderBy: { bangumiScore: "desc" } };
      break;
    case SortBy.AIR_DATE:
      orderByFilter = { orderBy: { startDate: "desc" } }
      break;
    default:
      break;
  }

  const prisma = new PrismaClient();
  const results = await prisma.donghua.findMany({
    where: {
      AND: [
        queryFilter,
        nsfwFilter,
        startDateFilter,
        endDateFilter,
        episodeFilter,
        scoreFilter,
        platformFilter,
      ],
    },
    skip: 0,
    take: 10,
    ...orderByFilter,
  });

  res.status(200).json({ results });
}
