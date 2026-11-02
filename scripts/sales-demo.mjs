/**
 * Sales walkthrough: storefront → back office → till.
 * Records a Playwright video with on-screen pitch captions.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.DEMO_BASE || "http://localhost:3461";
const OUT = path.resolve("demo/raw");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function caption(page, kicker, line) {
  await page.evaluate(
    ({ kicker, line }) => {
      let el = document.getElementById("sales-caption");
      if (!el) {
        el = document.createElement("div");
        el.id = "sales-caption";
        el.style.cssText = [
          "position:fixed",
          "left:28px",
          "right:28px",
          "bottom:22px",
          "z-index:2147483646",
          "display:flex",
          "align-items:flex-end",
          "justify-content:space-between",
          "gap:24px",
          "pointer-events:none",
          "font-family:ui-sans-serif,system-ui,sans-serif",
        ].join(";");
        document.documentElement.appendChild(el);
      }
      el.innerHTML = `
        <div style="max-width:820px;background:#23301f;color:#efe9dc;border-radius:18px;padding:16px 20px;box-shadow:0 18px 50px rgba(35,48,31,.28)">
          <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#c4845a;font-weight:650">${kicker}</div>
          <div style="margin-top:6px;font-size:22px;line-height:1.25;font-weight:560">${line}</div>
        </div>
        <div style="background:#efe9dc;color:#23301f;border-radius:999px;padding:10px 14px;font-size:12px;font-weight:700;letter-spacing:.04em">Yeskoko · Edis Mart</div>
      `;
    },
    { kicker, line },
  );
}

async function hideChrome(page) {
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent =
      "nextjs-portal{display:none!important}#sales-caption{pointer-events:none}";
    document.documentElement.appendChild(style);
  });
}

async function go(page, url) {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(700);
}

async function scrollBy(page, px) {
  await page.evaluate((delta) => {
    const lenis = window.lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(window.scrollY + delta, { immediate: false });
      return;
    }
    window.scrollBy({ top: delta, behavior: "smooth" });
  }, px);
  await sleep(900);
}

async function card(page, title, body) {
  await page.setContent(`<!doctype html>
<html><head><meta charset="utf-8"/>
<style>
  html,body{margin:0;height:100%;background:#efe9dc;color:#23301f;font-family:Georgia,"Times New Roman",serif}
  .wrap{height:100%;display:flex;flex-direction:column;justify-content:center;padding:88px 96px;box-sizing:border-box}
  .k{font-family:ui-sans-serif,system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;font-size:14px;color:#b4623c;font-weight:700}
  h1{font-weight:500;font-size:78px;line-height:1.02;margin:18px 0 0;max-width:16ch}
  p{font-family:ui-sans-serif,system-ui,sans-serif;font-size:26px;line-height:1.45;max-width:36ch;color:#23301fcc;margin-top:28px}
</style></head>
<body><div class="wrap"><div class="k">Yeskoko by Edis Mart</div><h1>${title}</h1><p>${body}</p></div></body></html>`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(90000);
  page.setDefaultTimeout(20000);
  await hideChrome(page);

  await card(
    page,
    "A shop, a till, and a back office.",
    "Built for Yeskoko. Ready for Edis Mart to sell from — online and across the counter.",
  );
  await sleep(4200);

  await go(page, "/");
  await caption(
    page,
    "The storefront",
    "Customers land on fruit they can taste — not a blank catalogue.",
  );
  await sleep(2800);
  await scrollBy(page, 780);
  await caption(
    page,
    "The storefront",
    "The story is already written: dried in Accra, packed for the pantry.",
  );
  await sleep(2200);
  await scrollBy(page, 900);
  await sleep(1800);
  await scrollBy(page, 1100);
  await caption(
    page,
    "The storefront",
    "One clear next step. Shop the flakes.",
  );
  await sleep(2200);

  await go(page, "/shop");
  await caption(
    page,
    "The pantry",
    "Every pack has a size and a price. Retail first. Wholesale when they ask.",
  );
  await sleep(3200);

  await page.locator("a[href*='/product/']").first().click();
  await page.waitForTimeout(900);
  await caption(
    page,
    "The product",
    "Pick a size. Add to cart. Pay the Ghana way — MoMo, card, or cash.",
  );
  await sleep(3400);

  await go(page, "/about");
  await caption(
    page,
    "The house",
    "Yeskoko is the snack. Edis Mart is the Accra house behind it.",
  );
  await sleep(1800);
  await scrollBy(page, 700);
  await sleep(2200);

  await go(page, "/wholesale");
  await caption(
    page,
    "Wholesale",
    "Hotels and retailers send a WhatsApp. You quote from Accra.",
  );
  await sleep(2800);

  await card(
    page,
    "Now the desk.",
    "The same brand, behind the counter — orders, stock, production, and the till.",
  );
  await sleep(3200);

  await go(page, "/admin/login");
  await caption(page, "Ops", "Staff sign in. Owners see the books. Everyone else sees the work.");
  const email = page.locator('input[type="email"]');
  const password = page.locator('input[type="password"]');
  await email.click();
  await email.pressSequentially("mavis@edismart.com", { delay: 35 });
  await password.click();
  await password.pressSequentially("yeskoko123", { delay: 35 });
  await sleep(600);
  const hydrated = await page
    .waitForFunction(() => {
      const form = document.querySelector("form");
      if (!form) return false;
      return Object.keys(form).some(
        (k) => k.startsWith("__reactFiber") || k.startsWith("__reactProps"),
      );
    }, { timeout: 20000 })
    .then(() => true)
    .catch(() => false);

  if (hydrated) {
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/ops/login") && r.status() === 200,
      ),
      page.getByRole("button", { name: "Enter ops" }).click(),
    ]);
    await page.waitForURL(/\/admin\/?$/, { timeout: 20000 });
  } else {
    const login = await page.request.post(BASE + "/api/ops/login", {
      data: { email: "mavis@edismart.com", password: "yeskoko123" },
    });
    if (!login.ok()) throw new Error("Login failed " + login.status());
    await page.goto(BASE + "/admin", { waitUntil: "domcontentloaded" });
  }
  await caption(
    page,
    "Today",
    "Open the day and see the till, today’s sales, and what still needs packing.",
  );
  await sleep(3800);

  await go(page, "/admin/orders");
  await caption(
    page,
    "Orders",
    "Every till receipt in one place — review, print, or return stock.",
  );
  await sleep(3400);

  await go(page, "/admin/customers");
  await caption(
    page,
    "Customers",
    "Names and Ghana numbers, ready the next time they walk up to the till.",
  );
  await sleep(2800);

  await go(page, "/admin/stock");
  await caption(
    page,
    "Stock",
    "Finished Yeskoko packs. You always know what is left to sell.",
  );
  await sleep(2800);

  await go(page, "/admin/purchases");
  await caption(
    page,
    "Production",
    "Yeskoko makes its own stock — fruit in, chips and flakes out.",
  );
  await sleep(3000);

  await go(page, "/admin/reports");
  await caption(
    page,
    "Reports",
    "What sold, what it cost, and what the shelf is worth.",
  );
  await sleep(3000);

  await go(page, "/pos");
  await page.waitForTimeout(1200);
  const openTill = page.getByRole("button", { name: "Open till" });
  if (await openTill.isVisible().catch(() => false)) {
    await caption(page, "The till", "Open the drawer with a float. The session starts clean.");
    await page.locator('input[type="number"]').first().fill("200");
    await sleep(800);
    await openTill.click();
    await page.waitForTimeout(1500);
  }

  await caption(
    page,
    "The till",
    "Tap a pack. Pick the size. It lands in the sale — not lost under the fold.",
  );
  await page.waitForTimeout(800);
  await page
    .getByRole("button", { name: /coconut flakes/i })
    .first()
    .click({ force: true });
  await page.waitForTimeout(600);
  const sizeBtn = page.getByRole("button", { name: /^50g/ });
  if (await sizeBtn.isVisible().catch(() => false)) {
    await sizeBtn.click();
    await page.waitForTimeout(500);
  } else {
    const anySize = page.locator("button").filter({ hasText: /50g|100g|250g/ }).first();
    if (await anySize.isVisible().catch(() => false)) await anySize.click();
  }
  await sleep(1600);

  await caption(
    page,
    "The till",
    "MoMo, cash, bank — or split the bill. Charge, and the receipt opens.",
  );
  const popupPromise = page.waitForEvent("popup", { timeout: 12000 }).catch(() => null);
  await page.getByRole("button", { name: /^Charge/ }).click();
  const popup = await popupPromise;
  await sleep(1200);

  if (popup) {
    await popup.waitForLoadState("domcontentloaded");
    await caption(
      popup,
      "The receipt",
      "Your logo on top. The breakdown in the middle. Print it, or save a PDF.",
    );
    await sleep(4200);
    await popup.close();
  } else {
    await caption(
      page,
      "The receipt",
      "Charged. The last receipt is one tap away — print or save as PDF.",
    );
    await sleep(2500);
  }

  await card(
    page,
    "This is ready to sell with.",
    "A Yeskoko storefront, an Edis Mart back office, and a till that prints the receipt.",
  );
  await sleep(4500);

  const video = page.video();
  await context.close();
  await browser.close();
  if (video) {
    const saved = await video.path();
    console.log("VIDEO", saved);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
