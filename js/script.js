/* =====================================================================
   WEDDING INVITATION — BEHAVIOUR
   =====================================================================
   You shouldn't need to edit this file to update text, dates, or the
   venue — that all lives in js/content.js. This file just wires things
   up: the cover interaction, the language toggle, the countdown, and
   the date formatting.
   ===================================================================== */

(function () {
  "use strict";

  let currentLang = "en";

  /* ---------------------------------------------------------------
     Small helper: read a dotted path like "venue.name" out of WEDDING
     --------------------------------------------------------------- */
  function getContent(path) {
    return path
      .split(".")
      .reduce((node, key) => (node ? node[key] : undefined), window.WEDDING);
  }

  /* ---------------------------------------------------------------
     Apply the chosen language to every [data-i18n] element on the page
     --------------------------------------------------------------- */
  function applyLanguage(lang) {
    currentLang = lang === "si" ? "si" : "en";

    document.documentElement.lang = currentLang;
    document.documentElement.dataset.lang = currentLang;
    document.body.classList.toggle("lang-si", currentLang === "si");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const entry = getContent(el.getAttribute("data-i18n"));
      if (entry && typeof entry === "object") {
        const text = entry[currentLang] ?? entry.en;
        if (text != null) el.textContent = text;
      }
    });

    const toggle = document.getElementById("langToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(currentLang === "si"));

    renderDateDisplay();
  }

  /* ---------------------------------------------------------------
     Date formatting — hand-written weekday/month names so the Sinhala
     date always renders correctly, regardless of the guest's browser.
     --------------------------------------------------------------- */
  const EN_WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const SI_WEEKDAYS = ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"];
  const SI_MONTHS = ["ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්"];

  function ordinal(n) {
    const rules = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (rules[(v - 20) % 10] || rules[v] || rules[0]);
  }

  function renderDateDisplay() {
    const el = document.getElementById("dateDisplay");
    if (!el || !window.WEDDING) return;
    const d = new Date(window.WEDDING.dateTime.iso);

    el.textContent =
      currentLang === "si"
        ? `${SI_WEEKDAYS[d.getDay()]}, ${d.getDate()} ${SI_MONTHS[d.getMonth()]} ${d.getFullYear()}`
        : `${EN_WEEKDAYS[d.getDay()]}, ${ordinal(d.getDate())} ${EN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  }

  /* ---------------------------------------------------------------
     Countdown — updates every second, no external libraries
     --------------------------------------------------------------- */
  function startCountdown() {
    if (!window.WEDDING) return;
    const target = new Date(window.WEDDING.dateTime.iso).getTime();

    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");
    const secsWrap = document.getElementById("cd-secs-wrap");
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const diff = Math.max(target - Date.now(), 0);

      daysEl.textContent = pad(Math.floor(diff / 86400000));
      hoursEl.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      minsEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
      secsEl.textContent = pad(Math.floor((diff % 60000) / 1000));

      // tiny pulse on the seconds unit only — a small, deliberate detail
      // rather than animating all four units every second
      if (secsWrap) {
        secsWrap.classList.remove("tick");
        // eslint-disable-next-line no-unused-expressions
        void secsWrap.offsetWidth; // restart the CSS animation
        secsWrap.classList.add("tick");
      }
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------
     Photo placeholder → real photo swap
     If content.js has a photo.src set, replace the placeholder frame
     with an actual <img>. Until then, the elegant placeholder shows.
     --------------------------------------------------------------- */
  function setupPhoto() {
    const frame = document.getElementById("photoFrame");
    if (!frame || !window.WEDDING) return;
    const { src } = window.WEDDING.photo || {};
    if (!src) return;

    const img = new Image();
    img.className = "arch-frame__img";
    img.alt = "";
    img.onload = () => {
      frame.innerHTML = "";
      frame.appendChild(img);
    };
    img.src = src;
  }

  /* ---------------------------------------------------------------
     Map link
     --------------------------------------------------------------- */
  function setupMapLink() {
    const link = document.getElementById("mapLink");
    if (link && window.WEDDING && window.WEDDING.venue.mapUrl) {
      link.href = window.WEDDING.venue.mapUrl;
    }
  }

  /* ---------------------------------------------------------------
     Language toggle button
     --------------------------------------------------------------- */
  function setupLangToggle() {
    const btn = document.getElementById("langToggle");
    if (!btn) return;
    btn.addEventListener("click", () => applyLanguage(currentLang === "en" ? "si" : "en"));
  }
  document.querySelectorAll("[data-i18n]").forEach((el) => {
      const entry = getContent(el.getAttribute("data-i18n"));
      if (entry && typeof entry === "object") {
        const text = entry[currentLang] ?? entry.en;
        if (text != null) {
          // Add this check for inputs
          if (el.tagName === "INPUT") {
            el.placeholder = text;
          } else {
            el.textContent = text;
          }
        }
      }
    });

  /* ---------------------------------------------------------------
     Cover screen — tap or swipe up to reveal the dashboard
     --------------------------------------------------------------- */
  function openInvitation() {
    const cover = document.getElementById("cover");
    const dashboard = document.getElementById("dashboard");
    if (!cover || !dashboard || cover.classList.contains("is-opening")) return;

    cover.classList.add("is-opening");
    dashboard.classList.add("is-open");
    dashboard.removeAttribute("aria-hidden");
    document.body.classList.remove("lock-scroll");

    const removeCover = (e) => {
      if (e.target !== cover) return;
      cover.style.display = "none";
      cover.removeEventListener("transitionend", removeCover);
    };
    cover.addEventListener("transitionend", removeCover);
  }

  function setupCoverInteractions() {
    const cover = document.getElementById("cover");
    if (!cover) return;

    cover.addEventListener("click", openInvitation);
    cover.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });

    let startY = null;
    cover.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; }, { passive: true });
    cover.addEventListener("touchend", (e) => {
      if (startY === null) return;
      const deltaY = startY - e.changedTouches[0].clientY;
      if (deltaY > 40) openInvitation(); // swipe up
      startY = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------
     Init
     --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("lock-scroll");
    applyLanguage("en");
    setupPhoto();
    setupMapLink();
    setupLangToggle();
    setupCoverInteractions();
    startCountdown();

    /* ---------------------------------------------------------------
     RSVP Form to SMS Submission
     --------------------------------------------------------------- */
  const rsvpForm = document.getElementById("rsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevents the page from reloading

      // Get the guest's name and their choice (yes/no)
      const name = rsvpForm.querySelector('input[type="text"]').value;
      const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
      
      // Build the message based on their language toggle (English/Sinhala)
      let message = "";
      if (currentLang === "si") {
        const status = attendance === "yes" ? "සහභාගී වෙමි" : "සහභාගී විය නොහැක";
        message = `ආයුබෝවන්! මම ${name}. මම ඔබගේ විවාහ උත්සවයට ${status}.`;
      } else {
        const status = attendance === "yes" ? "will be attending" : "cannot attend";
        message = `Hello! I am ${name} and I ${status} the wedding.`;
      }

      // YOUR PHONE NUMBER HERE (include +94)
      const phoneNumber = "+94717096093";

      // Detect if it's an iPhone or Android (they format SMS links slightly differently)
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const separator = isIOS ? "&" : "?";
      
      // Open the SMS app
      window.location.href = `sms:${phoneNumber}${separator}body=${encodeURIComponent(message)}`;
    });
  }
  });
})();
