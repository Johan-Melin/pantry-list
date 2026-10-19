const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const handlers = {};
const entries = new Map();
const deleted = [];
let claimed = false;
const cache = {
  async addAll(paths) {
    for (const path of paths) {
      const file = 'dist' + (path === '/' ? '/index.html' : path);
      assert.ok(fs.existsSync(file), `Missing shell file: ${file}`);
      entries.set(path, fs.readFileSync(file));
    }
  },
  async match(path) { return entries.get(path); }
};
const context = {
  URL,
  self: {location: {origin: 'https://pantry.example'}, clients: {async claim() {claimed = true;}}, addEventListener(name, fn) {handlers[name] = fn;}},
  caches: {async open() {return cache;}, async keys() {return ['pantry-shell-v0', 'pantry-shell-v1', 'other-app'];}, async delete(key) {deleted.push(key);}},
  fetch() {throw new Error('Offline');}
};
vm.runInNewContext(fs.readFileSync('dist/sw.js', 'utf8'), context);
(async () => {
  let task;
  handlers.install({waitUntil(promise) {task = promise;}});
  await task;
  handlers.activate({waitUntil(promise) {task = promise;}});
  await task;
  assert.deepEqual(deleted, ['pantry-shell-v0']);
  assert.equal(claimed, true);
  for (const path of ['/', '/?from=home', '/app.js', '/style.css']) {
    let response;
    handlers.fetch({request: {url: 'https://pantry.example' + path, method: 'GET'}, respondWith(promise) {response = promise;}});
    assert.ok((await response).length > 0, `Offline response missing for ${path}`);
  }
  for (const [url, method] of [['https://fonts.googleapis.com/css', 'GET'], ['https://pantry.example/api', 'POST']]) {
    handlers.fetch({request: {url, method}, respondWith() {assert.fail('Unrelated request intercepted');}});
  }
  const manifest = JSON.parse(fs.readFileSync('dist/manifest.webmanifest', 'utf8'));
  assert.equal(manifest.display, 'standalone');
  for (const icon of [...manifest.icons, {src: 'icons/apple-touch-icon.png', sizes: '180x180'}]) {
    const data = fs.readFileSync('dist/' + icon.src);
    assert.equal(data.toString('hex', 0, 8), '89504e470d0a1a0a');
    const size = Number(icon.sizes.split('x')[0]);
    assert.equal(data.readUInt32BE(16), size);
    assert.equal(data.readUInt32BE(20), size);
  }
  console.log('PWA checks passed: offline shell, cache cleanup, request isolation, manifest and PNG icons.');
})().catch(error => {console.error(error); process.exitCode = 1;});
