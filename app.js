import { CONFIG } from './config.js';

/* ============ إعدادات عامة ============ */
const FB = CONFIG.firebase || {};
const REAL = !!(FB.apiKey && !/^PUT_|YOUR_/.test(FB.apiKey));
const CLD = CONFIG.cloudinary || {};
const CLD_ON = !!(CLD.cloudName && !/^PUT_|YOUR_/.test(CLD.cloudName));

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');

function fmtTime(ms) {
  const d = new Date(ms);
  const h = d.getHours();
  return `${h % 12 || 12}:${pad(d.getMinutes())} ${h < 12 ? 'ص' : 'م'}`;
}
function dayKey(ms) { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function fmtDay(ms) {
  const t = new Date(), d = new Date(ms);
  if (dayKey(ms) === dayKey(Date.now())) return 'اليوم';
  const y = new Date(t); y.setDate(t.getDate() - 1);
  if (dayKey(ms) === dayKey(y.getTime())) return 'أمس';
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
function fmtListTime(ms) {
  if (!ms) return '';
  const lbl = fmtDay(ms);
  return lbl === 'اليوم' ? fmtTime(ms) : lbl;
}
const fmtDur = (s) => { s = Math.max(0, Math.round(s || 0)); return `${Math.floor(s / 60)}:${pad(s % 60)}`; };
const initials = (n) => (String(n || '?').trim()[0] || '?').toUpperCase();
function colorFor(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) % 360; return `hsl(${h},55%,42%)`; }
function avatar(u, cls = '') { return `<div class="av ${cls}" style="background:${colorFor(u?.uid || u?.name)}">${esc(initials(u?.name))}</div>`; }

const ICONS = {
  chat: '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.3A8 8 0 1 1 21 12z"/>',
  status: '<circle cx="12" cy="12" r="8" stroke-dasharray="3.2 3"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  gear: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  back: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  send: '<path d="M20 4L9 15M20 4l-6 16-4-9-9-4z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.5"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  play: '<path d="M7 4l13 8-13 8z" stroke="none"/>',
  pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z" stroke="none"/>'
};
const ic = (n, extra = '') => `<svg viewBox="0 0 24 24" ${extra} aria-hidden="true">${ICONS[n]}</svg>`;
const TICK1 = '<svg class="tick" viewBox="0 0 16 12"><path d="M2 6l3.5 3.5L12 2"/></svg>';
const TICK2 = '<svg class="tick rd" viewBox="0 0 16 12"><path d="M1 6l3.5 3.5L11 2M7 9l1 1L15 2"/></svg>';

let toastT;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600);
}

const ERR = {
  'auth/invalid-email': 'البريد الإلكتروني غير صالح',
  'auth/email-already-in-use': 'هذا البريد مسجّل مسبقاً',
  'auth/weak-password': 'كلمة المرور ضعيفة (6 أحرف على الأقل)',
  'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة',
  'auth/user-not-found': 'البريد أو كلمة المرور غير صحيحة',
  'auth/wrong-password': 'البريد أو كلمة المرور غير صحيحة',
  'auth/network-request-failed': 'تعذر الاتصال بالإنترنت',
  'auth/too-many-requests': 'محاولات كثيرة، حاول لاحقاً',
  USERNAME_TAKEN: 'اسم المستخدم محجوز، اختر اسماً آخر',
  'permission-denied': 'لا تملك صلاحية لهذه العملية (تحقق من قواعد Firestore)'
};
const errMsg = (e) => ERR[e?.code] || ERR[e?.message] || 'حدث خطأ، حاول مرة أخرى';

/* ============ التفضيلات والثيم ============ */
const ACCENTS = ['#2f7bff', '#0a84ff', '#1e5bd8', '#00b4d8', '#3b5bdb', '#7c4dff', '#00c389', '#ff6b6b'];
const BGS = [
  { id: 'default', label: 'افتراضي', css: '' },
  { id: 'navy', css: '#0b1426' },
  { id: 'ink', css: '#02040a' },
  { id: 'g1', css: 'linear-gradient(160deg,#071226,#0b2a5b)' },
  { id: 'g2', css: 'radial-gradient(circle at 20% 10%,#12346b,#050912 65%)' },
  { id: 'g3', css: 'linear-gradient(200deg,#000,#0a1f44 70%,#123d86)' },
  { id: 'dots', css: 'radial-gradient(rgba(47,123,255,.28) 1.5px,transparent 1.5px) 0 0/22px 22px,#07101f' },
  { id: 'sky', css: '#e8f0ff' },
  { id: 'white', css: '#ffffff' }
];
const DEF_PREFS = { mode: 'dark', accent: '#2f7bff', bg: 'default', bubble: null, fs: 15 };

