/* =========================================================================
   NAILONG WARM BIRTHDAY SURPRISE — SCRIPT.JS
   Semua variabel penting ada di bagian "CONFIG" di bawah ini,
   supaya gampang diedit tanpa perlu ubah logic lain.
   ========================================================================= */

/* ============================= CONFIG ================================== */
const CONFIG = {
  PASSWORD: "sayang", // <-- ganti password di sini
  LOADING_STEP_MS: 550, // kecepatan animasi "loding." "loding.." "loding..."
  LOADING_TOTAL_MS: 2600, // total durasi sebelum pindah ke scene lilin
  CANDLE_TAPS_NEEDED: 6, // jumlah tap untuk meniup lilin
  MEMORY_TIMER_SECONDS: 45, // timer game 1 (match the nailong)
  CATCH_TIMER_SECONDS: 25, // timer game 2 (catch the nailong)
  CATCH_TARGET: 12, // target tangkapan game 2
  BALLOON_TIMER_SECONDS: 25, // timer game 3 (pop the balloon)
  BALLOON_TARGET: 10, // target balon game 3
  FILL_TARGET_COUNT: 200, // jumlah nailong saat layar penuh
  FILL_HOLD_MS: 1800, // berapa lama layar "penuh nailong" ditahan
  LETTER_TYPE_SPEED_MIN: 35, // kecepatan mengetik surat (ms per karakter, min)
  LETTER_TYPE_SPEED_MAX: 60, // kecepatan mengetik surat (ms per karakter, max)
};

/* ---- path asset nailong (silakan ganti nama file sesuai asset kamu) ---- */
/* extension .jpg sesuai asset asli — ganti di sini kalau nama file berbeda */
const NAILONG = {
  cute: "assets/nailong/nailong-cute.png",
  happy: "assets/nailong/nailong-happy.png",
  birthday: "assets/nailong/nailong-birthday (2).png",
  angry: "assets/nailong/nailong-angry.png",
  sad: "assets/nailong/nailong-sad.png",
  hug: "assets/nailong/nailong-hug (2).png",
};
const NAILONG_LIST = Object.values(NAILONG);
// 6 gambar berbeda dipakai untuk 6 pasangan di memory game
const MEMORY_IMAGES = [NAILONG.happy, NAILONG.birthday, NAILONG.cute, NAILONG.angry, NAILONG.sad, NAILONG.hug];

/* ========================================================================
   HELPERS UMUM
   ======================================================================== */
function $(sel) {
  return document.querySelector(sel);
}
function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}
function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/* ========================================================================
   PAGE NAVIGATION (dengan transisi fade/scale/blur, lihat style.css)
   ======================================================================== */
function goToPage(pageId) {
  const current = $all(".page.active")[0];
  const next = document.getElementById(pageId);
  if (!next || next === current) return;

  if (current) {
    current.classList.add("leaving");
    current.classList.remove("active");
    setTimeout(() => current.classList.remove("leaving"), 650);
  }
  setTimeout(
    () => {
      next.classList.add("active");
    },
    current ? 180 : 0,
  );
}

// tombol generik dengan atribut data-next="idHalaman"
$all("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => goToPage(btn.getAttribute("data-next")));
});

/* ========================================================================
   BACKGROUND FLOATING NAILONG PARTICLES
   ======================================================================== */
function spawnBgParticle() {
  const wrap = $("#bg-particles");
  const img = document.createElement("img");
  img.src = pick(NAILONG_LIST);
  img.className = "bg-nailong-particle";
  img.style.left = rand(2, 92) + "vw";
  img.style.animationDuration = rand(14, 26) + "s";
  img.style.width = img.style.height = rand(28, 56) + "px";
  wrap.appendChild(img);
  setTimeout(() => img.remove(), 27000);
}
setInterval(spawnBgParticle, 2200);
spawnBgParticle();

/* ========================================================================
   FX CANVAS — sparkle + confetti sederhana (warna soft yellow / gold)
   ======================================================================== */
const fxCanvas = $("#fx-canvas");
const fxCtx = fxCanvas.getContext("2d");
let fxParticles = [];

function resizeFxCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFxCanvas);
resizeFxCanvas();

let fxRunning = false;
function ensureFxLoop() {
  if (!fxRunning) {
    fxRunning = true;
    requestAnimationFrame(fxLoop);
  }
}

