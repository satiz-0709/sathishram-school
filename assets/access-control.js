(() => {
  const requireLesson = async (_lessonIndex, onAllowed) => {
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

  const requireMember = async () => true;

  window.schoolCourseAccess = { requireLesson, startLesson, requireMember };
})();
