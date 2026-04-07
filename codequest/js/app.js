// ===== CODEQUEST APP =====
const STORAGE_KEY = 'codequest_progress';

// ---- Storage ----
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch { return defaultProgress(); }
}

function defaultProgress() {
  return { xp: 0, level: 1, streak: 0, lastLogin: null, completedLessons: [], quizScores: {}, completedGames: [], achievements: [], currentTrack: null, dailyGoalDone: false, lastGoalDate: null, totalLessons: 0, totalQuizzes: 0 };
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ---- XP / Level ----
function getLevelName(lvl) { return LEVEL_NAMES[Math.min(lvl - 1, LEVEL_NAMES.length - 1)]; }
function xpNeeded(lvl) { return lvl * lvl * 100; }

function addXP(amount) {
  const p = loadProgress();
  p.xp += amount;
  let leveled = false;
  while (p.xp >= xpNeeded(p.level)) {
    p.xp -= xpNeeded(p.level);
    p.level++;
    leveled = true;
  }
  saveProgress(p);
  updateXPBar();
  if (leveled) showLevelUp(p.level);
  return leveled;
}

function updateXPBar() {
  const p = loadProgress();
  const needed = xpNeeded(p.level);
  const pct = Math.round((p.xp / needed) * 100);
  document.querySelectorAll('.xp-bar-fill').forEach(el => el.style.width = pct + '%');
  document.querySelectorAll('.xp-text').forEach(el => el.textContent = `${p.xp} / ${needed} XP`);
  document.querySelectorAll('.level-text').forEach(el => el.textContent = `Niv. ${p.level} — ${getLevelName(p.level)}`);
}

function showLevelUp(level) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-level';
  toast.innerHTML = `<span>🎉</span><div><strong>Niveau ${level}!</strong><br>${getLevelName(level)}</div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

function showXPGain(amount) {
  const el = document.createElement('div');
  el.className = 'xp-popup';
  el.textContent = `+${amount} XP`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 1800);
}

// ---- Streak ----
function checkStreak() {
  const p = loadProgress();
  const today = new Date().toDateString();
  if (p.lastLogin === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (p.lastLogin === yesterday) { p.streak++; }
  else if (p.lastLogin !== today) { p.streak = 1; }
  p.lastLogin = today;
  saveProgress(p);
  checkAchievement('streak-7', p.streak >= 7);
}

// ---- Achievements ----
function checkAchievement(id, condition) {
  if (!condition) return;
  const p = loadProgress();
  if (p.achievements.includes(id)) return;
  p.achievements.push(id);
  saveProgress(p);
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (ach) showAchievement(ach);
}

function showAchievement(ach) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-achievement';
  toast.innerHTML = `<span>${ach.icon}</span><div><small>Succès débloqué!</small><br><strong>${ach.title}</strong></div>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

// ---- Navigation ----
let currentPage = 'dashboard';
let currentLesson = null;
let currentTrack = null;

function navigate(page, data = {}) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) { pageEl.classList.add('active'); currentPage = page; }
  document.querySelectorAll(`.nav-item[data-page="${page}"]`).forEach(n => n.classList.add('active'));

  if (page === 'dashboard') renderDashboard();
  else if (page === 'learn') renderLearn(data.trackId);
  else if (page === 'lesson') renderLesson(data.lessonId);
  else if (page === 'quiz') renderQuiz(data.lessonId);
  else if (page === 'games') renderGames();
  else if (page === 'game') renderGame(data.gameId);
  else if (page === 'profile') renderProfile();
  window.scrollTo(0, 0);
}

