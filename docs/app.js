'use strict';
const $ = (id) => document.getElementById(id);
let state;
let screenDetails;
let requestVersion = 0;
function sample(count) {
  return Array.from({length:count}, (_,i)=>({label:i===0?'Built-in display':'External display '+i,width:i===0?1920:2560,height:i===0?1080:1440,left:i*1920,top:0,isPrimary:i===0}));
}
function snapshot(s,i) {
  return {label:s.label||'Display '+(i+1),width:s.width,height:s.height,left:s.left,top:s.top,isPrimary:Boolean(s.isPrimary)};
}
function render(screens,mode) {
  state={mode,displays:screens.map(snapshot)};
  $('mode').textContent=mode==='sample'?'Sample setup':'Live browser data';
  $('canvas-label').textContent=mode==='sample'?'EXTENDED DESKTOP · SAMPLE':'BROWSER-REPORTED DISPLAYS';
  $('source').textContent=mode==='sample'?'SOURCE: SIMULATED DATA':'SOURCE: WINDOW MANAGEMENT API';
  $('result-title').textContent=screens.length+' display'+(screens.length===1?'':'s')+(mode==='sample'?' in this sample':' available to this browser');
  $('result-note').textContent=screens.length>1?'Multiple monitors detected':screens.length===1?'One display available':'No displays reported';
  $('monitors').replaceChildren();
  $('details').replaceChildren();
  screens.forEach((s,i)=>{
    const monitor=document.createElement('div');monitor.className='monitor';
    const screen=document.createElement('div');screen.className='screen';
    const number=document.createElement('b');number.textContent=String(i+1).padStart(2,'0');
    const status=document.createElement('small');status.textContent=s.isPrimary?'PRIMARY':'EXTENDED';
    screen.append(number,status);monitor.append(screen);
    for(const name of ['stand','base']){const el=document.createElement('div');el.className=name;monitor.append(el);}
    const label=document.createElement('p');label.className='monitor-label';label.textContent=s.label||'Display '+(i+1);monitor.append(label);
    $('monitors').append(monitor);
    const card=document.createElement('article');card.className='detail';
    const title=document.createElement('h3');title.textContent='0'+(i+1)+' / '+(s.label||'Display');card.append(title);
    const dl=document.createElement('dl');
    for(const [key,value] of [['Resolution',s.width+' × '+s.height],['Position',s.left+', '+s.top],['Role',s.isPrimary?'Primary':'Extended']]){
      const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=value;dl.append(dt,dd);
    }
    card.append(dl);$('details').append(card);
  });
  document.querySelectorAll('[data-count]').forEach(b=>b.setAttribute('aria-pressed',String(mode==='sample'&&Number(b.dataset.count)===screens.length)));
}
function showLive() {
  if(state.mode!=='live') return;
  render(screenDetails.screens,'live');
  $('notice').textContent='Live screen details in CSS pixels. Changes update automatically. Mirrored displays may not appear separately. Data stays in this tab.';
}
document.querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{
  requestVersion++;
  render(sample(Number(b.dataset.count)),'sample');
  $('notice').textContent='You’re viewing illustrative data. Use “Detect my displays” to request real screen details.';
}));
$('detect').addEventListener('click',async()=>{
  if(!window.isSecureContext||typeof window.getScreenDetails!=='function'){
    $('notice').textContent='Full screen detection is unavailable here. Try a supported Chrome or Edge browser over HTTPS. The sample remains available; the native Node.js utility provides OS-level detection.';
    return;
  }
  const version=++requestVersion;
  $('detect').disabled=true;
  try {
    const details=await window.getScreenDetails();
    if(version!==requestVersion) return;
    if(screenDetails!==details){
      if(screenDetails){screenDetails.removeEventListener('screenschange',showLive);screenDetails.removeEventListener('currentscreenchange',showLive);}
      screenDetails=details;
      screenDetails.addEventListener('screenschange',showLive);
      screenDetails.addEventListener('currentscreenchange',showLive);
    }
    render(screenDetails.screens,'live');showLive();
  } catch(error) {
    if(version===requestVersion) $('notice').textContent=error.name==='NotAllowedError'?'Screen access was denied or blocked by browser policy. No live result is available. You can continue exploring sample layouts or update site permissions and retry.':'Screen detection failed. Please retry, or use a sample layout.';
  } finally {$('detect').disabled=false;}
});
$('export').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='monitor-detect-'+state.mode+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render(sample(2),'sample');
