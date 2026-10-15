(() => {
  const freeLessonCount = 4;
  const config = window.SATHISHRAM_SUPABASE;
  const accountPath = location.pathname.includes("/tutorial/") ? "../account.html" : "account.html";
  const client = window.supabase && config?.url && config?.anonKey
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;
  let currentUser = null;

  const sessionReady = client
    ? client.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      currentUser = data.session?.user || null;
      return currentUser;
    }).catch((error) => {
      console.error("Unable to verify the current account session.", error);
      return null;
    })
    : Promise.resolve(null);

  const makeLoginUrl = (lessonIndex) => {
    const returnTo = `${location.pathname}${location.search}#lesson=${lessonIndex + 1}`;
    const url = new URL(accountPath, location.href);
    url.searchParams.set("returnTo", returnTo);
    url.searchParams.set("reason", "members");
    return url.href;
  };

  const askForSignIn = (lessonIndex) => {
    location.assign(makeLoginUrl(lessonIndex));
    return false;
  };

  const requireLesson = async (lessonIndex, onAllowed) => {
    const user = await sessionReady;
    if (!user && lessonIndex >= freeLessonCount) return askForSignIn(lessonIndex);
    onAllowed?.();
    return true;
  };

  const startLesson = async (savedIndex, onAllowed) => {
    const fragment = new URLSearchParams(location.hash.slice(1)).get("lesson");
    const requestedIndex = fragment === null ? savedIndex : Number(fragment) - 1;
    const lessonIndex = Number.isInteger(requestedIndex) && requestedIndex >= 0
      ? requestedIndex
      : 0;
    return requireLesson(lessonIndex, () => onAllowed(lessonIndex));
  };

  const requireMember = async () => {
    const user = await sessionReady;
    if (user) return true;
    const fragment = new URLSearchParams(location.hash.slice(1));
    const lesson = Number(fragment.get("lesson"));
    return askForSignIn(Number.isInteger(lesson) && lesson > 0 ? lesson - 1 : 0);
  };

  window.schoolCourseAccess = { requireLesson, startLesson, requireMember };
})();
