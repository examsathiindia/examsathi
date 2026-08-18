
(function(){
  const $=s=>document.querySelector(s);
  const $$=s=>document.querySelectorAll(s);
  const themeKey='examsathi-theme';
  function applyTheme(){document.documentElement.classList.toggle('dark',localStorage.getItem(themeKey)==='dark')}
  applyTheme();
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-theme]');
    if(t){localStorage.setItem(themeKey,localStorage.getItem(themeKey)==='dark'?'light':'dark');applyTheme();}
  });
  // Smooth internal navigation for legacy sections if present.
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href^="#"]'); if(!a)return;
    const el=document.querySelector(a.getAttribute('href')); if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'});}
  });
  // Generic search: redirects to the most relevant page when the user types a section name.
  function goSearch(v){
    v=v.toLowerCase().trim(); if(!v)return;
    const routes=[
      ['job','jobs.html'],['vacancy','jobs.html'],['notification','notifications.html'],
      ['admit','admit-cards.html'],['result','results.html'],['exam','exams.html'],
      ['syllabus','study.html'],['pyq','study.html'],['current','current-affairs.html'],
      ['quiz','current-affairs.html'],['mock','mock-tests.html'],['test','mock-tests.html'],
      ['tool','tools.html'],['photo','tools.html'],['signature','tools.html'],['pdf','tools.html']
    ];
    const hit=routes.find(x=>v.includes(x[0])); if(hit)location.href=hit[1]+'?q='+encodeURIComponent(v);
  }
  $$('[data-global-search]').forEach(inp=>inp.addEventListener('keydown',e=>{if(e.key==='Enter')goSearch(inp.value)}));
})();


/* Preserved ExamSathi functionality from the previous single-page build */

let passImg=null, resizeImgObj=null, sigImg=null, bgImg=null, changeImgObj=null, compImg=null, convImg=null;
window.compressedBlob=null; window.convertedBlob=null;

function $(id){return document.getElementById(id)}
function openTool(id){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const el=$(id); if(el){el.classList.add('active'); el.scrollIntoView({behavior:'smooth',block:'start'});}
}
function closeTool(id){const el=$(id); if(el) el.classList.remove('active')}

function loadImage(file){
  return new Promise((resolve,reject)=>{
    if(!file){reject(new Error('Please select an image.'));return}
    const url=URL.createObjectURL(file), img=new Image();
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Could not read image.'))};
    img.src=url;
  });
}
function setupCanvas(canvas,w,h){canvas.width=w;canvas.height=h;return canvas.getContext('2d')}
function canvasBlob(canvas,type='image/jpeg',quality=.9){
  return new Promise(r=>canvas.toBlob(r,type,quality));
}
function downloadBlob(blob,name){
  if(!blob){alert('Create the file first.');return}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function downloadCanvas(id,name){
  const c=$(id); if(!c||!c.width){alert('Create the image first.');return}
  c.toBlob(b=>downloadBlob(b,name),'image/jpeg',.92);
}

function scrollToSection(id){
  const el=$(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
}
$('jobSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  document.querySelectorAll('.job-card').forEach(c=>{
    c.style.display=(!q || c.dataset.job.includes(q))?'':'none';
  });
});

$('examSearch').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  document.querySelectorAll('.exam-card').forEach(card=>{
    card.style.display = (!q || card.dataset.exams.includes(q)) ? 'block' : 'none';
  });
});

const resultSearch=$('resultSearch');
if(resultSearch){
  resultSearch.addEventListener('input',e=>{
    const q=e.target.value.toLowerCase().trim();
    document.querySelectorAll('.result-card').forEach(card=>{
      card.style.display=(!q || card.dataset.result.includes(q))?'':'none';
    });
  });
}

const notificationSearch=$('notificationSearch');
if(notificationSearch){
  notificationSearch.addEventListener('input',e=>{
    const q=e.target.value.toLowerCase().trim();
    document.querySelectorAll('.notification-card').forEach(card=>{
      card.style.display=(!q || card.dataset.notification.includes(q))?'':'none';
    });
  });
}

function showPortalMessage(name){
  alert(name + ' section is ready. Official links/data can be added here next.');
}

$('searchBox').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  document.querySelectorAll('.tool-card').forEach(c=>c.style.display=c.dataset.name.includes(q)?'block':'none');
});

$('passZoom').addEventListener('input',e=>$('passZoomText').textContent=e.target.value+'%');
$('compQuality').addEventListener('input',e=>$('compQualityText').textContent=e.target.value+'%');

$('passFile').addEventListener('change',async e=>{try{passImg=await loadImage(e.target.files[0]);$('passInfo').textContent='Photo loaded. Adjust zoom and tap Generate.'}catch(err){alert(err.message)}});

