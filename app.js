/* ═══════════════════════════════════════════════
   SALATI — Islamic Prayer App — Main Logic
   ═══════════════════════════════════════════════ */

'use strict';

// ── Constants ──────────────────────────────────

const PRAYER_META = {
  Fajr:    { icon: '🌙', nameFr: 'Fajr',    nameAr: 'الفجر',   desc: 'Aube' },
  Sunrise: { icon: '🌅', nameFr: 'Lever',   nameAr: 'الشروق',  desc: 'Lever du soleil' },
  Dhuhr:   { icon: '☀️',  nameFr: 'Dhuhr',   nameAr: 'الظهر',   desc: 'Midi' },
  Asr:     { icon: '🌤️',  nameFr: 'Asr',     nameAr: 'العصر',   desc: 'Après-midi' },
  Maghrib: { icon: '🌇', nameFr: 'Maghrib', nameAr: 'المغرب',  desc: 'Coucher du soleil' },
  Isha:    { icon: '🌌', nameFr: 'Isha',    nameAr: 'العشاء',  desc: 'Nuit' },
};

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Sourates recommandées par prière
const PRAYER_SURAHS = {
  fajr: [
    { num: 1,   nameFr: 'Al-Fatiha',  nameAr: 'الفاتحة',  desc: 'L\'Ouverture — récitée dans chaque rakʿa' },
    { num: 112, nameFr: 'Al-Ikhlas',  nameAr: 'الإخلاص',  desc: 'La Pureté — l\'unicité d\'Allah' },
    { num: 113, nameFr: 'Al-Falaq',   nameAr: 'الفلق',    desc: 'L\'Aube — protection contre le mal' },
    { num: 114, nameFr: 'An-Nas',     nameAr: 'الناس',    desc: 'Les Hommes — protection contre les souffles' },
  ],
  dhuhr: [
    { num: 1,   nameFr: 'Al-Fatiha',  nameAr: 'الفاتحة',  desc: 'L\'Ouverture' },
    { num: 87,  nameFr: 'Al-Aʿlā',   nameAr: 'الأعلى',   desc: 'Le Très-Haut — gloire à Ton Seigneur' },
    { num: 88,  nameFr: 'Al-Ghāshiya',nameAr: 'الغاشية',  desc: 'L\'Enveloppante' },
    { num: 109, nameFr: 'Al-Kāfirūn', nameAr: 'الكافرون', desc: 'Les Incrédules' },
  ],
  asr: [
    { num: 1,   nameFr: 'Al-Fatiha',  nameAr: 'الفاتحة',  desc: 'L\'Ouverture' },
    { num: 103, nameFr: 'Al-ʿAsr',    nameAr: 'العصر',    desc: 'L\'Après-midi — le temps est précieux' },
    { num: 95,  nameFr: 'At-Tīn',     nameAr: 'التين',    desc: 'Le Figuier' },
  ],
  maghrib: [
    { num: 1,   nameFr: 'Al-Fatiha',  nameAr: 'الفاتحة',  desc: 'L\'Ouverture' },
    { num: 109, nameFr: 'Al-Kāfirūn', nameAr: 'الكافرون', desc: 'Les Incrédules' },
    { num: 112, nameFr: 'Al-Ikhlas',  nameAr: 'الإخلاص',  desc: 'La Pureté — sunnah du Prophète ﷺ' },
    { num: 113, nameFr: 'Al-Falaq',   nameAr: 'الفلق',    desc: 'L\'Aube' },
    { num: 114, nameFr: 'An-Nas',     nameAr: 'الناس',    desc: 'Les Hommes' },
  ],
  isha: [
    { num: 1,   nameFr: 'Al-Fatiha',  nameAr: 'الفاتحة',  desc: 'L\'Ouverture' },
    { num: 32,  nameFr: 'As-Sajda',   nameAr: 'السجدة',   desc: 'La Prosternation — sunnah Isha' },
    { num: 67,  nameFr: 'Al-Mulk',    nameAr: 'الملك',    desc: 'La Royauté — protection dans la tombe' },
    { num: 36,  nameFr: 'Yā-Sīn',    nameAr: 'يس',       desc: 'Cœur du Coran' },
  ],
};

