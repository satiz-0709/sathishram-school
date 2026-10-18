(() => {
  const paths = window.learningPaths || {};
  const params = new URLSearchParams(window.location.search);
  const requestedCourse = params.get("course");
  const courseId = requestedCourse && Object.hasOwn(paths, requestedCourse) ? requestedCourse : "django";
  const course = paths[courseId];
  const $ = (id) => document.getElementById(id);
  const storagePrefix = `school-path-${courseId}`;
  const completedKey = `${storagePrefix}-completed`;
  const sectionProgressKey = `${storagePrefix}-section-progress`;
  const lessonKey = `${storagePrefix}-lesson`;
  const themeKey = "sathishram-display-mode";
  const paletteKey = "sathishram-color-theme";
  const body = document.body;
  let completed = readCompleted();
  let sectionProgress = readSectionProgress();
  const allSectionsExpanded = true;
  const requestedLesson = new URLSearchParams(location.hash.slice(1)).get("lesson");
  const requestedLessonIndex = requestedLesson === null ? -1 : Number(requestedLesson) - 1;
  let currentIndex = Math.min(Math.max(requestedLessonIndex >= 0 ? requestedLessonIndex : parseInt(localStorage.getItem(lessonKey) || "0", 10) || 0, 0), course.lessons.length - 1);
  let currentView = "lesson";
  let mockOrder = [];
  let mockIndex = 0;
  let mockScore = 0;
  let mockAnswered = false;
  let voiceOrder = [];
  let voiceIndex = 0;
  let voiceCount = 0;
  let voiceScore = 0;
  let visualTimer;

  function readCompleted() {
    try { return JSON.parse(localStorage.getItem(completedKey) || "[]").filter((n) => Number.isInteger(n) && n >= 0 && n < course.lessons.length); }
    catch { return []; }
  }
  function readSectionProgress() {
    try {
      const progress = JSON.parse(localStorage.getItem(sectionProgressKey) || "{}");
      if (!progress || typeof progress !== "object" || Array.isArray(progress)) return {};
      Object.values(progress).forEach((parts) => {
        if (!parts || typeof parts !== "object" || Array.isArray(parts) || !Object.hasOwn(parts, "idea")) return;
        if (!Object.hasOwn(parts, "description")) parts.description = parts.idea;
        delete parts.idea;
      });
      return progress;
    } catch { return {}; }
  }
  const partIds = ["description", "visual", "example", "check"];
  function saveSectionProgress() { localStorage.setItem(sectionProgressKey, JSON.stringify(sectionProgress)); }
  function currentParts() { return sectionProgress[currentIndex] || {}; }
  function markPart(id, value) {
    sectionProgress[currentIndex] = { ...currentParts(), [id]: value };
    saveSectionProgress();
    const done = partIds.every((part) => sectionProgress[currentIndex][part]);
    if (done && !completed.includes(currentIndex)) completed.push(currentIndex);
    if (!done) completed = completed.filter((index) => index !== currentIndex);
    completed.sort((a, b) => a - b); localStorage.setItem(completedKey, JSON.stringify(completed));
    renderProgress();
  }
  function markLessonComplete() {
    sectionProgress[currentIndex] = Object.fromEntries(partIds.map((part) => [part, true]));
    saveSectionProgress();
    if (!completed.includes(currentIndex)) completed.push(currentIndex);
    completed.sort((a, b) => a - b); localStorage.setItem(completedKey, JSON.stringify(completed)); renderProgress();
  }
  function renderLessonProgress() {
    const fill = $("path-lesson-progress-fill");
    const countEl = $("path-lesson-progress-count");
    const bar = fill?.parentElement;
    if (!fill || !countEl) return;
    const parts = currentParts(); const count = partIds.filter((part) => parts[part]).length;
    countEl.textContent = `${count} / ${partIds.length} sections complete`;
    fill.style.width = `${count / partIds.length * 100}%`;
    bar?.setAttribute("aria-valuenow", String(count));
    document.querySelectorAll(".path-part-complete").forEach((button) => {
      const done = !!parts[button.dataset.part || "check"];
      button.classList.toggle("is-complete", done); button.setAttribute("aria-pressed", String(done));
      const label = button.querySelector(".complete-label");
      if (label) label.textContent = done ? "Completed · Undo" : "Mark complete";
    });
  }
  function setTheme(theme) {
    const dark = theme === "dark";
    body.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.mode = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const toggle = $("path-theme-toggle");
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.querySelector(".mode-toggle-label").textContent = dark ? "Dark mode" : "Light mode";
    toggle.setAttribute("aria-label", `Display mode: ${dark ? "dark" : "light"}. Switch theme.`);
    localStorage.setItem(themeKey, dark ? "dark" : "light");
  }
  function setPalette(palette) {
    const valid = ["evergreen", "ocean", "violet", "sunset"].includes(palette) ? palette : "evergreen";
    document.documentElement.dataset.theme = valid;
    document.querySelectorAll("[data-theme-choice]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.themeChoice === valid)));
    localStorage.setItem(paletteKey, valid);
  }
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderShell() {
    document.title = `${course.title} | Sathishram School`;
    $("path-top-title").textContent = course.title;
    const courseCard = $("path-course-card");
    const cardTop = el("div", "course-card-top");
    const courseMark = el("span", "course-mark", course.mark);
    const level = el("span", "course-level", "BEGINNER → PRO");
    cardTop.append(courseMark, level);
    const progressRow = el("div", "progress-row");
    const progressTrack = el("div", "progress-track path-progress-track");
    const progressFill = el("span");
    progressFill.id = "path-progress-fill";
    progressTrack.setAttribute("role", "progressbar");
    progressTrack.setAttribute("aria-valuemin", "0");
    progressTrack.append(progressFill);
    const progressCount = el("span");
    progressCount.id = "path-progress-count";
    progressRow.append(progressTrack, progressCount);
    courseCard.replaceChildren(cardTop, el("strong", "", course.title), progressRow, el("small", "", `${course.lessons.length} lessons · saved on this device`));
    $("path-title").textContent = course.title;
    $("path-summary").textContent = course.summary;
    $("path-category").textContent = course.category;
    $("path-course-mark").textContent = course.mark;
    const references = course.references || (course.reference ? [{ label: course.reference[0], url: course.reference[1] }] : []);
    const referenceLine = $("path-reference");
    referenceLine.replaceChildren(document.createTextNode("Further reading: "));
    references.forEach((reference, index) => {
      if (index) referenceLine.append(document.createTextNode(" · "));
      const link = el("a", "", `${reference.label} ↗`); link.href = reference.url; link.target = "_blank"; link.rel = "noopener noreferrer"; referenceLine.append(link);
    });
    const nav = $("path-lesson-list");
    const groups = new Map();
    course.lessons.forEach((lesson, index) => {
      const moduleName = lesson.module || "Lessons";
      if (!groups.has(moduleName)) {
        const group = el("section", "path-module-group collapsed");
        const heading = el("button", "path-module-title", moduleName);
        heading.type = "button"; heading.setAttribute("aria-expanded", "false");
        heading.addEventListener("click", () => {
          const collapsed = group.classList.toggle("collapsed"); heading.setAttribute("aria-expanded", String(!collapsed));
          const allExpanded = [...nav.querySelectorAll(".path-module-group")].every((item) => !item.classList.contains("collapsed"));
          $("path-expand-curriculum").textContent = allExpanded ? "Collapse all" : "Expand all";
        });
        group.append(heading); groups.set(moduleName, group);
      }
      const button = el("button", "path-lesson-link"); button.type = "button"; button.dataset.index = String(index); button.dataset.search = `${moduleName} ${lesson.title}`.toLowerCase();
      const dot = el("span", "path-lesson-dot", completed.includes(index) ? "✓" : String(index + 1).padStart(2, "0"));
      button.append(dot, el("span", "", lesson.title)); button.addEventListener("click", () => { showLesson(index); showView("lesson"); closeMobileNav(); });
      groups.get(moduleName).append(button);
    });
    nav.replaceChildren(...groups.values());
    $("path-curriculum-count").textContent = String(course.lessons.length);
    $("path-search").addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();
      nav.querySelectorAll(".path-module-group").forEach((group) => {
        let visible = 0;
        group.querySelectorAll(".path-lesson-link").forEach((button) => { const show = !query || button.dataset.search.includes(query); button.hidden = !show; if (show) visible += 1; });
        group.hidden = visible === 0;
      });
    });
    renderTabs();
  }
  const views = [["lesson", "Learning path"], ["cheatsheet", "Interview cheat sheet"], ["interview", "Interview questions"], ["examples", "Code examples"], ["mock", "Mock exam"]];
  function renderTabs() {
    const tabs = $("path-study-tabs");
    const icons = { lesson: "book", cheatsheet: "file", interview: "question", examples: "code", mock: "spark" };
    tabs.replaceChildren(...views.map(([id, label]) => {
      const button = el("button", "path-study-tab"); button.type = "button"; button.dataset.view = id;
      const icon = el("span", "path-tab-icon"); icon.innerHTML = schoolIcon(icons[id]);
      button.append(icon, el("span", "path-tab-label", label));
      if (id === "interview" || id === "examples") button.append(el("b", "", String(course.lessons.length)));
      button.addEventListener("click", () => { void showView(id); }); return button;
    }));
  }
  function renderProgress() {
    const progressCount = $("path-progress-count");
    const progressFill = $("path-progress-fill");
    const completeButton = $("path-complete");
    const percent = Math.round(completed.length / course.lessons.length * 100);
    if (progressCount) progressCount.textContent = `${completed.length} / ${course.lessons.length}`;
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
      progressFill.parentElement?.setAttribute("aria-valuenow", String(completed.length));
      progressFill.parentElement?.setAttribute("aria-valuemax", String(course.lessons.length));
      progressFill.parentElement?.setAttribute("aria-label", `Course progress: ${percent}%`);
    }
    const lessonList = $("path-lesson-list");
    lessonList?.querySelectorAll(".path-lesson-link").forEach((button) => {
      const index = Number(button.dataset.index); button.classList.toggle("active", index === currentIndex); button.classList.toggle("done", completed.includes(index));
      const dot = button.querySelector(".path-lesson-dot"); if (dot) dot.textContent = completed.includes(index) ? "\u2713" : String(index + 1).padStart(2, "0");
    });
    const lessonDone = completed.includes(currentIndex);
    if (completeButton) {
      completeButton.classList.toggle("done", lessonDone);
      const label = completeButton.querySelector(".complete-label"); if (label) label.textContent = lessonDone ? "Completed" : "Mark complete";
      completeButton.setAttribute("aria-pressed", String(lessonDone));
    }
    renderLessonProgress();
  }
  function addSection(parent, id, title, content, className = "") {
    const details = el("details", `path-section ${className}`); details.id = `path-section-${id}`; details.open = allSectionsExpanded; details.dataset.part = id;
    details.append(el("summary", "", title)); const panel = el("div", "path-section-body"); panel.append(...content);
    const complete = el("button", "path-part-complete"); complete.type = "button"; complete.dataset.part = id;
    complete.append(el("span", "complete-check"), el("span", "complete-label", "Mark complete"));
    complete.addEventListener("click", (event) => { event.preventDefault(); event.stopPropagation(); markPart(id, !currentParts()[id]); });
    panel.append(complete); details.append(panel); parent.append(details); return details;
  }
  function stagesFor(lesson) {
    if (Array.isArray(lesson.visual) && lesson.visual.length) return lesson.visual.slice(0, 5).map((item) => typeof item === "string" ? item : item.label || item.title || String(item));
    const title = lesson.title.toLowerCase(); const module = (lesson.module || "").toLowerCase();
    if (/api|fastapi|django|request|route|endpoint|payload|http/.test(`${title} ${module}`)) return ["Client sends request", "Validate path and payload", "Run application logic", "Return structured response"];
    if (/agent|tool|graph|workflow|langchain/.test(`${title} ${module}`)) return ["Receive task and context", "Choose next step", "Call model or tool", "Return result or continue"];
    if (/evaluation|eval|test|quality/.test(`${title} ${module}`)) return ["Prepare test cases", "Run the system", "Measure expected signals", "Review failures and improve"];
    if (/model|token|prompt|llm|fine.?tun/.test(`${title} ${module}`)) return ["Prepare input", "Select model and settings", "Generate response", "Review output and usage"];
    return ["Prepare input and context", "Apply the lesson concept", "Process or retrieve data", "Inspect the result"];
  }
  function buildVisual(lesson) {
    clearInterval(visualTimer); visualTimer = null;
    const wrap = el("div", "path-visual-wrap");
    const caption = el("p", "path-visual-caption", "Follow each stage to see how the pieces connect.");
    const stages = stagesFor(lesson);
    const visual = buildAIConceptVisual({ ...lesson, module: lesson.module || course.category }, stages);
    const controls = el("div", "path-visual-controls");
    const run = el("button", "flow-play-button path-visual-play", "Run simulation"); run.type = "button";
    const status = el("span", "path-visual-status", "Choose a numbered step or run the walkthrough."); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    let position = 0;
    const paint = (index) => { position = index; visual.element.updateStep(index); status.textContent = `Step ${index + 1} of ${stages.length}: ${stages[index]}`; };
    visual.element.querySelectorAll(".simulation-step").forEach((button) => button.addEventListener("click", () => {
      clearInterval(visualTimer); visualTimer = null; paint(Number(button.dataset.index)); run.textContent = position === stages.length - 1 ? "Replay simulation" : "Resume simulation";
    }));
    run.addEventListener("click", () => {
      if (visualTimer) { clearInterval(visualTimer); visualTimer = null; run.textContent = "Resume simulation"; status.textContent = `Paused at step ${position + 1} of ${stages.length}.`; return; }
      if (position >= stages.length - 1) paint(0);
      run.textContent = "Pause simulation";
      visualTimer = setInterval(() => {
        if (position >= stages.length - 1) { clearInterval(visualTimer); visualTimer = null; run.textContent = "Replay simulation"; return; }
        paint(position + 1);
      }, 1000);
    });
    paint(0); controls.append(run, status); wrap.append(caption, visual.element, controls); return wrap;
  }
  function renderLesson(index) {
    if (window.lessonNarrator) window.lessonNarrator.stop();
    currentIndex = index; localStorage.setItem(lessonKey, String(index)); const lesson = course.lessons[index];
    $("path-category").textContent = lesson.module || course.category;
    $("path-lesson-number").textContent = `LESSON ${String(index + 1).padStart(2, "0")} / ${String(course.lessons.length).padStart(2, "0")}`;
    $("path-lesson-duration").textContent = lesson.duration; $("path-title").textContent = lesson.title;
    $("path-lesson-goal").textContent = lesson.heading || lesson.intro;
    $("path-lesson-timer").textContent = lesson.duration;
    $("path-lesson-tip").textContent = lesson.tip || lesson.intro;
    const article = $("path-lesson-content"); article.replaceChildren($("path-lesson-progress"));
    const intro = el("p", "", lesson.intro);
    const descriptionDetails = el("details", "path-description-details"); const summary = el("summary", "", "More details");
    const detailBody = el("div", "path-description-details-body");
    const detailList = el("ul"); lesson.bullets.forEach((text) => detailList.append(el("li", "", text)));
    const tip = el("div", "path-tip", `Keep in mind: ${lesson.tip}`);
    const illustration = buildLessonDescriptionIllustration(lesson, stagesFor(lesson));
    const figure = el("figure", "description-illustration"); figure.append(illustration);
    detailBody.append(detailList, tip, figure);
    descriptionDetails.append(summary, detailBody);
    addSection(article, "description", "Description", [intro, descriptionDetails]);
    addSection(article, "visual", "Visual walkthrough", [buildVisual(lesson)]);
    const label = el("div", "path-code-label", "PRACTICAL EXAMPLE"); const pre = el("pre"); const code = el("code", "", lesson.code); pre.append(code);
    const copy = el("button", "path-copy-code", "Copy code"); copy.type = "button"; copy.addEventListener("click", () => copyText(lesson.code, copy));
    addSection(article, "example", "Example code", [label, pre, copy]);
    const showExplorer = courseId === "rag" && lesson.title === "Types of RAG: architecture patterns";
    const ragDisclosure = $("path-rag-explorer-disclosure");
    ragDisclosure.hidden = !showExplorer;
    ragDisclosure.open = allSectionsExpanded;
    if (window.renderRagExplorer) window.renderRagExplorer(showExplorer);
    $("path-question").textContent = lesson.question; $("path-feedback").textContent = "";
    const options = $("path-options"); options.replaceChildren(...lesson.options.map((text, optionIndex) => {
      const button = el("button", "path-option", text); button.type = "button";
      button.addEventListener("click", () => { [...options.children].forEach((item) => { item.disabled = true; }); if (optionIndex === lesson.answer) { button.classList.add("correct"); $("path-feedback").textContent = "Correct. You can move on when ready."; markPart("check", true); } else { button.classList.add("incorrect"); options.children[lesson.answer].classList.add("correct"); $("path-feedback").textContent = "Not quite. The highlighted answer is the best fit for this lesson."; } }); return button;
    }));
    const checkComplete = $("path-check-complete"); checkComplete.dataset.part = "check";
    checkComplete.onclick = () => markPart("check", !currentParts().check);
    const toc = $("path-lesson-toc");
    const tocEntries = [...article.querySelectorAll(":scope > details.path-section")].map((section) => ({
      id: section.id,
      title: section.querySelector("summary").textContent
    }));
    tocEntries.push({ id: "path-check", title: "Quick check" });
    toc.replaceChildren(...tocEntries.map((entry, index) => {
      const link = el("a", "aside-link");
      link.href = `#${entry.id}`;
      link.append(el("span", "", String(index + 1).padStart(2, "0")), document.createTextNode(entry.title));
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const target = document.getElementById(entry.id);
        if (target instanceof HTMLDetailsElement) target.open = true;
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return link;
    }));
    if (completed.includes(index) && !sectionProgress[index]) { sectionProgress[index] = Object.fromEntries(partIds.map((part) => [part, true])); saveSectionProgress(); }
    $("path-prev").disabled = index === 0; $("path-next").disabled = index === course.lessons.length - 1; renderProgress();
  }
  function showLesson(index) {
    void window.schoolCourseAccess.requireLesson(index, () => renderLesson(index));
  }
  async function copyText(value, button) {
    try { await navigator.clipboard.writeText(value); button.textContent = "Copied ✓"; }
    catch { button.textContent = "Select code to copy"; }
    setTimeout(() => { if (button.isConnected) button.textContent = "Copy code"; }, 1500);
  }
  async function showView(view) {
    if (view !== "lesson" && !(await window.schoolCourseAccess.requireMember())) return;
    currentView = view; document.body.dataset.printView = view;
    $("path-resource-accordion").open = view !== "lesson";
    $("path-lesson-view").hidden = view !== "lesson"; $("path-resource-view").hidden = view === "lesson";
    $("path-curriculum-accordion").hidden = view !== "lesson";
    $("path-search").closest(".search-box").hidden = view !== "lesson";
    $("path-study-tabs").querySelectorAll(".path-study-tab").forEach((button) => { const active = button.dataset.view === view; button.classList.toggle("active", active); button.setAttribute("aria-pressed", String(active)); });
    if (view !== "lesson") renderResource(view);
    closeMobileNav();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("path-expand-curriculum").addEventListener("click", () => {
    const groups = [...$("path-lesson-list").querySelectorAll(".path-module-group")];
    const expand = groups.some((group) => group.classList.contains("collapsed"));
    groups.forEach((group) => {
      group.classList.toggle("collapsed", !expand);
      group.querySelector(".path-module-title")?.setAttribute("aria-expanded", String(expand));
    });
    $("path-expand-curriculum").textContent = expand ? "Collapse all" : "Expand all";
  });
  function resourceHeader(title, description, searchable = false) {
    const root = $("path-resource-view"); root.replaceChildren(); const header = el("header", "path-resource-header"); header.append(el("span", "path-eyebrow", `${course.title.toUpperCase()} · STUDY RESOURCES`), el("h1", "", title), el("p", "", description));
    const tools = el("div", "path-resource-tools");
    if (searchable) { const input = el("input", "path-resource-search"); input.type = "search"; input.placeholder = `Search ${title.toLowerCase()}…`; input.setAttribute("aria-label", `Search ${title}`); input.addEventListener("input", () => { const q = input.value.toLowerCase().trim(); root.querySelectorAll("[data-resource-search]").forEach((item) => { item.hidden = !!q && !item.dataset.resourceSearch.includes(q); }); }); tools.append(input); }
    const actions = el("div", "path-resource-actions");
    if (title === "Course cheat sheet") { const print = el("button", "path-secondary-button path-print-button", "Print / Save PDF"); print.type = "button"; print.addEventListener("click", printCheatSheet); actions.append(print); }
    if (actions.childElementCount) tools.append(actions);
    if (tools.childElementCount) header.append(tools);
    root.append(header); return root;
  }
  function printCheatSheet() {
    const root = $("path-resource-view"); const previous = [...root.querySelectorAll("details")].map((item) => item.open);
    const search = root.querySelector(".path-resource-search"); const query = search?.value || "";
    if (search) { search.value = ""; search.dispatchEvent(new Event("input")); }
    root.querySelectorAll("details").forEach((item) => { item.open = true; }); document.body.dataset.printView = "cheatsheet";
    window.addEventListener("afterprint", () => {
      root.querySelectorAll("details").forEach((item, index) => { item.open = (previous[index] !== undefined ? previous[index] : true); });
      if (search) { search.value = query; search.dispatchEvent(new Event("input")); }
    }, { once: true });
    window.print();
  }
  function answerFor(lesson) { return lesson.options?.[lesson.answer] || "Review the example and key ideas in this lesson."; }
  function resourceCard(parent, title, module, content, searchText) {
    const card = el("details", "path-resource-card"); card.open = allSectionsExpanded; card.dataset.resourceSearch = `${module} ${title} ${searchText || ""}`.toLowerCase();
    card.append(el("summary", "", title)); const body = el("div", "path-resource-card-body"); body.append(el("span", "path-resource-module", module), ...content); card.append(body); parent.append(card); return card;
  }
  function renderResource(view) {
    const root = $("path-resource-view");
    if (view === "cheatsheet") {
      resourceHeader("Course cheat sheet", "A compact review of each lesson’s main ideas, reminders, and code pattern.", true);
      const list = el("div", "path-resource-list"); course.lessons.forEach((lesson) => { const bullets = el("ul"); lesson.bullets.forEach((item) => bullets.append(el("li", "", item))); const code = el("pre"); code.append(el("code", "", lesson.code)); resourceCard(list, lesson.title, lesson.module || course.category, [el("p", "", lesson.tip), bullets, code], `${lesson.intro} ${lesson.tip} ${lesson.code}`); }); root.append(list);
    } else if (view === "interview") {
      resourceHeader("Interview questions", "Practice the core question from every lesson, then reveal the answer and code reference.", true);
      const list = el("div", "path-resource-list"); course.lessons.forEach((lesson, index) => { const q = el("p", "path-interview-question", lesson.question); const answer = el("p", "", `Answer: ${answerFor(lesson)}`); const code = el("pre"); code.append(el("code", "", lesson.code)); resourceCard(list, `${String(index + 1).padStart(2, "0")}. ${lesson.title}`, lesson.module || course.category, [q, answer, code], `${lesson.question} ${answerFor(lesson)} ${lesson.title}`); }); root.append(list);
    } else if (view === "examples") {
      resourceHeader("Code examples", "Browse the lesson snippets by topic. Copy a snippet to try it in your own project.", true);
      const list = el("div", "path-resource-list path-example-list"); course.lessons.forEach((lesson, index) => { const pre = el("pre"); pre.append(el("code", "", lesson.code)); const copy = el("button", "path-copy-code", "Copy code"); copy.type = "button"; copy.addEventListener("click", () => copyText(lesson.code, copy)); resourceCard(list, `${String(index + 1).padStart(2, "0")}. ${lesson.title}`, lesson.module || course.category, [el("p", "", lesson.intro), pre, copy], `${lesson.title} ${lesson.intro} ${lesson.code}`); }); root.append(list);
    } else if (view === "mock") renderMock(root);
  }
  function renderMock(root) {
    resourceHeader("Mock exam", "Choose voice practice or a multiple-choice exam. Each question is based on this course and includes a lesson reference.");
    if (!mockOrder.length || mockIndex >= mockOrder.length) {
      mockOrder = course.lessons.map((_, i) => i).sort(() => Math.random() - 0.5);
      mockIndex = 0;
      mockScore = 0;
    }
    if (!voiceOrder.length || voiceIndex >= voiceOrder.length) {
      voiceOrder = course.lessons.map((_, i) => i).sort(() => Math.random() - 0.5);
      voiceIndex = 0;
    }

    const tabs = el("div", "path-mock-tabs");
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Mock exam mode");
    const voiceTab = el("button", "path-mock-tab", "Voice practice");
    voiceTab.type = "button";
    voiceTab.id = "path-mock-voice-tab";
    voiceTab.setAttribute("role", "tab");
    voiceTab.setAttribute("aria-controls", "path-mock-voice-panel");
    const bestTab = el("button", "path-mock-tab", "Choose the best answer");
    bestTab.type = "button";
    bestTab.id = "path-mock-best-tab";
    bestTab.setAttribute("role", "tab");
    bestTab.setAttribute("aria-controls", "path-mock-best-panel");
    const voicePanel = el("section", "path-mock-panel path-mock-mode-panel");
    voicePanel.id = "path-mock-voice-panel";
    voicePanel.setAttribute("role", "tabpanel");
    voicePanel.setAttribute("aria-labelledby", voiceTab.id);
    const bestPanel = el("section", "path-mock-panel path-mock-mode-panel");
    bestPanel.id = "path-mock-best-panel";
    bestPanel.setAttribute("role", "tabpanel");
    bestPanel.setAttribute("aria-labelledby", bestTab.id);
    tabs.append(voiceTab, bestTab);
    root.append(tabs, voicePanel, bestPanel);

    renderBestAnswerPanel(bestPanel, root);
    renderVoicePracticePanel(voicePanel, root);
    const activate = (voiceActive, focus = false) => {
      voiceTab.classList.toggle("active", voiceActive);
      voiceTab.setAttribute("aria-selected", String(voiceActive));
      voiceTab.tabIndex = voiceActive ? 0 : -1;
      bestTab.classList.toggle("active", !voiceActive);
      bestTab.setAttribute("aria-selected", String(!voiceActive));
      bestTab.tabIndex = voiceActive ? -1 : 0;
      voicePanel.hidden = !voiceActive;
      bestPanel.hidden = voiceActive;
      if (focus) (voiceActive ? voiceTab : bestTab).focus();
    };
    voiceTab.addEventListener("click", () => activate(true));
    bestTab.addEventListener("click", () => activate(false));
    tabs.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      activate(event.key === "Home" || event.key === "ArrowLeft", true);
    });
    activate(true);
  }

  function renderBestAnswerPanel(panel, root) {
    const index = mockOrder[mockIndex];
    const lesson = course.lessons[index];
    mockAnswered = false;
    const options = el("div", "path-options");
    const feedback = el("p", "path-feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    const footer = el("div", "path-mock-footer");
    const score = el("span", "path-mock-score", `Score: ${mockScore} / ${mockIndex}`);
    const next = el("button", "path-run-button", mockIndex === mockOrder.length - 1 ? "Finish exam" : "Next question");
    next.type = "button";
    lesson.options.forEach((option, choice) => {
      const button = el("button", "path-option", option);
      button.type = "button";
      button.addEventListener("click", () => {
        if (mockAnswered) return;
        mockAnswered = true;
        options.querySelectorAll("button").forEach((item) => { item.disabled = true; });
        if (choice === lesson.answer) {
          button.classList.add("correct");
          mockScore += 1;
          feedback.textContent = "Correct — nice work.";
        } else {
          button.classList.add("incorrect");
          options.children[lesson.answer].classList.add("correct");
          feedback.textContent = `Review: ${answerFor(lesson)}`;
        }
        score.textContent = `Score: ${mockScore} / ${mockIndex + 1}`;
      });
      options.append(button);
    });
    next.addEventListener("click", () => {
      if (!mockAnswered) { feedback.textContent = "Choose an answer to continue."; return; }
      mockIndex += 1;
      if (mockIndex >= mockOrder.length) {
        panel.replaceChildren(el("h2", "", `Your score: ${mockScore} / ${mockOrder.length}`));
        const again = el("button", "path-run-button", "Start another attempt");
        again.type = "button";
        again.addEventListener("click", () => {
          mockOrder = [];
          mockIndex = 0;
          renderMock(root);
        });
        panel.append(again);
        return;
      }
      renderMock(root);
    });
    footer.append(score, next);
    const heading = el("div", "path-mock-meta", `QUESTION ${mockIndex + 1} / ${mockOrder.length} · SCORE ${mockScore}`);
    const codeDetails = el("details", "path-section");
    codeDetails.open = allSectionsExpanded;
    codeDetails.append(el("summary", "", "Review the lesson code (reference only)"));
    const codePre = el("pre");
    codePre.append(el("code", "", lesson.code));
    codeDetails.append(codePre);
    panel.replaceChildren(
      heading,
      el("h2", "", lesson.question),
      el("p", "path-resource-module", `${lesson.module || course.category} · ${lesson.title}`),
      options,
      feedback,
      footer,
      codeDetails
    );
  }

  function renderVoicePracticePanel(panel, root) {
    const lesson = course.lessons[voiceOrder[voiceIndex]];
    let reviewed = false;
    let recognition;
    let listening = false;
    panel.replaceChildren(
      el("div", "path-mock-meta", `SPEAKING PRACTICE · QUESTION ${voiceCount + 1} · SCORE ${voiceScore}/${voiceCount}`),
      el("h2", "", lesson.question),
      el("p", "path-resource-module", `${lesson.module || course.category} · ${lesson.title}`)
    );
    const answer = el("textarea", "path-voice-answer");
    answer.rows = 5;
    answer.placeholder = "Speak or type your explanation...";
    answer.setAttribute("aria-label", "Your spoken or typed answer");
    const actions = el("div", "path-mock-footer");
    const speechButton = el("button", "path-secondary-button", "Answer by voice");
    speechButton.type = "button";
    const reviewButton = el("button", "path-run-button", "Review answer");
    reviewButton.type = "button";
    const nextButton = el("button", "path-secondary-button", "Next question");
    nextButton.type = "button";
    const finishButton = el("button", "path-secondary-button", "Finish practice");
    finishButton.type = "button";
    const status = el("p", "path-voice-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const feedback = el("p", "path-feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");
    const SpeechAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      speechButton.disabled = true;
      status.textContent = "Speech recognition is not supported in this browser. Type your answer instead.";
    } else {
      recognition = new SpeechAPI();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.onresult = (event) => {
        answer.value = Array.from(event.results).map((result) => result[0].transcript).join("");
      };
      recognition.onerror = (event) => {
        listening = false;
        speechButton.textContent = "Answer by voice";
        speechButton.setAttribute("aria-pressed", "false");
        status.textContent = `Speech input stopped: ${event.error}. You can type your answer.`;
      };
      recognition.onend = () => {
        listening = false;
        speechButton.textContent = "Answer by voice";
        speechButton.setAttribute("aria-pressed", "false");
        if (answer.value.trim()) status.textContent = "Transcript ready. Review or edit it before checking your answer.";
      };
      speechButton.addEventListener("click", () => {
        if (listening) { recognition.stop(); return; }
        try {
          status.textContent = "Listening…";
          speechButton.textContent = "Stop listening";
          speechButton.setAttribute("aria-pressed", "true");
          listening = true;
          recognition.start();
        } catch {
          listening = false;
          speechButton.textContent = "Answer by voice";
          speechButton.setAttribute("aria-pressed", "false");
          status.textContent = "Could not start speech input. Check microphone access or type your answer.";
        }
      });
    }
    reviewButton.addEventListener("click", () => {
      if (reviewed) return;
      if (!answer.value.trim()) {
        feedback.textContent = "Speak or type an answer before reviewing it.";
        return;
      }
      const reference = answerFor(lesson);
      const terms = [...new Set(reference.toLowerCase().match(/[a-z][a-z0-9_+#.-]{3,}/g) || [])];
      const submitted = new Set(answer.value.toLowerCase().match(/[a-z][a-z0-9_+#.-]{3,}/g) || []);
      const matched = terms.filter((term) => submitted.has(term)).length;
      reviewed = true;
      voiceCount += 1;
      if (terms.length && matched / terms.length >= 0.35) voiceScore += 1;
      panel.querySelector(".path-mock-meta").textContent = `SPEAKING PRACTICE · QUESTION ${voiceCount} · SCORE ${voiceScore}/${voiceCount}`;
      feedback.textContent = `Reference check: ${matched} of ${terms.length} key terms found. Compare with the reference answer: ${reference}`;
    });
    nextButton.addEventListener("click", () => {
      if (listening) recognition.stop();
      voiceIndex = (voiceIndex + 1) % voiceOrder.length;
      renderVoicePracticePanel(panel, root);
    });
    finishButton.addEventListener("click", () => {
      if (listening) recognition.stop();
      panel.replaceChildren(el("div", "path-mock-meta", "VOICE PRACTICE RESULTS"), el("h2", "", `You covered ${voiceScore} of ${voiceCount} answers.`));
      panel.append(el("p", "path-voice-status", "The score is a keyword-match estimate, not an AI evaluation. Compare your spoken answers with the lesson references to assess their accuracy and depth."));
      const again = el("button", "path-run-button", "Practice again"); again.type = "button";
      again.addEventListener("click", () => {
        voiceOrder = [];
        voiceIndex = 0;
        voiceCount = 0;
        voiceScore = 0;
        renderMock(root);
      });
      panel.append(again);
    });
    actions.append(speechButton, reviewButton, nextButton, finishButton);
    panel.append(answer, actions, status, feedback);
  }
  $("path-complete")?.addEventListener("click", markLessonComplete);
  $("path-prev").addEventListener("click", () => { if (currentIndex > 0) showLesson(currentIndex - 1); });
  $("path-next").addEventListener("click", () => { if (currentIndex < course.lessons.length - 1) showLesson(currentIndex + 1); });
  function closeMobileNav() {
    $("sidebar").classList.remove("open");
    $("mobile-scrim").classList.remove("show");
    $("menu-button").setAttribute("aria-expanded", "false");
  }
  $("menu-button").addEventListener("click", () => {
    $("sidebar").classList.add("open");
    $("mobile-scrim").classList.add("show");
    $("menu-button").setAttribute("aria-expanded", "true");
    $("path-study-tabs").querySelector("button")?.focus();
  });
  $("mobile-scrim").addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMobileNav(); });
  $("path-settings-toggle").addEventListener("click", () => {
    const panel = $("path-settings-panel"); const open = panel.hidden; panel.hidden = !open;
    $("path-settings-toggle").setAttribute("aria-expanded", String(open));
  });
  $("path-theme-toggle").addEventListener("click", () => setTheme(body.dataset.theme === "dark" ? "light" : "dark"));
  document.querySelectorAll("[data-theme-choice]").forEach((button) => button.addEventListener("click", () => setPalette(button.dataset.themeChoice)));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".path-settings-control")) { $("path-settings-panel").hidden = true; $("path-settings-toggle").setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") { $("path-settings-panel").hidden = true; $("path-settings-toggle").setAttribute("aria-expanded", "false"); } });
  $("path-clear-progress").addEventListener("click", () => {
    if (!window.confirm(`Clear saved ${course.title} lesson progress? This will restart at the first lesson.`)) return;
    completed = []; sectionProgress = {}; localStorage.removeItem(completedKey); localStorage.removeItem(sectionProgressKey); localStorage.removeItem(lessonKey);
    $("path-search").value = ""; $("path-search").dispatchEvent(new Event("input")); showLesson(0); showView("lesson");
  });
  window.lessonNarrator = setupLessonAudio(() => course.lessons[currentIndex], false);
  setPalette(localStorage.getItem(paletteKey) || "evergreen"); setTheme(localStorage.getItem(themeKey) || "light"); renderShell(); showLesson(currentIndex); void showView("lesson");
})();
