const allLessons = chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ ...lesson, chapter: chapter.title })));
const progressKey = "sathishram-playwright-progress";
const legacyCompletedKey = "sathishram-playwright-completed";
const savedLessonTitle = localStorage.getItem(progressKey);
const savedLessonIndex = allLessons.findIndex((lesson) => lesson.title === savedLessonTitle);
const previousLessonOrder = allLessons.filter((lesson) =>
  !["Tooltip & text extraction", "Alerts, confirms & prompt dialogs"].includes(lesson.title)
);
let savedCompleted = [];
try {
  const parsed = JSON.parse(localStorage.getItem(legacyCompletedKey) || "[]");
  if (Array.isArray(parsed)) {
    savedCompleted = parsed.map((entry) => {
      const title = Number.isInteger(entry) ? previousLessonOrder[entry]?.title : entry;
      return allLessons.findIndex((lesson) => lesson.title === title);
    }).filter((index) => index >= 0);
  }
} catch (error) {
  console.warn("Saved Playwright completion data could not be read.", error);
}
let savedVariableNames = {};
try {
  const parsed = JSON.parse(localStorage.getItem("sathishram-playwright-variable-names") || "{}");
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) savedVariableNames = parsed;
} catch (error) {
  console.warn("Saved Playwright variable names could not be read.", error);
}
const state = {
  index: savedLessonIndex >= 0 ? savedLessonIndex : 0,
  completed: new Set(savedCompleted),
  variableNames: savedVariableNames,
  quizAnswered: false,
  view: "learn"
};
const byId = (id) => document.getElementById(id);
let flowTimer = null;
let flowPosition = -1;
let currentFlowValues = [];
let currentLesson = null;
let codeTimer = null;
let executionLines = [];
let executionPosition = -1;
let actionExecutionPosition = -1;
const pythonKeywords = new Set(["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"]);
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function saveCourseProgress() {
  localStorage.setItem(progressKey, allLessons[state.index].title);
  localStorage.setItem(legacyCompletedKey, JSON.stringify([...state.completed].map((index) => allLessons[index].title)));
}

function renameIdentifiersInExpression(expression, names) {
  return expression.replace(/(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|[A-Za-z_]\w*)/g, (token) => {
    if (token.startsWith("#") || token.startsWith('"') || token.startsWith("'")) return token;
    return names[token] || token;
  });
}

function renameIdentifiersInCode(source, names) {
  const tokenPattern = /(?:[fFrRuUbB]{1,2})?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|#[^\n]*|[A-Za-z_]\w*/g;
  return source.replace(tokenPattern, (token, offset) => {
    if (token.startsWith("#")) return token;
    const quoteStart = token.search(/["']/);
    if (quoteStart >= 0) {
      const prefix = token.slice(0, quoteStart);
      if (!/[fF]/.test(prefix)) return token;
      const quoted = token.slice(quoteStart);
      return prefix + quoted.replace(/\{([^{}]+)\}/g, (_match, expression) =>
        `{${renameIdentifiersInExpression(expression, names)}}`
      );
    }
    if (source.slice(0, offset).trimEnd().endsWith(".")) return token;
    return names[token] || token;
  });
}

function renameVisualText(value, names) {
  if (typeof value === "string") return value.replace(/\b[A-Za-z_]\w*\b/g, (identifier) => names[identifier] || identifier);
  if (Array.isArray(value)) return value.map((item) => renameVisualText(item, names));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, renameVisualText(item, names)]));
  }
  return value;
}

function lessonWithVariableNames(lesson) {
  const names = state.variableNames[lesson.title] || {};
  return {
    ...lesson,
    code: renameIdentifiersInCode(lesson.code, names),
    visual: renameVisualText(lesson.visual, names)
  };
}

function findVariableNames(source) {
  const found = [];
  const pattern = /^\s*([A-Za-z_]\w*)\s*=(?!=)/gm;
  for (const match of source.matchAll(pattern)) {
    if (!pythonKeywords.has(match[1]) && !found.includes(match[1])) found.push(match[1]);
  }
  return found;
}

