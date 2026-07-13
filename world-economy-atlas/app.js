const countries=window.COUNTRIES;
const selected=new Set();
const cards=document.getElementById('cards');
const search=document.getElementById('search');
const region=document.getElementById('region');
const archetype=document.getElementById('archetype');
const modal=document.getElementById('modal');
const profile=document.getElementById('profile');

[...new Set(countries.map(c=>c.region))].sort().forEach(x=>region.insertAdjacentHTML('beforeend',`<option>${x}</option>`));
[...new Set(countries.flatMap(c=>c.archetypes))].sort().forEach(x=>archetype.insertAdjacentHTML('beforeend',`<option>${x}</option>`));

function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function renderCards(){
  const q=search.value.trim().toLowerCase();
  const filtered=countries.filter(c=>{
    const hay=JSON.stringify(c).toLowerCase();
    return (!q||hay.includes(q))&&(!region.value||c.region===region.value)&&(!archetype.value||c.archetypes.includes(archetype.value));
  });
  document.getElementById('resultCount').textContent=`Showing ${filtered.length} of ${countries.length} economies`;
  cards.innerHTML=filtered.length?filtered.map(c=>`<article class="country-card">
    <div class="country-head"><div><span class="flag">${c.flag}</span><h3>${c.name}</h3></div><label class="compare-check"><input type="checkbox" data-select="${c.name}" ${selected.has(c.name)?'checked':''}> compare</label></div>
    <div class="tags">${c.archetypes.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <p class="hook">${c.hook}</p>
    <div class="memory">Remember: ${c.memory}</div>
    <div class="card-actions"><button class="btn primary" data-open="${c.id}">Full profile</button></div>
  </article>`).join(''):`<div class="empty">No economy matches those filters.</div>`;
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openProfile(b.dataset.open));
  document.querySelectorAll('[data-select]').forEach(cb=>cb.onchange=()=>toggleSelect(cb.dataset.select,cb.checked));
}
function toggleSelect(name,on){
  if(on&&selected.size>=4){alert('Select at most four economies.');renderCards();return}
  on?selected.add(name):selected.delete(name); renderCompare();
}
function renderCompare(){
  const box=document.getElementById('compareBox');
  if(!selected.size){box.innerHTML='<p class="note">Choose countries using the checkboxes on their cards.</p>';return}
  const names=[...selected];
  box.innerHTML=`<table><thead><tr><th>Capability</th>${names.map(n=>`<th>${n}</th>`).join('')}</tr></thead><tbody>${scoreLabels.map((label,i)=>`<tr><td>${label}</td>${names.map(n=>`<td class="score"><span class="dots">${'●'.repeat(scores[n][i])}</span><span style="color:#40546c">${'●'.repeat(5-scores[n][i])}</span> ${scores[n][i]}/5</td>`).join('')}</tr>`).join('')}</tbody></table><p class="note">These scores summarize the teaching narrative and are deliberately approximate. They are not forecasts, investment ratings or an empirical competitiveness index.</p>`;
}
function openProfile(id){
  const c=countries.find(x=>x.id===id); if(!c)return;
  document.getElementById('modalLabel').textContent=c.name;
  profile.innerHTML=`<div class="profile-title"><span class="flag">${c.flag}</span><div><div class="eyebrow">${c.region}</div><h2>${c.name}</h2><p class="hook">${c.hook}</p><div class="tags">${c.archetypes.map(t=>`<span class="tag">${t}</span>`).join('')}</div></div></div>
  <div class="callout"><b>Memory hook:</b> ${c.memory}<br><b>Quantitative anchor:</b> ${c.anchor}</div>
  <h3>The concrete story</h3><p>${c.story}</p>
  <div class="grid-2"><div class="info-box"><h3>Economic engine</h3><ul>${c.engine.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="info-box"><h3>Why it is hard to copy</h3><p>${c.moat}</p><h3>Where value is captured</h3><p>${c.capture}</p></div></div>
  <h3>Concrete examples</h3><ul>${c.examples.map(x=>`<li>${x}</li>`).join('')}</ul>
  <div class="grid-2"><div class="info-box"><h3>What breaks first?</h3><ul>${c.fragility.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="info-box"><h3>Counterfactual test</h3><p>${c.counterfactual}</p><h3>Common misconception</h3><p>${c.misconception}</p></div></div>
  <h3>Primary and institutional sources</h3><ul class="source-list">${c.sources.map(s=>`<li><a href="${s[1]}" target="_blank" rel="noreferrer">${s[0]} ↗</a></li>`).join('')}</ul>`;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.getElementById('closeModal').onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
[search,region,archetype].forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',renderCards));
document.getElementById('clear').onclick=()=>{search.value='';region.value='';archetype.value='';renderCards()};

document.getElementById('archetypesList').innerHTML=Object.entries(archetypeNotes).map(([k,v])=>`<div class="arch"><b>${k}</b><span>${v}</span></div>`).join('');
document.getElementById('resources').innerHTML=resources.map(r=>`<article class="resource"><small>${r.level}</small><h3><a href="${r.url}" target="_blank" rel="noreferrer">${r.name} ↗</a></h3><p>${r.use}</p></article>`).join('');
document.getElementById('books').innerHTML=books.map(b=>`<article class="resource"><h3>${b[0]}</h3><p>${b[1]}</p></article>`).join('');
let qi=Math.floor(Math.random()*quiz.length);
function showQuiz(){document.getElementById('quizQuestion').textContent=quiz[qi][0];const a=document.getElementById('quizAnswer');a.textContent=quiz[qi][1];a.style.display='none'}
document.getElementById('reveal').onclick=()=>document.getElementById('quizAnswer').style.display='block';
document.getElementById('nextQuiz').onclick=()=>{qi=(qi+1)%quiz.length;showQuiz()};
showQuiz();renderCards();renderCompare();