const { test, expect } = require("@playwright/test");
async function ready(page) {
  await page.locator("#ready").click();
}
async function advance(page) {
  await page.locator("#action").click();
  await ready(page);
}
async function cook(page) {
  await page.clock.runFor(10000);
  await expect(page.locator("#action")).toHaveText("翻面 ↻");
  await page.locator("#action").click();
  await page.clock.runFor(10000);
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
}
async function toast(page, level) {
  await page.clock.runFor(50000 / (10 + level));
  await page.locator("#action").click();
}
async function plate(page) {
  for (let i = 0; i < 3; i++) {
    await page.locator(`[data-food="${i}"]`).click();
    await page.locator(`[data-target="${i}"]`).click();
  }
}
async function noOverflow(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const boxes = await page.locator("button:visible").evaluateAll((bs) =>
    bs.map((b) => {
      const r = b.getBoundingClientRect();
      return { text: b.textContent, x: r.x, right: r.right, w: r.width };
    }),
  );
  for (const b of boxes) {
    expect(b.x, JSON.stringify(b)).toBeGreaterThanOrEqual(-1);
    expect(b.right, JSON.stringify(b)).toBeLessThanOrEqual(
      (await page.viewportSize()).width + 1,
    );
  }
}
test("all ten levels: complete, unlock, scores, persistence and layouts", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator("[data-level]")).toHaveCount(10);
  await expect(page.locator('[data-level="1"]')).toBeDisabled();
  for (let level = 0; level < 10; level++) {
    await page.locator(`[data-level="${level}"]`).click();
    await page.locator("#begin").click();
    await ready(page);
    for (let i = 0; i < [1, 1, 2, 2, 2, 3, 3, 3, 4, 4][level]; i++)
      await page.locator("#action").click();
    await advance(page);
    for (let i = 0; i < Math.ceil(1.5 + level * 0.5); i++)
      await page.locator("#action").click();
    await advance(page);
    await cook(page);
    await advance(page);
    await toast(page, level);
    await advance(page);
    await expect(page.locator("#action")).toBeDisabled();
    await plate(page);
    await page.locator("#action").click();
    await page.locator("#action").click();
    await expect(page.locator(".result-score")).toHaveText("100 / 100 分");
    await noOverflow(page);
    if (level === 9)
      await expect(page.locator("h1")).toContainText("十關主廚畢業");
    await page.locator("#map").click();
  }
  await page.reload();
  await expect(page.locator(".level:disabled")).toHaveCount(0);
  await expect(page.locator("#journey")).toContainText("10 / 10");
  expect(errors).toEqual([]);
});
test("pause freezes cooking and countdown; timeout permits retry", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "kitchen-dash-v3",
      JSON.stringify({ best: Array(10).fill(0), unlocked: 1 }),
    ),
  );
  await page.reload();
  await page.locator('[data-level="1"]').click();
  await page.locator("#begin").click();
  await ready(page);
  await page.clock.runFor(3000);
  await page.locator("#pause").click();
  const before = await page.locator("#timer").textContent();
  await page.clock.runFor(20000);
  expect(await page.locator("#timer").textContent()).toBe(before);
  await page.locator("#resume").click();
  await page.clock.runFor(150000);
  await expect(page.locator("h1")).toContainText("時間到了");
  await page.locator("#retry").click();
  await expect(page.locator(".start-overlay")).toBeVisible();
});
test("pointer gestures: crack, stir, drag and pointer cancellation", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.locator("#continue").click();
  await page.locator("#begin").click();
  await ready(page);
  const egg = await page.locator("#egg").boundingBox();
  await page.mouse.move(egg.x + 60, egg.y + 30);
  await page.mouse.down();
  await page.mouse.move(egg.x + 60, egg.y + 130, { steps: 10 });
  await page.mouse.up();
  await advance(page);
  const bowl = await page.locator("#mixBowl").boundingBox();
  const cx = bowl.x + bowl.width / 2,
    cy = bowl.y + bowl.height / 2;
  await page.mouse.move(cx + 90, cy);
  await page.mouse.down();
  for (let i = 1; i <= 110; i++) {
    const a = i * 0.1;
    await page.mouse.move(cx + 90 * Math.cos(a), cy + 90 * Math.sin(a));
  }
  await page.mouse.up();
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
  await advance(page);
  await cook(page);
  await advance(page);
  await toast(page, 0);
  await advance(page);
  const food = page.locator('[data-food="0"]'),
    f = await food.boundingBox(),
    t = await page.locator('[data-target="0"]').boundingBox();
  await page.mouse.move(f.x + 33, f.y + 33);
  await page.mouse.down();
  await page.mouse.move(t.x + 30, t.y + 30, { steps: 10 });
  await page.mouse.up();
  await expect(food).toBeDisabled();
});
for (const width of [320, 375, 390, 768, 1280])
  test(`responsive ${width}: home and all five steps`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 740 : 900 });
    await page.clock.install();
    await page.goto("/");
    await noOverflow(page);
    if ([390, 1280].includes(width))
      await page.screenshot({
        path: `docs/screenshots/home-${width}.png`,
        fullPage: true,
      });
    await page.locator("#continue").click();
    await noOverflow(page);
    await page.locator("#begin").click();
    for (let step = 0; step < 5; step++) {
      await noOverflow(page);
      await ready(page);
      await noOverflow(page);
      if ([390, 1280].includes(width))
        await page.screenshot({
          path: `docs/screenshots/step-${step + 1}-${width}.png`,
          fullPage: true,
        });
      if (step === 0) await page.locator("#action").click();
      if (step === 1) {
        await page.locator("#action").click();
        await page.locator("#action").click();
      }
      if (step === 2) await cook(page);
      if (step === 3) await toast(page, 0);
      if (step === 4) {
        await plate(page);
        break;
      }
      await page.locator("#action").click();
    }
  });