function renderVariableNameControls(lesson) {
  const root = byId("variable-name-controls");
  const names = findVariableNames(lesson.code);
  root.replaceChildren();
  root.hidden = names.length === 0;
  if (!names.length) return;
  const heading = document.createElement("strong");
  heading.className = "variable-name-heading";
  heading.textContent = "Customize variable names";
  root.appendChild(heading);
  names.forEach((name) => {
    const label = document.createElement("label");
    label.className = "variable-name-field";
    label.textContent = `Rename “${name}”`;
    const input = document.createElement("input");
    input.type = "text";
    input.value = state.variableNames[lesson.title]?.[name] || name;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", `Rename variable ${name}`);
    input.addEventListener("input", () => {
      const nextName = input.value.trim();
      const namesForLesson = { ...(state.variableNames[lesson.title] || {}) };
      const duplicate = names.some((other) => other !== name && (namesForLesson[other] || other) === nextName);
      const valid = /^[A-Za-z_]\w*$/.test(nextName) && !pythonKeywords.has(nextName) && !duplicate;
      input.setCustomValidity(valid ? "" : "Use a unique, valid Python variable name that is not a keyword.");
      if (!valid) return;
      if (nextName === name) delete namesForLesson[name];
      else namesForLesson[name] = nextName;
      state.variableNames[lesson.title] = namesForLesson;
      localStorage.setItem("sathishram-playwright-variable-names", JSON.stringify(state.variableNames));
      updateLessonWithVariableNames();
    });
    label.appendChild(input);
    root.appendChild(label);
  });
  const help = document.createElement("p");
  help.className = "variable-name-help";
  help.textContent = "Only names can be changed. Code is read-only; invalid names are not applied.";
  root.appendChild(help);
}

function updateLessonWithVariableNames() {
  const lesson = lessonWithVariableNames(allLessons[state.index]);
  byId("lesson-code").innerHTML = highlightCode(lesson.code);
  configureExecutionLines(lesson);
  byId("lesson-output").textContent = lesson.output;
  renderVisual(lesson.visual, lesson);
}

function renderCurriculum(filter = "") {
  const root = byId("curriculum");
  root.innerHTML = "";
  let matches = 0;
  chapters.forEach((chapter) => {
    const lessons = chapter.lessons.map((lesson) => ({ lesson, index: allLessons.findIndex((item) => item.title === lesson.title) }))
      .filter(({ lesson }) => `${lesson.title} ${lesson.category}`.toLowerCase().includes(filter.toLowerCase()));
    if (!lessons.length) return;
    matches += lessons.length;
    const section = document.createElement("section");
    const isActiveChapter = lessons.some(({ lesson }) => lesson.title === allLessons[state.index].title);
    const expanded = window.curriculumAccordionsExpanded === null ? isActiveChapter : window.curriculumAccordionsExpanded;
    section.className = `chapter${expanded ? "" : " closed"}`;
    const toggle = document.createElement("button");
    toggle.className = "chapter-toggle";
    toggle.innerHTML = `<span class="chapter-symbol">${schoolIcon("layers")}</span><span>${escapeHtml(chapter.title)}</span><span class="chevron">⌄</span>`;
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.addEventListener("click", () => {
      window.curriculumAccordionsExpanded = null;
      byId("expand-curriculum").textContent = "Expand all";
      section.classList.toggle("closed");
      toggle.setAttribute("aria-expanded", String(!section.classList.contains("closed")));
    });
    const list = document.createElement("div");
    list.className = "chapter-lessons";
    const subgroups = new Map();
    lessons.forEach((entry) => {
      const name = curriculumSubgroup(entry.lesson.title, true);
      if (!subgroups.has(name)) subgroups.set(name, []);
      subgroups.get(name).push(entry);
    });
    subgroups.forEach((groupLessons, name) => {
      const subgroup = document.createElement("section");
      const subgroupExpanded = window.curriculumAccordionsExpanded === true ||
        (window.curriculumAccordionsExpanded === null && groupLessons.some(({ lesson }) => lesson.title === allLessons[state.index].title));
      subgroup.className = `curriculum-subgroup${subgroupExpanded ? "" : " closed"}`;
      const subgroupToggle = document.createElement("button");
      subgroupToggle.className = "subgroup-toggle";
      subgroupToggle.type = "button";
      subgroupToggle.setAttribute("aria-expanded", String(subgroupExpanded));
      subgroupToggle.innerHTML = `<span>${escapeHtml(name)}</span><small>${groupLessons.length}</small><span class="subgroup-chevron">⌄</span>`;
      subgroupToggle.addEventListener("click", () => {
        window.curriculumAccordionsExpanded = null;
        byId("expand-curriculum").textContent = "Expand all";
        subgroup.classList.toggle("closed");
        subgroupToggle.setAttribute("aria-expanded", String(!subgroup.classList.contains("closed")));
      });
      const subgroupLessons = document.createElement("div");
      subgroupLessons.className = "subgroup-lessons";
      groupLessons.forEach(({ lesson, index }) => {
        const item = document.createElement("button");
        item.className = `lesson-link${index === state.index ? " active" : ""}${state.completed.has(index) ? " completed" : ""}`;
        item.innerHTML = `<span class="lesson-check" aria-hidden="true"></span><span>${escapeHtml(lesson.title)}</span>`;
        item.setAttribute("aria-current", index === state.index ? "page" : "false");
        item.addEventListener("click", () => {
          state.index = index;
          renderLesson();
          closeMobileMenu();
        });
        subgroupLessons.appendChild(item);
      });
      subgroup.append(subgroupToggle, subgroupLessons);
      list.appendChild(subgroup);
    });
    section.append(toggle, list);
    root.appendChild(section);
  });
  byId("curriculum-count").textContent = filter ? String(matches) : String(allLessons.length);
  if (!matches) root.innerHTML = '<div class="empty-state">No lessons match that search. Try another concept.</div>';
}

