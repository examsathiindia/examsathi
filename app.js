(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const data=window.EXAMSATHI_DATA||{};
function date(v){try{return new Date(v).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}catch{return v}}
function card(x,type){
 const href=x.url||"#";
 return `<article class="item-card">
  <div class="item-top"><span class="badge">${x.status||x.category||"Update"}</span><span class="date">${date(x.date)}</span></div>
  <h3>${x.title}</h3><p>${x.org||x.category||"ExamSathi"}</p>
  <div class="item-bottom"><span>${x.category||type}</span><a class="btn btn-sm" href="${href}">View Details →</a></div>
 </article>`;
}
function renderList(id,items,type,limit=6){
 const el=$("#"+id); if(!el)return;
 el.innerHTML=items.slice(0,limit).map(x=>card(x,type)).join("")||`<div class="empty">No updates available.</div>`;
}
renderList("latestJobs",data.jobs||[],"Jobs");
renderList("latestNotifications",data.notifications||[],"Notifications");
renderList("latestResults",data.results||[],"Results");
renderList("latestAdmit",data.admitCards||[],"Admit Cards");

const nav=$(".sidebar"), overlay=$(".nav-overlay");
$("#menuBtn")?.addEventListener("click",()=>{nav?.classList.toggle("open");overlay?.classList.toggle("show")});
overlay?.addEventListener("click",()=>{nav?.classList.remove("open");overlay?.classList.remove("show")});
$$(".theme-toggle").forEach(b=>b.addEventListener("click",()=>{
 const dark=document.documentElement.classList.toggle("dark");localStorage.setItem("es-theme",dark?"dark":"light");
 $$(".theme-toggle").forEach(x=>x.textContent=dark?"☀️":"🌙");
}));
if(localStorage.getItem("es-theme")==="dark"){document.documentElement.classList.add("dark");$$(".theme-toggle").forEach(x=>x.textContent="☀️")}

const all=[...(data.jobs||[]).map(x=>({...x,type:"Jobs"})),...(data.notifications||[]).map(x=>({...x,type:"Notifications"})),...(data.results||[]).map(x=>({...x,type:"Results"})),...(data.admitCards||[]).map(x=>({...x,type:"Admit Cards"})),...(data.exams||[]).map(x=>({...x,type:"Exams"}))];
function search(q){
 const box=$("#searchResults"); if(!box)return;
 q=q.trim().toLowerCase();
 if(!q){box.classList.remove("show");return}
 const hits=all.filter(x=>(x.title+" "+(x.org||"")+" "+(x.category||"")+" "+x.type).toLowerCase().includes(q)).slice(0,10);
 box.innerHTML=hits.length?hits.map(x=>`<a href="${x.url||"#"}"><b>${x.title}</b><small>${x.type} · ${x.category||""}</small></a>`).join(""):`<div class="empty">No results found.</div>`;
 box.classList.add("show");
}
$$(".global-search").forEach(i=>i.addEventListener("input",e=>search(e.target.value)));
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))$$(".search-results").forEach(x=>x.classList.remove("show"))});
})();