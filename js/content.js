/* =====================================================================
   WEDDING INVITATION — CONTENT
   =====================================================================
   Everything you're likely to want to change lives in this one file:
   names, date, venue, wording, and the Sinhala translations.

   Every text field is an object like { en: "...", si: "..." }.
   script.js reads whichever language is currently selected.

   You should NOT need to touch index.html, style.css or script.js
   just to update text — only to add brand-new sections.
   ===================================================================== */

window.WEDDING = {

  // ---- Couple -------------------------------------------------------
  couple: {
    partner1: { en: "Irantha", si: "ඉරන්ත" },
    partner2: { en: "Kanchana", si: "කාංචනා" }
  },

  // ---- Date & time ----------------------------------------------------
  // iso: the single source of truth for the countdown AND the date shown.
  // Format: YYYY-MM-DDTHH:MM:SS+05:30  (+05:30 = Sri Lanka time)
  // Change ONLY this line to move the wedding date — the weekday,
  // day, month and countdown all update themselves automatically.
  dateTime: {
    iso: "2026-10-01T10:00:00+05:30",
    timeLabel: { en: "10.00 a.m.", si: "පෙ.ව. 10.00" }
  },

  // ---- Venue ----------------------------------------------------------
  venue: {
    name: { en: "Cinnamon Lakeside", si: "සින්නමන් ලේක්සයිඩ්" },
    place: { en: "Colombo, Sri Lanka", si: "කොළඹ, ශ්‍රී ලංකාව" },
    mapLabel: { en: "View on map", si: "සිතියමේ බලන්න" },
    // Replace with the exact address or Google-Maps share link once you have it.
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Cinnamon+Lakeside+Colombo"
  },

  // ---- Cover screen -----------------------------------------------------
  cover: {
    title: { en: "Wedding", si: "විවාහ" },
    titleLine2: { en: "Invitation", si: "ආරාධනා පත්‍රය" },
    hint: { en: "Tap or swipe up to open", si: "විවෘත කිරීමට ස්පර්ශ කරන්න" }
  },

  // ---- Welcome / blessing line (dashboard) -------------------------------
  // Edit freely, or delete the <p class="blessing"> line in index.html
  // if you'd rather not include it.
  message: {
    en: "Together with our families, we joyfully invite you to witness the beginning of our forever.",
    si: "අපගේ විවාහ මංගල්‍යයට සහභාගී වන ලෙස ඔබට සතුටින් ආරාධනා කරමු."
  },

  // ---- Countdown captions -------------------------------------------------
  countdown: {
    title: { en: "Counting down to our big day", si: "අපගේ මංගල උත්සවයට තව දින" },
    days: { en: "days", si: "දින" },
    hours: { en: "hours", si: "පැය" },
    mins: { en: "min", si: "මිනි" },
    secs: { en: "sec", si: "තත්" }
  },

  // ---- Photo placeholder ---------------------------------------------------
  // Leave src as null to show the elegant placeholder frame.
  // Once you have a photo: drop the file into assets/images/ and set, e.g.
  //   src: "assets/images/couple.jpg"
  // It will appear inside the arch frame automatically — no other changes needed.
  photo: {
    img src: "assets/images/photo_6_2026-09-07_18-16-51.jpg",
    caption: { en: "", si: "" }
  },

  // ---- Footer --------------------------------------------------------------
  footer: {
    text: { en: "With love, Irantha & Kanchana", si: "ආදරයෙන්, ඉරන්ත සහ කාංචනා" }
  }

  // ---------------------------------------------------------------------
  // Adding a brand-new section later (e.g. RSVP, Schedule, Gallery)?
  // Add a new object here following the same { en, si } pattern, then
  // reference it with a matching data-i18n="yourKey.yourField" attribute
  // in index.html. See README.md → "Adding new sections".
  // ---------------------------------------------------------------------
};
