(() => {
  const paths = window.learningPaths || {};
  const params = new URLSearchParams(window.location.search);
  const requestedCourse = params.get("course");
  const courseId = requestedCourse && Object.hasOwn(paths, requestedCourse) ? requestedCourse : "django";
  const course = paths[courseId];
  const codeCourseIds = new Set(["django", "fastapi", "langchain", "langgraph", "rag", "mcp", "ai-evaluation"]);
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
  let codeWalkthroughTimer = null;

  function readCompleted() {
    try { return JSON.parse(localStorage.getItem(completedKey) || "[]").filter((n) => Number.isInteger(n) && n >= 0 && n < course.lessons.length); }
    catch { return []; }
  }
  function buildQaComparisonChart(lesson) {
    const title = lesson.title.toLowerCase();
    const models = [
      ["Waterfall", "Requirements → Design → Build → Test → Release", "Stable scope, formal approvals, predictable dependencies.", "Test planning starts from requirements; execution often occurs later, so use early reviews to reduce late risk."],
      ["V-model", "Requirements ↔ Acceptance tests · Design ↔ System/integration tests · Components ↔ Unit tests", "Traceability-heavy or regulated work with explicit verification.", "Plan the matching test level while each development artifact is defined."],
      ["Iterative / incremental", "Plan a slice → Build → Test → Review → Next slice", "Evolving needs and frequent stakeholder feedback.", "Test every increment and its impact on previously delivered behavior."],
      ["Prototyping", "Question → Prototype → User feedback → Refine or discard", "Uncertain requirements, workflows, or usability.", "Test assumptions early; do not treat an exploratory prototype as production-ready."],
      ["Spiral", "Set objectives → Analyze risk → Engineer & verify → Review next loop", "High uncertainty, complexity, or consequence.", "Each loop should reduce an explicit risk and document the evidence."],
      ["Agile / Scrum", "Refine → Sprint plan → Build & test → Review → Retrospective", "Adaptive product work with close team/customer collaboration.", "Testing is continuous within each sprint; done includes agreed quality evidence."],
      ["DevOps / continuous delivery", "Plan → Integrate → Verify → Deploy safely → Monitor → Learn", "Frequent releases with shared development/operations ownership.", "Automate fast checks, verify deployment, monitor production, and feed incidents into regression."]
    ];
    const techniques = [
      ["Static review", "Requirements, designs, and test cases", "Review artifacts against rules before execution; record questions and defects."],
      ["Equivalence partitions", "Inputs expected to behave alike", "Choose representative valid and invalid values from each class."],
      ["Boundary values", "Minimums, maximums, and limits", "Check just below, at, and just above each important boundary."],
      ["Decision tables", "Combinations of business conditions", "Map each meaningful condition combination to the expected action."],
      ["State transitions", "Workflows with history or status", "Exercise valid transitions, rejected moves, retries, and persistence."],
      ["Pairwise / combinatorial", "Browser, role, locale, configuration factors", "Cover valid value pairs, then add higher-risk combinations."],
      ["Statement / branch coverage", "Internal code structure", "Exercise statements and decision outcomes; assert behavior, not only execution."],
      ["Exploratory / error guessing", "Unknown risks and past incidents", "Use a charter and experience to probe failures, then preserve findings."]
    ];
    const makeGrid = (className, entries, headings) => {
      const region = el("div", className); region.setAttribute("role", "region"); region.setAttribute("aria-label", headings);
      entries.forEach((entry) => {
        const card = el("article", "qa-chart-card");
        card.append(el("h3", "", entry[0]));
        if (entry[1]) card.append(el("div", "qa-chart-flow", entry[1]));
        card.append(el("p", "qa-chart-fit", entry[2]));
        if (entry[3]) card.append(el("p", "qa-chart-practice", entry[3]));
        region.append(card);
      });
      return region;
    };
    if (/sdlc models|compare and choose/.test(title)) {
      const chart = el("section", "qa-concept-chart"); chart.append(el("h3", "", "SDLC model comparison"));
      chart.append(el("p", "qa-chart-intro", "Every model covers a lifecycle; the sequence, feedback cadence, and risk controls differ."));
      chart.append(makeGrid("qa-model-grid", models, "Software development lifecycle model comparison")); return chart;
    }
    if (/choose a test design technique/.test(title)) {
      const chart = el("section", "qa-concept-chart"); chart.append(el("h3", "", "Testing technique selection chart"));
      chart.append(el("p", "qa-chart-intro", "Start from the risk or rule, choose a technique, then add complementary coverage."));
      chart.append(makeGrid("qa-technique-grid", techniques, "Testing technique selection")); return chart;
    }
    return null;
  }
  function flowStagesFor(lesson) {
    if (/^SDLC phase walkthrough$/i.test(lesson.module || "")) return [
      { label: "1. Discover & define", detail: "Clarify the need and acceptance rules · Output: agreed requirements" },
      { label: "2. Design", detail: "Plan user flows, data, interfaces, and quality · Output: reviewed design" },
      { label: "3. Build & review", detail: "Implement small changes and check them · Output: reviewed build" },
      { label: "4. Integrate & test", detail: "Check connections and user workflows · Output: results and release risks" },
      { label: "5. Release", detail: "Deploy, smoke-check, and monitor · Output: verified release" },
      { label: "6. Operate & improve", detail: "Monitor, fix, and learn · Output: service insights and follow-up" }
    ];
    if (/^STLC phase walkthrough$/i.test(lesson.module || "")) return [
      { label: "1. Analyze", detail: "Clarify requirements and risks · Output: test conditions" },
      { label: "2. Plan", detail: "Agree scope, people, time, and criteria · Output: test plan" },
      { label: "3. Design", detail: "Write scenarios and expected results · Output: reviewed test cases" },
      { label: "4. Prepare tests", detail: "Organize suites, procedures, and automation · Output: ready checks" },
      { label: "5. Prepare environment & data", detail: "Check the build and safe test data · Output: readiness evidence" },
      { label: "6. Execute & control", detail: "Run tests, report defects, retest fixes · Output: results and risk" },
      { label: "7. Close", detail: "Review coverage and remaining risk · Output: test summary and lessons" }
    ];
    if (/choose a test design technique/i.test(lesson.title)) return [
      { label: "1. Understand the rule", detail: "Identify the behavior and risk to check" },
      { label: "2. Choose a technique", detail: "Select one that matches the inputs or workflow" },
      { label: "3. Create test cases", detail: "Choose data, steps, and expected results" },
      { label: "4. Check coverage", detail: "Review gaps and add higher-risk cases" }
    ];
    return stagesFor(lesson).map((stage, index) => ({
      label: `${index + 1}. ${typeof stage === "string" ? stage : stage.label}`,
      detail: typeof stage === "string" ? "" : stage.detail
    }));
  }
  function buildFlowPicture(lesson) {
    const stages = flowStagesFor(lesson);
    const width = 420;
    const nodeHeight = 90;
    const rowHeight = 108;
    const height = stages.length * rowHeight + 12;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("learning-flow-picture");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "img");
    const titleId = `learning-flow-title-${currentIndex}`;
    const descriptionId = `learning-flow-description-${currentIndex}`;
    svg.setAttribute("aria-labelledby", `${titleId} ${descriptionId}`);
    const title = document.createElementNS(svg.namespaceURI, "title");
    title.id = titleId;
    title.textContent = `${lesson.module || course.title} flowchart`;
    const description = document.createElementNS(svg.namespaceURI, "desc");
    description.id = descriptionId;
    description.textContent = stages.map((stage) => `${stage.label}. ${stage.detail}`).join(". ");
    const defs = document.createElementNS(svg.namespaceURI, "defs");
    const marker = document.createElementNS(svg.namespaceURI, "marker");
    marker.id = `learning-flow-arrow-${currentIndex}`;
    marker.setAttribute("viewBox", "0 0 10 7"); marker.setAttribute("refX", "8"); marker.setAttribute("refY", "3.5");
    marker.setAttribute("markerWidth", "8"); marker.setAttribute("markerHeight", "7"); marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS(svg.namespaceURI, "path");
    arrow.setAttribute("d", "M 0 0 L 10 3.5 L 0 7 z"); arrow.setAttribute("class", "learning-flow-arrow");
    marker.append(arrow); defs.append(marker); svg.append(title, description, defs);
    const phaseNumber = Number(lesson.title.match(/phase\s+(\d+)/i)?.[1]);
    stages.forEach((stage, index) => {
      const y = index * rowHeight + 6;
      if (index < stages.length - 1) {
        const connector = document.createElementNS(svg.namespaceURI, "path");
        connector.setAttribute("d", `M 210 ${y + nodeHeight} V ${y + rowHeight - 5}`);
        connector.setAttribute("class", "learning-flow-connector");
        connector.setAttribute("marker-end", `url(#learning-flow-arrow-${currentIndex})`);
        svg.append(connector);
      }
      const group = document.createElementNS(svg.namespaceURI, "g");
      group.setAttribute("class", `learning-flow-node${phaseNumber === index + 1 ? " is-current" : ""}`);
      const box = document.createElementNS(svg.namespaceURI, "rect");
      box.setAttribute("x", "12"); box.setAttribute("y", String(y)); box.setAttribute("width", "396"); box.setAttribute("height", String(nodeHeight)); box.setAttribute("rx", "12");
      const heading = document.createElementNS(svg.namespaceURI, "text");
      heading.setAttribute("x", "27"); heading.setAttribute("y", String(y + 27)); heading.setAttribute("class", "learning-flow-label"); heading.textContent = stage.label;
      const detail = document.createElementNS(svg.namespaceURI, "text");
      detail.setAttribute("x", "27"); detail.setAttribute("y", String(y + 47)); detail.setAttribute("class", "learning-flow-detail");
      const words = stage.detail.split(/\s+/);
      let line = ""; const lines = [];
      words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        if (next.length > 60 && line) { lines.push(line); line = word; } else line = next;
      });
      if (line) lines.push(line);
      lines.slice(0, 3).forEach((value, lineIndex) => {
        const tspan = document.createElementNS(svg.namespaceURI, "tspan");
        tspan.setAttribute("x", "27"); tspan.setAttribute("dy", lineIndex === 0 ? "0" : "14"); tspan.textContent = value;
        detail.append(tspan);
      });
      group.append(box, heading, detail);
      svg.append(group);
    });
    const figure = el("figure", "learning-flow-figure");
    const caption = el("figcaption", "", phaseNumber ? "The highlighted box is the phase covered in this lesson." : "Read the picture from top to bottom.");
    figure.append(svg, caption);
    return figure;
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
      if (label) label.textContent = done ? "✓ Section complete · Undo" : "Mark section complete";
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
  function lessonHasCode(lesson) {
    return codeCourseIds.has(courseId) && typeof lesson.code === "string" && lesson.code.trim().length > 0;
  }
  function lessonExample(lesson) {
    if (courseId === "software-testing") return el("div", "qa-practical-example", lesson.code);
    const pre = el("pre"); pre.append(el("code", "", lesson.code)); return pre;
  }
  function buildCodeWalkthrough(lesson, picture) {
    const sources = lesson.code.split("\n");
    let lines = sources.map((source, number) => ({ source, number }))
      .filter(({ source }) => source.trim() && !source.trim().startsWith("#"));
    if (!lines.length) lines = sources.map((source, number) => ({ source, number })).filter(({ source }) => source.trim());
    const stages = flowStagesFor(lesson);
    const root = el("div", "path-code-walkthrough");
    const pre = el("pre", "path-code-source");
    const code = el("code");
    const rows = sources.map((source, index) => {
      const row = el("span", "path-code-line");
      row.dataset.line = String(index + 1);
      const number = el("span", "path-code-line-number", String(index + 1));
      number.setAttribute("aria-hidden", "true");
      row.append(number, el("span", "path-code-line-text", source || " "));
      code.append(row);
      return row;
    });
    pre.append(code);
    const controls = el("div", "path-code-controls");
    const run = el("button", "path-run-button path-code-run-button", "Animate code flow");
    run.type = "button";
    const status = el("span", "path-code-status", "Highlights each code step and its related picture-guide stage. Code is not executed.");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    controls.append(run, status);
    root.append(pre, controls);
    let lineIndex = -1;
    const svg = picture.querySelector(".learning-flow-picture");
    const nodes = [...(svg?.querySelectorAll(".learning-flow-node") || [])];
    const stageIndexFor = (source, index) => {
      const text = source.toLowerCase();
      const last = Math.max(0, stages.length - 1);
      if (courseId === "fastapi" && /basemodel|pydantic|validator|schema/.test(text)) return Math.min(1, last);
      if (/import|^from\s|^@|^def\s|^class\s|launch|create|new_/.test(text)) return 0;
      if (/retriev|fetch|load|read|request|prompt|input|query|payload|param/.test(text)) return Math.min(1, last);
      if (/invoke|generat|model|llm|tool|graph|chain|node|process|transform|execute|predict/.test(text)) return Math.min(2, last);
      if (/assert|expect|return|response|output|print|close|evaluat|score|metric/.test(text)) return last;
      return Math.min(Math.floor(index / Math.max(lines.length, 1) * stages.length), last);
    };
    const reset = () => {
      lineIndex = -1;
      rows.forEach((row) => row.classList.remove("is-active", "is-complete"));
      nodes.forEach((node) => node.classList.remove("is-active", "is-complete"));
    };
    const advance = () => {
      lineIndex += 1;
      const current = lines[lineIndex];
      const row = rows[current.number];
      const stageIndex = stageIndexFor(current.source, lineIndex);
      const stage = stages[stageIndex];
      rows.forEach((item, index) => {
        item.classList.toggle("is-active", index === current.number);
        item.classList.toggle("is-complete", index < current.number);
        item.setAttribute("aria-current", index === current.number ? "step" : "false");
      });
      nodes.forEach((node, index) => {
        node.classList.toggle("is-active", index === stageIndex);
        node.classList.toggle("is-complete", index < stageIndex);
      });
      row?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      status.textContent = `Step ${lineIndex + 1} of ${lines.length} → ${stage?.label || "Lesson flow"} (line ${current.number + 1}).`;
      if (lineIndex >= lines.length - 1) {
        window.clearInterval(codeWalkthroughTimer);
        codeWalkthroughTimer = null;
        run.textContent = "Replay code flow";
      }
    };
    run.addEventListener("click", () => {
      if (codeWalkthroughTimer) {
        window.clearInterval(codeWalkthroughTimer);
        codeWalkthroughTimer = null;
        run.textContent = "Resume code flow";
        return;
      }
      if (lineIndex >= lines.length - 1) reset();
      run.textContent = "Pause walkthrough";
      advance();
      if (lineIndex < lines.length - 1) codeWalkthroughTimer = window.setInterval(advance, 850);
    });
    return root;
  }
  function renderShell() {
    body.dataset.course = courseId;
    if (courseId === "software-testing") {
      body.style.setProperty("--path-accent", course.accent);
      body.style.setProperty("--path-soft", course.soft);
    }
    document.title = `${course.title} | Sathishram School`;
    $("path-top-title").textContent = course.title;
    const courseCard = $("path-course-card");
    const cardTop = el("div", "course-card-top");
    const courseMark = el("span", "course-mark");
    courseMark.innerHTML = schoolIcon(courseId === "software-testing" ? "check" : "spark");
    courseMark.setAttribute("aria-hidden", "true");
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
    $("path-course-mark").innerHTML = schoolIcon(courseId === "software-testing" ? "check" : "spark");
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
        const group = el("section", "path-module-group");
        const heading = el("button", "path-module-title", moduleName);
        heading.type = "button"; heading.setAttribute("aria-expanded", "true");
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
  const views = [["lesson", "Learning path"], ["cheatsheet", "Interview cheat sheet"], ["interview", "Interview questions"], ["examples", courseId === "software-testing" ? "Worked examples" : "Code examples"], ...(courseId === "software-testing" ? [["test-case-generator", "Test case generator"]] : []), ["mock", "Mock exam"]];
  function renderTabs() {
    const tabs = $("path-study-tabs");
    const icons = { lesson: "book", cheatsheet: "file", interview: "question", examples: "code", "test-case-generator": "check", mock: "spark" };
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
  function addCleanLessonSection(parent, id, title, content) {
    const section = el("section", "path-clean-section");
    section.id = `path-section-${id}`;
    section.dataset.part = id;
    section.append(el("h2", "", title), ...content);
    parent.append(section);
    return section;
  }
  function stagesFor(lesson) {
    if (Array.isArray(lesson.visual) && lesson.visual.length) return lesson.visual.slice(0, 5).map((item) => typeof item === "string" ? item : item.label || item.title || String(item));
    const title = lesson.title.toLowerCase(); const module = (lesson.module || "").toLowerCase();
    if (courseId === "software-testing") {
      if (/\bsdlc\b|software development lifecycle|sdlc phase/.test(title) || module.includes("sdlc phase")) return [
        { label: "Discover & define", detail: "Understand users, scope, constraints, and clear acceptance criteria." },
        { label: "Design", detail: "Plan workflows, architecture, data, interfaces, risks, and testability." },
        { label: "Build & review", detail: "Implement small changes; review them and run component checks." },
        { label: "Integrate & test", detail: "Verify contracts and end-to-end behavior; evaluate user acceptance." },
        { label: "Release", detail: "Deploy a known build, run smoke checks, and monitor release signals." },
        { label: "Operate & improve", detail: "Monitor real use, fix issues, learn from incidents, and feed work back into planning." }
      ];
      if (/\bstlc\b|stlc phase|test(ing)? lifecycle/.test(title) || module.includes("stlc phase")) return [
        { label: "Analyze", detail: "Review requirements, risks, dependencies, and testability; clarify questions." },
        { label: "Plan", detail: "Agree scope, approach, people, estimates, schedule, entry/exit criteria, and reporting." },
        { label: "Design", detail: "Derive scenarios, cases, expected results, data needs, and requirement links." },
        { label: "Implement", detail: "Organize suites, prepare procedures and automation, and order dependent checks." },
        { label: "Prepare", detail: "Verify build/environment readiness and seed safe, repeatable test data." },
        { label: "Execute & control", detail: "Run cases, record evidence/status, triage failures, retest fixes, and adjust for risk." },
        { label: "Close", detail: "Summarize coverage, open defects, exclusions, residual risk, and improvement actions." }
      ];
      if (/jira defect lifecycle|jira bug workflow/.test(title)) return [
        { label: "Report", detail: "Create a Bug with build, environment, steps, expected/actual behavior, and sanitized evidence." },
        { label: "Triage", detail: "Validate and assess impact, severity, priority, ownership, and release/sprint risk." },
        { label: "Assign", detail: "Set the responsible owner, component, target version, and related story." },
        { label: "In progress", detail: "Investigate and implement a fix; link the relevant change to the issue." },
        { label: "Ready for QA", detail: "Record the candidate build and make the fix available for verification." },
        { label: "Retest", detail: "Repeat original steps and relevant regression checks with recorded evidence." },
        { label: "Close or reopen", detail: "Close when verified; reopen with fresh evidence if the issue still reproduces." }
      ];
      if (/agile sprint lifecycle/.test(title)) return [
        { label: "Refinement", detail: "Clarify stories, acceptance criteria, dependencies, and risks." },
        { label: "Sprint planning", detail: "Agree the goal and select work that fits actual team capacity." },
        { label: "Build & test", detail: "Implement, review, test, and integrate work continuously during the sprint." },
        { label: "Daily inspection", detail: "Update progress, expose blockers, and adjust the plan collaboratively." },
        { label: "Sprint review", detail: "Demonstrate the increment and gather stakeholder feedback." },
        { label: "Retrospective", detail: "Choose a concrete team-process improvement for the next sprint." }
      ];
      if (/sprint planning/.test(title)) return [
        { label: "Refine backlog", detail: "Check readiness, acceptance examples, risk, dependencies, and unfinished work." },
        { label: "Set sprint goal", detail: "Agree one outcome that guides trade-offs during the sprint." },
        { label: "Check capacity", detail: "Account for availability, support work, dependencies, and uncertainty." },
        { label: "Plan QA work", detail: "Include case design, data, environment, execution, defect retest, and regression." },
        { label: "Commit & adapt", detail: "Select achievable work; renegotiate scope when capacity or risk changes." }
      ];
      if (/jira bug fields|jira.*board|jira defect triage/.test(title)) return [
        { label: "Document", detail: "Use a clear title and reproducible steps; include only sanitized evidence." },
        { label: "Link", detail: "Connect the defect to its story, component, affected/fix version, and related issues." },
        { label: "Prioritize", detail: "Use impact and urgency to set severity, priority, target, and owner." },
        { label: "Track", detail: "Keep Jira status and board filters current; surface blocked and aging issues." },
        { label: "Verify", detail: "Record the build, retest evidence, regression result, and closure decision." }
      ];
      if (/equivalence partition/.test(title)) return [
        { label: "Identify input", detail: "Choose the requirement's input and the behavior that must be checked." },
        { label: "Partition", detail: "Group valid and invalid values expected to behave the same way." },
        { label: "Choose examples", detail: "Select representative values from every partition." },
        { label: "Check results", detail: "Compare each actual result to the documented rule and record evidence." }
      ];
      if (/boundary value/.test(title)) return [
        { label: "Find limits", detail: "Clarify the minimum, maximum, and whether each limit is inclusive." },
        { label: "Select probes", detail: "Choose just below, at, and just above each boundary." },
        { label: "Execute", detail: "Enter each value with controlled data and the same preconditions." },
        { label: "Compare", detail: "Confirm accepted/rejected values and that invalid attempts cause no bad state." }
      ];
      if (/decision table/.test(title)) return [
        { label: "List conditions", detail: "Identify the business conditions and their possible values." },
        { label: "Map rules", detail: "Show each meaningful condition combination and its expected action." },
        { label: "Remove impossible rules", detail: "Keep valid combinations and avoid redundant cases." },
        { label: "Test outcomes", detail: "Execute each selected rule and verify action, state, and audit evidence." }
      ];
      if (/state transition/.test(title)) return [
        { label: "List states", detail: "Name the states the workflow can occupy." },
        { label: "Map events", detail: "Record each triggering event, guard, and resulting state." },
        { label: "Test transitions", detail: "Check allowed moves and rejected transitions from each important state." },
        { label: "Check history", detail: "Verify retries, persistence, and recovery after prior actions." }
      ];
      if (/pairwise|combinatorial/.test(title)) return [
        { label: "List factors", detail: "Identify configuration factors such as role, browser, locale, and payment method." },
        { label: "Define values", detail: "List supported values and combinations that cannot occur." },
        { label: "Select combinations", detail: "Choose a valid set that covers every important pair of values." },
        { label: "Add risk cases", detail: "Add higher-order combinations where business or incident risk requires them." }
      ];
      if (/white-box|coverage/.test(title)) return [
        { label: "Inspect structure", detail: "Identify statements, decisions, branches, and boolean conditions." },
        { label: "Design checks", detail: "Exercise each meaningful outcome and condition variation." },
        { label: "Assert behavior", detail: "Check that results are correct, not merely that lines executed." },
        { label: "Review gaps", detail: "Investigate uncovered high-risk paths and complement with requirement tests." }
      ];
      if (/scenario|test case|use-case/.test(title)) return [
        { label: "Understand the goal", detail: "Identify the actor, trigger, outcome, and acceptance rule." },
        { label: "Set up", detail: "Specify prerequisites and safe, repeatable test data." },
        { label: "Write steps", detail: "List one clear action at a time, including alternate and error paths." },
        { label: "Define expected result", detail: "State the observable outcome and important persisted effects." },
        { label: "Execute & report", detail: "Compare actual behavior, capture evidence, and link result to its requirement." }
      ];
      if (/jira/.test(title)) return [
        { label: "Create issue", detail: "Record a concise summary, build, steps, expected and actual results." },
        { label: "Agree ownership", detail: "Triage validity, impact, priority, assignee, and release risk." },
        { label: "Fix & verify", detail: "Track the fix, retest the original issue, and run relevant regression." },
        { label: "Close or reopen", detail: "Close after verified success; reopen with evidence if it still fails." }
      ];
      if (/agile|sprint/.test(title)) return [
        { label: "Refine", detail: "Clarify the story and acceptance examples." },
        { label: "Plan", detail: "Agree sprint goal, capacity, work, and test tasks." },
        { label: "Build & test", detail: "Collaborate and verify the change throughout the sprint." },
        { label: "Review & improve", detail: "Inspect the increment and choose a retrospective action." }
      ];
      if (/manual testing/.test(title)) return [
        { label: "Set a mission", detail: "Choose a product area, user goal, and risk to explore." },
        { label: "Prepare", detail: "Record the build, environment, preconditions, and safe data." },
        { label: "Explore", detail: "Follow the workflow, observe behavior, and probe alternatives." },
        { label: "Compare & record", detail: "Capture actual versus expected behavior and reproducible evidence." }
      ];
      if (/automation/.test(title)) return [
        { label: "Select a check", detail: "Choose a valuable, stable behavior with a clear expected result." },
        { label: "Prepare & execute", detail: "Set up isolated data, run the check, and collect diagnostics." },
        { label: "Assert", detail: "Compare visible behavior and important side effects with the expectation." },
        { label: "Review & maintain", detail: "Triage failures and update tests when product behavior changes." }
      ];
      return [
        { label: "Understand", detail: lesson.intro },
        { label: "Prepare", detail: lesson.bullets[0] || lesson.tip },
        { label: "Apply", detail: lesson.bullets[1] || lesson.tip },
        { label: "Review", detail: lesson.bullets[2] || lesson.tip }
      ];
    }
    if (/api|fastapi|django|request|route|endpoint|payload|http/.test(`${title} ${module}`)) return ["Client sends request", "Validate path and payload", "Run application logic", "Return structured response"];
    if (/agent|tool|graph|workflow|langchain/.test(`${title} ${module}`)) return ["Receive task and context", "Choose next step", "Call model or tool", "Return result or continue"];
    if (/evaluation|eval|test|quality/.test(`${title} ${module}`)) return ["Prepare test cases", "Run the system", "Measure expected signals", "Review failures and improve"];
    if (/model|token|prompt|llm|fine.?tun/.test(`${title} ${module}`)) return ["Prepare input", "Select model and settings", "Generate response", "Review output and usage"];
    return ["Prepare input and context", "Apply the lesson concept", "Process or retrieve data", "Inspect the result"];
  }
  function buildVisual(lesson) {
    const wrap = el("div", "path-visual-wrap");
    wrap.append(buildFlowPicture(lesson));
    return wrap;
  }
  function renderLesson(index) {
    if (window.lessonNarrator) window.lessonNarrator.stop();
    if (codeWalkthroughTimer) window.clearInterval(codeWalkthroughTimer);
    codeWalkthroughTimer = null;
    currentIndex = index; localStorage.setItem(lessonKey, String(index)); const lesson = course.lessons[index];
    $("path-category").textContent = lesson.module || course.category;
    $("path-lesson-number").textContent = `LESSON ${String(index + 1).padStart(2, "0")} / ${String(course.lessons.length).padStart(2, "0")}`;
    $("path-lesson-duration").textContent = lesson.duration; $("path-title").textContent = lesson.title;
    $("path-lesson-goal").textContent = lesson.heading || lesson.intro;
    $("path-lesson-timer").textContent = lesson.duration;
    $("path-lesson-tip").textContent = lesson.tip || lesson.intro;
    const article = $("path-lesson-content");
    const quickCheck = $("path-check");
    article.replaceChildren($("path-lesson-progress"));
    const shortIntro = lesson.intro.split(/(?<=[.!?])\s+/)[0] || lesson.intro;
    const detailList = el("ul"); lesson.bullets.forEach((text) => detailList.append(el("li", "", text)));
    const keyDetails = el("details", "path-key-details");
    keyDetails.open = allSectionsExpanded;
    keyDetails.append(el("summary", "", "Key details"), detailList, el("p", "path-tip", lesson.tip));
    addCleanLessonSection(article, "description", "At a glance", [el("p", "path-short-intro", shortIntro), keyDetails]);
    const pictureContent = [];
    if (courseId === "software-testing") {
      const chart = buildQaComparisonChart(lesson);
      if (chart) pictureContent.push(chart);
    }
    pictureContent.push(buildVisual(lesson));
    addCleanLessonSection(article, "visual", "Picture guide", pictureContent);
    if (courseId === "software-testing") {
      addCleanLessonSection(article, "example", "Simple example", [lessonExample(lesson)]);
    } else if (lessonHasCode(lesson)) {
      const codeDetails = el("details", "path-code-details");
      codeDetails.open = allSectionsExpanded;
      const walkthrough = buildCodeWalkthrough(lesson, pictureContent[pictureContent.length - 1]);
      const copy = el("button", "path-copy-code", "Copy code");
      copy.type = "button"; copy.addEventListener("click", () => copyText(lesson.code, copy));
      codeDetails.append(el("summary", "", "Show code"), walkthrough, copy);
      addCleanLessonSection(article, "example", "Code example", [codeDetails]);
    }
    quickCheck.querySelector(".path-check-icon").innerHTML = schoolIcon("question");
    article.append(quickCheck);
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
    const tocEntries = [...article.querySelectorAll(":scope > .path-clean-section")].map((section) => ({
      id: section.id,
      title: section.querySelector("h2").textContent
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
    $("path-previous-lesson").disabled = index === 0;
    $("path-next-lesson").disabled = index === course.lessons.length - 1;
    renderProgress();
  }
  function showLesson(index) {
    void window.schoolCourseAccess.requireLesson(index, () => renderLesson(index));
  }
  function moveLesson(offset) {
    const nextIndex = Math.max(0, Math.min(course.lessons.length - 1, currentIndex + offset));
    const scrollPosition = window.scrollY;
    void window.schoolCourseAccess.requireLesson(nextIndex, () => {
      renderLesson(nextIndex);
      window.scrollTo({ top: scrollPosition, behavior: "instant" });
    });
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
  $("path-previous-lesson").addEventListener("click", () => moveLesson(-1));
  $("path-next-lesson").addEventListener("click", () => moveLesson(1));
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
    if (view === "test-case-generator" && courseId === "software-testing") {
      renderTestCaseGenerator(root);
    } else if (view === "cheatsheet") {
      resourceHeader("Course cheat sheet", courseId === "software-testing" ? "Review each lesson’s key ideas, phase activities, checkpoints, and worked example." : "A compact review of each lesson’s main ideas, reminders, and code pattern.", true);
      const list = el("div", "path-resource-list"); course.lessons.forEach((lesson) => { const bullets = el("ul"); lesson.bullets.forEach((item) => bullets.append(el("li", "", item))); const content = [el("p", "", lesson.tip), bullets]; if (courseId === "software-testing" || lessonHasCode(lesson)) content.push(lessonExample(lesson)); resourceCard(list, lesson.title, lesson.module || course.category, content, `${lesson.intro} ${lesson.tip} ${lesson.code}`); }); root.append(list);
    } else if (view === "interview") {
      resourceHeader("Interview questions", courseId === "software-testing" ? "Practice the key question from each lesson, then review its answer and practical example." : "Practice the core question from every lesson, then reveal the answer and code reference.", true);
      const list = el("div", "path-resource-list"); course.lessons.forEach((lesson, index) => { const q = el("p", "path-interview-question", lesson.question); const answer = el("p", "", `Answer: ${answerFor(lesson)}`); const content = [q, answer]; if (courseId === "software-testing" || lessonHasCode(lesson)) content.push(lessonExample(lesson)); resourceCard(list, `${String(index + 1).padStart(2, "0")}. ${lesson.title}`, lesson.module || course.category, content, `${lesson.question} ${answerFor(lesson)} ${lesson.title}`); }); root.append(list);
    } else if (view === "examples") {
      const isQa = courseId === "software-testing";
      resourceHeader(isQa ? "Worked examples" : "Code examples", isQa ? "Read practical scenarios that show how to apply each concept. No programming is required." : "Browse the lesson snippets by topic. Copy a snippet to try it in your own project.", true);
      const list = el("div", "path-resource-list path-example-list"); course.lessons.forEach((lesson, index) => {
        const content = [el("p", "", lesson.intro)];
        if (isQa) content.push(lessonExample(lesson));
        else if (lessonHasCode(lesson)) { content.push(lessonExample(lesson)); const copy = el("button", "path-copy-code", "Copy code"); copy.type = "button"; copy.addEventListener("click", () => copyText(lesson.code, copy)); content.push(copy); }
        resourceCard(list, `${String(index + 1).padStart(2, "0")}. ${lesson.title}`, lesson.module || course.category, content, `${lesson.title} ${lesson.intro} ${lesson.code}`);
      }); root.append(list);
    } else if (view === "mock") renderMock(root);
  }
  function renderTestCaseGenerator(root) {
    resourceHeader("Manual test case generator", "Describe a feature scenario to generate an editable first-draft suite. Review each case against the product's real acceptance criteria before execution.");
    const form = el("form", "qa-generator-form");
    const field = (id, label, help, options = {}) => {
      const wrapper = el("div", `qa-generator-field${options.wide ? " qa-generator-field-wide" : ""}`);
      const labelElement = el("label", "qa-generator-label", label); labelElement.htmlFor = `qa-generator-${id}`;
      const input = el(options.multiline ? "textarea" : "input", "qa-generator-input"); input.id = `qa-generator-${id}`;
      if (options.multiline) input.rows = options.rows || 3;
      else input.type = "text";
      input.maxLength = options.maxLength || 2000;
      if (options.required) { input.required = true; input.minLength = 12; }
      if (options.placeholder) input.placeholder = options.placeholder;
      wrapper.append(labelElement, input, el("small", "qa-generator-help", help));
      form.append(wrapper);
      return input;
    };
    const feature = field("feature", "Feature or user story", "Optional context used to make case titles more specific.", { maxLength: 160, placeholder: "e.g. Password reset" });
    const scenario = field("scenario", "Scenario", "Describe the actor, action, and intended behavior. At least 12 characters.", { multiline: true, rows: 4, required: true, placeholder: "e.g. A registered customer requests a password reset using the email address on their account." });
    const expected = field("expected", "Expected business outcome", "Optional: add the acceptance outcome so the positive case checks your rule, not a guessed one.", { multiline: true, rows: 3, maxLength: 600, placeholder: "e.g. A single-use reset link is sent and expires after 30 minutes." });
    const preconditions = field("preconditions", "Preconditions", "Optional setup shared by the generated cases.", { multiline: true, rows: 2, maxLength: 500, placeholder: "e.g. The user has an active account and access to the test inbox." });
    const testData = field("test-data", "Test data", "Optional safe, synthetic data. Never use real passwords, payment details, or personal data.", { multiline: true, rows: 2, maxLength: 500, placeholder: "e.g. qa.user@example.test; synthetic test account" });
    const typeFieldset = el("fieldset", "qa-generator-types");
    typeFieldset.append(el("legend", "", "Coverage to include"));
    const caseTypes = [
      ["positive", "Positive flow", true], ["negative", "Invalid and error handling", true],
      ["boundary", "Boundary values", true], ["required", "Required and empty fields", true],
      ["authorization", "Authentication and permissions", true], ["duplicate", "Duplicate submission", true],
      ["recovery", "Recovery and state persistence", false], ["compatibility", "Compatibility", false],
      ["accessibility", "Keyboard and accessibility", false], ["integrity", "Data integrity", true]
    ];
    for (const [id, label, checked] of caseTypes) {
      const choice = el("label", "qa-generator-choice");
      const checkbox = el("input"); checkbox.type = "checkbox"; checkbox.name = "qa-case-type"; checkbox.value = id; checkbox.checked = checked;
      choice.append(checkbox, el("span", "", label)); typeFieldset.append(choice);
    }
    form.append(typeFieldset);
    const actions = el("div", "qa-generator-actions");
    const exampleButton = el("button", "path-secondary-button", "Load example"); exampleButton.type = "button";
    const generateButton = el("button", "path-run-button", "Generate test cases"); generateButton.type = "submit";
    actions.append(exampleButton, generateButton); form.append(actions);
    const status = el("p", "qa-generator-status"); status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite");
    const output = el("section", "qa-generator-output"); output.hidden = true; output.setAttribute("aria-label", "Generated manual test cases");
    root.append(form, status, output);

    const templates = {
      positive: { title: "Complete the primary flow with valid data", priority: "P1", data: "Use valid synthetic data that satisfies the scenario's stated rules.", steps: (flow) => [`Set up the stated preconditions and open the ${flow} workflow.`, `Enter valid data and perform this scenario: ${flow}.`, "Submit or confirm once, then observe the user-visible result and resulting record."], expected: (rule) => rule || "The flow completes successfully once, shows a clear confirmation, and produces the expected final state." },
      negative: { title: "Reject invalid input safely", priority: "P1", data: "Use an invalid, malformed, expired, or otherwise rejected value relevant to this scenario.", steps: (flow) => [`Open the ${flow} workflow.`, `Repeat the scenario using invalid or rejected input: ${flow}.`, "Submit and inspect the response, persisted state, and any side effects."], expected: () => "The invalid action is rejected with a clear, accessible message; no unauthorized or partial state change occurs." },
      boundary: { title: "Check minimum, maximum, and adjacent boundaries", priority: "P2", data: "Use values at the documented minimum and maximum, and immediately below/above each limit where applicable.", steps: (flow) => [`Identify the input limits and boundary rules for: ${flow}.`, "Run the case at each inclusive/exclusive boundary and one value on either side.", "Observe validation, accepted values, and persisted results."], expected: () => "Values at valid boundaries follow the documented rule; adjacent out-of-range values are rejected without corrupting state." },
      required: { title: "Handle missing and empty required values", priority: "P1", data: "Leave each required field empty in turn; also try whitespace-only values where text is accepted.", steps: (flow) => [`Open the ${flow} workflow.`, "Leave a required value blank (then try whitespace-only input) and submit.", "Check field-level feedback, focus behavior, and saved state."], expected: () => "Submission is blocked for missing required data, the relevant field is identified, and no incomplete record or side effect is created." },
      authorization: { title: "Enforce authentication and role permissions", priority: "P1", data: "Use one unauthenticated session, an authorized test account, and an account without the required permission.", steps: (flow) => [`Attempt the scenario while signed out: ${flow}.`, "Repeat with an authenticated account that lacks the required permission.", "Repeat with an authorized account and inspect the protected result."], expected: () => "Unauthenticated and unauthorized attempts are denied without revealing protected data or changing state; authorized access follows the stated rule." },
      duplicate: { title: "Prevent unintended duplicate actions", priority: "P1", data: "Use one valid synthetic record and submit twice quickly; also retry after the first response is delayed.", steps: (flow) => [`Prepare valid data for: ${flow}.`, "Submit once, then double-submit or retry while the first response is pending.", "Inspect confirmations, records, payments/messages, and final state."], expected: () => "The repeated request is safely handled according to the product's idempotency rule; no unintended duplicate record or side effect is created." },
      recovery: { title: "Recover from interruption and preserve state", priority: "P2", data: "Use valid synthetic data and a controllable network/service interruption in a test environment.", steps: (flow) => [`Begin the scenario with valid data: ${flow}.`, "Interrupt the network or dependent service during submission, then restore it.", "Observe retry/recovery guidance and verify final persisted state."], expected: () => "The user receives clear recovery feedback; retry behavior is safe and final state is consistent, without losing or duplicating the operation." },
      compatibility: { title: "Verify the scenario on supported configurations", priority: "P2", data: "Use the agreed browser, device, operating-system, locale, and viewport matrix with equivalent synthetic records.", steps: (flow) => [`Execute the scenario on each supported configuration: ${flow}.`, "Compare layout, interaction, validation, and completion behavior.", "Record configuration-specific differences and console or network errors."], expected: () => "The scenario remains usable and functionally consistent across the supported configuration matrix." },
      accessibility: { title: "Complete the scenario using keyboard and assistive technology", priority: "P1", data: "Use the same synthetic valid and invalid data as the primary flow; test keyboard-only and a supported screen reader.", steps: (flow) => [`Navigate to and complete the scenario using only the keyboard: ${flow}.`, "Repeat an invalid-input case and inspect labels, focus order, status, and error announcements.", "Verify focus remains visible and returns sensibly after submission."], expected: () => "All controls have meaningful names, the flow is operable without a pointer, focus is visible, and status/errors are exposed to assistive technology." },
      integrity: { title: "Verify data persistence and related records", priority: "P1", data: "Use a unique synthetic record identifier and a safe test datastore or supported read-only verification endpoint.", steps: (flow) => [`Record the initial state for: ${flow}.`, "Complete the scenario with unique synthetic data.", "Read the resulting state through the supported application or test interface; verify related records and totals."], expected: (rule) => rule || "The final state is persisted exactly once, matches the user-visible confirmation and business rules, and leaves related data consistent." }
    };
    const makeCases = (values) => {
      const checked = [...form.querySelectorAll('input[name="qa-case-type"]:checked')].map((checkbox) => checkbox.value);
      if (!checked.length) throw new Error("Select at least one coverage type.");
      return checked.map((id, index) => {
        const template = templates[id];
        const flow = values.scenario;
        return {
          id: `TC-${String(index + 1).padStart(3, "0")}`,
          title: `${values.feature ? `${values.feature}: ` : ""}${template.title}`,
          type: caseTypes.find(([type]) => type === id)[1],
          priority: template.priority,
          preconditions: values.preconditions || "Use an isolated test environment and confirm the scenario's prerequisites before execution.",
          data: values.testData ? `${values.testData}\nAdditional data: ${template.data}` : template.data,
          steps: template.steps(flow),
          expected: template.expected(values.expected)
        };
      });
    };
    const formatCases = (cases) => cases.map((item) => [
      `${item.id} | ${item.title} | ${item.type} | ${item.priority}`,
      `Preconditions: ${item.preconditions}`,
      `Test data: ${item.data}`,
      `Steps:\n${item.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
      `Expected result: ${item.expected}`
    ].join("\n")).join("\n\n");
    const csvCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const createCsv = (cases) => [
      ["Test case ID", "Title", "Coverage type", "Priority", "Preconditions", "Test data", "Steps", "Expected result"].map(csvCell).join(","),
      ...cases.map((item) => [item.id, item.title, item.type, item.priority, item.preconditions, item.data, item.steps.map((step, index) => `${index + 1}. ${step}`).join("\n"), item.expected].map(csvCell).join(","))
    ].join("\r\n");
    const setStatus = (message, error = false) => { status.textContent = message; status.classList.toggle("is-error", error); };
    const showCases = (cases) => {
      const heading = el("div", "qa-generator-output-heading");
      heading.append(el("h2", "", `${cases.length} manual test cases`), el("p", "", "Click draft fields to edit them. Confirm application-specific rules and expected results before execution."));
      const buttons = el("div", "qa-generator-actions");
      const copyButton = el("button", "path-secondary-button", "Copy cases"); copyButton.type = "button";
      const csvButton = el("button", "path-secondary-button", "Download CSV"); csvButton.type = "button";
      buttons.append(copyButton, csvButton); heading.append(buttons);
      const list = el("div", "qa-generated-case-list");
      const editable = (node, label, fieldName) => {
        node.contentEditable = "true"; node.setAttribute("role", "textbox"); node.setAttribute("aria-label", label);
        node.dataset.editable = fieldName; node.spellcheck = false; return node;
      };
      cases.forEach((item) => {
        const card = el("article", "qa-generated-case");
        const top = el("div", "qa-generated-case-top");
        const titleGroup = el("div"); titleGroup.append(el("span", "qa-case-id", item.id), editable(el("h3", "", item.title), `${item.id} test case title`, "title"));
        top.append(titleGroup, el("span", "qa-case-priority", item.priority)); card.append(top);
        const type = el("p", "qa-case-type", item.type); card.append(type);
        const details = [
          ["Preconditions", item.preconditions, "preconditions"],
          ["Test data", item.data, "data"],
          ["Expected result", item.expected, "expected"]
        ];
        details.forEach(([label, text, fieldName]) => {
          const section = el("div", "qa-case-detail"); section.append(el("strong", "", label), editable(el("p", "", text), `${item.id} ${label}`, fieldName)); card.append(section);
        });
        const steps = el("div", "qa-case-detail"); steps.append(el("strong", "", "Steps"));
        const ordered = el("ol"); item.steps.forEach((step, stepIndex) => ordered.append(editable(el("li", "", step), `${item.id} step ${stepIndex + 1}`, `step-${stepIndex}`))); steps.append(ordered); card.append(steps);
        list.append(card);
      });
      const syncEdits = () => {
        list.querySelectorAll(".qa-generated-case").forEach((card, index) => {
          const item = cases[index];
          const read = (fieldName) => card.querySelector(`[data-editable="${fieldName}"]`)?.innerText.trim() || "";
          item.title = read("title");
          item.preconditions = read("preconditions");
          item.data = read("data");
          item.expected = read("expected");
          item.steps = item.steps.map((_, stepIndex) => read(`step-${stepIndex}`));
        });
      };
      copyButton.addEventListener("click", async () => {
        syncEdits();
        try { await navigator.clipboard.writeText(formatCases(cases)); setStatus("Edited test cases copied to the clipboard."); }
        catch { setStatus("Clipboard access is unavailable. Select and copy the generated test cases manually.", true); }
      });
      csvButton.addEventListener("click", () => {
        syncEdits();
        const url = URL.createObjectURL(new Blob([createCsv(cases)], { type: "text/csv;charset=utf-8" }));
        const download = el("a"); download.href = url; download.download = "manual-test-cases.csv"; download.hidden = true;
        document.body.append(download); download.click(); download.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
      output.replaceChildren(heading, list); output.hidden = false;
      setStatus(`${cases.length} draft cases generated. Review assumptions and expected results before use.`);
      output.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    exampleButton.addEventListener("click", () => {
      feature.value = "Password reset";
      scenario.value = "A registered customer requests a password reset using the email address on their account.";
      expected.value = "A single-use reset link is sent to the registered address and expires after 30 minutes.";
      preconditions.value = "The customer has an active account and access to the test inbox.";
      testData.value = "qa.user@example.test; synthetic test account only.";
      setStatus("Example loaded. Edit it or generate the sample cases.");
      scenario.focus();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        const cases = makeCases({ feature: feature.value.trim(), scenario: scenario.value.trim(), expected: expected.value.trim(), preconditions: preconditions.value.trim(), testData: testData.value.trim() });
        showCases(cases);
      } catch (error) {
        setStatus(error.message, true);
      }
    });
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
  function closeMobileNav() {
    window.closeCourseNavigation();
  }
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
