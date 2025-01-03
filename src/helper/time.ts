import { COUNTDOWN_SUFFIX, DURATION_IN_MILLIS_DAY } from "../constants";

export const getNextTimeStep = (duration = DURATION_IN_MILLIS_DAY) => {
  const value = Date.now() / duration;
  const ceiled = Math.ceil(value);

  if (ceiled == Math.floor(value)) {
    return (ceiled + 1) * duration;
  } else {
    return ceiled * duration;
  }
};

export const getNextTimeLeft = (duration = DURATION_IN_MILLIS_DAY) => {
  const nextDayTimestamp = getNextTimeStep(duration);
  return nextDayTimestamp - Date.now();
};

export const calcTimeLeftText = () => {
  const gap = getNextTimeLeft(DURATION_IN_MILLIS_DAY);

  if (gap > 3600000) {
    return Math.ceil(gap / 3600000) + COUNTDOWN_SUFFIX.HOUR;
  }

  return Math.ceil(gap / 60000) + COUNTDOWN_SUFFIX.MINUTE;
};
