/*
  PEPG 3 Prototype
  ----------------
  Modular browser-only research prototype.
  Each engine is represented as a class so it can be reused by multiple governance objects.
*/

class ContextEngine {
  constructor(contexts = []) { this.contexts = contexts; }
  add(context) {
    if (!context || this.contexts.includes(context)) return false;
    this.contexts.push(context); return true;
  }
  matches(problem, query) {
    const hay = [
      problem.context, problem.contextLabel, ...(problem.tags || []),
      problem.title, problem.short, problem.definition
    ].join(" ").toLowerCase();
    return !query || hay.includes(query.toLowerCase());
  }
}

class VotingEngine {
  constructor() {}
  vote(target, direction) {
    target.votes = target.votes || {up:0, down:0};
    if (!["up","down"].includes(direction)) return;
    target.votes[direction] += 1;
  }
  getNet(target) {
    const v = target.votes || {up:0,down:0};
    return v.up - v.down;
  }
}

class RatingEngine {
  rate(target, scores) {
    target.rating = {
      effectiveness: clamp(Number(scores.effectiveness), 0, 10),
      cost: clamp(Number(scores.cost), 0, 10),
      risk: clamp(Number(scores.risk), 0, 10)
    };
  }
  average(target) {
    const r = target.rating || {effectiveness:0,cost:0,risk:0};
    return ((r.effectiveness+r.cost+r.risk)/3).toFixed(1);
  }
}

class TrustEngine {
  request(target, note = "") {
    target.trust = target.trust || {status:"pending", requests:0, note:""};
    target.trust.requests += 1;
    target.trust.status = "pending";
    target.trust.note = note || "Trust/authorization validation requested.";
  }
}

class VerifyEngine {
  request(target) {
    target.verificationRequests = (target.verificationRequests || 0) + 1;
    target.verification = `Verification requested by ${target.verificationRequests} user(s).`;
  }
}

class DelegateEngine {
  delegate(target, representative, context, amount = 1) {
    target.delegations = target.delegations || [];
    target.delegations.push({
      id:`DEL-${Date.now()}`,
      representative,
      context,
      amount: Math.max(1, Number(amount) || 1),
      status:"active",
      createdAt:new Date().toISOString()
    });
  }
  revoke(target, index) {
    const d = target.delegations?.[index];
    if (d) d.status = "revoked";
  }
  activeWeight(target, context) {
    return (target.delegations || [])
      .filter(d => d.status === "active" && d.context.toLowerCase() === context.toLowerCase())
      .reduce((sum,d) => sum + d.amount, 0);
  }
}

class DiscussEngine {
  addRoom(target, title) {
    target.discussions = target.discussions || [];
    target.discussions.push({
      id:`D-${String(target.discussions.length+1).padStart(3,"0")}`,
      title, messages:0, closureSupport:0,
      status:"open", candidateResult:null
    });
  }
  supportClosure(target, index) {
    const d = target.discussions?.[index];
    if (!d) return;
    d.closureSupport = Math.min(100, d.closureSupport + 10);
    if (d.closureSupport >= 80) d.status = "closed";
  }
  nominateResult(target, index, result) {
    const d = target.discussions?.[index];
    if (d) d.candidateResult = result;
  }
}

class ReportEngine {
  request(target, kind) {
    target.reports = target.reports || [];
    target.reports.push({
      id:`REP-${Date.now()}`, kind, status:"requested",
      createdAt:new Date().toISOString()
    });
  }
}

class BoardEngine {
  constructor() { this.problems = []; }
  addProblem(problem) { this.problems.push(problem); }
  get(id) { return this.problems.find(p=>p.id===id); }
  nextId() { return `PEPG-${String(this.problems.length+1).padStart(4,"0")}`; }
}

const clamp=(n,min,max)=>Number.isFinite(n)?Math.min(max,Math.max(min,n)):min;

const board = new BoardEngine();
const contextEngine = new ContextEngine(["governance","infrastructure","technology"]);
const voteEngine = new VotingEngine();
const ratingEngine = new RatingEngine();
const trustEngine = new TrustEngine();
const verifyEngine = new VerifyEngine();
const delegateEngine = new DelegateEngine();
const discussEngine = new DiscussEngine();
const reportEngine = new ReportEngine();