function spawnSparkle(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    fxParticles.push({
      x,
      y,
      vx: rand(-2.5, 2.5),
      vy: rand(-3.5, -0.5),
      life: 1,
      size: rand(2, 5),
      color: pick(["#F4D35E", "#E8B84A", "#FFF8D6", "#ffffff"]),
      type: "sparkle",
    });
  }
  ensureFxLoop();
}
function spawnConfetti(count = 60) {
  for (let i = 0; i < count; i++) {
    fxParticles.push({
      x: rand(0, fxCanvas.width),
      y: -20,
      vx: rand(-1.5, 1.5),
      vy: rand(2, 5),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.2, 0.2),
      life: 1,
      size: rand(6, 11),
      color: pick(["#F4D35E", "#E8B84A", "#FFF8D6", "#FFFDF0", "#F6C87A"]),
      type: "confetti",
    });
  }
  ensureFxLoop();
}
function fxLoop() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  fxParticles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === "sparkle") {
      p.life -= 0.02;
      fxCtx.globalAlpha = Math.max(p.life, 0);
      fxCtx.fillStyle = p.color;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    } else {
      p.vy += 0.03;
      p.rot += p.vr;
      p.life -= 0.006;
      fxCtx.globalAlpha = Math.max(p.life, 0);
      fxCtx.save();
      fxCtx.translate(p.x, p.y);
      fxCtx.rotate(p.rot);
      fxCtx.fillStyle = p.color;
      fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      fxCtx.restore();
    }
  });
  fxCtx.globalAlpha = 1;
  fxParticles = fxParticles.filter((p) => p.life > 0 && p.y < fxCanvas.height + 40);
  if (fxParticles.length) {
    requestAnimationFrame(fxLoop);
  } else {
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxRunning = false; // berhenti total kalau tidak ada partikel
  }
}

/* ========================================================================
   PAGE 1 — PASSWORD (dengan hint, dan halaman khusus kalau salah)
   ======================================================================== */
const passwordForm = $("#password-form");
const passwordInput = $("#password-input");
const passwordCard = $("#page-password .glass-card");

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = passwordInput.value.trim();

  if (value.toLowerCase() === CONFIG.PASSWORD.toLowerCase()) {
    // password benar: sparkle + warm glow + zoom out lalu pindah ke loading
    const rect = passwordCard.getBoundingClientRect();
    spawnSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);
    passwordCard.classList.add("zoom-out");
    setTimeout(() => {
      passwordCard.classList.remove("zoom-out");
      goToPage("page-loading");
      startLoadingSequence();
    }, 480);
  } else {
    // password salah: pindah ke halaman nailong sedih (bukan cuma pesan error)
    passwordInput.value = "";
    goToPage("page-password-wrong");
  }
});

$("#btn-try-again").addEventListener("click", () => {
  goToPage("page-password");
  setTimeout(() => passwordInput.focus(), 400);
});

/* ========================================================================
   PAGE 2 — LOADING + LILIN
   ======================================================================== */
function startLoadingSequence() {
  const loadingText = $("#loading-text");
  const loadingSubtext = $("#loading-subtext");
  const candleScene = $("#candle-scene");

  let dots = 1;
  const dotInterval = setInterval(() => {
    dots = (dots % 3) + 1;
    loadingText.textContent = "loding" + ".".repeat(dots);
  }, CONFIG.LOADING_STEP_MS);

  setTimeout(() => {
    loadingSubtext.classList.remove("hidden");
    loadingSubtext.textContent = "lagi nyiapin sesuatuu...";
  }, CONFIG.LOADING_TOTAL_MS * 0.45);

  setTimeout(() => {
    loadingSubtext.textContent = "sebentar yaa...";
  }, CONFIG.LOADING_TOTAL_MS * 0.75);

  setTimeout(() => {
    clearInterval(dotInterval);
    $("#page-loading .glass-card:first-child").classList.add("hidden");
    candleScene.classList.remove("hidden");
    startCandleGame();
  }, CONFIG.LOADING_TOTAL_MS);
}

function startCandleGame() {
  let taps = 0;
  const counterEl = $("#candle-counter");
  const flame = $("#candle-flame");
  const doneText = $("#candle-done-text");
  const cakeWrap = $(".cake-wrap");

  let lastTapAt = 0;
  function handleTap(e) {
    if (taps >= CONFIG.CANDLE_TAPS_NEEDED) return;
    // pengaman: abaikan pointer kedua & event yang datang terlalu rapat (< 150 ms)
    if (e && e.isPrimary === false) return;
    const now = performance.now();
    if (now - lastTapAt < 150) return;
    lastTapAt = now;
    taps++;
    counterEl.textContent = `${taps} / ${CONFIG.CANDLE_TAPS_NEEDED}`;

    // api mengecil sedikit demi sedikit setiap tap, subtle bounce di cake
    const shrink = 1 - (taps / CONFIG.CANDLE_TAPS_NEEDED) * 0.7;
    flame.style.transform = `translateX(-50%) scale(${shrink})`;
    cakeWrap.style.transform = "translateY(" + rand(-3, 3) + "px)";
    setTimeout(() => {
      cakeWrap.style.transform = "";
    }, 120);

    const rect = flame.getBoundingClientRect();
    spawnSparkle(rect.left + rect.width / 2, rect.top, 8);
    if (navigator.vibrate) navigator.vibrate(15);

    if (taps >= CONFIG.CANDLE_TAPS_NEEDED) {
      flame.classList.add("out");
      spawnConfetti(50);
      doneText.classList.remove("hidden");
      doneText.textContent = "yeayyy lilinnya mati! 🎉";
      document.removeEventListener("pointerdown", handleTap);
      setTimeout(() => goToPage("page-gamemenu"), 1600);
    }
  }
  // SATU jenis event saja (pointerdown) supaya 1 tap = 1 hitungan di HP maupun laptop
  document.addEventListener("pointerdown", handleTap);
}