function makePassport(){
  if(!passImg){alert('Please upload a photo.');return}
  const [w,h]=$('passSize').value.split('x').map(Number), c=$('passCanvas'), ctx=setupCanvas(c,w,h);
  ctx.fillStyle=$('passBg').value;ctx.fillRect(0,0,w,h);
  const zoom=Number($('passZoom').value)/100;
  const scale=Math.max(w/passImg.width,h/passImg.height)*zoom;
  const dw=passImg.width*scale,dh=passImg.height*scale;
  ctx.drawImage(passImg,(w-dw)/2,(h-dh)/2,dw,dh);
  $('passDownload').disabled=false;
  $('passInfo').textContent=`Output: ${w}×${h}px • ${$('passKB').options[$('passKB').selectedIndex].text}`;
}

$('resizeFile').addEventListener('change',async e=>{try{resizeImgObj=await loadImage(e.target.files[0]);$('resizeW').value=resizeImgObj.naturalWidth;$('resizeH').value=resizeImgObj.naturalHeight}catch(err){alert(err.message)}});
function resizeImage(){
  if(!resizeImgObj){alert('Please upload an image.');return}
  const w=Math.max(1,parseInt($('resizeW').value)||0),h=Math.max(1,parseInt($('resizeH').value)||0);
  const c=$('resizeCanvas'),ctx=setupCanvas(c,w,h);ctx.drawImage(resizeImgObj,0,0,w,h);
  $('resizeDownload').disabled=false;$('resizeInfo').textContent=`${w}×${h}px`;
}

$('sigFile').addEventListener('change',async e=>{try{sigImg=await loadImage(e.target.files[0]);}catch(err){alert(err.message)}});
function resizeSignature(){
  if(!sigImg){alert('Please upload a signature.');return}
  const w=Math.max(1,parseInt($('sigW').value)||600),h=Math.max(1,parseInt($('sigH').value)||200);
  const c=$('sigCanvas'),ctx=setupCanvas(c,w,h);ctx.clearRect(0,0,w,h);ctx.drawImage(sigImg,0,0,w,h);
  $('sigDownload').disabled=false;$('sigInfo').textContent=`${w}×${h}px`;
}

$('bgFile').addEventListener('change',async e=>{try{bgImg=await loadImage(e.target.files[0]);$('bgStatus').textContent='Ready.'}catch(err){alert(err.message)}});
async function removeBackground(){
  if(!bgImg){alert('Please upload an image.');return}
  $('removeBtn').disabled=true;$('bgStatus').textContent='Loading AI model… first use can be slow.';
  try{
    const mod=await import('https://esm.sh/@imgly/background-removal@1.7.0');
    const file=$('bgFile').files[0];
    const blob=await mod.removeBackground(file,{output:{format:'image/png'}});
    const img=await loadImage(blob);
    const c=$('bgCanvas'),ctx=setupCanvas(c,img.naturalWidth,img.naturalHeight);ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0);
    $('bgDownload').disabled=false;$('bgStatus').textContent='Background removed successfully.';
  }catch(err){
    console.error(err);$('bgStatus').textContent='AI removal failed. Check internet/browser support and try again.';
    alert('Background removal could not run. First use requires downloading the AI model.');
  }finally{$('removeBtn').disabled=false}
}

$('changeFile').addEventListener('change',async e=>{try{changeImgObj=await loadImage(e.target.files[0])}catch(err){alert(err.message)}});
function changeBackground(){
  if(!changeImgObj){alert('Please upload an image.');return}
  const c=$('changeCanvas'),ctx=setupCanvas(c,changeImgObj.naturalWidth,changeImgObj.naturalHeight);
  ctx.fillStyle=$('changeColor').value;ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(changeImgObj,0,0);
  $('changeDownload').disabled=false;
}

$('compFile').addEventListener('change',async e=>{try{compImg=await loadImage(e.target.files[0]);$('compInfo').textContent='Ready to compress.'}catch(err){alert(err.message)}});
async function compressImage(){
  if(!compImg){alert('Please upload an image.');return}
  const q=Number($('compQuality').value)/100,c=document.createElement('canvas');c.width=compImg.naturalWidth;c.height=compImg.naturalHeight;c.getContext('2d').drawImage(compImg,0,0);
  window.compressedBlob=await canvasBlob(c,'image/jpeg',q);
  const kb=Math.round(window.compressedBlob.size/1024);$('compInfo').textContent=`Compressed JPG: ${kb} KB`;$('compDownload').disabled=false;
}