test("touch device: pointer swipe and tap pairing", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.clock.install();
  await page.goto("http://127.0.0.1:4173");
  await page.locator("#continue").tap();
  await page.locator("#begin").tap();
  await page.locator("#ready").tap();
  const r = await page.locator("#egg").boundingBox();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: r.x + 60, y: r.y + 25 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: r.x + 60, y: r.y + 125 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
  await page.clock.runFor(500);
  await page.locator("#action").tap();
  await expect(page.locator(".start-overlay")).toBeVisible();
  await page.locator("#ready").tap();
  await page.locator("#action").tap();
  await page.locator("#action").tap();
  await advance(page);
  await cook(page);
  await advance(page);
  await toast(page, 0);
  await advance(page);
  for (let i = 0; i < 3; i++) {
    await page.locator(`[data-food="${i}"]`).tap();
    await page.locator(`[data-target="${i}"]`).tap();
  }
  await expect(page.locator("#action")).toBeEnabled();
  await context.close();
});

test("iPad: hold mixing, flip gate, heat buttons and custom plating survive rotation", async ({ browser }) => {
  const context = await browser.newContext({ viewport: {width:768,height:1024}, hasTouch:true });
  const page = await context.newPage();
  await page.clock.install();
  await page.goto("http://127.0.0.1:4173");
  await page.locator("#continue").tap();
  await page.locator("#begin").tap();
  await ready(page);
  await page.locator("#action").tap();
  await advance(page);
  const hold = await page.locator("#holdMix").boundingBox();
  await page.mouse.move(hold.x+20,hold.y+20);
  await page.mouse.down();
  await page.clock.runFor(2500);
  await page.mouse.up();
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
  await advance(page);
  await page.getByRole("button",{name:"大火",exact:true}).tap();
  await expect(page.locator("#heat")).toHaveValue("80");
  await page.getByRole("button",{name:"中火",exact:true}).tap();
  await page.clock.runFor(18000);
  await expect(page.locator("#action")).toHaveText("翻面 ↻");
  await expect(page.locator("#progress")).toHaveText("熟度 50%");
  await page.locator("#pause").tap();
  await page.clock.runFor(3000);
  await expect(page.locator("#progress")).toHaveText("熟度 50%");
  await page.locator("#resume").tap();
  await page.locator("#action").tap();
  await page.clock.runFor(10000);
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
  await advance(page);
  await toast(page,0);
  await advance(page);
  await page.locator("#freePlate").tap();
  const stageBox = await page.locator("#stage").boundingBox();
  const offsets = [[-55,-35],[45,-35],[0,38]];
  for (let i=0;i<3;i++) {
    await page.locator(`[data-food="${i}"]`).tap();
    await page.locator("#stage").tap({position:{x:stageBox.width/2+offsets[i][0],y:150+offsets[i][1]}});
  }
  await expect(page.locator("#action")).toBeEnabled();
  await page.setViewportSize({width:1024,height:768});
  await noOverflow(page);
  await expect(page.locator(".plating-food.placed")).toHaveCount(3);
  await page.screenshot({path:"docs/screenshots/free-plate-ipad.png",fullPage:true});
  await page.locator("#action").tap();
  await page.locator("#action").tap();
  await expect(page.locator(".custom-dish span")).toHaveCount(3);
  await context.close();
});

test("iPhone size: level two touch circles keep the spoon centered and complete mixing", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  });
  const page = await context.newPage();
  await page.clock.install();
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => localStorage.setItem("kitchen-dash-v3", JSON.stringify({best:[100], unlocked:1})));
  await page.reload();
  await page.locator('[data-level="1"]').tap();
  await page.locator("#begin").tap();
  await page.locator("#ready").tap();
  await page.locator("#action").tap();
  await page.locator("#action").tap();
  await expect(page.locator(".start-overlay")).toBeVisible();
  await expect(page.locator("#progress")).toHaveText("0 / 2 圈");
  await page.locator("#ready").tap();
  await page.locator("#mixBowl").scrollIntoViewIfNeeded();
  const bowl = await page.locator("#mixBowl").boundingBox();
  const cx = bowl.x + bowl.width / 2, cy = bowl.y + bowl.height / 2;
  const cdp = await context.newCDPSession(page);
  async function move(a, start = false) {
    const x = cx + 32 * Math.cos(a), y = cy + 32 * Math.sin(a);
    await cdp.send("Input.dispatchTouchEvent", {
      type: start ? "touchStart" : "touchMove", touchPoints: [{x,y}],
    });
  }
  await move(0, true);
  for (let i = 1; i <= 17; i++) {
    await move(i * 0.85);
    const centered = await page.locator(".mix-spoon").evaluate(el => {
      const s = el.getBoundingClientRect(), b = el.parentElement.getBoundingClientRect();
      return Math.hypot(s.x+s.width/2-b.x-b.width/2, s.y+s.height/2-b.y-b.height/2);
    });
    expect(centered).toBeLessThan(1);
  }
  await cdp.send("Input.dispatchTouchEvent", {type:"touchEnd",touchPoints:[]});
  await expect(page.locator("#progress")).toHaveText("✓ 完成");
  await page.screenshot({path:"docs/screenshots/iphone-mixing-chromium.png",fullPage:true});
  await page.locator("#action").tap();
  await expect(page.locator("#stepTitle")).toContainText("煎蛋");
  await context.close();
});
