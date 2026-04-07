// ===== CODEQUEST GAMES =====

function renderGame(gameId) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return navigate('games');
  const el = document.getElementById('page-game');
  el.innerHTML = `
    <div class="game-page-header">
      <button class="btn-back" onclick="navigate('games')">← Jeux</button>
      <h1>${game.icon} ${game.title}</h1>
      <p>${game.desc}</p>
      <div class="game-meta-row"><span>${game.difficulty}</span><span>+${game.xp} XP</span></div>
    </div>
    <div id="game-container"></div>`;

  if (game.type === 'bug-hunt') renderBugHunt(game);
  else if (game.type === 'fill-blank') renderFillBlank(game);
  else if (game.type === 'arrange') renderArrange(game);
}

// ===== BUG HUNT =====
function renderBugHunt(game) {
  const container = document.getElementById('game-container');
  container.innerHTML = `
    <div class="bug-hunt">
      <p class="game-instruction">🖱️ Clique sur la ligne qui contient le bug!</p>
      <div class="code-lines" id="bug-lines">
        ${game.code.map((line, i) => `
          <div class="code-line" data-index="${i}" onclick="selectBugLine(${i}, ${game.bugLine})">
            <span class="line-num">${i + 1}</span>
            <span class="line-code">${escapeHtmlGame(line) || '&nbsp;'}</span>
          </div>`).join('')}
      </div>
      <div id="bug-feedback" class="game-feedback hidden"></div>
    </div>`;
}

function selectBugLine(clicked, correct) {
  const lines = document.querySelectorAll('.code-line');
  lines.forEach(l => l.onclick = null); // Disable further clicks
  const feedback = document.getElementById('bug-feedback');
  const game = GAMES.find(g => g.bugLine !== undefined && g.code);

  if (clicked === correct) {
    lines[clicked].classList.add('bug-correct');
    feedback.innerHTML = `✅ Bravo! Tu as trouvé le bug!<br><em>${getCurrentGame().bugExplanation}</em>`;
    feedback.className = 'game-feedback success';
    completeGame(getCurrentGameId());
  } else {
    lines[clicked].classList.add('bug-wrong');
    lines[correct].classList.add('bug-correct');
    feedback.innerHTML = `❌ Ce n'est pas ça. Le bug était à la ligne ${correct + 1}.<br><em>${getCurrentGame().bugExplanation}</em>`;
    feedback.className = 'game-feedback error';
  }
  feedback.classList.remove('hidden');
  showPlayAgainBtn();
}

// ===== FILL IN THE BLANK =====
function renderFillBlank(game) {
  const container = document.getElementById('game-container');
  let blankIdx = 0;
  const htmlCode = escapeHtmlGame(game.template).replace(/_{3,}/g, () => {
    const i = blankIdx++;
    return `<input class="code-input" data-index="${i}" placeholder="?" size="8" />`;
  });

  container.innerHTML = `
    <div class="fill-blank">
      <p class="game-instruction">✏️ Remplis les blancs pour compléter le code!</p>
      ${game.hints ? `<div class="hints"><strong>Indices:</strong> ${game.hints.map((h,i) => `<span class="hint">${i+1}. ${h}</span>`).join('')}</div>` : ''}
      <pre class="fill-code">${htmlCode}</pre>
      <button class="btn btn-primary" onclick="checkFillBlank()">Vérifier ✓</button>
      <div id="fill-feedback" class="game-feedback hidden"></div>
    </div>`;
}

function checkFillBlank() {
  const game = getCurrentGame();
  const inputs = document.querySelectorAll('.code-input');
  let allCorrect = true;
  inputs.forEach((inp, i) => {
    const expected = game.blanks[i].toLowerCase().trim();
    const given = inp.value.toLowerCase().trim();
    if (given === expected) {
      inp.classList.add('input-correct');
      inp.classList.remove('input-wrong');
    } else {
      inp.classList.add('input-wrong');
      inp.classList.remove('input-correct');
      allCorrect = false;
    }
  });
  const feedback = document.getElementById('fill-feedback');
  if (allCorrect) {
    feedback.innerHTML = '✅ Parfait! Toutes les réponses sont correctes!';
    feedback.className = 'game-feedback success';
    completeGame(getCurrentGameId());
  } else {
    feedback.innerHTML = '❌ Certaines réponses sont incorrectes. Réessaie!';
    feedback.className = 'game-feedback error';
  }
  feedback.classList.remove('hidden');
  if (allCorrect) showPlayAgainBtn();
}

// ===== CODE ARRANGE =====
let arrangeOrder = [];

