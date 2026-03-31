-- ═══════════════════════════════════════════════════════════════
--  SALATI — Mise à jour v2 : Auth par token (sans email)
--  Colle ce script dans : Supabase Dashboard → SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════

-- 1. Ajouter colonne username dans profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Index unique insensible à la casse
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_idx
  ON public.profiles (lower(username));

-- 2. Mettre à jour le trigger handle_new_user pour stocker le username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
  v_role TEXT;
BEGIN
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-z0-9]', '_', 'g'))
  );

  SELECT CASE WHEN COUNT(*) = 0 THEN 'admin' ELSE 'user' END
  INTO v_role FROM public.profiles;

  INSERT INTO public.profiles (id, email, display_name, username, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', v_username),
    v_username,
    v_role
  );
  RETURN NEW;
END;
$$;

-- 3. Fonction : trouver l'email à partir du username (appelable sans être connecté)
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT email FROM public.profiles
  WHERE lower(username) = lower(trim(p_username))
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_email_by_username TO anon;

-- 4. Table des tokens d'invitation
CREATE TABLE IF NOT EXISTS public.invite_tokens (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token       TEXT NOT NULL UNIQUE,
  label       TEXT,
  created_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  is_revoked  BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.invite_tokens ENABLE ROW LEVEL SECURITY;

-- Seuls les admins gèrent les tokens
DROP POLICY IF EXISTS "admins_manage_tokens" ON public.invite_tokens;
CREATE POLICY "admins_manage_tokens" ON public.invite_tokens
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Valider un token (appelable sans être connecté)
--    Si aucun profil n'existe encore → premier admin, toujours valide
CREATE OR REPLACE FUNCTION public.validate_invite_token(p_token TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public
AS $$
BEGIN
  -- Bootstrap : premier compte = admin sans token requis
  IF (SELECT COUNT(*) FROM public.profiles) = 0 THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.invite_tokens
    WHERE token = upper(trim(p_token))
    AND used_by IS NULL
    AND is_revoked = FALSE
  );
END;
$$;
GRANT EXECUTE ON FUNCTION public.validate_invite_token TO anon;

-- 6. Marquer un token comme utilisé
CREATE OR REPLACE FUNCTION public.use_invite_token(p_token TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  -- Pas de token requis pour le premier compte
  IF (SELECT COUNT(*) FROM public.profiles WHERE id != p_user_id) = 0 THEN
    RETURN TRUE;
  END IF;

  SELECT id INTO v_id FROM public.invite_tokens
  WHERE token = upper(trim(p_token))
  AND used_by IS NULL AND is_revoked = FALSE;

  IF v_id IS NULL THEN RETURN FALSE; END IF;

  UPDATE public.invite_tokens
  SET used_by = p_user_id, used_at = NOW()
  WHERE id = v_id;

  RETURN TRUE;
END;
$$;
GRANT EXECUTE ON FUNCTION public.use_invite_token TO authenticated;

-- ═══════════════════════════════════════════════════════════════
--  IMPORTANT : Dans Supabase → Authentication → Email
--  → "Confirm sign up" doit être DÉSACTIVÉ
-- ═══════════════════════════════════════════════════════════════
