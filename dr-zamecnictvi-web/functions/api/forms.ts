import { calculate, inquirySummary } from '../../src/lib/pergola.mjs';
type PagesContext = {request:Request;env:{FORM_PRIMARY_EMAIL?:string;FORM_CC_EMAILS?:string}};
const failure=(request:Request,error:string,status=400)=>request.headers.get('Accept')?.includes('application/json')?Response.json({success:false,error},{status}):new Response(`<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Poptávku se nepodařilo odeslat</title><body><h1>Poptávku se nepodařilo odeslat.</h1><p>${error}</p><p>Zavolejte na <a href="tel:+420724556144">724 556 144</a> nebo se vraťte do formuláře tlačítkem Zpět.</p><a href="/kontakty">Kontakty</a></body></html>`,{status,headers:{'Content-Type':'text/html; charset=utf-8'}});
export const onRequestPost=async({request,env}:PagesContext)=>{
  if(request.headers.get('Origin')&&request.headers.get('Origin')!==new URL(request.url).origin)return failure(request,'Neplatný původ požadavku.',403);
  if(Number(request.headers.get('Content-Length')??0)>16000)return failure(request,'Zpráva je příliš dlouhá.',413);
  let data:FormData;
  try{data=await request.formData();}catch{return failure(request,'Formulář má neplatný formát.');}
  const get=(key:string)=>String(data.get(key)??'').trim();
  const success=()=>request.headers.get('Accept')?.includes('application/json')?Response.json({success:true}):Response.redirect(new URL('/dekujeme',request.url),303);
  if(get('website'))return success();
  const name=get('name'),phone=get('phone'),email=get('email'),product=get('product'),productLabel=get('productLabel'),message=get('message'),location=get('location'),dimensions=get('dimensions');
  if(!name||phone.replace(/\D/g,'').length<6||!data.get('consent'))return failure(request,'Vyplňte jméno, telefon a souhlas se zpracováním údajů.');
  if(name.length>120||phone.length>30||email.length>254||message.length>5000||product.length>200||productLabel.length>200||location.length>300||dimensions.length>200)return failure(request,'Některé pole je příliš dlouhé.');
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return failure(request,'Zkontrolujte prosím e-mailovou adresu.');
  let configuration='';
  if(product==='pergola-kalkulace'){
    for(const key of ['size','roofing','zinc','assembly','delivery','color'])if(!get(key))return failure(request,'Chybí konfigurace pergoly. Vraťte se prosím do kalkulačky.');
    const selection=Object.fromEntries(['size','roofing','zinc','assembly','delivery','color'].map(key=>[key,get(key)]));
    try{calculate(selection);configuration=inquirySummary(selection);}catch{return failure(request,'Neplatná konfigurace pergoly.');}
  }
  const payload={_subject:`Nezávazná poptávka: ${(productLabel||product||'kovovýroba').replace(/[\r\n]/g,' ')}`,_replyto:email||undefined,_cc:env.FORM_CC_EMAILS||undefined,_template:'table',_captcha:'false',name,phone,email:email||'neuvedeno',location:location||'neuvedeno',dimensions:dimensions||'neuvedeno',configuration:configuration||'bez kalkulace',message:message||'bez zprávy',submitted_at:new Date().toLocaleString('cs-CZ',{timeZone:'Europe/Prague'})};
  try{
    const response=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(env.FORM_PRIMARY_EMAIL||'daniel.richter.st@gmail.com')}`,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
    const result=await response.json() as {success?:boolean|string};
    if(!response.ok||(result.success!==true&&result.success!=='true'))return failure(request,'E-mailová služba zprávu nepotvrdila. Poptávka nebyla odeslána.',502);
    return success();
  }catch{return failure(request,'Spojení s e-mailovou službou se nepodařilo. Poptávka nebyla potvrzena.',502);}
};