function renderArrange(game) {
  const container = document.getElementById('game-container');
  arrangeOrder = [...game.solution];
  const shuffled = shuffleArray([...game.solution]);

  container.innerHTML = `
    <div class="arrange-game">
      <p class="game-instruction">🔀 Clique sur les lignes dans le bon ordre pour reconstituer le code!</p>
      <div class="arrange-pool" id="arrange-pool">
        ${shuffled.map(lineIdx => `
          <div class="arrange-item" data-line="${lineIdx}" onclick="selectArrangeLine(this)">
            <span class="arrange-code">${escapeHtmlGame(game.lines[lineIdx]) || '(ligne vide)'}</span>
          </div>`).join('')}
      </div>
      <div class="arrange-result-label">Ton code (dans l'ordre que tu as cliqué):</div>
      <div class="arrange-result" id="arrange-result"></div>
      <div class="arrange-actions">
        <button class="btn btn-secondary" onclick="resetArrange()">🔄 Recommencer</button>
        <button class="btn btn-primary" onclick="checkArrange()">Vérifier ✓</button>
      </div>
      <div id="arrange-feedback" class="game-feedback hidden"></div>
    </div>`;
  window._arrangeSelected = [];
}

function selectArrangeLine(el) {
  if (el.classList.contains('selected')) return;
  el.classList.add('selected');
  window._arrangeSelected = window._arrangeSelected || [];
  window._arrangeSelected.push(parseInt(el.dataset.line));
  const result = document.getElementById('arrange-result');
  const game = getCurrentGame();
  result.innerHTML = window._arrangeSelected.map((lineIdx, pos) => `
    <div class="arrange-result-line">
      <span class="line-num">${pos + 1}</span>
      <span>${escapeHtmlGame(game.lines[lineIdx]) || '(vide)'}</span>
    </div>`).join('');
}

function resetArrange() {
  window._arrangeSelected = [];
  document.querySelectorAll('.arrange-item').forEach(el => el.classList.remove('selected'));
  document.getElementById('arrange-result').innerHTML = '';
  const feedback = document.getElementById('arrange-feedback');
  feedback.className = 'game-feedback hidden';
}

function checkArrange() {
  const game = getCurrentGame();
  const selected = window._arrangeSelected || [];
  if (selected.length < game.lines.length) {
    const feedback = document.getElementById('arrange-feedback');
    feedback.innerHTML = `⚠️ Sélectionne toutes les ${game.lines.length} lignes!`;
    feedback.className = 'game-feedback warning';
    feedback.classList.remove('hidden');
    return;
  }
  const correct = selected.every((lineIdx, pos) => lineIdx === game.solution[pos]);
  const feedback = document.getElementById('arrange-feedback');
  if (correct) {
    feedback.innerHTML = '✅ Excellent! Le code est dans le bon ordre!';
    feedback.className = 'game-feedback success';
    completeGame(getCurrentGameId());
    showPlayAgainBtn();
  } else {
    feedback.innerHTML = '❌ L\'ordre n\'est pas correct. Regarde bien la structure du code.';
    feedback.className = 'game-feedback error';
  }
  feedback.classList.remove('hidden');
}

// ===== Helpers =====
function getCurrentGameId() {
  const header = document.querySelector('.game-page-header h1');
  if (!header) return null;
  const title = header.textContent.trim().replace(/^[^\w]+/, '').trim();
  const g = GAMES.find(gm => gm.icon + ' ' + gm.title === header.textContent.trim());
  return g ? g.id : null;
}

function getCurrentGame() {
  const id = getCurrentGameId();
  return GAMES.find(g => g.id === id);
}

function completeGame(gameId) {
  if (!gameId) return;
  const p = loadProgress();
  if (!p.completedGames.includes(gameId)) {
    p.completedGames.push(gameId);
    saveProgress(p);
    const game = GAMES.find(g => g.id === gameId);
    if (game) addXP(game.xp);
    // Achievements
    const bugGames = GAMES.filter(g => g.type === 'bug-hunt');
    const freshP = loadProgress();
    checkAchievement('bug-hunter', bugGames.every(g => freshP.completedGames.includes(g.id)));
    checkAchievement('speed-demon', freshP.completedGames.length >= 1);
  }
}

function showPlayAgainBtn() {
  const container = document.getElementById('game-container');
  if (container.querySelector('.play-again-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary play-again-btn';
  btn.textContent = '← Retour aux jeux';
  btn.onclick = () => navigate('games');
  container.appendChild(btn);
}

function escapeHtmlGame(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
