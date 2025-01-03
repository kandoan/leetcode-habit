import browser from "webextension-polyfill";
import { GetStreakCounterResponse } from "../types";
import { GRAPHQL_API, LEETCODE_HOME_API, LEETCODE_HOST } from "../constants";

/**
 * Initialize the streak check by calling to the home api, to then retrieve the CSRF token through cookies
 */
const initialize = async () => {
  try {
    const response = await fetch(LEETCODE_HOME_API, {
      referrer: LEETCODE_HOST,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Cannot initialize the streak check: ${response.status} ${response.body}`
      );
    }
  } catch (error: unknown) {
    throw new Error(
      `Cannot initialize the streak check: ${(error as Error).message} `
    );
  }
};

const getCsrfToken = async () =>
  (
    await browser.cookies.get({
      url: LEETCODE_HOST,
      name: "csrftoken",
    })
  )?.value || "";

export const fetchCurrentStreakCounter = async () => {
  initialize();
  try {
    const response = await fetch(GRAPHQL_API, {
      method: "POST",
      referrer: LEETCODE_HOST,
      headers: {
        "Content-Type": "application/json",
        "x-csrftoken": await getCsrfToken(),
      },
      body: JSON.stringify({
        operationName: "getStreakCounter",
        variables: {},
        query:
          "query getStreakCounter {\n  streakCounter {\n    streakCount\n    daysSkipped\n    currentDayCompleted\n  }\n  activeDailyCodingChallengeQuestion {\n    link\n    __typename\n  }\n}\n",
      }),
    });
    if (!response.ok) {
      throw new Error(
        `Cannot get current streak: ${response.status} ${response.body}`
      );
    }

    return (await response.json()) as GetStreakCounterResponse;
  } catch (error) {
    throw new Error(`Cannot get current streak: ${(error as Error).message} `);
  }
};
