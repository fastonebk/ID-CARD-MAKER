const $=s=>document.querySelector(s);
const toast=(m)=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)};

$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("idcms-theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("idcms-theme")==="dark")document.body.classList.add("dark");

let nep=false;
$("#langBtn").onclick=()=>{nep=!nep;$("#langBtn").textContent=nep?"English":"नेपाली";$("#heroText").textContent=nep?"स्कुल, स्टुडियो र ID कार्ड व्यवसायका लागि छिटो र सजिलो टुल। Bulk फोटो crop र Excel लाई Common Delimited CSV मा परिवर्तन गर्नुहोस्।":"Fast, simple tools for studios, schools and ID card professionals. Crop bulk photos and convert Excel files to Common Delimited CSV."};

let photoFiles=[], croppedBlobs=[];
const photoInput=$("#photoInput"), cropBtn=$("#cropBtn");
photoInput.onchange=()=>{photoFiles=[...photoInput.files]; cropBtn.disabled=!photoFiles.length; $("#photoStatus").textContent=photoFiles.length?`${photoFiles.length} photo(s) selected.`:""};
["photoDrop"].forEach(id=>{const z=$("#"+id);z.ondragover=e=>{e.preventDefault();z.style.borderColor="#0b8f65"};z.ondragleave=()=>z.style.borderColor="";z.ondrop=e=>{e.preventDefault();photoFiles=[...e.dataTransfer.files].filter(f=>/image\/jpe?g/i.test(f.type));cropBtn.disabled=!photoFiles.length;$("#photoStatus").textContent=`${photoFiles.length} photo(s) selected.`}});
function loadImage(file){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=URL.createObjectURL(file)})}
function smartCrop(img,targetW,targetH){
  const sw=img.naturalWidth, sh=img.naturalHeight, target=targetW/targetH;
  let sx=0,sy=0,cw=sw,ch=sh;
  if(sw/sh>target){cw=Math.round(sh*target);sx=Math.round((sw-cw)/2)}
  else{ch=Math.round(sw/target);sy=Math.round((sh-ch)*.42)}
  const c=document.createElement("canvas");c.width=targetW;c.height=targetH;
  c.getContext("2d").drawImage(img,sx,sy,cw,ch,0,0,targetW,targetH);return c;
}
cropBtn.onclick=async()=>{
  croppedBlobs=[];$("#photoResults").innerHTML="";
  const W=300,H=378; // 1 x 1.26 inch at 300 DPI
  for(let i=0;i<photoFiles.length;i++){
    try{
      const im=await loadImage(photoFiles[i]),c=smartCrop(im,W,H);
      const blob=await new Promise(r=>c.toBlob(r,$("#photoFormat").value,.94));
      croppedBlobs.push({blob,name:photoFiles[i].name.replace(/\.[^.]+$/,"")+"_cropped.jpg"});
      const u=URL.createObjectURL(blob),img=document.createElement("img");img.src=u;img.title=photoFiles[i].name;$("#photoResults").appendChild(img);
    }catch(e){console.error(e)}
    $("#photoStatus").textContent=`Processed ${i+1} of ${photoFiles.length} photo(s).`;
  }
  $("#downloadPhotos").hidden=!croppedBlobs.length;
  toast(`Finished ${croppedBlobs.length} photo(s).`);
};
$("#downloadPhotos").onclick=()=>{
  if(!croppedBlobs.length)return;
  if(croppedBlobs.length===1){const a=document.createElement("a");a.href=URL.createObjectURL(croppedBlobs[0].blob);a.download=croppedBlobs[0].name;a.click();return}
  // Browser-safe bulk save: download each output. For a true folder/ZIP workflow, a backend or File System Access API can be added.
  croppedBlobs.forEach((x,i)=>setTimeout(()=>{const a=document.createElement("a");a.href=URL.createObjectURL(x.blob);a.download=x.name;a.click()},i*180));
  toast("Starting bulk downloads...");
};

let excelFile=null,csvText="";
$("#excelInput").onchange=()=>{excelFile=$("#excelInput").files[0];$("#convertBtn").disabled=!excelFile;$("#excelStatus").textContent=excelFile?excelFile.name:""};
$("#excelDrop").ondragover=e=>{e.preventDefault();$("#excelDrop").style.borderColor="#0b8f65"};
$("#excelDrop").ondrop=e=>{e.preventDefault();const f=[...e.dataTransfer.files].find(x=>/\.xlsx?$/i.test(x.name));if(f){excelFile=f;$("#convertBtn").disabled=false;$("#excelStatus").textContent=f.name}};
$("#convertBtn").onclick=async()=>{
  if(!excelFile)return;
  try{
    const data=await excelFile.arrayBuffer();
    const wb=XLSX.read(data,{type:"array"});
    const sheet=wb.Sheets[wb.SheetNames[0]];
    csvText=XLSX.utils.sheet_to_csv(sheet,{FS:",",RS:"\n"});
    const blob=new Blob([csvText],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    $("#csvDownload").href=url;$("#csvDownload").download=excelFile.name.replace(/\.xlsx?$/i,"")+".csv";$("#csvDownload").hidden=false;
    $("#excelStatus").textContent="Conversion successful.";
    $("#folderBtn").hidden=false;
    $("#folderBtn").onclick=async()=>{
      if(window.showSaveFilePicker){
        try{
          const h=await window.showSaveFilePicker({suggestedName:excelFile.name.replace(/\.xlsx?$/i,"")+".csv",types:[{description:"CSV",accept:{"text/csv":[".csv"]}}]});
          const w=await h.createWritable();await w.write(blob);await w.close();
          toast("CSV saved successfully.");
          // Browsers generally cannot delete an arbitrary input file selected from the user's disk.
          if($("#deleteExcel").checked) $("#excelStatus").textContent="CSV saved. Original Excel cannot be automatically deleted by this browser for security reasons.";
        }catch(e){if(e.name!=="AbortError")toast("Save cancelled or unavailable.");}
      }else{$("#csvDownload").click();toast("CSV downloaded. Folder selection is not supported in this browser.");}
    };
    toast("Excel converted to CSV.");
  }catch(e){$("#excelStatus").textContent="Could not read this Excel file.";toast("Conversion failed.");console.error(e)}
};

document.querySelectorAll(".premiumBtn").forEach(b=>b.onclick=()=>window.open("https://wa.me/9779707943095?text=Hello%20ID%20CARD%20MAKER%20SOLUTION%2C%20I%20want%20Premium%20access.","_blank"));
