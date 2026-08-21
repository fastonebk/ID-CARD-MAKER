const $=s=>document.querySelector(s);const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("idcms-theme",document.body.classList.contains("dark")?"dark":"light")};if(localStorage.getItem("idcms-theme")==="dark")document.body.classList.add("dark");
let nep=false;$("#langBtn").onclick=()=>{nep=!nep;$("#langBtn").textContent=nep?"English":"नेपाली";$("#heroText").textContent=nep?"स्कुल, स्टुडियो र ID कार्ड व्यवसायका लागि AI-assisted फोटो crop र Excel लाई Common Delimited CSV मा परिवर्तन गर्ने सजिलो टुल।":"AI-assisted face-focused photo cropping and Excel to Common Delimited CSV conversion for schools, studios and ID card professionals."};

// ---------- DATABASE CONNECTION ----------
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxkXdpOr04vtFohNZelA307Pd8CB9MBn8M8BG-FTkjtwFuY9gi11m9EplOb-f4f6Yzf/exec";

// ---------- Account / trial / premium display ----------
const KEY="idcms-account";const getAccount=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}};const setAccount=a=>localStorage.setItem(KEY,JSON.stringify(a));const daysLeft=s=>Math.ceil(Math.max(0,86400000-(Date.now()-s))/86400000);
function updateAccount(){const a=getAccount();if(!a){$("#accountName").textContent="Guest User";$("#accountEmail").textContent="Not signed in";$("#planBadge").textContent="FREE / NOT SIGNED IN";$("#trialInfo").textContent="Create an account to start your 1-day trial.";$("#logoutBtn").hidden=true;$("#authBtn").textContent="Login / Create Account";$("#activePremiumBox").hidden=true;$("#adminDashboard").hidden=true;document.querySelectorAll(".premiumBtn,.payment-box").forEach(x=>x.hidden=false);return}
$("#accountName").textContent=a.name||(a.role==="ADMIN"?"Administrator":"User");$("#accountEmail").textContent=a.email;$("#accountAvatar").textContent=(a.name||(a.role==="ADMIN"?"Admin":"User")).slice(0,2).toUpperCase();$("#logoutBtn").hidden=false;$("#authBtn").textContent=`Hi, ${(a.name||(a.role==="ADMIN"?"Admin":"User")).split(" ")[0]}`;

if(a.role==="ADMIN") {
    $("#planBadge").textContent=`ADMINISTRATOR`;
    $("#trialInfo").textContent=`Full system access granted.`;
    $("#adminDashboard").hidden=false; 
    $("#activePremiumBox").hidden=false;
    $("#activePremiumBox").textContent="✓ Administrator account active.";
    document.querySelectorAll(".premiumBtn,.payment-box").forEach(x=>x.hidden=true);
    $("#refreshAdminBtn").onclick = loadAdminData;
    loadAdminData(); // Load actual users from Sheet
} else if(a.plan&&a.plan!=="trial"){$("#planBadge").textContent=`PREMIUM · ${a.plan.toUpperCase()}`;$("#trialInfo").textContent=`Premium active.`;$("#activePremiumBox").hidden=false;document.querySelectorAll(".premiumBtn,.payment-box").forEach(x=>x.hidden=true);$("#adminDashboard").hidden=true;}else{const n=daysLeft(a.trialStart);$("#planBadge").textContent=n>0?"1-DAY TRIAL":"TRIAL EXPIRED";$("#trialInfo").textContent=n>0?`Trial active · approximately ${n} day remaining.`:"Your trial has ended. Choose Premium to continue.";$("#activePremiumBox").hidden=true;document.querySelectorAll(".premiumBtn,.payment-box").forEach(x=>x.hidden=false);$("#adminDashboard").hidden=true;}}
updateAccount();

$("#authBtn").onclick=()=>{if(getAccount())$("#account").scrollIntoView({behavior:"smooth"});else $("#authModal").hidden=false};$("#emailBtn").onclick=()=>$("#authModal").hidden=false;$("#closeAuth").onclick=()=>$("#authModal").hidden=true;

