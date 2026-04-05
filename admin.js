/* ═══════════════════════════════════════════════
   SALATI — Admin Panel
   ═══════════════════════════════════════════════ */

'use strict';

// ── Load admin panel ──────────────────────────
async function loadAdminPanel() {
  if (authState.profile?.role !== 'admin') {
    document.getElementById('adminContent').innerHTML =
      '<p class="admin-error">Accès refusé.</p>';
    return;
  }

  document.getElementById('adminContent').innerHTML = '<div class="loading-spinner"></div>';
  document.getElementById('adminUserList').innerHTML = '';

  try {
    const [users, tokens] = await Promise.all([fetchAllUsers(), fetchTokens()]);
    renderAdminStats(users, tokens);
    renderUserTable(users);
    renderTokenList(tokens);
  } catch (err) {
    document.getElementById('adminContent').innerHTML =
      `<p class="admin-error">Erreur : ${err.message}</p>`;
  }
}

// ── Users ─────────────────────────────────────
async function fetchAllUsers() {
  const { data, error } = await getSupabase()
    .from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

async function updateUserRole(userId, newRole) {
  const { error } = await getSupabase()
    .from('profiles').update({ role: newRole }).eq('id', userId);
  if (error) throw error;
}

// ── Tokens ────────────────────────────────────
async function fetchTokens() {
  const { data, error } = await getSupabase()
    .from('invite_tokens')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function generateInviteToken(label = '') {
  const token = generateTokenCode();
  const { data, error } = await getSupabase()
    .from('invite_tokens')
    .insert({ token, label: label || null, created_by: authState.user.id })
    .select().single();
  if (error) throw error;
  return data;
}

async function revokeToken(tokenId) {
  const { error } = await getSupabase()
    .from('invite_tokens').update({ is_revoked: true }).eq('id', tokenId);
  if (error) throw error;
}

function generateTokenCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const part  = n => Array.from({ length: n }, () =>
    chars[Math.floor(Math.random() * chars.length)]).join('');
  return `SALA-${part(4)}-${part(4)}`;
}

// ── Render stats ──────────────────────────────
function renderAdminStats(users, tokens) {
  document.getElementById('statTotal').textContent  = users.length;
  document.getElementById('statAdmins').textContent = users.filter(u => u.role === 'admin').length;
  document.getElementById('statBanned').textContent = users.filter(u => u.role === 'banned').length;
  document.getElementById('statTokens').textContent = tokens.filter(t => !t.used_by && !t.is_revoked).length;
}

// ── Render user table ─────────────────────────
function renderUserTable(users) {
  document.getElementById('adminContent').innerHTML = '';
  const container = document.getElementById('adminUserList');
  container.innerHTML = '';

  if (!users.length) {
    container.innerHTML = '<p class="admin-empty">Aucun utilisateur.</p>';
    return;
  }

  users.forEach(user => {
    const isMe    = user.id === authState.user?.id;
    const initial = (user.display_name || user.username || '?')[0].toUpperCase();
    const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

    const row = document.createElement('div');
    row.className = `admin-user-row ${user.role}`;
    row.dataset.userId = user.id;
    row.innerHTML = `
      <div class="aur-avatar" style="background:${roleColor(user.role)}">${initial}</div>
      <div class="aur-info">
        <div class="aur-name">${escHtml(user.display_name || user.username || '—')} ${isMe ? '<span class="aur-me">moi</span>' : ''}</div>
        <div class="aur-email">@${escHtml(user.username || '—')}</div>
        <div class="aur-date">Inscrit le ${joinDate}</div>
      </div>
      <div class="aur-role"><span class="role-badge role-${user.role}">${roleName(user.role)}</span></div>
      <div class="aur-actions">
        ${!isMe ? buildActionButtons(user) : '<span class="aur-me-label">Votre compte</span>'}
      </div>
    `;

    row.querySelectorAll('.role-action-btn').forEach(btn => {
      btn.addEventListener('click', () => handleRoleAction(user.id, btn.dataset.action, row));
    });

    container.appendChild(row);
  });
}

function buildActionButtons(user) {
  if (user.role === 'user')
    return `<button class="role-action-btn promote" data-action="promote">👑 Admin</button>
            <button class="role-action-btn ban" data-action="ban">🚫 Bannir</button>`;
  if (user.role === 'admin')
    return `<button class="role-action-btn demote" data-action="demote">👤 Rétrograder</button>
            <button class="role-action-btn ban" data-action="ban">🚫 Bannir</button>`;
  if (user.role === 'banned')
    return `<button class="role-action-btn unban" data-action="unban">✅ Rétablir</button>
            <button class="role-action-btn delete" data-action="delete">🗑️ Supprimer</button>`;
  return '';
}

async function handleRoleAction(userId, action, row) {
  const roleMap    = { promote: 'admin', demote: 'user', ban: 'banned', unban: 'user' };
  const confirmMsg = {
    promote: 'Promouvoir en admin ?',
    demote:  'Rétrograder en utilisateur ?',
    ban:     'Bannir cet utilisateur ?',
    unban:   'Rétablir l\'accès ?',
    delete:  '⚠️ Supprimer définitivement cet utilisateur et toutes ses données ?',
  }[action];

  if (!confirm(confirmMsg)) return;
  row.querySelectorAll('.role-action-btn').forEach(b => b.disabled = true);
  try {
    if (action === 'delete') {
      const sb = getSupabase();
      const { error } = await sb.rpc('admin_delete_user', { p_user_id: userId });
      if (error) throw error;
      showToast('✅ Utilisateur supprimé.');
    } else {
      await updateUserRole(userId, roleMap[action]);
      showToast(`✅ Rôle mis à jour : ${roleName(roleMap[action])}`);
    }
    await loadAdminPanel();
  } catch (err) {
    showToast('❌ ' + err.message);
    row.querySelectorAll('.role-action-btn').forEach(b => b.disabled = false);
  }
}

// ── Render token list ─────────────────────────
function renderTokenList(tokens) {
  const container = document.getElementById('tokenList');
  if (!container) return;
  container.innerHTML = '';

  if (!tokens.length) {
    container.innerHTML = '<p class="admin-empty">Aucun token. Générez-en un ci-dessus.</p>';
    return;
  }

  tokens.forEach(t => {
    const status   = t.is_revoked ? 'revoked' : t.used_by ? 'used' : 'available';
    const statusTx = { available: '✅ Disponible', used: '🔒 Utilisé', revoked: '❌ Révoqué' }[status];
    const date     = new Date(t.created_at).toLocaleDateString('fr-FR');

    const row = document.createElement('div');
    row.className = `token-row token-${status}`;
    row.innerHTML = `
      <div class="tr-token">${escHtml(t.token)}</div>
      <div class="tr-info">
        <span class="tr-status">${statusTx}</span>
        ${t.label ? `<span class="tr-label">${escHtml(t.label)}</span>` : ''}
        <span class="tr-date">${date}</span>
      </div>
      <div class="tr-actions">
        <button class="tr-copy-btn" data-token="${escHtml(t.token)}" title="Copier">📋</button>
        ${status === 'available'
          ? `<button class="tr-revoke-btn" data-id="${t.id}" title="Révoquer">🗑️</button>`
          : ''}
      </div>
    `;

    row.querySelector('.tr-copy-btn').addEventListener('click', e => {
      navigator.clipboard.writeText(e.currentTarget.dataset.token)
        .then(() => showToast('✅ Token copié !'))
        .catch(() => showToast('Copiez manuellement : ' + e.currentTarget.dataset.token));
    });

    row.querySelector('.tr-revoke-btn')?.addEventListener('click', async e => {
      if (!confirm('Révoquer ce token ? Il ne pourra plus être utilisé.')) return;
      try {
        await revokeToken(e.currentTarget.dataset.id);
        showToast('Token révoqué.');
        await loadAdminPanel();
      } catch (err) { showToast('❌ ' + err.message); }
    });

    container.appendChild(row);
  });
}

// ── Token generation button ───────────────────
function bindGenerateToken() {
  document.getElementById('generateTokenBtn')?.addEventListener('click', async () => {
    const label = prompt('Label pour ce token (optionnel) :') ?? '';
    try {
      const t = await generateInviteToken(label);
      showToast(`✅ Token généré : ${t.token}`);
      navigator.clipboard.writeText(t.token).catch(() => {});
      await loadAdminPanel();
    } catch (err) { showToast('❌ ' + err.message); }
  });
}

// ── Admin search ──────────────────────────────
function initAdminSearch() {
  document.getElementById('adminSearch')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-user-row').forEach(row => {
      const text = (row.querySelector('.aur-email')?.textContent || '') +
                   (row.querySelector('.aur-name')?.textContent  || '');
      row.style.display = text.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

// ── Token session info ────────────────────────
function renderTokenPanel() {
  const session = authState.session;
  const el = document.getElementById('adminTokenInfo');
  if (!el || !session) return;

  const exp     = new Date(session.expires_at * 1000);
  const diffMin = Math.round((exp - new Date()) / 60000);
  const role    = authState.profile?.role || '—';
  const token   = session.access_token;

  el.innerHTML = `
    <div class="token-info-grid">
      <div class="ti-item">
        <div class="ti-label">Utilisateur</div>
        <div class="ti-value">${escHtml(authState.profile?.display_name || '—')}</div>
      </div>
      <div class="ti-item">
        <div class="ti-label">Rôle</div>
        <div class="ti-value"><span class="role-badge role-${role}">${roleName(role)}</span></div>
      </div>
      <div class="ti-item">
        <div class="ti-label">Access Token (JWT)</div>
        <div class="ti-value ti-mono ti-truncate">${token.substring(0, 40)}…</div>
      </div>
    </div>
    <div class="token-actions">
      <button id="adminShowTokenBtn" class="token-btn">🔑 Voir le token</button>
      <button id="adminRefreshTokenBtn" class="token-btn secondary">🔄 Renouveler</button>
    </div>
  `;

  document.getElementById('adminShowTokenBtn').addEventListener('click', async () => {
    const t = await getAccessToken();
    if (t) openTokenModal(t);
  });
  document.getElementById('adminRefreshTokenBtn').addEventListener('click', async () => {
    try { await refreshSession(); renderTokenPanel(); showToast('🔄 Token renouvelé !'); }
    catch { showToast('Erreur.'); }
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
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
