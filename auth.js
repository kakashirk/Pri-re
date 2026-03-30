/* ═══════════════════════════════════════════════
   SALATI — Authentication (Supabase)
   ═══════════════════════════════════════════════ */

'use strict';

// ── Supabase client ───────────────────────────
let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    if (typeof supabase === 'undefined') {
      console.error('Supabase SDK non chargé.');
      return null;
    }
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ── Auth state ────────────────────────────────
const authState = {
  user: null,        // Supabase user object
  profile: null,     // Profile from `profiles` table
  session: null,     // Full session (contains access_token, refresh_token)
};

// ── Callbacks ─────────────────────────────────
let _onLogin = null;
let _onLogout = null;

function onLogin(fn) { _onLogin = fn; }
function onLogout(fn) { _onLogout = fn; }

// ── Initialise auth listener ──────────────────
async function initAuth() {
  const sb = getSupabase();
  if (!sb) return;

  // Check config
  if (SUPABASE_URL.includes('REMPLACE') || SUPABASE_ANON_KEY.includes('REMPLACE')) {
    showAuthError('⚠️ Configurez Supabase dans config.js avant de continuer.');
    showAuthOverlay('login');
    return;
  }

  // Listen for auth state changes
  sb.auth.onAuthStateChange(async (event, session) => {
    authState.session = session;
    authState.user = session?.user ?? null;

    if (session?.user) {
      await loadProfile(session.user.id);

      // Block banned users
      if (authState.profile?.role === 'banned') {
        await signOut();
        showAuthError('🚫 Votre accès a été suspendu. Contactez l\'administrateur.');
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

  // Get existing session on load
  const { data: { session } } = await sb.auth.getSession();
  if (!session) {
    showAuthOverlay('login');
  }
}

// ── Load user profile from DB ─────────────────
async function loadProfile(userId) {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!error && data) {
    authState.profile = data;
  }
}

// ── Sign In ───────────────────────────────────
async function signIn(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// ── Sign Up ───────────────────────────────────
async function signUp(email, password, displayName) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;
  return data;
}

// ── Sign Out ──────────────────────────────────
async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
}

// ── Get current access token ──────────────────
async function getAccessToken() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return session?.access_token ?? null;
}

// ── Refresh token ─────────────────────────────
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
  const { error } = await sb
    .from('profiles')
    .update({ display_name: name })
    .eq('id', authState.user.id);
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
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
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
  btn.textContent = loading ? 'Chargement…' : (formId === 'loginForm' ? 'Se connecter' : 'Créer mon compte');
}

// ── Update header with user info ──────────────
function updateHeaderUser() {
  const userBtn = document.getElementById('userMenuBtn');
  const adminNavBtn = document.querySelector('.nav-btn[data-section="admin"]');

  if (!authState.user) {
    if (userBtn) userBtn.style.display = 'none';
    if (adminNavBtn) adminNavBtn.style.display = 'none';
    return;
  }

  const profile = authState.profile;
  const initials = (profile?.display_name || authState.user.email || '?')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  if (userBtn) {
    userBtn.style.display = 'flex';
    userBtn.querySelector('.user-initials').textContent = initials;
    userBtn.querySelector('.user-name').textContent = profile?.display_name || authState.user.email;
    userBtn.querySelector('.user-role').textContent = profile?.role === 'admin' ? '👑 Admin' : 'Utilisateur';
  }

  // Show admin nav only for admins
  if (adminNavBtn) {
    adminNavBtn.style.display = profile?.role === 'admin' ? 'inline-flex' : 'none';
  }
}

// ═══════════════════════════════════════════════
// Auth form event bindings (called after DOM ready)
// ═══════════════════════════════════════════════
function bindAuthForms() {
  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.tab));
  });

  // Login form
  document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    clearAuthError();
    setAuthLoading('loginForm', true);
    try {
      await signIn(email, password);
    } catch (err) {
      showAuthError(getFriendlyError(err.message));
    } finally {
      setAuthLoading('loginForm', false);
    }
  });

  // Register form
  document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;

    clearAuthError();
    if (password !== confirm) { showAuthError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6) { showAuthError('Le mot de passe doit avoir au moins 6 caractères.'); return; }

    setAuthLoading('registerForm', true);
    try {
      const { user } = await signUp(email, password, name);
      if (user && !user.email_confirmed_at) {
        showAuthError('✅ Vérifiez votre email pour confirmer votre compte, puis connectez-vous.');
        switchAuthTab('login');
      }
    } catch (err) {
      showAuthError(getFriendlyError(err.message));
    } finally {
      setAuthLoading('registerForm', false);
    }
  });

  // User menu toggle
  const userMenuBtn = document.getElementById('userMenuBtn');
  const userDropdown = document.getElementById('userDropdown');
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });
    document.addEventListener('click', () => userDropdown.classList.remove('show'));
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await signOut();
    });
  }

  // Show token
  const showTokenBtn = document.getElementById('showTokenBtn');
  if (showTokenBtn) {
    showTokenBtn.addEventListener('click', async () => {
      const token = await getAccessToken();
      if (token) openTokenModal(token);
    });
  }
}

// ── Token modal ───────────────────────────────
async function openTokenModal(token) {
  const modal = document.getElementById('tokenModal');
  if (!modal) return;
  document.getElementById('tokenValue').textContent = token;
  updateTokenExpiry();
  modal.style.display = 'flex';
}

function updateTokenExpiry() {
  const session = authState.session;
  if (!session?.expires_at) return;
  const exp = new Date(session.expires_at * 1000);
  const now = new Date();
  const diff = Math.round((exp - now) / 60000);
  const el = document.getElementById('tokenExpiry');
  if (el) el.textContent = `Expire ${diff > 0 ? `dans ${diff} min` : 'bientôt'} — ${exp.toLocaleTimeString('fr-FR')}`;
}

function bindTokenModal() {
  const modal = document.getElementById('tokenModal');
  if (!modal) return;

  document.getElementById('closeTokenModal').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('copyTokenBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(document.getElementById('tokenValue').textContent)
      .then(() => showToast('✅ Token copié !'))
      .catch(() => showToast('Sélectionnez le token manuellement.'));
    modal.style.display = 'none';
  });

  document.getElementById('refreshTokenBtn').addEventListener('click', async () => {
    try {
      const session = await refreshSession();
      document.getElementById('tokenValue').textContent = session.access_token;
      updateTokenExpiry();
      showToast('🔄 Token renouvelé !');
    } catch {
      showToast('Erreur lors du renouvellement du token.');
    }
  });
}

// ── Friendly error messages ───────────────────
function getFriendlyError(msg) {
  if (!msg) return 'Une erreur est survenue.';
  if (msg.includes('Invalid login')) return '❌ Email ou mot de passe incorrect.';
  if (msg.includes('Email not confirmed')) return '📧 Confirmez votre email avant de vous connecter.';
  if (msg.includes('already registered')) return '⚠️ Cet email est déjà utilisé. Connectez-vous.';
  if (msg.includes('Password should')) return '⚠️ Le mot de passe doit faire au moins 6 caractères.';
  if (msg.includes('rate limit')) return '⏳ Trop de tentatives. Attendez quelques minutes.';
  return msg;
}
