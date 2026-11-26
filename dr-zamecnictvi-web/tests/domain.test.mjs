import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/domain-worker.mjs';

test('the custom domain preserves query choices and same-origin form submissions', async()=>{
  const original=globalThis.fetch;
  let received;
  globalThis.fetch=async(request,options)=>{
    received={url:request.url,origin:request.headers.get('origin'),body:await request.text(),options};
    return Response.json({success:false},{status:400});
  };
  try {
    const request=new Request('https://dr-zamecnictvi.kompotex.org/api/forms?size=6000x4000',{method:'POST',headers:{Origin:'https://dr-zamecnictvi.kompotex.org','Content-Type':'application/x-www-form-urlencoded'},body:'name=&phone='});
    const response=await worker.fetch(request);
    assert.equal(received.url,'https://codex-dr-modern-design.dr-zamecnictvi-web.pages.dev/api/forms?size=6000x4000');
    assert.equal(received.origin,'https://codex-dr-modern-design.dr-zamecnictvi-web.pages.dev');
    assert.equal(received.body,'name=&phone=');
    assert.equal(response.status,400);
    assert.equal(received.options.redirect,'manual');
  } finally { globalThis.fetch=original; }
});

test('an external form origin is never converted to a trusted origin', async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async request=>{assert.equal(request.headers.get('origin'),'https://external.example');return new Response('Forbidden',{status:403});};
  try {
    const response=await worker.fetch(new Request('https://dr-zamecnictvi.kompotex.org/api/forms',{method:'POST',headers:{Origin:'https://external.example'},body:'x=1'}));
    assert.equal(response.status,403);
  } finally { globalThis.fetch=original; }
});

test('absolute Pages redirects keep the visitor on the Kompotex domain', async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async()=>Response.redirect('https://codex-dr-modern-design.dr-zamecnictvi-web.pages.dev/dekujeme?ok=1',303);
  try {
    const response=await worker.fetch(new Request('https://dr-zamecnictvi.kompotex.org/api/forms',{method:'POST',body:'x=1'}));
    assert.equal(response.headers.get('location'),'https://dr-zamecnictvi.kompotex.org/dekujeme?ok=1');
    assert.equal(response.status,303);
  } finally { globalThis.fetch=original; }
});