function highlightCode(source) {
  const pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b(?:class|def|return|if|elif|else|for|in|while|import|from|as|with|try|except|finally|raise|yield|async|await|True|False|None|and|or|not|is|lambda|pass|break|continue|assert)\b|\b\d+(?:\.\d+)?\b|\b(?:print|len|range|list|int|str|super|open|enumerate|zip|map|filter|set|dict|tuple|type|expect|sync_playwright|async_playwright)\b)/g;
  const highlightLine = (line) => {
    let result = "";
    let lastIndex = 0;
    for (const match of line.matchAll(pattern)) {
      result += escapeHtml(line.slice(lastIndex, match.index));
      const token = match[0];
      const className = token.startsWith("#") ? "comment" : token.startsWith('"') || token.startsWith("'") ? "str" : /^\d/.test(token) ? "num" : /^(print|len|range|list|int|str|super|open|enumerate|zip|map|filter|set|dict|tuple|type|expect|sync_playwright|async_playwright)$/.test(token) ? "fn" : "kw";
      result += `<span class="${className}">${escapeHtml(token)}</span>`;
      lastIndex = match.index + token.length;
    }
    return result + escapeHtml(line.slice(lastIndex));
  };
  return source.split("\n").map((line, index) =>
    `<span class="code-line" data-line="${index + 1}"><span class="code-line-number" aria-hidden="true">${index + 1}</span><span class="code-line-content">${highlightLine(line)}</span></span>`
  ).join("");
}

function updateExecutionControls() {
  const running = Boolean(codeTimer);
  byId("code-pause-button").disabled = !running;
  byId("code-previous-button").disabled = executionPosition <= 0;
  byId("code-next-button").disabled = executionPosition >= executionLines.length - 1;
  byId("code-run-button").querySelector(".button-label").textContent = running ? "Running" : executionPosition >= executionLines.length - 1 ? "Run again" : executionPosition < 0 ? "Run" : "Resume";
}