board.addProblem({
  id:"PEPG-0001",
  title:"Centralized governance and concentration of execution and oversight",
  short:"A governance problem in which excessive centralization can reduce distributed participation and concentrate implementation and oversight.",
  definition:"Government capacity can become highly centralized, while execution and oversight may be concentrated in limited institutional channels. This can slow problem-solving, reduce public participation, and create risks of institutional or operational monopoly.",
  status:"community", statusLabel:"Community verified", context:"governance", contextLabel:"Governance",
  tags:["governance","centralization","oversight"],
  proposer:"Milad Habibpour",
  solutionProposer:"Milad Habibpour", solution:"Platform-Enabled People Governance (PEPG)",
  verification:"Community confirmation in this prototype. A future PEPG Board may allow a trusted authority to verify the problem.",
  evidence:"Prototype record — evidence and verification workflow are illustrative.",
  votes:{up:18,down:3}, rating:{effectiveness:0,cost:0,risk:0},
  definitionProposals:[
    {type:"Improved definition",text:"Separate administrative centralization from monopoly in implementation and oversight.",votes:{up:9,down:1}},
    {type:"Sub-problem",text:"Concentration of oversight functions.",votes:{up:7,down:1}}
  ],
  solutionProposals:[],
  discussions:[{id:"D-001",title:"What should be separated first?",status:"open",messages:12,closureSupport:0,candidateResult:null}],
  delegations:[],
  reports:[],
  trust:{status:"not requested",requests:0,note:""},
  links:{solution:"https://doi.org/10.5281/zenodo.22229362",implementation:"https://github.com/miladhp94/pepg"}
});

board.addProblem({
  id:"PEPG-0002",
  title:"Poor asphalt quality on an Abstract Street in Tanzania",
  short:"An illustrative public infrastructure problem showing how one problem can connect evidence, solutions, funding, implementation and oversight.",
  definition:"The asphalt surface on an Abstract Street in Tanzania is reported to deteriorate prematurely, creating mobility, safety, maintenance and public-resource concerns.",
  status:"authority", statusLabel:"Authority verified", context:"infrastructure", contextLabel:"Infrastructure → Transportation → Roads",
  tags:["infrastructure","transportation","roads","pavement"],
  proposer:"Community Problem Reporter", solutionProposer:"Milad Habibpour",
  solution:"PEPG-based distributed problem-solving workflow",
  verification:"Illustrative authority verification by a local public works authority. This is prototype data.",
  evidence:"Illustrative inspection report and community evidence.",
  votes:{up:27,down:4}, rating:{effectiveness:0,cost:0,risk:0},
  definitionProposals:[
    {type:"Sub-problem",text:"Drainage failure contributing to pavement deterioration.",votes:{up:12,down:1}},
    {type:"Improved definition",text:"Specify pavement age, road segment, material specification and failure pattern.",votes:{up:16,down:2}}
  ],
  solutionProposals:[{title:"Drainage-first intervention",link:"",votes:{up:11,down:2}}],
  discussions:[{id:"D-001",title:"Agree on the measurable definition of the road problem",status:"open",messages:21,closureSupport:0,candidateResult:null}],
  delegations:[],reports:[],trust:{status:"not requested",requests:0,note:""},
  links:{solution:"https://doi.org/10.5281/zenodo.22229362"}
});

const grid=document.getElementById("problemGrid");
const search=document.getElementById("search");
const statusFilter=document.getElementById("statusFilter");
const contextFilter=document.getElementById("contextFilter");
const problemModal=document.getElementById("problemModal");
const submitModal=document.getElementById("submitModal");
const detail=document.getElementById("problemDetail");
const count=document.getElementById("problemCount");

const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));

