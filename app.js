// ExamSathi shared app.js
(function () {
  "use strict";

  /* Google Analytics 4 */
  const GA_ID = "G-NE39V76SVK";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  if (!window.__EXAMSATHI_GA_LOADED__) {
    window.__EXAMSATHI_GA_LOADED__ = true;

    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: true });

    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_ID);
    document.head.appendChild(gaScript);
  }

  /* ExamSathi theme */
  const KEY = "examsathi-theme";

  function theme() {
    document.documentElement.classList.toggle(
      "dark",
      localStorage.getItem(KEY) === "dark"
    );
  }

  theme();

  document.addEventListener("click", function (e) {
    const t = e.target.closest("[data-theme]");
    if (t) {
      localStorage.setItem(
        KEY,
        localStorage.getItem(KEY) === "dark" ? "light" : "dark"
      );
      theme();
    }
  });

  /* ExamSathi global search */
  function route(v) {
    v = (v || "").trim().toLowerCase();
    if (!v) return;

    const map = [
      ["job", "jobs.html"],
      ["vacancy", "jobs.html"],
      ["notification", "notifications.html"],
      ["admit", "admit-cards.html"],
      ["result", "results.html"],
      ["exam", "exams.html"],
      ["syllabus", "study.html"],
      ["pyq", "study.html"],
      ["current", "current-affairs.html"],
      ["quiz", "current-affairs.html"],
      ["mock", "mock-tests.html"],
      ["tool", "tools.html"],
      ["photo", "tools.html"],
      ["pdf", "tools.html"]
    ];

    const hit = map.find(function (x) {
      return v.includes(x[0]);
    });

    if (hit) {
      location.href = hit[1] + "?q=" + encodeURIComponent(v);
    }
  }

  document.querySelectorAll("[data-search]").forEach(function (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") route(input.value);
    });
  });
})();
