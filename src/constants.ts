export const DEFAULT_BADGE_TEXT = "...";
export const ERROR_BADGE_TEXT = "!";

export const ALARM_NAME = "timer";

export const COUNTDOWN_SUFFIX = {
  HOUR: "h",
  MINUTE: "m",
};

export const DURATION_IN_MILLIS_MINUTE = 60 * 1000;
export const DURATION_IN_MILLIS_DAY = 24 * 60 * DURATION_IN_MILLIS_MINUTE;
export const DURATION_IN_MILLIS_ALARM_STEP = DURATION_IN_MILLIS_DAY / 360; // a.k.a time for the countdown to move 1 degree

export const LEETCODE_HOST = "https://leetcode.com";
export const GRAPHQL_API = `${LEETCODE_HOST}/graphql`;
export const GRAPHQL_URLS = [GRAPHQL_API, "/graphql/"];
export const LEETCODE_HOME_API = `${LEETCODE_HOST}/api/home`;

export const COLOR = {
  DEFAULT_BADGE: "#666666",
  ERROR_BADGE: "#ff0000",
  COUNTDOWN: {
    BACKGROUND: {
      OUTLINE: "#3D0C11",
      FILL: "#3D0C11",
    },
    TIME: {
      FILL: "#D80032",
    },
  },
  STREAK_COUNT: {
    OUTLINE: "#000000",
    FILL: "#F9DEC9",
  },
};

export const ICON_PATH = {
  UNLIT: "icons/unlit.png",
  LIT: "icons/lit.png",
};

export const ICON_SIZE = 128;

export const SCRIPT_CUSTOM_EVENT_NAME = "onGraphQLResponded";
export const INJECT_SCRIPT_PATH = "inject/index.js";

export const CHROME_EXTENSION_FILE_PREFIX = "chrome-extension";
