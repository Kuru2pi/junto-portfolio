const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, "0");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- hero letters ---------- */
$$("[data-split]").forEach((row, r) => {
  row.innerHTML = [...row.textContent].map((c, i) => `<span class="ch" style="transition-delay:${0.1 + r * 0.12 + i * 0.04}s">${c}</span>`).join("");
});
requestAnimationFrame(() => document.body.classList.add("ready"));

/* ---------- index ---------- */
$("#index").innerHTML = WORKS.map(w => {
  const spec = k => (w.spec.find(s => s[0] === k) || [, ""])[1];
  return `
  <li class="ix rv" style="--accent:${w.accent};--at:${w.accentText || w.accent};--on:${w.onAccent || "#fff"}">
    <a href="#work/${w.id}" aria-label="${esc(w.title)} の詳細を見る">
      <div class="ix__img"><img src="assets/img/cover_${w.id}.webp" alt="" loading="lazy"></div>
      <div class="ix__body">
        <div class="ix__left">
          <p class="ix__head"><b>${w.no}</b>${w.cat}</p>
          <div class="chips">${w.chips.map((c, i) => `<span class="chip${i ? " alt" : ""}">${esc(c)}</span>`).join("")}</div>
          <p class="ix__meta">${esc(spec("期間"))}<br>${esc(spec("ツール") || spec("内容"))}</p>
        </div>
        <div class="ix__right">
          <img class="ix__logo" src="assets/img/logo_${w.id}.webp" alt="${esc(w.title)}" loading="lazy">
          <p class="ix__catch">${esc(w.catch)}</p>
        </div>
      </div>
    </a>
  </li>`;
}).join("");

/* ---------- reveal ---------- */
function observeReveal(root, scope = document) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
  }), { root, rootMargin: "0px 0px -8% 0px" });
  $$(".rv", scope).forEach(el => io.observe(el));
  return io;
}
observeReveal(null);

/* ---------- nav ---------- */
const gnav = $("#gnav");
addEventListener("scroll", () => gnav.classList.toggle("line", scrollY > 20), { passive: true });

/* ======================================================
   作品詳細：ブロックの組み立て
   ====================================================== */
