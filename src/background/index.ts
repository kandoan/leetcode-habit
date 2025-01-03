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
  RuntimeState,
  SubmitModalInfoResponse,
} from "../types";
import { renderIcon } from "../helper/icon";

let runtimeState: RuntimeState = {};

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
      runtimeState.streakCounter = (
        responseBody as SubmitModalInfoResponse
      )?.data?.dccSubmissionPollingV2?.dccSubmissionInfo?.streakCounter;
      break;
    }
    case "getStreakCounter": {
      runtimeState.streakCounter = (
        responseBody as GetStreakCounterResponse
      )?.data?.streakCounter;
      break;
    }
    case "globalData": {
      const streakCounter = (responseBody as GlobalDataResponse)?.data
        ?.streakCounter;

      if (streakCounter) {
        runtimeState.streakCounter = streakCounter;
      }
      break;
    }
  }

  renderIcon(runtimeState.streakCounter);
});

browser.alarms.onAlarm.addListener(async () => {
  try {
    checkNeedReloadStreakCounter();

    renderIcon(runtimeState.streakCounter);

    createAlarm();
  } catch (e) {
    console.error(e);
  }
});

browser.action.onClicked.addListener(async () => {
  if (!runtimeState.activeQuestion) return;

  browser.tabs.create({
    url: `${LEETCODE_HOST}${runtimeState.activeQuestion}`,
  });
});

const setup = async () => {
  await browser.action.setBadgeText({ text: DEFAULT_BADGE_TEXT });
  await browser.action.setBadgeBackgroundColor({ color: COLOR.DEFAULT_BADGE });

  await reloadCurrentStreakCounter();

  runtimeState.previousTimeLeft = getNextTimeLeft();

  renderIcon(runtimeState.streakCounter);

  createAlarm();
};

const reloadCurrentStreakCounter = async () => {
  try {
    const response = await fetchCurrentStreakCounter();
    runtimeState.streakCounter = response?.data.streakCounter;
    runtimeState.activeQuestion =
      response?.data.activeDailyCodingChallengeQuestion?.link;
  } catch (e) {
    console.error(e);
    runtimeState.streakCounter = undefined;
  }
};

const createAlarm = () => {
  browser.alarms.create(ALARM_NAME, {
    when: getNextTimeStep(DURATION_IN_MILLIS_ALARM_STEP),
  });
};

const checkNeedReloadStreakCounter = async () => {
  // Force reload when the streak counter hasn't been loaded successfully
  if (!runtimeState.streakCounter) {
    await reloadCurrentStreakCounter();
    return;
  }

  // Check when a new date start, which is when the previous time left would then be lower than the new time
  const newTimeLeft = getNextTimeLeft();
  if (
    runtimeState.previousTimeLeft &&
    newTimeLeft > runtimeState.previousTimeLeft
  ) {
    await reloadCurrentStreakCounter();
  }
  runtimeState.previousTimeLeft = newTimeLeft;
};