function loadPrefs() {
  try { return { ...DEF_PREFS, ...JSON.parse(localStorage.getItem('tm_prefs') || '{}') }; } catch { return { ...DEF_PREFS }; }
}
function savePrefs() { try { localStorage.setItem('tm_prefs', JSON.stringify(S.prefs)); } catch { /* ممتلئ */ } }
function onColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#fff';
  const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 165 ? '#06101f' : '#ffffff';
}
function applyPrefs() {
  const p = S.prefs, root = document.documentElement;
  let mode = p.mode;
  if (mode === 'auto') mode = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = mode;
  root.style.setProperty('--accent', p.accent);
  root.style.setProperty('--on-accent', onColor(p.accent));
  root.style.setProperty('--bubble-out', p.bubble || p.accent);
  root.style.setProperty('--on-bubble', onColor(p.bubble || p.accent));
  root.style.setProperty('--fs', p.fs + 'px');
  let bg = '';
  if (p.bg === 'image') { const d = localStorage.getItem('tm_bgimg'); if (d) bg = `url(${d}) center/cover`; }
  else { const o = BGS.find((b) => b.id === p.bg); if (o) bg = o.css; }
  root.style.setProperty('--chat-bg', bg || 'var(--bg)');
  const tc = getComputedStyle(root).getPropertyValue('--surface').trim();
  $('meta[name=theme-color]')?.setAttribute('content', tc || '#050912');
}

/* ============ الحالة ============ */
const S = {
  prefs: loadPrefs(), be: null, user: null, view: 'boot', authMode: 'login',
  chats: [], peers: {}, chat: null, msgs: [], unW: null, unM: null, installEv: null
};

/* ============ خادم تجريبي محلي (بدون إنترنت) ============ */
function makeLocal() {
  const KEY = 'tm_demo_v1';
  const welcome = 'أهلاً بك في Tweet me! 👋\nهذا الوضع التجريبي يعمل على هاتفك فقط. بعد ربط Firebase يتحول إلى مراسلة حقيقية بين الأعضاء.';
  const fresh = () => ({
    me: { uid: 'me', name: 'ضيف', username: 'guest' },
    users: { bot: { uid: 'bot', name: 'Tweet بوت', username: 'tweetbot' } },
    chats: { bot_me: { id: 'bot_me', members: ['bot', 'me'], last: { type: 'text', text: welcome, from: 'bot' }, updatedAt: Date.now(), unread: { me: 1 } } },
    msgs: { bot_me: [{ id: 'w1', from: 'bot', type: 'text', text: welcome, url: '', dur: 0, at: Date.now() }] }
  });
  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY)); } catch { /* فارغ */ }
  if (!db || !db.me) db = fresh();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ممتلئ */ } };
  const cSubs = new Set(), mSubs = new Map();
  const list = () => Object.values(db.chats).map((c) => ({
    id: c.id, peer: c.members.find((x) => x !== 'me'), last: c.last, updatedAt: c.updatedAt,
    unread: (c.unread && c.unread.me) || 0, peerRead: 9e15
  }));
  const emitC = () => cSubs.forEach((f) => f(list()));
  const emitM = (id) => (mSubs.get(id) || new Set()).forEach((f) => f([...(db.msgs[id] || [])]));
  const push = (id, from, m) => {
    if (!db.msgs[id]) db.msgs[id] = [];
    const msg = { id: 'm' + Date.now() + Math.random().toString(36).slice(2, 6), from, type: m.type, text: m.text || '', url: m.url || '', dur: m.dur || 0, at: Date.now() };
    db.msgs[id].push(msg);
    const peer = from === 'me' ? 'bot' : 'me';
    if (!db.chats[id]) db.chats[id] = { id, members: ['bot', 'me'], unread: {} };
    db.chats[id].last = { type: m.type, text: m.text || '', from };
    db.chats[id].updatedAt = Date.now();
    db.chats[id].unread = db.chats[id].unread || {};
    db.chats[id].unread[peer] = (db.chats[id].unread[peer] || 0) + 1;
    if (from === 'me') db.chats[id].unread.me = 0;
    save(); emitM(id); emitC();
  };
  return {
    demo: true,
    async init() {},
    onAuth(cb) { setTimeout(() => cb(db.me), 0); },
    async signUp() {}, async signIn() {}, async resetPass() {},
    async signOut() { toast('الوضع التجريبي: لا يوجد تسجيل خروج'); },
    async findUser(u) { return Object.values(db.users).find((x) => x.username === u) || null; },
    async getUser(uid) { return db.users[uid] || db.me; },
    async updateProfile(name) { db.me.name = name; save(); return db.me; },
    watchChats(cb) { cSubs.add(cb); setTimeout(() => cb(list()), 0); return () => cSubs.delete(cb); },
    watchMessages(id, cb) {
      if (!mSubs.has(id)) mSubs.set(id, new Set());
      mSubs.get(id).add(cb); setTimeout(() => cb([...(db.msgs[id] || [])]), 0);
      return () => mSubs.get(id)?.delete(cb);
    },
    async send(id, peer, m) {
      push(id, 'me', m);
      setTimeout(() => {
        push(id, 'bot', m.type === 'text'
          ? { type: 'text', text: 'وصلتني رسالتك: «' + m.text.slice(0, 80) + '»' }
          : { type: 'text', text: m.type === 'image' ? 'وصلتني الصورة 📷' : 'وصلتني رسالتك الصوتية 🎤' });
      }, 800);
    },
    async markRead(id) { if (db.chats[id]) { db.chats[id].unread.me = 0; save(); emitC(); } }
  };
}

