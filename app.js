
  // Google Analytics
  // Loaded from the shared app.js so all ExamSathi pages using app.js
  // automatically send page-view data to the same GA4 property.
  (function(){
    const GA_ID = "G-NE39V76SVK";
    if(window.__EXAMSATHI_GA_LOADED__) return;
    window.__EXAMSATHI_GA_LOADED__ = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(script);

    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  })();


(function(){
  "use strict";
  const KEY="examsathi-theme";
  function theme(){document.documentElement.classList.toggle("dark",localStorage.getItem(KEY)==="dark");}
  theme();
  document.addEventListener("click",function(e){
    const t=e.target.closest("[data-theme]");
    if(t){localStorage.setItem(KEY,localStorage.getItem(KEY)==="dark"?"light":"dark");theme();}
  });
  function route(v){
    v=(v||"").trim().toLowerCase(); if(!v)return;
    const map=[["job","jobs.html"],["vacancy","jobs.html"],["notification","notifications.html"],["admit","admit-cards.html"],["result","results.html"],["exam","exams.html"],["syllabus","study.html"],["pyq","study.html"],["current","current-affairs.html"],["quiz","current-affairs.html"],["mock","mock-tests.html"],["tool","tools.html"],["photo","tools.html"],["pdf","tools.html"]];
    const hit=map.find(x=>v.includes(x[0])); if(hit)location.href=hit[1]+"?q="+encodeURIComponent(v);
  }
  document.querySelectorAll("[data-search]").forEach(i=>i.addEventListener("keydown",e=>{if(e.key==="Enter")route(i.value)}));
})();
