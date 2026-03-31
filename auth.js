/* ═══════════════════════════════════════════════
   SALATI — Authentication (Supabase, sans email)
   Connexion : nom + mot de passe
   Inscription : nom + mot de passe + token admin
   ═══════════════════════════════════════════════ */

'use strict';

// ── Supabase client ───────────────────────────
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    if (typeof supabase === 'undefined') return null;
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ── Auth state ────────────────────────────────
const authState = { user: null, profile: null, session: null };

let _onLogin  = null;
let _onLogout = null;
function onLogin(fn)  { _onLogin  = fn; }
function onLogout(fn) { _onLogout = fn; }

// ── Init ──────────────────────────────────────
async function initAuth() {
  const sb = getSupabase();
  if (!sb) { showAuthOverlay('login'); return; }

  if (SUPABASE_URL.includes('REMPLACE') || SUPABASE_ANON_KEY.includes('REMPLACE')) {
    showAuthError('⚠️ Configurez Supabase dans config.js.');
    showAuthOverlay('login');
    return;
  }

  startAuthTimeout();

  sb.auth.onAuthStateChange(async (event, session) => {
    authState.session = session;
    authState.user    = session?.user ?? null;

    if (session?.user) {
      await loadProfile(session.user.id);

      if (authState.profile?.role === 'banned') {
        await signOut();
        showAuthError('🚫 Accès suspendu. Contactez l\'administrateur.');
        showAuthOverlay('login');
        return;
      }

      hideAuthOverlay();
      updateHeaderUser();
      if (_onLogin) _onLogin(authState);
    } else {
      authState.profile = null;
      showAuthOverlay('login');
      updateHeaderUser();
      if (_onLogout) _onLogout();
    }
  });

  try {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) showAuthOverlay('login');
  } catch {
    showAuthOverlay('login');
  }
}

// ── Load profile ──────────────────────────────
async function loadProfile(userId) {
  const sb = getSupabase();
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
  if (data) authState.profile = data;
}

// ── Sign in (username + password) ─────────────
async function signInWithUsername(username, password) {
  const sb = getSupabase();

  const { data: email, error } = await sb.rpc('get_email_by_username', {
    p_username: username.toLowerCase().trim(),
  });
  if (error || !email) throw new Error('Nom d\'utilisateur introuvable.');

  const { data, error: err2 } = await sb.auth.signInWithPassword({ email, password });
  if (err2) throw err2;
  return data;
}

// ── Sign up (username + password + token) ─────
async function signUpWithToken(username, password, inviteToken) {
  const sb = getSupabase();
  const cleanName = username.trim();
  const cleanUser = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const token     = inviteToken.toUpperCase().trim();

  // Validate token
  const { data: valid, error: tErr } = await sb.rpc('validate_invite_token', { p_token: token });
  if (tErr || !valid) throw new Error('Token invalide ou déjà utilisé.');

  // Check username availability
  const { data: existingEmail } = await sb.rpc('get_email_by_username', { p_username: cleanUser });
  if (existingEmail) throw new Error('Ce nom est déjà pris. Choisissez-en un autre.');

  // Fake email (user never sees it)
  const fakeEmail = `${cleanUser}@salati.app`;

  const { data, error } = await sb.auth.signUp({
    email: fakeEmail,
    password,
    options: {
      data: { display_name: cleanName, username: cleanUser },
      emailRedirectTo: null,
    },
  });
  if (error) throw error;

  // Mark token as used
  if (data.user) {
    await sb.rpc('use_invite_token', { p_token: token, p_user_id: data.user.id });
  }

  return data;
}

// ── Sign out ──────────────────────────────────
async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
}

// ── Token helpers ─────────────────────────────
async function getAccessToken() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session?.access_token ?? null;
}

async function refreshSession() {
  const sb = getSupabase();
  const { data, error } = await sb.auth.refreshSession();
  if (error) throw error;
  authState.session = data.session;
  return data.session;
}

// ── Update display name ───────────────────────
async function updateDisplayName(name) {
  const sb = getSupabase();
  const { error } = await sb.from('profiles').update({ display_name: name }).eq('id', authState.user.id);
  if (error) throw error;
  authState.profile.display_name = name;
}

// ═══════════════════════════════════════════════
// UI — Auth Overlay
// ═══════════════════════════════════════════════
function showAuthOverlay(tab = 'login') {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  switchAuthTab(tab);
}

