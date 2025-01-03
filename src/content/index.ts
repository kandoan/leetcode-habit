import browser from "webextension-polyfill";
import { INJECT_SCRIPT_PATH, SCRIPT_CUSTOM_EVENT_NAME } from "../constants";

let s = document.createElement("script");
s.src = browser.runtime.getURL(INJECT_SCRIPT_PATH);
s.defer = false;
s.onload = function () {
  (this as any).remove();
};
document.documentElement.prepend(s);

document.addEventListener(SCRIPT_CUSTOM_EVENT_NAME, (event: any) => {
  browser.runtime.sendMessage({ detail: event.detail });
});
