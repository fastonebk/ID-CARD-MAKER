const $=s=>document.querySelector(s);
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("idcms-theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("idcms-theme")==="dark")document.body.classList.add("dark");
const USERS="idcms-demo-users",REQUESTS="idcms-payment-requests",ADMIN="idcms-demo-admin",ACCOUNT="idcms-account";
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[]}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const currentCustomer=()=>{try{return JSON.parse(localStorage.getItem(ACCOUNT)||"null")}catch{return null}};
function seed(){const a=currentCustomer();let users=read(USERS);if(a&&!users.some(u=>u.email===a.email)){users.push({...a,id:crypto.randomUUID?.()||String(Date.now())});write(USERS,users)}return users}
function active(u){return u.plan&&u.plan!=="trial"&&(u.expiresAt==="lifetime"||new Date(u.expiresAt)>new Date())}
function esc(x){return String(x??"").replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function expiryFor(plan){return plan==='lifetime'?'lifetime':new Date(Date.now()+(plan==='monthly'?30:365)*86400000).toISOString()}
function activateUser(email,plan){
  email=email.trim().toLowerCase(); if(!email)return false;
  let users=read(USERS),u=users.find(x=>x.email.toLowerCase()===email);
  if(!u){u={id:crypto.randomUUID?.()||String(Date.now()),name:email.split('@')[0],email,trialStart:Date.now()};users.push(u)}
  u.plan=plan;u.expiresAt=expiryFor(plan);u.activatedAt=new Date().toISOString();u.status="active";
  write(USERS,users);
  const a=currentCustomer(); if(a&&a.email.toLowerCase()===email){localStorage.setItem(ACCOUNT,JSON.stringify(u))}
  render();return true;
}
function deactivateUser(email){let users=read(USERS),u=users.find(x=>x.email===email);if(!u)return;u.plan='trial';u.expiresAt=null;u.status='trial';write(USERS,users);const a=currentCustomer();if(a&&a.email.toLowerCase()===email)localStorage.setItem(ACCOUNT,JSON.stringify(u));render();toast('Premium deactivated.');}
function render(){
  const users=seed(),req=read(REQUESTS);
  $("#statUsers").textContent=users.length;$("#statPending").textContent=req.filter(r=>r.status==='pending').length;$("#statActive").textContent=users.filter(active).length;$("#statExpired").textContent=users.filter(u=>u.plan&&u.plan!=='trial'&&!active(u)).length;
  $("#requestsList").innerHTML=req.length?`<table class="admin-table"><thead><tr><th>Email</th><th>Plan</th><th>Payment</th><th>Ref</th><th>Status</th><th>Action</th></tr></thead><tbody>${req.map((r,i)=>`<tr><td><b>${esc(r.email)}</b><br>${esc(r.name||'')}</td><td>${esc(r.plan)}</td><td>${esc(r.method)}</td><td>${esc(r.txn||'—')}</td><td><span class="status-chip ${r.status==='pending'?'status-pending':r.status==='approved'?'status-active':'status-expired'}">${esc(r.status)}</span></td><td>${r.status==='pending'?`<button class="mini-btn activate" data-activate="${i}">Activate</button><button class="mini-btn danger" data-reject="${i}">Reject</button>`:'—'}</td></tr>`).join('')}</tbody></table>`:`<div class="empty">No activation requests yet.</div>`;
  $("#usersList").innerHTML=users.length?`<table class="admin-table"><thead><tr><th>Customer</th><th>Plan</th><th>Expiry</th><th>Status</th><th>Action</th></tr></thead><tbody>${users.map((u,i)=>`<tr><td><b>${esc(u.name||'User')}</b><br>${esc(u.email)}</td><td>${esc(u.plan||'trial')}</td><td>${u.expiresAt==='lifetime'?'Lifetime':u.expiresAt?new Date(u.expiresAt).toLocaleDateString():'—'}</td><td><span class="status-chip ${active(u)?'status-active':u.plan&&u.plan!=='trial'?'status-expired':''}">${active(u)?'ACTIVE':u.plan&&u.plan!=='trial'?'EXPIRED':'TRIAL'}</span></td><td><button class="mini-btn activate" data-extend="${i}">Activate / Extend</button><button class="mini-btn danger" data-deactivate="${i}">Deactivate</button></td></tr>`).join('')}</tbody></table>`:`<div class="empty">No customers are stored in this browser yet.</div>`;
}
$("#quickActivate").onclick=()=>{const email=$("#quickEmail").value.trim(),plan=$("#quickPlan").value;if(!email||!email.includes('@')){toast('Enter a valid customer email.');return}activateUser(email,plan);$("#quickStatus").textContent=`${email} is now ${plan.toUpperCase()} in this demo browser.`;toast(`${email} activated for ${plan}.`)};
$("#requestsList").onclick=e=>{const ai=e.target.dataset.activate,ri=e.target.dataset.reject;if(ai!==undefined){const req=read(REQUESTS),r=req[ai];if(activateUser(r.email,r.plan)){r.status='approved';r.approvedAt=new Date().toISOString();write(REQUESTS,req);render();toast(`${r.email} activated.`)}}if(ri!==undefined){const req=read(REQUESTS);req[ri].status='rejected';write(REQUESTS,req);render();toast('Request rejected.')}};
$("#usersList").onclick=e=>{const ei=e.target.dataset.extend,di=e.target.dataset.deactivate;if(ei!==undefined){const users=read(USERS),u=users[ei],plan=prompt('Enter plan: monthly, yearly, or lifetime',u.plan==='trial'?'yearly':u.plan);if(plan&&['monthly','yearly','lifetime'].includes(plan)){activateUser(u.email,plan);toast(`${u.email} activated for ${plan}.`)}}if(di!==undefined){const users=read(USERS),u=users[di];deactivateUser(u.email)}};
$("#refreshBtn").onclick=render;$("#adminLogout").onclick=()=>{sessionStorage.removeItem(ADMIN);showLogin()};
function showLogin(){$("#adminLogin").hidden=false;$("#dashboard").hidden=true}
function showDash(){sessionStorage.setItem(ADMIN,'1');$("#adminLogin").hidden=true;$("#dashboard").hidden=false;render()}
$("#adminLoginBtn").onclick=()=>{const e=$("#adminEmail").value.trim(),p=$("#adminPassword").value;if(e==='admin@idcardmakersolution.com'&&p==='admin1234')showDash();else toast('Invalid demo admin login.')};
if(sessionStorage.getItem(ADMIN)==='1')showDash();
