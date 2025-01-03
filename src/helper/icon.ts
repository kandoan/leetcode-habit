import browser from "webextension-polyfill";
import {
  CHROME_EXTENSION_FILE_PREFIX,
  COLOR,
  DURATION_IN_MILLIS_DAY,
  ERROR_BADGE_TEXT,
  ICON_PATH,
  ICON_SIZE,
} from "../constants";
import { StreakCounter } from "../types";
import { getNextTimeLeft } from "./time";

const COUNTDOWN_RADIUS = 30;
const COUNTDOWN_MARGIN = 5;
const COUNTDOWN_BACKGROUND_STROKE_SIZE = 4;
const STREAK_COUNT_TEXT_STROKE_SIZE = 10;
const STREAK_COUNT_TEXT_FONT = "Arial";
const STREAK_COUNTER_FONT_SIZES: Record<string, number> = {
  0: 80,
  100: 60,
  1000: 50,
};

const renderErrorIcon = async () => {
  await browser.action.setBadgeBackgroundColor({ color: COLOR.ERROR_BADGE });
  await browser.action.setBadgeText({ text: ERROR_BADGE_TEXT });
  await browser.action.setIcon({
    path: ICON_PATH.UNLIT,
  });
};

const renderCompletedIcon = async (streakCount: number) => {
  createIcon(async (ctx) => {
    await drawImage(ctx, ICON_PATH.LIT);
    drawStreakCountText(ctx, streakCount);
  });
};

const renderPendingIcon = async (streakCount: number) => {
  createIcon(async (ctx) => {
    await drawImage(ctx, ICON_PATH.UNLIT);
    drawCountdown(ctx);
    drawStreakCountText(ctx, streakCount);
  });
};

const drawImage = async (
  ctx: OffscreenCanvasRenderingContext2D,
  imagePath: string
) => {
  const imagePathUrl = browser.runtime.getURL(imagePath);

  if (imagePathUrl.startsWith(CHROME_EXTENSION_FILE_PREFIX)) {
    return await drawImageOnChrome(ctx, imagePathUrl);
  }

  return await drawImageOnFirefox(ctx, imagePath);
};

const drawImageOnFirefox = (
  ctx: OffscreenCanvasRenderingContext2D,
  imagePath: string
) => {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
      resolve();
    };
    img.src = imagePath;
  });
};

const drawImageOnChrome = async (
  ctx: OffscreenCanvasRenderingContext2D,
  imagePathUrl: string
) => {
  const blob = await (await fetch(imagePathUrl)).blob();

  const imageBitmap = await createImageBitmap(blob);

  ctx.drawImage(imageBitmap, 0, 0, ctx.canvas.width, ctx.canvas.height);
};

const drawStreakCountText = (
  ctx: OffscreenCanvasRenderingContext2D,
  streakCount?: number
) => {
  if (streakCount && streakCount > 0) {
    ctx.font = `${calculateFontSize(streakCount)}px ${STREAK_COUNT_TEXT_FONT}`;
    ctx.strokeStyle = COLOR.STREAK_COUNT.OUTLINE;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineWidth = STREAK_COUNT_TEXT_STROKE_SIZE;
    ctx.strokeText(`${streakCount}`, ctx.canvas.width / 2, ctx.canvas.height);
    ctx.fillStyle = COLOR.STREAK_COUNT.FILL;
    ctx.fillText(`${streakCount}`, ctx.canvas.width / 2, ctx.canvas.height);
  }
};

const drawCountdown = (ctx: OffscreenCanvasRenderingContext2D) => {
  const canvasWidth = ctx.canvas.width;

  const positionX = canvasWidth - COUNTDOWN_RADIUS - COUNTDOWN_MARGIN;
  const positionY = COUNTDOWN_RADIUS + COUNTDOWN_MARGIN;

  const timeLeftPercent =
    1 - (getNextTimeLeft() * 1.0) / DURATION_IN_MILLIS_DAY;

  ctx.strokeStyle = COLOR.COUNTDOWN.BACKGROUND.OUTLINE;
  ctx.lineWidth = COUNTDOWN_BACKGROUND_STROKE_SIZE;
  ctx.fillStyle = COLOR.COUNTDOWN.BACKGROUND.FILL;
  ctx.beginPath();
  ctx.arc(positionX, positionY, COUNTDOWN_RADIUS, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = COLOR.COUNTDOWN.TIME.FILL;
  ctx.beginPath();
  ctx.moveTo(positionX, positionY);
  ctx.arc(
    positionX,
    positionY,
    COUNTDOWN_RADIUS,
    -Math.PI / 2,
    -Math.PI / 2 + 2 * Math.PI * timeLeftPercent
  );
  ctx.lineTo(positionX, positionY);
  ctx.fill();
};

const calculateFontSize = (streakCount: number) => {
  let fontSize = 0;
  let maxStreakCountLevel = -1;

  Object.keys(STREAK_COUNTER_FONT_SIZES).forEach((streakCountLimit) => {
    const limit = Number(streakCountLimit);
    if (streakCount >= limit && limit > maxStreakCountLevel) {
      maxStreakCountLevel = limit;
      fontSize = STREAK_COUNTER_FONT_SIZES[streakCountLimit];
    }
  });

  return fontSize;
};

const createIcon = async (
  drawCallback: (ctx: OffscreenCanvasRenderingContext2D) => Promise<void>
) => {
  const canvas = new OffscreenCanvas(ICON_SIZE, ICON_SIZE);
  const ctx = canvas.getContext("2d")!;

  await drawCallback(ctx);

  browser.action.setIcon({
    imageData: {
      [ICON_SIZE]: ctx.getImageData(0, 0, canvas.width, canvas.height) as any,
    },
  });
};

export const renderIcon = async (streakCounter?: StreakCounter) => {
  if (!streakCounter) {
    return await renderErrorIcon();
  }

  browser.action.setBadgeText({ text: "" });

  if (streakCounter.currentDayCompleted) {
    await renderCompletedIcon(streakCounter.streakCount);
  } else {
    await renderPendingIcon(streakCounter.streakCount);
  }
};