/* ========================================================================
   PAGE 3 — MINI GAME MENU
   ======================================================================== */
const gameCompleted = { 1: false, 2: false, 3: false };

function updateGameMenuProgress() {
  const doneCount = Object.values(gameCompleted).filter(Boolean).length;
  $("#games-progress").textContent = `${doneCount} / 3 games completed`;
  [1, 2, 3].forEach((n) => {
    const tile = $(`.game-tile[data-game="${n}"]`);
    const status = $(`#status-game-${n}`);
    if (gameCompleted[n]) {
      tile.classList.add("completed");
      status.textContent = "selesai ✔";
    }
  });
  if (doneCount === 3) {
    $("#btn-continue-after-games").classList.remove("hidden");
  }
}

$all(".game-tile").forEach((tile) => {
  tile.addEventListener("click", () => {
    const n = tile.getAttribute("data-game");
    openOverlay(`overlay-game${n}`);
    if (n === "1") startMemoryGame();
    if (n === "2") startCatchGame();
    if (n === "3") startBalloonGame();
  });
});

$("#btn-continue-after-games").addEventListener("click", () => goToPage("page-hallosayang"));

function openOverlay(id) {
  document.getElementById(id).classList.add("active");
  document.body.classList.add("game-active"); // matikan blur & partikel background (lihat style.css)
}
function closeOverlay(id) {
  document.getElementById(id).classList.remove("active");
  if (!document.querySelector(".overlay.active")) document.body.classList.remove("game-active");
}

$("#g1-close").addEventListener("click", () => {
  closeOverlay("overlay-game1");
  stopMemoryGame();
});
$("#g2-close").addEventListener("click", () => {
  closeOverlay("overlay-game2");
  stopCatchGame();
});
$("#g3-close").addEventListener("click", () => {
  closeOverlay("overlay-game3");
  stopBalloonGame();
});

/* ------------------------- GAME 1: MATCH THE NAILONG ------------------- */
let memoryState = null;

function startMemoryGame() {
  stopMemoryGame();
  const board = $("#g1-board");
  board.innerHTML = "";
  $("#g1-message").classList.add("hidden");

  let deck = [...MEMORY_IMAGES, ...MEMORY_IMAGES].map((img) => ({ img, id: Math.random() })).sort(() => Math.random() - 0.5);

  memoryState = {
    deck,
    firstCard: null,
    secondCard: null,
    lock: false,
    pairsFound: 0,
    timeLeft: CONFIG.MEMORY_TIMER_SECONDS,
    timerId: null,
  };

  deck.forEach((card, index) => {
    const cardEl = document.createElement("div");
    cardEl.className = "memory-card";
    cardEl.dataset.img = card.img;
    cardEl.dataset.index = index;
    cardEl.innerHTML = `
  <div class="memory-card-inner">
    <div class="memory-face memory-back"></div>
    <div class="memory-face memory-front">
      <img 
        src="${card.img}" 
        alt="Nailong"
        onerror="this.style.display='none'; console.error('Gambar gagal:', this.src)"
      >
    </div>
  </div>`;
    cardEl.addEventListener("click", () => onMemoryCardClick(cardEl));
    board.appendChild(cardEl);
  });

  $("#g1-pairs").textContent = `0 / 6`;
  $("#g1-timer").textContent = memoryState.timeLeft;
  memoryState.timerId = setInterval(() => {
    memoryState.timeLeft--;
    $("#g1-timer").textContent = memoryState.timeLeft;
    if (memoryState.timeLeft <= 0) {
      clearInterval(memoryState.timerId);
      showMemoryMessage("waktunya habiss 😭 coba lagi yaa!");
      setTimeout(() => startMemoryGame(), 1800);
    }
  }, 1000);
}