$('convFile').addEventListener('change',async e=>{try{convImg=await loadImage(e.target.files[0]);$('convInfo').textContent='Ready to convert.'}catch(err){alert(err.message)}});
async function convertImage(){
  if(!convImg){alert('Please upload an image.');return}
  const fmt=$('convFmt').value,c=document.createElement('canvas');c.width=convImg.naturalWidth;c.height=convImg.naturalHeight;const ctx=c.getContext('2d');
  if(fmt==='image/jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height)}
  ctx.drawImage(convImg,0,0);
  window.convertedBlob=await canvasBlob(c,fmt,.92);
  const ext=fmt==='image/png'?'png':fmt==='image/webp'?'webp':'jpg';
  $('convInfo').textContent=`Converted to ${ext.toUpperCase()} • ${Math.round(window.convertedBlob.size/1024)} KB`;
  $('convDownload').disabled=false;$('convDownload').onclick=()=>downloadBlob(window.convertedBlob,'converted-image.'+ext);
}

const studySearch = $('studySearch');
if(studySearch){
  studySearch.addEventListener('input',()=>{
    const q=studySearch.value.toLowerCase().trim();
    document.querySelectorAll('.study-card').forEach(card=>{
      card.style.display=(!q || (card.dataset.study||'').includes(q))?'block':'none';
    });
  });
}



const calendarSearch = $('calendarSearch');
if(calendarSearch){
  calendarSearch.addEventListener('input',()=>{
    const q=calendarSearch.value.toLowerCase().trim();
    document.querySelectorAll('.calendar-card').forEach(card=>{
      card.style.display=(!q || (card.dataset.calendar||'').includes(q))?'block':'none';
    });
  });
}

const currentAffairsSearch = $('currentAffairsSearch');
if(currentAffairsSearch){
  currentAffairsSearch.addEventListener('input',()=>{
    const q=currentAffairsSearch.value.toLowerCase().trim();
    document.querySelectorAll('.current-card').forEach(card=>{
      card.style.display=(!q || (card.dataset.current||'').includes(q))?'block':'none';
    });
  });
}

document.querySelectorAll('.quiz-card').forEach(card=>{
  card.querySelectorAll('.quiz-option').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const result=card.querySelector('.quiz-result');
      const answer=card.dataset.answer;
      const correct=btn.textContent.trim()===answer;
      result.textContent=correct?'✅ Correct!':'❌ Incorrect. Correct answer: '+answer;
      card.querySelectorAll('.quiz-option').forEach(b=>b.disabled=true);
    });
  });
});
function resetQuiz(){
  document.querySelectorAll('.quiz-card').forEach(card=>{
    card.querySelectorAll('.quiz-option').forEach(b=>b.disabled=false);
    const r=card.querySelector('.quiz-result'); if(r) r.textContent='';
  });
}

const answerKeySearch = $('answerKeySearch');
if(answerKeySearch){
  answerKeySearch.addEventListener('input',()=>{
    const q=answerKeySearch.value.toLowerCase().trim();
    document.querySelectorAll('.answerkey-card').forEach(card=>{
      card.style.display=(!q || (card.dataset.answer||'').includes(q))?'block':'none';
    });
  });
}

const admitSearch = $('admitSearch');
if(admitSearch){
  admitSearch.addEventListener('input',()=>{
    const q=admitSearch.value.toLowerCase().trim();
    document.querySelectorAll('.admit-card').forEach(card=>{
      card.style.display=(!q || (card.dataset.admit||'').includes(q))?'block':'none';
    });
  });
}

async function createPDF(){
  const files=[...$('pdfFiles').files];if(!files.length){alert('Select at least one image.');return}
  $('pdfStatus').textContent='Creating PDF…';
  try{
    const imgs=[];for(const f of files)imgs.push(await loadImage(f));
    const pages=imgs.map(img=>{const c=document.createElement('canvas');const maxW=595,maxH=842,scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);return c});
    const pdf=buildPDF(pages);downloadBlob(pdf,'ExamSathi-images.pdf');$('pdfStatus').textContent=`PDF created • ${pages.length} page(s)`;
  }catch(err){console.error(err);$('pdfStatus').textContent='Could not create PDF.'}
}

