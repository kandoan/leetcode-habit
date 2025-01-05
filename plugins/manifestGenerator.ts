import path from "path";
import { writeFile } from "fs/promises";
import { PluginOption } from "vite";

const BROWSERS = {
  FIREFOX: "firefox",
  CHROME: "chrome",
};

const generateManifest = (browser: String = BROWSERS.FIREFOX) => {
  const useServiceWorker = browser === BROWSERS.CHROME;
  const manifest: any = {
    manifest_version: 3,
    name: "Leetcode Habit",
    version: process.env.npm_package_version,
    description: "Track your daily coding challenge on Leetcode.",

    icons: {
      "128": "icons/lit.png",
    },

    action: {
      default_icon: {
        "128": "icons/unlit.png",
      },
      default_title: "Leetcode Habit",
    },

    permissions: ["cookies", "alarms", "storage"],

    host_permissions: ["*://*.leetcode.com/*", "*://leetcode.com/*"],

    content_scripts: [
      {
        matches: ["*://*.leetcode.com/*"],
        js: ["content/index.js"],
        run_at: "document_start",
      },
    ],

    background: {
      scripts: useServiceWorker ? undefined : ["background/index.js"],
      type: "module",
      service_worker: useServiceWorker ? "background/index.js" : undefined,
    },

    web_accessible_resources: [
      {
        resources: ["inject/index.js"],
        matches: ["*://*.leetcode.com/*", "*://leetcode.com/*"],
      },
    ],
  };

  if (browser === BROWSERS.FIREFOX) {
    manifest.browser_specific_settings = {
      gecko: {
        id: "leetcode-habit@kandoan.com",
      },
    };
  }

  return manifest;
};

export const createManifestGenerator = () => {
  let outputDir = "dist";
  const targetBrowser = process.env.BROWSER;

  return {
    name: "manifestGenerator",
    configResolved: (resolvedConfig) => {
      outputDir = resolvedConfig.build.outDir || outputDir;
    },
    generateBundle: async () => {
      const outputPath = path.resolve(outputDir, "manifest.json");

      await writeFile(
        outputPath,
        JSON.stringify(generateManifest(targetBrowser), null, 2)
      );
    },
  } satisfies PluginOption;
};