function onMemoryCardClick(cardEl) {
  if (!memoryState || memoryState.lock) return;
  if (cardEl.classList.contains("flipped") || cardEl.classList.contains("matched")) return;

  cardEl.classList.add("flipped");
  if (!memoryState.firstCard) {
    memoryState.firstCard = cardEl;
    return;
  }
  memoryState.secondCard = cardEl;
  memoryState.lock = true;

  const match = memoryState.firstCard.dataset.img === memoryState.secondCard.dataset.img;
  if (match) {
    memoryState.firstCard.classList.add("matched");
    memoryState.secondCard.classList.add("matched");
    memoryState.pairsFound++;
    $("#g1-pairs").textContent = `${memoryState.pairsFound} / 6`;
    const rect = cardEl.getBoundingClientRect();
    spawnSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    resetMemorySelection();

    if (memoryState.pairsFound === 6) {
      clearInterval(memoryState.timerId);
      showMemoryMessage("semuanyaa cocok! 💛");
      spawnConfetti(40);
      gameCompleted[1] = true;
      updateGameMenuProgress();
      setTimeout(() => closeOverlay("overlay-game1"), 1600);
    }
  } else {
    setTimeout(() => {
      memoryState.firstCard.classList.remove("flipped");
      memoryState.secondCard.classList.remove("flipped");
      resetMemorySelection();
    }, 700);
  }
}
function resetMemorySelection() {
  memoryState.firstCard = null;
  memoryState.secondCard = null;
  memoryState.lock = false;
}
function showMemoryMessage(text) {
  const el = $("#g1-message");
  el.textContent = text;
  el.classList.remove("hidden");
}
function stopMemoryGame() {
  if (memoryState && memoryState.timerId) clearInterval(memoryState.timerId);
  memoryState = null;
}

/* ------------------------- GAME 2: CATCH THE NAILONG -------------------- */
/* Versi CANVAS (ringan untuk HP):
   - semua nailong yang jatuh digambar di 1 canvas (bukan puluhan <img> yang bergerak)
   - gambar nailong dikecilkan SEKALI jadi sprite kecil (file aslinya ~500px, jauh lebih besar dari yang tampil)
   - gerakan berdasarkan waktu (dt), jadi kecepatannya sama di layar 60Hz / 120Hz
   - keranjang bisa digeser dari mana saja di layar game (jari / mouse)
   Pengaturan gampang diedit di CATCH_CFG di bawah. */
const CATCH_CFG = {
  SPAWN_MS: 550, // jeda munculnya nailong baru
  SIZE_MIN: 36, // ukuran nailong (px)
  SIZE_MAX: 62,
  SPEED_MIN: 90, // kecepatan jatuh (px per detik)
  SPEED_MAX: 200,
  BASKET_W: 90, // lebar & tinggi keranjang (samakan dengan .basket di style.css)
  BASKET_H: 56,
  BASKET_BOTTOM: 10,
};
let catchState = null;
let catchSprites = null; // cache sprite, dibuat sekali

/* kecilkan tiap gambar nailong jadi sprite 64px (proporsi asli dipertahankan) */
function buildCatchSprites() {
  if (catchSprites) return;
  catchSprites = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const S = Math.round(CATCH_CFG.SIZE_MAX * dpr);
  NAILONG_LIST.forEach((src) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const g = c.getContext("2d");
      g.imageSmoothingQuality = "high";
      const k = Math.min(S / img.naturalWidth, S / img.naturalHeight);
      const w = img.naturalWidth * k;
      const h = img.naturalHeight * k;
      g.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
      catchSprites.push(c);
    };
    img.src = src;
  });
}

