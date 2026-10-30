"use strict";
(() => {
  const levels = [
    {
      name: "第一份早餐",
      dish: "陽光早餐",
      icon: "🍳",
      note: "慢慢來，熟悉廚房",
      time: 0,
      rounds: 1,
      stir: 1.5,
      window: 36,
      speed: 10,
      drift: 0,
      tolerance: 45,
    },
    {
      name: "早安多士店",
      dish: "香脆多士餐",
      icon: "🍞",
      note: "練習金黃彈出時機",
      time: 150,
      rounds: 1,
      stir: 2,
      window: 32,
      speed: 11,
      drift: 0,
      tolerance: 43,
    },
    {
      name: "雙蛋好心情",
      dish: "雙蛋能量餐",
      icon: "🥚",
      note: "多一顆蛋，多一點節奏",
      time: 145,
      rounds: 2,
      stir: 2.5,
      window: 29,
      speed: 12,
      drift: 1,
      tolerance: 41,
    },
    {
      name: "週末小食堂",
      dish: "田園早餐",
      icon: "🥗",
      note: "火候開始有小變化",
      time: 140,
      rounds: 2,
      stir: 3,
      window: 26,
      speed: 13,
      drift: 4,
      tolerance: 39,
    },
    {
      name: "午間人氣王",
      dish: "香腸早午餐",
      icon: "🌭",
      note: "更快出餐，擺得漂亮",
      time: 130,
      rounds: 2,
      stir: 3.5,
      window: 23,
      speed: 14,
      drift: 6,
      tolerance: 37,
    },
    {
      name: "城市咖啡館",
      dish: "法式輕食盤",
      icon: "🥐",
      note: "縮小金黃區，精準出手",
      time: 120,
      rounds: 3,
      stir: 4,
      window: 20,
      speed: 15,
      drift: 8,
      tolerance: 35,
    },
    {
      name: "繁忙早市",
      dish: "豐盛三蛋餐",
      icon: "🥘",
      note: "顧好火，也顧好時間",
      time: 110,
      rounds: 3,
      stir: 4.5,
      window: 18,
      speed: 16,
      drift: 10,
      tolerance: 33,
    },
    {
      name: "海邊早午餐",
      dish: "海風精緻餐",
      icon: "🍱",
      note: "穩定火候，細心擺盤",
      time: 100,
      rounds: 3,
      stir: 5,
      window: 16,
      speed: 17,
      drift: 12,
      tolerance: 31,
    },
    {
      name: "星級試業日",
      dish: "主廚特選餐",
      icon: "🍽️",
      note: "四顆蛋與更嚴格的節奏",
      time: 90,
      rounds: 4,
      stir: 5.5,
      window: 14,
      speed: 18,
      drift: 14,
      tolerance: 29,
    },
    {
      name: "主廚的盛宴",
      dish: "十全主廚盛宴",
      icon: "👑",
      note: "集齊技巧，完成最終考驗",
      time: 80,
      rounds: 4,
      stir: 6,
      window: 12,
      speed: 19,
      drift: 16,
      tolerance: 27,
    },
  ];
  const steps = ["打蛋", "攪拌", "煎蛋", "多士", "擺盤"];
  const A = window.KitchenArt,
    levelArt = (i, c = "") => A[A.levelArt[i]](c),
    stepArt = (i, c = "") => A[A.stepArt[i]](c),
    foodArt = ["friedEgg", "toast", "sausage"],
    foodName = ["煎蛋", "多士", "香腸"];
  document.querySelector(".brand-icon").innerHTML = A.pan();
  document.querySelector(".dialog-icon").innerHTML = A.coffee();
  const app = document.querySelector("#app"),
    dialog = document.querySelector("dialog");
  let saved = { best: Array(10).fill(0), unlocked: 0 },
    storageOK = true;
  try {
    const raw = JSON.parse(localStorage.getItem("kitchen-dash-v3"));
    if (raw && Array.isArray(raw.best)) {
      saved.best = saved.best.map((_, i) =>
        Math.max(0, Math.min(100, Number(raw.best[i]) || 0)),
      );
      saved.unlocked = Math.max(
        0,
        Math.min(9, Math.floor(Number(raw.unlocked) || 0)),
      );
    }
  } catch {
    storageOK = false;
  }
  let state = null,
    view = "home",
    sound = false,
    audio = null;
  const $ = (s) => app.querySelector(s),
    clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const toastFilter = (b) =>
    `brightness(${(1.22 - b * 0.0048).toFixed(3)}) saturate(${(0.55 + b * 0.009).toFixed(3)})`;
  const starCount = (n) => (n >= 90 ? 3 : n >= 72 ? 2 : n >= 55 ? 1 : 0);
  const stars = (n) => "★".repeat(starCount(n)) + "☆".repeat(3 - starCount(n));
  function beep(good = true) {
    if (!sound) return;
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      audio.resume();
      const o = audio.createOscillator(),
        g = audio.createGain();
      o.connect(g);
      g.connect(audio.destination);
      o.frequency.value = good ? 660 : 240;
      g.gain.setValueAtTime(0.045, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.13);
      o.start();
      o.stop(audio.currentTime + 0.13);
    } catch {}
  }
  document.querySelector("#sound").onclick = (e) => {
    sound = !sound;
    e.currentTarget.textContent = sound ? "♪ 音效開" : "♪ 音效關";
    e.currentTarget.setAttribute("aria-pressed", String(sound));
    e.currentTarget.setAttribute("aria-label", sound ? "關閉音效" : "開啟音效");
    beep();
  };
  // A touch on the action button is handled at pointerup; the browser's own
  // click that follows lands on whatever the re-rendered screen put there.
  let touchTap = null;
  document.addEventListener(
    "click",
    (e) => {
      if (
        e.isTrusted &&
        touchTap &&
        performance.now() - touchTap.t < 600 &&
        Math.hypot(e.clientX - touchTap.x, e.clientY - touchTap.y) < 16
      ) {
        touchTap = null;
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );
  function persist() {
    try {
      localStorage.setItem("kitchen-dash-v3", JSON.stringify(saved));
    } catch {
      storageOK = false;
    }
  }
  function focusTitle() {
    requestAnimationFrame(() => {
      const el = $("h1");
      if (el) {
        el.tabIndex = -1;
        el.focus({ preventScroll: true });
      }
    });
    window.scrollTo(0, 0);
  }
  function home() {
    view = "home";
    state = null;
    const cleared = saved.best.filter((n) => n >= 55).length;
    app.innerHTML = `<section class="hero"><div class="hero-copy"><p class="eyebrow">A LITTLE KITCHEN, A BIG ADVENTURE</p><h1>把每個早晨，<br><span class="mark">煮成好心情。</span></h1><p class="muted">從打開第一顆蛋，到端出主廚盛宴。<br>10 關料理小冒險，陪你慢慢練成大廚。</p><div class="hero-actions"><button class="primary" id="continue">${cleared ? "繼續我的旅程" : "開始第一份早餐"} <span aria-hidden="true">↗</span></button><span class="tiny">滑動・畫圓・掌握火候</span></div></div><div class="hero-art" role="img" aria-label="一盤美味早餐插畫"><span class="hero-sun"></span><span class="leaf">${A.leaf()}</span><span class="leaf leaf-two">${A.leaf()}</span><span class="hero-dish">${A.hero()}</span><span class="hero-cup">${A.coffee()}</span><span class="art-tag one">新手也能輕鬆上手 ✨</span><span class="art-tag two">今日菜單：一點點成就感</span></div></section><section aria-labelledby="journey"><div class="section-head"><h2 id="journey">你的料理旅程 <span class="tiny">${cleared} / 10</span></h2><span class="legend">55 分過關 · 90 分三星</span></div><div class="levels">${levels.map((l, i) => `<button class="level ${i === saved.unlocked ? "next" : ""}" data-level="${i}" ${i > saved.unlocked ? "disabled" : ""} aria-label="第 ${i + 1} 關 ${l.name}${i > saved.unlocked ? "，尚未解鎖" : ""}"><span class="level-top"><span>LEVEL ${String(i + 1).padStart(2, "0")}</span><span class="level-badge ${i > saved.unlocked ? "locked" : saved.best[i] >= 55 ? "cleared" : ""}">${i > saved.unlocked ? A.lock() : saved.best[i] >= 55 ? "✓" : "↗"}</span></span><span class="level-food" style="--tint:${A.levelTint[i]}">${levelArt(i)}</span><strong>${l.name}</strong><span class="description">${l.note}</span><span class="stars">${stars(saved.best[i])}</span></button>`).join("")}</div><div class="journey-bar" aria-hidden="true"><span style="width:${cleared * 10}%"></span></div><div class="footer-note"><span>🌱 不用一次完美，每次練習都會更好。</span><span>${storageOK ? "進度自動儲存在此瀏覽器" : "無法儲存進度，請允許瀏覽器使用本機儲存"}</span></div></section>`;
    $("#continue").onclick = () => brief(saved.unlocked);
    app
      .querySelectorAll("[data-level]")
      .forEach((b) => (b.onclick = () => brief(+b.dataset.level)));
    focusTitle();
  }
  function brief(i) {
    if (i > saved.unlocked) return;
    view = "brief";
    const l = levels[i];
    app.innerHTML = `<section class="brief"><div class="brief-art" style="--tint:${A.levelTint[i]}"><span class="brief-num">${String(i + 1).padStart(2, "0")}</span><span class="brief-dish">${levelArt(i)}</span><div class="brief-steps" aria-hidden="true">${steps.map((t, k) => `<span>${stepArt(k)}<small>${t}</small></span>`).join("")}</div></div><div class="brief-copy"><span class="eyebrow">LEVEL ${String(i + 1).padStart(2, "0")} / 10</span><h1>${l.name}</h1><p class="muted">今日訂單：<b>${l.dish}</b><br>${l.note}。完成五個步驟，累積至少 55 分即可解鎖下一關。</p><div class="brief-facts"><span><b>${l.rounds}</b>顆蛋</span><span><b>${l.stir}</b>圈攪拌</span><span><b>${l.time || "∞"}</b>${l.time ? "秒" : "不限時"}</span><span><b>${saved.best[i]}</b>最佳分</span></div><p class="tiny">每步都先看提示，再按開始。提示與休息不計時；支援觸控、滑鼠和鍵盤。</p><button class="primary" id="begin">穿上圍裙，開始！</button><button class="secondary" id="back">返回料理旅程</button></div></section>`;
    $("#begin").onclick = () => start(i);
    $("#back").onclick = home;
    focusTitle();
  }
  function start(i) {
    state = {
      level: i,
      step: 0,
      scores: [],
      remaining: levels[i].time,
      running: false,
      paused: false,
      done: false,
      cracks: 0,
      mix: 0,
      cook: 0,
      flipped: false,
      freePlate: false,
      positions: {},
      burn: 0,
      temp: 50,
      heat: 42,
      brown: 0,
      elapsed: 0,
      placed: new Set(),
      selected: null,
    };
    renderStep();
  }
  const instructions = [
    [
      "向下打開雞蛋",
      "從蛋上往下滑至少 60 像素。也可以點雞蛋，再按下方「打開雞蛋」。",
    ],
    [
      "沿著碗邊畫圓",
      "按住碗邊順時針或逆時針畫圓。也可按住下方「按住攪拌」；鍵盤可使用「攪拌一圈」按鈕。",
    ],
    [
      "把火候留在綠色區",
      "用滑桿調整火力，使溫度維持在 65–95°C。熟度達 50% 時按「翻面」，再煎至 100%。也可用小火／中火／大火按鈕。",
    ],
    [
      "金黃色，就彈出！",
      "游標進入綠框時按「彈出多士」。後面的關卡會烘得更快，綠框也更窄。",
    ],
    [
      "讓每樣食物找到位置",
      "拖動食物到相同圖案的虛線圈。也可以先點食物，再點目標圈；鍵盤使用 Tab 和 Enter。也可切換「自由擺盤」，在碟上點選或拖放，自訂位置。",
    ],
  ];
  function renderStep() {
    view = "game";
    const s = state,
      l = levels[s.level],
      n = s.step;
    s.running = false;
    s.done = false;
    s.paused = false;
    s.selected = null;
    const progress =
      n === 0
        ? `${s.cracks} / ${l.rounds} 顆`
        : n === 1
          ? `${Math.floor(s.mix * 10) / 10} / ${l.stir} 圈`
          : n === 2
            ? "熟度 0%"
            : n === 3
              ? "等待烘烤"
              : `0 / 3 已擺盤`;
    app.innerHTML = `<div class="game-top"><div><span class="eyebrow">LEVEL ${String(s.level + 1).padStart(2, "0")} / 10</span><h1>${l.name}</h1></div><div class="game-tools"><button class="secondary" id="pause">Ⅱ 暫停</button></div></div><nav class="stepper" aria-label="料理進度">${steps.map((t, i) => `<div class="step ${i === n ? "current" : i < n ? "done" : ""}" ${i === n ? 'aria-current="step"' : ""}><span class="step-icon">${i < n ? "✓" : stepArt(i)}</span><span>${t}</span></div>`).join("")}</nav><div class="workspace"><section class="kitchen" aria-labelledby="stepTitle"><div class="stage-heading"><h2 id="stepTitle"><span class="title-icon">${stepArt(n)}</span>${steps[n]}</h2><span class="pill" id="progress">${progress}</span></div><div class="stage stage-${n}" id="stage">${stageMarkup(n, l)}<div class="start-overlay"><span class="big-icon">${stepArt(n)}</span><h3>${instructions[n][0]}</h3><p>${instructions[n][1]}</p><button class="primary" id="ready">我準備好了 →</button></div></div>${n === 2 ? '<label class="heat-control"><span class="flame-icon" aria-hidden="true"></span>火力 <input id="heat" aria-label="火力百分比" type="range" min="0" max="100" value="42"><b id="heatValue">42%</b></label>' : ""}<div class="game-footer"><div class="feedback" id="feedback" role="status" aria-live="polite">先看看提示，準備好才開始。</div><button class="primary action" id="action" disabled>${["打開雞蛋 ↓", "攪拌一圈 ↻", "等待翻面…", "彈出多士 ↑", "完成擺盤 ✓"][n]}</button></div></section><aside class="sidebar"><div class="side-card"><h3>今日的訂單</h3><div class="order-dish" style="--tint:${A.levelTint[s.level]}">${levelArt(s.level)}</div><div class="order-name">${l.dish}</div><div class="order-meta">第 ${n + 1} / 5 個步驟 · ${l.rounds} 顆蛋</div></div><div class="side-card"><div class="stat"><span>剩餘時間</span><strong id="timer">${l.time ? Math.ceil(s.remaining) + "s" : "∞"}</strong></div><div class="meter"><span id="timeFill" style="width:100%"></span></div><div class="stat" style="margin-top:18px;margin-bottom:0"><span>目前分數</span><strong id="score">${s.scores.reduce((a, b) => a + b, 0)}<small class="tiny"> / 100</small></strong></div></div><div class="coach"><span class="coach-face">${A.chef()}</span><b>主廚筆記</b><br><span id="coach">${["先穩穩打開，再追求速度。", "畫大一點、慢一點，順暢最重要。", "鍋子升溫需要時間，不必一直拉到最大火。", "綠框是理想的金黃區；看準再出手。", "每樣食物都有自己的位置，別急著上菜。"][n]}</span></div></aside></div>`;
    $("#ready").onclick = () => {
      $(".start-overlay").remove();
      s.running = true;
      $("#action").disabled = n === 2 || n === 4;
      $("#feedback").textContent = instructions[n][0];
      if (n === 0) $("#egg").focus();
    };
    $("#pause").onclick = pause;
    $("#action").onclick = action;
    const actionButton = $("#action");
    actionButton.addEventListener("pointerup", (e) => {
      if (e.pointerType === "touch" && !actionButton.disabled) {
        touchTap = { x: e.clientX, y: e.clientY, t: performance.now() };
        e.preventDefault();
        actionButton.click();
      }
    });
    if (n === 2)
      $("#heat").oninput = (e) => {
        s.heat = +e.target.value;
        $("#heatValue").textContent = s.heat + "%";
      };
    if (n === 2) {
      const controls = document.createElement("div");
      controls.className = "extra-controls";
      controls.innerHTML = '<button class="secondary" data-heat="20">小火</button><button class="secondary" data-heat="42">中火</button><button class="secondary" data-heat="80">大火</button>';
      $(".heat-control").after(controls);
      controls.querySelectorAll("button").forEach(b => b.onclick = () => {
        if (!active()) return;
        s.heat = +b.dataset.heat;
        $("#heat").value = s.heat;
        $("#heatValue").textContent = s.heat + "%";
      });
    }
    if (n === 1) {
      const hold = document.createElement("button");
      hold.className = "secondary hold-mix";
      hold.id = "holdMix";
      hold.textContent = "按住攪拌 ↻";
      $(".game-footer").before(hold);
      hold.onpointerdown = e => {
        if (!active()) return;
        hold.setPointerCapture(e.pointerId);
        s.holding = true;
      };
      hold.onpointerup = hold.onpointercancel = hold.onlostpointercapture = () => s.holding = false;
    }
    if (n === 4) {
      const controls = document.createElement("div");
      controls.className = "extra-controls";
      controls.innerHTML = '<button class="secondary" id="freePlate" aria-pressed="false">自由擺盤</button><span class="tiny">配對入門，或自己設計早餐</span>';
      $(".game-footer").before(controls);
      $("#freePlate").onclick = () => {
        if (!active()) return;
        if (!s.freePlate) app.querySelectorAll("[data-food]").forEach(el => {
          if (s.placed.has(+el.dataset.food)) s.positions[el.dataset.food] = {x:el.offsetLeft + 33 - $("#stage").clientWidth / 2, y:el.offsetTop + 33 - 150};
        });
        s.freePlate = !s.freePlate;
        $("#freePlate").setAttribute("aria-pressed", String(s.freePlate));
        $("#stage").classList.toggle("free-plating", s.freePlate);
        app.querySelectorAll("[data-food]").forEach(el => el.disabled = !s.freePlate && s.placed.has(+el.dataset.food));
        $("#feedback").textContent = s.freePlate ? "先點食物，再點碟內任意位置；也可拖動。方向鍵微調，Enter 放下。" : "先點食物，再點相同圖案的位置。";
        layoutPlate();
      };
    }
    bindStage(n);
    focusTitle();
  }
  function stageMarkup(n, l) {
    if (n === 0)
      return `<span class="gesture-label">往下滑 ↓ 或使用下方按鈕</span><div class="bowl"><span class="bowl-yolks" id="yolks"></span></div><button class="egg-shell" id="egg" aria-label="雞蛋，按 Enter 或向下滑打開">${A.rawEgg()}<span class="egg-hint" id="eggHint">↓</span></button>`;
    if (n === 1)
      return '<span class="gesture-label">在碗內順暢畫圓 ↻</span><div class="mix-bowl" id="mixBowl" style="--mix:0"><span class="mix-streaks" aria-hidden="true"></span><span class="mix-spoon" aria-hidden="true"></span></div>';
    if (n === 2)
      return '<span class="gesture-label" id="temperature">50°C · 目標 65–95°C</span><div class="thermo" aria-hidden="true"><span class="thermo-zone"></span><span class="thermo-needle" id="thermo"></span></div><div class="burner" aria-hidden="true"></div><div class="pan"><span class="pan-food" id="panFood"></span><i class="steam s1"></i><i class="steam s2"></i><i class="steam s3"></i></div>';
    if (n === 3)
      return `<span class="gesture-label">綠框內彈出，風味剛剛好</span><div class="toaster"><span class="toast" id="toast">${A.toast()}</span><span class="toaster-slot"></span><span class="toaster-lever"></span><span class="toaster-dot"></span></div><div class="timing"><span class="timing-labels" aria-hidden="true"><span>淡</span><span>金黃</span><span>焦</span></span><span class="target-window" style="left:${50 - l.window / 2}%;width:${l.window}%"></span><span class="timing-cursor" id="cursor" style="left:0%"></span></div>`;
    return (
      '<div class="placemat" aria-hidden="true"></div><span class="cutlery fork" aria-hidden="true"></span><span class="cutlery knife" aria-hidden="true"></span><div class="plate"></div>' +
      foodArt
        .map(
          (x, i) =>
            `<button class="plate-target" data-target="${i}" aria-label="${foodName[i]}的擺盤位置">${A[x]()}</button><button class="plating-food" data-food="${i}" aria-label="選取${foodName[i]}" aria-pressed="false">${A[x]()}</button>`,
        )
        .join("")
    );
  }
  function active() {
    return (
      state && view === "game" && state.running && !state.paused && !state.done
    );
  }
  function action() {
    if (!active()) return;
    const n = state.step;
    if (n === 2 && state.cook >= 50 && !state.flipped) {
      state.flipped = true;
      $("#panFood").classList.add("flipped");
      $("#action").disabled = true;
      $("#action").textContent = "另一面烹調中…";
      $("#feedback").textContent = "翻得好！繼續留意火候。";
      beep();
    }
    if (n === 0) crack();
    if (n === 1) addMix(1);
    if (n === 3) {
      $("#toast").classList.add("popped");
      finishStep(
        Math.round(
          clamp(
            20 -
              Math.max(
                0,
                Math.abs(state.brown - 50) - levels[state.level].window / 2,
              ) *
                0.65,
            2,
            20,
          ),
        ),
        state.brown < 30
          ? "多士還有點淡，下次等到綠框。"
          : state.brown > 70
            ? "烘得深了一點，下次早點彈出。"
            : "香脆金黃，出爐！",
      );
    }
    if (n === 4 && state.placed.size === 3)
      finishStep(20, "擺盤整齊，可以上菜了！");
  }
  function crack() {
    if (!active() || state.step !== 0) return;
    state.cracks++;
    beep();
    $("#progress").textContent =
      `${state.cracks} / ${levels[state.level].rounds} 顆`;
    const egg = $("#egg");
    $("#eggHint").textContent = "✨";
    egg.classList.remove("cracking");
    void egg.offsetWidth;
    egg.classList.add("cracking");
    $("#yolks").insertAdjacentHTML("beforeend", "<i></i>");
    setTimeout(() => {
      if (view === "game" && state.step === 0 && !state.done)
        $("#eggHint").textContent = "↓";
    }, 380);
    if (state.cracks >= levels[state.level].rounds)
      finishStep(20, "雞蛋全部打開，沒有浪費！");
  }
  function addMix(v) {
    if (!active() || state.step !== 1) return;
    state.mix += v;
    const l = levels[state.level],
      pct = clamp(state.mix / l.stir, 0, 1);
    $("#progress").textContent =
      `${Math.min(l.stir, state.mix).toFixed(1)} / ${l.stir} 圈`;
    $(".mix-spoon").style.transform = `rotate(${state.mix * 360}deg)`;
    $("#mixBowl").style.setProperty("--mix", pct.toFixed(3));
    if (state.mix >= l.stir) finishStep(20, "蛋液均勻又細滑！");
  }
  function bindStage(n) {
    const stage = $("#stage");
    let origin = null,
      lastAngle = null,
      pointer = null;
    if (n === 0) {
      $("#egg").onpointerdown = (e) => {
        if (!active()) return;
        if (!e.isPrimary) return;
        origin = { x: e.clientX, y: e.clientY };
        pointer = e.pointerId;
        e.currentTarget.setPointerCapture(e.pointerId);
      };
      $("#egg").onpointermove = (e) => {
        if (!origin || e.pointerId !== pointer || !active()) return;
        const dy = clamp(e.clientY - origin.y, 0, 100);
        e.currentTarget.style.transform = `translateY(${dy * .45}px) rotate(${dy * .12}deg)`;
        $("#eggHint").textContent = dy >= 60 ? "⚡" : "↓";
      };
      $("#egg").onpointerup = (e) => {
        e.currentTarget.style.transform = "";
        if (origin && e.pointerId === pointer) {
          if (
            e.clientY - origin.y >= 60 &&
            Math.abs(e.clientX - origin.x) < 100
          )
            crack();
          else if (active())
            $("#feedback").textContent =
              "從蛋上往下滑 60 像素，或按「打開雞蛋」。";
          origin = null;
        }
      };
      $("#egg").onclick = (e) => {
        if (e.detail === 0) crack();
      };
      $("#egg").onpointercancel = () => {
        origin = null;
        $("#egg").style.transform = "";
        $("#eggHint").textContent = "↓";
      };
    }
    if (n === 1) {
      const polar = (e) => {
        const r = $("#mixBowl").getBoundingClientRect();
        return {
          a: Math.atan2(
            e.clientY - r.top - r.height / 2,
            e.clientX - r.left - r.width / 2,
          ),
          r: Math.hypot(
            e.clientX - r.left - r.width / 2,
            e.clientY - r.top - r.height / 2,
          ),
          size: Math.min(r.width, r.height),
        };
      };
      const inBowl = p => p.r >= p.size * 0.1 && p.r <= p.size * 0.55;
      stage.onpointerdown = (e) => {
        if (!active()) return;
        if (!e.isPrimary) return;
        pointer = e.pointerId;
        const p = polar(e);
        lastAngle = inBowl(p) ? p.a : null;
        stage.setPointerCapture(pointer);
      };
      stage.onpointermove = (e) => {
        if (!active() || e.pointerId !== pointer) return;
        const p = polar(e);
        if (!inBowl(p)) {
          lastAngle = null;
          return;
        }
        if (lastAngle === null) {
          lastAngle = p.a;
          return;
        }
        let d = p.a - lastAngle;
        if (d > Math.PI) d -= 2 * Math.PI;
        if (d < -Math.PI) d += 2 * Math.PI;
        if (Math.abs(d) <= Math.PI / 2)
          addMix(Math.abs(d) / (2 * Math.PI));
        lastAngle = p.a;
      };
      stage.onpointerup = stage.onpointercancel = stage.onlostpointercapture = () => {
        lastAngle = null;
        pointer = null;
      };
    }
    if (n === 4) {
      $('[data-food="0"]').style.filter =
        `brightness(${Math.max(0.35, 1 - state.burn / 100)})`;
      $('[data-food="1"]').style.filter =
        toastFilter(state.brown);
      layoutPlate();
      app.querySelectorAll("[data-food]").forEach((el) => {
        let drag = null;
        el.onclick = () => {
          if (!active() || (state.placed.has(+el.dataset.food) && !state.freePlate)) return;
          state.selected = +el.dataset.food;
          app.querySelectorAll("[data-food]").forEach((b) => {
            const on = b === el;
            b.classList.toggle("selected", on);
            b.setAttribute("aria-pressed", String(on));
          });
          $("#feedback").textContent = "已選食物，點相同圖案的虛線圈。";
        };
        el.onpointerdown = (e) => {
          if (!active() || (state.placed.has(+el.dataset.food) && !state.freePlate)) return;
          if (!e.isPrimary) return;
          drag = {
            x: e.clientX,
            y: e.clientY,
            left: el.offsetLeft,
            top: el.offsetTop,
          };
          el.setPointerCapture(e.pointerId);
        };
        el.onpointermove = (e) => {
          if (!drag || !active()) return;
          el.style.left =
            clamp(drag.left + e.clientX - drag.x, 0, stage.clientWidth - 66) +
            "px";
          el.style.top =
            clamp(drag.top + e.clientY - drag.y, 0, stage.clientHeight - 66) +
            "px";
        };
        el.onkeydown = e => {
          if (!active() || !state.freePlate) return;
          const moves = {ArrowLeft: [-8,0], ArrowRight: [8,0], ArrowUp:[0,-8], ArrowDown:[0,8]};
          if (moves[e.key]) {
            e.preventDefault();
            el.style.left = clamp(el.offsetLeft + moves[e.key][0], 0, stage.clientWidth - 66) + "px";
            el.style.top = clamp(el.offsetTop + moves[e.key][1], 0, stage.clientHeight - 66) + "px";
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (onPlate(el.offsetLeft + 33, el.offsetTop + 33)) freePlace(+el.dataset.food, el.offsetLeft + 33, el.offsetTop + 33);
          }
        };
        el.onpointerup = (e) => {
          if (!drag) return;
          drag = null;
          if (!active()) return;
          if (state.freePlate) {
            if (onPlate(el.offsetLeft + 33, el.offsetTop + 33)) freePlace(+el.dataset.food, el.offsetLeft + 33, el.offsetTop + 33);
            else layoutPlate();
            return;
          }
          const t = $(`[data-target="${el.dataset.food}"]`);
          if (
            Math.hypot(
              el.offsetLeft + 33 - t.offsetLeft - 30.5,
              el.offsetTop + 33 - t.offsetTop - 30.5,
            ) < levels[state.level].tolerance
          )
            place(+el.dataset.food);
        };
        el.onpointercancel = () => {
          drag = null;
          layoutPlate();
        };
      });
      stage.addEventListener("click", e => {
        if (!active() || !state.freePlate || state.selected === null || e.target.closest("[data-food], .start-overlay")) return;
        const r = stage.getBoundingClientRect(), x = e.clientX-r.left, y = e.clientY-r.top;
        if (onPlate(x,y)) freePlace(state.selected,x,y);
      });
      app.querySelectorAll("[data-target]").forEach(
        (t) =>
          (t.onclick = () => {
            if (!active() || state.freePlate || state.selected === null) return;
            if (state.selected === +t.dataset.target) place(state.selected);
            else {
              $("#feedback").textContent =
                "找找相同圖案，這是另一樣食物的位置。";
              beep(false);
            }
          }),
      );
    }
  }
  function layoutPlate() {
    if (view !== "game" || state.step !== 4) return;
    const w = $("#stage").clientWidth;
    const spots = [
      [-55, -38],
      [45, -35],
      [0, 38],
    ];
    app.querySelectorAll("[data-target]").forEach((el, i) => {
      el.style.left = w / 2 + spots[i][0] - 30.5 + "px";
      el.style.top = 150 + spots[i][1] - 30.5 + "px";
    });
    app.querySelectorAll("[data-food]").forEach((el, i) => {
      if (state.freePlate && state.positions[i]) {
        el.style.left = w / 2 + state.positions[i].x - 33 + "px";
        el.style.top = 150 + state.positions[i].y - 33 + "px";
      } else if (state.placed.has(i)) {
        const t = $(`[data-target="${i}"]`);
        el.style.left = t.offsetLeft - 2.5 + "px";
        el.style.top = t.offsetTop - 2.5 + "px";
      } else {
        el.style.left = (w - 230) / 2 + i * 82 + "px";
        el.style.top = "228px";
      }
    });
  }
  window.addEventListener("resize", layoutPlate);
  function onPlate(x, y) {
    const plate = $(".plate");
    return ((x - $("#stage").clientWidth / 2) / (plate.offsetWidth / 2 - 30)) ** 2 +
      ((y - 150) / (plate.offsetHeight / 2 - 25)) ** 2 <= 1;
  }
  function freePlace(i, x, y) {
    state.positions[i] = {x: x - $("#stage").clientWidth / 2, y: y - 150};
    place(i);
    $("#feedback").textContent = state.placed.size === 3 ? "你的早餐設計完成！還可移動食物，或上菜。" : "放好了！再選下一樣食物。";
  }
  function place(i) {
    state.placed.add(i);
    state.selected = null;
    const el = $(`[data-food="${i}"]`);
    el.classList.remove("selected");
    el.classList.add("placed");
    el.setAttribute("aria-pressed", "false");
    el.disabled = !state.freePlate;
    layoutPlate();
    $("#progress").textContent = `${state.placed.size} / 3 已擺盤`;
    $("#feedback").textContent =
      state.placed.size === 3
        ? "三樣都就位了，按完成擺盤上菜！"
        : "擺得好，再放下一樣。";
    $("#action").disabled = state.placed.size !== 3;
    beep();
  }
  function finishStep(score, message) {
    if (!active()) return;
    const s = state;
    s.done = true;
    s.running = false;
    s.scores[s.step] = score;
    $("#feedback").textContent = `${message} +${score} 分`;
    $("#score").innerHTML = `${s.scores.reduce((a, b) => a + b, 0)}<small class="tiny"> / 100</small>`;
    $("#progress").textContent = "✓ 完成";
    const b = $("#action");
    b.disabled = false;
    b.textContent = s.step === 4 ? "查看成績 →" : "下一步 →";
    b.onclick = () => {
      if (s.step === 4) result(false);
      else {
        s.step++;
        s.elapsed = 0;
        renderStep();
      }
    };
    beep(score >= 15);
  }
  function pause() {
    if (view !== "game") return;
    state.paused = true;
    state.holding = false;
    dialog.showModal();
  }
  document.querySelector("#resume").onclick = () => {
    dialog.close();
    if (state) state.paused = false;
  };
  document.querySelector("#leave").onclick = () => {
    dialog.close();
    home();
  };
  dialog.addEventListener("cancel", () => {
    if (state) state.paused = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && view === "game" && !dialog.open) pause();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && view === "game" && !dialog.open) {
      e.preventDefault();
      pause();
    }
  });
  function result(timeout) {
    if (!state) return;
    view = "result";
    state.running = false;
    const s = state,
      l = levels[s.level],
      score = s.scores.reduce((a, b) => a + b, 0),
      pass = score >= 55 && !timeout;
    saved.best[s.level] = Math.max(saved.best[s.level], timeout ? 0 : score);
    if (pass && s.level < 9)
      saved.unlocked = Math.max(saved.unlocked, s.level + 1);
    persist();
    app.innerHTML = `<section class="result"><span class="eyebrow">${timeout ? "再練習一次，就更接近了" : pass ? "ORDER COMPLETE" : "KEEP COOKING"}</span>${pass ? `<div class="confetti" aria-hidden="true">${Array.from({ length: 28 }, (_, k) => `<i style="--x:${(k * 37) % 100}%;--d:${(k % 7) * 0.12}s;--r:${(k * 53) % 360}deg;--c:${["#e86f4f", "#f4b53f", "#5fa35a", "#4c9bd6", "#f29a8a"][k % 5]}"></i>`).join("")}</div>` : ""}<div class="result-icon">${pass ? (s.level === 9 ? A.trophy() : levelArt(s.level)) : A.chef()}</div><h1>${timeout ? "時間到了，先休息一下" : pass ? (s.level === 9 ? "恭喜，十關主廚畢業！" : "這份好心情，上菜了！") : "差一點點，再煮一次！"}</h1><div class="stars" aria-label="${timeout ? 0 : starCount(score)} 顆星">${timeout ? "☆☆☆" : stars(score)}</div><div class="served-dish" aria-label="這次煮出的成品"><span style="filter:brightness(${Math.max(0.35, 1 - s.burn / 100)})">${A.friedEgg()}</span><span style="filter:${toastFilter(s.brown)}">${A.toast()}</span><span>${A.sausage()}</span></div><div class="result-score">${score}<small> / 100 分</small></div><p class="muted">${timeout ? "這次未完成訂單；未解鎖下一關，先前最佳紀錄會保留。" : pass ? "手藝又進步了。" + (s.level < 9 ? "下一間小食堂等你開張。" : "所有關卡都已完成，還可以回去挑戰三星。") : "55 分就能過關。留意火候與多士的綠框，再試一次。"}</p><div class="score-grid">${steps.map((t, i) => `<div class="score-cell"><span class="score-icon">${stepArt(i)}</span>${t}<b>${s.scores[i] ?? "—"}</b></div>`).join("")}</div>${!storageOK ? '<p class="notice">瀏覽器未允許儲存，關閉後進度可能遺失。</p>' : ""}<div class="result-actions"><button class="secondary" id="map">返回選關</button><button class="secondary" id="retry">再練一次</button>${pass && s.level < 9 ? '<button class="primary" id="nextLevel">下一關 →</button>' : ""}</div></section>`;
    if (s.freePlate && s.placed.size === 3) {
      $(".served-dish").classList.add("custom-dish");
      $(".served-dish").querySelectorAll("span").forEach((el, i) => {
        const pos = s.positions[i];
        if (pos) {
          el.style.left = `calc(50% + ${pos.x}px)`;
          el.style.top = `calc(50% + ${pos.y}px)`;
        }
      });
    }
    $("#map").onclick = home;
    $("#retry").onclick = () => start(s.level);
    if ($("#nextLevel")) $("#nextLevel").onclick = () => brief(s.level + 1);
    focusTitle();
  }
  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (active()) {
      const s = state,
        l = levels[s.level];
      s.elapsed += dt;
      if (l.time) {
        s.remaining = Math.max(0, s.remaining - dt);
        $("#timer").textContent = Math.ceil(s.remaining) + "s";
        $("#timer").classList.toggle("danger-time", s.remaining < 20);
        $("#timeFill").style.width = (s.remaining / l.time) * 100 + "%";
        if (s.remaining <= 0) {
          result(true);
          requestAnimationFrame(tick);
          return;
        }
      }
      if (s.step === 1 && s.holding) addMix(dt * 0.75);
      if (s.step === 2) {
        const target = 22 + s.heat * 1.2 + Math.sin(s.elapsed * 1.3) * l.drift;
        s.temp += (target - s.temp) * dt * 0.9;
        s.cook += Math.max(0, s.temp - 42) * dt * 0.29;
        if (!s.flipped && s.cook >= 50) {
          s.cook = 50;
          $("#action").disabled = false;
          $("#action").textContent = "翻面 ↻";
          $("#feedback").textContent = "第一面煎好了！按翻面，繼續煎另一面。";
        }
        $(".pan").classList.toggle("sizzling", s.temp >= 65 && s.temp <= 95);
        $(".pan").classList.toggle("smoking", s.temp > 95);
        $("#stage").style.setProperty("--heat", (s.heat / 100).toFixed(2));
        $("#thermo").style.left = `${clamp((s.temp - 20) / 110, 0, 1) * 100}%`;
        $("#panFood").style.setProperty("--cook", clamp(s.cook / 100, 0, 1).toFixed(2));
        if (s.temp > 95) s.burn += (s.temp - 95) * dt * 0.35;
        $("#temperature").textContent =
          `${Math.round(s.temp)}°C · ${s.temp < 65 ? "偏低" : s.temp > 95 ? "過熱！請減火" : "火候剛好 ✓"} · 目標 65–95°C`;
        $("#temperature").style.color =
          s.temp > 95 ? "#ae4833" : s.temp >= 65 ? "#38644d" : "";
        $("#progress").textContent =
          `熟度 ${Math.round(Math.min(100, s.cook))}%`;
        $("#panFood").style.filter =
          `brightness(${Math.max(0.35, 1 - s.burn / 100)})`;
        if (s.cook >= 100)
          finishStep(
            Math.round(clamp(20 - s.burn * 0.4, 2, 20)),
            s.burn > 15 ? "有些焦邊，下次早一點減火。" : "蛋煎得剛剛好！",
          );
      }
      if (s.step === 3) {
        s.brown = Math.min(100, s.brown + dt * l.speed);
        $("#cursor").style.left = `calc(${s.brown}% - 2px)`;
        $("#toast").style.filter = toastFilter(s.brown);
        $("#progress").textContent =
          s.brown < 50 - l.window / 2
            ? "正在烘烤"
            : s.brown <= 50 + l.window / 2
              ? "金黃時刻！"
              : "顏色漸深";
        $(".toaster").style.setProperty("--glow", (s.brown / 100).toFixed(2));
        if (s.brown >= 100) {
          $("#toast").classList.add("popped");
          finishStep(2, "烘過頭了，下次在綠框內彈出。");
        }
      }
    }
    requestAnimationFrame(tick);
  }
  home();
  requestAnimationFrame(tick);
})();