// ---- Dashboard ----
function renderDashboard() {
  const p = loadProgress();
  const needed = xpNeeded(p.level);
  const pct = Math.round((p.xp / needed) * 100);

  // Streak
  document.getElementById('streak-count').textContent = p.streak;

  // XP bar
  document.getElementById('dash-xp-bar').style.width = pct + '%';
  document.getElementById('dash-xp-text').textContent = `${p.xp} / ${needed} XP`;
  document.getElementById('dash-level').textContent = `Niv. ${p.level} — ${getLevelName(p.level)}`;

  // Daily goal
  const today = new Date().toDateString();
  const goalDone = p.dailyGoalDone && p.lastGoalDate === today;
  document.getElementById('daily-goal-status').textContent = goalDone ? '✅ Objectif du jour atteint!' : '🎯 Complète 1 leçon aujourd\'hui';
  document.getElementById('daily-goal-bar').style.width = goalDone ? '100%' : '0%';

  // Continue learning
  const continueEl = document.getElementById('continue-card');
  const next = getNextLesson(p);
  if (next) {
    continueEl.innerHTML = `
      <div class="continue-track">${next.track.icon} ${next.track.title}</div>
      <div class="continue-title">${next.lesson.title}</div>
      <div class="continue-meta">⏱ ${next.lesson.duration} min · ⭐ ${next.lesson.xp} XP</div>
      <button class="btn btn-primary" onclick="navigate('lesson',{lessonId:'${next.lesson.id}'})">Continuer →</button>
    `;
  } else {
    continueEl.innerHTML = `<p class="muted">🎉 Toutes les leçons complétées! Joue aux mini-jeux.</p>`;
  }

  // Track progress overview
  const tracksEl = document.getElementById('dash-tracks');
  tracksEl.innerHTML = TRACKS.map(track => {
    const lessons = LESSONS[track.id] || [];
    const done = lessons.filter(l => p.completedLessons.includes(l.id)).length;
    const pctTrack = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
    return `
      <div class="track-mini" onclick="navigate('learn',{trackId:'${track.id}'})">
        <span class="track-mini-icon">${track.icon}</span>
        <div class="track-mini-info">
          <span>${track.title}</span>
          <div class="mini-bar"><div class="mini-bar-fill" style="width:${pctTrack}%;background:${track.color}"></div></div>
        </div>
        <span class="track-mini-pct">${done}/${lessons.length}</span>
      </div>`;
  }).join('');

  // Recent achievements
  const achEl = document.getElementById('dash-achievements');
  const unlocked = ACHIEVEMENTS.filter(a => p.achievements.includes(a.id));
  if (unlocked.length) {
    achEl.innerHTML = unlocked.slice(-3).map(a => `
      <div class="ach-badge"><span>${a.icon}</span><span>${a.title}</span></div>
    `).join('');
  } else {
    achEl.innerHTML = '<p class="muted">Complète des leçons pour débloquer des succès!</p>';
  }

  // Random games
  const gamesEl = document.getElementById('dash-games');
  const shuffled = [...GAMES].sort(() => Math.random() - 0.5).slice(0, 3);
  gamesEl.innerHTML = shuffled.map(g => `
    <div class="game-mini" onclick="navigate('game',{gameId:'${g.id}'})">
      <span>${g.icon}</span>
      <div>
        <div class="game-mini-title">${g.title}</div>
        <div class="game-mini-meta">${g.difficulty} · +${g.xp} XP</div>
      </div>
    </div>
  `).join('');
}

function getNextLesson(p) {
  for (const track of TRACKS) {
    const lessons = LESSONS[track.id] || [];
    for (const lesson of lessons) {
      if (!p.completedLessons.includes(lesson.id)) return { track, lesson };
    }
  }
  return null;
}