function startCatchGame() {
  stopCatchGame();
  buildCatchSprites();
  const page = $("#overlay-game2");
  const arena = $("#g2-arena");
  const basket = $("#g2-basket");
  arena.querySelectorAll("canvas").forEach((n) => n.remove());
  $("#g2-message").classList.add("hidden");
  $("#g2-count").textContent = `0 / ${CONFIG.CATCH_TARGET}`;

  const cv = document.createElement("canvas");
  cv.className = "catch-canvas";
  arena.insertBefore(cv, basket);
  const ctx = cv.getContext("2d");
  const DPR = Math.min(window.devicePixelRatio || 1, 2); // maks 2x supaya HP tidak berat
  let W = 0;
  let H = 0;
  function resize() {
    W = arena.clientWidth;
    H = arena.clientHeight;
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    basketX = Math.max(0, Math.min(W - CATCH_CFG.BASKET_W, basketX));
    placeBasket();
  }
  let basketX = 0;
  const basketY = () => H - CATCH_CFG.BASKET_H - CATCH_CFG.BASKET_BOTTOM;
  function placeBasket() {
    basket.style.transform = `translate3d(${basketX}px, ${basketY()}px, 0)`;
  }
  W = arena.clientWidth;
  H = arena.clientHeight;
  basketX = (W - CATCH_CFG.BASKET_W) / 2;
  resize();

  catchState = {
    caught: 0,
    timeLeft: CONFIG.CATCH_TIMER_SECONDS,
    timerId: null,
    rafId: null,
    running: true,
  };

  /* geser keranjang: hanya simpan posisi, digambar di loop */
  function onMove(e) {
    const r = arena.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W - CATCH_CFG.BASKET_W / 2;
    basketX = Math.max(0, Math.min(W - CATCH_CFG.BASKET_W, x));
    placeBasket();
  }
  page.addEventListener("pointermove", onMove);
  page.addEventListener("pointerdown", onMove);
  window.addEventListener("resize", resize);
  catchState.cleanupMove = () => {
    page.removeEventListener("pointermove", onMove);
    page.removeEventListener("pointerdown", onMove);
    window.removeEventListener("resize", resize);
  };

  const items = [];
  const pops = []; // efek kecil saat nailong tertangkap (mengecil + memudar)
  let last = performance.now();
  let spawnAcc = 0;

  function spawn() {
    if (!catchSprites.length) return; // gambar belum selesai dimuat
    items.push({
      s: catchSprites[(Math.random() * catchSprites.length) | 0],
      size: rand(CATCH_CFG.SIZE_MIN, CATCH_CFG.SIZE_MAX),
      x: rand(10, Math.max(11, W - CATCH_CFG.SIZE_MAX - 10)),
      y: -CATCH_CFG.SIZE_MAX,
      v: rand(CATCH_CFG.SPEED_MIN, CATCH_CFG.SPEED_MAX),
      rot: rand(-30, 30),
      vr: rand(-120, 120), // derajat per detik
    });
  }

  function frame(now) {
    if (!catchState || !catchState.running) return;
    const dt = Math.min(now - last, 50) / 1000;
    last = now;

    spawnAcc += dt * 1000;
    while (spawnAcc >= CATCH_CFG.SPAWN_MS) {
      spawnAcc -= CATCH_CFG.SPAWN_MS;
      spawn();
    }

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const by = basketY();
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.v * dt;
      it.rot += it.vr * dt;

      /* tabrakan: murni hitungan angka (tanpa membaca layout) */
      const hit = it.y + it.size > by + 6 && it.y < by + CATCH_CFG.BASKET_H && it.x + it.size > basketX + 6 && it.x < basketX + CATCH_CFG.BASKET_W - 6;
      if (hit) {
        items.splice(i, 1);
        pops.push({ s: it.s, size: it.size, x: it.x, y: it.y, rot: it.rot, t: 0 });
        catchState.caught++;
        $("#g2-count").textContent = `${catchState.caught} / ${CONFIG.CATCH_TARGET}`;
        const r = arena.getBoundingClientRect();
        spawnSparkle(r.left + ((it.x + it.size / 2) / W) * r.width, r.top + ((it.y + it.size / 2) / H) * r.height, 10);
        if (catchState.caught >= CONFIG.CATCH_TARGET) {
          finishCatchGame(true);
          return;
        }
        continue;
      }
      if (it.y > H + CATCH_CFG.SIZE_MAX) {
        items.splice(i, 1);
        continue;
      }
      drawSprite(it.s, it.x, it.y, it.size, it.rot, 1);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i];
      p.t += dt / 0.25;
      if (p.t >= 1) {
        pops.splice(i, 1);
        continue;
      }
      const ps = p.size * (1 - p.t * 0.8); // mengecil sambil memudar
      drawSprite(p.s, p.x + p.size / 2 - ps / 2, p.y + p.size / 2 - ps / 2, ps, p.rot, 1 - p.t);
    }
    catchState.rafId = requestAnimationFrame(frame);
  }

  function drawSprite(sprite, x, y, size, rotDeg, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x + size / 2, y + size / 2);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  catchState.rafId = requestAnimationFrame((t) => {
    last = t;
    frame(t);
  });

  $("#g2-timer").textContent = catchState.timeLeft;
  catchState.timerId = setInterval(() => {
    catchState.timeLeft--;
    $("#g2-timer").textContent = catchState.timeLeft;
    if (catchState.timeLeft <= 0) finishCatchGame(catchState.caught >= CONFIG.CATCH_TARGET);
  }, 1000);
}

