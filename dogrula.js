// Kullanım: node dogrula.js piyasa-ek-veriler.json  → geçerliyse "OK", değilse hata ve çıkış kodu 1
const fs = require('fs');
const j = JSON.parse(fs.readFileSync(process.argv[2] || 'piyasa-ek-veriler.json', 'utf8'));
const T = ['ihtiyac', 'konut', 'tasit'];
const fail = m => { console.error('HATA: ' + m); process.exit(1); };
if (!j.banks || !T.every(t => Array.isArray(j.banks[t]) && j.banks[t].length >= 5)) fail('banks.ihtiyac/konut/tasit en az 5 banka içermeli');
for (const t of T) for (const b of j.banks[t]) {
  if (typeof b.bank !== 'string' || typeof b.rate !== 'number' || !(b.rate > 0 && b.rate < 20)) fail(`${t}: geçersiz banka kaydı ${JSON.stringify(b)}`);
  for (const k of ['min', 'max', 'minTerm', 'maxTerm']) if (k in b && typeof b[k] !== 'number') fail(`${t}/${b.bank}: ${k} sayı olmalı`);
}
if (!Array.isArray(j.campaigns)) fail('campaigns dizi olmalı');
for (const c of j.campaigns) {
  if (typeof c.bank !== 'string' || typeof c.rate !== 'number' || typeof c.total !== 'number' || typeof c.newCustomer !== 'boolean') fail('geçersiz kampanya ' + JSON.stringify(c).slice(0, 120));
  if (c.until && !/^\d{4}-\d{2}-\d{2}$/.test(c.until)) fail(`${c.bank}: until YYYY-MM-DD olmalı`);
  if (c.url && !/^https:\/\//.test(c.url)) fail(`${c.bank}: url https ile başlamalı`);
}
for (const k of ['banksDate', 'campaignsDate']) if (!/^\d{4}-\d{2}-\d{2}$/.test(j[k] || '')) fail(k + ' YYYY-MM-DD olmalı');
if (typeof j.policyRate !== 'number') fail('policyRate sayı olmalı');
console.log(`OK: ${T.map(t => t + ' ' + j.banks[t].length).join(', ')}, ${j.campaigns.length} kampanya`);
