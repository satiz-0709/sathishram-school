(() => {
  const sampleModules = new Set(["python", "playwright", "django", "fastapi"]);
  const config = window.SATHISHRAM_SUPABASE;
  const hasSupabaseConfig = Boolean(window.supabase && config?.url && config?.anonKey);
  const client = hasSupabaseConfig ? window.supabase.createClient(config.url, config.anonKey) : null;
  const accountPath = location.pathname.includes("/tutorial/") ? "../account.html" : "account.html";

  const getModuleSlug = () => {
    if (location.pathname.endsWith("/python.html")) return "python";
    if (location.pathname.endsWith("/playwright.html")) return "playwright";
    if (location.pathname.endsWith("/ai-paths.html")) {
      return new URLSearchParams(location.search).get("course") || "ai-evaluation";
    }
    return null;
  };

  const loginUrl = (returnTo = `${location.pathname}${location.search}${location.hash}`) => {
    const url = new URL(accountPath, location.href);
    url.searchParams.set("returnTo", returnTo);
    url.searchParams.set("reason", "members");
    return url.href;
  };

  const lockModuleCard = (card) => {
    card.classList.add("course-choice-locked");
    card.setAttribute("aria-label", `${card.querySelector("h1")?.textContent || "Course"} — sign in to unlock`);
    const badge = document.createElement("span");
    badge.className = "course-lock-badge";
    badge.innerHTML = '<span data-icon="lock"></span> Sign in to unlock';
    card.append(badge);
    const destination = new URL(card.href);
    const returnTo = `${destination.pathname}${destination.search}${destination.hash}`;
    card.addEventListener("click", (event) => {
      event.preventDefault();
      location.assign(loginUrl(returnTo));
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        location.assign(loginUrl(returnTo));
      }
    });
  };

  const protectCoursePage = async (user) => {
    const moduleSlug = getModuleSlug();
    if (!moduleSlug || user || sampleModules.has(moduleSlug)) return;
    if (!sampleModules.has(moduleSlug) || !user) location.replace(loginUrl());
  };

  const applyAccess = async (user) => {
    const moduleCards = document.querySelectorAll(".course-choice[data-module]");
    if (!user) moduleCards.forEach((card) => {
      if (!sampleModules.has(card.dataset.module)) lockModuleCard(card);
    });
    document.documentElement.dataset.access = user ? "member" : "guest";
    await protectCoursePage(user);
  };

  if (!client) {
    void applyAccess(null);
    return;
  }

  client.auth.getSession()
    .then(({ data, error }) => {
      if (error) throw error;
      return applyAccess(data.session?.user || null);
    })
    .catch((error) => {
      console.error("Unable to verify the current account session.", error);
      void applyAccess(null);
    });
})();