$("#saveAccount").onclick=async()=>{
    const name=$("#authName").value.trim(),email=$("#authEmail").value.trim(),pw=$("#authPassword").value;
    if(!email||!pw){toast("Please fill email and password.");return}
    toast("Authenticating...");
    $("#saveAccount").disabled=true;
    $("#saveAccount").textContent="Verifying...";
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "login", email, password: pw, name })
        });
        const data = await response.json();
        handleAuthResponse(data);
    } catch(e) {
        toast("Connection error to database.");
        $("#saveAccount").disabled = false;
        $("#saveAccount").textContent="Create / Login";
    }
};

function handleAuthResponse(data) {
    if(data.success) {
        const a = { name: data.name, email: data.email, role: data.role, plan: data.plan, trialStart: Date.now(), expiresAt: data.plan === "lifetime" ? "lifetime" : Date.now() + 86400000*30 };
        setAccount(a);
        $("#authModal").hidden=true;
        updateAccount();
        if(data.role === "ADMIN") {
            toast("Welcome, Administrator.");
            $("#adminDashboard").scrollIntoView({behavior:"smooth"});
        } else {
            toast("Account ready.");
        }
    } else {
        toast(data.message || "Invalid login details.");
    }
    $("#saveAccount").disabled=false;
    $("#saveAccount").textContent="Create / Login";
}

$("#logoutBtn").onclick=()=>{localStorage.removeItem(KEY);updateAccount();toast("Logged out.");$("#tools").scrollIntoView({behavior:"smooth"});};$("#premiumAccessBtn").onclick=()=>$("#pricing").scrollIntoView({behavior:"smooth"});
function allowed(){const a=getAccount();if(!a){toast("Please login or create an account first.");$("#authModal").hidden=false;return false}if(a.role==="ADMIN")return true;if(a.plan==="trial"&&daysLeft(a.trialStart)<=0){toast("Your 1-day trial has expired. Please get Premium.");$("#pricing").scrollIntoView({behavior:"smooth"});return false}return true}

// ---------- ADMIN FETCH & ACTIVATE (NEW) ----------
async function loadAdminData() {
    const tbody = $("#adminUserTable");
    tbody.innerHTML = "<tr><td colspan='5' style='padding:10px;'>Loading users from database...</td></tr>";
    try {
        const res = await fetch(BACKEND_URL, { method: 'POST', body: JSON.stringify({ action: "getUsers" }) });
        const data = await res.json();
        if(data.success) {
            tbody.innerHTML = "";
            if(data.users.length === 0) { tbody.innerHTML = "<tr><td colspan='5' style='padding:10px;'>No users registered yet.</td></tr>"; return; }
            data.users.forEach(u => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid #e1e8ef";
                const isPremium = u.status === 'Premium Active';
                tr.innerHTML = `
                    <td style="padding:10px;">${u.email}</td>
                    <td style="padding:10px;">${u.name}</td>
                    <td style="padding:10px; font-weight:bold; color:${isPremium?'#0b8f65':'#f39c12'};">${u.status}</td>
                    <td style="padding:10px;">${u.plan.toUpperCase()}</td>
                    <td style="padding:10px;">
                        ${!isPremium ? `<button class="primary activate-btn" data-email="${u.email}" style="padding:5px 10px; min-height:auto; font-size:12px;">Activate Lifetime</button>` : `<button class="secondary deactivate-btn" data-email="${u.email}" style="padding:5px 10px; min-height:auto; font-size:12px;">Revert to Trial</button>`}
                    </td>`;
                tbody.appendChild(tr);
            });
            document.querySelectorAll(".activate-btn").forEach(btn => btn.onclick = () => updatePlan(btn.dataset.email, "lifetime", btn));
            document.querySelectorAll(".deactivate-btn").forEach(btn => btn.onclick = () => updatePlan(btn.dataset.email, "trial", btn));
        }
    } catch(e) { tbody.innerHTML = "<tr><td colspan='5' style='padding:10px; color:red;'>Failed to fetch data. Ensure Web App URL is correct.</td></tr>"; }
}

