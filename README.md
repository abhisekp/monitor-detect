# Monitor Detect

Detect whether more than one monitor is attached using Node.js and systeminformation.

## Native utility

Use a current Node.js LTS release:

```sh
git clone https://github.com/abhisekp/monitor-detect.git
cd monitor-detect
npm ci
node monitor_detect.js
```

Run in an interactive terminal: the utility waits for a key before exiting.

## Interactive demo

The static demo lives in `docs/`. It includes single, dual, and triple sample layouts, permission-based live browser detection, automatic screen-change updates, and a JSON export clearly identifying sample versus live data.

No build, backend, API keys, or extra dependencies are required. Serve the repository locally, for example with `python -m http.server 8080`, then open http://localhost:8080/docs/.

Live detection uses the experimental Window Management API on supported browsers (typically desktop Chrome/Edge), over HTTPS or localhost, after a user clicks and grants permission. Unsupported browsers and denied permissions are explained without inventing a monitor count. Resolutions are CSS pixels, and mirrored displays may not appear separately. This browser demo does not run the Node.js utility and cannot replace OS-level detection. No screen data is transmitted or persisted.

API reference: https://developer.mozilla.org/en-US/docs/Web/API/Window/getScreenDetails

## Deploy to GitHub Pages

1. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source (requires repository administration access).
2. Merge the demo changes into `master`. The `Deploy demo to GitHub Pages` workflow checks the JavaScript and publishes `docs/`.
3. For redeployment, run that workflow manually from **Actions**, or push changes under `docs/` to `master`.

Expected URL after successful deployment: https://abhisekp.github.io/monitor-detect/

The workflow attempts automatic Pages enablement. If organization policy or token permissions prevent it, complete step 1 manually and rerun. For forks, GitHub supplies the deployment URL automatically; all assets use relative paths so project subdirectories work.

Alternatively, select **Deploy from a branch**, `master`, and `/docs` in Pages settings, then disable the Actions deployment workflow to avoid competing deployments.

## Validation

```sh
node --check docs/app.js
```

Manual checks: switch all sample layouts; export and inspect the mode and display count; test unsupported browsers, denied permission, granted permission, and live display connection changes. Check a narrow viewport and keyboard navigation.