// Noms français de toutes les sourates (1–114)
const SURAH_NAMES_FR = [
  '', // index 0 (unused)
  "L'Ouverture", "La Vache", "La Famille d'Imrân", "Les Femmes", "La Table Servie",
  "Les Troupeaux", "Le Rempart", "Le Butin", "Le Repentir", "Jonas",
  "Hûd", "Joseph", "Le Tonnerre", "Ibrâhîm", "Al-Hijr",
  "Les Abeilles", "Le Voyage Nocturne", "La Caverne", "Marie", "Tâhâ",
  "Les Prophètes", "Le Pèlerinage", "Les Croyants", "La Lumière", "Le Discernement",
  "Les Poètes", "Les Fourmis", "Le Récit", "L'Araignée", "Les Romains",
  "Luqmân", "La Prosternation", "Les Coalisés", "Sabaâ", "Le Créateur",
  "Yâ-Sîn", "Ceux qui se rangent en rangs", "Sâd", "Les Groupes", "Le Pardonneur",
  "Fussilat", "La Consultation", "Az-Zukhruf", "La Fumée", "L'Agenouillée",
  "Al-Ahqâf", "Muhammad", "La Victoire", "Les Appartements", "Qâf",
  "Les Vents épars", "At-Tûr", "L'Étoile", "La Lune", "Le Miséricordieux",
  "L'Inévitable", "Le Fer", "La Controverse", "Le Rassemblement", "La Femme examinée",
  "Les Rangs", "Le Vendredi", "Les Hypocrites", "La Déception", "Le Divorce",
  "L'Interdiction", "La Royauté", "Le Calame", "L'Inévitable", "Les Degrés",
  "Noé", "Les Djinns", "L'Enveloppé", "Le Revêtu", "La Résurrection",
  "L'Homme", "Les Envoyés", "La Nouvelle", "Ceux qui arrachent", "Il s'est renfrogné",
  "L'Obscurcissement", "L'Infraction", "Le Déchirement", "Le Zodiaque", "Le Nocturne",
  "Le Très-Haut", "L'Enveloppante", "L'Aube", "La Cité", "Le Soleil",
  "La Nuit", "La Clarté matinale", "La Sérénité", "Le Figuier", "Le Caillot",
  "La Destinée", "La Preuve", "Le Tremblement", "Les Coureurs", "Le Heurtoir",
  "La Rivalité", "L'Après-midi", "Le Calomniateur", "L'Éléphant", "Quraysh",
  "L'Ustensile", "L'Abondance", "Les Incrédules", "L'Aide", "La Fibre",
  "La Pureté", "L'Aube naissante", "Les Hommes",
];

const SURAH_NAMES_AR = [
  '', 'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس',
  'هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه',
  'الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم',
  'لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر',
  'فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق',
  'الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
  'الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج',
  'نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس',
  'التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد',
  'الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات',
  'القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر',
  'المسد','الإخلاص','الفلق','الناس',
];

// ── State ──────────────────────────────────────

const state = {
  prayerTimes: null,
  location: null,
  cityName: '',
  currentPrayer: '',
  notificationsEnabled: false,
  countdownInterval: null,
  notifCheckInterval: null,
  surahsCache: {},
};

// ── DOM helpers ───────────────────────────────

const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
};

// ── Toast ─────────────────────────────────────

function showToast(msg, duration = 3000) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── Navigation ────────────────────────────────

function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      $(target).classList.add('active');
      window.scrollTo(0, 0);
    });
  });
}

