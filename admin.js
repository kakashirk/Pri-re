/* ═══════════════════════════════════════════════
   SALATI — Admin Panel
   ═══════════════════════════════════════════════ */

'use strict';

// ── Load admin section ────────────────────────
async function loadAdminPanel() {
  // Guard: only admins
  if (authState.profile?.role !== 'admin') {
    document.getElementById('adminContent').innerHTML =
      '<p class="admin-error">Accès refusé.</p>';
    return;
  }

  document.getElementById('adminContent').innerHTML =
    '<div class="loading-spinner"></div>';

  try {
    const users = await fetchAllUsers();
    renderAdminStats(users);
    renderUserTable(users);
  } catch (err) {
    document.getElementById('adminContent').innerHTML =
      `<p class="admin-error">Erreur : ${err.message}</p>`;
  }
}

// ── Fetch all profiles (admin) ────────────────
async function fetchAllUsers() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ── Update user role ──────────────────────────
async function updateUserRole(userId, newRole) {
  const sb = getSupabase();
  const { error } = await sb
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);
  if (error) throw error;
}

// ── Render stats cards ────────────────────────
function renderAdminStats(users) {
  const total  = users.length;
  const admins = users.filter(u => u.role === 'admin').length;
  const banned = users.filter(u => u.role === 'banned').length;
  const recent = users.filter(u => {
    const d = new Date(u.created_at);
    return (Date.now() - d) < 7 * 24 * 3600 * 1000;
  }).length;

  document.getElementById('statTotal').textContent  = total;
  document.getElementById('statAdmins').textContent = admins;
  document.getElementById('statBanned').textContent = banned;
  document.getElementById('statRecent').textContent = recent;
}

// ── Render user table ─────────────────────────
function renderUserTable(users) {
  const container = document.getElementById('adminUserList');
  container.innerHTML = '';

  if (!users.length) {
    container.innerHTML = '<p class="admin-empty">Aucun utilisateur trouvé.</p>';
    return;
  }

  users.forEach(user => {
    const isMe = user.id === authState.user?.id;
    const initials = (user.display_name || user.email || '?')
      .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

    const row = document.createElement('div');
    row.className = `admin-user-row ${user.role}`;
    row.dataset.userId = user.id;

    row.innerHTML = `
      <div class="aur-avatar" style="background:${roleColor(user.role)}">${initials}</div>
      <div class="aur-info">
        <div class="aur-name">${escHtml(user.display_name || '—')} ${isMe ? '<span class="aur-me">moi</span>' : ''}</div>
        <div class="aur-email">${escHtml(user.email)}</div>
        <div class="aur-date">Inscrit le ${joinDate}</div>
      </div>
      <div class="aur-role">
        <span class="role-badge role-${user.role}">${roleName(user.role)}</span>
      </div>
      <div class="aur-actions">
        ${!isMe ? buildActionButtons(user) : '<span class="aur-me-label">Votre compte</span>'}
      </div>
    `;

    // Bind action buttons
    row.querySelectorAll('.role-action-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRoleAction(user.id, btn.dataset.action, row));
    });

    container.appendChild(row);
  });
}

function buildActionButtons(user) {
  const btns = [];

  if (user.role === 'user') {
    btns.push(`<button class="role-action-btn promote" data-action="promote" title="Promouvoir admin">👑 Admin</button>`);
    btns.push(`<button class="role-action-btn ban" data-action="ban" title="Bannir">🚫 Bannir</button>`);
  } else if (user.role === 'admin') {
    btns.push(`<button class="role-action-btn demote" data-action="demote" title="Rétrograder">👤 Rétrograder</button>`);
    btns.push(`<button class="role-action-btn ban" data-action="ban" title="Bannir">🚫 Bannir</button>`);
  } else if (user.role === 'banned') {
    btns.push(`<button class="role-action-btn unban" data-action="unban" title="Rétablir l'accès">✅ Rétablir</button>`);
  }

  return btns.join('');
}

async function handleRoleAction(userId, action, row) {
  const roleMap = { promote: 'admin', demote: 'user', ban: 'banned', unban: 'user' };
  const newRole = roleMap[action];
  if (!newRole) return;

  const confirmMsg = {
    promote: 'Promouvoir cet utilisateur en admin ?',
    demote:  'Rétrograder cet admin en utilisateur ?',
    ban:     'Bannir cet utilisateur ? Il ne pourra plus se connecter.',
    unban:   'Rétablir l\'accès de cet utilisateur ?',
  }[action];

  if (!confirm(confirmMsg)) return;

  // Optimistic UI
  const btns = row.querySelectorAll('.role-action-btn');
  btns.forEach(b => { b.disabled = true; });

  try {
    await updateUserRole(userId, newRole);
    showToast(`✅ Rôle mis à jour : ${roleName(newRole)}`);
    // Re-render
    await loadAdminPanel();
  } catch (err) {
    showToast('❌ Erreur : ' + err.message);
    btns.forEach(b => { b.disabled = false; });
  }
}

// ── Admin search filter ───────────────────────
function initAdminSearch() {
  const search = document.getElementById('adminSearch');
  if (!search) return;
  search.addEventListener('input', async () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.admin-user-row').forEach(row => {
      const text = row.querySelector('.aur-email')?.textContent.toLowerCase() +
                   row.querySelector('.aur-name')?.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ── Token info panel ──────────────────────────
function renderTokenPanel() {
  const session = authState.session;
  if (!session) return;

  const el = document.getElementById('adminTokenInfo');
  if (!el) return;

  const exp = new Date(session.expires_at * 1000);
  const now = new Date();
  const diffMin = Math.round((exp - now) / 60000);
  const userId = authState.user?.id || '—';
  const role = authState.profile?.role || '—';
  const token = session.access_token;
  const shortToken = token ? token.substring(0, 40) + '…' : '—';

  el.innerHTML = `
    <div class="token-info-grid">
      <div class="ti-item">
        <div class="ti-label">User ID</div>
        <div class="ti-value ti-mono">${userId}</div>
      </div>
      <div class="ti-item">
        <div class="ti-label">Rôle</div>
        <div class="ti-value"><span class="role-badge role-${role}">${roleName(role)}</span></div>
      </div>
      <div class="ti-item">
        <div class="ti-label">Access Token (JWT)</div>
        <div class="ti-value ti-mono ti-truncate">${shortToken}</div>
      </div>
      <div class="ti-item">
        <div class="ti-label">Expiration</div>
        <div class="ti-value">${diffMin > 0 ? `dans ${diffMin} min` : 'expiré'} — ${exp.toLocaleTimeString('fr-FR')}</div>
      </div>
    </div>
    <div class="token-actions">
      <button id="adminShowTokenBtn" class="token-btn">🔑 Voir le token complet</button>
      <button id="adminRefreshTokenBtn" class="token-btn secondary">🔄 Renouveler</button>
    </div>
  `;

  document.getElementById('adminShowTokenBtn').addEventListener('click', async () => {
    const t = await getAccessToken();
    if (t) openTokenModal(t);
  });
  document.getElementById('adminRefreshTokenBtn').addEventListener('click', async () => {
    try {
      await refreshSession();
      renderTokenPanel();
      showToast('🔄 Token renouvelé !');
    } catch { showToast('Erreur lors du renouvellement.'); }
  });
}

// ── Helpers ───────────────────────────────────
function roleName(role) {
  return { user: 'Utilisateur', admin: '👑 Admin', banned: '🚫 Banni' }[role] || role;
}

function roleColor(role) {
  return { user: '#2d6a4f', admin: '#c9a84c', banned: '#dc2626' }[role] || '#6b7280';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