function render(){
  const q=search.value.trim().toLowerCase();
  const s=statusFilter.value;
  const ctx=contextFilter.value;
  const filtered=board.problems.filter(p =>
    contextEngine.matches(p,q) &&
    (s==="all"||p.status===s) &&
    (ctx==="all"||p.context===ctx)
  );
  count.textContent=board.problems.length;
  grid.innerHTML=filtered.length ? filtered.map(p=>`
    <article class="problem-card" data-id="${p.id}">
      <div class="problem-id">${p.id}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.short)}</p>
      <div class="tags">
        <span class="tag ${p.status==="authority"?"verified":"community"}">${esc(p.statusLabel)}</span>
        <span class="tag">${esc(p.contextLabel)}</span>
        <span class="tag">${p.votes.up} / ${p.votes.down} votes</span>
      </div>
    </article>`).join("") :
    "<div class='empty'>No problems match your search.</div>";
  document.querySelectorAll(".problem-card").forEach(c=>c.onclick=()=>openProblem(c.dataset.id));
}

function proposalCard(p,index){
  const x=p.definitionProposals[index];
  return `<div class="proposal-card">
    <div class="proposal-top"><span class="tag">${esc(x.type)}</span><span class="proposal-index">Proposal ${index+1}</span></div>
    <p>${esc(x.text)}</p>
    <div class="proposal-actions">
      <button class="mini-button" onclick="voteProposal('${p.id}',${index},'up')">▲ ${x.votes.up} Agree</button>
      <button class="mini-button" onclick="voteProposal('${p.id}',${index},'down')">▼ ${x.votes.down} Disagree</button>
    </div>
  </div>`;
}

function discussionCard(p,idx){
  const d=p.discussions[idx];
  return `<div class="proposal-card">
    <div class="proposal-top"><span class="tag">Discussion</span><span class="proposal-index">${esc(d.id)}</span></div>
    <p><strong>${esc(d.title)}</strong></p>
    <p class="muted">${d.messages} messages · ${d.status==="open"?"Open":"Closed"} · closure support ${d.closureSupport}%</p>
    ${d.candidateResult?`<p class="notice"><strong>Candidate result:</strong> ${esc(d.candidateResult)}</p>`:""}
    <div class="proposal-actions">
      <button class="mini-button" onclick="advanceDiscussion('${p.id}',${idx})">+ Support closure</button>
      <button class="mini-button" onclick="nominateResult('${p.id}',${idx})">Nominate result</button>
    </div>
  </div>`;
}

function delegationList(p){
  const rows=(p.delegations||[]).map((d,i)=>`
    <div class="proposal-card">
      <div class="proposal-top"><span class="tag">${esc(d.context)}</span><span class="proposal-index">${d.status}</span></div>
      <p><strong>${esc(d.representative)}</strong> · ${d.amount} delegated vote(s)</p>
      ${d.status==="active"?`<button class="mini-button" onclick="revokeDelegation('${p.id}',${i})">Revoke</button>`:""}
    </div>`).join("");
  return rows||"<div class='empty'>No delegations yet.</div>";
}

