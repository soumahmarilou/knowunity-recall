#!/usr/bin/env node
/**
 * Hard-gate check: every tappable control must have a real, reachable
 * hit area of 44x44 CSS px or larger — measured functionally, not just
 * read off getBoundingClientRect(). A control's *visible* box can be
 * smaller than 44pt if an invisible ::before/::after (or padding, or
 * anything else) genuinely expands where a tap actually lands; a naive
 * bounding-box check would misreport that as a failure, which is
 * exactly what happened across two rounds of eval/scorecard-*.md before
 * this became a script instead of something a human eval had to catch.
 *
 * Method: for each button, sample the four points 22px out from its
 * center (up/down/left/right — half of the 44pt floor) and confirm
 * document.elementFromPoint() at each one still resolves back to that
 * button. This is mechanism-agnostic (works whether the expansion comes
 * from a pseudo-element, padding, or anything else) and matches exactly
 * how this was verified by hand during eval/scorecard-02.md: real
 * off-box clicks confirming a real navigation/state-change fired.
 *
 * Route coverage is intentionally partial, same precedent as
 * check:tokens only scanning src/components rather than the whole app —
 * grow ROUTES below as new screens are built (see .claude/skills/
 * build-screen's own touch-target checklist item).
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import http from "node:http";

const PORT = process.env.CHECK_TOUCH_TARGETS_PORT || 3000;
const BASE = `http://localhost:${PORT}`;
const MIN_PT = 44;
const HALF = MIN_PT / 2;

const ROUTES = [
  "/",
  "/study-plan",
  "/recall?subject=Photosynthesis",
  "/recall/guided-reflection?subject=Photosynthesis&entry=home",
  "/recall/concept-questions?subject=Photosynthesis&entry=home",
  "/recall/free-recall-challenge?subject=Photosynthesis&entry=home",
];

function pingServer(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = async () => {
      if (await pingServer(url)) return resolve();
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Dev server didn't come up at ${url} within ${timeoutMs}ms`));
      } else {
        setTimeout(tryOnce, 300);
      }
    };
    tryOnce();
  });
}

async function checkRoute(context, route, failures) {
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });

  const controls = page.locator("button:not(:disabled), [role='button']:not([aria-disabled='true'])");
  const count = await controls.count();

  for (let i = 0; i < count; i++) {
    const result = await controls.nth(i).evaluate((el, half) => {
      // el.closest() doesn't cross shadow boundaries, and Next.js's dev
      // toolbar renders inside a <nextjs-portal> shadow root — walk up
      // through parentElement, and through the shadow host when a
      // shadow boundary is hit, so this actually finds it.
      function closestAcrossShadow(node, selector) {
        while (node) {
          if (node.matches && node.matches(selector)) return node;
          node = node.parentElement || (node.getRootNode && node.getRootNode().host) || null;
        }
        return null;
      }

      // Dev-mode-only chrome (Next.js's own dev toolbar) isn't a real
      // shipped control — never gate on it.
      if (closestAcrossShadow(el, "nextjs-portal")) return null;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null; // not actually rendered
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Off-screen (e.g. scrolled out of view inside a horizontal-scroll
      // row) isn't a size defect — skip rather than mis-measure it against
      // whatever happens to be visually underneath its true position.
      if (cx < 0 || cx > vw || cy < 0 || cy > vh) return null;

      const points = [
        [cx - half, cy],
        [cx + half, cy],
        [cx, cy - half],
        [cx, cy + half],
      ];
      const misses = [];
      for (const [rawX, rawY] of points) {
        const x = Math.min(Math.max(rawX, 0), vw - 1);
        const y = Math.min(Math.max(rawY, 0), vh - 1);
        const hit = document.elementFromPoint(x, y);
        // A sample point landing on the dev toolbar overlay is a testing
        // artifact (the overlay physically sits above real content in
        // dev mode only) — inconclusive, not a miss, so it's skipped
        // rather than counted against the control.
        if (hit && closestAcrossShadow(hit, "nextjs-portal")) continue;
        const resolved =
          hit &&
          (hit === el ||
            el.contains(hit) ||
            closestAcrossShadow(hit, "button, [role='button']") === el);
        if (!resolved) misses.push([Math.round(x), Math.round(y)]);
      }
      return {
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48),
        visW: Math.round(rect.width * 10) / 10,
        visH: Math.round(rect.height * 10) / 10,
        missCount: misses.length,
      };
    }, HALF);

    if (result && result.missCount > 0) {
      failures.push({ route, ...result });
    }
  }

  await page.close();
}

async function main() {
  // Reuse a dev server that's already running on PORT (the common case —
  // Next.js 16 refuses to start a second one for this project even on a
  // different port) rather than always spawning our own.
  const alreadyRunning = await pingServer(BASE);
  const server = alreadyRunning
    ? null
    : spawn("npx", ["next", "dev", "-p", String(PORT)], { stdio: "ignore", cwd: process.cwd() });

  let exitCode = 0;
  try {
    await waitForServer(BASE);

    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "dark" });

    const failures = [];
    for (const route of ROUTES) {
      await checkRoute(context, route, failures);
    }

    await browser.close();

    if (failures.length > 0) {
      console.error(`FAIL: ${failures.length} control(s) with a functional hit area under ${MIN_PT}x${MIN_PT}pt:\n`);
      for (const f of failures) {
        console.error(`  ${f.route}  "${f.label}"  visible ${f.visW}x${f.visH}px, ${f.missCount}/4 edge point(s) missed`);
      }
      exitCode = 1;
    } else {
      console.log(
        `PASS: every tappable control across ${ROUTES.length} route(s) has a functional hit area of at least ${MIN_PT}x${MIN_PT}pt.`,
      );
    }
  } finally {
    // Only kill a server we spawned ourselves — never tear down one a
    // developer already had running.
    if (server) server.kill();
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
