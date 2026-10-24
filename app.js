(() => {
  const data = window.MCA_DATA || {documents:[], subjects:[]};
  const icons={"Operating Systems":"⚙️","Mathematical Foundations":"∑","Front-End Development":"🌐","Programming with C and C++":"💻"};
  const units={
    "DISCRETE-UNIT-1.pdf":"Unit 1 — Set Theory",
    "DISCRETE UNIT-2 (theycotes.com)":"Unit 2 — Algebraic Structures",
    "DISCRETE UNIT-3 (theycotes.com)":"Unit 3 — Posets and Lattices",
    "DISCRETE UNIT-4 (theycotes.com)":"Unit 4 — Mathematical Logic",
    "DISCRETE UNIT-5 (theycotes.com)":"Unit 5 — Boolean Algebra"
  };
  let selectedSubject="All", query="";
  const subjectGrid=document.getElementById("subjectGrid"), notesGrid=document.getElementById("notesGrid"), pyqsGrid=document.getElementById("pyqsGrid"), empty=document.getElementById("emptyState");
  document.getElementById("docCount").textContent=data.documents.length; document.getElementById("subjectCount").textContent=data.subjects.length;
  function isPyq(d){return /sessional|session|paper|pyq|question|test|supply|supplementary/i.test(d.title+" "+d.file);}
  function label(d){ if(d.subject==="Mathematical Foundations"){const k=Object.keys(units).find(x=>d.file.toLowerCase().includes(x.toLowerCase().replace('.pdf',''))); if(k)return units[k];} return d.title; }
  function renderSubjects(){
    subjectGrid.innerHTML="";
    data.subjects.forEach(subject=>{const count=data.documents.filter(d=>d.subject===subject).length; const card=document.createElement("button"); card.className="subject-card"+(selectedSubject===subject?" active":""); card.innerHTML=`<span class="subject-count">${count}</span><div class="subject-icon">${icons[subject]||"📚"}</div><h3>${subject}</h3><p>Notes &amp; PYQs — kept separate</p>`; card.addEventListener("click",()=>{selectedSubject=selectedSubject===subject?"All":subject;renderSubjects();renderResources();}); subjectGrid.appendChild(card);});
  }
  function card(d,type){const c=document.createElement("article"); c.className="resource-card"; c.innerHTML=`<div><div class="res-top"><div class="file-icon">PDF</div><span class="tag">${type}</span></div><h4>${label(d)}</h4><p>${d.subject}</p></div><div class="res-actions"><button class="view-btn">View PDF →</button><button class="fav-btn" title="Save favourite">♡</button></div>`; c.querySelector(".view-btn").addEventListener("click",()=>openPdf(d)); const fav=c.querySelector(".fav-btn"),key="mca-fav-"+d.id; if(localStorage.getItem(key))fav.textContent="♥"; fav.addEventListener("click",()=>{if(localStorage.getItem(key)){localStorage.removeItem(key);fav.textContent="♡"}else{localStorage.setItem(key,"1");fav.textContent="♥"}}); return c;}
  function renderResources(){
    const docs=data.documents.filter(d=>(selectedSubject==="All"||d.subject===selectedSubject)&&(!query||`${d.title} ${d.subject}`.toLowerCase().includes(query)));
    notesGrid.innerHTML=""; pyqsGrid.innerHTML="";
    const notes=docs.filter(d=>!isPyq(d)), pyqs=docs.filter(isPyq);
    notes.forEach(d=>notesGrid.appendChild(card(d,"Notes"))); pyqs.forEach(d=>pyqsGrid.appendChild(card(d,"PYQ")));
    document.getElementById("notesCount").textContent=notes.length; document.getElementById("pyqsCount").textContent=pyqs.length;
    document.getElementById("libraryTitle").textContent=selectedSubject==="All"?"All subjects":selectedSubject;
    empty.hidden=docs.length!==0;
  }
  function openPdf(d){const m=document.getElementById("pdfModal");document.getElementById("modalTitle").textContent=label(d);document.getElementById("pdfFrame").src=d.file;document.getElementById("openPdf").href=d.file;m.classList.add("open");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
  function closePdf(){const m=document.getElementById("pdfModal");m.classList.remove("open");m.setAttribute("aria-hidden","true");document.getElementById("pdfFrame").src="";document.body.style.overflow="";}
  document.querySelectorAll("[data-close]").forEach(x=>x.addEventListener("click",closePdf)); document.addEventListener("keydown",e=>{if(e.key==="Escape")closePdf()});
  document.getElementById("searchInput").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();renderResources()});
  document.getElementById("pyqBtn").addEventListener("click",()=>{document.getElementById("pyqsSection").scrollIntoView({behavior:"smooth"})});
  document.getElementById("randomBtn").addEventListener("click",()=>{const d=data.documents[Math.floor(Math.random()*data.documents.length)];if(d)openPdf(d)});
  document.querySelectorAll("[data-scroll]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.scroll)?.scrollIntoView({behavior:"smooth"})));
  document.getElementById("themeBtn").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("mca-dark",document.body.classList.contains("dark")?"1":"0")}); if(localStorage.getItem("mca-dark")==="1")document.body.classList.add("dark");
  function getReply(q){const s=q.toLowerCase();if(s.includes("process")&&s.includes("operating"))return"A process is a program in execution. Common states are New, Ready, Running, Waiting/Blocked and Terminated.";if(s.includes("fcfs"))return"FCFS schedules processes in arrival order. It is simple and non-preemptive.";if(s.includes("sjf"))return"SJF selects the process with the smallest CPU burst and can reduce average waiting time.";if(s.includes("pcb"))return"PCB is the OS data structure containing process state, program counter, registers and other process information.";if(s.includes("css")&&s.includes("box"))return"CSS box model: content, padding, border and margin.";if(s.includes("fibonacci"))return"Fibonacci starts 0, 1; each next term is the sum of the previous two.";return"Try asking about OS processes, FCFS, SJF, PCB, CSS box model or Fibonacci.";}
  function addMsg(t,w){const d=document.createElement("div");d.className="msg "+w;d.textContent=t;const box=document.getElementById("chatMessages");box.appendChild(d);box.scrollTop=box.scrollHeight;}
  document.getElementById("chatForm").addEventListener("submit",e=>{e.preventDefault();const i=document.getElementById("chatInput"),q=i.value.trim();if(!q)return;addMsg(q,"user");i.value="";setTimeout(()=>addMsg(getReply(q),"bot"),250)});
  document.querySelectorAll(".suggestions button").forEach(b=>b.addEventListener("click",()=>{document.getElementById("chatInput").value=b.dataset.q;document.getElementById("chatForm").requestSubmit()}));
  renderSubjects();renderResources();
})();
