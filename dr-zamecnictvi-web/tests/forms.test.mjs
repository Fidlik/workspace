import {test} from 'node:test';
import assert from 'node:assert/strict';
import {onRequestPost} from '../functions/api/forms.ts';
import {defaults} from '../src/lib/pergola.mjs';
const request=(overrides={})=>{
  const values={name:'Test formuláře',phone:'777123456',consent:'on',product:'pergola-kalkulace',...defaults,...overrides};
  const body=new FormData();for(const [key,value]of Object.entries(values))body.set(key,value);
  return new Request('https://preview.example/api/forms',{method:'POST',headers:{Accept:'application/json',Origin:'https://preview.example'},body});
};
test('invalid fields and forged configurations never contact the email service',async()=>{
  const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw Error('must not send');};
  try{
    for(const data of [{name:''},{phone:'123'},{consent:''},{size:'invalid'},{email:'bad-address'}])assert.equal((await onRequestPost({request:request(data),env:{}})).status,400);
    assert.equal(calls,0);
  }finally{globalThis.fetch=original;}
});
test('provider HTTP 200 with success false stays a visible failure',async()=>{
  const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({success:'false',message:'activation required'});
  try{const response=await onRequestPost({request:request(),env:{}});assert.equal(response.status,502);assert.equal((await response.json()).success,false);}finally{globalThis.fetch=original;}
});
test('the server recalculates a full quote and includes it in the email payload',async()=>{
  const original=globalThis.fetch;let sent;
  globalThis.fetch=async(url,options)=>{sent={url,body:JSON.parse(options.body)};return Response.json({success:'true'});};
  try{
    const response=await onRequestPost({request:request({size:'6000x4000',roofing:'none',assembly:'self',delivery:'delivery',color:'9005',total:'1'}),env:{FORM_PRIMARY_EMAIL:'test@example.com'}});
    assert.equal(response.status,200);assert.equal((await response.json()).success,true);
    assert.match(sent.url,/test%40example.com/);assert.match(sent.body.configuration,/6 × 4 m/);assert.match(sent.body.configuration,/RAL 9005/);assert.match(sent.body.configuration,/86\s?000 Kč/);assert.match(sent.body.configuration,/mimo součet/);assert.equal(sent.body._cc,undefined);
  }finally{globalThis.fetch=original;}
});