// Helper to switch to a nav section programmatically
function navigateTo(section) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-section="${section}"]`);
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(section);
  if (sec) sec.classList.add('active');
  window.scrollTo(0, 0);
}

// ── Geolocation ───────────────────────────────

function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Géolocalisation non supportée'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      enableHighAccuracy: true,
    });
  });
}

async function getCityName(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Votre ville';
  } catch {
    return 'Votre localisation';
  }
}

// ── Prayer Times API ──────────────────────────

function getPrayerMethod() {
  return localStorage.getItem('prayerMethod') || '12';
}

async function fetchPrayerTimes(lat, lon) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;
  const method = getPrayerMethod();

  const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur API horaires');
  const json = await res.json();
  return json.data.timings;
}

// ── Mosque finder ─────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function loadMosques() {
  const list = document.getElementById('mosqueList');
  if (!list) return;
  list.innerHTML = '<div class="loading-spinner"></div>';

  const locEl = document.getElementById('mosqueesLocation');

  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
    );
    const { latitude: lat, longitude: lon } = pos.coords;

    if (locEl) locEl.textContent = 'Recherche en cours…';

    // Search with increasing radius until we find results
    let mosques = [];
    for (const radius of [5000, 15000, 50000, 100000]) {
      const query = `[out:json][timeout:30];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon}););out body center;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();

      mosques = data.elements.map(el => {
        const mLat = el.lat ?? el.center?.lat;
        const mLon = el.lon ?? el.center?.lon;
        const dist = haversineKm(lat, lon, mLat, mLon);
        return { name: el.tags?.name || el.tags?.['name:fr'] || 'Mosquée', dist, lat: mLat, lon: mLon };
      }).filter(m => m.lat).sort((a, b) => a.dist - b.dist);

      if (mosques.length > 0) break;
    }

    if (locEl) locEl.textContent = `${mosques.length} mosquée(s) trouvée(s) près de vous`;

    if (!mosques.length) {
      list.innerHTML = '<p class="admin-empty">Aucune mosquée trouvée autour de vous.</p>';
      return;
    }

    list.innerHTML = mosques.map(m => `
      <div class="mosque-card">
        <div class="mosque-info">
          <div class="mosque-name">🕌 ${escHtml(m.name)}</div>
          <div class="mosque-dist">${m.dist < 1 ? Math.round(m.dist*1000)+' m' : m.dist.toFixed(1)+' km'}</div>
        </div>
        <a class="mosque-link" href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lon}" target="_blank" rel="noopener">Itinéraire 🗺️</a>
      </div>`).join('');
  } catch (e) {
    list.innerHTML = '<p class="admin-error">Impossible d\'accéder à votre position.</p>';
  }
}

// ── Time helpers ──────────────────────────────