function hideAuthOverlay() {
  const overlay = document.getElementById('authOverlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.style.overflow = '';
  document.body.classList.remove('app-hidden');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab)
  );
  document.getElementById('loginForm').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';
  clearAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById('authError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearAuthError() {
  const el = document.getElementById('authError');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

function setAuthLoading(formId, loading) {
  const btn = document.querySelector(`#${formId} .auth-submit`);
  if (!btn) return;
  btn.disabled = loading;
  btn.textContent = loading ? 'Chargement…'
    : (formId === 'loginForm' ? 'Se connecter' : 'Créer mon compte');
}

// ── Update header ─────────────────────────────
function updateHeaderUser() {
  const userBtn    = document.getElementById('userMenuBtn');
  const adminBtn   = document.querySelector('.nav-btn[data-section="admin"]');

  if (!authState.user) {
    if (userBtn)  userBtn.style.display  = 'none';
    if (adminBtn) adminBtn.style.display = 'none';
    return;
  }

  const name = authState.profile?.display_name || authState.profile?.username || '?';
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (userBtn) {
    userBtn.style.display = 'flex';
    userBtn.querySelector('.user-initials').textContent = initials;
    userBtn.querySelector('.user-name').textContent     = name;
    userBtn.querySelector('.user-role').textContent     =
      authState.profile?.role === 'admin' ? '👑 Admin' : 'Utilisateur';
  }

  if (adminBtn) {
    adminBtn.style.display = authState.profile?.role === 'admin' ? 'inline-flex' : 'none';
  }
}

// ── Bind auth forms ───────────────────────────
function bindAuthForms() {
  document.querySelectorAll('.auth-tab').forEach(tab =>
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab))
  );

  // Login
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    clearAuthError();
    setAuthLoading('loginForm', true);
    try {
      await signInWithUsername(username, password);
    } catch (err) {
      showAuthError(getFriendlyError(err.message));
    } finally {
      setAuthLoading('loginForm', false);
    }
  });

  // Register
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name     = document.getElementById('registerName').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm  = document.getElementById('registerConfirm').value;
    const token    = document.getElementById('registerToken').value.trim();

    clearAuthError();
    if (!name)                { showAuthError('Entrez votre nom.'); return; }
    if (password !== confirm) { showAuthError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6)  { showAuthError('Mot de passe : 6 caractères minimum.'); return; }

    setAuthLoading('registerForm', true);
    try {
      const { user } = await signUpWithToken(name, password, token);
      if (user && !user.email_confirmed_at) {
        showAuthError('✅ Compte créé ! Connectez-vous maintenant.');
        switchAuthTab('login');
        document.getElementById('loginUsername').value = name;
      }
    } catch (err) {
      showAuthError(getFriendlyError(err.message));
    } finally {
      setAuthLoading('registerForm', false);
    }
  });

  // User menu toggle
  const userMenuBtn  = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', e => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => userDropdown.classList.remove('show'));
  }

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    userDropdown?.classList.remove('show');
    await signOut();
  });

  // Show token
  document.getElementById('showTokenBtn')?.addEventListener('click', async () => {
    const token = await getAccessToken();
    if (token) openTokenModal(token);
  });
}

// ── Token modal ───────────────────────────────
function openTokenModal(token) {
  const modal = document.getElementById('tokenModal');
  if (!modal) return;
  document.getElementById('tokenValue').textContent = token;
  updateTokenExpiry();
  modal.style.display = 'flex';
}
function updateTokenExpiry() {
  const session = authState.session;
  if (!session?.expires_at) return;
  const exp  = new Date(session.expires_at * 1000);
  const diff = Math.round((exp - new Date()) / 60000);
  const el   = document.getElementById('tokenExpiry');
  if (el) el.textContent = `Expire ${diff > 0 ? `dans ${diff} min` : 'bientôt'} — ${exp.toLocaleTimeString('fr-FR')}`;
}
function bindTokenModal() {
  const modal = document.getElementById('tokenModal');
  if (!modal) return;
  document.getElementById('closeTokenModal')?.addEventListener('click', () => modal.style.display = 'none');
  document.getElementById('copyTokenBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('tokenValue').textContent)
      .then(() => showToast('✅ Token copié !'))
      .catch(() => showToast('Sélectionnez le token manuellement.'));
    modal.style.display = 'none';
  });
  document.getElementById('refreshTokenBtn')?.addEventListener('click', async () => {
    try {
      const s = await refreshSession();
      document.getElementById('tokenValue').textContent = s.access_token;
      updateTokenExpiry();
      showToast('🔄 Token renouvelé !');
    } catch { showToast('Erreur lors du renouvellement.'); }
  });
}

// ── Failsafe ──────────────────────────────────
function startAuthTimeout() {
  setTimeout(() => {
    if (!authState.user) showAuthOverlay('login');
  }, 4000);
}

// ── Friendly errors ───────────────────────────
function getFriendlyError(msg) {
  if (!msg) return 'Une erreur est survenue.';
  if (msg.includes('Invalid login') || msg.includes('invalid_credentials'))
    return '❌ Nom ou mot de passe incorrect.';
  if (msg.includes('introuvable'))    return '❌ Nom d\'utilisateur introuvable.';
  if (msg.includes('Token invalide')) return '❌ Token invalide ou déjà utilisé.';
  if (msg.includes('déjà pris'))      return '⚠️ Ce nom est déjà pris.';
  if (msg.includes('Password'))       return '⚠️ Mot de passe : 6 caractères minimum.';
  if (msg.includes('rate limit'))     return '⏳ Trop de tentatives. Attendez quelques minutes.';
  return msg;
}
