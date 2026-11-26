import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculate, defaults, parseSelection, selectionParams, inquirySummary} from '../src/lib/pergola.mjs';

test('retains the supplied price list for all six complete pergolas',()=>{
  const expected={'3000x4000':65545,'3000x5000':77545,'3000x6000':89545,'4000x4000':84545,'5000x4000':99545,'6000x4000':112545};
  for(const [size,total]of Object.entries(expected))assert.equal(calculate({...defaults,size}).total,total,size);
});
test('removing roof, zinc and installation retains mandatory paint',()=>{
  const result=calculate({...defaults,roofing:'none',zinc:'none',assembly:'self'});
  assert.equal(result.total,40500);assert.equal(result.rows.color,5000);
});
test('delivery is explicitly quoted separately and does not alter the subtotal',()=>{
  assert.equal(calculate({...defaults,delivery:'delivery'}).total,65545);
  assert.match(inquirySummary({...defaults,delivery:'delivery'}),/mimo součet/);
});
test('a shared configuration survives reload and inquiry round trip',()=>{
  const selected={size:'6000x4000',roofing:'none',zinc:'none',assembly:'self',delivery:'delivery',color:'9010'};
  assert.deepEqual(parseSelection(new URLSearchParams(selectionParams(selected).toString())),selected);
  const summary=inquirySummary(selected);
  for(const expected of ['6 × 4 m','RAL 9010','bez krytiny','vlastní','81','500','bez DPH'])assert.ok(summary.includes(expected),expected);
});
test('untrusted URL values cannot introduce a price or arbitrary markup',()=>{
  assert.deepEqual(parseSelection(new URLSearchParams('size=<script>&color=red&price=1')),defaults);
  assert.throws(()=>calculate({...defaults,size:'9000x9000'}),/Neplatná volba/);
  assert.throws(()=>calculate({...defaults,roofing:'free'}),/Neplatná volba/);
});