/* ============ خادم Firebase الحقيقي ============ */
async function makeFirebase() {
  const base = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const [A, Au, F] = await Promise.all([
    import(base + 'firebase-app.js'), import(base + 'firebase-auth.js'), import(base + 'firebase-firestore.js')
  ]);
  const app = A.initializeApp(FB);
  const auth = Au.getAuth(app);
  let db;
  try {
    db = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) });
  } catch { db = F.getFirestore(app); }

  const cache = {}; let busy = false, cb = null;
  const getUser = async (uid) => {
    if (cache[uid]) return cache[uid];
    const s = await F.getDoc(F.doc(db, 'users', uid));
    if (!s.exists()) return { uid, name: 'مستخدم', username: '' };
    return (cache[uid] = { uid, name: s.data().name, username: s.data().username });
  };
  const ms = (t) => (t && t.toMillis ? t.toMillis() : 0);

  return {
    demo: false,
    async init() {},
    onAuth(f) {
      cb = f;
      Au.onAuthStateChanged(auth, async (u) => {
        if (busy) return;
        if (!u) return cb(null);
        try {
          const s = await F.getDoc(F.doc(db, 'users', u.uid));
          if (!s.exists()) { await Au.signOut(auth); return cb(null); }
          cb(cache[u.uid] = { uid: u.uid, name: s.data().name, username: s.data().username });
        } catch (e) {
          // بدون إنترنت: نعتمد على آخر ملف محفوظ
          const saved = JSON.parse(localStorage.getItem('tm_me') || 'null');
          if (saved && saved.uid === u.uid) cb(saved); else cb(null);
        }
      });
    },
    async signUp(name, username, email, pass) {
      busy = true;
      try {
        const cred = await Au.createUserWithEmailAndPassword(auth, email, pass);
        const uid = cred.user.uid;
        try {
          const ex = await F.getDoc(F.doc(db, 'usernames', username));
          if (ex.exists()) throw new Error('USERNAME_TAKEN');
          const b = F.writeBatch(db);
          b.set(F.doc(db, 'usernames', username), { uid });
          b.set(F.doc(db, 'users', uid), { name, username, createdAt: F.serverTimestamp() });
          await b.commit();
        } catch (e) { try { await cred.user.delete(); } catch { /* تجاهل */ } throw e; }
        Au.sendEmailVerification(cred.user).catch(() => {});
        cb({ uid, name, username });
      } finally { busy = false; }
    },
    async signIn(email, pass) { await Au.signInWithEmailAndPassword(auth, email, pass); },
    async resetPass(email) { await Au.sendPasswordResetEmail(auth, email); },
    async signOut() { await Au.signOut(auth); },
    async findUser(username) {
      const s = await F.getDoc(F.doc(db, 'usernames', username));
      if (!s.exists()) return null;
      return getUser(s.data().uid);
    },
    getUser,
    async updateProfile(name) {
      const uid = auth.currentUser.uid;
      await F.updateDoc(F.doc(db, 'users', uid), { name });
      cache[uid] = { ...(cache[uid] || { uid }), name };
      return cache[uid];
    },
    watchChats(f) {
      const uid = auth.currentUser.uid;
      const q = F.query(F.collection(db, 'chats'), F.where('members', 'array-contains', uid));
      return F.onSnapshot(q, (snap) => {
        f(snap.docs.map((d) => {
          const c = d.data({ serverTimestamps: 'estimate' });
          const peer = (c.members || []).find((x) => x !== uid);
          return {
            id: d.id, peer, last: c.last, updatedAt: ms(c.updatedAt) || Date.now(),
            unread: (c.unread && c.unread[uid]) || 0, peerRead: ms(c.lastRead && c.lastRead[peer])
          };
        }));
      }, () => {});
    },
    watchMessages(id, f) {
      const q = F.query(F.collection(db, 'chats', id, 'messages'), F.orderBy('at', 'desc'), F.limit(120));
      return F.onSnapshot(q, (snap) => {
        f(snap.docs.map((d) => {
          const m = d.data({ serverTimestamps: 'estimate' });
          return { id: d.id, from: m.from, type: m.type, text: m.text || '', url: m.url || '', dur: m.dur || 0, at: ms(m.at) || Date.now(), pending: d.metadata.hasPendingWrites };
        }).reverse());
      }, (e) => { if (e?.code === 'permission-denied') f([]); });
    },
    async send(id, peer, m) {
      const me = auth.currentUser.uid;
      const b = F.writeBatch(db);
      b.set(F.doc(db, 'chats', id), {
        members: [me, peer].sort(), last: { type: m.type, text: m.text || '', from: me },
        updatedAt: F.serverTimestamp(), unread: { [peer]: F.increment(1) }, lastRead: { [me]: F.serverTimestamp() }
      }, { merge: true });
      b.set(F.doc(F.collection(db, 'chats', id, 'messages')), {
        from: me, type: m.type, text: m.text || '', url: m.url || '', dur: m.dur || 0, at: F.serverTimestamp()
      });
      await b.commit();
    },
    async markRead(id) {
      const me = auth.currentUser.uid;
      try { await F.updateDoc(F.doc(db, 'chats', id), { ['unread.' + me]: 0, ['lastRead.' + me]: F.serverTimestamp() }); } catch { /* المحادثة غير موجودة بعد */ }
    }
  };
}