function finishCatchGame(success) {
  if (!catchState || !catchState.running) return;
  catchState.running = false;
  clearInterval(catchState.timerId);
  cancelAnimationFrame(catchState.rafId);

  const msgEl = $("#g2-message");
  msgEl.classList.remove("hidden");
  if (success) {
    msgEl.textContent = "yeayyy dapet semuanya! 💛";
    spawnConfetti(40);
    gameCompleted[2] = true;
    updateGameMenuProgress();
    setTimeout(() => {
      closeOverlay("overlay-game2");
      stopCatchGame(); // bersihkan canvas & listener
    }, 1600);
  } else {
    msgEl.textContent = "waktunya habiss, tapi gapapaa 💛";
    setTimeout(() => startCatchGame(), 1800);
  }
}
function stopCatchGame() {
  if (!catchState) return;
  catchState.running = false;
  clearInterval(catchState.timerId);
  cancelAnimationFrame(catchState.rafId);
  if (catchState.cleanupMove) catchState.cleanupMove();
  $("#g2-arena")
    .querySelectorAll("canvas")
    .forEach((n) => n.remove());
  catchState = null;
}

/* ------------------------- GAME 3: POP THE BALLOON ----------------------- */
/* Revisi: setelah balon pecah, MUNCUL SPEECH BUBBLE "loveeuuu 💛"           */
/* (bukan gambar nailong keluar dari balon).                                */
let balloonState = null;
const BALLOON_COLORS = ["#F4D35E", "#F6C87A", "#FFF8D6", "#E8B84A", "#FFE9A8"];

function startBalloonGame() {
  stopBalloonGame();
  const arena = $("#g3-arena");
  arena.innerHTML = "";
  $("#g3-message").classList.add("hidden");
  $("#g3-count").textContent = `0 / ${CONFIG.BALLOON_TARGET}`;

  balloonState = { popped: 0, timeLeft: CONFIG.BALLOON_TIMER_SECONDS, timerId: null, running: true };

  function spawnBalloon() {
    if (!balloonState.running) return;
    const el = document.createElement("div");
    el.className = "balloon";
    el.style.background = pick(BALLOON_COLORS);
    const size = rand(48, 64);
    el.style.width = size + "px";
    el.style.height = size * 1.2 + "px";
    el.style.left = rand(6, 84) + "%";
    el.style.top = rand(6, 78) + "%";
    el.addEventListener("click", () => popBalloon(el), { once: true });
    el.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault();
        popBalloon(el);
      },
      { once: true, passive: false },
    );
    arena.appendChild(el);

    setTimeout(
      () => {
        if (el.parentNode && !el.classList.contains("pop")) {
          el.remove();
          spawnBalloon();
        }
      },
      rand(2200, 3600),
    );
  }

  function popBalloon(el) {
    if (!balloonState.running || el.classList.contains("pop")) return;
    el.classList.add("pop");
    const rect = el.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();
    spawnSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);

    // bubble chat "loveeuuu 💛" muncul di posisi balon, lalu fade out sendiri
    const bubble = document.createElement("div");
    bubble.className = "love-bubble";
    bubble.textContent = "loveeuuu 💛";
    bubble.style.left = rect.left - arenaRect.left + rect.width / 2 - 10 + "px";
    bubble.style.top = rect.top - arenaRect.top - 10 + "px";
    bubble.style.transform = `translateX(-50%) rotate(${rand(-4, 4)}deg)`;
    arena.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1150);

    setTimeout(() => el.remove(), 300);

    balloonState.popped++;
    $("#g3-count").textContent = `${balloonState.popped} / ${CONFIG.BALLOON_TARGET}`;
    if (balloonState.popped >= CONFIG.BALLOON_TARGET) {
      finishBalloonGame(true);
    } else {
      spawnBalloon();
    }
  }

  for (let i = 0; i < 5; i++) setTimeout(spawnBalloon, i * 220);

  $("#g3-timer").textContent = balloonState.timeLeft;
  balloonState.timerId = setInterval(() => {
    balloonState.timeLeft--;
    $("#g3-timer").textContent = balloonState.timeLeft;
    if (balloonState.timeLeft <= 0) finishBalloonGame(balloonState.popped >= CONFIG.BALLOON_TARGET);
  }, 1000);
}

function finishBalloonGame(success) {
  if (!balloonState || !balloonState.running) return;
  balloonState.running = false;
  clearInterval(balloonState.timerId);

  const msgEl = $("#g3-message");
  msgEl.classList.remove("hidden");
  if (success) {
    msgEl.textContent = "BOOMM! berhasil semuaa 🎉";
    spawnConfetti(50);
    gameCompleted[3] = true;
    updateGameMenuProgress();
    setTimeout(() => closeOverlay("overlay-game3"), 1600);
  } else {
    msgEl.textContent = "waktunya habiss, tapi gapapaa 💛";
    setTimeout(() => startBalloonGame(), 1800);
  }
}
function stopBalloonGame() {
  if (!balloonState) return;
  balloonState.running = false;
  clearInterval(balloonState.timerId);
  $("#g3-arena").innerHTML = "";
  balloonState = null;
}

