const KEY = 'today-what-to-listen-albums-v1';
const messages = [
  '今日はこれ。理由はありません。',
  'たぶん今日は、これがいい気がします。',
  '迷う時間も楽しいけど、今日は決めました。',
  '今日はこれを一枚目にしてみてください。',
  '久しぶりなら、ちょうどいいかもしれません。',
  '今日は運に任せてみましょう。',
  'これ、今の気分じゃなかったとしても聴いてみて。',
  'もう選びました。あとは再生するだけ。'
];
let albums = load();

const $ = (id) => document.getElementById(id);

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(albums)); }
function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
function render() {
  $('count').textContent = `${albums.length}枚`;
  $('emptyText').style.display = albums.length ? 'none' : 'block';
  $('albums').innerHTML = albums.map((a, i) => `
    <article class="album">
      <button class="remove" aria-label="削除" onclick="removeAlbum(${i})">×</button>
      <div class="album-cover">${a.cover ? `<img src="${escapeHtml(a.cover)}" alt="">` : '<span class="placeholder">NO COVER</span>'}</div>
      <div class="album-info">
        <div class="album-title" title="${escapeHtml(a.title)}">${escapeHtml(a.title)}</div>
        <div class="album-artist" title="${escapeHtml(a.artist)}">${escapeHtml(a.artist)}</div>
      </div>
    </article>`).join('');
}
window.removeAlbum = function(i) {
  albums.splice(i,1); save(); render();
};
$('albumForm').addEventListener('submit', e => {
  e.preventDefault();
  albums.push({ artist:$('artist').value.trim(), title:$('title').value.trim(), cover:$('cover').value.trim(), url:$('url').value.trim() });
  save(); render(); e.target.reset(); $('artist').focus();
});
$('pickButton').addEventListener('click', () => {
  if (!albums.length) {
    $('message').textContent = 'まずは好きなアルバムを1枚入れてください。';
    return;
  }
  const a = albums[Math.floor(Math.random() * albums.length)];
  const result = $('result');
  result.classList.remove('empty');
  result.innerHTML = a.cover ? `<img src="${escapeHtml(a.cover)}" alt="${escapeHtml(a.title)}">` : `<div><strong>${escapeHtml(a.title)}</strong><br><span class="placeholder">${escapeHtml(a.artist)}</span></div>`;
  $('message').textContent = messages[Math.floor(Math.random() * messages.length)];
  const listen = $('listenButton');
  if (a.url) { listen.href = a.url; listen.classList.remove('hidden'); }
  else { listen.classList.add('hidden'); }
  result.animate([{transform:'rotate(-2deg) scale(.96)'},{transform:'rotate(0) scale(1)'}],{duration:350,easing:'cubic-bezier(.2,.8,.2,1)'});
});
render();