// ---- Learn / Tracks ----
function renderLearn(trackId) {
  const el = document.getElementById('page-learn');
  const p = loadProgress();

  if (!trackId) {
    // Show all tracks
    el.innerHTML = `
      <div class="page-header"><h1>📚 Apprendre</h1><p>Choisis ton parcours</p></div>
      <div class="tracks-grid">
        ${TRACKS.map(track => {
          const lessons = LESSONS[track.id] || [];
          const done = lessons.filter(l => p.completedLessons.includes(l.id)).length;
          const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
          return `
            <div class="track-card" onclick="navigate('learn',{trackId:'${track.id}'})" style="--track-color:${track.color}">
              <div class="track-card-header" style="background:${track.color}22;border-bottom:2px solid ${track.color}">
                <span class="track-icon">${track.icon}</span>
                <span class="track-difficulty">${track.difficulty}</span>
              </div>
              <div class="track-card-body">
                <h3>${track.title}</h3>
                <p>${track.desc}</p>
                <div class="track-tags">${track.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                <div class="progress-row">
                  <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${track.color}"></div></div>
                  <span>${done}/${lessons.length}</span>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  } else {
    // Show lessons in track
    const track = TRACKS.find(t => t.id === trackId);
    if (!track) return navigate('learn');
    const lessons = LESSONS[trackId] || [];
    el.innerHTML = `
      <div class="page-header">
        <button class="btn-back" onclick="navigate('learn')">← Retour</button>
        <h1>${track.icon} ${track.title}</h1>
        <p>${track.desc}</p>
      </div>
      <div class="lessons-list">
        ${lessons.map((lesson, i) => {
          const done = p.completedLessons.includes(lesson.id);
          const locked = i > 0 && !p.completedLessons.includes(lessons[i-1].id);
          return `
            <div class="lesson-row ${done ? 'done' : ''} ${locked ? 'locked' : ''}" onclick="${locked ? '' : `navigate('lesson',{lessonId:'${lesson.id}'})`}">
              <div class="lesson-num">${done ? '✅' : locked ? '🔒' : (i+1)}</div>
              <div class="lesson-info">
                <div class="lesson-title">${lesson.title}</div>
                <div class="lesson-meta">⏱ ${lesson.duration} min · ⭐ ${lesson.xp} XP</div>
              </div>
              ${done ? '<span class="done-badge">Complété</span>' : locked ? '<span class="locked-badge">Verrouillé</span>' : '<span class="start-badge">Commencer →</span>'}
            </div>`;
        }).join('')}
      </div>`;
  }
}

// ---- Lesson ----
function renderLesson(lessonId) {
  const lesson = findLesson(lessonId);
  if (!lesson) return navigate('learn');
  currentLesson = lesson;
  const track = TRACKS.find(t => t.id === lesson.trackId);
  const el = document.getElementById('page-lesson');

  el.innerHTML = `
    <div class="lesson-header" style="border-left:4px solid ${track.color}">
      <button class="btn-back" onclick="navigate('learn',{trackId:'${lesson.trackId}'})">← ${track.title}</button>
      <h1>${lesson.title}</h1>
      <div class="lesson-meta-row">
        <span>⏱ ${lesson.duration} min</span>
        <span>⭐ ${lesson.xp} XP</span>
        <span>${track.icon} ${track.title}</span>
      </div>
    </div>
    <div class="lesson-content">
      ${lesson.content.map(block => renderContentBlock(block)).join('')}
    </div>
    <div class="lesson-footer">
      <button class="btn btn-primary btn-large" onclick="navigate('quiz',{lessonId:'${lessonId}'})">
        Passer au quiz → 
      </button>
    </div>`;

  // Highlight code blocks
  if (window.Prism) Prism.highlightAll();
}

function renderContentBlock(block) {
  switch (block.type) {
    case 'text': return `<p class="lesson-text">${block.text}</p>`;
    case 'heading': return `<h2 class="lesson-heading">${block.text}</h2>`;
    case 'tip': return `<div class="tip-box">💡 ${block.text}</div>`;
    case 'warning': return `<div class="warning-box">⚠️ ${block.text}</div>`;
    case 'code': return `<div class="code-block"><div class="code-header"><span class="code-lang">${block.lang}</span><button class="copy-btn" onclick="copyCode(this)">📋 Copier</button></div><pre><code class="language-${block.lang}">${escapeHtml(block.code)}</code></pre></div>`;
    default: return '';
  }
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function copyCode(btn) {
  const code = btn.closest('.code-block').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✅ Copié!';
    setTimeout(() => btn.textContent = '📋 Copier', 2000);
  });
}

// ---- Quiz ----
let quizState = { lessonId: null, current: 0, answers: [], started: false };

function renderQuiz(lessonId) {
  const lesson = findLesson(lessonId);
  if (!lesson || !lesson.quiz) return navigate('lesson', { lessonId });
  quizState = { lessonId, current: 0, answers: [], started: true };
  showQuestion(lesson, 0);
}

