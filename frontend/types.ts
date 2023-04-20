type Range = {
  min?: number;
  max?: number;
};

export interface SearchFilter {
  query?: string;
  tags?: Array<string>;
  platform?: string;
  startDate?: string;
  endDate?: string;
  episodeLength?: Range;
  score?: Range;
  includeNsfw?: boolean;
  // for pagination
  offset?: number,
  limit?: number,
}
