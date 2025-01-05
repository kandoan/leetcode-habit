import browser from "webextension-polyfill";
import { fetchCurrentStreakCounter } from "../helper/streak";
import {
  ALARM_NAME,
  COLOR,
  DEFAULT_BADGE_TEXT,
  DURATION_IN_MILLIS_ALARM_STEP,
  LEETCODE_HOST,
} from "../constants";
import { getNextTimeLeft, getNextTimeStep } from "../helper/time";
import {
  GetStreakCounterResponse,
  GlobalDataResponse,
  GraphQLRequest,
  SubmitModalInfoResponse,
} from "../types";
import { renderIcon } from "../helper/icon";
import {
  getActiveQuestion,
  getPreviousTimeLeft,
  getStreakCounter,
  setPreviousTimeLeft,
  setStreakCounter,
  updateSessionState,
} from "../helper/storage";

browser.runtime.onStartup.addListener(async () => {
  setup();
});

browser.runtime.onInstalled.addListener(async () => {
  setup();
});

/**
 * Handle GraphQL requests
 */
browser.runtime.onMessage.addListener(async ({ detail: data }) => {
  const requestBody = data.requestBody as GraphQLRequest;
  const operationName = requestBody.operationName;
  const responseBody = data.responseBody;

  switch (operationName) {
    case "submitModalInfo": {
      await setStreakCounter(
        (responseBody as SubmitModalInfoResponse)?.data?.dccSubmissionPollingV2
          ?.dccSubmissionInfo?.streakCounter
      );
      break;
    }
    case "getStreakCounter": {
      await setStreakCounter(
        (responseBody as GetStreakCounterResponse)?.data?.streakCounter
      );
      break;
    }
    case "globalData": {
      const streakCounter = (responseBody as GlobalDataResponse)?.data
        ?.streakCounter;

      if (streakCounter) {
        await setStreakCounter(streakCounter);
      }
      break;
    }
  }

  renderIcon(await getStreakCounter());
});

browser.alarms.onAlarm.addListener(async () => {
  try {
    checkNeedReloadStreakCounter();

    renderIcon(await getStreakCounter());

    createAlarm();
  } catch (e) {
    console.error(e);
  }
});

browser.action.onClicked.addListener(async () => {
  const activeQuestion = await getActiveQuestion();
  if (!activeQuestion) return;

  browser.tabs.create({
    url: `${LEETCODE_HOST}${activeQuestion}`,
  });
});

const setup = async () => {
  await browser.action.setBadgeText({ text: DEFAULT_BADGE_TEXT });
  await browser.action.setBadgeBackgroundColor({ color: COLOR.DEFAULT_BADGE });

  await reloadCurrentStreakCounter();

  await setPreviousTimeLeft(getNextTimeLeft());

  renderIcon(await getStreakCounter());

  createAlarm();
};

const reloadCurrentStreakCounter = async () => {
  try {
    const response = await fetchCurrentStreakCounter();
    await updateSessionState((state) => {
      state.streakCounter = response?.data.streakCounter;
      state.activeQuestion =
        response?.data.activeDailyCodingChallengeQuestion?.link;
    });
  } catch (e) {
    console.error(e);
    await setStreakCounter(undefined);
  }
};

const createAlarm = () => {
  browser.alarms.create(ALARM_NAME, {
    when: getNextTimeStep(DURATION_IN_MILLIS_ALARM_STEP),
  });
};

const checkNeedReloadStreakCounter = async () => {
  // Force reload when the streak counter hasn't been loaded successfully
  if (!(await getStreakCounter())) {
    await reloadCurrentStreakCounter();
    return;
  }

  // Check when a new date start, which is when the previous time left would then be lower than the new time
  const newTimeLeft = getNextTimeLeft();
  const previousTimeLeft = await getPreviousTimeLeft();
  if (previousTimeLeft && newTimeLeft > previousTimeLeft) {
    await reloadCurrentStreakCounter();
  }
  await setPreviousTimeLeft(newTimeLeft);
};