/* ========================================================================
   PAGE 5 — PERTANYAAN (typewriter)
   ======================================================================== */
let typewriterStarted = false;
function typewriteSimple(el, text, speed = 45, onDone) {
  el.textContent = "";
  let i = 0;
  (function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(step, speed);
    } else if (onDone) onDone();
  })();
}
function maybeStartTypewriter() {
  if (typewriterStarted) return;
  if (!$("#page-pertanyaan").classList.contains("active")) return;
  typewriterStarted = true;
  typewriteSimple($("#typewriter-text"), "kamu tauu gaaa\nhari ini hari apaa???", 55, () => {
    $("#btn-after-typewriter").classList.remove("hidden");
  });
}
new MutationObserver(maybeStartTypewriter).observe($("#page-pertanyaan"), { attributes: true, attributeFilter: ["class"] });

/* ========================================================================
   PAGE 7 — ARE YOU READY (yes / no)
   ======================================================================== */
$("#btn-yes").addEventListener("click", () => {
  const rect = $("#btn-yes").getBoundingClientRect();
  spawnSparkle(rect.left + rect.width / 2, rect.top, 30);
  $("#nailong-ready").src = NAILONG.happy;
  $("#page-areyouready").style.background = "";
  setTimeout(() => goToPage("page-happybirthday"), 500);
});