const P = (name, alt = "", cls = "") => `<figure class="pic ${cls}" data-zoom><img src="assets/parts/${name}.webp" alt="${esc(alt)}" loading="lazy"></figure>`;
const H = b => `${b.kicker ? `<span class="kicker">${esc(b.kicker)}</span>` : ""}${b.h ? `<h3 class="bh">${esc(b.h)}</h3>` : ""}${b.p ? `<p class="bp">${esc(b.p)}</p>` : ""}`;
const TAGS = t => t ? `<div class="tags">${t.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : "";

const RENDER = {
  split: b => `<div class="split ${b.rev ? "rev" : ""}">
      <div class="split__img rv">${P(b.img, b.h)}</div>
      <div class="rv">${H(b)}
        ${b.list ? `<ul class="dots">${b.list.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${b.calls ? `<ul class="calls">${b.calls.map(c => `<li><span><b>${esc(c[0])}</b>${esc(c[1])}</span><span>→</span><em>${esc(c[2])}</em></li>`).join("")}</ul>` : ""}
        ${TAGS(b.tags)}
        ${b.sub ? `<div class="split__sub">${b.sub.map(s => P(s, b.h)).join("")}</div>` : ""}
      </div></div>`,
  full: b => `<div class="full ${b.dark ? "dark" : ""} rv">${H(b)}${TAGS(b.tags)}
      ${b.swatches ? `<div class="tags">${b.swatches.map(c => `<span><i style="background:${c}"></i>${c}</span>`).join("")}</div>` : ""}
      ${P(b.img, b.h)}</div>`,
  cards: b => `${b.h || b.p ? `<div class="rv">${H(b)}</div>` : ""}
      <ul class="cards ${b.quote ? "quote" : ""}">${b.items.map(c => `<li class="card rv ${b.tall ? "tall" : ""}">
        ${c.img ? P(c.img, c.h) : ""}${c.tag ? `<span class="card__tag">${esc(c.tag)}</span>` : ""}<h4>${esc(c.h)}</h4>${c.p ? `<p>${esc(c.p)}</p>` : ""}</li>`).join("")}</ul>`,
  persona: b => `<div class="rv">${H(b)}</div><div class="persona rv">${P(b.img, "ペルソナ")}${P(b.img2, "カスタマージャーニーマップ")}</div>`,
  colors: b => `<div class="rv">${H(b)}</div><div class="colors">
      <div class="rv">${P(b.img, "デザインコンセプトのムードボード")}<div style="margin-top:12px">${P(b.img2, "アイコンとモチーフ")}</div></div>
      <div class="rv"><div class="cbar">${b.colors.map(c => `<span style="--w:${c[3]};background:${c[0]};color:${c[0] === "#ffffff" ? "#141414" : "#fff"}"><b>${c[3]}%</b></span>`).join("")}</div>
        <ul class="clist">${b.colors.map(c => `<li><i style="background:${c[0]}"></i><b>${c[0]}</b><span>${esc(c[1])}：${esc(c[2])}</span></li>`).join("")}</ul></div></div>`,
  gallery: b => `<div class="rv">${H(b)}</div><div class="gal">
      ${b.imgs.map(i => `<div class="rv">${P(i, b.h)}</div>`).join("")}
      ${b.wide ? `<div class="wide rv">${P(b.wide, b.h)}${b.wideCap ? `<p class="cap">${esc(b.wideCap)}</p>` : ""}</div>` : ""}</div>`,
  ba: b => `<div class="rv"><h3 class="bh">${esc(b.h)}</h3></div><div class="ba rv">
      <div class="ba__stage"><img src="assets/parts/${b.before.img}.webp" alt="改善前のゲーム画面" data-k="before"><img src="assets/parts/${b.after.img}.webp" alt="改善後のゲーム画面" data-k="after" class="off"></div>
      <div><div class="ba__sw" role="tablist"><button class="on" data-k="before" role="tab" aria-selected="true">BEFORE</button><button data-k="after" role="tab" aria-selected="false">AFTER</button></div>
        <div class="ba__txt" data-k="before"><h4>${esc(b.before.h)}</h4><p>${esc(b.before.p)}</p></div>
        <div class="ba__txt" data-k="after" hidden><h4>${esc(b.after.h)}</h4><p>${esc(b.after.p)}</p></div></div></div>`,
  result: b => `<div class="result">
      <div class="result__imgs rv">${b.imgs.map(i => P(i, "成果の様子")).join("")}</div>
      <div class="rv"><p class="result__sub">${esc(b.statSub || "")}</p><p class="result__stat">${esc(b.stat)}</p><p class="bp">${esc(b.p)}</p>
        <ul class="learn">${b.learn.map((l, i) => `<li><small>学び得たこと ${i + 1}</small><h4>${esc(l.h)}</h4><p>${esc(l.p)}</p></li>`).join("")}</ul></div></div>`,
  statement: b => `<div class="statement rv"><h3 class="bh">${esc(b.h)}</h3><p class="bp">${esc(b.p)}</p>
      ${b.reel && REEL_URL ? `<a class="btn" href="${esc(REEL_URL)}" target="_blank" rel="noopener">▶ REELを観る</a>` : ""}</div>`,
  stats: b => `<div class="rv"><h3 class="bh">${esc(b.h)}</h3></div>
      <ul class="stats rv">${b.items.map(s => `<li><b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>`).join("")}</ul><p class="bp rv">${esc(b.p)}</p>`,
  flow: b => `<div class="rv">${H(b)}</div><ol class="flow rv">${b.items.map(f => `<li>${P(f.img, f.h)}<h4>${esc(f.h)}</h4><p>${esc(f.p)}</p></li>`).join("")}</ol>`,
  story: b => `<div class="rv">${H(b)}</div><ol class="story rv" style="--n:${b.items.length}">${b.items.map(s => `<li>
        ${s.img ? P(s.img, s.h) : ""}<b>${esc(s.tag)}</b><h4>${esc(s.h)}</h4>${s.p ? `<p>${esc(s.p)}</p>` : ""}</li>`).join("")}</ol>`,
  sell: b => `<div class="sell">
      <div class="rv"><span class="lbl">販売形態</span><div class="box">${P(b.where.img, "自販機での販売イメージ")}<h4>${esc(b.where.h)}</h4><p>${esc(b.where.p)}</p><div class="pills">${b.where.list.map(x => `<span>${esc(x)}</span>`).join("")}</div></div>
        <div class="box x"><h4>${esc(b.not.h)}</h4><p>${esc(b.not.p)}</p></div></div>
      <div class="rv"><span class="lbl">ペルソナ</span><div class="box">${P(b.persona.img, "ペルソナのイラスト")}<p class="ptag">${esc(b.persona.h)}</p><p class="pname">${esc(b.persona.name)}<small>${esc(b.persona.age)}</small></p>
        <dl>${b.persona.list.map(r => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join("")}</dl></div></div>
      <div class="rv col3"><span class="lbl">購入フロー</span><div class="box"><ol>${b.flow.items.map(f => `<li><b>${esc(f[0])}</b><span>${esc(f[1])}</span></li>`).join("")}</ol></div></div></div>`,
  target: b => `<div class="target rv"><p class="who">${esc(b.h)}</p><p class="bp">${esc(b.p)}</p>
      <ol>${b.items.map(x => `<li>${esc(x)}</li>`).join("")}</ol><p class="concl">${esc(b.concl)}</p></div>`,
  fatigue: b => `<div class="rv">${H(b)}</div><div class="fat rv">
      <div class="fat__list" role="tablist">${b.rows.map((r, i) => `<button role="tab" aria-selected="${!i}" class="${i ? "" : "on"}" data-i="${i}"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></button>`).join("")}</div>
      <div class="fat__out" aria-live="polite"><small>おすすめの休養</small><p class="arrow"></p><p class="rest"></p><p class="note"></p></div></div>`,
  videos: b => `<div class="rv"><h3 class="bh">${esc(b.h)}</h3></div><ul class="videos">${b.items.map(v => `<li class="rv">${P(v[0], v[1])}<span>${esc(v[1])}</span></li>`).join("")}</ul>`,
  problem: b => `<div class="rv"><h3 class="bh">${esc(b.h)}</h3></div><div class="problem">
      <div class="col rv"><div class="box"><span class="lbl">課題</span><h4>${esc(b.issue.h)}</h4>${P(b.issue.img, b.issue.h)}<p>${esc(b.issue.p)}</p></div>
        <div class="box"><span class="lbl">仮説</span><h4>${esc(b.hypo.h)}</h4>${P(b.hypo.img, b.hypo.h)}<p>${esc(b.hypo.p)}</p></div></div>
      <div class="rv"><span class="lbl">行動</span><ol class="acts">${b.actions.map(a => `<li>${P(a.img, a.h)}<div><h4>${esc(a.h)}</h4><p>${esc(a.p)}</p></div></li>`).join("")}</ol></div></div>`,
  timeline: b => `<div class="rv"><h3 class="bh">${esc(b.h)}</h3></div><div class="timeline">
      <ol class="tline rv">${b.items.map(t => `<li><small>${esc(t[0])}</small><i>${esc(t[1])}</i><b>${esc(t[2])}</b></li>`).join("")}</ol>
      <div class="rv">${P(b.img, "Break the shell のグラフィック")}</div></div>`
};

/* ---------- detail open/close ---------- */
const detail = $("#detail");
let lastFocus = null, detailIO = null, tocIO = null;
function openWork(id) {
  const i = WORKS.findIndex(w => w.id === id);
  if (i < 0) return closeWork(true);
  const w = WORKS[i], next = WORKS[(i + 1) % WORKS.length];
  detail.style.setProperty("--accent", w.accent);
  detail.style.setProperty("--on", w.onAccent || "#fff");
  detail.style.setProperty("--at", w.accentText || w.accent);
  $("#d-tab").textContent = `${w.no}  ${w.cat}`;
  let s = 0;
  const secs = [];
  const blocks = w.blocks.map(b => {
    const id = b.sec ? `sec-${s++}` : "";
    if (b.sec) secs.push([id, b.sec]);
    return `<section class="blk" ${id ? `id="${id}"` : ""}>${b.sec ? `<p class="blk__sec rv">${esc(b.sec)}</p>` : ""}${RENDER[b.type](b)}</section>`;
  }).join("");
  $("#d-body").innerHTML = `
    <header class="wrap dh">
      <div class="dh__info rv">
        <img class="dh__logo" src="assets/img/logo_${w.id}.webp" alt="${esc(w.title)}">
        <h2 class="dh__catch" id="d-title">${esc(w.catch)}</h2>
        <p class="dh__sum">▼ 概要</p>
        <dl class="spec">${w.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="chips">${w.chips.map((c, k) => `<span class="chip${k ? " alt" : ""}">${esc(c)}</span>`).join("")}</div>
        ${w.award ? `<p class="dh__award">${esc(w.award)}</p>` : ""}
      </div>
      <div class="dh__cover rv"><img src="assets/img/cover_${w.id}.webp" alt="${esc(w.title)} メインビジュアル"></div>
    </header>
    <div class="wrap dbody">
      <nav class="toc" aria-label="このページの内容"><p>CONTENTS</p><ul>${secs.map(([id, t], k) => `<li><a href="#${id}" data-to="${id}"><span>${pad(k + 1)}</span>${esc(t)}</a></li>`).join("")}</ul></nav>
      <div class="blocks">${blocks}</div>
    </div>
    <div class="wrap"><a class="dnext" href="#work/${next.id}" style="--na:${next.accent}">
      <span><small>NEXT ${next.no}</small><b>${esc(next.title)}</b></span><i>→</i></a></div>`;

  bindDetail(w);
  if (!detail.classList.contains("open")) lastFocus = document.activeElement;
  detail.classList.add("open"); document.body.classList.add("lock");
  detail.scrollTop = 0; detail.focus({ preventScroll: true });
  document.title = `${w.title} | Junto Ikeda Portfolio`;
}
function bindDetail(w) {
  if (detailIO) detailIO.disconnect();
  detailIO = observeReveal(detail, detail);
  // before / after
  $$(".ba", detail).forEach(ba => $$(".ba__sw button", ba).forEach(btn => btn.addEventListener("click", () => {
    const k = btn.dataset.k;
    $$(".ba__sw button", ba).forEach(b => { b.classList.toggle("on", b === btn); b.setAttribute("aria-selected", b === btn); });
    $$(".ba__stage img", ba).forEach(im => im.classList.toggle("off", im.dataset.k !== k));
    $$(".ba__txt", ba).forEach(t => t.hidden = t.dataset.k !== k);
  })));
  // fatigue picker
  $$(".fat", detail).forEach(f => {
    const rows = w.blocks.find(b => b.type === "fatigue").rows;
    const out = $(".fat__out", f);
    const show = i => {
      const r = rows[i];
      $(".arrow", out).textContent = `${r[0]} → ${r[2]}`;
      $(".rest", out).textContent = r[3];
      $(".note", out).textContent = `「${r[1]}」と感じるときは、${r[2]}をもとにした「${r[3]}」を提案します。`;
      $$("button", f).forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", k === i); });
    };
    $$("button", f).forEach((b, i) => b.addEventListener("click", () => show(i)));
    show(0);
  });
  // toc
  $$(".toc a", detail).forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(a.dataset.to).scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); }));
  if (tocIO) tocIO.disconnect();
  tocIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$(".toc a", detail).forEach(a => a.classList.toggle("on", a.dataset.to === e.target.id));
  }), { root: detail, rootMargin: "-30% 0px -60% 0px" });
  $$(".blk[id]", detail).forEach(b => tocIO.observe(b));
}
function closeWork(fromRoute) {
  if (!detail.classList.contains("open")) return;
  detail.classList.remove("open"); document.body.classList.remove("lock");
  document.title = "Junto Ikeda Portfolio";
  if (!fromRoute) history.pushState("", "", location.pathname + location.search);
  if (lastFocus && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
}
$("#d-close").addEventListener("click", () => closeWork(false));
function route() {
  const m = location.hash.match(/^#work\/([\w-]+)/);
  m ? openWork(m[1]) : closeWork(true);
}
addEventListener("hashchange", route);

/* ---------- lightbox ---------- */
const lb = $("#lb"); let lbImgs = [], lbIdx = 0;
function lbShow(k) {
  lbIdx = (k + lbImgs.length) % lbImgs.length;
  const im = $("#lb-img"); im.src = lbImgs[lbIdx].src; im.alt = lbImgs[lbIdx].alt;
  $("#lb-count").textContent = `${lbIdx + 1} / ${lbImgs.length}`;
  lb.classList.add("open"); $("#lb-x").focus();
}
detail.addEventListener("click", e => {
  const f = e.target.closest("[data-zoom]"); if (!f) return;
  lbImgs = $$("[data-zoom] img", detail);
  lbShow(lbImgs.indexOf($("img", f)));
});
$("#lb-x").onclick = () => lb.classList.remove("open");
$("#lb-pv").onclick = () => lbShow(lbIdx - 1);
$("#lb-nx").onclick = () => lbShow(lbIdx + 1);
lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("open"); });
document.addEventListener("keydown", e => {
  if (lb.classList.contains("open")) {
    if (e.key === "Escape") lb.classList.remove("open");
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  } else if (e.key === "Escape") closeWork(false);
});

route();
