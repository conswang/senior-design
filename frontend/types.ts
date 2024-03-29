import { Donghua_platform, TagCN } from "@prisma/client";

type Range = {
  min?: number;
  max?: number;
};

export enum SortBy {
  SCORE,
  AIR_DATE,
  BEST_MATCH,
  POPULAR,
}
export interface SearchFilter {
  query?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  numEpisodes?: Range;
  score?: Range;
  includeNsfw?: boolean;
  includePlatforms?: Donghua_platform[];
  sortBy?: SortBy,
  // for pagination
  offset?: number,
  limit?: number,
}