function configureExecutionLines(lesson) {
  executionPosition = -1;
  executionLines = lesson.code.split("\n")
    .map((text, index) => ({ text, lineNumber: index + 1 }))
    .filter(({ text }) => text.trim() && !text.trim().startsWith("#"));
  executionLines.forEach((entry, index) => {
    const line = byId("lesson-code").querySelector(`[data-line="${entry.lineNumber}"]`);
    if (line) line.dataset.executionIndex = String(index);
  });
  actionExecutionPosition = -1;
  executionLines.forEach((entry, index) => {
    if (/\.(?:click|fill|check|uncheck|select_option|hover|drag_to|press|go_back|go_forward|get_attribute|inner_text|text_content)\s*\(|mouse\.(?:down|move|up)\s*\(/.test(entry.text)) {
      actionExecutionPosition = index;
    }
  });
  byId("lesson-code").querySelectorAll(".code-line").forEach((line) => {
    if (!line.dataset.executionIndex) line.dataset.executionIndex = "-1";
  });
  updateExecutionControls();
}

function runCodeStep(index) {
  if (!executionLines.length) return;
  executionPosition = Math.max(0, Math.min(index, executionLines.length - 1));
  document.querySelectorAll("#lesson-code .code-line").forEach((line) => {
    const lineIndex = Number(line.dataset.executionIndex);
    line.classList.toggle("is-current", lineIndex === executionPosition);
    line.classList.toggle("is-passed", lineIndex >= 0 && lineIndex < executionPosition);
  });
  const currentLine = executionLines[executionPosition];
  renderBrowserDemo(currentLesson, 0, 1, currentLine.text.trim(), currentLine.text.trim());
  const lineElement = byId("lesson-code").querySelector(`[data-line="${currentLine.lineNumber}"]`);
  lineElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  const visualIndex = executionLines.length <= 1 ? 0 :
    Math.round(executionPosition / (executionLines.length - 1) * (currentFlowValues.length - 1));
  showFlowStep(visualIndex);
  byId("code-execution-status").textContent = `Running line ${currentLine.lineNumber} of ${executionLines[executionLines.length - 1].lineNumber}: ${currentLine.text.trim()}`;
  const frame = byId("demo-frame");
  const demoMessage = {
    type: "playwright-demo-execution-state",
    lines: executionLines.slice(0, executionPosition + 1).map((entry) => entry.text),
    actionIndex: actionExecutionPosition
  };
  frame.dataset.pendingCodeLine = JSON.stringify(demoMessage);
  if (frame.dataset.loadedLesson === currentLesson.title) {
    frame.contentWindow?.postMessage(demoMessage, "*");
    frame.dataset.pendingCodeLine = "";
  }
  window.setTimeout(scrollDemoToAction, 100);
  if (executionPosition === executionLines.length - 1) {
    if (codeTimer) window.clearInterval(codeTimer);
    codeTimer = null;
    byId("code-execution-status").textContent = `Walkthrough complete · ${executionLines.length} code lines visited.`;
  }
  updateExecutionControls();
}

function pauseCodeRun() {
  if (codeTimer) window.clearInterval(codeTimer);
  codeTimer = null;
  if (executionPosition >= 0 && executionPosition < executionLines.length - 1) {
    byId("code-execution-status").textContent = `Paused at line ${executionLines[executionPosition].lineNumber}. Use Next or Resume to continue.`;
  }
  updateExecutionControls();
}

function startCodeRun() {
  if (codeTimer) return;
  if (flowTimer) window.clearInterval(flowTimer);
  flowTimer = null;
  if (executionPosition >= executionLines.length - 1) {
    executionPosition = -1;
    document.querySelectorAll("#lesson-code .code-line").forEach((line) => line.classList.remove("is-current", "is-passed"));
  }
  if (executionPosition < 0) {
    document.querySelector(".code-card").scrollIntoView({ behavior: "smooth", block: "start" });
    runCodeStep(0);
  }
  if (executionPosition < executionLines.length - 1) {
    codeTimer = window.setInterval(() => {
      if (executionPosition >= executionLines.length - 1) {
        pauseCodeRun();
        return;
      }
      runCodeStep(executionPosition + 1);
    }, 950);
  }
  updateExecutionControls();
}

function showFlowStep(index) {
  const stage = byId("visual-stage");
  const steps = [...stage.querySelectorAll(".simulation-step")];
  if (!steps.length) return;
  flowPosition = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[flowPosition];
  stage.querySelector(".lesson-simulation")?.updateStep(flowPosition);
  byId("flow-step").textContent = `Step ${flowPosition + 1} of ${steps.length} - ${step.dataset.title}`;
  byId("flow-value").textContent = step.dataset.detail || step.dataset.title;
  byId("flow-insight").textContent = currentFlowValues[flowPosition] || step.dataset.detail;
}
function renderBrowserDemo(lesson, index, count, stepTitle, stepDetail) {
  const demo = byId("playwright-browser-demo");
  if (!lesson || !demo) return;
  const workspace = byId("visual-workspace");
  demo.hidden = false;
  const demoUrl = new URL("demo.html", window.location.href);
  demoUrl.searchParams.set("lesson", lesson.title);
  demoUrl.searchParams.set("step", String(index));
  demoUrl.searchParams.set("steps", String(count));
  demoUrl.searchParams.set("stepTitle", stepTitle);
  demoUrl.searchParams.set("stepDetail", stepDetail);
  byId("demo-address").textContent = `tutorial/${demoUrl.pathname.split("/").pop()}${demoUrl.search}`;
  byId("demo-open-link").href = demoUrl.href;
  const frame = byId("demo-frame");
  frame.dataset.step = String(index);
  frame.dataset.steps = String(count);
  frame.dataset.stepTitle = stepTitle;
  frame.dataset.stepDetail = stepDetail;
  const resizeFrameToContent = () => {
    const contentHeight = frame.contentDocument.documentElement.scrollHeight;
    frame.style.height = `${Math.max(430, contentHeight)}px`;
  };
  frame.onload = () => {
    frame.dataset.loadedLesson = frame.dataset.lesson;
    frame.contentWindow.postMessage({
      type: "playwright-demo-step",
      step: Number(frame.dataset.step),
      steps: Number(frame.dataset.steps),
      stepTitle: frame.dataset.stepTitle,
      stepDetail: frame.dataset.stepDetail
    }, "*");
    window.setTimeout(() => {
      resizeFrameToContent();
      scrollDemoToAction();
    }, 80);
    if (frame.dataset.pendingCodeLine) {
      frame.contentWindow.postMessage(JSON.parse(frame.dataset.pendingCodeLine), "*");
      frame.dataset.pendingCodeLine = "";
    }
  };
  if (frame.dataset.lesson !== lesson.title) {
    frame.dataset.lesson = lesson.title;
    frame.src = demoUrl.href;
  } else {
    frame.contentWindow.postMessage({
      type: "playwright-demo-step",
      step: index,
      steps: count,
      stepTitle,
      stepDetail
    }, "*");
    window.setTimeout(resizeFrameToContent, 50);
  }
}

function scrollDemoToAction() {
  const frame = byId("demo-frame");
  const screen = frame.closest(".demo-screen");
  const action = frame.contentDocument?.getElementById("demo-action");
  if (!action || !screen || byId("playwright-browser-demo").hidden) return;
  const frameTop = frame.getBoundingClientRect().top - screen.getBoundingClientRect().top + screen.scrollTop;
  const top = frameTop + action.offsetTop - screen.clientHeight + action.offsetHeight + 24;
  screen.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function closeBrowserDemo() {
  const demo = byId("playwright-browser-demo");
  const workspace = byId("visual-workspace");
  const execution = document.querySelector(".execution-layout");
  if (execution && demo.parentElement !== execution) execution.appendChild(demo);
  if (workspace) workspace.classList.remove("has-demo");
  demo.hidden = true;
  byId("flow-stop-button").hidden = true;
}

function stopFlow() {
  if (flowTimer) window.clearInterval(flowTimer);
  flowTimer = null;
  pauseCodeRun();
  closeBrowserDemo();
  byId("flow-play-button").innerHTML = flowPosition >= currentFlowValues.length - 1
    ? `${schoolIcon("arrow")}<span>Replay simulation</span>`
    : `${schoolIcon("arrow")}<span>Resume simulation</span>`;
}

function advanceFlow() {
  showFlowStep(flowPosition + 1);
  if (flowPosition >= currentFlowValues.length - 1) {
    window.clearInterval(flowTimer);
    flowTimer = null;
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Replay simulation</span>`;
    byId("flow-stop-button").hidden = true;
  }
}

function playFlow() {
  if (flowTimer) {
    window.clearInterval(flowTimer);
    flowTimer = null;
    byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Resume simulation</span>`;
    return;
  }
  if (flowPosition >= currentFlowValues.length - 1) {
    flowPosition = 0;
    byId("visual-stage").querySelectorAll(".simulation-step").forEach((node) => node.classList.remove("flow-current", "flow-passed"));
    showFlowStep(0);
  }
  if (flowPosition < currentFlowValues.length - 1) {
    byId("flow-play-button").innerHTML = `${schoolIcon("collapse")}<span>Pause simulation</span>`;
    byId("flow-stop-button").hidden = false;
    document.querySelector(".visual-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
    flowTimer = window.setInterval(advanceFlow, 1250);
  }
}

function renderVisual(visual, lesson) {
  if (flowTimer) window.clearInterval(flowTimer);
  flowTimer = null;
  if (codeTimer) window.clearInterval(codeTimer);
  codeTimer = null;
  flowPosition = -1;
  currentLesson = lesson;
  closeBrowserDemo();
  const conceptVisual = buildPlaywrightConceptVisual(lesson);
  currentFlowValues = conceptVisual.values;
  byId("visual-stage").replaceChildren(conceptVisual.element);
  conceptVisual.element.addEventListener("flow-values-changed", (event) => {
    currentFlowValues = event.detail;
    if (flowPosition >= 0) showFlowStep(Math.min(flowPosition, currentFlowValues.length - 1));
  });
  byId("visual-stage").querySelectorAll(".simulation-step").forEach((node, index) => {
    node.addEventListener("click", () => {
      if (flowTimer) window.clearInterval(flowTimer);
      flowTimer = null;
      showFlowStep(index);
      byId("flow-stop-button").hidden = false;
      byId("flow-play-button").innerHTML = index === currentFlowValues.length - 1
        ? `${schoolIcon("arrow")}<span>Replay simulation</span>`
        : `${schoolIcon("arrow")}<span>Resume simulation</span>`;
    });
  });
  byId("visual-caption").textContent = visual.caption;
  byId("flow-step").textContent = "Choose a step or run the simulation";
  byId("flow-value").textContent = "Follow the test code through the Playwright API and into the browser.";
  byId("flow-insight").textContent = currentFlowValues[0] || "The explanation for the current step appears here.";
  byId("flow-play-button").innerHTML = `${schoolIcon("arrow")}<span>Run simulation</span>`;
  showFlowStep(0);
}

function renderQuiz(quiz) {
  const options = byId("quiz-options");
  options.replaceChildren();
  byId("quiz-question").textContent = quiz.question;
  byId("quiz-feedback").textContent = "";
  byId("quiz-feedback").className = "quiz-feedback";
  state.quizAnswered = false;
  quiz.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => {
      if (state.quizAnswered) return;
      state.quizAnswered = true;
      const correct = index === quiz.answer;
      button.classList.add(correct ? "correct" : "incorrect");
      if (!correct) options.children[quiz.answer].classList.add("correct");
      const feedback = byId("quiz-feedback");
      feedback.textContent = correct ? "Exactly right — nice work!" : `Not quite. The best answer is: ${quiz.options[quiz.answer]}`;
      if (!correct) feedback.classList.add("wrong");
    });
    options.appendChild(button);
  });
}

function renderCheatSheet(filter = "") {
  const grid = byId("cheat-grid");
  const term = filter.toLowerCase();
  let visibleItems = 0;
  grid.innerHTML = "";
  cheatSheet.forEach((section) => {
    const items = section.items.filter(([title, code]) => `${section.category} ${title} ${code}`.toLowerCase().includes(term));
    if (!items.length) return;
    visibleItems += items.length;
    const card = document.createElement("section");
    card.className = "cheat-card";
    const heading = document.createElement("h2");
    const cardId = `cheat-${section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    heading.innerHTML = `${schoolIcon(schoolIconForSymbol(section.icon))}<span>${escapeHtml(section.category)}</span><button class="cheat-card-toggle" type="button" aria-expanded="${window.allAccordionsExpanded === true}" aria-controls="${cardId}"><span class="section-chevron" aria-hidden="true"></span></button>`;
    const body = document.createElement("div");
    body.className = "cheat-body";
    body.id = cardId;
    body.hidden = window.allAccordionsExpanded !== true;
    heading.querySelector(".cheat-card-toggle").addEventListener("click", (event) => {
      body.hidden = !body.hidden;
      event.currentTarget.setAttribute("aria-expanded", String(!body.hidden));
    });
    card.append(heading, body);
    items.forEach(([title, code]) => {
      const item = document.createElement("div");
      item.className = "cheat-item";
      item.innerHTML = `<div class="cheat-item-top"><span>${escapeHtml(title)}</span><button class="cheat-copy" type="button" data-code="${escapeHtml(code)}">Copy</button></div><pre><code>${escapeHtml(code)}</code></pre>`;
      body.appendChild(item);
    });
    grid.appendChild(card);
  });
  if (!visibleItems) grid.innerHTML = '<div class="resource-empty">No cheat-sheet entries match your search.</div>';
  byId("cheat-count").textContent = `${visibleItems} reference${visibleItems === 1 ? "" : "s"}`;
}

function renderInterviewQuestions() {
  const list = byId("question-list");
  const term = byId("question-search").value.trim().toLowerCase();
  const category = byId("question-category").value;
  const matches = interviewQuestions.map((entry, index) => ({ entry, index })).filter(({ entry }) => {
    const [topic, question, answer] = entry;
    return (!category || topic === category) && `${topic} ${question} ${answer}`.toLowerCase().includes(term);
  });
  list.replaceChildren();
  matches.forEach(({ entry, index }) => {
    const [topic, question, answer] = entry;
    const item = document.createElement("details");
    item.className = "question-item";
    item.open = window.allAccordionsExpanded === true;
    const summary = document.createElement("summary");
    summary.innerHTML = `<span class="question-number">${String(index + 1).padStart(3, "0")}</span><span class="question-text">${escapeHtml(question)}</span><span class="question-category-tag">${escapeHtml(topic)}</span><span class="question-chevron">⌄</span>`;
    const answerText = document.createElement("p");
    answerText.className = "question-answer";
    answerText.textContent = answer;
    item.append(summary, answerText);
    list.appendChild(item);
  });
  if (!matches.length) list.innerHTML = '<div class="resource-empty">No questions match those filters. Try a different search or topic.</div>';
  byId("question-count").textContent = `${matches.length} of ${interviewQuestions.length} questions`;
}

function closeMobileMenu() {
  byId("sidebar").classList.remove("open");
  byId("mobile-scrim").classList.remove("show");
}

function setView(view) {
  document.body.dataset.printView = view;
  byId("resource-accordion").open = view !== "learn";
  const labels = { learn: ["Playwright", allLessons[state.index].chapter], cheatsheet: ["Playwright", "Interview cheat sheet"], interview: ["Playwright", "Interview Q&A"], mock: ["Playwright", "Mock exam"] };
  if (view !== "learn") stopFlow();
  state.view = view;
  document.querySelectorAll(".study-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  byId("lesson-view").hidden = view !== "learn";
  byId("cheatsheet-view").hidden = view !== "cheatsheet";
  byId("interview-view").hidden = view !== "interview";
  byId("mock-exam-view").hidden = view !== "mock";
  byId("curriculum-accordion").hidden = view !== "learn";
  byId("breadcrumb-root").textContent = labels[view][0];
  byId("breadcrumb-topic").textContent = labels[view][1];
  byId("search").closest(".search-box").hidden = view !== "learn";
  if (view === "cheatsheet") renderCheatSheet(byId("cheat-search").value.trim());
  if (view === "interview") renderInterviewQuestions();
  if (view === "mock") window.startMockExam?.();
  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLesson() {
  pauseCodeRun();
  executionPosition = -1;
  if (window.lessonNarrator) window.lessonNarrator.stop();
  const baseLesson = allLessons[state.index];
  const lesson = lessonWithVariableNames(baseLesson);
  saveCourseProgress();
  byId("breadcrumb-topic").textContent = lesson.chapter;
  byId("lesson-category").textContent = lesson.category;
  byId("lesson-duration").textContent = `${lesson.duration} MIN READ`;
  byId("lesson-title").textContent = lesson.title;
  byId("lesson-summary").textContent = lesson.summary;
  byId("lesson-theory").textContent = lesson.theory;
  byId("lesson-analogy").textContent = lesson.analogy;
  byId("lesson-goal").textContent = lesson.goal;
  byId("goal-duration").textContent = String(lesson.duration);
  byId("lesson-code").innerHTML = highlightCode(lesson.code);
  configureExecutionLines(lesson);
  renderVariableNameControls(baseLesson);
  byId("code-execution-status").textContent = "Ready · walkthrough is simulated; Python is not executed.";
  byId("lesson-output").textContent = lesson.output;
  byId("footer-position").textContent = `${String(state.index + 1).padStart(2, "0")} / ${allLessons.length}`;
  byId("prev-button").disabled = state.index === 0;
  byId("next-button").disabled = state.index === allLessons.length - 1;
  const complete = state.completed.has(state.index);
  byId("complete-button").classList.toggle("done", complete);
  byId("complete-button").querySelector(".complete-label").textContent = complete ? "Completed" : "Mark complete";
  renderVisual(lesson.visual, lesson);
  renderQuiz(lesson.quiz);
  renderCurriculum(byId("search").value);
  const progress = Math.round(state.completed.size / allLessons.length * 100);
  byId("course-progress").style.width = `${progress}%`;
  byId("course-progress").parentElement.setAttribute("aria-valuenow", String(progress));
  byId("progress-label").textContent = `${progress}%`;
  byId("lesson-count").textContent = `${state.completed.size} of ${allLessons.length} lessons`;
  window.lessonSectionProgress?.render();
}

function moveLesson(offset) {
  state.index = Math.max(0, Math.min(allLessons.length - 1, state.index + offset));
  renderLesson();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const toast = byId("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

byId("complete-button").addEventListener("click", () => {
  if (window.lessonSectionProgress) {
    window.lessonSectionProgress.setAll(state.index, !state.completed.has(state.index));
    return;
  }
  if (state.completed.has(state.index)) state.completed.delete(state.index);
  else state.completed.add(state.index);
  saveCourseProgress();
  renderLesson();
});
byId("clear-progress-button").addEventListener("click", () => {
  if (!window.confirm("Clear your Playwright course progress? This will remove completed lessons and restart at the first lesson.")) return;
  state.completed.clear();
  window.lessonSectionProgress?.reset();
  state.index = 0;
  localStorage.removeItem(progressKey);
  localStorage.removeItem(legacyCompletedKey);
  localStorage.removeItem("sathishram-playwright-variable-names");
  state.variableNames = {};
  renderLesson();
  showToast("Playwright progress cleared");
});
byId("prev-button").addEventListener("click", () => moveLesson(-1));
byId("next-button").addEventListener("click", () => moveLesson(1));
byId("flow-play-button").addEventListener("click", playFlow);
document.querySelectorAll(".section-collapse-button").forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    window.setLessonSectionExpanded(button, !expanded);
  });
});
byId("flow-stop-button").addEventListener("click", stopFlow);
byId("close-demo-button").addEventListener("click", stopFlow);
byId("code-run-button").addEventListener("click", startCodeRun);
byId("code-pause-button").addEventListener("click", pauseCodeRun);
byId("code-previous-button").addEventListener("click", () => {
  pauseCodeRun();
  runCodeStep(Math.max(0, executionPosition - 1));
});
byId("code-next-button").addEventListener("click", () => {
  pauseCodeRun();
  runCodeStep(executionPosition < 0 ? 0 : executionPosition + 1);
});
byId("search").addEventListener("input", (event) => renderCurriculum(event.target.value.trim()));
byId("expand-curriculum").addEventListener("click", () => {
  window.curriculumAccordionsExpanded = window.curriculumAccordionsExpanded !== true;
  byId("expand-curriculum").textContent = window.curriculumAccordionsExpanded ? "Collapse all" : "Expand all";
  renderCurriculum(byId("search").value.trim());
});
document.querySelectorAll(".study-tab").forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
byId("cheat-search").addEventListener("input", (event) => renderCheatSheet(event.target.value.trim()));
byId("question-search").addEventListener("input", renderInterviewQuestions);
byId("question-category").addEventListener("change", renderInterviewQuestions);
byId("print-cheatsheet").addEventListener("click", () => {
  const search = byId("cheat-search"); const query = search.value;
  search.value = ""; renderCheatSheet(""); document.body.dataset.printView = "cheatsheet";
  window.addEventListener("afterprint", () => { search.value = query; renderCheatSheet(query.trim()); document.body.dataset.printView = state.view; }, { once: true });
  window.print();
});
byId("cheat-grid").addEventListener("click", async (event) => {
  const button = event.target.closest(".cheat-copy");
  if (!button) return;
  try {
    await navigator.clipboard.writeText(button.dataset.code);
    showToast("Snippet copied to clipboard");
  } catch (error) {
    showToast("Clipboard access isn't available in this browser");
  }
});
byId("copy-button").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lessonWithVariableNames(allLessons[state.index]).code);
    showToast("Code copied to clipboard");
  } catch (error) {
    showToast("Clipboard access isn't available in this browser");
  }
});
byId("menu-button").addEventListener("click", () => {
  byId("sidebar").classList.add("open");
  byId("mobile-scrim").classList.add("show");
});
byId("mobile-scrim").addEventListener("click", closeMobileMenu);
document.querySelectorAll(".aside-link").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  document.querySelectorAll(".aside-link").forEach((item) => item.classList.remove("active"));
  link.classList.add("active");
  const targets = { idea: ".concept-card", visual: ".visual-card", code: ".code-card", practice: ".practice-card" };
  document.querySelector(targets[link.getAttribute("href").slice(1)]).scrollIntoView({ behavior: "smooth", block: "start" });
}));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    byId(state.view === "cheatsheet" ? "cheat-search" : state.view === "interview" ? "question-search" : state.view === "mock" ? "mock-answer" : "search").focus();
  }
  if (byId("lesson-view").hidden || document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "SELECT") return;
  if (event.key === "ArrowRight") moveLesson(1);
  if (event.key === "ArrowLeft") moveLesson(-1);
});

if (allLessons.length !== 44) throw new Error(`Expected 44 Playwright lessons, found ${allLessons.length}`);
if (interviewQuestions.length !== 100) throw new Error(`Expected 100 Playwright questions, found ${interviewQuestions.length}`);
new Set(interviewQuestions.map(([category]) => category)).forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  byId("question-category").appendChild(option);
});
window.lessonSectionProgress = window.createLessonSectionProgress({
  course: "playwright",
  getIndex: () => state.index,
  getCompleted: () => state.completed,
  setCompleted: (value) => { state.completed = value; },
  saveCompleted: () => saveCourseProgress(),
  onChange: () => renderLesson()
});
window.lessonNarrator = setupLessonAudio(() => allLessons[state.index], true);
renderLesson();
renderCheatSheet();

