# Leetcode Habit

**Leetcode Habit** is a small cross-browser extension that acts like the little fire icon on Leetcode's top bar, but instead as an extension so you can see it all the time while browsing the internet and so can remind yourself to do the daily challenge everyday.

<p align="center">

<img src="docs/chrome-completed.png"/>

When today challenge has been completed, it will show a streak count
</p>

<p align="center">

<img src="docs/firefox-pending.png"/>

When today challenge is yet to be completed, it will show a timer and the streak count
</p>

# How it's developed

It's a somewhat barebone setup to develop a Manifest V3 cross-browser extension with:
- **Vite**: the build tool
- **webextension-polyfill**: for an easier development because I don't have to care about using specific API for specific browser
- **web-ext**: help debug the extension easier on Firefox

# Build

As mentioned, the project is quite small and barebone so the build steps are quite scuffed so please bear with me.

To build the `dist` directory that can be loaded into browsers for debugging purpose:
```
npm run build
```

If you're using Firefox, you can also run this command so that it can automatically reload the extension when it's built, but you still have to run the build command each time though so not fully hot reloading like on webdev:
```
npm start
```

There is no way to automatically reload on Chrome yet.

To pack/bundle the extension, you have to do it manually.

# Todo

- Add tests. Yes, there is no test right now to get it done quickly.
- Implement auto rebuild in combination with auto reload to replicate hot reloading on webdev side.