/* ============ رفع الوسائط ============ */
const blobToDataURL = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); });
async function shrinkImage(file, max, q) {
  const bmp = await createImageBitmap(file);
  const sc = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * sc); c.height = Math.round(bmp.height * sc);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((r) => c.toBlob(r, 'image/jpeg', q));
}
async function cloudUpload(blob) {
  const fd = new FormData();
  fd.append('file', blob); fd.append('upload_preset', CLD.uploadPreset);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLD.cloudName}/auto/upload`, { method: 'POST', body: fd });
  if (!r.ok) throw new Error('upload');
  return (await r.json()).secure_url;
}
async function mediaToUrl(blob) {
  if (S.be.demo) return blobToDataURL(blob);
  if (CLD_ON) { try { return await cloudUpload(blob); } catch { /* نرجع للتخزين المباشر */ } }
  if (blob.size > 620 * 1024) throw new Error('TOO_BIG');
  return blobToDataURL(blob);
}

/* ============ العرض ============ */
const app = $('#app');

function render() {
  const v = S.view;
  if (v === 'boot') app.innerHTML = '<div class="empty" style="margin:auto"><b>Tweet me</b>جارٍ التحميل…</div>';
  else if (v === 'auth') renderAuth();
  else if (v === 'list') renderList();
  else if (v === 'chat') renderChat();
  else if (v === 'settings') renderSettings();
  else if (v === 'status') renderSoon('status', 'الحالات', 'ستأتي الحالات (القصص) في المرحلة التالية.');
  else if (v === 'calls') renderSoon('calls', 'المكالمات', 'مكالمات الصوت والفيديو ستُضاف في المرحلة التالية.');
}

function nav(tab) {
  const items = [['list', 'chat', 'المحادثات'], ['status', 'status', 'الحالات'], ['calls', 'phone', 'المكالمات'], ['settings', 'gear', 'الإعدادات']];
  return `<nav class="nav">${items.map(([k, i, l]) => `<button data-act="tab" data-v="${k}" class="${tab === k ? 'on' : ''}">${ic(i)}<span>${l}</span></button>`).join('')}</nav>`;
}
function header(title, extra = '') {
  return `<div class="hd"><h1>${title}</h1>${extra}</div>`;
}

/* --- الدخول --- */
function renderAuth() {
  const su = S.authMode === 'signup';
  app.innerHTML = `<div class="auth">
    <img class="logo" src="icon-192.png" alt="Tweet me">
    <h1>Tweet <b>me</b></h1>
    <p class="lead">${su ? 'أنشئ حسابك وابدأ المراسلة' : 'سجّل دخولك لمتابعة محادثاتك'}</p>
    <div class="seg"><button data-act="authTab" data-m="login" class="${su ? '' : 'on'}">دخول</button><button data-act="authTab" data-m="signup" class="${su ? 'on' : ''}">حساب جديد</button></div>
    ${su ? '<input id="f-name" placeholder="الاسم الظاهر" autocomplete="name" maxlength="40"><input id="f-user" placeholder="اسم المستخدم (إنجليزي: حروف وأرقام و _)" autocapitalize="none" autocomplete="username" maxlength="20" dir="ltr">' : ''}
    <input id="f-mail" type="email" placeholder="البريد الإلكتروني" autocomplete="email" dir="ltr">
    <input id="f-pass" type="password" placeholder="كلمة المرور" autocomplete="${su ? 'new-password' : 'current-password'}" dir="ltr">
    <button class="link" data-act="eye">إظهار / إخفاء كلمة المرور</button>
    <div class="err" id="f-err"></div>
    <button class="btn" id="f-go" data-act="authGo">${su ? 'إنشاء الحساب' : 'دخول'}</button>
    ${su ? '' : '<button class="link" data-act="forgot">نسيت كلمة المرور؟</button>'}
  </div>`;
}

/* --- قائمة المحادثات --- */
function previewText(last) {
  if (!last) return '';
  const pre = last.from === S.user?.uid || last.from === 'me' ? 'أنت: ' : '';
  if (last.type === 'image') return pre + '📷 صورة';
  if (last.type === 'voice') return pre + '🎤 رسالة صوتية';
  return pre + (last.text || '');
}
function listRows() {
  const rows = [...S.chats].sort((a, b) => b.updatedAt - a.updatedAt);
  if (!rows.length) return '<div class="empty"><b>لا توجد محادثات بعد</b>اضغط زر + للبحث عن صديق باسم المستخدم وابدأ المراسلة.</div>';
  return rows.map((c) => {
    const p = S.peers[c.peer] || { uid: c.peer, name: '…' };
    return `<button class="row" data-act="openChat" data-uid="${esc(c.peer)}">${avatar(p)}
      <div class="mid"><div class="nm">${esc(p.name)}</div><div class="sub">${esc(previewText(c.last))}</div></div>
      <div class="meta"><span>${fmtListTime(c.updatedAt)}</span>${c.unread ? `<span class="badge">${c.unread}</span>` : ''}</div></button>`;
  }).join('');
}
function renderList() {
  app.innerHTML = `<div class="screen">${header('Tweet <b>me</b>', S.be.demo ? '<span class="sub" style="margin:0">وضع تجريبي</span>' : '')}
    <div class="rel"><div class="scroll" id="list">${listRows()}</div>
    <button class="fab" data-act="newChat" aria-label="محادثة جديدة">${ic('plus')}</button></div>${nav('list')}</div>`;
}
function renderSoon(tab, title, text) {
  app.innerHTML = `<div class="screen">${header(title)}<div class="scroll"><div class="empty"><b>قريباً</b>${text}</div></div>${nav(tab)}</div>`;
}

/* --- شاشة المحادثة --- */
function renderChat() {
  const p = S.chat.peer;
  app.innerHTML = `<div class="screen">
    <div class="hd"><button class="ib" data-act="back" aria-label="رجوع">${ic('back')}</button>${avatar(p, 'sm')}
      <div style="flex:1;min-width:0"><div class="nm">${esc(p.name)}</div><div class="sub" style="margin:0" dir="ltr">${p.username ? '@' + esc(p.username) : ''}</div></div></div>
    <div class="chatbg"><div class="msgs" id="msgs"></div></div>
    <div class="comp" id="comp">
      <div id="compN" style="display:flex;align-items:flex-end;gap:6px;flex:1">
        <button class="ib" data-act="pickImg" aria-label="صورة">${ic('image')}</button>
        <input type="file" id="imgIn" accept="image/*" hidden>
        <textarea id="txt" rows="1" placeholder="اكتب رسالة" maxlength="4000"></textarea>
        <button class="send" id="sendBtn" data-act="sendOrMic" aria-label="إرسال">${ic('mic')}</button>
      </div>
      <div id="compR" style="display:none;align-items:center;gap:8px;flex:1">
        <button class="ib" data-act="recCancel" aria-label="إلغاء">${ic('x')}</button>
        <div class="rec"><i></i><span id="recT">0:00</span></div>
        <button class="send" data-act="recSend" aria-label="إرسال الصوت">${ic('send', 'style="transform:scaleX(-1)"')}</button>
      </div></div></div>`;
  updateMsgs();
}

function tickFor(m) {
  const c = S.chats.find((x) => x.id === S.chat?.id);
  const read = c && !m.pending && m.at <= c.peerRead;
  return read ? TICK2 : TICK1;
}
function msgHTML(m) {
  const mine = m.from === S.user.uid;
  let body;
  if (m.type === 'image') body = `<img class="pic" src="${esc(m.url)}" data-act="viewImg" alt="صورة">${m.text ? esc(m.text) : ''}`;
  else if (m.type === 'voice') body = `<div class="voice" data-act="play" data-id="${esc(m.id)}"><span class="pp">${ic('play')}</span><span class="bar"><i></i></span><span class="d">${fmtDur(m.dur)}</span></div>`;
  else body = esc(m.text);
  return `<div class="b ${mine ? 'out' : 'in'}" data-id="${esc(m.id)}">${body}<div class="t">${fmtTime(m.at)}${mine ? `<span class="tk">${tickFor(m)}</span>` : ''}</div></div>`;
}
function updateMsgs() {
  const box = $('#msgs'); if (!box) return;
  const near = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
  const first = !box.dataset.init;
  const rendered = $$('.b', box).map((x) => x.dataset.id);
  const ids = S.msgs.map((m) => m.id);
  const prefix = rendered.length <= ids.length && rendered.every((id, i) => ids[i] === id);
  if (!prefix) box.innerHTML = '';
  const start = prefix ? rendered.length : 0;
  let html = '', lastDay = start > 0 ? dayKey(S.msgs[start - 1].at) : '';
  for (const m of S.msgs.slice(start)) {
    const dk = dayKey(m.at);
    if (dk !== lastDay) { html += `<div class="day">${fmtDay(m.at)}</div>`; lastDay = dk; }
    html += msgHTML(m);
  }
  if (html) box.insertAdjacentHTML('beforeend', html);
  $$('.b.out', box).forEach((el) => {
    const m = S.msgs.find((x) => x.id === el.dataset.id); const tk = $('.tk', el);
    if (m && tk) tk.innerHTML = tickFor(m);
  });
  box.dataset.init = '1';
  if (first || near) box.scrollTop = box.scrollHeight;
  paintPlay();
}

/* --- الإعدادات --- */
function renderSettings() {
  const p = S.prefs, u = S.user;
  const modes = [['dark', 'داكن'], ['light', 'فاتح'], ['auto', 'تلقائي']];
  app.innerHTML = `<div class="screen">${header('الإعدادات')}<div class="scroll" id="setScroll">
    <div class="sec">الحساب</div>
    <div class="card">
      <div style="display:flex;gap:12px;align-items:center">${avatar(u)}<div><div class="nm">${esc(u.name)}</div><div class="sub" dir="ltr">@${esc(u.username)}</div></div></div>
      <input id="nameIn" value="${esc(u.name)}" maxlength="40" placeholder="الاسم الظاهر">
      <button class="btn ghost" data-act="saveName">حفظ الاسم</button>
    </div>
    <div class="sec">المظهر</div>
    <div class="card">
      <div class="seg">${modes.map(([k, l]) => `<button data-act="mode" data-v="${k}" class="${p.mode === k ? 'on' : ''}">${l}</button>`).join('')}</div>
      <div class="lbl"><span>لون التطبيق</span><label class="sub" style="margin:0">مخصص <input type="color" id="accCustom" value="${p.accent}" style="width:34px;height:26px;padding:0;border:0;background:none;vertical-align:middle"></label></div>
      <div class="sw">${ACCENTS.map((c) => `<button data-act="accent" data-v="${c}" style="background:${c}" class="${p.accent.toLowerCase() === c ? 'on' : ''}" aria-label="${c}"></button>`).join('')}</div>
      <div class="lbl"><span>حجم الخط</span><span class="sub" id="fsV" style="margin:0">${p.fs}</span></div>
      <input type="range" id="fsR" min="13" max="21" value="${p.fs}">
    </div>
    <div class="sec">المحادثة</div>
    <div class="card">
      <div class="prev"><div class="b in">مرحباً، كيف حالك؟</div><div class="b out">بخير، شكراً لك</div></div>
      <div>خلفية المحادثة</div>
      <div class="bgs">
        ${BGS.map((b) => `<button data-act="bg" data-v="${b.id}" class="${p.bg === b.id ? 'on' : ''}" style="background:${b.css || 'var(--bg)'}">${b.label || ''}</button>`).join('')}
        <button data-act="bgPick" class="${p.bg === 'image' ? 'on' : ''}" style="${p.bg === 'image' && localStorage.getItem('tm_bgimg') ? `background:url(${localStorage.getItem('tm_bgimg')}) center/cover` : ''}">${ic('image', 'width="22" height="22" style="stroke:currentColor;fill:none;stroke-width:1.9"')}</button>
        <input type="file" id="bgIn" accept="image/*" hidden>
      </div>
      <div>لون فقاعة رسائلي</div>
      <div class="sw"><button data-act="bubble" data-v="" style="background:var(--accent)" class="${!p.bubble ? 'on' : ''}" aria-label="مطابق للتطبيق"></button>
        ${['#1e5bd8', '#00a884', '#7c4dff', '#d6336c', '#111827', '#f59f00'].map((c) => `<button data-act="bubble" data-v="${c}" style="background:${c}" class="${p.bubble === c ? 'on' : ''}" aria-label="${c}"></button>`).join('')}</div>
    </div>
    <div class="sec">التطبيق</div>
    <div class="card">
      ${S.installEv ? '<button class="btn ghost" data-act="install">تثبيت التطبيق على الشاشة الرئيسية</button>' : ''}
      ${S.be.demo ? '<div class="note">أنت في الوضع التجريبي المحلي. بعد إدخال إعدادات Firebase في ملف config.js تتحول المراسلة إلى حقيقية بين الأعضاء.</div>' : '<button class="btn danger" data-act="logout">تسجيل الخروج</button>'}
      <div class="sub" style="text-align:center">Tweet me · الإصدار 1</div>
    </div></div>${nav('settings')}</div>`;
}

/* ============ الصوت ============ */
let P = { id: null, audio: null };
function stopPlay() { if (P.audio) { P.audio.pause(); } P = { id: null, audio: null }; paintPlay(); }
function paintPlay() {
  $$('.voice').forEach((el) => {
    const on = P.id === el.dataset.id && P.audio;
    const playing = on && !P.audio.paused;
    $('.pp', el).innerHTML = ic(playing ? 'pause' : 'play');
    const m = S.msgs.find((x) => x.id === el.dataset.id);
    const d = (m && m.dur) || (on && isFinite(P.audio.duration) ? P.audio.duration : 0);
    $('.bar i', el).style.width = on && d ? Math.min(100, (P.audio.currentTime / d) * 100) + '%' : '0';
  });
}
function togglePlay(el) {
  const id = el.dataset.id, m = S.msgs.find((x) => x.id === id); if (!m) return;
  if (P.id === id && P.audio) { P.audio.paused ? P.audio.play() : P.audio.pause(); return; }
  stopPlay();
  const a = new Audio(m.url); P = { id, audio: a };
  a.onplay = a.onpause = a.ontimeupdate = paintPlay;
  a.onended = stopPlay;
  a.play().catch(() => { toast('تعذر تشغيل الصوت'); stopPlay(); });
}

let R = null;
async function recStart() {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return toast('المتصفح لا يدعم التسجيل الصوتي');
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return toast('اسمح باستخدام الميكروفون أولاً'); }
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((t) => MediaRecorder.isTypeSupported(t)) || '';
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 24000 } : {});
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  R = { mr, stream, chunks, t0: Date.now(), mime: mr.mimeType || mime, timer: null };
  mr.start();
  $('#compN').style.display = 'none'; $('#compR').style.display = 'flex';
  R.timer = setInterval(() => {
    const s = (Date.now() - R.t0) / 1000; const t = $('#recT'); if (t) t.textContent = fmtDur(s);
    if (s >= 120) recFinish(true);
  }, 250);
}
function recFinish(send) {
  if (!R) return;
  const r = R; const dur = Math.round((Date.now() - r.t0) / 1000); R = null;
  r.mr.onstop = async () => {
    clearInterval(r.timer); r.stream.getTracks().forEach((t) => t.stop());
    if ($('#compN')) { $('#compN').style.display = 'flex'; $('#compR').style.display = 'none'; }
    if (!send || dur < 1) return;
    const blob = new Blob(r.chunks, { type: r.mime || 'audio/webm' });
    try {
      const url = await mediaToUrl(blob);
      await sendMsg({ type: 'voice', url, dur });
    } catch (e) { toast(e.message === 'TOO_BIG' ? 'الرسالة الصوتية كبيرة، سجّل مقطعاً أقصر' : 'تعذر إرسال الصوت'); }
  };
  try { r.mr.stop(); } catch { r.mr.onstop(); }
}

/* ============ الإرسال والتنقل ============ */
async function sendMsg(m) {
  if (!S.chat) return;
  try { await S.be.send(S.chat.id, S.chat.peer.uid, m); } catch (e) { toast(errMsg(e)); }
}
async function sendImage(file) {
  toast('جارٍ تجهيز الصورة…');
  try {
    let blob = await shrinkImage(file, CLD_ON ? 1280 : 900, 0.72);
    if (!CLD_ON && !S.be.demo) { let q = 0.6, mx = 800; while (blob.size > 560 * 1024 && q > 0.3) { blob = await shrinkImage(file, mx, q); q -= 0.1; mx -= 100; } }
    const url = await mediaToUrl(blob);
    await sendMsg({ type: 'image', url });
  } catch (e) { toast(e.message === 'TOO_BIG' ? 'الصورة كبيرة جداً' : 'تعذر إرسال الصورة'); }
}

function startWatch() {
  stopWatch();
  S.unW = S.be.watchChats(async (list) => {
    S.chats = list;
    for (const c of list) if (c.peer && !S.peers[c.peer]) { S.be.getUser(c.peer).then((u) => { S.peers[c.peer] = u; if (S.view === 'list') $('#list') && ($('#list').innerHTML = listRows()); }).catch(() => {}); }
    if (S.view === 'list' && $('#list')) $('#list').innerHTML = listRows();
    if (S.view === 'chat') { updateMsgs(); maybeRead(); }
  });
}
function stopWatch() { S.unW && S.unW(); S.unW = null; S.unM && S.unM(); S.unM = null; }
function maybeRead() {
  const c = S.chats.find((x) => x.id === S.chat?.id);
  if (c && c.unread > 0) S.be.markRead(S.chat.id);
}
async function openChat(uid) {
  const peer = S.peers[uid] || await S.be.getUser(uid); S.peers[uid] = peer;
  const id = [S.user.uid, uid].sort().join('_');
  S.unM && S.unM(); S.chat = { id, peer }; S.msgs = []; S.view = 'chat';
  history.pushState({ chat: id }, '');
  render();
  S.unM = S.be.watchMessages(id, (list) => { S.msgs = list; updateMsgs(); maybeRead(); });
}
function closeChat() {
  if (R) recFinish(false);
  stopPlay(); S.unM && S.unM(); S.unM = null; S.chat = null; S.msgs = []; S.view = 'list'; render();
}
addEventListener('popstate', () => { if (S.view === 'chat') closeChat(); });

/* ============ نوافذ ============ */
function sheet(html) {
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = `<div class="sheet">${html}</div>`;
  m.addEventListener('click', (e) => { if (e.target === m) m.remove(); });
  document.body.appendChild(m); return m;
}
function confirmSheet(text, okLabel) {
  return new Promise((res) => {
    const m = sheet(`<h3>${esc(text)}</h3><button class="btn danger" data-k="1">${esc(okLabel)}</button><button class="btn ghost" data-k="0">إلغاء</button>`);
    m.addEventListener('click', (e) => { const k = e.target.dataset?.k; if (k !== undefined) { m.remove(); res(k === '1'); } });
  });
}
function newChatSheet() {
  const m = sheet(`<h3>محادثة جديدة</h3><input id="srch" dir="ltr" placeholder="اسم المستخدم للصديق" autocapitalize="none" maxlength="20">
    <button class="btn" id="srchGo">بحث</button><div id="srchRes"></div>`);
  const go = async () => {
    const q = $('#srch', m).value.trim().toLowerCase().replace(/^@/, ''); const out = $('#srchRes', m);
    if (!q) return;
    out.innerHTML = '<div class="sub">جارٍ البحث…</div>';
    try {
      const u = await S.be.findUser(q);
      if (!u) out.innerHTML = '<div class="empty" style="padding:14px">لا يوجد عضو بهذا الاسم</div>';
      else if (u.uid === S.user.uid) out.innerHTML = '<div class="empty" style="padding:14px">هذا حسابك أنت 🙂</div>';
      else { S.peers[u.uid] = u; out.innerHTML = `<button class="row" data-open="${esc(u.uid)}" style="border:0">${avatar(u)}<div class="mid"><div class="nm">${esc(u.name)}</div><div class="sub" dir="ltr">@${esc(u.username)}</div></div></button>`; }
    } catch (e) { out.innerHTML = `<div class="err">${esc(errMsg(e))}</div>`; }
  };
  $('#srchGo', m).onclick = go;
  $('#srch', m).addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  m.addEventListener('click', (e) => { const b = e.target.closest('[data-open]'); if (b) { m.remove(); openChat(b.dataset.open); } });
  setTimeout(() => $('#srch', m).focus(), 50);
}

/* ============ الأحداث ============ */
const actions = {
  tab(t) { S.view = t.dataset.v; render(); },
  authTab(t) { S.authMode = t.dataset.m; renderAuth(); },
  eye() { const i = $('#f-pass'); i.type = i.type === 'password' ? 'text' : 'password'; },
  async authGo() {
    const err = $('#f-err'), btn = $('#f-go'); err.textContent = '';
    const email = $('#f-mail').value.trim(), pass = $('#f-pass').value;
    const su = S.authMode === 'signup';
    try {
      if (su) {
        const name = $('#f-name').value.trim(), user = $('#f-user').value.trim().toLowerCase();
        if (name.length < 2) { err.textContent = 'اكتب اسمك (حرفان على الأقل)'; return; }
        if (!/^[a-z0-9_]{3,20}$/.test(user)) { err.textContent = 'اسم المستخدم: 3 إلى 20 حرفاً إنجليزياً أو أرقاماً أو _'; return; }
        btn.disabled = true; await S.be.signUp(name, user, email, pass);
      } else { btn.disabled = true; await S.be.signIn(email, pass); }
    } catch (e) { err.textContent = errMsg(e); btn.disabled = false; }
  },
  async forgot() {
    const email = $('#f-mail').value.trim(); const err = $('#f-err');
    if (!email) { err.textContent = 'اكتب بريدك الإلكتروني أولاً'; return; }
    try { await S.be.resetPass(email); toast('أُرسل رابط استعادة كلمة المرور إلى بريدك'); } catch (e) { err.textContent = errMsg(e); }
  },
  newChat() { newChatSheet(); },
  openChat(t) { openChat(t.dataset.uid); },
  back() { if (history.state && history.state.chat) history.back(); else closeChat(); },
  pickImg() { $('#imgIn').click(); },
  sendOrMic() {
    const t = $('#txt'), v = t.value.trim();
    if (!v) return recStart();
    t.value = ''; t.style.height = 'auto'; $('#sendBtn').innerHTML = ic('mic');
    sendMsg({ type: 'text', text: v });
    t.focus();
  },
  recCancel() { recFinish(false); },
  recSend() { recFinish(true); },
  play(t) { togglePlay(t); },
  viewImg(t) {
    const v = document.createElement('div'); v.className = 'viewer';
    v.innerHTML = `<img src="${esc(t.src)}" alt="">`; v.onclick = () => v.remove(); document.body.appendChild(v);
  },
  mode(t) { S.prefs.mode = t.dataset.v; savePrefs(); applyPrefs(); renderSettings(); },
  accent(t) { S.prefs.accent = t.dataset.v; savePrefs(); applyPrefs(); renderSettings(); },
  bg(t) { S.prefs.bg = t.dataset.v; savePrefs(); applyPrefs(); renderSettings(); },
  bgPick() { $('#bgIn').click(); },
  bubble(t) { S.prefs.bubble = t.dataset.v || null; savePrefs(); applyPrefs(); renderSettings(); },
  async saveName() {
    const n = $('#nameIn').value.trim(); if (n.length < 2) return toast('الاسم قصير جداً');
    try { S.user = { ...S.user, ...(await S.be.updateProfile(n)) }; try { localStorage.setItem('tm_me', JSON.stringify(S.user)); } catch { /* */ } toast('تم حفظ الاسم'); renderSettings(); }
    catch (e) { toast(errMsg(e)); }
  },
  async logout() { if (await confirmSheet('تسجيل الخروج من Tweet me؟', 'تسجيل الخروج')) S.be.signOut(); },
  async install() { if (!S.installEv) return; S.installEv.prompt(); await S.installEv.userChoice; S.installEv = null; renderSettings(); }
};

app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act]');
  if (t && actions[t.dataset.act]) actions[t.dataset.act](t, e);
});
app.addEventListener('input', (e) => {
  if (e.target.id === 'txt') {
    const t = e.target; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px';
    $('#sendBtn').innerHTML = t.value.trim() ? ic('send', 'style="transform:scaleX(-1)"') : ic('mic');
  } else if (e.target.id === 'fsR') {
    S.prefs.fs = +e.target.value; $('#fsV').textContent = S.prefs.fs; applyPrefs();
  } else if (e.target.id === 'accCustom') {
    S.prefs.accent = e.target.value; applyPrefs();
  }
});
app.addEventListener('change', async (e) => {
  if (e.target.id === 'fsR' || e.target.id === 'accCustom') { savePrefs(); if (e.target.id === 'accCustom') renderSettings(); }
  else if (e.target.id === 'imgIn' && e.target.files[0]) { const f = e.target.files[0]; e.target.value = ''; sendImage(f); }
  else if (e.target.id === 'bgIn' && e.target.files[0]) {
    const f = e.target.files[0]; e.target.value = '';
    try {
      const b = await shrinkImage(f, 1080, 0.6);
      localStorage.setItem('tm_bgimg', await blobToDataURL(b));
      S.prefs.bg = 'image'; savePrefs(); applyPrefs(); renderSettings();
    } catch { toast('تعذر استخدام الصورة كخلفية'); }
  }
});
app.addEventListener('keydown', (e) => {
  if (e.target.id === 'f-pass' && e.key === 'Enter') actions.authGo();
});
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); S.installEv = e; });
matchMedia('(prefers-color-scheme: light)').addEventListener?.('change', () => { if (S.prefs.mode === 'auto') applyPrefs(); });

/* ============ الإقلاع ============ */
(async function boot() {
  applyPrefs(); render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  try {
    S.be = REAL ? await makeFirebase() : makeLocal();
  } catch (e) {
    app.innerHTML = `<div class="empty" style="margin:auto"><b>تعذر الاتصال بالخدمة</b>تأكد من الإنترنت ثم أعد المحاولة.<br><br><button class="btn" onclick="location.reload()">إعادة المحاولة</button></div>`;
    return;
  }
  S.be.onAuth((u) => {
    S.user = u;
    if (!u) { stopWatch(); S.chat = null; S.chats = []; S.peers = {}; S.view = 'auth'; render(); return; }
    try { localStorage.setItem('tm_me', JSON.stringify(u)); } catch { /* */ }
    startWatch();
    if (S.view !== 'chat') { S.view = 'list'; render(); }
  });
})();