/* Minimal browser-side PDF writer: embeds JPEG page images without external library. */
function buildPDF(canvases){
  const enc=new TextEncoder();
  const objects=[];
  const addObject=(bytes)=>{objects.push(bytes);return objects.length;};
  const header=enc.encode('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const catalogId=1, pagesId=2;
  const pageIds=[], contentIds=[], imageIds=[];

  // Reserve the object numbers in a stable order: catalog, pages, then each page's image/content/page.
  canvases.forEach((c,i)=>{
    imageIds.push(3+i*3);
    contentIds.push(4+i*3);
    pageIds.push(5+i*3);
  });

  addObject(new Uint8Array()); // placeholder for catalog
  addObject(new Uint8Array()); // placeholder for pages

  canvases.forEach((c,i)=>{
    const jpegData=c.toDataURL('image/jpeg',.9).split(',')[1];
    const raw=Uint8Array.from(atob(jpegData),x=>x.charCodeAt(0));
    const imgHead=enc.encode(`${imageIds[i]} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${raw.length} >>\nstream\n`);
    const imgTail=enc.encode('\nendstream\nendobj\n');
    addObject(new Uint8Array([...imgHead,...raw,...imgTail]));

    const stream=`q ${c.width} 0 0 ${c.height} 0 0 cm /Im${i} Do Q`;
    addObject(enc.encode(`${contentIds[i]} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`));
    addObject(enc.encode(`${pageIds[i]} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${c.width} ${c.height}] /Resources << /XObject << /Im${i} ${imageIds[i]} 0 R >> >> /Contents ${contentIds[i]} 0 R >>\nendobj\n`));
  });

  objects[1]=enc.encode(`${pagesId} 0 obj\n<< /Type /Pages /Kids [${pageIds.map(x=>x+' 0 R').join(' ')}] /Count ${pageIds.length} >>\nendobj\n`);
  objects[0]=enc.encode(`${catalogId} 0 obj\n<< /Type /Catalog /Pages ${pagesId} 0 R >>\nendobj\n`);

  const chunks=[header];
  const offsets=[0];
  let pos=header.length;
  for(const obj of objects){offsets.push(pos);chunks.push(obj);pos+=obj.length;}
  const xrefPos=pos;
  let xref=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for(let i=1;i<=objects.length;i++)xref+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
  const trailer=`trailer\n<< /Size ${objects.length+1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  chunks.push(enc.encode(xref+trailer));
  return new Blob(chunks,{type:'application/pdf'});
}



const MOCK_BANK={
ssc:[
['What is 25% of 240?',['40','50','60','70'],2],
['If a train covers 360 km in 4 hours, its average speed is:',['80 km/h','90 km/h','100 km/h','120 km/h'],1],
['Which word is closest in meaning to “brief”?',['Long','Short','Difficult','Bright'],1],
['The HCF of 18 and 24 is:',['3','6','9','12'],1],
['Which is the largest planet in our Solar System?',['Earth','Mars','Jupiter','Venus'],2],
['A shopkeeper buys an item for ₹500 and sells it for ₹600. Profit percent is:',['10%','15%','20%','25%'],2],
['Find the next number: 2, 4, 8, 16, ?',['20','24','30','32'],3],
['Which fundamental right is related to equality before law?',['Article 14','Article 19','Article 21','Article 32'],0],
['If 3 workers finish a job in 12 days, at the same rate 6 workers take:',['3 days','6 days','12 days','24 days'],1],
['Which gas is most abundant in Earth’s atmosphere?',['Oxygen','Nitrogen','Carbon dioxide','Hydrogen'],1]
],
banking:[
['What does RBI stand for?',['Reserve Bank of India','Regional Bank of India','Rural Bank of India','Reserve Bureau of India'],0],
['If ₹1,000 earns simple interest of ₹100 in 2 years, the annual rate is:',['2%','5%','10%','20%'],2],
['A number increased by 20% becomes 360. The original number is:',['280','300','320','340'],1],
['Which institution regulates monetary policy in India?',['SEBI','RBI','NITI Aayog','NABARD'],1],
['What is the square root of 144?',['10','11','12','14'],2],
['Which of these is generally a current account feature?',['Only fixed interest','Frequent transactions','No withdrawals','Only for minors'],1],
['If 5 pens cost ₹75, 8 pens cost:',['₹100','₹110','₹120','₹125'],2],
['What is the full form of KYC?',['Know Your Customer','Keep Your Cash','Know Your Credit','Key Yield Certificate'],0],
['Find 15% of 800.',['100','120','140','160'],1],
['A ratio of 2:3 has total 25. The smaller part is:',['8','10','12','15'],1]
],
assam:[
['What is the capital of Assam?',['Guwahati','Dispur','Jorhat','Dibrugarh'],1],
['Kaziranga National Park is especially known for the:',['One-horned rhinoceros','Lion','Camel','Penguin'],0],
['Which river is closely associated with Assam’s major river system?',['Brahmaputra','Narmada','Godavari','Tapi'],0],
['Bihu is primarily associated with which state?',['Assam','Kerala','Punjab','Gujarat'],0],
['Majuli is famous as a large:',['Desert','River island','Mountain pass','Coastal lagoon'],1],
['Which city is known as the “Tea City of India” in Assam?',['Dibrugarh','Silchar','Tezpur','Barpeta'],0],
['The Assamese language is written mainly in which script?',['Bengali-Assamese script','Roman script','Tamil script','Gujarati script'],0],
['Sivasagar is historically associated with the:',['Ahom kingdom','Maurya empire','Chola kingdom','Mughal capital'],0],
['Which is a major wildlife sanctuary/park in Assam?',['Manas','Gir','Periyar','Bandipur'],0],
['The Brahmaputra enters Assam near:',['Sadiya region','Silchar','Karimganj','Dhubri only'],0]
]};
let mockState={key:null,questions:[],answers:[],index:0,time:600,timer:null,submitted:false};
function startMock(key){
  clearInterval(mockState.timer); mockState={key,questions:MOCK_BANK[key],answers:Array(10).fill(null),index:0,time:600,timer:null,submitted:false};
  document.getElementById('mockPanel').style.display='block'; document.getElementById('mockResult').classList.add('hidden');
  document.getElementById('mockTitle').textContent=key==='ssc'?'SSC Practice Mock Test':key==='banking'?'Banking Practice Mock Test':'Assam Exam Practice Mock Test';
  document.getElementById('mockPanel').scrollIntoView({behavior:'smooth',block:'start'}); renderMock();
  mockState.timer=setInterval(()=>{mockState.time--; renderTimer(); if(mockState.time<=0)submitMock(true)},1000);
}
function renderTimer(){const m=String(Math.floor(mockState.time/60)).padStart(2,'0'),s=String(mockState.time%60).padStart(2,'0');document.getElementById('mockTimer').textContent=m+':'+s;}
function renderMock(){
  renderTimer(); const q=mockState.questions[mockState.index];
  document.getElementById('mockProgress').textContent=`Question ${mockState.index+1} of ${mockState.questions.length}`;
  document.getElementById('mockQuestion').innerHTML=`<div style="font-size:17px;font-weight:800;line-height:1.45">${mockState.index+1}. ${q[0]}</div><div style="margin-top:14px">${q[1].map((o,i)=>`<label style="display:block;padding:12px;border:1px solid #dfe5ee;border-radius:10px;margin:8px 0;cursor:pointer;background:${mockState.answers[mockState.index]===i?'#eef4ff':'#fff'}"><input type="radio" name="mockOpt" value="${i}" ${mockState.answers[mockState.index]===i?'checked':''} onchange="saveMockAnswer(${i})" style="margin-right:8px">${o}</label>`).join('')}</div>`;
  document.getElementById('mockNav').innerHTML=mockState.questions.map((_,i)=>`<button class="btn ${i===mockState.index?'':'secondary'}" style="padding:7px 10px" onclick="mockGo(${i})">${i+1}</button>`).join('');
}
function saveMockAnswer(i){mockState.answers[mockState.index]=i;renderMock();}
function mockGo(i){if(!mockState.submitted){mockState.index=i;renderMock()}}
function mockNext(){if(mockState.index<mockState.questions.length-1){mockState.index++;renderMock()}else submitMock()}
function mockPrev(){if(mockState.index>0){mockState.index--;renderMock()}}
function submitMock(auto=false){if(mockState.submitted)return;mockState.submitted=true;clearInterval(mockState.timer);let correct=0,wrong=0,unanswered=0;mockState.questions.forEach((q,i)=>{if(mockState.answers[i]===null)unanswered++;else if(mockState.answers[i]===q[2])correct++;else wrong++});let score=correct-(wrong*0.25);score=Math.max(0,score);let pct=(score/mockState.questions.length*100).toFixed(1);const r=document.getElementById('mockResult');r.classList.remove('hidden');r.innerHTML=`<b>${auto?'⏰ Time over! ':'🎉 Test submitted! '}</b><br><br>Correct: <b>${correct}</b> &nbsp; Wrong: <b>${wrong}</b> &nbsp; Unanswered: <b>${unanswered}</b><br>Score: <b>${score.toFixed(2)} / ${mockState.questions.length}</b> &nbsp; Percentage: <b>${pct}%</b><br><br><button class="btn secondary" onclick="startMock('${mockState.key}')">🔄 Retake Test</button>`;document.getElementById('mockQuestion').innerHTML='<p style="font-weight:700">Your test is complete. Review your result above or retake the test.</p>';}
function closeMock(){clearInterval(mockState.timer);document.getElementById('mockPanel').style.display='none';}