function openProblem(id){
  const p=board.get(id); if(!p)return;
  const activeWeight=delegateEngine.activeWeight(p,p.contextLabel.split(" → ")[0]);
  const links=Object.entries(p.links||{}).map(([k,u])=>`<a href="${u}" target="_blank" rel="noopener">${k.replace(/([A-Z])/g," $1").replace(/^./,c=>c.toUpperCase())}</a>`).join(" · ");

  detail.innerHTML=`
  <div class="detail-head">
    <div class="problem-id">${p.id}</div>
    <h2>${esc(p.title)}</h2>
    <div class="tags"><span class="tag ${p.status==="authority"?"verified":"community"}">${esc(p.statusLabel)}</span><span class="tag">${esc(p.contextLabel)}</span></div>
  </div>
  <div class="detail-grid">
    <div class="detail-box full"><h4>Problem definition</h4><p>${esc(p.definition)}</p>
      <div class="join-row">
        <button class="button secondary" onclick="redefineProblem('${p.id}')">↻ New definition</button>
        <button class="button secondary" onclick="challengeDefinition('${p.id}')">! Challenge</button>
      </div>
      <p class="notice">A proposed definition does not silently replace the current definition.</p>
    </div>

    <div class="detail-box"><h4>Context</h4><p>${esc(p.contextLabel)}</p><p class="notice">Context can drive search, related problems, solution discovery and contextual representation.</p></div>
    <div class="detail-box"><h4>Verification</h4><p>${esc(p.verification)}</p><div class="join-row"><button class="button secondary" onclick="verifyProblem('${p.id}')">Request verification</button></div></div>

    <div class="detail-box full"><h4>Community voting</h4>
      <p class="muted">Voting is a reusable engine. The same mechanism may later be attached to solutions, prioritization and oversight.</p>
      <div class="action-grid">
        <button class="action-card" onclick="voteProblem('${p.id}','up')"><span class="action-icon">▲</span><strong>Confirm / agree</strong><small>${p.votes.up} confirmations</small></button>
        <button class="action-card" onclick="voteProblem('${p.id}','down')"><span class="action-icon">▼</span><strong>Reject / disagree</strong><small>${p.votes.down} objections</small></button>
      </div>
    </div>

    <div class="detail-box full"><h4>Definition proposals</h4>
      <div class="proposal-list">${p.definitionProposals.map((_,i)=>proposalCard(p,i)).join("")||"<div class='empty'>No proposals yet.</div>"}</div>
    </div>

    <div class="detail-box full"><h4>Discussion Engine</h4>
      <p class="muted">Any participant in the room may propose closure. The room closes at 80% support.</p>
      <div class="proposal-list">${p.discussions.map((_,i)=>discussionCard(p,i)).join("")}</div>
      <div class="join-row"><button class="button secondary" onclick="newDiscussion('${p.id}')">+ Add discussion room</button></div>
    </div>

    <div class="detail-box"><h4>Rating Engine</h4>
      <p>Average rating: <strong>${ratingEngine.average(p)}</strong>/10</p>
      <div class="vote-summary"><span>Effectiveness: ${p.rating.effectiveness}</span><span>Cost: ${p.rating.cost}</span><span>Risk: ${p.rating.risk}</span></div>
      <button class="button secondary" onclick="rateSolution('${p.id}')">Rate</button>
    </div>

    <div class="detail-box"><h4>Delegation Engine</h4>
      <p>Active contextual weight: <strong>${activeWeight}</strong></p>
      <div class="join-row"><button class="button secondary" onclick="addDelegation('${p.id}')">+ Delegate</button></div>
      <div class="proposal-list">${delegationList(p)}</div>
      <p class="notice">Delegation is voluntary, contextual, changeable and revocable before the decision deadline.</p>
    </div>

    <div class="detail-box"><h4>Trust / Authorization</h4>
      <p>${esc(p.trust?.status || "not requested")}</p>
      <button class="button secondary" onclick="requestTrust('${p.id}')">Request trust validation</button>
      <p class="notice">${esc(p.trust?.note || "")}</p>
    </div>

    <div class="detail-box"><h4>Oversight / Reports</h4>
      <p>${(p.reports||[]).length} report or oversight request(s).</p>
      <button class="button secondary" onclick="requestOversight('${p.id}')">Request oversight</button>
    </div>

    <div class="detail-box full"><h4>Solutions and external links</h4>
      <p><strong>${esc(p.solution)}</strong></p>
      <div class="join-row">
        ${p.links.solution?`<a class="button primary" href="${p.links.solution}" target="_blank" rel="noopener">Open solution</a>`:""}
        <button class="button secondary" onclick="suggestSolution('${p.id}')">+ Suggest solution</button>
      </div>
      <p class="notice">The implementation may live outside PEPG while the Problem ID remains the common governance reference.</p>
      <p>${links||"No links yet."}</p>
    </div>
  </div>`;

  problemModal.classList.add("open");
  problemModal.setAttribute("aria-hidden","false");
}

