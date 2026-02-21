export type EventBriefDTO = {
  id: string;
  slug: string;
  event: string;
  leftSaying: string[];
  rightSaying: string[];
  factsSoFar: string[];
  whyLeft: string;
  whyRight: string;
  historicalContext: string[];
  published: boolean;
  updatedAt: string;
};

export type EventBriefInput = {
  slug: string;
  event: string;
  leftSaying: string[];
  rightSaying: string[];
  factsSoFar: string[];
  whyLeft: string;
  whyRight: string;
  historicalContext: string[];
  published: boolean;
};