$("#btn-no").addEventListener("click", () => {
  $("#nailong-ready").src = NAILONG.angry;
  $("#nailong-ready").parentElement.classList.add("nailong-shake-angry");
  $("#angry-text").classList.remove("hidden");
  document.getElementById("page-areyouready").style.background = "linear-gradient(160deg, rgba(232,184,74,0.35), rgba(200,150,60,0.22))";
  setTimeout(() => {
    $("#nailong-ready").parentElement.classList.remove("nailong-shake-angry");
  }, 600);

  // tombol NO geser sedikit secara playful, tapi tetap selalu bisa diklik
  const btnNo = $("#btn-no");
  const offsetX = rand(-40, 40);
  const offsetY = rand(-10, 10);
  btnNo.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

/* ========================================================================
   PAGE 8 — HAPPY BIRTHDAY
   ======================================================================== */
let hbdStarted = false;
function maybeStartHbd() {
  if (hbdStarted) return;
  if (!$("#page-happybirthday").classList.contains("active")) return;
  hbdStarted = true;
  const el = $("#hbd-headline");
  const fullHtml = "happyy birthday<br>sayanggkuuu 🎂💛";
  const plain = "happyy birthday sayanggkuuu 🎂💛";
  typewriteSimple(el, plain, 50, () => {
    el.innerHTML = fullHtml;
    $("#btn-something").classList.remove("hidden");
    spawnConfetti(30);
  });
}
new MutationObserver(maybeStartHbd).observe($("#page-happybirthday"), { attributes: true, attributeFilter: ["class"] });

$("#btn-something").addEventListener("click", () => {
  fillScreenWithNailong();
});

/* ========================================================================
   "i have something for you" EFFECT — LAYAR PERLAHAN DIPENUHI NAILONG
   ------------------------------------------------------------------------
   BUKAN hujan/confetti: setiap nailong muncul di posisi acak (kiri, kanan,
   atas, bawah, tengah, diagonal) langsung di viewport penuh (position:fixed),
   jumlahnya bertambah bertahap (1 → 5 → 10 → 20 → 40 → 60 → target) sampai
   layar terasa benar-benar tertutup nailong, ditahan sebentar, lalu
   menghilang satu per satu secara random sebelum masuk ke halaman surat.
   ======================================================================== */
function fillScreenWithNailong() {
  const container = $("#fullscreen-nailong");
  container.innerHTML = "";
  container.style.pointerEvents = "auto"; // blokir interaksi di belakang selama efek

  const els = [];
  const batches = [1, 4, 5, 10, 20, 40, 60, CONFIG.FILL_TARGET_COUNT]; // jumlah kumulatif tiap tahap
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  function createNailong() {
    const el = document.createElement("img");
    el.src = pick(NAILONG_LIST);
    el.className = "fill-nailong";
    const size = rand(60, Math.min(vw, vh) * 0.38);
    el.style.width = el.style.height = size + "px";
    // posisi acak di seluruh viewport (bukan pola grid, boleh overlap)
    el.style.left = rand(-size * 0.3, vw - size * 0.7) + "px";
    el.style.top = rand(-size * 0.3, vh - size * 0.7) + "px";
    const rot = rand(-35, 35);
    el.dataset.rot = rot;
    container.appendChild(el);
    els.push(el);
    // trigger transition: scale from 0 + fade in + slight rotation + bounce
    requestAnimationFrame(() => {
      el.classList.add("show");
      el.style.transform = `scale(1) rotate(${rot}deg)`;
    });
    return el;
  }

  let already = 0;
  let batchIndex = 0;

  function runBatch() {
    if (batchIndex >= batches.length) {
      // layar sudah penuh — tahan sebentar sebelum mulai menghilang
      setTimeout(clearNailongScreen, CONFIG.FILL_HOLD_MS);
      return;
    }
    const target = batches[batchIndex];
    const toAdd = target - already;
    for (let i = 0; i < toAdd; i++) {
      setTimeout(createNailong, i * rand(8, 22)); // timing kemunculan sedikit berbeda-beda
    }
    already = target;
    batchIndex++;
    setTimeout(runBatch, 420); // jeda antar tahap supaya terlihat "makin lama makin banyak"
  }
  runBatch();

  function clearNailongScreen() {
    // menghilang satu per satu secara random (bukan bersamaan)
    const order = [...els].sort(() => Math.random() - 0.5);
    order.forEach((el, i) => {
      setTimeout(
        () => {
          el.classList.add("clearing");
        },
        i * rand(15, 35),
      );
    });
    const totalClearTime = order.length * 35 + 900;
    setTimeout(() => {
      container.innerHTML = "";
      container.style.pointerEvents = "none";
      goToPage("page-letter");
      startLetterTypewriter();
    }, totalClearTime);
  }
}

/* ========================================================================
   PAGE 10 — SURAT ULANG TAHUN (typewriter huruf-per-huruf dengan cursor)
   ======================================================================== */
const LETTER_TEXT = `HAIIII, happy birthday yaa sayangkuu!!!
Hari ini adalah salah satu hari paling spesial karena kamu bertambah satu tahun usianya. Aku cuma mau bilang, terima kasih banyak sudah lahir ke dunia ini dan terima kasih sudah hadir serta membawa begitu banyak kebahagiaan di hidup aku. Bareng kamu, hari-hari biasa jadi terasa jauh lebih istimewa.Aku tahuu kamuu kadang capee. Tapi ingat ya, kamu tidak harus memikul semuanya sendirian. Ada aku di sini yang bakal selalu support kamu, nemenin kamu dalam kondisi apa pun, baik senang maupun susah.Di umur yang baru ini, semoga kamu selalu diberikan kesehatan yang baikk, rezeki yang lancar dan berkah, serta dimudahkan dalam setiap langkah dan impian yang lagi kamu kejar. Semoga kamu juga makin sabar, makin bahagia hatinya, dan tetap jadi pribadi tulus yang aku kenal. Jangan pernah capek jadi orang baik, yaa.
once again...
happy birthday, youu 💛🎂`;

let letterStarted = false;
function startLetterTypewriter() {
  if (letterStarted) return;
  letterStarted = true;
  const el = $("#letter-typewriter");
  el.textContent = "";

  const cursor = document.createElement("span");
  cursor.className = "type-cursor";
  cursor.textContent = "|";

  let i = 0;
  function typeStep() {
    if (i <= LETTER_TEXT.length) {
      el.textContent = LETTER_TEXT.slice(0, i);
      el.appendChild(cursor);
      i++;
      // sedikit variasi kecepatan biar terasa natural
      const speed = rand(CONFIG.LETTER_TYPE_SPEED_MIN, CONFIG.LETTER_TYPE_SPEED_MAX);
      setTimeout(typeStep, speed);
    } else {
      cursor.remove(); // cursor menghilang setelah selesai
      const rect = el.getBoundingClientRect();
      spawnSparkle(rect.left + rect.width / 2, rect.top + 20, 16);
      $("#btn-after-letter").classList.remove("hidden");
    }
  }
  typeStep();
}

/* ========================================================================
   PAGE 11 — FINAL HUG (heart di tengah, bukan lingkaran transparan)
   ======================================================================== */
let hugStarted = false;
function maybeStartHug() {
  if (hugStarted) return;
  if (!$("#page-finalhug").classList.contains("active")) return;
  hugStarted = true;
  setTimeout(() => {
    const stage = $(".hug-stage");
    stage.classList.add("together");
    setTimeout(() => {
      $("#hug-heart").classList.remove("hidden");
      const rect = stage.getBoundingClientRect();
      spawnSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
      spawnConfetti(25);
    }, 1500);
  }, 500);
}
new MutationObserver(maybeStartHug).observe($("#page-finalhug"), { attributes: true, attributeFilter: ["class"] });

const bgMusic = document.getElementById("bg-music");

function startMusic() {
  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
  }
}

function clickVibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(30);
  }
}

document.addEventListener("click", startMusic, { once: true });
document.addEventListener("touchstart", startMusic, { once: true });

document.addEventListener("click", clickVibrate);
