import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,headless:true});
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
const output=new URL('../test-output/',import.meta.url);
await mkdir(output,{recursive:true});
const checks=[],errors=[];
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.locator('img').evaluateAll(async images=>{for(const image of images)image.loading='eager';await Promise.all(images.map(image=>image.decode().catch(()=>{})));});
  await page.screenshot({path:fileURLToPath(new URL('home-desktop.png',output)),fullPage:true});
  await page.screenshot({path:fileURLToPath(new URL('hero-desktop.png',output))});
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('img').evaluateAll(images=>images.filter(i=>!i.complete||i.naturalWidth===0).length),0);checks.push('Home loads with all photos');
  await page.getByRole('navigation').getByRole('link',{name:'Kalkulačka pergoly',exact:true}).click();
  await page.waitForURL(/\/pergoly\/?(?:\?|#|$)/);await page.waitForSelector('[data-total]');
  assert.match(await page.locator('[data-total]').innerText(),/65\s?545/);
  await page.getByRole('radio',{name:'6 × 4 m',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Bez krytiny',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Bez zinkování',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Vlastní montáž',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Doprava k vám',exact:true}).locator('..').click();
  await page.getByRole('radio',{name:'Bílá RAL 9010',exact:true}).locator('..').click();
  assert.match(await page.locator('[data-total]').innerText(),/81\s?500/);
  const shared=page.url();await page.reload({waitUntil:'networkidle'});
  assert.equal(page.url(),shared);assert.equal(await page.getByRole('radio',{name:'Bílá RAL 9010',exact:true}).isChecked(),true);
  assert.match(await page.locator('[data-delivery-note]').innerText(),/Není zahrnuta/);checks.push('Options recalculate and survive a shared URL reload');
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:fileURLToPath(new URL('calculator-desktop.png',output)),fullPage:true});
  await page.getByRole('link',{name:'Poptat tuto pergolu'}).click();await page.waitForURL(/\/poptavka\/?(?:\?|#|$)/);
  const summary=await page.locator('[data-config-summary]').innerText();
  for(const value of ['6 × 4 m','RAL 9010','81','500','bez krytiny','vlastní','mimo součet'])assert.ok(summary.includes(value),value);
  assert.equal(await page.locator('input[name=size]').inputValue(),'6000x4000');checks.push('Inquiry receives all six configuration choices and price');
  await page.locator('input[name=name]').fill('Kontrola návrhu');await page.locator('input[name=phone]').fill('777123456');await page.locator('input[name=consent]').check();
  // Intercept locally: this verification never sends an email.
  await page.route('**/api/forms',route=>route.fulfill({status:502,contentType:'application/json',body:JSON.stringify({success:false,error:'Test nedostupné e-mailové služby.'})}));
  await page.getByRole('button',{name:'Odeslat nezávaznou poptávku'}).click();await page.waitForSelector('.form-status--error');
  assert.equal(await page.locator('input[name=name]').inputValue(),'Kontrola návrhu');assert.ok(page.url().includes('/poptavka'));checks.push('Send failure preserves form fields and shows no false success');
  await page.unroute('**/api/forms');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  mobile.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/','/pergoly','/poptavka?produkt=pergola-kalkulace&size=6000x4000','/oploceni','/venkovni-nabytek','/ostatni','/kontakty','/fotogalerie','/ochrana-udaju']){
    await mobile.goto(base+path,{waitUntil:'networkidle'});
    assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow on ${path}`);
    const missing=await mobile.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));assert.deepEqual(missing,[]);
    if(path==='/'||path==='/pergoly'){
      await mobile.locator('img').evaluateAll(async images=>{for(const image of images)image.loading='eager';await Promise.all(images.map(image=>image.decode().catch(()=>{})));});
      await mobile.screenshot({path:fileURLToPath(new URL(path==='/'?'home-mobile.png':'calculator-mobile.png',output)),fullPage:true});
    }
  }
  await mobile.goto(base,{waitUntil:'networkidle'});await mobile.getByRole('button',{name:'Menu'}).click();
  assert.equal(await mobile.getByRole('button',{name:'Menu'}).getAttribute('aria-expanded'),'true');
  await mobile.getByRole('navigation').getByRole('link',{name:'Pergoly',exact:true}).click();await mobile.waitForURL(/\/pergoly\/?(?:\?|#|$)/);checks.push('Nine routes fit mobile and mobile navigation works');
  await mobile.setViewportSize({width:320,height:700});await mobile.reload({waitUntil:'networkidle'});assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks.push('Calculator fits a 320px viewport');
  assert.deepEqual(errors,[]);
  await writeFile(new URL('browser-results.json',output),JSON.stringify({base,checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
}finally{await browser.close();}