async function updatePlan(email, newPlan, btnElement) {
    btnElement.textContent = "Updating...";
    btnElement.disabled = true;
    try {
        const res = await fetch(BACKEND_URL, { method: 'POST', body: JSON.stringify({ action: "updateUser", userEmail: email, newPlan: newPlan }) });
        const data = await res.json();
        if(data.success) { toast(`Updated user access.`); loadAdminData(); } else { toast("Update failed."); btnElement.textContent = "Error"; }
    } catch(e) { toast("Connection error."); btnElement.textContent = "Error"; }
}

// ---------- AI face-focused crop & Excel tools omitted for brevity, keeping existing functional ----------
let photoFiles=[],croppedBlobs=[],faceDetectorPromise=null;
$("#photoInput").onchange=()=>{photoFiles=[...$("#photoInput").files];$("#cropBtn").disabled=!photoFiles.length;$("#photoStatus").textContent=photoFiles.length?`${photoFiles.length} photo(s) selected.`:""};
$("#photoDrop").ondragover=e=>{e.preventDefault();$("#photoDrop").style.borderColor="#0b8f65"};$("#photoDrop").ondrop=e=>{e.preventDefault();photoFiles=[...e.dataTransfer.files].filter(f=>/image\/jpe?g/i.test(f.type));$("#cropBtn").disabled=!photoFiles.length;$("#photoStatus").textContent=`${photoFiles.length} photo(s) selected.`};
function loadImage(file){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=URL.createObjectURL(file)})}
async function getFaceDetector(){if(!faceDetectorPromise){faceDetectorPromise=(async()=>{try{const vision=await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/vision_bundle.mjs");const fileset=await vision.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm");return await vision.FaceDetector.createFromOptions(fileset,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite"},runningMode:"IMAGE",minDetectionConfidence:.45,minSuppressionThreshold:.3})}catch(e){console.warn("Face detector unavailable",e);return null}})()}return faceDetectorPromise}
function boxPixels(b,sw,sh){let x=b.originX,y=b.originY,w=b.width,h=b.height;if(Math.max(Math.abs(x),Math.abs(y),Math.abs(w),Math.abs(h))<=1.01){x*=sw;y*=sh;w*=sw;h*=sh}return{x,y,w,h}}
async function detectFace(img){const d=await getFaceDetector();if(!d)return null;try{const r=d.detect(img),faces=r?.detections||[];let best=null,area=0;for(const f of faces){if(!f.boundingBox)continue;const b=boxPixels(f.boundingBox,img.naturalWidth,img.naturalHeight),a=b.w*b.h;if(a>area){area=a;best=b}}return best}catch(e){return null}}
function centerCrop(img,W,H){const sw=img.naturalWidth,sh=img.naturalHeight,target=W/H;let cw=sw,ch=sh,sx=0,sy=0;if(sw/sh>target){cw=sh*target;sx=(sw-cw)/2}else{ch=sw/target;sy=(sh-ch)*.42}const c=document.createElement("canvas");c.width=W;c.height=H;c.getContext("2d").drawImage(img,sx,sy,cw,ch,0,0,W,H);return c}
function faceCrop(img,face,W,H){if(!face)return centerCrop(img,W,H);const sw=img.naturalWidth,sh=img.naturalHeight,target=W/H;const faceHeightRatio=.38,topMargin=.11;let ch=face.h/faceHeightRatio,cw=ch*target;if(cw>sw){cw=sw;ch=cw/target}if(ch>sh){ch=sh;cw=ch*target}let sx=face.x+face.w/2-cw/2,sy=face.y-topMargin*ch;sx=Math.max(0,Math.min(sx,sw-cw));sy=Math.max(0,Math.min(sy,sh-ch));const c=document.createElement("canvas");c.width=W;c.height=H;c.getContext("2d").drawImage(img,sx,sy,cw,ch,0,0,W,H);return c}
$("#cropBtn").onclick=async()=>{if(!allowed())return;croppedBlobs=[];$("#photoResults").innerHTML="";const W=300,H=378;const mode=$("#cropMode").value;for(let i=0;i<photoFiles.length;i++){const f=photoFiles[i];try{$("#photoStatus").textContent=`Loading AI crop… ${i+1}/${photoFiles.length}`;const im=await loadImage(f);const face=mode==="smart"?await detectFace(im):null;const c=faceCrop(im,face,W,H);const blob=await new Promise(r=>c.toBlob(r,"image/jpeg",.94));croppedBlobs.push({blob,name:f.name});const u=URL.createObjectURL(blob),p=document.createElement("img");p.src=u;p.title=f.name;$("#photoResults").appendChild(p);$("#photoStatus").textContent=`Processed ${i+1} of ${photoFiles.length} · ${face?"AI face focused":"center fallback"}`}catch(e){console.error(e);$("#photoStatus").textContent=`Could not process ${f.name}`}}$("#downloadPhotos").hidden=!croppedBlobs.length;toast(`Finished ${croppedBlobs.length} photo(s). Original filenames preserved.`)};
$("#downloadPhotos").onclick=async()=>{if(!allowed()||!croppedBlobs.length)return;const zip=new JSZip(),folder=zip.folder("Cropped Photos");croppedBlobs.forEach(x=>folder.file(x.name,x.blob));const blob=await zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Cropped-Photos.zip";a.click();toast("ZIP created: Cropped Photos folder + original filenames.")};

let excelFile=null;$("#excelInput").onchange=()=>{excelFile=$("#excelInput").files[0];$("#convertBtn").disabled=!excelFile;$("#excelStatus").textContent=excelFile?excelFile.name:""};$("#excelDrop").ondragover=e=>{e.preventDefault();$("#excelDrop").style.borderColor="#0b8f65"};$("#excelDrop").ondrop=e=>{e.preventDefault();const f=[...e.dataTransfer.files].find(x=>/\.xlsx?$/i.test(x.name));if(f){excelFile=f;$("#convertBtn").disabled=false;$("#excelStatus").textContent=f.name}};
$("#convertBtn").onclick=async()=>{if(!allowed()||!excelFile)return;try{const wb=XLSX.read(await excelFile.arrayBuffer(),{type:"array"}),csv=XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]],{FS:",",RS:"\n"}),blob=new Blob([csv],{type:"text/csv;charset=utf-8"});$("#csvDownload").href=URL.createObjectURL(blob);$("#csvDownload").download=excelFile.name.replace(/\.xlsx?$/i,"")+".csv";$("#csvDownload").hidden=false;$("#folderBtn").hidden=false;$("#folderBtn").onclick=async()=>{if(window.showSaveFilePicker){try{const h=await window.showSaveFilePicker({suggestedName:excelFile.name.replace(/\.xlsx?$/i,"")+".csv",types:[{description:"CSV",accept:{"text/csv":[".csv"]}}]}),w=await h.createWritable();await w.write(blob);await w.close();$("#excelStatus").textContent=$("#deleteExcel").checked?"CSV saved. Browser security prevents deleting the original selected file.":"CSV saved.";toast("CSV saved successfully.")}catch(e){if(e.name!=="AbortError")toast("Save cancelled or unavailable.")}}else $("#csvDownload").click()};$("#excelStatus").textContent="Conversion successful.";toast("Excel converted to CSV.")}catch(e){console.error(e);toast("Conversion failed.")}};
document.querySelectorAll(".premiumBtn").forEach(b=>b.onclick=()=>window.open("https://wa.me/9779707943095?text=Hello%20ID%20CARD%20MAKER%20SOLUTION%2C%20I%20want%20Premium%20access.%20My%20registered%20email%20is%3A%20","_blank"));
