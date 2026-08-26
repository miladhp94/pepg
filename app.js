const problems={
governance:{
 pid:'PEPG-0001',
 title:'Centralized governance, limited government capacity, and concentration of execution and oversight',
 description:'A centralized government cannot independently identify, design, implement and monitor every public solution. Excessive concentration can slow decisions and leave citizens, experts and independent actors outside the problem-solving process.',
 solution:'PEPG — Platform-Enabled People Governance',
 solutionText:'Place the public problem at the center and connect citizens, experts, government, implementers and oversight participants through appropriate channels. PEPG is a governance model, not a social network, and is not dependent on a specific platform.',
 solutionProposer:'Milad Habibpour',
 solutionArticle:'https://doi.org/10.5281/zenodo.22118648',
 channels:[
  ['💡','PEPG Solution Article','The proposed PEPG governance model and its conceptual framework.','PUBLIC','https://doi.org/10.5281/zenodo.22118648',false]
 ]
},
road:{
 pid:'PEPG-0002',
 title:'Poor asphalt quality on an abstract street in Tanzania',
 description:'Example public infrastructure problem: residents report poor asphalt quality and seek a coordinated process for identifying the issue, proposing solutions, funding, implementation, contracts, oversight and public reporting.',
 solution:'PEPG coordinates the problem-solving ecosystem',
 solutionText:'Each part of the problem can have its own group or working space. Public groups can be used for problem identification and solutions, while execution and formal oversight groups can be private and access-controlled.',
 channels:[
  ['📍','Problem Identification','Public residents group for reporting observations, photos and local evidence.','PUBLIC','https://example.org/pepg-0002/problem-identification',false],
  ['💡','Solutions','Public discussion group where residents, engineers and other participants propose solutions.','PUBLIC','https://example.org/pepg-0002/solutions',false],
  ['💰','Funding','Public information space for budget and financing discussion.','PUBLIC','https://example.org/pepg-0002/funding',false],
  ['⚙️','Implementation','Private project group for the selected implementers and authorized participants.','PRIVATE / CONTROLLED','https://example.org/pepg-0002/implementation',true],
  ['📄','Contracts','Public document space for contracts, versions and official records.','PUBLIC','https://example.org/pepg-0002/contracts',false],
  ['🔎','Oversight','Private oversight group for approved monitors and authorized institutions.','PRIVATE / APPROVED','https://example.org/pepg-0002/oversight',true],
  ['📊','Reports','Public reporting group or page for progress, results and feedback.','PUBLIC','https://example.org/pepg-0002/reports',false]
 ]
}
};

function openProblem(key){
 const p=problems[key];
 document.getElementById('modalPid').textContent=p.pid;
 document.getElementById('modalTitle').textContent=p.title;
 document.getElementById('modalDescription').textContent=p.description;
 document.getElementById('solutionBox').innerHTML=`<div class="solution"><span class="label">PROPOSED SOLUTION</span><h3>${p.solution}</h3><p>${p.solutionText}</p>${p.solutionProposer?`<div class="solution-proposer">Solution proposer: <strong>${p.solutionProposer}</strong></div>`:''}${p.solutionArticle?`<a class="article-link" href="${p.solutionArticle}" target="_blank" rel="noopener">Read the PEPG article →</a>`:''}</div>`;
 let html='';
 if(p.channels.length){
  html='<div class="channel-title">Connected participation spaces</div><div class="channels">';
  p.channels.forEach(c=>{
   html+=`<div class="channel ${c[5]?'private':''}">
    <div class="icon">${c[0]}</div><strong>${c[1]}</strong><small>${c[2]}</small>
    <a href="${c[4]}" target="_blank" rel="noopener">Open example link →</a>
    <div class="tag">${c[3]}</div>
   </div>`;
  });
  html+='</div>';
 } else {
  html='<div class="channel-title">PEPG is the proposed solution to this governance problem.</div>';
 }
 document.getElementById('channels').innerHTML=html;
 document.getElementById('modal').classList.add('open');
}
function closeModal(){document.getElementById('modal').classList.remove('open')}
window.onclick=e=>{if(e.target.id==='modal')closeModal()};

function detectProblem(e){
 e.preventDefault();
 const name=document.getElementById('problemName').value.trim();
 const box=document.getElementById('detected');
 box.style.display='block';
 box.innerHTML=`<strong>Problem detected.</strong> "${name}" has been prepared for registration. Proposer: Milad Habibpour (miladhp94).<br><small>This prototype does not yet persist submissions to a database.</small>`;
}
