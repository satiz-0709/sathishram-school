(() => {
  const ids = ["idea", "visual", "code", "check"];
  const names = { idea: "The idea", visual: "Visual walkthrough", code: "Code example", check: "Quick check" };
  window.createLessonSectionProgress = ({ course, getIndex, getCompleted, setCompleted, saveCompleted, onChange }) => {
    const key = `sathishram-${course}-section-progress`;
    let saved = {};
    try { const value = JSON.parse(localStorage.getItem(key) || "{}"); if (value && typeof value === "object" && !Array.isArray(value)) saved = value; } catch { saved = {}; }
    const save = () => localStorage.setItem(key, JSON.stringify(saved));
    const setPart = (index, id, done) => {
      saved[index] = { ...(saved[index] || {}), [id]: done }; save();
      const complete = new Set(getCompleted());
      if (ids.every((part) => saved[index][part])) complete.add(index); else complete.delete(index);
      setCompleted(complete); saveCompleted();
      if (index === getIndex()) { render(); onChange(); }
    };
    const render = () => {
      const main = document.querySelector(".lesson-main"); if (!main) return;
      const sections = [...main.querySelectorAll(":scope > section")];
      sections.forEach((section) => {
        if (section.classList.contains("concept-card")) section.dataset.progressPart = "idea";
        else if (section.classList.contains("visual-card")) section.dataset.progressPart = "visual";
        else if (section.classList.contains("code-card")) section.dataset.progressPart = "code";
        else if (section.classList.contains("practice-card")) section.dataset.progressPart = "check";
      });
      const tracked = sections.filter((section) => Object.hasOwn(names, section.dataset.progressPart));
      if (!tracked.length) return;
      const index = getIndex();
      if (getCompleted().has(index) && !saved[index]) { saved[index] = Object.fromEntries(ids.map((id) => [id, true])); save(); }
      const parts = saved[index] || {};
      let progress = main.querySelector(":scope > .lesson-section-progress");
      if (!progress) {
        progress = document.createElement("section"); progress.className = "lesson-section-progress"; progress.setAttribute("aria-label", "Lesson section completion");
        const heading = document.createElement("div"); heading.className = "lesson-section-progress-heading";
        const label = document.createElement("span"); label.textContent = "LESSON CHECKLIST";
        const count = document.createElement("strong"); count.className = "lesson-section-progress-count"; heading.append(label, count);
        const track = document.createElement("div"); track.className = "lesson-section-progress-track"; track.setAttribute("role", "progressbar"); track.setAttribute("aria-label", "Lesson section completion"); track.setAttribute("aria-valuemin", "0"); track.setAttribute("aria-valuemax", String(ids.length));
        const fill = document.createElement("span"); track.append(fill); progress.append(heading, track); progress._count = count; progress._track = track; progress._fill = fill;
        main.insertBefore(progress, tracked[0]);
      }
      const doneCount = ids.filter((id) => parts[id]).length;
      progress._count.textContent = `${doneCount} / ${ids.length} sections complete`; progress._track.setAttribute("aria-valuenow", String(doneCount)); progress._fill.style.width = `${doneCount / ids.length * 100}%`;
      tracked.forEach((section) => {
        const id = section.dataset.progressPart; let button = section.querySelector(".lesson-part-complete");
        if (!button) {
          button = document.createElement("button"); button.type = "button"; button.className = "lesson-part-complete";
          const host = section.querySelector(".section-content") || section.querySelector(".practice-body") || (section.classList.contains("practice-card") ? section.querySelector(":scope > div") : section);
          host.append(button);
          button.addEventListener("click", () => setPart(getIndex(), id, !(saved[getIndex()] || {})[id]));
        }
        const isDone = !!parts[id]; button.classList.toggle("is-complete", isDone); button.setAttribute("aria-pressed", String(isDone)); button.textContent = isDone ? "\u2713 Section complete \u00b7 Undo" : "Mark section complete";
      });
    };
    return {
      render,
      setPart,
      setAll(index, done) {
        saved[index] = Object.fromEntries(ids.map((id) => [id, done])); save();
        const complete = new Set(getCompleted()); if (done) complete.add(index); else complete.delete(index);
        setCompleted(complete); saveCompleted(); if (index === getIndex()) { render(); onChange(); }
      },
      reset() { saved = {}; localStorage.removeItem(key); render(); }
    };
  };
})();
