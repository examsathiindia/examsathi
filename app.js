
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