function parseTime(str) {
  // "HH:MM" → Date today
  const [h, m] = str.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function formatTime(str) {
  // "HH:MM" → "HH:MM"
  return str.substring(0, 5);
}

function timeUntil(prayerDate) {
  const diff = prayerDate - new Date();
  if (diff <= 0) return null;
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `dans ${h}h ${String(m).padStart(2,'0')}min`;
  if (m > 0) return `dans ${m} min ${String(s).padStart(2,'0')}s`;
  return `dans ${s}s`;
}

function getCurrentPrayer(timings) {
  const now = new Date();
  let current = 'Isha';
  for (let i = PRAYER_KEYS.length - 1; i >= 0; i--) {
    const key = PRAYER_KEYS[i];
    if (now >= parseTime(timings[key])) {
      current = key;
      break;
    }
  }
  return current;
}

function getNextPrayer(timings) {
  const now = new Date();
  for (const key of PRAYER_KEYS) {
    const t = parseTime(timings[key]);
    if (t > now) return { name: key, time: timings[key], date: t };
  }
  // Tomorrow's Fajr (approximate)
  const fajrTomorrow = parseTime(timings.Fajr);
  fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
  return { name: 'Fajr', time: timings.Fajr, date: fajrTomorrow };
}

// ── Render Accueil ────────────────────────────

function renderAccueil() {
  const { prayerTimes: t, cityName } = state;
  if (!t) return;

  $('heroLocation').textContent = `📍 ${cityName}`;

  const next = getNextPrayer(t);
  const meta = PRAYER_META[next.name];
  $('nextPrayerName').textContent = `${meta.icon} ${meta.nameFr} — ${meta.nameAr}`;
  $('nextPrayerTime').textContent = formatTime(next.time);

  const current = getCurrentPrayer(t);
  state.currentPrayer = current;

  // Countdown
  clearInterval(state.countdownInterval);
  state.countdownInterval = setInterval(() => {
    const cd = timeUntil(next.date);
    $('nextCountdown').textContent = cd || 'C\'est maintenant !';
  }, 1000);

  // Today's prayers row
  const container = $('todayPrayers');
  container.innerHTML = '';
  const now = new Date();

  PRAYER_KEYS.forEach(key => {
    const pDate = parseTime(t[key]);
    const m = PRAYER_META[key];
    const div = el('div', 'today-prayer-item');
    if (key === current) div.classList.add('current');
    else if (pDate < now) div.classList.add('passed');
    div.innerHTML = `<div class="tp-name">${m.nameFr}</div><div class="tp-time">${formatTime(t[key])}</div>`;
    container.appendChild(div);
  });
}

// ── Render Horaires ───────────────────────────

function renderHoraires() {
  const { prayerTimes: t, cityName } = state;

  $('horairesLocation').textContent = cityName;

  const now = new Date();
  const days = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const months = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  $('horairesDate').textContent = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  if (!t) return;

  const current = getCurrentPrayer(t);
  const list = $('prayerList');
  list.innerHTML = '';

  const allKeys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  allKeys.forEach(key => {
    const meta = PRAYER_META[key];
    const pDate = parseTime(t[key]);
    const isCurrent = key === current;
    const isPassed = pDate < now && !isCurrent;

    const item = el('div', `prayer-item${isCurrent ? ' current' : ''}${isPassed ? ' passed' : ''}`);
    item.innerHTML = `
      <div class="pi-icon">${meta.icon}</div>
      <div class="pi-info">
        <div class="pi-name">${meta.nameFr}</div>
        <div class="pi-arabic amiri">${meta.nameAr}</div>
        <div style="font-size:.78rem;color:var(--text-muted);margin-top:.15rem">${meta.desc}</div>
      </div>
      <div class="pi-time">${formatTime(t[key])}</div>
      ${isCurrent ? '<div class="pi-badge">En cours</div>' : ''}
    `;
    list.appendChild(item);
  });
}

// ── Render Sourates ───────────────────────────

function renderSourates(prayer = 'fajr') {
  const surahs = PRAYER_SURAHS[prayer];
  const grid = $('suratasGrid');
  grid.innerHTML = '';

  surahs.forEach(s => {
    const card = el('div', 'surata-card');
    card.innerHTML = `
      <div class="sc-number">${s.num}</div>
      <div class="sc-name-fr">${s.nameFr}</div>
      <div class="sc-name-ar amiri">${s.nameAr}</div>
      <div class="sc-desc">${s.desc}</div>
    `;
    card.addEventListener('click', () => openSurataReader(s.num, s.nameFr, s.nameAr));
    grid.appendChild(card);
  });
}

async function openSurataReader(num, nameFr, nameAr) {
  const reader = $('surataReader');
  const grid = $('suratasGrid');

  $('readerNameFr').textContent = nameFr;
  $('readerNameAr').textContent = nameAr;
  $('readerContent').innerHTML = '<div class="loading-spinner"></div>';

  document.querySelector('.prayer-tabs').style.display = 'none';
  grid.style.display = 'none';
  reader.style.display = 'block';
  window.scrollTo(0, 0);

  const ayahs = await fetchSurah(num);
  renderAyahs($('readerContent'), ayahs, num);
}

// ── Render Coran ──────────────────────────────

function renderCoranList(filter = '') {
  const list = $('surahList');
  list.innerHTML = '';
  const lf = filter.toLowerCase();

  for (let i = 1; i <= 114; i++) {
    const nameFr = SURAH_NAMES_FR[i];
    const nameAr = SURAH_NAMES_AR[i];
    if (lf && !nameFr.toLowerCase().includes(lf) && !nameAr.includes(filter)) continue;

    const card = el('div', 'surah-card');
    card.innerHTML = `
      <div class="sh-num">${i}</div>
      <div class="sh-info">
        <div class="sh-name-fr">${nameFr}</div>
        <div class="sh-meta">Sourate ${i}</div>
      </div>
      <div class="sh-name-ar amiri">${nameAr}</div>
    `;
    card.addEventListener('click', () => openQuranReader(i));
    list.appendChild(card);
  }
}

async function openQuranReader(num) {
  const reader = $('quranReader');
  const list = $('surahList');
  const search = document.querySelector('.quran-search');

  $('quranSurahNameFr').textContent = SURAH_NAMES_FR[num];
  $('quranSurahNameAr').textContent = SURAH_NAMES_AR[num];
  $('ayahContainer').innerHTML = '<div class="loading-spinner"></div>';

  search.style.display = 'none';
  list.style.display = 'none';
  reader.style.display = 'block';
  window.scrollTo(0, 0);

  const ayahs = await fetchSurah(num);
  const container = $('ayahContainer');
  container.innerHTML = '';

  // Basmala (all surahs except 1 and 9)
  if (num !== 1 && num !== 9) {
    const basmala = el('div', 'surah-basmala amiri', 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ');
    container.appendChild(basmala);
  }

  renderAyahs(container, ayahs, num);
}

// ── Fetch Surah ───────────────────────────────

async function fetchSurah(num) {
  if (state.surahsCache[num]) return state.surahsCache[num];

  try {
    // Fetch Arabic + French translation in one call
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,fr.hamidullah`
    );
    if (!res.ok) throw new Error('Erreur API Coran');
    const json = await res.json();

    const arabic = json.data[0].ayahs;
    const french = json.data[1].ayahs;

    const combined = arabic.map((a, i) => ({
      number: a.numberInSurah,
      arabic: a.text,
      french: french[i].text,
    }));

    state.surahsCache[num] = combined;
    return combined;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function renderAyahs(container, ayahs, surahNum) {
  if (!ayahs.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">Impossible de charger les versets.</p>';
    return;
  }
  ayahs.forEach(a => {
    const item = el('div', 'ayah-item');
    item.innerHTML = `
      <span class="ayah-number">${a.number}</span>
      <div class="ayah-arabic amiri">${a.arabic}</div>
      <div class="ayah-french">${a.french}</div>
    `;
    container.appendChild(item);
  });
}

// ── Notifications ─────────────────────────────

async function requestNotifications() {
  if (!('Notification' in window)) {
    showToast('Les notifications ne sont pas supportées par votre navigateur.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    state.notificationsEnabled = true;
    $('notifBtn').classList.add('active');
    $('notifBtn').title = 'Notifications activées';
    showToast('✅ Notifications activées ! Vous serez alerté à chaque prière.');
    startNotificationChecker();
    // Save preference
    localStorage.setItem('notifEnabled', '1');
  } else {
    showToast('Notifications refusées. Vous pouvez les activer dans les paramètres du navigateur.');
  }
}

function startNotificationChecker() {
  clearInterval(state.notifCheckInterval);
  state.notifCheckInterval = setInterval(checkPrayerNotification, 30000); // every 30s
  checkPrayerNotification(); // immediate check
}

function checkPrayerNotification() {
  if (!state.prayerTimes || !state.notificationsEnabled) return;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  PRAYER_KEYS.forEach(key => {
    const [h, m] = state.prayerTimes[key].split(':').map(Number);
    const pMin = h * 60 + m;

    // Notify within 1 minute of prayer time
    if (Math.abs(pMin - nowMin) <= 1) {
      const meta = PRAYER_META[key];
      const lastNotifKey = `lastNotif_${key}_${now.toDateString()}`;
      if (!localStorage.getItem(lastNotifKey)) {
        localStorage.setItem(lastNotifKey, '1');
        sendPrayerNotification(meta, formatTime(state.prayerTimes[key]));
      }
    }
  });
}

function sendPrayerNotification(meta, time) {
  if (Notification.permission !== 'granted') return;

  const n = new Notification(`${meta.icon} Heure de la prière — ${meta.nameFr}`, {
    body: `${meta.nameAr} — Il est ${time}. Que la prière soit agréée.`,
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☽</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">☽</text></svg>',
    vibrate: [200, 100, 200],
    tag: `prayer-${meta.nameFr}`,
    renotify: false,
  });

  n.onclick = () => {
    window.focus();
    n.close();
    // Navigate to horaires
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-section="horaires"]').classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    $('horaires').classList.add('active');
  };
}

// ── Main init ─────────────────────────────────

async function init() {
  initNav();

  // Notification button
  $('notifBtn').addEventListener('click', requestNotifications);

  // Restore notification pref
  if (localStorage.getItem('notifEnabled') === '1' && Notification.permission === 'granted') {
    state.notificationsEnabled = true;
    $('notifBtn').classList.add('active');
    startNotificationChecker();
  }

  // Refresh button
  $('refreshBtn').addEventListener('click', () => loadPrayerTimes());

  // Prayer method selector
  const methodSelect = document.getElementById('methodSelect');
  if (methodSelect) {
    methodSelect.value = getPrayerMethod();
    methodSelect.addEventListener('change', () => {
      localStorage.setItem('prayerMethod', methodSelect.value);
      loadPrayerTimes();
      showToast('✅ Méthode mise à jour');
    });
  }

  // Load mosquées when section is shown
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.section === 'mosquees') {
      btn.addEventListener('click', () => {
        if (!document.getElementById('mosqueList').querySelector('.mosque-card')) loadMosques();
      });
    }
  });

  // Sourates tabs
  document.querySelectorAll('.ptab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSourates(btn.dataset.prayer);
    });
  });

  // Back buttons
  $('backBtn').addEventListener('click', () => {
    $('surataReader').style.display = 'none';
    $('suratasGrid').style.display = 'grid';
    document.querySelector('.prayer-tabs').style.display = 'flex';
  });

  $('quranBackBtn').addEventListener('click', () => {
    $('quranReader').style.display = 'none';
    $('surahList').style.display = 'grid';
    document.querySelector('.quran-search').style.display = 'block';
  });

  // Quran search
  $('surahSearch').addEventListener('input', e => {
    renderCoranList(e.target.value.trim());
  });

  // Initial renders
  renderSourates('fajr');
  renderCoranList();
  renderHoraires(); // will show placeholder date

  // Load prayer times
  await loadPrayerTimes();
}

async function loadPrayerTimes() {
  $('prayerList').innerHTML = '<div class="loading-spinner"></div>';
  $('todayPrayers').innerHTML = '<div class="loading-spinner"></div>';

  try {
    const pos = await getLocation();
    const { latitude: lat, longitude: lon } = pos.coords;
    state.location = { lat, lon };

    const [timings, city] = await Promise.all([
      fetchPrayerTimes(lat, lon),
      getCityName(lat, lon),
    ]);

    state.prayerTimes = timings;
    state.cityName = city;

    renderAccueil();
    renderHoraires();
    syncPrayersToSW(timings);

    // Re-start notification checker now that we have times
    if (state.notificationsEnabled) startNotificationChecker();

  } catch (err) {
    console.error(err);
    // Fallback: Paris
    try {
      const timings = await fetchPrayerTimes(48.8566, 2.3522);
      state.prayerTimes = timings;
      state.cityName = 'Paris (par défaut)';
      renderAccueil();
      renderHoraires();
      syncPrayersToSW(timings);
      showToast('📍 Localisation refusée — horaires de Paris affichés par défaut.');
    } catch {
      $('prayerList').innerHTML = '<p style="text-align:center;padding:2rem;color:var(--text-muted)">Impossible de charger les horaires. Vérifiez votre connexion.</p>';
    }
  }
}

// ── Service Worker registration ───────────────

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(err => {
    console.warn('SW registration failed:', err);
  });
}

// Send prayer times to SW for background notifications
function syncPrayersToSW(timings) {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    const prayers = PRAYER_KEYS.map(key => ({
      name: PRAYER_META[key].nameFr,
      nameAr: PRAYER_META[key].nameAr,
      icon: PRAYER_META[key].icon,
      timeISO: parseTime(timings[key]).toISOString(),
    }));
    reg.active?.postMessage({ type: 'SCHEDULE_PRAYERS', prayers });
  });
}

// ── Start ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();

  // Hamburger menu toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');
  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', e => {
      e.stopPropagation();
      mainNav.classList.toggle('open');
    });
    document.addEventListener('click', () => mainNav.classList.remove('open'));
    mainNav.addEventListener('click', () => mainNav.classList.remove('open'));
  }

  // Bind auth forms immediately (before session check)
  bindAuthForms();
  bindTokenModal();

  // Hook auth callbacks — app boots only after successful login
  onLogin(async () => {
    await init();
    // Admin section — nav button + dropdown button (mobile)
    const openAdmin = () => {
      navigateTo('admin');
      loadAdminPanel();
      renderTokenPanel();
      initAdminSearch();
      bindGenerateToken();
    };
    const adminNavBtn = document.querySelector('.nav-btn[data-section="admin"]');
    if (adminNavBtn) adminNavBtn.addEventListener('click', openAdmin);
    const adminMenuBtn = document.getElementById('adminMenuBtn');
    if (adminMenuBtn) adminMenuBtn.addEventListener('click', () => {
      document.getElementById('userDropdown')?.classList.remove('show');
      openAdmin();
    });
  });

  onLogout(() => {
    // Clear countdown and notif intervals when logged out
    clearInterval(state.countdownInterval);
    clearInterval(state.notifCheckInterval);
  });

  // Start auth (will show overlay if not logged in)
  initAuth();
});
