export type StreakCounter = {
  currentDayCompleted: boolean;
  streakCount: number;
};

export type RuntimeState = {
  previousTimeLeft?: number;
  streakCounter?: StreakCounter;
  activeQuestion?: string;
};

export type SubmitModalInfoResponse = {
  data: {
    dccSubmissionPollingV2: {
      dccSubmissionInfo: {
        streakCounter: StreakCounter;
      };
    };
  };
};

export type GlobalDataResponse = {
  data: {
    streakCounter?: StreakCounter;
  };
};

export type GetStreakCounterResponse = {
  data: {
    streakCounter: StreakCounter;
    activeDailyCodingChallengeQuestion?: {
      link: string;
    };
  };
};

export type GraphQLRequest = {
  operationName: string;
  query: string;
};