function showQuestion(lesson, idx) {
  const q = lesson.quiz.questions[idx];
  const total = lesson.quiz.questions.length;
  const el = document.getElementById('page-quiz');
  const track = TRACKS.find(t => t.id === lesson.trackId);

  el.innerHTML = `
    <div class="quiz-header">
      <button class="btn-back" onclick="navigate('lesson',{lessonId:'${lesson.id}'})">← Leçon</button>
      <div class="quiz-progress-text">${idx + 1} / ${total}</div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${((idx)/total)*100}%"></div></div>
    </div>
    <div class="quiz-card">
      <div class="quiz-track-label">${track.icon} ${lesson.title}</div>
      <h2 class="quiz-question">${q.q}</h2>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <button class="quiz-opt" onclick="selectAnswer(${i})">
            <span class="opt-letter">${'ABCD'[i]}</span>${opt}
          </button>`).join('')}
      </div>
    </div>`;
}

function selectAnswer(idx) {
  const lesson = findLesson(quizState.lessonId);
  const q = lesson.quiz.questions[quizState.current];
  quizState.answers.push(idx);
  const correct = idx === q.correct;
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((opt, i) => {
    opt.disabled = true;
    if (i === q.correct) opt.classList.add('correct');
    else if (i === idx) opt.classList.add('wrong');
  });

  const el = document.getElementById('page-quiz');
  const expDiv = document.createElement('div');
  expDiv.className = `quiz-explanation ${correct ? 'correct' : 'wrong'}`;
  expDiv.innerHTML = `${correct ? '✅ Correct!' : '❌ Incorrect'} — ${q.explanation}`;
  el.querySelector('.quiz-card').appendChild(expDiv);

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary';
  nextBtn.textContent = quizState.current + 1 < lesson.quiz.questions.length ? 'Question suivante →' : 'Voir les résultats';
  nextBtn.style.marginTop = '16px';
  nextBtn.onclick = () => {
    quizState.current++;
    if (quizState.current < lesson.quiz.questions.length) showQuestion(lesson, quizState.current);
    else showQuizResults(lesson);
  };
  el.querySelector('.quiz-card').appendChild(nextBtn);
}

function showQuizResults(lesson) {
  const correct = quizState.answers.filter((a, i) => a === lesson.quiz.questions[i].correct).length;
  const total = lesson.quiz.questions.length;
  const score = Math.round((correct / total) * 100);
  const stars = score >= 100 ? 3 : score >= 60 ? 2 : 1;
  const p = loadProgress();

  // Save best score
  const prev = p.quizScores[lesson.quiz.id] || 0;
  if (score > prev) { p.quizScores[lesson.quiz.id] = score; }

  // Mark lesson completed (first time)
  const firstTime = !p.completedLessons.includes(lesson.id);
  if (firstTime && score >= 60) {
    p.completedLessons.push(lesson.id);
    p.totalLessons = (p.totalLessons || 0) + 1;
    const today = new Date().toDateString();
    p.dailyGoalDone = true;
    p.lastGoalDate = today;
  }
  saveProgress(p);

  // XP reward
  let xpGain = 0;
  if (firstTime && score >= 60) {
    xpGain = Math.round(lesson.xp * (score / 100));
    addXP(xpGain);
  }

  // Check achievements
  const track = TRACKS.find(t => t.id === lesson.trackId);
  const trackLessons = LESSONS[lesson.trackId] || [];
  const freshP = loadProgress();
  checkAchievement('first-lesson', freshP.completedLessons.length >= 1);
  checkAchievement('quiz-perfect', score === 100);
  checkAchievement('night-owl', freshP.completedLessons.length >= 1);
  checkAchievement('first-track', trackLessons.every(l => freshP.completedLessons.includes(l.id)));
  checkAchievement('level-5', freshP.level >= 5);

  const el = document.getElementById('page-quiz');
  el.innerHTML = `
    <div class="results-page">
      <div class="stars-row">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
      <h2 class="results-score">${score}%</h2>
      <p>${correct}/${total} bonnes réponses</p>
      ${xpGain > 0 ? `<div class="xp-gain-badge">+${xpGain} XP</div>` : ''}
      ${score < 60 ? '<p class="retry-msg">Il faut 60% pour valider la leçon. Réessaie!</p>' : '<p class="success-msg">✅ Leçon complétée!</p>'}
      <div class="results-review">
        ${lesson.quiz.questions.map((q, i) => {
          const ans = quizState.answers[i];
          const ok = ans === q.correct;
          return `<div class="review-item ${ok ? 'ok' : 'nok'}">
            ${ok ? '✅' : '❌'} ${q.q}<br>
            <small>${ok ? 'Correct' : `Réponse: ${q.opts[q.correct]}`}</small>
          </div>`;
        }).join('')}
      </div>
      <div class="results-btns">
        ${score < 60 ? `<button class="btn btn-primary" onclick="navigate('quiz',{lessonId:'${lesson.id}'})">Réessayer</button>` : ''}
        <button class="btn ${score >= 60 ? 'btn-primary' : 'btn-secondary'}" onclick="navigate('learn',{trackId:'${lesson.trackId}'})">
          ${score >= 60 ? 'Leçon suivante →' : 'Retour'}
        </button>
      </div>
    </div>`;

  if (xpGain > 0) setTimeout(() => showXPGain(xpGain), 500);
}

// ---- Games ----
function renderGames() {
  const p = loadProgress();
  const el = document.getElementById('page-games');
  const types = [
    { key: 'bug-hunt', label: '🔍 Bug Hunt', desc: 'Trouve la ligne avec l\'erreur' },
    { key: 'fill-blank', label: '✏️ Fill in the Blank', desc: 'Complète le code manquant' },
    { key: 'arrange', label: '🔀 Code Arrange', desc: 'Remets les lignes dans l\'ordre' }
  ];
  el.innerHTML = `
    <div class="page-header"><h1>🎮 Mini-Jeux</h1><p>Apprends en jouant!</p></div>
    ${types.map(type => `
      <div class="game-section">
        <h2>${type.label}</h2>
        <p class="muted">${type.desc}</p>
        <div class="games-grid">
          ${GAMES.filter(g => g.type === type.key).map(g => {
            const done = p.completedGames.includes(g.id);
            return `
              <div class="game-card ${done ? 'done' : ''}" onclick="navigate('game',{gameId:'${g.id}'})">
                <div class="game-card-icon">${g.icon}</div>
                <div class="game-card-title">${g.title}</div>
                <div class="game-card-meta">${g.difficulty} · +${g.xp} XP</div>
                ${done ? '<div class="game-done-badge">✅ Complété</div>' : ''}
              </div>`;
          }).join('')}
        </div>
      </div>`).join('')}`;
}

// ---- Profile ----
function renderProfile() {
  const p = loadProgress();
  const needed = xpNeeded(p.level);
  const pct = Math.round((p.xp / needed) * 100);
  const totalXP = LEVELS_XP_TOTAL(p.level) + p.xp;
  const el = document.getElementById('page-profile');

  el.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar">${getLevelName(p.level)[0]}</div>
      <h2>${getLevelName(p.level)}</h2>
      <div class="profile-level">Niveau ${p.level}</div>
    </div>
    <div class="profile-xp-section">
      <div class="xp-label">XP vers niveau ${p.level + 1}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="xp-values">${p.xp} / ${needed} XP</div>
      <div class="total-xp">Total: ${totalXP} XP</div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-val">🔥 ${p.streak}</div><div class="stat-label">Jours de suite</div></div>
      <div class="stat-card"><div class="stat-val">📚 ${p.completedLessons.length}</div><div class="stat-label">Leçons complétées</div></div>
      <div class="stat-card"><div class="stat-val">🎮 ${p.completedGames.length}</div><div class="stat-label">Jeux complétés</div></div>
      <div class="stat-card"><div class="stat-val">🏆 ${p.achievements.length}</div><div class="stat-label">Succès débloqués</div></div>
    </div>
    <div class="achievements-section">
      <h2>Succès</h2>
      <div class="achievements-grid">
        ${ACHIEVEMENTS.map(a => {
          const unlocked = p.achievements.includes(a.id);
          return `
            <div class="ach-card ${unlocked ? 'unlocked' : 'locked'}">
              <div class="ach-icon">${a.icon}</div>
              <div class="ach-title">${a.title}</div>
              <div class="ach-desc">${a.desc}</div>
              ${unlocked ? '<div class="ach-unlocked">Débloqué ✅</div>' : '<div class="ach-locked">🔒 Verrouillé</div>'}
            </div>`;
        }).join('')}
      </div>
    </div>
    <div class="reset-section">
      <button class="btn btn-danger" onclick="confirmReset()">🗑️ Réinitialiser la progression</button>
    </div>`;
}

function LEVELS_XP_TOTAL(lvl) {
  let total = 0;
  for (let i = 1; i < lvl; i++) total += xpNeeded(i);
  return total;
}

function confirmReset() {
  if (confirm('⚠️ Réinitialiser toute ta progression? Cette action est irréversible.')) {
    localStorage.removeItem(STORAGE_KEY);
    navigate('dashboard');
  }
}

// ---- Helpers ----
function findLesson(id) {
  for (const track of Object.values(LESSONS)) {
    const found = track.find(l => l.id === id);
    if (found) return found;
  }
  return null;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  checkStreak();

  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page) navigate(page);
    });
  });

  navigate('dashboard');
});