function voteProblem(id,d){const p=board.get(id);if(!p)return;voteEngine.vote(p,d);openProblem(id);render()}
function voteProposal(id,index,d){const p=board.get(id),x=p?.definitionProposals[index];if(!x)return;voteEngine.vote(x,d);openProblem(id)}
function redefineProblem(id){const p=board.get(id);if(!p)return;const text=prompt("Write an improved definition:");if(!text?.trim())return;p.definitionProposals.push({type:"Improved definition",text:text.trim(),votes:{up:0,down:0}});openProblem(id)}
function challengeDefinition(id){const p=board.get(id);if(!p)return;const text=prompt("Explain why the definition is unclear or incorrect:");if(!text?.trim())return;p.definitionProposals.push({type:"Not correctly defined",text:text.trim(),votes:{up:0,down:0}});openProblem(id)}
function verifyProblem(id){const p=board.get(id);if(!p)return;verifyEngine.request(p);openProblem(id)}
function suggestSolution(id){const p=board.get(id);if(!p)return;const title=prompt("Solution title:");if(!title?.trim())return;const link=prompt("Optional external link:","");p.solutionProposals.push({title:title.trim(),link:(link||"").trim(),votes:{up:0,down:0}});openProblem(id)}
function newDiscussion(id){const p=board.get(id);if(!p)return;const title=prompt("Discussion title:");if(!title?.trim())return;discussEngine.addRoom(p,title.trim());openProblem(id)}
function advanceDiscussion(id,idx){const p=board.get(id);if(!p)return;discussEngine.supportClosure(p,idx);openProblem(id)}
function nominateResult(id,idx){const p=board.get(id);if(!p)return;const result=prompt("Candidate discussion result:");if(!result?.trim())return;discussEngine.nominateResult(p,idx,result.trim());openProblem(id)}
function rateSolution(id){const p=board.get(id);if(!p)return;ratingEngine.rate(p,{effectiveness:prompt("Effectiveness (0–10):",p.rating.effectiveness),cost:prompt("Cost (0–10):",p.rating.cost),risk:prompt("Risk (0–10):",p.rating.risk)});openProblem(id)}
function addDelegation(id){const p=board.get(id);if(!p)return;const who=prompt("Representative name:");if(!who?.trim())return;const context=prompt("Delegation context:",p.contextLabel||"");if(!context?.trim())return;const amount=prompt("Delegated vote weight:",1);delegateEngine.delegate(p,who.trim(),context.trim(),amount);trustEngine.request(p,`Authorization validation requested for ${who.trim()} in ${context.trim()}.`);openProblem(id)}
function revokeDelegation(id,index){const p=board.get(id);if(!p)return;delegateEngine.revoke(p,index);openProblem(id)}
function requestTrust(id){const p=board.get(id);if(!p)return;trustEngine.request(p);openProblem(id)}
function requestOversight(id){const p=board.get(id);if(!p)return;reportEngine.request(p,"oversight");openProblem(id)}

search.oninput=render;
statusFilter.onchange=render;
contextFilter.onchange=render;

document.getElementById("openSubmit").onclick=()=>{submitModal.classList.add("open");submitModal.setAttribute("aria-hidden","false")};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{const e=document.getElementById(b.dataset.close);e.classList.remove("open");e.setAttribute("aria-hidden","true")});
[problemModal,submitModal].forEach(m=>m.onclick=e=>{if(e.target===m){m.classList.remove("open");m.setAttribute("aria-hidden","true")}});

document.getElementById("submitForm").onsubmit=e=>{
  e.preventDefault();
  const title=document.getElementById("newTitle").value.trim();
  const definition=document.getElementById("newDefinition").value.trim();
  const author=document.getElementById("newAuthor").value.trim();
  const context=document.getElementById("newContext").value;
  const labels={governance:"Governance",infrastructure:"Infrastructure",technology:"Technology"};
  const next=board.nextId();
  board.addProblem({
    id:next,title,short:definition.slice(0,150)+(definition.length>150?"…":""),
    definition,status:"unverified",statusLabel:"Unverified",context,contextLabel:labels[context],
    tags:[context],proposer:author,solutionProposer:"Not defined",solution:"No solution linked yet",
    verification:"Not yet verified.",evidence:"Created through the PEPG 3 prototype.",
    votes:{up:0,down:0},rating:{effectiveness:0,cost:0,risk:0},
    definitionProposals:[],solutionProposals:[],discussions:[],delegations:[],reports:[],
    trust:{status:"not requested",requests:0,note:""},links:{}
  });
  e.target.reset();
  submitModal.classList.remove("open");submitModal.setAttribute("aria-hidden","true");
  render();
  alert(`${next} created in the PEPG 3 prototype. It is stored only in this browser session.`);
};

render();
