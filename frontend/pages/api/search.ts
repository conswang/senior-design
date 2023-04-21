// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SearchFilter, SortBy } from "@/types";
import { Donghua, Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export type SearchResData = {
  results: Donghua[];
  total: number;
  offset: number;
  limit: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResData | { error: string }>
) {
  if (req.method !== "POST") {
    res.status(400).json({ error: "unaccepted request method, use POST" });
    return;
  }

  const filter: SearchFilter = JSON.parse(req.body);
  const searchQuery = filter.query || "";

  const prisma = new PrismaClient();

  const searchRelevanceSql = `CASE WHEN UPPER(otherTitles) LIKE UPPER('%"${searchQuery}"%') THEN 10 ELSE 0 END
  + CASE WHEN UPPER(otherTitles) LIKE UPPER('%${searchQuery}%') THEN 5 ELSE 0 END # partial match for other title
  + MATCH(titleEnglish) AGAINST('${searchQuery}') * 5
  + MATCH(summaryEnglish) AGAINST('${searchQuery}')
  + CASE WHEN titleChinese = '${searchQuery}' THEN 10 ELSE 0 END
  + CASE WHEN titleChinese LIKE '%${searchQuery}%' THEN 5 ELSE 0 END
  + CASE WHEN summaryChinese LIKE '%${searchQuery}%' THEN 1 ELSE 0 END`

  const filterSql = `${filter.startDate ? `\nAND startDate >= '${filter.startDate}'` : ""}` +
  `${filter.endDate ? `\nAND endDate <= '${filter.endDate}'` : ""}` +
  `${filter.numEpisodes?.min ? `\nAND numEpisodes >= ${filter.numEpisodes.min}` : ""}` +
  `${filter.numEpisodes?.max ?  `\nAND numEpisodes <= ${filter.numEpisodes.max}` : ""}` +
  `${filter.score?.min ? `\nAND score >= ${filter.score.min}` : ""}` +
  `${filter.score?.max ?  `\nAND score <= ${filter.score.max}` : ""}` +
  `${filter.includeNsfw === false ? `\nAND nsfw = 0` : ""}` +
  `${filter.includePlatforms ? `\nAND platform IN (${filter.includePlatforms.map((str) => `'${str}'`).toString()})` : ""}`

  let orderByFilter = "";
  switch (filter.sortBy) {
    case SortBy.SCORE:
      orderByFilter = `ORDER BY score DESC`;
      break;
    case SortBy.AIR_DATE:
      orderByFilter = `ORDER BY startDate DESC`
      break;
    default:
      orderByFilter = `ORDER BY (${searchRelevanceSql}) DESC`
      break;
  }

  // console.log(`SELECT * FROM Donghua WHERE (${searchRelevanceSql}) > 0${filterSql} ${orderByFilter} LIMIT ${filter.limit || 10} OFFSET ${filter.offset || 0}`)

  // TODO: make query work without raw unsafe
  const results = await prisma.$queryRawUnsafe<Donghua[]>(`SELECT * FROM Donghua WHERE (${searchRelevanceSql}) > 0${filterSql} ${orderByFilter} LIMIT ${filter.limit || 10} OFFSET ${filter.offset || 0}`)
  const [{count: totalBigInt}] = await prisma.$queryRawUnsafe<[{count: BigInt}]>(`SELECT COUNT(*) AS count FROM Donghua WHERE (${searchRelevanceSql}) > 0${filterSql}`)
  const total = Number(totalBigInt);

  res
    .status(200)
    .json({
      results,
      total,
      offset: filter.offset || 0,
      limit: filter.limit || 10,
    });
}
