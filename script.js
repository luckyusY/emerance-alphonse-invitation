(function () {
  "use strict";

  // ---------- language ----------
  var LANG_KEY = "ea-lang";
  function setLang(lang) {
    document.documentElement.lang = lang === "rw" ? "rw" : "en";
    document.querySelectorAll("[data-en]").forEach(function (el) {
      var t = el.getAttribute("data-" + lang);
      if (t !== null) el.textContent = t;
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }
  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (saved === "rw" || saved === "en") setLang(saved);
  function currentLang() { return document.documentElement.lang === "rw" ? "rw" : "en"; }

  // ---------- heart art ----------
  var HEART = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.4-9.3-9C1.2 8.7 3.3 5 6.8 5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.5 0 5.6 3.7 4.1 7-2.3 4.6-9.3 9-9.3 9z"/></svg>';
  var COLORS = ["#b3121f", "#d6344a", "#e9cf98", "#b98a3e", "#f08a9b"];
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var layer = document.getElementById("hearts");
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function floatHeart() {
    if (document.hidden || layer.childElementCount > 14) return;
    var h = document.createElement("span");
    h.className = "fheart";
    h.innerHTML = HEART;
    var s = rnd(10, 24), d = rnd(11, 19);
    h.style.cssText = "left:" + rnd(2, 96) + "vw;--s:" + s + "px;--d:" + d + "s;--w:" + rnd(2.5, 4.5) + "s;--r:" +
      rnd(-25, 25) + "deg;--o:" + rnd(.25, .55) + ";--c:" + COLORS[Math.floor(Math.random() * COLORS.length)];
    layer.appendChild(h);
    setTimeout(function () { h.remove(); }, d * 1000 + 200);
  }
  function burstHearts(x, y, n) {
    for (var i = 0; i < n; i++) {
      var b = document.createElement("span");
      b.className = "burst-heart";
      b.innerHTML = HEART;
      var a = (Math.PI * 2 * i) / n + rnd(-.2, .2), dist = rnd(90, 220);
      b.style.cssText = "left:" + x + "px;top:" + y + "px;--x:" + Math.cos(a) * dist + "px;--y:" + Math.sin(a) * dist +
        "px;--sc:" + rnd(.8, 1.6) + ";--r:" + rnd(-40, 40) + "deg;--c:" + COLORS[Math.floor(Math.random() * COLORS.length)];
      document.body.appendChild(b);
      setTimeout(b.remove.bind(b), 1500);
    }
  }
  if (!reduceMotion) {
    for (var k = 0; k < 4; k++) setTimeout(floatHeart, k * 900);
    setInterval(floatHeart, 1600);
  }
  // little heart pop wherever guests tap on the hero
  document.querySelector(".hero").addEventListener("click", function (e) {
    if (!reduceMotion && !e.target.closest("a")) burstHearts(e.clientX, e.clientY, 7);
  });

  // ---------- intro ----------
  var intro = document.getElementById("intro");
  function openInvite() {
    var seal = document.getElementById("openBtn");
    if (seal && !reduceMotion) {
      var r = seal.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + r.height / 2, 18);
    }
    intro.classList.add("opened");
    document.body.classList.remove("locked");
    setTimeout(function () { intro.remove(); }, 1300);
  }
  document.getElementById("openBtn").addEventListener("click", openInvite);
  if (location.hash && location.hash.length > 1) openInvite();

  // ---------- topbar ----------
  var topbar = document.getElementById("topbar");
  function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 60); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- reveal ----------
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- countdown (Kigali, CAT = UTC+2) ----------
  var target = new Date("2027-02-06T09:00:00+02:00").getTime();
  var els = { d: "cd-d", h: "cd-h", m: "cd-m", s: "cd-s" };
  Object.keys(els).forEach(function (k) { els[k] = document.getElementById(els[k]); });
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      document.getElementById("countdown").hidden = true;
      document.getElementById("cd-done").hidden = false;
      return;
    }
    els.d.textContent = Math.floor(diff / 864e5);
    els.h.textContent = pad(Math.floor(diff / 36e5) % 24);
    els.m.textContent = pad(Math.floor(diff / 6e4) % 60);
    els.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    setTimeout(tick, 1000);
  }
  tick();

  // ---------- calendar ----------
  var EV = {
    title: "Wedding of Emerance & Alphonse",
    details: "9:00 AM Introduction & dowry giving – Kabgayi Cathedral Hall\n2:00 PM Religious wedding – Kabgayi Cathedral Parish (Minor Basilica)\nReception afterwards – Kabgayi Cathedral Hall",
    location: "Kabgayi Cathedral, Muhanga, Rwanda",
    start: "20270206T070000Z",
    end: "20270206T170000Z"
  };
  document.getElementById("gcal").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(EV.title) +
    "&dates=" + EV.start + "/" + EV.end +
    "&details=" + encodeURIComponent(EV.details) +
    "&location=" + encodeURIComponent(EV.location);
  document.getElementById("ics").addEventListener("click", function () {
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Emerance & Alphonse//Wedding//EN", "BEGIN:VEVENT",
      "UID:emerance-alphonse-20270206@wedding", "DTSTAMP:20261123T000000Z",
      "DTSTART:" + EV.start, "DTEND:" + EV.end,
      "SUMMARY:" + EV.title,
      "DESCRIPTION:" + EV.details.replace(/\n/g, "\\n").replace(/,/g, "\\,"),
      "LOCATION:" + EV.location.replace(/,/g, "\\,"),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Wedding tomorrow", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "emerance-alphonse-wedding.ics";
    document.body.appendChild(a); a.click(); a.remove();
  });

  // ---------- lightbox ----------
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var gallery = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var idx = 0, list = [];
  function show(i) { idx = (i + list.length) % list.length; lbImg.src = list[idx]; }
  function openLb(srcs, i) {
    list = srcs; lb.classList.toggle("single", srcs.length < 2);
    show(i); lb.hidden = false; document.body.style.overflow = "hidden";
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }
  gallery.forEach(function (g, i) {
    g.addEventListener("click", function () {
      openLb(gallery.map(function (x) { return x.dataset.full; }), i);
    });
  });
  document.getElementById("cardBtn").addEventListener("click", function () {
    openLb([this.dataset.full], 0);
  });
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    tx = null;
  });

  // ---------- RSVP via WhatsApp ----------
  var form = document.getElementById("rsvpForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var to = (e.submitter && e.submitter.dataset.to) || "250788944562";
    var f = form.elements;
    var name = f.name.value.trim();
    var count = f.count.value;
    var yes = f.attend.value === "yes";
    var msg = f.msg.value.trim();
    var rw = currentLang() === "rw";
    var text = rw
      ? "Muraho! Ndi " + name + ".\n" +
        (yes ? "Nzaza mu bukwe bwa Emerance na Alphonse (06/02/2027) 🎉\nUmubare w'abazaza: " + count
             : "Mbabajwe n'uko ntazabasha kuza mu bukwe bwa Emerance na Alphonse.") +
        (msg ? "\n\n" + msg : "")
      : "Hello! This is " + name + ".\n" +
        (yes ? "I will joyfully attend the wedding of Emerance & Alphonse (6 Feb 2027) 🎉\nNumber of guests: " + count
             : "Sadly, I won't be able to attend the wedding of Emerance & Alphonse.") +
        (msg ? "\n\n" + msg : "");
    window.open("https://wa.me/" + to + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
})();
