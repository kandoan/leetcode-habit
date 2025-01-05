# Leetcode Habit

**Leetcode Habit** is a small cross-browser extension that acts like the little fire icon on Leetcode's top bar, but instead as an extension so you can see it all the time while browsing the internet and so can remind yourself to do the daily challenge everyday.

<p align="center">
<img src="docs/chrome-completed.png"/>
</p>
<p align="center">
<i>When today challenge has been completed, it will show a streak count</i>
</p>

<p align="center">
<img src="docs/firefox-pending.png"/>
</p>
<p align="center">
<i>When today challenge is yet to be completed, it will show a timer and the streak count</i>
</p>

# Installation

Download the extension file at https://github.com/kandoan/leetcode-habit/releases/

Choose the file appropriate to the browser you are using, and then install it accordingly.

# How it's developed

It's a somewhat barebone setup to develop a Manifest V3 cross-browser extension with:
- **Vite**: the build tool
- **webextension-polyfill**: for an easier development because I don't have to care about using specific API for specific browser
- **web-ext**: help debug the extension easier on Firefox

# Build

As mentioned, the project is quite small and barebone so the build steps are quite scuffed so please bear with me.

### Build /dist/ dir for manual debug installing
Use 1 of the command below, depending on which browser you're targeting, to build the `dist` directory that can be manually loaded into browsers for debugging purpose:
```
npm run build:firefox
npm run build:chrome
```

### Auto rebuild & reload
If you're using Firefox, you can also run this command so that it can automatically rebuild and reload the extension to have an easier development time:
```
npm start
```

There is no way to do it automatically on Chrome yet.

### Package & release
To package/bundle the extension for Firefox, and also sign:
```
npm run build:firefox
npm run package:firefox
npm run sign:firefox
```

You need to retrieve the API key & API secret of AMO and store them in the env var `AMO_API_KEY` and `AMO_API_SECRET` for the signing step.

For Chrome, currently it has to be done manually.

# Todo

- Add tests. Yes, there is no test right now, just to get it done quick (and dirty).
