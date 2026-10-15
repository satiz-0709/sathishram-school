(() => {
  const config = window.SATHISHRAM_SUPABASE;
  const signInLink = document.querySelectorAll("[data-account-link]");
  const accountStatus = document.getElementById("account-status");
  const signInView = document.getElementById("sign-in-view");
  const mfaLoginView = document.getElementById("mfa-login-view");
  const signUpView = document.getElementById("sign-up-view");
  const profileView = document.getElementById("profile-view");
  const status = document.getElementById("account-message");
  const requestedReturn = new URLSearchParams(window.location.search).get("returnTo");
  const returnUrl = (() => {
    if (!requestedReturn) return null;
    const target = new URL(requestedReturn, window.location.href);
    if (target.origin !== window.location.origin || target.pathname.endsWith("/account.html")) return null;
    return target.href;
  })();
  let client;
  let currentUser;
  let pendingFactor;
  let pendingLoginChallenge;

  const showMessage = (message, isError = false) => {
    if (!status) return;
    status.textContent = message;
    if (message) status.dataset.state = isError ? "error" : "success";
    else delete status.dataset.state;
  };
  const showAccountView = (view) => {
    if (!signInView) return;
    signInView.hidden = view !== "sign-in";
    if (mfaLoginView) mfaLoginView.hidden = view !== "sign-in-mfa";
    signUpView.hidden = view !== "sign-up";
    profileView.hidden = view !== "profile";
    if (accountStatus) accountStatus.hidden = Boolean(currentUser);
  };
  const reportError = (error) => {
    showMessage(error?.message || "The request could not be completed. Please try again.", true);
  };
  const setAccountLinks = (user) => {
    signInLink.forEach((link) => {
      const label = link.querySelector("[data-account-link-label]");
      const name = user?.user_metadata?.display_name?.trim().split(/\s+/)[0];
      if (label) label.textContent = user ? (name || "Profile") : "Sign in";
      link.setAttribute("aria-label", user ? "Open your profile" : "Sign in or create an account");
    });
  };

  document.querySelectorAll("[data-account-show]").forEach((button) => {
    button.addEventListener("click", () => {
      showMessage("");
      showAccountView(button.dataset.accountShow);
    });
  });

  if (!window.supabase || !config?.url || !config?.anonKey) {
    setAccountLinks(null);
    if (accountStatus) {
      accountStatus.hidden = false;
      accountStatus.textContent = new URLSearchParams(window.location.search).get("reason") === "members"
        ? "Sign in to unlock this course. Account services are not configured yet; configure the Supabase project to continue."
        : "Account services are not configured yet. Add your Supabase project URL and public anon key in assets/supabase-config.js.";
    }
    document.querySelectorAll("#sign-in-form button, #sign-up-form button, #password-reset").forEach((button) => {
      button.disabled = true;
    });
    showAccountView("sign-in");
    return;
  }

  client = window.supabase.createClient(config.url, config.anonKey);

  const refreshProfile = async (user) => {
    if (!profileView || !user) return;
    currentUser = user;
    showAccountView("profile");
    setAccountLinks(user);
    document.getElementById("profile-email").value = user.email || "";
    document.getElementById("profile-name").value = user.user_metadata?.display_name || "";
    document.getElementById("profile-created").textContent = user.created_at
      ? `Member since ${new Date(user.created_at).toLocaleDateString()}`
      : "Signed in";
    try {
      const { data, error } = await client.from("profiles").select("display_name").eq("id", user.id).single();
      if (error) throw error;
      if (data?.display_name) document.getElementById("profile-name").value = data.display_name;
    } catch (error) {
      reportError(error);
    }
    await refreshMfa();
  };

  const refreshMfa = async () => {
    if (!client || !profileView) return;
    try {
      const { data, error } = await client.auth.mfa.listFactors();
      if (error) throw error;
      const factor = data.totp?.find((item) => item.status === "verified");
      const stateLabel = document.getElementById("mfa-state");
      const enableButton = document.getElementById("mfa-enroll");
      const disableButton = document.getElementById("mfa-disable");
      if (stateLabel) stateLabel.textContent = factor ? "Authenticator protection is on." : "Authenticator protection is off.";
      if (enableButton) enableButton.hidden = Boolean(factor);
      if (disableButton) {
        disableButton.hidden = !factor;
        disableButton.dataset.factorId = factor?.id || "";
      }
    } catch (error) {
      reportError(error);
    }
  };

  const loadSession = async () => {
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user || null;
    setAccountLinks(currentUser);
    if (profileView) {
      if (currentUser) await refreshProfile(currentUser);
      else showAccountView("sign-in");
    }
    if (currentUser && returnUrl) window.location.replace(returnUrl);
  };

  document.getElementById("sign-in-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { error } = await client.auth.signInWithPassword({
      email: form.get("email"),
      password: form.get("password")
    });
    if (error) return reportError(error);
    const { data: assurance, error: assuranceError } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) return reportError(assuranceError);
    if (assurance.nextLevel === "aal2" && assurance.currentLevel !== "aal2") {
      const { data: factors, error: factorsError } = await client.auth.mfa.listFactors();
      if (factorsError) return reportError(factorsError);
      const factor = factors.totp?.find((item) => item.status === "verified");
      if (!factor) return showMessage("This account requires an authenticator, but no verified authenticator was found.", true);
      const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: factor.id });
      if (challengeError) return reportError(challengeError);
      pendingLoginChallenge = { factorId: factor.id, challengeId: challenge.id };
      showMessage("Enter the code from your authenticator app.");
      showAccountView("sign-in-mfa");
      return;
    }
    showMessage("Signed in successfully.");
    await loadSession();
  });

  document.getElementById("mfa-login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!pendingLoginChallenge) return showMessage("Sign in again to request an authenticator challenge.", true);
    const code = document.getElementById("mfa-login-code").value.trim();
    const { error } = await client.auth.mfa.verify({
      ...pendingLoginChallenge,
      code
    });
    if (error) return reportError(error);
    pendingLoginChallenge = null;
    event.currentTarget.reset();
    showMessage("Signed in successfully.");
    await loadSession();
  });

  document.getElementById("sign-up-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const { data, error } = await client.auth.signUp({
      email: form.get("email"),
      password: form.get("password"),
      options: {
        data: { display_name: form.get("display_name") },
        emailRedirectTo: returnUrl || `${window.location.origin}${window.location.pathname}`
      }
    });
    if (error) return reportError(error);
    if (data.session) {
      showMessage("Account created.");
      await loadSession();
    } else {
      showMessage("Check your email to confirm your account, then sign in.");
    }
  });

  document.getElementById("password-reset")?.addEventListener("click", async () => {
    const email = document.getElementById("sign-in-email")?.value.trim();
    if (!email) return showMessage("Enter your email address first.", true);
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}`
    });
    if (error) return reportError(error);
    showMessage("Password reset instructions have been sent if that email has an account.");
  });

  document.getElementById("profile-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const displayName = document.getElementById("profile-name").value.trim();
    const { error: authError } = await client.auth.updateUser({ data: { display_name: displayName } });
    if (authError) return reportError(authError);
    const { error } = await client.from("profiles")
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq("id", currentUser.id)
      .select("id")
      .single();
    if (error) return reportError(error);
    await loadSession();
    showMessage("Profile updated.");
  });

  document.getElementById("email-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("profile-email").value.trim();
    const { error } = await client.auth.updateUser({ email });
    if (error) return reportError(error);
    showMessage("Check your inboxes to confirm the email change.");
  });

  document.getElementById("password-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("new-password").value;
    const { error } = await client.auth.updateUser({ password });
    if (error) return reportError(error);
    event.currentTarget.reset();
    showMessage("Password updated.");
  });

  document.getElementById("sign-out")?.addEventListener("click", async () => {
    const { error } = await client.auth.signOut({ scope: "global" });
    if (error) return reportError(error);
    currentUser = null;
    setAccountLinks(null);
    showMessage("You have been signed out on all devices.");
    showAccountView("sign-in");
  });

  document.getElementById("mfa-enroll")?.addEventListener("click", async () => {
    const { data, error } = await client.auth.mfa.enroll({ factorType: "totp", friendlyName: "Sathishram School" });
    if (error) return reportError(error);
    pendingFactor = data;
    const qr = document.getElementById("mfa-qr");
    qr.src = data.totp.qr_code;
    qr.hidden = false;
    document.getElementById("mfa-secret").textContent = data.totp.secret;
    document.getElementById("mfa-verify-form").hidden = false;
    showMessage("Scan the QR code with an authenticator app, then enter its six-digit code.");
  });

  document.getElementById("mfa-verify-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!pendingFactor) return showMessage("Start authenticator setup first.", true);
    const { data: challenge, error: challengeError } = await client.auth.mfa.challenge({ factorId: pendingFactor.id });
    if (challengeError) return reportError(challengeError);
    const code = document.getElementById("mfa-code").value.trim();
    const { error } = await client.auth.mfa.verify({
      factorId: pendingFactor.id,
      challengeId: challenge.id,
      code
    });
    if (error) return reportError(error);
    event.currentTarget.reset();
    pendingFactor = null;
    document.getElementById("mfa-qr").hidden = true;
    document.getElementById("mfa-verify-form").hidden = true;
    await refreshMfa();
    showMessage("Authenticator protection is enabled.");
  });

  document.getElementById("mfa-disable")?.addEventListener("click", async (event) => {
    const factorId = event.currentTarget.dataset.factorId;
    if (!factorId) return showMessage("No verified authenticator is available to remove.", true);
    const { error } = await client.auth.mfa.unenroll({ factorId });
    if (error) return reportError(error);
    await refreshMfa();
    showMessage("Authenticator protection is disabled.");
  });

  client.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    setAccountLinks(currentUser);
    if (profileView && !currentUser) showAccountView("sign-in");
  });

  loadSession().catch(reportError);
})();
