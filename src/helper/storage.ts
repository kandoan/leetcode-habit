import browser from "webextension-polyfill";
import { RuntimeState, StreakCounter } from "../types";

const STORAGE_KEY = "leetcode-habit";

const getSessionState = async () => {
  return ((await browser.storage.session.get(STORAGE_KEY))[STORAGE_KEY] ||
    {}) as RuntimeState;
};

const saveSessionState = async (state: RuntimeState) => {
  await browser.storage.session.set({ [STORAGE_KEY]: state });
};

export const updateSessionState = async (
  callback: (state: RuntimeState) => RuntimeState | void
) => {
  const currentState = await getSessionState();
  saveSessionState(callback(currentState) || currentState);
};

export const getPreviousTimeLeft = async () => {
  return (await getSessionState()).previousTimeLeft;
};

export const setPreviousTimeLeft = async (timeLeftText: number) => {
  await updateSessionState((state) => {
    state.previousTimeLeft = timeLeftText;
  });
};

export const getStreakCounter = async () => {
  return (await getSessionState()).streakCounter;
};

export const setStreakCounter = async (
  streakCounter: StreakCounter | undefined
) => {
  await updateSessionState((state) => {
    state.streakCounter = streakCounter;
  });
};

export const getActiveQuestion = async () => {
  return (await getSessionState()).activeQuestion;
};

export const setActiveQuestion = async (activeQuestion: string) => {
  await updateSessionState((state) => {
    state.activeQuestion = activeQuestion;
  });
};
